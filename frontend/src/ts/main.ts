// import "../style.css";
// import "../output.css";
// // import { laodDashboard } from "./dashboard";
// import { mountRegisterHandlers } from "./register";
// import { mountLoginHandlers } from "./login";
// import { laodDashboard, paintDashboardUsername } from './dashboard';


// const routes: { [key: string]: string} = {
//     home: 'home.html',
//     login: 'login.html',
//     register: 'register.html',
// }

// async function loadLayout() {
//   const layoutResp = await fetch('./src/pages/layout.html');
//   const layoutHtml = await layoutResp.text();
//   document.body.innerHTML = layoutHtml;
// }

// document.addEventListener('click', (e) => {
//   const target = e.target as HTMLElement;
//   const btn = target.closest('#logoutBtn');
//   if (!btn) return;

//   e.preventDefault();
//   localStorage.removeItem('auth');
//   closeAuthDropdown();
//   setupAuthMenu();
//   location.hash = '#login';
// });

// // async function loadPage(hash: string)
// // {
// export async function loadPage(_hash?: string) {
//     const page = getPageFromHash();

//     // 🔒 Guards avant tout fetch/injection
//     if (protectedPages.has(page) && !isAuthed()) {
//       location.replace('#login');
//       return;
//     }
//     if (authOnlyForbidden.has(page) && isAuthed()) {
//       location.replace('#dashboard');
//       return;
//     }
//     const raw = location.hash.slice(1);
//     // const page = raw.replace('.html', '') || 'home';

//     if (page === 'logout') {
//       localStorage.removeItem('auth');
//       // updateNavAuth();
//       setupAuthMenu();
//       location.hash = '#login';
//       return;
//     }

//     if (protectedPages.has(page) && !isAuthed()) {
//       location.hash = '#login';
//       return;
//     }

//     const pageRes = await fetch(`./src/pages/${page}.html`);
//     const pageHtml = await pageRes.text();

//     const app = document.getElementById('app');
//     if (app) app.innerHTML = pageHtml;

//     if (page === 'dashboard') {
//       laodDashboard();
//       paintDashboardUsername();
//     }

//     if(page === 'register') {
//       mountRegisterHandlers();
//     }

//     if(page === 'login') {
//       mountLoginHandlers();
//     }

//     // updateNavAuth();
//     setupAuthMenu();
// }


// window.addEventListener('hashchange', () => {
//     // updateNavAuth();
//     setupAuthMenu();
//     const hash = location.hash.replace('#', '');
//     loadPage(hash);
// });

// window.addEventListener('DOMContentLoaded', async () => {
//   await loadLayout();
//   setupLangDropdown();
//   await loadPage('home');
// });

// function setupLangDropdown() {
//   const langBtn = document.getElementById("lang-btn");
//   const langMenu = document.getElementById("lang-menu");

//   if (langBtn && langMenu) {
//     langBtn.addEventListener("click", (e) => {
//       e.stopPropagation();
//       langMenu.classList.toggle("hidden");
//     });

//     document.addEventListener("click", () => {
//       langMenu.classList.add("hidden");
//     });

//     langMenu.querySelectorAll("button").forEach((btn) => {
//       btn.addEventListener("click", (e) => {
//         const selectedLang = (e.target as HTMLElement).dataset.lang;
//         console.log("Langue sélectionnée :", selectedLang);
//       });
//     });
//   }
// }

// // const protectedPages = new Set(['dashboard', 'play']);

// // function isAuthed() {
// //   return !!localStorage.getItem('auth');
// // }

// const protectedPages = new Set(['dashboard', 'play']); // pages qui exigent d'être connecté
// const authOnlyForbidden = new Set(['login', 'register']); // pages interdites si déjà connecté

// function isAuthed(): boolean {
//   try {
//     const raw = localStorage.getItem('auth');
//     return !!raw && !!JSON.parse(raw);
//   } catch {
//     return false;
//   }
// }

// function getPageFromHash(): string {
//   const raw = location.hash.slice(1);
//   return raw.replace('.html', '') || 'home';
// }

// // New function
// function closeAuthDropdown() {
//   const btn = document.getElementById('authBtn');
//   const menu = document.getElementById('authDropdown');
//   if (btn) btn.setAttribute('aria-expanded', 'false');
//   if (menu) menu.classList.add('hidden');
// }

// // function updateNavAuth() {
// //   const auth = localStorage.getItem('auth');
// //   const user = auth ? JSON.parse(auth) : null;
// //   const btn = document.getElementById('authBtn') as HTMLAnchorElement | null;
// //   if (!btn) return;

