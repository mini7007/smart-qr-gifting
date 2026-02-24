(function () {
  if (typeof API_BASE !== 'string') return;

  const MAX_TRIES = 3;

  const root = document.createElement('section');
  root.className = 'mini-panda-widget';
  root.innerHTML = `
    <button class="mini-panda-fab" aria-label="Open Mini Panda assistant">🐼</button>
    <div class="mini-panda-panel" hidden>
      <header class="mini-panda-header">
        <strong>Mini Panda</strong>
        <small class="mini-panda-tries">3 tries left</small>
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
  const triesLabel = root.querySelector('.mini-panda-tries');

  function usedTries() {
    return Number(sessionStorage.getItem('panda_tries') || 0);
  }

  function syncTries() {
    const left = Math.max(0, MAX_TRIES - usedTries());
    triesLabel.textContent = `${left} tries left`;
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
      return '🐼 Mini Panda is taking a bamboo break. Try again!';
    }
  }

  fab.addEventListener('click', () => {
    const isHidden = panel.hidden;
    panel.hidden = !isHidden;
    fab.classList.toggle('active', isHidden);
    if (isHidden) input.focus();
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const message = input.value.trim();

    if (!message) return;

    const used = usedTries();
    if (used >= MAX_TRIES) {
      showPandaMessage('🐼 Free tries finished!');
      return;
    }

    sessionStorage.setItem('panda_tries', String(used + 1));
    syncTries();

    input.value = '';
    showPandaMessage(message, 'user');
    setTyping(true);

    const reply = await askMiniPanda(message);

    setTyping(false);
    showPandaMessage(reply, 'assistant');
  });

  syncTries();
})();
