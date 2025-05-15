/**
 * Модуль для представления доски Го.
 * @module flattener/board
 */

import { Point } from '../util/point.js';
import { starpoints } from './starpoints.js';
import { symbols } from './symbols.js';
import { intersection } from './intersection.js';
import { states } from '../util/enums.js';

/**
 * Пространство имен для функций работы с доской.
 */
export const board = {
  /**
   * Создаёт незаполненную доску заданного размера.
   * @param {number} ints Число перекрестий (обычно 9, 13 или 19).
   * @return {!Array<!Array<T>>}
   * @template T
   */
  createEmptyMatrix: function(ints) {
    const outMatrix = [];
    for (let i = 0; i < ints; i++) {
      const newArray = [];
      for (let j = 0; j < ints; j++) {
        newArray.push(null);
      }
      outMatrix.push(newArray);
    }
    return outMatrix;
  }
};

/**
 * Объект доски Го.
 * @final
 */
export class Board {
  /**
   * @param {number} size Размер доски (обычно 9, 13 или 19).
   */
  constructor(size) {
    this.boardSize = size;
    /**
     * Сырая доска - доска как массив массивов объектов перекрестий (intersections).
     * @private {!Array<!Array<!Object>>}
     */
    this.boardArray_ = board.createEmptyMatrix(size);
    
    // Инициализируем доску
    this.initialize();
  }

  /**
   * Инициализирует доску и заполняет её объектами перекрестий с соответствующими
   * базовыми свойствами.
   *
   * @return {!Board} this
   */
  initialize() {
    for (let i = 0; i < this.boardSize; i++) {
      for (let j = 0; j < this.boardSize; j++) {
        const pt = new Point(i, j);
        this.boardArray_[i][j] = intersection.create(
            pt, states.EMPTY, undefined, undefined, this.boardSize);
      }
    }
    return this;
  }

  /**
   * Получает сырое представление доски как массив массивов объектов перекрестий.
   *
   * @return {!Array<!Array<!Object>>}
   */
  raw() {
    return this.boardArray_;
  }

  /**
   * Получаем объект перекрестия по точке.
   * 
   * @param {!Point} point
   * @return {!Object}
   */
  getIntBoardPt(point) {
    return this.boardArray_[point.x()][point.y()];
  }

  /**
   * Добавляет камень на доску, перезаписывая все старые метки. Обратите внимание,
   * что это не проверяет захват/историю/ко и т.д. Это просто записывает камень
   * в указанную точку.
   *
   * @param {!Point} point
   * @param {!states} color BLACK, WHITE или EMPTY
   * @return {!Board} this
   */
  addStone(point, color) {
    this.getIntBoardPt(point).setStone(
        color === states.BLACK ? symbols.BSTONE :
        color === states.WHITE ? symbols.WSTONE : symbols.EMPTY);
    return this;
  }

  /**
   * Добавляет метку перекрестию. 
   *
   * @param {!Point} point
   * @param {!symbols} mark Метка из модуля symbols.
   * @param {string=} opt_textLabel Опциональный текст метки.
   * @return {!Board} this
   */
  addMark(point, mark, opt_textLabel) {
    const intersection = this.getIntBoardPt(point);
    intersection.setMark(mark);
    if (opt_textLabel !== undefined) {
      intersection.setTextLabel(opt_textLabel);
    }
    return this;
  }
}

/**
 * Объект для представления различия между двумя точками доски.
 */
export class BoardDiffPt {
  /**
   * @param {string} ptype Тип точки. Одно из: 'SAME', 'ADDITION', или 'DELETION'.
   * @param {!Point} point
   * @param {!Object=} opt_data Опциональные данные, связанные с точкой.
   */
  constructor(ptype, point, opt_data) {
    this.ptype = ptype;
    this.point = point;
    this.data = opt_data || null;
  }
}

/**
 * Типы точек (не перечисление).
 * @type {!Object<string>}
 */
export const boardDiffPtTypes = {
  SAME: 'SAME',
  ADDITION: 'ADDITION',
  DELETION: 'DELETION'
}; 