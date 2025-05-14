/**
 * Базовые компоненты для отображения доски Го.
 * 
 * @module displays/board/board_base
 */

import * as svg from '../../svg/index.js';

/**
 * Создает базовую структуру доски.
 * @param {Object} svgObj - SVG объект для доски
 * @param {Object} idGen - Генератор идентификаторов
 * @param {Object} goBox - Размеры доски
 * @param {Object} theme - Тема оформления
 */
export const boardBase = (svgObj, idGen, goBox, theme) => {
  if (theme.board.imagefill) {
    svgObj.append(
      svg.image()
        .setAttr('x', goBox.topLeft().x())
        .setAttr('y', goBox.topLeft().y())
        .setAttr('width', goBox.width())
        .setAttr('height', goBox.height())
        .setAttr('xlink:href', theme.board.imagefill)
        .setAttr('preserveAspectRatio', 'none')
    );
  }

  // Создаем основной прямоугольник доски
  const boardBase = svg.path({
    fill: theme.board?.fill || '#DCB35C',
    stroke: theme.board?.borderColor || '#000000',
    'stroke-width': 1
  });
  
  const width = goBox.width();
  const height = goBox.height();
  
  // Простой прямоугольник для доски
  const pathStr = `M0,0 L${width},0 L${width},${height} L0,${height} Z`;
  boardBase.setAttr('d', pathStr);
  
  svgObj.append(boardBase);
};

/**
 * Инициализирует фильтр размытия для теней.
 * @param {string} divId - ID div-контейнера
 * @param {Object} svgObj - SVG объект
 */
export const initBlurFilter = (divId, svgObj) => {
  // Заглушка - в полной реализации здесь будет создаваться SVG-фильтр для теней
  console.log('Инициализация фильтра размытия для доски в', divId);
};
