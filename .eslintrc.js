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
    "indent": ["error", 2, { SwitchCase: 1 }],
    "linebreak-style": ["error", "unix"],
    "quotes": ["error", "double"],
    "semi": ["error", "always"],
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
    "@typescript-eslint/object-curly-spacing": ["error", "always"],
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
    "arrow-parens": ["error", "as-needed"],
    "arrow-spacing": ["error", { before: true, after: true }],
    "array-bracket-spacing": ["error", "never"],
    "@typescript-eslint/type-annotation-spacing": ["error", {
      "before": false,
      "after": true,
      overrides: {
        arrow: {
          before: true,
          after: true
        }
      }
    }],
    "@typescript-eslint/func-call-spacing": ["error"],
    "@typescript-eslint/comma-spacing": ["error", { before: false, after: true }],
    "@typescript-eslint/keyword-spacing": [
      "error",
      {
        before: true,
        after: true,
      }],
    "@typescript-eslint/space-before-blocks": ["error", "always"],
    "@typescript-eslint/space-infix-ops": ["error"],
    "eqeqeq": ["error", "always"],
    "space-in-parens": ["error", "never"],
    "no-whitespace-before-property": ["error"],
    "rest-spread-spacing": ["error", "never"],
    "key-spacing": ["error", { beforeColon: false, afterColon: true }],
    "@typescript-eslint/member-delimiter-style": ["error", {
      "multiline": {
        "delimiter": "comma",
        "requireLast": false
      },
      "singleline": {
        "delimiter": "comma",
        "requireLast": false
      }
    }],
  },
  settings: {
    react: {
      version: "detect"
    }
  }
};
