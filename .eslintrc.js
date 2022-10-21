module.exports = {
    env: {
        es2021: true, jest: true, browser: true,
    },
    extends: ['airbnb-base', 'eslint:recommended', 'plugin:@typescript-eslint/recommended'],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 'latest', sourceType: 'module',
    },
    plugins: ['@typescript-eslint'],
    rules: {
        indent: ['warn', 4],
        'linebreak-style': ['warn', 'unix'],
        quotes: ['error', 'single'],
        semi: ['error', 'always'],
        'import/prefer-default-export': 0,
        'import/extensions': 0,
        'max-len': [2, { code: 120, ignoreComments: false }],
        'padding-line-between-statements': [
            'error',
            { blankLine: 'always', prev: '*', next: 'return' },
            { blankLine: 'always', prev: '*', next: 'block' },
            { blankLine: 'always', prev: '*', next: 'case' },
            { blankLine: 'always', prev: '*', next: 'default' },
            { blankLine: 'always', prev: '*', next: 'class' },
            { blankLine: 'always', prev: '*', next: 'cjs-export' },
            { blankLine: 'always', prev: '*', next: 'do' },
            { blankLine: 'always', prev: '*', next: 'export' },
            { blankLine: 'always', prev: '*', next: 'for' },
            { blankLine: 'always', prev: '*', next: 'function' },
            { blankLine: 'always', prev: '*', next: 'if' },
            { blankLine: 'always', prev: '*', next: 'import' },
            { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
            {
                blankLine: 'any',
                prev: ['const', 'let', 'var'],
                next: ['const', 'let', 'var'],
            },
        ],
    },
    settings: {
        'import/resolver': {
            node: {
                extensions: ['.ts', '.js'],
            },
        },
    },
};