// //   if (user)
// //   {
// //     btn.setAttribute('href', '#logout');
// //     btn.title = 'Deconnexion';
// //     btn.onclick = (e) => {
// //       e.preventDefault();
// //       localStorage.removeItem('auth');
// //       updateNavAuth();
// //       location.hash = '#login';
// //     };
// //   } else {
// //     btn.setAttribute('href', '#login');
// //     btn.title = 'Connexion';
// //     btn.onclick = null;
// //   }

// // }


// // REWORK DE LA FONCTION updateNavAuth
// function setupAuthMenu() {
//   const btn = document.getElementById('authBtn') as HTMLAnchorElement | null;
//   const menu = document.getElementById('authDropdown') as HTMLDivElement | null;
//   const settings = document.getElementById('settingsLink') as HTMLAnchorElement | null;
//   const logout = document.getElementById('logoutBtn') as HTMLButtonElement | null;
//   if (!btn || !menu) return;

//   const authed = isAuthed();

//   // reset handlers
//   btn.onclick = null;
//   document.removeEventListener('click', outsideCloser);
//   document.removeEventListener('keydown', escCloser);

//   if (!authed) {
//     // mode "non connecté": pas de menu, lien vers #login
//     closeAuthDropdown();
//     btn.setAttribute('href', '#login');
//     btn.title = 'Connexion';
//   } else {
//     // mode "connecté": le bouton toggle le menu
//     btn.setAttribute('href', '#');
//     btn.title = 'Menu du compte';
//     btn.onclick = (e) => {
//       e.preventDefault();
//       const wasOpen = !menu.classList.contains('hidden');
//       if (wasOpen) closeAuthDropdown();
//       else {
//         menu.classList.remove('hidden');
//         btn.setAttribute('aria-expanded', 'true');
//       }
//     };

//     if (settings) {
//       settings.onclick = () => {
//         closeAuthDropdown();
//         location.hash = '#settings';
//       };
//     }

//     if (logout) {
//       logout.onclick = (e) => {
//         e.preventDefault();
//         localStorage.removeItem('auth');
//         closeAuthDropdown();
//         setupAuthMenu();
//         location.hash = '#login';
//       };
//     }

//     // click en dehors + ESC pour fermer
//     document.addEventListener('click', outsideCloser);
//     document.addEventListener('keydown', escCloser);
//   }

//     function outsideCloser(ev: MouseEvent) {
//     const target = ev.target as Node;
//     const wrapper = document.getElementById('authMenu');
//     if (wrapper && !wrapper.contains(target)) closeAuthDropdown();
//   }
//   function escCloser(ev: KeyboardEvent) {
//     if (ev.key === 'Escape') closeAuthDropdown();
//   }
//   window.addEventListener('load', renderAuthBadge);
//   window.addEventListener('hashchange', renderAuthBadge);
//   window.addEventListener('auth:changed', renderAuthBadge);
// }

// function currentUser(): { username: string } | null {
//   try { return JSON.parse(localStorage.getItem('auth') || 'null'); }
//   catch { return null; }
// }

// function renderAuthBadge() {
//   const span = document.getElementById('authUsername');
//   if (!span) return;
//   const user = currentUser();
//   if (user?.username) {
//     span.textContent = user.username;
//     span.classList.remove('hidden');
//   } else {
//     span.textContent = '';
//     span.classList.add('hidden');
//   }
// }

// window.addEventListener('load', () => loadPage());
// window.addEventListener('hashchange', () => loadPage());
// window.addEventListener('auth:changed', () => loadPage());
// window.addEventListener('auth:changed', () => {
//   // si on est sur le dashboard, on repasse une couche
//   if ((location.hash.slice(1).replace('.html','') || 'home') === 'dashboard') {
//     paintDashboardUsername();
//   }
// });

import "../style.css";
import "../output.css";
import { mountRegisterHandlers } from "./register";
import { mountLoginHandlers } from "./login";
import { mountDashboard, laodDashboard, paintDashboardUsername } from "./dashboard";

const protectedPages = new Set(['dashboard', 'play']);
const authOnlyForbidden = new Set(['login', 'register']);

async function loadLayout() {
  const layoutResp = await fetch('./src/pages/layout.html');
  const layoutHtml = await layoutResp.text();
  document.body.innerHTML = layoutHtml;
}

function isAuthed(): boolean {
  try {
    const raw = localStorage.getItem('auth');
    return !!raw && !!JSON.parse(raw);
  } catch {
    return false;
  }
}

function getPageFromHash(): string {
  const raw = location.hash.slice(1);
  return raw.replace('.html', '') || 'home';
}

// Menu auth (existant)
function closeAuthDropdown() {
  const btn = document.getElementById('authBtn');
  const menu = document.getElementById('authDropdown');
  if (btn) btn.setAttribute('aria-expanded', 'false');
  if (menu) menu.classList.add('hidden');
}

