const globals = require("globals");
const pluginJs = require("@eslint/js");

module.exports = [
  {
    files: ["**/*.js"],
    languageOptions: { sourceType: "commonjs" },
  },
  { languageOptions: { globals: globals.node } },
  { ignores: ["dist/**", "build/**", "fullstack-open-back/dist/**"] },
  pluginJs.configs.recommended,
];
