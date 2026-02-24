(function () {
  if (typeof API_BASE !== 'string') return;

  const PANDA_STATE_KEY = 'miniPandaOpen';

  const root = document.createElement('section');
  root.id = 'miniPandaWidget';
  root.className = 'mini-panda-widget';
  root.innerHTML = `
    <button class="mini-panda-fab" aria-label="Open Mini Panda assistant" aria-expanded="false">🐼 Mini Panda</button>
    <div class="mini-panda-panel" hidden>
      <header class="mini-panda-header">
        <strong>Mini Panda</strong>
        <small class="mini-panda-status">Always here ✨</small>
      </header>
      <div class="mini-panda-messages" aria-live="polite"></div>
      <form class="mini-panda-composer">
        <input type="text" maxlength="500" placeholder="Ask Mini Panda..." />
        <button type="submit" class="btn-primary">Send</button>
      </form>
    </div>
  `;

  document.body.appendChild(root);

  const fab = root.querySelector('.mini-panda-fab');
  const panel = root.querySelector('.mini-panda-panel');
  const messages = root.querySelector('.mini-panda-messages');
  const form = root.querySelector('.mini-panda-composer');
  const input = form.querySelector('input');

  function savePandaState(isOpen) {
    localStorage.setItem(PANDA_STATE_KEY, isOpen ? '1' : '0');
  }

  function loadPandaState() {
    return localStorage.getItem(PANDA_STATE_KEY) === '1';
  }

  function showPandaMessage(text, role = 'assistant') {
    const el = document.createElement('div');
    el.className = `mini-panda-msg mini-panda-msg--${role}`;
    el.textContent = text;
    messages.appendChild(el);
    messages.scrollTop = messages.scrollHeight;
  }

  function setTyping(on) {
    const existing = messages.querySelector('.mini-panda-typing');
    if (!on) {
      if (existing) existing.remove();
      return;
    }

    if (existing) return;
    const typing = document.createElement('div');
    typing.className = 'mini-panda-typing';
    typing.textContent = 'Mini Panda is typing...';
    messages.appendChild(typing);
    messages.scrollTop = messages.scrollHeight;
  }

  function openPanda() {
    panel.hidden = false;
    fab.classList.add('active');
    fab.setAttribute('aria-expanded', 'true');
    savePandaState(true);
    input.focus();
  }

  function closePanda() {
    panel.hidden = true;
    fab.classList.remove('active');
    fab.setAttribute('aria-expanded', 'false');
    savePandaState(false);
  }

  async function askMiniPanda(message) {
    try {
      const res = await fetch(`${API_BASE}/api/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message })
      });

      if (!res.ok) throw new Error('AI request failed');

      const data = await res.json();
      return data.reply;
    } catch (err) {
      console.error(err);
      return 'Mini Panda is thinking… try again in a moment 🐼';
    }
  }

  fab.addEventListener('click', () => {
    if (panel.hidden) {
      openPanda();
      return;
    }
    closePanda();
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const message = input.value.trim();

    if (!message) return;

    input.value = '';
    showPandaMessage(message, 'user');
    setTyping(true);

    const reply = await askMiniPanda(message);

    setTyping(false);
    showPandaMessage(reply, 'assistant');
  });

  if (loadPandaState()) {
    openPanda();
  }
})();