function setupAuthMenu() {
  const btn = document.getElementById('authBtn') as HTMLAnchorElement | null;
  const menu = document.getElementById('authDropdown') as HTMLDivElement | null;
  const settings = document.getElementById('settingsLink') as HTMLAnchorElement | null;
  const logout = document.getElementById('logoutBtn') as HTMLButtonElement | null;
  if (!btn || !menu) return;

  const authed = isAuthed();

  // reset
  btn.onclick = null;
  document.removeEventListener('click', outsideCloser);
  document.removeEventListener('keydown', escCloser);

  if (!authed) {
    closeAuthDropdown();
    btn.setAttribute('href', '#login');
    btn.title = 'Connexion';
  } else {
    btn.setAttribute('href', '#');
    btn.title = 'Menu du compte';
    btn.onclick = (e) => {
      e.preventDefault();
      const wasOpen = !menu.classList.contains('hidden');
      if (wasOpen) closeAuthDropdown();
      else {
        menu.classList.remove('hidden');
        btn.setAttribute('aria-expanded', 'true');
      }
    };

    if (settings) {
      settings.onclick = () => {
        closeAuthDropdown();
        location.hash = '#settings';
      };
    }

    if (logout) {
      logout.onclick = (e) => {
        e.preventDefault();
        localStorage.removeItem('auth');
        closeAuthDropdown();
        setupAuthMenu();
        location.hash = '#login';
      };
    }

    document.addEventListener('click', outsideCloser);
    document.addEventListener('keydown', escCloser);
  }

  function outsideCloser(ev: MouseEvent) {
    const target = ev.target as Node;
    const wrapper = document.getElementById('authMenu');
    if (wrapper && !wrapper.contains(target)) closeAuthDropdown();
  }
  function escCloser(ev: KeyboardEvent) {
    if (ev.key === 'Escape') closeAuthDropdown();
  }

  // badge username dans le header
  renderAuthBadge();
}

function currentUser(): { username?: string } | null {
  try { return JSON.parse(localStorage.getItem('auth') || 'null'); }
  catch { return null; }
}

function renderAuthBadge() {
  const span = document.getElementById('authUsername');
  if (!span) return;
  const user = currentUser();
  if (user?.username) {
    span.textContent = user.username;
    span.classList.remove('hidden');
  } else {
    span.textContent = '';
    span.classList.add('hidden');
  }
}

// ---- Router ----
export async function loadPage() {
  const page = getPageFromHash();

  // Guards
  if (protectedPages.has(page) && !isAuthed()) {
    location.replace('#login');
    return;
  }
  if (authOnlyForbidden.has(page) && isAuthed()) {
    location.replace('#dashboard');
    return;
  }

  if (page === 'logout') {
    localStorage.removeItem('auth');
    setupAuthMenu();
    location.hash = '#login';
    return;
  }

  // Fetch & inject
  const pageRes = await fetch(`./src/pages/${page}.html`);
  const pageHtml = await pageRes.text();
  const app = document.getElementById('app');
  if (app) app.innerHTML = pageHtml;

  // Page hooks
  if (page === 'dashboard') {
    // compat: certains endroits appellent encore laodDashboard()
    mountDashboard();
    laodDashboard?.();
    paintDashboardUsername();
  }
  if (page === 'register') mountRegisterHandlers();
  if (page === 'login')    mountLoginHandlers();

  setupAuthMenu();
}

// ---- Global listeners ----
document.addEventListener('click', (e) => {
  const target = e.target as HTMLElement;
  const btn = target.closest('#logoutBtn');
  if (!btn) return;
  e.preventDefault();
  localStorage.removeItem('auth');
  closeAuthDropdown();
  setupAuthMenu();
  location.hash = '#login';
});

window.addEventListener('hashchange', () => {
  setupAuthMenu();
  loadPage();
});

window.addEventListener('DOMContentLoaded', async () => {
  await loadLayout();
  setupLangDropdown();
  await loadPage();
});

// réagit aux changements d’auth (login/logout) pour rafraîchir UI + dashboard
window.addEventListener('auth:changed', () => {
  setupAuthMenu();
  loadPage();
  if ((location.hash.slice(1).replace('.html','') || 'home') === 'dashboard') {
    paintDashboardUsername();
    // on relance le loader des stats en revenant sur l’onglet
    // (mountDashboard s’en charge si nécessaire)
    mountDashboard();
  }
});

// ---- Langue (existant) ----
function setupLangDropdown() {
  const langBtn = document.getElementById("lang-btn");
  const langMenu = document.getElementById("lang-menu");

  if (langBtn && langMenu) {
    langBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      langMenu.classList.toggle("hidden");
    });
    document.addEventListener("click", () => langMenu.classList.add("hidden"));
    langMenu.querySelectorAll("button").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const selectedLang = (e.target as HTMLElement).dataset.lang;
        console.log("Langue sélectionnée :", selectedLang);
      });
    });
  }
}
