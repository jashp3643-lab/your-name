// Verification build: bundles the SAME source files that Next.js uses (src/app/**, src/components/**)
// into a static, hash-routed preview (./preview). It exists because `next build` could not be run in the
// authoring environment (npm registry blocked). `next/link` and `next/navigation` are replaced by small
// stand-ins; the root layout (<html>/<body>) is replaced by the equivalent <Providers><DeviceFrame>.
//
// Usage: node tools/harness/build.mjs   (needs only `esbuild`)
import { build } from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const srcDir = path.join(root, 'src');
const appDir = path.join(srcDir, 'app');
const outDir = path.join(root, 'preview');
const genDir = path.join(root, '.harness');

const pages = [];
function walk(dir, segs) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) walk(path.join(dir, entry.name), [...segs, entry.name]);
    else if (/^page\.(jsx|js)$/.test(entry.name)) pages.push({ segs, file: path.join(dir, entry.name) });
  }
}
walk(appDir, []);

const imports = [];
let n = 0;
const importFor = (file) => {
  const id = `M${n++}`;
  imports.push(`import ${id} from ${JSON.stringify(file)};`);
  return id;
};

const routes = pages.map(({ segs, file }) => {
  const urlSegs = segs.filter((s) => !(s.startsWith('(') && s.endsWith(')')));
  const keys = [];
  const pattern = urlSegs
    .map((s) => {
      const m = /^\[(.+)\]$/.exec(s);
      if (m) {
        keys.push(m[1]);
        return '([^/]+)';
      }
      return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    })
    .join('/');
  const layouts = [];
  for (let i = 1; i <= segs.length; i++) {
    const dir = path.join(appDir, ...segs.slice(0, i));
    for (const ext of ['jsx', 'js']) {
      const f = path.join(dir, `layout.${ext}`);
      if (fs.existsSync(f)) {
        layouts.push(importFor(f));
        break;
      }
    }
  }
  return {
    regex: `/^\\/${pattern.replace(/\//g, '\\/')}$/`,
    keys,
    dynamic: keys.length,
    page: importFor(file),
    layouts,
    url: '/' + urlSegs.join('/'),
  };
});
routes.sort((a, b) => a.dynamic - b.dynamic || b.url.length - a.url.length);

const routeLiterals = routes
  .map(
    (r) =>
      `{ regex: ${r.url === '/' ? '/^\\/$/' : r.regex}, keys: ${JSON.stringify(r.keys)}, page: ${r.page}, layouts: [${r.layouts.join(', ')}] }`
  )
  .join(',\n  ');

fs.mkdirSync(genDir, { recursive: true });
const entry = `
import React from 'react';
import { createRoot } from 'react-dom/client';
import ${JSON.stringify(path.join(appDir, 'globals.css'))};
import Providers from ${JSON.stringify(path.join(srcDir, 'components/Providers.jsx'))};
import DeviceFrame from ${JSON.stringify(path.join(srcDir, 'components/DeviceFrame.jsx'))};
import { setRoutes, matchRoute } from ${JSON.stringify(path.join(root, 'tools/harness/router-state.js'))};
import { usePathname } from ${JSON.stringify(path.join(root, 'tools/harness/next-navigation.jsx'))};
${imports.join('\n')}

const routes = [
  ${routeLiterals}
];
setRoutes(routes);

function Router() {
  const path = usePathname();
  const m = matchRoute(path);
  if (!m) return <div style={{ padding: 24 }}>Page not found: {path}</div>;
  const { route } = m;
  let el = React.createElement(route.page);
  for (let i = route.layouts.length - 1; i >= 0; i--) el = React.createElement(route.layouts[i], null, el);
  return el;
}

createRoot(document.getElementById('root')).render(
  <Providers><DeviceFrame><Router /></DeviceFrame></Providers>
);
`;
fs.writeFileSync(path.join(genDir, 'entry.jsx'), entry);

fs.rmSync(outDir, { recursive: true, force: true });
await build({
  entryPoints: [path.join(genDir, 'entry.jsx')],
  outdir: outDir,
  entryNames: 'app',
  bundle: true,
  minify: true,
  format: 'iife',
  jsx: 'automatic',
  loader: { '.js': 'jsx' },
  target: ['es2020', 'safari15'],
  define: {
    'process.env.NODE_ENV': '"production"',
    'process.env.NEXT_PUBLIC_DEMO_PIN': '""',
  },
  alias: {
    'next/link': path.join(root, 'tools/harness/next-link.jsx'),
    'next/navigation': path.join(root, 'tools/harness/next-navigation.jsx'),
    '@': srcDir,
  },
  nodePaths: [path.join(root, 'node_modules')],
  logLevel: 'info',
});

fs.writeFileSync(
  path.join(outDir, 'index.html'),
  `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
<meta name="theme-color" content="#ffffff" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="default" />
<meta name="apple-mobile-web-app-title" content="YONO SBI" />
<title>YONO SBI</title>
<link rel="apple-touch-icon" href="apple-touch-icon.png" />
<link rel="apple-touch-icon" sizes="180x180" href="apple-touch-icon.png" />
<link rel="apple-touch-icon-precomposed" href="apple-touch-icon-precomposed.png" />
<link rel="icon" type="image/png" href="favicon.png" />
<link rel="manifest" href="manifest.json" />
<link rel="stylesheet" href="app.css" />
</head>
<body>
<div id="root"></div>
<script src="app.js"></script>
</body>
</html>
`
);

const publicDir = path.join(root, 'public');
if (fs.existsSync(publicDir)) {
  for (const f of fs.readdirSync(publicDir)) {
    fs.copyFileSync(path.join(publicDir, f), path.join(outDir, f));
  }
}

console.log(`Preview written to ${path.relative(process.cwd(), outDir) || outDir}/ (${routes.length} routes)`);
