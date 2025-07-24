import js from "@eslint/js";
import react from "eslint-plugin-react";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

export default [
  {
    ignores: [
      "node_modules/",
      ".next/",
      "dist/",
      "out/",
      ".pnpm-store/",
    ],
  },
  js.configs.recommended,
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsParser, // use the imported parser object
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
      globals: {
        window: true,
        document: true,
        console: true,
        process: true,
        URL: true,
        HTMLImageElement: true,
        headers: true,
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
      react,
    },
    rules: {
      // Add your custom rules here
    },
  },
];
