module.exports = {
  root: true,
  extends: ["eslint:recommended", "plugin:prettier/recommended"],
  env: {
    node: true,
    es6: true,
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
  },
  rules: {
    // Add global rules here
  },
  overrides: [
    {
      files: ["packages/next/**/*.{ts,tsx}"],
      extends: ["plugin:@next/next/recommended", "plugin:react/recommended"],
      parser: "@typescript-eslint/parser",
      plugins: ["@typescript-eslint", "react"],
      rules: {
        // Add Next.js-specific rules here
      },
    },
    {
      files: ["packages/strapi/**/*.js"],
      extends: ["plugin:node/recommended"],
      rules: {
        // Add Strapi-specific rules here
      },
    },
  ],
};
