/**
 * Глобальные константы и переменные для Glift Core.
 * @module global
 */

// Определяем глобальные константы для всего проекта
export const global = Object.freeze({
  /**
   * Размер стандартной доски для игры Го.
   * @constant {number}
   */
  STANDARD_BOARDSIZE: 19,

  /**
   * Максимальный размер доски.
   * @constant {number}
   */
  MAX_BOARDSIZE: 25,
  
  /**
   * Версия Glift Core.
   * @constant {string}
   */
  VERSION: '1.2.0'
});
