import { knowledgeAsText } from "./knowledge.js";
import { buildSystemPrompt } from "./prompt.js";

const SYSTEM_PROMPT = buildSystemPrompt(knowledgeAsText());

const MAX_MESSAGE_LENGTH = 500;
const MAX_HISTORY_TURNS = 6; // last N turns kept, older ones dropped
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 8; // per IP per window, best-effort (see note below)

// Best-effort in-memory rate limit. Resets whenever this Worker isolate is
// recycled, and isn't shared across Cloudflare's edge locations, so it's not
// a hard guarantee — it's a speed bump against casual abuse, backstopped by
// Gemini's own free-tier rate limits. Upgrading this to Cloudflare KV or
// Durable Objects (for a real shared counter) is a natural follow-up.
const requestLog = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const timestamps = (requestLog.get(ip) || []).filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS
  );
  timestamps.push(now);
  requestLog.set(ip, timestamps);
  return timestamps.length > RATE_LIMIT_MAX_REQUESTS;
}

function corsHeaders(env) {
  return {
    "Access-Control-Allow-Origin": env.ALLOWED_ORIGIN,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

function jsonResponse(body, status, env) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders(env),
    },
  });
}

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders(env) });
    }

    if (request.method !== "POST") {
      return jsonResponse({ error: "Method not allowed" }, 405, env);
    }

    const ip = request.headers.get("CF-Connecting-IP") || "unknown";
    if (isRateLimited(ip)) {
      return jsonResponse(
        { error: "Too many requests, please slow down and try again shortly." },
        429,
        env
      );
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return jsonResponse({ error: "Invalid JSON body" }, 400, env);
    }

    const message = typeof body.message === "string" ? body.message.trim() : "";
    if (!message) {
      return jsonResponse({ error: "message is required" }, 400, env);
    }
    if (message.length > MAX_MESSAGE_LENGTH) {
      return jsonResponse(
        { error: `message must be ${MAX_MESSAGE_LENGTH} characters or fewer` },
        400,
        env
      );
    }

    const history = Array.isArray(body.history) ? body.history : [];
    const trimmedHistory = history
      .filter(
        (turn) =>
          turn &&
          (turn.role === "user" || turn.role === "model") &&
          typeof turn.text === "string"
      )
      .slice(-MAX_HISTORY_TURNS)
      .map((turn) => ({
        role: turn.role,
        parts: [{ text: turn.text.slice(0, MAX_MESSAGE_LENGTH) }],
      }));

    const contents = [
      ...trimmedHistory,
      { role: "user", parts: [{ text: message }] },
    ];

    const model = env.GEMINI_MODEL || "gemini-2.0-flash";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${env.GEMINI_API_KEY}`;

    let geminiResponse;
    try {
      geminiResponse = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents,
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 400,
          },
        }),
      });
    } catch {
      return jsonResponse(
        { error: "Couldn't reach the AI service, please try again shortly." },
        502,
        env
      );
    }

    if (!geminiResponse.ok) {
      const status = geminiResponse.status === 429 ? 429 : 502;
      const message =
        status === 429
          ? "The assistant is getting a lot of questions right now, please try again in a minute."
          : "The AI service returned an error, please try again shortly.";
      return jsonResponse({ error: message }, status, env);
    }

    const data = await geminiResponse.json();
    const reply =
      data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") ||
      "Sorry, I couldn't generate a response just then — please try again.";

    return jsonResponse({ reply }, 200, env);
  },
};
