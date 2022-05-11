module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking"
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 12,
    sourceType: "module",
    project: "./tsconfig.json"
  },
  root: true,
  plugins: ["react", "@typescript-eslint"],
  rules: {
    indent: ["error", 2, { SwitchCase: 1 }],
    "linebreak-style": ["error", "unix"],
    quotes: ["error", "double"],
    semi: ["error", "always"],
    "react/jsx-uses-react": "off",
    "react/react-in-jsx-scope": "off",
    "comma-dangle": ["error", "never"],
    "max-len": ["error", { code: 120 }],
    "react/self-closing-comp": ["error", { component: true }],
    "@typescript-eslint/unbound-method": "off",
    "react/jsx-tag-spacing": [
      "error",
      {
        closingSlash: "never",
        beforeSelfClosing: "always",
        afterOpening: "never",
        beforeClosing: "never"
      }
    ],
    "react/jsx-props-no-multi-spaces": ["error"],
    "react/jsx-newline": ["error", { prevent: true }],
    "no-trailing-spaces": "error",
    "object-curly-spacing": ["error", "always"],
    "no-multi-spaces": ["error"],
    "react/jsx-curly-spacing": [
      "error", 
      { 
        "when": "never", 
        "attributes": { "allowMultiline": false }, 
        "children": true 
      }
    ],
    "react/jsx-equals-spacing": ["error", "never"],
  },
  settings: {
    react: {
      version: "detect"
    }
  }
};
