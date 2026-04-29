# Agent Notes — Cluster3D

## Architecture
- **Static site.** No build step, no package manager, no tests. Serve `index.html` from any HTTP server (or `python -m http.server`).
- **Component loading:** `js/core.js` fetches HTML partials from `components/` and injects them into placeholder `<div id="app-*">` elements in `index.html`. Do **not** expect markup to live directly in `index.html`.
- **Initialization order matters:** `index.html` loads scripts in this order:
  1. `translations.js`
  2. `ui.js`
  3. `calculator.js`
  4. `cart.js`
  5. `core.js` (triggers `Promise.all` component fetch, then calls `initUIListeners`, `initTranslationsListener`, `initCartListeners`, `initCalculatorListeners`)
- Components are fetched in parallel. The loader overlay fades out only after all finish.

## 3D / Calculator
- Three.js dependencies are loaded via CDN in `index.html` (r128). Loaders (`STLLoader`, `OBJLoader`, `3MFLoader`, `OrbitControls`) are loaded from `three@0.128.0/examples/js` paths.
- `calculator.js` creates a `THREE.WebGLRenderer` inside `#model-preview` on first interaction and reuses it.
- Supported upload formats: STL, OBJ, 3MF.
- **WebGL guard:** `calculator.js` checks WebGL support via `detectWebGL()` (tries `webgl` / `experimental-webgl` canvas context). If missing, the upload area shows a translated warning, gets greyed out, and file input is disabled — model upload is blocked until WebGL is available.

## Translations & Theming
- Bilingual (cs/en). Default is auto-detected from `navigator.language`; user choice is stored in `localStorage` key `appLang`.
- Translation strings live in `js/translations.js`. Keys use camelCase mapping to kebab-case element IDs.
- Dark mode respects `prefers-color-scheme` initially; manual toggle exists. Tailwind `darkMode: 'class'` is configured inline in `index.html`.

## Assets
- `galerie/1.jpg` through `5.jpg` are lazily loaded by `ui.js` (lazy `src` assignment only when the slide is visible).
- `print.jpg`, `model.jpg`, `scan.jpg` are used as background images for calculator tabs.
