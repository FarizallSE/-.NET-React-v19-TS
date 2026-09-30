import js from "@eslint/js";
import globals from "globals";
import prettier from "eslint-config-prettier";
import reactPlugin from "eslint-plugin-react";
import tseslint from "typescript-eslint";

const reactSettings = {
  react: {
    version: "detect",
  },
};

const reactRules = {
  "react/react-in-jsx-scope": "off",
  "react/no-unescaped-entities": "off",
  "react/prop-types": "off",
};

// typescript-eslint v8 mengekspor config sebagai array of flat config,
// jadi rules-nya harus digabung manual.
const tsRules = Object.assign(
  {},
  ...tseslint.configs.recommended.flat(Infinity).map((config) => config.rules ?? {}),
);

export default [
  { ignores: ["dist/**", "src/routeTree.gen.ts"] },
  js.configs.recommended,
  reactPlugin.configs.flat.recommended,
  reactPlugin.configs.flat["jsx-runtime"],
  {
    files: ["**/*.{js,mjs,jsx}"],
    languageOptions: {
      globals: {
        ...globals.es2022,
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: reactSettings,
    rules: reactRules,
  },
  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      "@typescript-eslint": tseslint.plugin,
    },
    languageOptions: {
      parser: tseslint.parser,
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: reactSettings,
    rules: {
      ...tsRules,
      ...reactRules,
    },
  },
  prettier,
];
