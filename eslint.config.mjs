// eslint.config.mjs
import js from '@eslint/js';
import globals from 'globals';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

export default [
  // Ignore these paths globally
  {
    ignores: ['node_modules/', 'dist/', 'build/', 'venv/'],
  },

  // Backend TS files
  {
    files: ['backend/**/*.ts'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        project: ['./backend/tsconfig.json'],
        tsconfigRootDir: process.cwd(),
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        ...globals.node,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      prettier,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,
      ...prettierConfig.rules,

      // Style
      semi: ['error', 'always'],
      quotes: ['error', 'single'],
      // indent: ['error', 2],
      'max-len': ['error', { code: 80, ignoreStrings: true }],
      'prettier/prettier': [
        'error',
        {
          printWidth: 80,
          tabWidth: 2,
          singleQuote: true,
          semi: true,
          trailingComma: 'es5',
          arrowParens: 'always',
        },
      ],

      // TS adjustments
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },

  // Frontend TS / TSX files
  {
    files: ['frontend/**/*.ts', 'frontend/**/*.tsx'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        project: [
          './frontend/tsconfig.app.json',
          './frontend/tsconfig.node.json',
        ],
        tsconfigRootDir: process.cwd(),
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      prettier,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,
      ...prettierConfig.rules,

      // Style
      semi: ['error', 'always'],
      quotes: ['error', 'single'],
      // indent: ['error', 2],
      'max-len': ['error', { code: 80, ignoreStrings: true }],
      'prettier/prettier': [
        'error',
        {
          printWidth: 80,
          tabWidth: 2,
          singleQuote: true,
          semi: true,
          trailingComma: 'es5',
          arrowParens: 'always',
        },
      ],

      // TS adjustments
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
];
