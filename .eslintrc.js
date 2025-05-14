module.exports = {
  extends: ['standard', 'plugin:prettier/recommended'],
  parserOptions: {
    ecmaVersion: 'latest', // Позволяет использовать современный синтаксис JS
    sourceType: 'module',
  },
  env: {
    browser: true, // Для кода, который будет работать в браузере
    node: true, // Для скриптов сборки и т.д., если они есть
    es2021: true, // Включает глобальные переменные ES2021
  },
  globals: {
    glift: 'readonly',
    goog: 'readonly',
    // QUnit globals
    QUnit: 'readonly',
    test: 'readonly',
    asyncTest: 'readonly',
    start: 'readonly',
    stop: 'readonly',
    expect: 'readonly',
    ok: 'readonly',
    notOk: 'readonly',
    equal: 'readonly',
    notEqual: 'readonly',
    deepEqual: 'readonly',
    notDeepEqual: 'readonly',
    strictEqual: 'readonly',
    notStrictEqual: 'readonly',
    throws: 'readonly',
    // Test data globals (if any, e.g. from *_test.js or testdata/*.js files being sourced globally)
    testdata: 'readonly',
    testUtil: 'readonly',
  },
  rules: {
    // Здесь можно будет добавлять или переопределять правила ESLint
    // Например:
    // 'no-unused-vars': 'warn', // Предупреждать о неиспользуемых переменных
    'no-unused-vars': 'warn', // Временно ослабляем до предупреждения
    camelcase: 'off', // Временно отключаем, т.к. много opt_параметров
    'one-var': 'off', // Временно отключаем для упрощения
    'no-var': 'off', // Временно отключаем, будем исправлять var на let/const постепенно
    'no-redeclare': 'error', // Раскомментируем
  },
};
