/**
 * Модуль для работы с областью обрезки (кропбоксом) доски.
 * @module displays/cropbox
 */

import { orientation } from '../orientation/index.js';
import { point } from '../util/index.js';

/** @const */
export const OVERFLOW = 0.5; // Расстояние между линиями, которое окружает край.

/** @const */
export const CROP_PAD = 0.5; // Дополнительный отступ для обрезанных краев.

/**
 * Создает кропбокс на основе региона, количества пересечений 
 * и флага для отображения координат доски.
 *
 * @param {string} region Регион доски
 * @param {number} intersects Количество пересечений для доски Го.
 * @param {boolean=} opt_drawBoardCoords Отображать ли координаты доски.
 *    Опционально: По умолчанию false.
 * @return {!DisplayCropBox} Объект области обрезки с настройками отображения
 */
export function getFromRegion(region, intersects, opt_drawBoardCoords) {
  const cropbox = orientation.cropbox.get(region, intersects);
  const drawBoardCoords = opt_drawBoardCoords || false;
  const maxIntersects = drawBoardCoords ? intersects + 2 : intersects;

  let top = cropbox.bbox.top(),
    bottom = cropbox.bbox.bottom(),
    left = cropbox.bbox.left(),
    right = cropbox.bbox.right();
    
  if (drawBoardCoords) {
    bottom += 2;
    right += 2;
  }

  const cx = new orientation.Cropbox(
    orientation.bbox.fromPts(
      point(left, top),
      point(right, bottom)
    ),
    maxIntersects
  );
  
  return new DisplayCropBox(cx, cropbox, drawBoardCoords);
}

/**
 * Кропбокс аналогичен ограничивающему прямоугольнику, но вместо прямоугольника, 
 * основанного на пикселях, это прямоугольник, основанный на точках.
 */
export class DisplayCropBox {
  /**
   * @param {!Object} cbox Обернутый кропбокс.
   * @param {!Object} cboxNoCoords Кропбокс без меток координат.
   * @param {boolean} drawBoardCoords Отображать ли координаты доски.
   */
  constructor(cbox, cboxNoCoords, drawBoardCoords) {
    /** @private {!Object} */
    this.cbox_ = cbox;

    /** @private {!Object} */
    this.cboxNoCoords_ = cboxNoCoords;

    /** @private {boolean} */
    this.drawCoords_ = drawBoardCoords;
  }

  /**
   * Возвращает cbox, который может включать метки координат. Cbox - это
   * ограничивающий прямоугольник, описывающий, какие точки на доске го должны быть
   * отображены. Обычно и ширина, и высота кропбокса должны быть
   * между 0 (исключительно) и maxIntersects (включительно), но могут быть +2 с
   * каждой стороны, если есть метки.
   *
   * @return {!Object}
   */
  cbox() {
    return this.cbox_;
  }

  /**
   * Возвращает ограничивающий прямоугольник без меток координат.
   * @return {!Object}
   */
  bboxWithoutCoords() {
    return this.cboxNoCoords_.bbox;
  }

  /**
   * Возвращает bbox для кропбокса.
   * @return {!Object}
   */
  bbox() {
    return this.cbox_.bbox;
  }

  /**
   * Дополнительный отступ - это специальная модификация для обрезанных досок. Он делает
   * обрезанные доски немного красивее, обеспечивая постоянное пустое пространство вокруг
   * края доски. Это добавляет много сложности, но результат выглядит
   * намного лучше.
   *
   * @return {number}
   * @private
   */
  topPad_() {
    return this.cbox_.hasRaggedTop() ? this.croppedEdgePadding() : 0;
  }
  
  /**
   * @return {number}
   * @private
   */
  botPad_() {
    return this.cbox_.hasRaggedBottom() ? this.croppedEdgePadding() : 0;
  }
  
  /**
   * @return {number}
   * @private
   */
  leftPad_() {
    return this.cbox_.hasRaggedLeft() ? this.croppedEdgePadding() : 0;
  }
  
  /**
   * @return {number}
   * @private
   */
  rightPad_() {
    return this.cbox_.hasRaggedRight() ? this.croppedEdgePadding() : 0;
  }

  /**
   * Возвращает количество 'пересечений', которые нам нужно выделить для высоты.
   * Это включает пересечения для доски, дополнительные 2 пересечения
   * (возможно) для координат доски и любые пересечения (возможно
   * дробные), необходимые для отступов.
   *
   * @return {number}
   */
  widthIntersections() {
    // Нам нужно добавить 1, так как bbox начинается с 0, в диапазоне от 0 до 18
    return (
      this.cbox().bbox.width() +
      1 +
      this.basePadding() * 2 +
      this.leftPad_() +
      this.rightPad_()
    );
  }

  /** @return {number} */
  heightIntersections() {
    // Нам нужно добавить 1, так как bbox начинается с 0, в диапазоне от 0 до 18
    return (
      this.cbox().bbox.height() +
      1 +
      this.basePadding() * 2 +
      this.topPad_() +
      this.botPad_()
    );
  }

  /** @return {number} */
  basePadding() {
    return OVERFLOW / 2;
  }

  /** @return {number} */
  croppedEdgePadding() {
    return CROP_PAD;
  }
  
  /**
   * Изменяет размер ограничивающего прямоугольника с учетом кропбокса.
   * @param {!Object} bbox Ограничивающий прямоугольник
   * @return {!Object} Измененный ограничивающий прямоугольник
   */
  resizedBox(bbox) {
    // Реализация метода для изменения размера ограничивающего прямоугольника
    const bWidth = bbox.width();
    const bHeight = bbox.height();
    const xAspect = this.widthIntersections();
    const yAspect = this.heightIntersections();
    
    // Определяем соотношение сторон
    let newWidth = bWidth;
    let newHeight = bHeight;
    const xScale = newWidth / xAspect;
    const yScale = newHeight / yAspect;
    
    // Выбираем наименьший масштаб для сохранения пропорций
    const minScale = Math.min(xScale, yScale);
    newWidth = xAspect * minScale;
    newHeight = yAspect * minScale;
    
    // Вычисляем отступы для центрирования
    const leftOffset = (bWidth - newWidth) / 2;
    const topOffset = (bHeight - newHeight) / 2;
    
    // Создаем новый ограничивающий прямоугольник
    return orientation.bbox.fromPts(
      point(bbox.topLeft().x() + leftOffset, bbox.topLeft().y() + topOffset),
      point(
        bbox.topLeft().x() + leftOffset + newWidth,
        bbox.topLeft().y() + topOffset + newHeight
      )
    );
  }
  
  /**
   * Возвращает расстояние между пересечениями.
   * @param {!Object} bbox Ограничивающий прямоугольник
   * @return {number} Расстояние между пересечениями
   */
  getSpacing(bbox) {
    const width = bbox.width();
    const fracWidth = width / this.widthIntersections();
    const height = bbox.height();
    const fracHeight = height / this.heightIntersections();
    
    // Выбираем наименьшее значение для согласованного отображения
    return Math.min(fracWidth, fracHeight);
  }
}

export const cropbox = {
  OVERFLOW,
  CROP_PAD,
  getFromRegion,
  DisplayCropBox
};
