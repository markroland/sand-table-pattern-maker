import globals from "globals";
import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ["src/**/*.js"], languageOptions: {
      sourceType: "module",
      globals: globals.browser
    }
  },
  {
    languageOptions: {
      globals: globals.node
    }
  },
  pluginJs.configs.recommended,
  {
    rules: {
      // indent: ['error', 2],
    }
  }
];