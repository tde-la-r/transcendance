type AuthUser = { id?: number; email?: string; username?: string; alias?: string; avatar_url?: string };

function getUser(): AuthUser | null {
  try { return JSON.parse(localStorage.getItem('auth') || 'null'); } catch { return null; }
}
function setUser(u: AuthUser) {
  localStorage.setItem('auth', JSON.stringify(u));
  window.dispatchEvent(new CustomEvent('auth:changed'));
}

export function mountProfileHandlers() {
  const form = document.getElementById('profileForm') as HTMLFormElement | null;
  const msg  = document.getElementById('profileMsg') as HTMLParagraphElement | null;
  const cancel = document.getElementById('profileCancel') as HTMLButtonElement | null;
  const avatarPreview = document.getElementById('profileAvatarPreview') as HTMLImageElement | null;
  if (!form) return;

  // guard: page protégée — si pas connecté, on renvoie au login
  const user = getUser();
  if (!user) { location.replace('#login'); return; }

  // éviter double-binding si réinjection
  if (form.dataset.bound === '1') return;
  form.dataset.bound = '1';

  // pré-remplir
  (form.elements.namedItem('email') as HTMLInputElement).value = user.email ?? '';
  (form.elements.namedItem('username') as HTMLInputElement).value = user.username ?? '';
  (form.elements.namedItem('alias') as HTMLInputElement).value = user.alias ?? '';
  (form.elements.namedItem('avatar_url') as HTMLInputElement).value = user.avatar_url ?? '';
  if (avatarPreview && user.avatar_url) avatarPreview.src = user.avatar_url;

  // aperçu live avatar
  form.elements.namedItem('avatar_url')?.addEventListener('input', (e) => {
    const v = (e.target as HTMLInputElement).value.trim();
    if (avatarPreview) avatarPreview.src = v || '/assets/login.png';
  });

  // annuler → retour dashboard
  if (cancel) cancel.onclick = () => history.length ? history.back() : (location.hash = '#dashboard');

  // submit
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement | null;
    submitBtn && (submitBtn.disabled = true);

    const data = new FormData(form);
    const payload = {
      email: String(data.get('email') || '').trim(),            // read-only côté UI
      username: String(data.get('username') || '').trim(),
      alias: String(data.get('alias') || '').trim(),
      avatar_url: String(data.get('avatar_url') || '').trim(),
    };

    // validations rapides (côté front)
    if (!payload.username) { msg && (msg.textContent = 'Le nom d’utilisateur est requis.'); submitBtn && (submitBtn.disabled = false); return; }
    if (payload.avatar_url && !/^https?:\/\//i.test(payload.avatar_url)) {
      msg && (msg.textContent = 'URL d’avatar invalide.');
      submitBtn && (submitBtn.disabled = false);
      return;
    }

    try {
      // === FRONT-ONLY pour l’instant ===
      const updated = { ...user, ...payload };
      setUser(updated);
      msg && (msg.textContent = 'Profil mis à jour (local).');

      // (Plus tard) Exemple d’API minimalistes côté back :
      // await fetch('/api/users/alias',  { method: 'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ userId: user.id, alias: payload.alias }) });
      // await fetch('/api/users/avatar', { method: 'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ userId: user.id, avatarUrl: payload.avatar_url }) });
      // await fetch('/api/users/username',{ method: 'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ userId: user.id, username: payload.username }) });

      setTimeout(() => { location.hash = '#dashboard'; }, 600);
    } catch (err: any) {
      console.error(err);
      msg && (msg.textContent = err?.message || 'Erreur inattendue');
    } finally {
      submitBtn && (submitBtn.disabled = false);
    }
  });
}