/**
 * Конфигурация Babel для транспиляции ES6+ в ES5.
 */
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          browsers: ['>0.25%', 'not dead']
        },
        useBuiltIns: 'usage',
        corejs: 3
      }
    ]
  ],
  plugins: []
}; 