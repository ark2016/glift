/**
 * Утилиты для среды отображения доски.
 *
 * Среда содержит:
 *  - Ограничивающий прямоугольник для линий
 *  - Ограничивающий прямоугольник для всей доски
 *  - Ограничивающие прямоугольники для боковых панелей
 *  - Расчеты точек доски
 * 
 * @module displays/environment
 */

import { orientation } from '../orientation/index.js';
import { point } from '../util/index.js';
import { cropbox } from './cropbox_wrapper.js';
import { flattener } from '../flattener/index.js';

/**
 * Создает и возвращает среду пользовательского интерфейса.
 * 
 * @param {!Object} boardBox Ограничивающий прямоугольник для доски
 * @param {string} boardRegion Область доски для отображения
 * @param {number} intersections Количество пересечений (обычно 19)
 * @param {boolean} drawBoardCoords Отображать ли координаты доски
 * @return {!GuiEnvironment} Объект среды
 */
export function get(boardBox, boardRegion, intersections, drawBoardCoords) {
  // Для скорости и изоляции лучше определить boardBox извне, 
  // чем вычислять высоту и ширину путем проверки div здесь.
  if (!boardBox) {
    throw new Error('No Bounding Box defined for display environment!');
  }

  return new GuiEnvironment(
    boardBox,
    boardRegion,
    intersections,
    drawBoardCoords
  );
}

/**
 * Среда пользовательского интерфейса для отображения доски Го.
 * 
 * Обрабатывает расчеты для позиционирования доски, обрезки и отрисовки.
 */
export class GuiEnvironment {
  /**
   * @param {!Object} bbox Общий ограничивающий прямоугольник
   * @param {string} boardRegion Область доски для отображения
   * @param {number} intersections Количество пересечений
   * @param {boolean} drawBoardCoords Отображать ли координаты доски
   */
  constructor(bbox, boardRegion, intersections, drawBoardCoords) {
    /** @type {!Object} */
    this.bbox = bbox;
    
    /** @type {number} */
    this.divHeight = bbox.height();
    
    /** @type {number} */
    this.divWidth = bbox.width();
    
    /** @type {string} */
    this.boardRegion = boardRegion;
    
    /** @type {number} */
    this.intersections = intersections;
    
    /** @type {boolean} */
    this.drawBoardCoords = drawBoardCoords;

    /** @type {!Object} */
    this.cropbox = cropbox.getFromRegion(
      this.boardRegion,
      this.intersections,
      this.drawBoardCoords
    );

    // ------- Определено во время инициализации ------- //
    /** @private {Object} */
    this.divBox_ = null;

    /**
     * 'Истинный' внешний прямоугольник для рисования доски го.
     * @type {?Object}
     */
    this.goBoardBox = null;

    /**
     * Объект BoardPoints содержит все координаты пересечений
     * для отрисовки доски го.
     * @type {?Object}
     */
    this.boardPoints = null;
  }

  /**
   * Инициализирует внутренние переменные для размещения доски.
   * @return {!GuiEnvironment} this, для цепочки вызовов
   */
  init() {
    const { divHeight, divWidth, cropbox } = this;
    
    // Прямоугольник для всего div
    const divBox = orientation.bbox.fromPts(
      point(0, 0), // верхняя левая точка
      point(divWidth, divHeight) // нижняя правая точка
    );
    
    // Измененный размер прямоугольника доски го, учитывая область отображения
    const goBoardBox = getResizedBox(divBox, cropbox);
    
    // Вычисляем расстояние между пересечениями
    const spacing = getSpacing(goBoardBox, cropbox);
    
    // Вычисляем координаты и ограничивающие прямоугольники для каждого пересечения
    const boardPoints = flattener.BoardPoints.fromBbox(
      this.cropbox.bboxWithoutCoords(),
      spacing,
      this.intersections,
      {
        drawBoardCoords: this.drawBoardCoords,
        padding: cropbox.basePadding(),
        croppedEdgePadding: cropbox.croppedEdgePadding(),
        offsetPt: goBoardBox.topLeft(),
      }
    );

    // Сохраняем вычисленные значения
    this.divBox_ = divBox;
    this.goBoardBox = goBoardBox;
    this.boardPoints = boardPoints;
    
    return this;
  }
}

/**
 * Получает изменённый размер прямоугольника для отображения.
 * @param {!Object} bbox Оригинальный ограничивающий прямоугольник
 * @param {!Object} cropbox Область обрезки
 * @return {!Object} Изменённый ограничивающий прямоугольник
 * @private
 */
function getResizedBox(bbox, cropbox) {
  return cropbox.resizedBox(bbox);
}

/**
 * Получает расстояние между пересечениями.
 * @param {!Object} bbox Ограничивающий прямоугольник
 * @param {!Object} cropbox Область обрезки
 * @return {number} Расстояние между пересечениями
 * @private
 */
function getSpacing(bbox, cropbox) {
  return cropbox.getSpacing(bbox);
}

export const environment = {
  get,
  GuiEnvironment
};
