export function mountLoginHandlers() {
  if (localStorage.getItem('auth')) {
    // déjà connecté -> pas de formulaire
    location.replace('#dashboard');
    return;
  }
  const form = document.getElementById('loginForm') as HTMLFormElement | null;
  if (!form) return;
  const msg = document.getElementById('loginMsg') as HTMLParagraphElement | null;
  const btn = form.querySelector('button[type="submit"]') as HTMLButtonElement | null;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    btn && (btn.disabled = true);

    const data = new FormData(form);
    const payload = {
      username: String(data.get('username') || '').trim(),
      password: String(data.get('password') || ''),
    };

    if (!payload.username || !payload.password) {
      msg && (msg.textContent = 'Champs requis.');
      btn && (btn.disabled = false);
      return;
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok || !body.ok) {
        msg && (msg.textContent = body.error || `Erreur ${res.status}`);
        btn && (btn.disabled = false);
        return;
      }
      localStorage.setItem('auth', JSON.stringify(body.user));
      // NOUVEAU signale au layout que l’état a changé
      window.dispatchEvent(new CustomEvent('auth:changed'));
      msg && (msg.textContent = 'Connexion réussie !');
      setTimeout(() => { location.hash = '#dashboard'; }, 600);
    } catch (err: any) {
      msg && (msg.textContent = err?.message || 'Erreur réseau');
      btn && (btn.disabled = false);
    }
  }, { once: true });
}