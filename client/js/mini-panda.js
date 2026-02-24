(function () {
  if (!window.fetchJson) return;

  const state = window.smartQRAIState || (window.smartQRAIState = {
    triesUsed: 0,
    theme: null,
    lastMessages: []
  });

  const root = document.createElement('section');
  root.className = 'mini-panda';
  root.innerHTML = `
    <button class="mini-panda__fab" aria-label="Open Mini Panda assistant">🐼</button>
    <div class="mini-panda__panel" hidden>
      <header>
        <strong>Mini Panda</strong>
        <small class="mini-panda__tries">3 tries left</small>
      </header>
      <div class="mini-panda__messages" aria-live="polite"></div>
      <div class="mini-panda__suggestions">
        <button type="button" data-suggestion="Help me write a birthday wish">🎂</button>
        <button type="button" data-suggestion="Suggest a romantic gift message">💌</button>
        <button type="button" data-suggestion="Festival greeting ideas">✨</button>
      </div>
      <form class="mini-panda__composer">
        <input type="text" maxlength="500" placeholder="Ask Mini Panda..." />
        <button type="submit">Send</button>
      </form>
      <p class="mini-panda__notice" hidden></p>
    </div>
  `;
  document.body.appendChild(root);

  const fab = root.querySelector('.mini-panda__fab');
  const panel = root.querySelector('.mini-panda__panel');
  const messages = root.querySelector('.mini-panda__messages');
  const form = root.querySelector('.mini-panda__composer');
  const input = form.querySelector('input');
  const tries = root.querySelector('.mini-panda__tries');
  const notice = root.querySelector('.mini-panda__notice');

  function syncTries() {
    const left = Math.max(0, 3 - (state.triesUsed || 0));
    tries.textContent = `${left} tries left`;
    notice.hidden = left !== 0;
    notice.textContent = left === 0 ? 'Session limit reached (3/3).' : '';
  }

  function addMessage(text, role) {
    const el = document.createElement('div');
    el.className = `mini-panda__msg mini-panda__msg--${role}`;
    el.textContent = text;
    messages.appendChild(el);
    messages.scrollTop = messages.scrollHeight;
  }

  function setTyping(on) {
    const existing = messages.querySelector('.mini-panda__typing');
    if (!on) {
      if (existing) existing.remove();
      return;
    }
    if (existing) return;
    const typing = document.createElement('div');
    typing.className = 'mini-panda__typing';
    typing.textContent = 'Mini Panda is typing...';
    messages.appendChild(typing);
  }

  fab.addEventListener('click', function () {
    const isHidden = panel.hidden;
    panel.hidden = !isHidden;
    fab.classList.toggle('active', isHidden);
    if (isHidden) input.focus();
  });

  root.querySelectorAll('[data-suggestion]').forEach((button) => {
    button.addEventListener('click', () => {
      input.value = button.dataset.suggestion;
      form.requestSubmit();
    });
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const message = input.value.trim();
    if (!message) return;
    if ((state.triesUsed || 0) >= 3) {
      syncTries();
      return;
    }

    input.value = '';
    addMessage(message, 'user');
    setTyping(true);

    try {
      const payload = {
        message,
        theme: state.theme || document.getElementById('themeSelect')?.value || 'default'
      };
      const data = await fetchJson('/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      state.triesUsed = data.triesUsed || state.triesUsed;
      state.lastMessages = [...(state.lastMessages || []), { role: 'user', text: message }, { role: 'assistant', text: data.reply }].slice(-12);
      addMessage(data.reply || '✨', 'assistant');
    } catch (error) {
      addMessage(error.message || 'Mini Panda is unavailable right now.', 'error');
      if (/limit/i.test(error.message || '')) {
        state.triesUsed = 3;
      }
    } finally {
      setTyping(false);
      syncTries();
    }
  });

  syncTries();
})();
