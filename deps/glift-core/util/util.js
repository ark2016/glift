/**
 * Базовые утилиты для Glift Core.
 * @module util
 */

/**
 * Преобразует координаты в строковый формат точки.
 * @param {number} x - Координата X
 * @param {number} y - Координата Y
 * @return {string} Строка в формате 'x,y'
 */
export const coordToString = (x, y) => {
  return `${x},${y}`;
};

/**
 * Преобразует строковую точку в объект точки.
 * @param {string} str - Строка точки в формате 'x,y'
 * @return {import('./point.js').Point} Точка
 * @throws {Error} Если строка не может быть преобразована
 */
export const stringToCoord = (str) => {
  try {
    const split = str.split(',');
    const x = parseInt(split[0], 10);
    const y = parseInt(split[1], 10);
    
    // Импортируем Point из модуля point.js
    const { Point } = require('./point.js');
    return new Point(x, y);
  } catch (e) {
    throw new Error(`Ошибка разбора! Не удалось преобразовать точку из: ${str}`);
  }
};

/**
 * Синоним для stringToCoord.
 */
export const pointFromString = stringToCoord;

/**
 * Преобразует координату SGF (например, 'mc') в точку.
 * SGF индексируются от верхнего левого угла:
 *    _  _  _
 *   |aa ba ca ...
 *   |ab bb
 *   |.
 *   |.
 *   |.
 * 
 * @param {string} str - Строка точки SGF
 * @return {import('./point.js').Point} Готовая точка
 * @throws {Error} Если формат строки неверный
 */
export const pointFromSgfCoord = (str) => {
  if (str.length !== 2) {
    throw new Error(`Неизвестная длина SGF-координаты: ${str.length} для свойства ${str}`);
  }
  const a = 'a'.charCodeAt(0);
  
  // Импортируем Point из модуля point.js
  const { Point } = require('./point.js');
  return new Point(str.charCodeAt(0) - a, str.charCodeAt(1) - a);
};

/**
 * Проверяет, выходит ли координата за пределы доски.
 * @param {number} coord - Координата для проверки
 * @param {number} max - Максимальное значение координаты
 * @return {boolean} true, если координата вне границ
 */
export const outBounds = (coord, max) => {
  return coord < 0 || coord >= max;
};
