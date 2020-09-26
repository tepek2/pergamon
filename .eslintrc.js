module.exports = {
    env: {
        node: true,
        commonjs: true,
        jest: true
    },
    extends: [
        'standard'
    ],
    parserOptions: {
        sourceType: 'script'
    },
    rules: {
        semi: ['error', 'always'],
        indent: ['error', 4]
    }
};
