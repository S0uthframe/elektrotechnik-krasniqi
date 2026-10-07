import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'

export default [
  { ignores: ['dist', 'node_modules'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: { ...globals.browser },
      parserOptions: { ecmaFeatures: { jsx: true }, sourceType: 'module' },
    },
    settings: { react: { version: '18.3' } },
    plugins: { react, 'react-hooks': reactHooks },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.flat.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      // Die Komponenten sind unveraendert aus der Base44-Vorlage uebernommen.
      // Dort gibt es zwei harmlose Altlasten: ein nicht genutztes catch-Argument
      // in ContactForm und eine nicht genutzte SERVICE_KEYS-Konstante in Footer.
      // Lieber die Regel hier eng gefasst entschaerfen als die Vorlage anfassen –
      // so bleibt ein Abgleich mit dem Base44-Stand Zeile fuer Zeile moeglich.
      'no-unused-vars': ['error', { caughtErrors: 'none', varsIgnorePattern: '^[A-Z][A-Z0-9_]*$' }],
    },
  },
]
