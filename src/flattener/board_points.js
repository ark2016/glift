/**
 * Модуль для работы с точками доски.
 * @module flattener/board_points
 */

import { Point } from '../util/point.js';

/**
 * Метка края доски.
 */
export class EdgeLabel {
  /**
   * @param {string} label
   * @param {!Point} point
   */
  constructor(label, point) {
    this.label = label;
    this.point = point;
  }
}

/**
 * Точка на доске - пересечение горизонтальной и вертикальной линий.
 */
export class BoardPt {
  /**
   * @param {number} intPt Целочисленная координата
   * @param {number} coordPt Координата на доске (в пикселях)
   */
  constructor(intPt, coordPt) {
    this.intPt = intPt;
    this.coordPt = coordPt;
  }
}

/**
 * Контейнер для хранения информации о точках доски.
 */
export class BoardPoints {
  /**
   * @param {!Object=} opt_options
   */
  constructor(opt_options) {
    const options = opt_options || {};
    /** @private {number} */
    this.spacing_ = options.spacing || 0;
    /** @private {number} */
    this.radius_ = options.radius || 0;
    /** @private {number} */
    this.coordLength_ = options.coordLength || 0;
    /** @private {number} */
    this.edgeCoordLength_ = options.edgeCoordLength || 0;
    /** @private {number} */
    this.numIntersections_ = options.numIntersections || 0;
    /** @private {number} */
    this.edgeLabelsThreshold_ = options.edgeLabelsThreshold || 0;
    /** @private {number} */
    this.offsetX_ = options.offsetX || 0;
    /** @private {number} */
    this.offsetY_ = options.offsetY || 0;
    /** @private {number} */
    this.drawBoardCoords_ = options.drawBoardCoords || 0;
    /** @private {!Object<number, !BoardPt>} */
    this.xCoordPts_ = {};
    /** @private {!Object<number, !BoardPt>} */
    this.yCoordPts_ = {};
    this.initialize();
  }

  /**
   * Установка точек координат.
   */
  initialize() {
    let coordPt = 0;
    const offset = this.spacing_ / 2;
    // Используем целые числа 0 -> numIntersections - 1 для ints
    for (let i = 0; i < this.numIntersections_; i++) {
      coordPt = i * this.spacing_ + offset + this.radius_;
      this.xCoordPts_[i] = new BoardPt(i, coordPt + this.offsetX_);
      this.yCoordPts_[i] = new BoardPt(i, coordPt + this.offsetY_);
    }
    return this;
  }

  /**
   * Получить точку-пересечение (BoardPt) для x-координаты.
   * @param {number} i Целочисленная X-координата
   * @return {BoardPt}
   */
  getXBoardPt(i) {
    if (this.xCoordPts_[i] === undefined) {
      throw new Error('No BoardPt for x-index: ' + i);
    }
    return this.xCoordPts_[i];
  }

  /**
   * Получить точку-пересечение (BoardPt) для y-координаты.
   * @param {number} i Целочисленная Y-координата
   * @return {BoardPt}
   */
  getYBoardPt(i) {
    if (this.yCoordPts_[i] === undefined) {
      throw new Error('No BoardPt for y-index: ' + i);
    }
    return this.yCoordPts_[i];
  }

  /**
   * Получить интервал между точками-пересечениями.
   * @return {number}
   */
  spacing() {
    return this.spacing_;
  }

  /**
   * Получить радиус камня.
   * @return {number}
   */
  radius() {
    return this.radius_;
  }

  /**
   * Получить длину координаты (для отображения меток).
   * @return {number}
   */
  coordLength() {
    return this.coordLength_;
  }

  /**
   * Получить длину метки на краю доски.
   * @return {number}
   */
  edgeCoordLength() {
    return this.edgeCoordLength_;
  }

  /**
   * Получить количество пересечений на доске.
   * @return {number}
   */
  numIntersections() {
    return this.numIntersections_;
  }

  /**
   * Получить отступ по X.
   * @return {number}
   */
  offsetX() {
    return this.offsetX_;
  }

  /**
   * Получить отступ по Y.
   * @return {number}
   */
  offsetY() {
    return this.offsetY_;
  }

  /**
   * Получить настройку отображения координат доски.
   * @return {number}
   */
  drawBoardCoords() {
    return this.drawBoardCoords_;
  }

  /**
   * Получить порог отображения меток на краю доски.
   * @return {number}
   */
  edgeLabelsThreshold() {
    return this.edgeLabelsThreshold_;
  }

  /**
   * @param {!Point} pt
   * @return {!Point} Преобразованная координатная точка.
   */
  getCoord(pt) {
    return new Point(
      this.getXBoardPt(pt.x()).coordPt,
      this.getYBoardPt(pt.y()).coordPt
    );
  }

  /**
   * Генерирует метки на краю в соответствии с традиционной нотацией IGS/KGS.
   * Также известна как восточная нотация.
   *
   * @return {!Array<!EdgeLabel>}
   */
  edgeLabels() {
    if (this.numIntersections_ >= this.edgeLabelsThreshold_) {
      // Никаких меток не требуется для маленькой доски
      return [];
    }

    const edgeLabels = [];
    const numInts = this.numIntersections_;
    // Буквенные метки на верхнем краю
    // Пропускаем i=8 потому что IGS/KGS пропускает букву "I"
    let l = 0;
    const coords = 'ABCDEFGHJKLMNOPQRSTUVWXYZ'.split('');
    for (let i = 0; i < numInts; i++) {
      if (l < coords.length) {
        const xpt = this.getXBoardPt(i).coordPt;
        const ypt = this.offsetY_ - this.radius_;
        edgeLabels.push(new EdgeLabel(coords[l], new Point(xpt, ypt)));
        l++;
      }
    }

    // Цифровые метки на левом краю
    for (let i = 0; i < numInts; i++) {
      // Нумерация идет снизу вверх
      const xpt = this.offsetX_ - this.radius_;
      const ypt = this.getYBoardPt(numInts - i - 1).coordPt;
      edgeLabels.push(new EdgeLabel('' + (i + 1), new Point(xpt, ypt)));
    }
    return edgeLabels;
  }
} 