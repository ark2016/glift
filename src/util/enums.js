/**
 * Модуль перечислений для библиотеки Glift.
 * 
 * @module util/enums
 */

/**
 * Возможные состояния камней.
 * @enum {string}
 */
export const states = {
  /** Пустая точка. */
  EMPTY: 'EMPTY',
  
  /** Черный камень. */
  BLACK: 'BLACK',
  
  /** Белый камень. */
  WHITE: 'WHITE',
  
  /** Черный камень с наведением. */
  BLACK_HOVER: 'BLACK_HOVER',
  
  /** Белый камень с наведением. */
  WHITE_HOVER: 'WHITE_HOVER'
};

/**
 * Возможные типы меток.
 * @enum {string}
 */
export const marks = {
  /** Обычная метка. */
  LABEL: 'LABEL',
  
  /** Маркер последнего хода. */
  CIRCLE: 'CIRCLE',
  
  /** Метка в виде квадрата. */
  SQUARE: 'SQUARE',
  
  /** Метка в виде треугольника. */
  TRIANGLE: 'TRIANGLE',
  
  /** Метка в виде крестика. */
  XMARK: 'XMARK',
  
  /** Числовая метка для вариаций. */
  LABEL_NUMERIC: 'LABEL_NUMERIC',
  
  /** Буквенная метка для вариаций. */
  LABEL_ALPHA: 'LABEL_ALPHA',
  
  /** Метка для территории. */
  TERRITORY_BLACK: 'TERRITORY_BLACK',
  
  /** Метка для территории. */
  TERRITORY_WHITE: 'TERRITORY_WHITE',
  
  /** Маркер варианта. */
  VARIATION_MARKER: 'VARIATION_MARKER',
  
  /** Маркер правильного варианта. */
  CORRECT_VARIATION: 'CORRECT_VARIATION'
};

/**
 * Направления поворота.
 * @enum {string}
 */
export const rotations = {
  /** Без поворота. */
  NO_ROTATION: 'NO_ROTATION',
  
  /** Поворот на 90 градусов. */
  CLOCKWISE_90: 'CLOCKWISE_90',
  
  /** Поворот на 180 градусов. */
  CLOCKWISE_180: 'CLOCKWISE_180',
  
  /** Поворот на 270 градусов. */
  CLOCKWISE_270: 'CLOCKWISE_270'
};

/**
 * Регионы доски.
 * @enum {string}
 */
export const boardRegions = {
  /** Вся доска. */
  ALL: 'ALL',
  
  /** Верхний левый угол. */
  TOP_LEFT: 'TOP_LEFT',
  
  /** Верхний правый угол. */
  TOP_RIGHT: 'TOP_RIGHT',
  
  /** Нижний левый угол. */
  BOTTOM_LEFT: 'BOTTOM_LEFT',
  
  /** Нижний правый угол. */
  BOTTOM_RIGHT: 'BOTTOM_RIGHT',
  
  /** Верхняя часть. */
  TOP: 'TOP',
  
  /** Нижняя часть. */
  BOTTOM: 'BOTTOM',
  
  /** Левая часть. */
  LEFT: 'LEFT',
  
  /** Правая часть. */
  RIGHT: 'RIGHT',
  
  /** Центр. */
  CENTER: 'CENTER'
}; 