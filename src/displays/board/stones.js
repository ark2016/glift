/**
 * Модуль для отображения камней на доске Го.
 * 
 * @module displays/board/stones
 */

import * as svg from '../../svg/index.js';

/**
 * Создает камни на доске. Они изначально невидимы для пользователя,
 * но все они существуют на момент создания доски Го.
 *
 * @param {svg.SvgElement} svgObj - Базовый SVG объект
 * @param {svg.IdGenerator} idGen - Генератор ID для SVG
 * @param {Object} boardPoints - Объект с точками доски
 * @param {Object} theme - Объект темы оформления
 * @return {svg.SvgElement} Контейнер с камнями
 */
export const stones = (svgObj, idGen, boardPoints, theme) => {
  const container = svg.group().setId(idGen.stoneGroup());
  svgObj.append(container);
  
  const data = boardPoints.data();
  for (let i = 0, ii = data.length; i < ii; i++) {
    const pt = data[i];
    container.append(
      svg.circle()
        .setAttr('cx', pt.coordPt.x())
        .setAttr('cy', pt.coordPt.y())
        .setAttr('r', boardPoints.radius - 0.4) // уменьшаем для учета обводки
        .setAttr('opacity', 0)
        .setAttr('stone_color', 'EMPTY')
        .setAttr('fill', 'blue') // временный цвет
        .setAttr('class', 'stone')
        .setId(idGen.stone(pt.intPt))
    );
  }
  
  return container;
};

/**
 * Создает тени для камней Го. Они изначально невидимы для пользователя,
 * но могут стать видимыми позже (например, при наведении мыши). Тени 
 * создаются только если тема содержит настройки для теней.
 *
 * @param {svg.SvgElement} svgObj - Базовый SVG объект
 * @param {svg.IdGenerator} idGen - Генератор ID для SVG
 * @param {Object} boardPoints - Объект с точками доски
 * @param {Object} theme - Объект темы оформления
 * @return {svg.SvgElement|Object} Контейнер с тенями или пустой объект
 */
export const shadows = (svgObj, idGen, boardPoints, theme) => {
  if (theme.stones.shadows === undefined) {
    return {};
  }
  
  const container = svg.group().setId(idGen.stoneShadowGroup());
  svgObj.append(container);
  
  const data = boardPoints.data();
  for (let i = 0, ii = data.length; i < ii; i++) {
    const pt = data[i];
    container.append(
      svg.circle()
        .setAttr('cx', pt.coordPt.x() + boardPoints.radius / 7)
        .setAttr('cy', pt.coordPt.y() + boardPoints.radius / 7)
        .setAttr('r', boardPoints.radius - 0.4)
        .setAttr('opacity', 0)
        .setAttr('fill', theme.stones.shadows.fill)
        .setAttr('class', 'stone-shadow')
        .setId(idGen.stoneShadow(pt.intPt))
    );
  }
  
  return container;
};
