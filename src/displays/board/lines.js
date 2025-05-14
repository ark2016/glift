/**
 * @fileoverview Модуль для отображения линий на доске Го.
 * 
 * @module displays/board/lines
 */

import * as svg from '../../svg/index.js';
import { Point } from '../../util/index.js';

/**
 * Создает группу линий на доске.
 * 
 * @param {SvgElement} svgObj - SVG объект, куда добавляются линии
 * @param {IdGenerator} idGen - Генератор идентификаторов
 * @param {BoardPoints} boardPoints - Точки доски
 * @param {Object} theme - Тема оформления
 * @return {SvgElement} Группа линий
 */
export const lines = (svgObj, idGen, boardPoints, theme) => {
  const container = svg.group().setId(idGen.lineGroup());
  svgObj.append(container);

  const data = boardPoints.data();
  for (let i = 0, ii = data.length; i < ii; i++) {
    const pt = data[i];
    container.append(
      svg.path()
        .setAttr('d', intersectionLine(
          pt,
          boardPoints.radius,
          boardPoints.numIntersections
        ))
        .setAttr('stroke', theme.lines.stroke)
        .setAttr('stroke-width', theme.lines['stroke-width'])
        .setAttr('stroke-linecap', 'round')
        .setId(idGen.line(pt.intPt))
    );
  }
  
  return container;
};

/**
 * Создает SVG путь для линий пересечения.
 * 
 * @param {BoardPt} boardPt - Точка доски
 * @param {number} radius - Радиус между линиями
 * @param {number} numIntersections - Количество пересечений на доске
 * @return {string} SVG путь
 */
export const intersectionLine = (boardPt, radius, numIntersections) => {
  // minIntersects: 0 indexed,
  // maxIntersects: 0 indexed,
  // numIntersections: 1 indexed (количество пересечений)
  const minIntersects = 0;
  const maxIntersects = numIntersections - 1;
  
  const coordinate = boardPt.coordPt;
  const intersection = boardPt.intPt;
  
  const top = intersection.y() === minIntersects
    ? coordinate.y()
    : coordinate.y() - radius;
    
  const bottom = intersection.y() === maxIntersects
    ? coordinate.y()
    : coordinate.y() + radius;
    
  const left = intersection.x() === minIntersects
    ? coordinate.x()
    : coordinate.x() - radius;
    
  const right = intersection.x() === maxIntersects
    ? coordinate.x()
    : coordinate.x() + radius;
    
  // Создаем SVG путь
  return `M ${coordinate.x()},${top} L ${coordinate.x()},${bottom} M ${left},${coordinate.y()} L ${right},${coordinate.y()}`;
};
