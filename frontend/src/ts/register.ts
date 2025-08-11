export function mountRegisterHandlers() {
  const form = document.getElementById('registerForm') as HTMLFormElement | null;
  if (!form) return;

  const msg = document.getElementById('registerMsg') as HTMLParagraphElement | null;
  const submitBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement | null;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    submitBtn && (submitBtn.disabled = true);

    const data = new FormData(form);
    const payload = {
      email: String(data.get('email') || '').trim(),
      username: String(data.get('username') || '').trim(),
      password: String(data.get('password') || ''),
    };

    if (!payload.email || !payload.username || !payload.password) {
      msg && (msg.textContent = 'Tous les champs sont requis.');
      submitBtn && (submitBtn.disabled = false);
      return;
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        msg && (msg.textContent = body.error || `Erreur ${res.status}`);
        submitBtn && (submitBtn.disabled = false);
        return;
      }

      msg && (msg.textContent = 'Compte créé ! Redirection…');
      setTimeout(() => { location.hash = '#login'; }, 700);
    } catch (err: any) {
      msg && (msg.textContent = err?.message || 'Erreur réseau');
      submitBtn && (submitBtn.disabled = false);
    }
  }, { once: true });
}