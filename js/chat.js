// "Chat with me" widget. Talks to the chat-worker Cloudflare Worker (see
// /chat-worker) which holds the Gemini API key server-side and grounds
// answers in Zakriya's background. This script builds its own DOM so it
// only needs to be included once per page, not hand-copied into every file.

// TODO: replace with the deployed Worker URL from `npx wrangler deploy`
// (see chat-worker/README.md). Until this is set, the widget will show a
// friendly "not configured yet" error instead of failing silently.
const CHAT_API_URL = "https://REPLACE_WITH_WORKER_URL.workers.dev";

const MAX_MESSAGE_LENGTH = 500;

(function () {
  if (document.getElementById("chat-widget-root")) return;

  const history = [];
  let sending = false;

  const root = document.createElement("div");
  root.id = "chat-widget-root";
  root.innerHTML = `
    <button id="chat-toggle" aria-expanded="false" aria-controls="chat-panel" aria-label="Chat with me">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M4 4h16v12H8l-4 4V4z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
      </svg>
    </button>
    <div id="chat-panel" role="dialog" aria-label="Chat with me" aria-hidden="true">
      <div id="chat-panel-header">
        <span><span class="bracket">&lt;</span>chat with me<span class="bracket">/&gt;</span></span>
        <button id="chat-close" aria-label="Close chat">&times;</button>
      </div>
      <div id="chat-messages" role="log" aria-live="polite"></div>
      <form id="chat-form">
        <input id="chat-input" type="text" placeholder="Ask about Zakriya's skills or experience..." maxlength="${MAX_MESSAGE_LENGTH}" autocomplete="off" />
        <button id="chat-send" type="submit" aria-label="Send">&#8594;</button>
      </form>
      <div id="chat-disclaimer">AI-generated, may not always be accurate. Grounded only in Zakriya's own resume and site content.</div>
    </div>
  `;
  document.body.appendChild(root);

  const toggleBtn = document.getElementById("chat-toggle");
  const closeBtn = document.getElementById("chat-close");
  const panel = document.getElementById("chat-panel");
  const messagesEl = document.getElementById("chat-messages");
  const form = document.getElementById("chat-form");
  const input = document.getElementById("chat-input");

  function addMessage(role, text) {
    const bubble = document.createElement("div");
    bubble.className = `chat-bubble chat-bubble-${role}`;
    bubble.textContent = text;
    messagesEl.appendChild(bubble);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return bubble;
  }

  function openPanel() {
    panel.classList.add("open");
    panel.setAttribute("aria-hidden", "false");
    toggleBtn.setAttribute("aria-expanded", "true");
    if (!messagesEl.childElementCount) {
      addMessage(
        "model",
        "Hi! Ask me anything about Zakriya's skills, experience, or projects."
      );
    }
    input.focus();
  }

  function closePanel() {
    panel.classList.remove("open");
    panel.setAttribute("aria-hidden", "true");
    toggleBtn.setAttribute("aria-expanded", "false");
    toggleBtn.focus();
  }

  toggleBtn.addEventListener("click", () => {
    panel.classList.contains("open") ? closePanel() : openPanel();
  });
  closeBtn.addEventListener("click", closePanel);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && panel.classList.contains("open")) closePanel();
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const message = input.value.trim();
    if (!message || sending) return;

    if (CHAT_API_URL.includes("REPLACE_WITH_WORKER_URL")) {
      addMessage("user", message);
      addMessage(
        "model",
        "This chat isn't wired up to a backend yet — CHAT_API_URL still needs to be set in js/chat.js."
      );
      input.value = "";
      return;
    }

    sending = true;
    input.value = "";
    addMessage("user", message);
    const thinking = addMessage("model", "...");
    thinking.classList.add("chat-bubble-thinking");

    try {
      const res = await fetch(CHAT_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, history }),
      });
      const data = await res.json();
      thinking.remove();

      if (!res.ok) {
        addMessage("model", data.error || "Something went wrong, please try again.");
      } else {
        addMessage("model", data.reply);
        history.push({ role: "user", text: message });
        history.push({ role: "model", text: data.reply });
      }
    } catch {
      thinking.remove();
      addMessage("model", "Couldn't reach the chat service — check your connection and try again.");
    } finally {
      sending = false;
      input.focus();
    }
  });
})();
