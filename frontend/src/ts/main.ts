import "../style.css";
import "../output.css";
import { laodDashboard } from "./dashboard";


const routes: { [key: string]: string} = {
    home: 'home.html',
    login: 'login.html',
    register: 'register.html',
}

async function loadLayout() {
  const layoutResp = await fetch('./src/pages/layout.html');
  const layoutHtml = await layoutResp.text();
  document.body.innerHTML = layoutHtml;
}

async function loadPage(hash: string)
{
    const raw = location.hash.slice(1);
    const page = raw.replace('.html', '') || 'home';
    const pageRes = await fetch(`./src/pages/${page}.html`);
    const pageHtml = await pageRes.text();

    const app = document.getElementById('app');
    if (app) app.innerHTML = pageHtml;

    if (page === 'dashboard') {
      laodDashboard();
    }
}


window.addEventListener('hashchange', () => {
    const hash = location.hash.replace('#', '');
    loadPage(hash);
});

window.addEventListener('DOMContentLoaded', async () => {
  await loadLayout();
  setupLangDropdown();
  await loadPage('home');
});

function setupLangDropdown() {
  const langBtn = document.getElementById("lang-btn");
  const langMenu = document.getElementById("lang-menu");

  if (langBtn && langMenu) {
    langBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      langMenu.classList.toggle("hidden");
    });

    document.addEventListener("click", () => {
      langMenu.classList.add("hidden");
    });

    langMenu.querySelectorAll("button").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const selectedLang = (e.target as HTMLElement).dataset.lang;
        console.log("Langue sélectionnée :", selectedLang);
      });
    });
  }
}