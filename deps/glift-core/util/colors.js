/**
 * Модуль для работы с цветами в Glift.
 * @module util/colors
 */

import { enums } from '../../../src/util/enums.js';

/**
 * Утилиты для работы с цветами.
 */
export const colors = {
  /**
   * Возвращает противоположный цвет.
   * @param {string} color - Исходный цвет
   * @return {string} Противоположный цвет
   */
  oppositeColor: function(color) {
    if (color === enums.states.BLACK) return enums.states.WHITE;
    if (color === enums.states.WHITE) return enums.states.BLACK;
    else return color;
  }
};
