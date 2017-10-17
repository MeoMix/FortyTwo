// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  extends: 'eslint:recommended',
  
  parserOptions: {
    ecmaVersion: 2017
  },

  env: {
      es6: true,
      node: true
  },
  
//extends: 'standard',
  rules: {
    'no-console': ['off'],
    'indent': [
      'error',
      2
    ],
    'linebreak-style': [
      'error',
      'windows'
    ],
    'quotes': [
      'error',
      'single',
      { 'allowTemplateLiterals': true }
    ],
    'semi': [
      'error',
      'always'
    ],

    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  }
};