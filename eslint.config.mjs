import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  ignores: ['references/**'],
}, {
  rules: {
    'vue/multi-word-component-names': 'off',
    'vue/max-attributes-per-line': 'off',
    'vue/singleline-html-element-content-newline': 'off',
    'vue/html-self-closing': ['error', { html: { void: 'always', normal: 'never', component: 'always' } }],
  },
})
