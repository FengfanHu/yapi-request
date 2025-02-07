import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";
import pluginReact from "eslint-plugin-react";


/** @type {import('eslint').Linter.Config[]} */
export default [
  {ignores: ["**/node_modules/**", "**/lib/**", "**/out/**"]},
  {files: ["packages/**/*.{js,mjs,cjs,ts,jsx,tsx}"]},
  {
    languageOptions: { globals: {...globals.browser, ...globals.node} },
  },
  pluginJs.configs.recommended,
  eslintConfigPrettier,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "react/react-in-jsx-scope": "off" // No more react in jsx in React 17+
    }
  }
];