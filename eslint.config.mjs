import { defineConfig } from "eslint/config";
import globals from "globals";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import react from "eslint-plugin-react";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default defineConfig([{
    extends: compat.extends("eslint:recommended", "plugin:prettier/recommended"),

    languageOptions: {
        globals: {
            ...globals.node,
        },

        ecmaVersion: 2020,
        sourceType: "module",
    },

    rules: {},
}, {
    files: ["packages/next/**/*.{ts,tsx}"],
    extends: compat.extends("plugin:@next/next/recommended", "plugin:react/recommended"),

    plugins: {
        "@typescript-eslint": typescriptEslint,
        react,
    },

    languageOptions: {
        parser: tsParser,
    },

    rules: {},
}, {
    files: ["packages/strapi/**/*.js"],
    extends: compat.extends("plugin:node/recommended"),
    rules: {},
}]);