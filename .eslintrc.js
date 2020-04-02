module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ['plugin:vue/essential', '@vue/airbnb'],
  // extends: ['airbnb-base', 'plugin:vue/strongly-recommended'],
  // extends: ['plugin:vue/recommended', 'airbnb-base', 'prettier', 'airbnb-vue'],
  // plugins: ['vue'],
  parserOptions: {
    parser: 'babel-eslint',
  },
  rules: {
    'max-len': ['error', { code: 140, tabWidth: 2 }],
    // 'vue/max-attributes-per-line': [
    //   2,
    //   {
    //     multiline: {
    //       allowFirstLine: true
    //     }
    //   }
    // ],
    // 'prettier/prettier': ['error'],
    // always off because I am using transform-remove-console for production now
    // 'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-console': 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
  },
  globals: {
    expect: true,
    window: true,
  },
  // settings: {
  //   'import/resolver': {
  //     alias: {
  //       map: [['@', './src']]
  //     },
  //     extensions: ['.js', '.vue']
  //   }
  // }
};
