/* Paric.io DS — cargador de navegador para specimens y demos.
 * Uso: <script src="…/ds-browser.js" data-root="../../"></script>
 * Inyecta Tailwind 4 (browser) + tema del sistema, Vue 3 y el cargador de SFC.
 * Expone window.P5.ready (Promise) y window.P5.mount(selector, template, data?).
 */
(function () {
  const me = document.currentScript;
  const root = (me && me.getAttribute('data-root')) || './';
  const load = (src) => new Promise((ok, ko) => { const s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = ko; document.head.appendChild(s); });
  const projectRoot = new URL('../', new URL(root, location.href));
  for (const name of ['fonts', 'colors', 'typography', 'spacing', 'effects', 'motion']) {
    const link = document.createElement('link'); link.rel = 'stylesheet'; link.href = new URL('app/assets/css/' + name + '.css', projectRoot).href; document.head.appendChild(link);
  }

  const ready = (async () => {
    const theme = await (await fetch(new URL('app/assets/css/tailwind.css', projectRoot))).text();
    const st = document.createElement('style'); st.type = 'text/tailwindcss';
    st.textContent = '@import "tailwindcss";\n' + theme.replace(/@import\s+"[^"]+";?/g, '');
    document.head.appendChild(st);
    await Promise.all([
      load('https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4'),
      load('https://unpkg.com/vue@3/dist/vue.global.prod.js'),
      load('https://cdn.jsdelivr.net/npm/vue3-sfc-loader/dist/vue3-sfc-loader.js'),
    ]);
    const { loadModule } = window['vue3-sfc-loader'];
    const opts = {
      moduleCache: { vue: window.Vue },
      async getFile(url) { const r = await fetch(url); if (!r.ok) throw new Error('No se pudo cargar ' + url); return r.text(); },
      addStyle(t) { const s = document.createElement('style'); s.textContent = t; document.head.appendChild(s); },
    };
    const names = ['P5Button', 'P5Tag', 'P5Badge', 'P5Stamp', 'P5Heading', 'P5Card', 'P5FactCard', 'P5Input', 'P5Textarea', 'P5NavItem', 'P5Kbd', 'P5Switch', 'P5Wipe', 'P5Placeholder'];
    const comps = {};
    await Promise.all(names.map(async (n) => { comps[n] = await loadModule(new URL('app/components/p5/' + n + '.vue', projectRoot).href, opts); }));
    return comps;
  })();

  window.P5 = {
    ready,
    // mount('#app') usa el innerHTML del nodo como plantilla. opts: { data, methods } o un objeto de data plano.
    async mount(sel, opts) {
      const comps = await ready;
      const el = document.querySelector(sel);
      const template = el.innerHTML;
      const o = opts && (opts.data || opts.methods || opts.computed) ? opts : { data: opts || {} };
      const app = window.Vue.createApp({ components: comps, template, data: () => ({ ...(o.data || {}) }), methods: o.methods || {}, computed: o.computed || {} });
      app.mount(el);
      return app;
    },
  };
})();
