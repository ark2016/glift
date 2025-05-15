/**
 * Модуль для генерации SVG-путей.
 * @module svg/pathutils
 */

import { Point } from '../util/point.js';

/**
 * Утилиты для работы с SVG-путями.
 */
export const pathutils = {
  /**
   * Перемещает текущую позицию в X,Y. Обычно используется в контексте создания
   * пути.
   * @param {number} x
   * @param {number} y
   * @return {string}
   */
  move: function (x, y) {
    return 'M' + x + ' ' + y;
  },

  /**
   * Как move, но с точкой glift.
   * @param {!Object} pt
   * @return {string}
   */
  movePt: function (pt) {
    return pathutils.move(pt.x(), pt.y());
  },

  /**
   * Создает относительную линию SVG, начиная с 'текущей' позиции. То есть,
   * точка (0,0) - это последнее место, до которого был рисунок или перемещение.
   * @param {number} x
   * @param {number} y
   * @return {string}
   */
  lineRel: function (x, y) {
    return 'l' + x + ' ' + y;
  },

  /**
   * Как lineRel, но с точкой.
   * @param {!Object} pt
   * @return {string}
   */
  lineRelPt: function (pt) {
    return pathutils.lineRel(pt.x(), pt.y());
  },

  /**
   * Создает абсолютную линию SVG - отличается от строчной.
   * Эта форма обычно предпочтительнее.
   * @param {number} x
   * @param {number} y
   * @return {string}
   */
  lineAbs: function (x, y) {
    return 'L' + x + ' ' + y;
  },

  /**
   * Как lineAbs, но с точкой.
   * @param {!Object} pt
   * @return {string}
   */
  lineAbsPt: function (pt) {
    return pathutils.lineAbs(pt.x(), pt.y());
  }
};
