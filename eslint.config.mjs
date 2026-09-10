import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  ignores: ['references/**', 'design-system/ds-browser.js', 'design-system/ui_kits/**', 'design-system/components/cards/**', 'design-system/guidelines/**'],
}, {
  rules: {
    'vue/multi-word-component-names': 'off',
    'vue/max-attributes-per-line': 'off',
    'vue/singleline-html-element-content-newline': 'off',
    'vue/html-self-closing': ['error', { html: { void: 'always', normal: 'never', component: 'always' } }],
  },
})
