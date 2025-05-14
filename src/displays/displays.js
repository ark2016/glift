/**
 * Утилиты для отображения и функции создания доски.
 * @module displays
 */

// Импорты
import { create as createBoard } from './board/index.js';
import { environment } from './environment.js';
import { selectId } from '../dom/index.js';
import { orientation } from '../orientation/index.js';
import { point } from '../util/index.js';

/**
 * Создает SVG-доску для игры Го.
 *
 * @param {string} elemId ID DOM-элемента для контейнера доски
 * @param {!Object} boardBox Ограничивающий прямоугольник для размеров доски
 * @param {!Object} theme Тема Glift для стилизации
 * @param {string} boardRegion Регион для обрезки доски
 * @param {number} intersections Количество пересечений (9, 13, 19 и т.д.)
 * @param {string} rotation Опциональный поворот доски
 * @param {boolean} drawBoardCoords Отображать ли координаты на доске
 *
 * @return {!Object} Экземпляр отображения доски
 */
export function create(
  elemId,
  boardBox,
  theme,
  boardRegion,
  intersections,
  rotation,
  drawBoardCoords
) {
  const env = environment.get(
    boardBox,
    boardRegion,
    intersections,
    drawBoardCoords
  );

  return createBoard(elemId, env, theme, rotation);
}

/**
 * Создает ограничивающий прямоугольник для div-элемента на основе его размеров.
 * 
 * @param {string} divId ID div-элемента
 * @return {!Object} Ограничивающий прямоугольник для div
 */
export function bboxFromDiv(divId) {
  const elem = selectId(divId);
  return orientation.bbox.fromSides(
    point(0, 0),
    elem.width(),
    elem.height()
  );
}

/**
 * Создает ограничивающий прямоугольник для элемента относительно окна.
 * 
 * @param {string} elemId ID элемента
 * @return {!Object} Ограничивающий прямоугольник относительно окна
 */
export function bboxFromWindowSize(elemId) {
  const elem = selectId(elemId);
  const position = elem.boundingClientRect();
  
  return orientation.bbox.fromSides(
    point(position.left, position.top),
    position.width,
    position.height
  );
}
