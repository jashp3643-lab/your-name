// Tiny hash-router state used only by the verification harness / static preview.
let routes = [];
const listeners = new Set();
let attached = false;
let lastPath = null;
let lastParams = {};

export function setRoutes(r) {
  routes = r;
}

function currentPath() {
  const h = window.location.hash.replace(/^#/, '') || '/';
  return h.split('?')[0] || '/';
}

export function matchRoute(path) {
  const clean = path.replace(/\/+$/, '') || '/';
  for (const r of routes) {
    const m = r.regex.exec(clean);
    if (m) {
      const params = {};
      r.keys.forEach((k, i) => (params[k] = decodeURIComponent(m[i + 1])));
      return { route: r, params };
    }
  }
  return null;
}

export function getPath() {
  const p = currentPath();
  if (p !== lastPath) {
    lastPath = p;
    const m = matchRoute(p);
    lastParams = m ? m.params : {};
  }
  return p;
}

export function getParams() {
  getPath();
  return lastParams;
}

function attach() {
  if (attached) return;
  attached = true;
  window.addEventListener('hashchange', () => listeners.forEach((l) => l()));
}

export function subscribe(cb) {
  attach();
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function navigate(to, replace) {
  if (replace) {
    window.history.replaceState(null, '', `#${to}`);
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  } else {
    window.location.hash = to;
  }
}
