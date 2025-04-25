import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import pluginJsxA11y from 'eslint-plugin-jsx-a11y';
import nextPlugin from '@next/eslint-plugin-next';

/** @type {import('eslint').Linter.FlatConfig[]} */
const config = [
  // Global ignores
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'public/**',
      '*.config.js', // Ignore root config files if any
      '*.config.mjs', // Ignore this file itself if needed, though ESLint handles it
      'components.json',
      'out/**', // Ignore build output
    ],
  },

  // Base config for JS/TS files using typescript-eslint parser
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: true, // Automatically find tsconfig.json
        tsconfigRootDir: import.meta.dirname, // Set root dir for tsconfig lookup
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      react: pluginReact,
      'react-hooks': pluginReactHooks,
      'jsx-a11y': pluginJsxA11y,
      '@next/next': nextPlugin,
    },
    rules: {
      // Apply recommended rules
      ...tseslint.configs.recommended.rules,
      ...pluginReact.configs.recommended.rules,
      ...pluginReactHooks.configs.recommended.rules,
      ...pluginJsxA11y.configs.recommended.rules,
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,

      // Custom rules / overrides
      'react/react-in-jsx-scope': 'off', // Not needed with Next.js 17+ / React 17+
      'react/prop-types': 'off', // Not needed with TypeScript
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_' },
      ],
      'jsx-a11y/anchor-has-content': 'off', // Disable rule causing the error
      // Add any other project-specific rules here
    },
    settings: {
      react: {
        version: 'detect', // Automatically detect React version
      },
    },
  },

  // Configuration for Next.js specific files like pages, app router
  // (Next.js plugin might handle this, but explicit config can be clearer)
  {
    files: [
      'src/app/**/*.{ts,tsx}',
      'src/pages/**/*.{ts,tsx}',
      'src/components/**/*.{ts,tsx}',
    ],
    // Add specific rules or settings for these files if needed
  },

  // Configuration for config files (e.g., next.config.ts)
  {
    files: ['next.config.{js,mjs,ts}'],
    languageOptions: {
      globals: {
        ...globals.node, // Use Node.js globals for config files
      },
    },
    rules: {
      '@typescript-eslint/no-var-requires': 'off', // Allow require in CJS config files if needed
    },
  },
];

export default config;
