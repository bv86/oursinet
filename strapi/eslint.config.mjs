import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
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
      '**/*.js', // Assuming we primarily lint TS files
    ],
    rules: {
      // Add any specific rule overrides here
      // e.g., '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
  prettierConfig // Add this last. It disables ESLint rules conflicting with Prettier.
);
