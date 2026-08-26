# chat-worker

Backend for the "Chat with me" widget on zakriyaparacha.com. A single Cloudflare
Worker that holds the Gemini API key server-side, grounds every answer in
`src/knowledge.js`, and enforces the guardrails in `src/prompt.js`.

This folder deploys separately from the main site — the static site keeps
living on GitHub Pages untouched; this is just one small API endpoint that
`js/chat.js` calls.

## One-time setup

1. **Get a free Gemini API key** — go to https://aistudio.google.com/apikey,
   sign in, click "Create API key" → "Create API key in new project". No
   billing account needed. Copy the key; don't commit it anywhere.

2. **Install dependencies**

   ```
   cd chat-worker
   npm install
   ```

3. **Log in to Cloudflare** (opens a browser to sign in / sign up, free, no card)

   ```
   npx wrangler login
   ```

4. **Store the Gemini key as a Worker secret** (never goes in code or git)

   ```
   npx wrangler secret put GEMINI_API_KEY
   ```

   Paste the key when prompted.

5. **Deploy**

   ```
   npx wrangler deploy
   ```

   Wrangler prints the live URL, something like
   `https://zakriya-chat.<your-subdomain>.workers.dev`.

6. **Wire up the frontend** — open `../js/chat.js` and set `CHAT_API_URL` to
   that URL (with `/` or whatever path you deployed to — this Worker responds
   on its root path, so the URL above is the whole thing). Commit and push
   the site as usual; GitHub Pages redeploys it.

## Local development

```
npx wrangler dev
```

Runs the Worker locally (prints a `localhost` URL). Point `CHAT_API_URL` in
`js/chat.js` at that local URL temporarily while testing, and add
`http://localhost:8000` (or whatever you serve the site on) to
`ALLOWED_ORIGIN` in `wrangler.toml` — or just test with `curl`:

```
curl -X POST http://localhost:8787/ \
  -H "Content-Type: application/json" \
  -d '{"message": "What backend work has Zakriya done?"}'
```

`wrangler dev` reads secrets from a local `.dev.vars` file (gitignored) if
you don't want to use the real deployed secret while developing:

```
echo "GEMINI_API_KEY=your-key-here" > .dev.vars
```

## Updating the knowledge base

Edit `src/knowledge.js` — it's a plain array of `{ title, text }` chunks.
Redeploy with `npx wrangler deploy` for changes to take effect. This is also
the file that would get chunked/embedded first if this later grows into a
full RAG pipeline (Cloudflare Vectorize + Workers AI embeddings).

## Guardrails

Enforced in two layers:

- **Prompt-level** (`src/prompt.js`): scope restriction to Zakriya's
  background, refusal of off-topic requests and prompt-injection attempts,
  no fabrication beyond `knowledge.js`, no phone number.
- **Server-level** (`src/index.js`): input length cap, conversation history
  cap, CORS locked to `ALLOWED_ORIGIN`, and a best-effort per-IP rate limit
  (in-memory, resets on isolate recycle — a speed bump backstopped by
  Gemini's own free-tier rate limits, not a hard guarantee across all edge
  locations; Cloudflare KV/Durable Objects would make it a real shared
  counter if abuse ever becomes a problem).
