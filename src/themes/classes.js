/**
 * CSS-классы, используемые для стилизации компонентов Glift.
 * 
 * Эти константы используются во всем приложении для обеспечения
 * согласованного именования классов и во избежание опечаток.
 * 
 * @module themes/classes
 */

/**
 * CSS-классы элементов Glift.
 * @enum {string}
 * @readonly
 */
export const CLASSES = Object.freeze({
  /** Контейнер для текстовых блоков */
  TEXT_BOX: 'glift-text-box',

  /** Элемент с абсолютным позиционированием */
  ABSOLUTE_ELEM: 'glift-absolute-elem',

  /// ///////////////////////
  // Основные элементы доски //
  /// ///////////////////////

  /** Основной элемент доски Го */
  BOARD: 'glift-board',
  
  /** Звездные точки (хоси) на доске Го */
  STARPOINTS: 'glift-starpoints',
  
  /** Линии сетки доски */
  BOARD_LINES: 'glift-board-lines',
  
  /** Метки координат вокруг доски */
  BOARD_COORD_LABELS: 'glift-board-coord-labels',

  /** Эффекты тени для камней */
  STONE_SHADOWS: 'glift-stone-shadows',
  
  /** Метки на камнях (треугольники, круги и т.д.) */
  STONE_MARKS: 'glift-stone-marks',
});

/**
 * Получение имени класса или классов для элемента.
 * @param {...string} classNames - Имена классов для объединения
 * @return {string} Строка с классами для использования в CSS
 */
export const getClassName = (...classNames) => {
  return classNames.join(' ');
};

/**
 * Префиксирует строки с именами классов префиксом "glift-"
 * @param {...string} baseNames - Базовые имена классов
 * @return {string} Строка с префиксированными именами классов
 */
export const prefixWithGlift = (...baseNames) => {
  return baseNames.map(name => `glift-${name}`).join(' ');
};
