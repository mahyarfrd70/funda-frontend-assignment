// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'
import eslintConfigPrettier from 'eslint-config-prettier'
import eslintPluginStorybook from 'eslint-plugin-storybook'

// `withNuxt` gives us Nuxt + Vue + TypeScript rules with correct globals and
// auto-import awareness. `eslintConfigPrettier` last disables any stylistic
// rules that would fight Prettier. `eslint-plugin-storybook`'s recommended
// config lints *.stories.ts files (story structure, CSF conventions).
export default withNuxt(eslintConfigPrettier, ...eslintPluginStorybook.configs['flat/recommended'])
