/**
 * Модуль ориентации для доски Го.
 * Содержит классы и функции для обработки ориентации, поворота и обрезки доски.
 * 
 * @module orientation
 */

/**
 * Класс ограничивающего прямоугольника.
 * Представляет прямоугольную область на доске.
 */
export class BoundingBox {
  /**
   * @param {!Object} topLeft - Верхняя левая точка
   * @param {!Object} botRight - Нижняя правая точка
   */
  constructor(topLeft, botRight) {
    this.topLeft = topLeft;
    this.botRight = botRight;
  }

  /**
   * Получает верхнюю координату
   * @return {number}
   */
  top() {
    return this.topLeft.y();
  }

  /**
   * Получает левую координату
   * @return {number}
   */
  left() {
    return this.topLeft.x();
  }

  /**
   * Получает нижнюю координату
   * @return {number}
   */
  bottom() {
    return this.botRight.y();
  }

  /**
   * Получает правую координату
   * @return {number}
   */
  right() {
    return this.botRight.x();
  }

  /**
   * Получает ширину прямоугольника
   * @return {number}
   */
  width() {
    return this.right() - this.left();
  }

  /**
   * Получает высоту прямоугольника
   * @return {number}
   */
  height() {
    return this.bottom() - this.top();
  }
}

/**
 * Создает ограничивающий прямоугольник из точек
 * @param {!Object} topLeft - Верхняя левая точка
 * @param {!Object} botRight - Нижняя правая точка
 * @return {!BoundingBox}
 */
export const bbox = {
  fromPts: (topLeft, botRight) => {
    return new BoundingBox(topLeft, botRight);
  },
  
  /**
   * Создает ограничивающий прямоугольник из сторон
   * @param {!Object} topLeft - Верхняя левая точка
   * @param {number} width - Ширина
   * @param {number} height - Высота
   * @return {!BoundingBox}
   */
  fromSides: (topLeft, width, height) => {
    // Реализация будет добавлена позже
    return new BoundingBox(topLeft, { x: () => topLeft.x() + width, y: () => topLeft.y() + height });
  }
};

/**
 * Класс для обрезки доски.
 */
export class Cropbox {
  /**
   * @param {!BoundingBox} bbox - Ограничивающий прямоугольник
   * @param {number} size - Размер доски
   */
  constructor(bbox, size) {
    this.bbox = bbox;
    this.size = size;
  }

  /**
   * Проверяет, имеет ли верхний край неровности
   * @return {boolean}
   */
  hasRaggedTop() {
    return this.bbox.top() > 0;
  }

  /**
   * Проверяет, имеет ли нижний край неровности
   * @return {boolean}
   */
  hasRaggedBottom() {
    return this.bbox.bottom() < this.size - 1;
  }

  /**
   * Проверяет, имеет ли левый край неровности
   * @return {boolean}
   */
  hasRaggedLeft() {
    return this.bbox.left() > 0;
  }

  /**
   * Проверяет, имеет ли правый край неровности
   * @return {boolean}
   */
  hasRaggedRight() {
    return this.bbox.right() < this.size - 1;
  }
}

/**
 * Получает кропбокс для указанного региона и размера доски
 * @param {string} region - Регион доски
 * @param {number} size - Размер доски
 * @return {!Cropbox}
 */
export const cropbox = {
  get: (region, size) => {
    // Упрощенная реализация
    return new Cropbox(bbox.fromPts({ x: () => 0, y: () => 0 }, { x: () => size - 1, y: () => size - 1 }), size);
  }
};

/**
 * Извлекает предпочтительную обрезку квадранта из дерева ходов.
 * @param {!Object} movetree - Дерево ходов
 * @return {string} - Рекомендуемый регион доски
 */
export const getQuadCropFromMovetree = (movetree) => {
  // Упрощенная версия
  return 'ALL';
};

// Экспорт объекта orientation для обратной совместимости
export const orientation = {
  bbox,
  cropbox,
  BoundingBox,
  Cropbox,
  getQuadCropFromMovetree
}; 