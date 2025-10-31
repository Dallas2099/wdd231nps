import pluginJs from "@eslint/js";
import globals from "globals";

export default [
  pluginJs.configs.recommended,
  {
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      semi: "error",
      "prefer-const": "warn",
    },
  },
];
