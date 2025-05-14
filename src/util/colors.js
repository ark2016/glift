/**
 * Утилиты для работы с цветами.
 * @module util/colors
 */

import { states } from './enums.js';

/**
 * Возвращает противоположный цвет.
 * @param {string} color - Цвет (BLACK или WHITE)
 * @return {string} Противоположный цвет
 */
export function oppositeColor(color) {
  if (color === states.BLACK) return states.WHITE;
  if (color === states.WHITE) return states.BLACK;
  else return color;
}

// Экспорт для обратной совместимости
export const colors = {
  oppositeColor
}; 