// @ts-check
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';

export default tseslint.config(
  {
    // config with just ignores is the replacement for `.eslintignore`
    ignores: [
      'node_modules/',
      'build/',
      'dist/',
      '.cache/',
      '.tmp/',
      'src/admin/', // Excluded in tsconfig as well
      'src/plugins/**', // Excluded in tsconfig as well
      'database/migrations/',
      'public/uploads/',
      'types/generated/',
      '**/*.test.*',
      '**/*.js', // Assuming we primarily lint TS files],
      '**/*.mjs', // Excluded in tsconfig as well
    ],
  },
  eslint.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
    },
  },
  prettierConfig
);
