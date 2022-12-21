module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
    createDefaultProgram: true,
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'airbnb',
    'airbnb/hooks',
    'airbnb-typescript',
    'plugin:prettier/recommended',
  ],
  rules: {
    '@typescript-eslint/no-use-before-define': 'off',
    'import/no-extraneous-dependencies': 'off',
    'react/react-in-jsx-scope': 'off',
    // react 함수 컴포넌트 정의 방식 지정
    'react/function-component-definition': [
      'warn',
      {
        unnamedComponents: 'arrow-function',
        namedComponents: 'arrow-function',
      },
    ],
    // props로 받은 것 바로 props로 넘기기 허용
    'react/jsx-props-no-spreading': 'off',
    'no-param-reassign': 'off',
    'no-plusplus': 'off',
  },
};
