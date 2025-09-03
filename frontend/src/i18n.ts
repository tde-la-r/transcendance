type Dict = Record<string, any>;

const FALLBACK = 'en';
let current = localStorage.getItem('lang') || (navigator.language?.startsWith('fr') ? 'fr' : 'en');
let dict: Dict = {};

function get(obj: any, path: string): any {
	return path.split('.').reduce((o, k) => (o && k in o ? o[k] : undefined), obj);	
}

function interpolate(str: string, vars?: Record<string, any>) {
	if (!vars) return str;
	return str.replace(/\{(\w+)\}/g, (_, k) => (k in vars ? String(vars[k]): `{${k}}`));
}

async function loadDict(l: string): Promise<Dict> {
	try {
		if (l === 'fr') return (await import('./i18n/fr.json')).default;
		if (l === 'es') return (await import('./i18n/es.json')).default;
		if (l === 'en') return (await import('./i18n/en.json')).default;
	} catch {}
	return (await import(`./i18n/${FALLBACK}.json`)).default;
}

export function lang() {
	return current;
}

export async function setLang(l: string) {
	current = l;
	localStorage.setItem('lang', l);
	dict = await loadDict(l);
	document.documentElement.setAttribute('lang', l);
	applyTranslations();
}

export async function initI18n() {
	dict = await loadDict(current);
	document.documentElement.setAttribute('lang', current);
	applyTranslations();
}

export function t(key: string, vars?: Record<string, any>): string {
	const val = get(dict, key);
	const txt = typeof val === 'string' ? val : key;
	return interpolate(txt, vars);
}

export function applyTranslations(root: ParentNode = document) {
	root.querySelectorAll<HTMLElement>('[data-i18n]').forEach((el) => {
		const key = el.getAttribute('data-i18n')!;
		const txt = t(key);
		if (el instanceof HTMLInputElement) {
			el.placeholder = txt;
		} else {
			el.textContent = txt;
		}
	});
}