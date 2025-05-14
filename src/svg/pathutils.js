/**
 * Утилиты для создания SVG путей.
 * @module svg/pathutils
 */

/**
 * Перемещение текущей позиции к X,Y. Обычно используется в контексте создания пути.
 * @param {number} x - X-координата
 * @param {number} y - Y-координата
 * @return {string} Команда SVG пути
 */
export function move(x, y) {
  return 'M' + x + ' ' + y;
}

/**
 * Аналогично move, но с точкой Glift.
 * @param {!Object} pt - Объект точки с методами x() и y()
 * @return {string} Команда SVG пути
 */
export function movePt(pt) {
  return move(pt.x(), pt.y());
}

/**
 * Создает относительную SVG линию, начиная с 'текущей' позиции.
 * Точка (0,0) - это последнее место, куда было сделано перемещение или рисование.
 * @param {number} x - Относительная X-координата
 * @param {number} y - Относительная Y-координата
 * @return {string} Команда SVG пути
 */
export function lineRel(x, y) {
  return 'l' + x + ' ' + y;
}

/**
 * Аналогично lineRel, но с точкой.
 * @param {!Object} pt - Объект точки с методами x() и y()
 * @return {string} Команда SVG пути
 */
export function lineRelPt(pt) {
  return lineRel(pt.x(), pt.y());
}

/**
 * Создает абсолютную SVG линию - отличается от строчной буквы.
 * Этот формат обычно предпочтительнее.
 * @param {number} x - Абсолютная X-координата
 * @param {number} y - Абсолютная Y-координата
 * @return {string} Команда SVG пути
 */
export function lineAbs(x, y) {
  return 'L' + x + ' ' + y;
}

/**
 * Аналогично lineAbs, но с точкой.
 * @param {!Object} pt - Объект точки с методами x() и y()
 * @return {string} Команда SVG пути
 */
export function lineAbsPt(pt) {
  return lineAbs(pt.x(), pt.y());
}

// Экспорт для обратной совместимости
export const pathutils = {
  move,
  movePt,
  lineRel,
  lineRelPt,
  lineAbs,
  lineAbsPt
}; 