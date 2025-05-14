/**
 * Модуль для центрирования иконок в пользовательском интерфейсе.
 * @module displays/icons/icon_centering
 */

import { displays } from '../../displays/displays.js';

/**
 * Направление центрирования строки
 * @enum {string}
 * @private
 */
const CenterDir = {
  H: 'h',
  V: 'v',
};

/**
 * Центрирование массива обёрнутых иконок по строке.
 *
 * @param {!Object} divBbox Ограничивающий прямоугольник div-элемента
 * @param {!Array<!Object>} wrappedIcons Массив обёрнутых иконок
 * @param {number} vMargin Вертикальный отступ
 * @param {number} hMargin Горизонтальный отступ
 * @param {number=} opt_minSpacing Минимальный интервал
 * @return {Array<Object>} Массив трансформаций
 */
export function rowCenterWrapped(
  divBbox,
  wrappedIcons,
  vMargin,
  hMargin,
  opt_minSpacing
) {
  const minSpacing = opt_minSpacing || 0;
  return _centerWrapped(
    divBbox,
    wrappedIcons,
    vMargin,
    hMargin,
    minSpacing,
    CenterDir.H
  );
}

/**
 * Центрирование массива обёрнутых иконок по столбцу.
 *
 * @param {!Object} divBbox Ограничивающий прямоугольник div-элемента
 * @param {!Array<!Object>} wrappedIcons Массив обёрнутых иконок
 * @param {number} vMargin Вертикальный отступ
 * @param {number} hMargin Горизонтальный отступ
 * @param {number=} opt_minSpacing Минимальный интервал
 * @return {Array<Object>} Массив трансформаций
 */
export function columnCenterWrapped(
  divBbox,
  wrappedIcons,
  vMargin,
  hMargin,
  opt_minSpacing
) {
  const minSpacing = opt_minSpacing || 0;
  return _centerWrapped(
    divBbox,
    wrappedIcons,
    vMargin,
    hMargin,
    minSpacing,
    CenterDir.V
  );
}

/**
 * Центрирование обёрнутых иконок
 *
 * @private
 *
 * @param {!Object} divBbox Ограничивающий прямоугольник div-элемента
 * @param {!Array<!Object>} wrappedIcons Массив обёрнутых иконок
 * @param {number} vMargin Вертикальный отступ
 * @param {number} hMargin Горизонтальный отступ
 * @param {number} minSpacing Минимальный интервал
 * @param {string} direction Направление центрирования
 * @return {Array<Object>} Массив трансформаций
 */
function _centerWrapped(
  divBbox,
  wrappedIcons,
  vMargin,
  hMargin,
  minSpacing,
  direction
) {
  const bboxes = [];
  let centeringData;
  if (
    direction !== CenterDir.H &&
    direction !== CenterDir.V
  ) {
    direction = CenterDir.H;
  }
  for (let i = 0; i < wrappedIcons.length; i++) {
    bboxes.push(wrappedIcons[i].bbox);
  }

  // Row center returns: { transforms: [...], bboxes: [...] }
  if (direction === CenterDir.H) {
    centeringData = displays.rowCenterSimple(
      divBbox,
      bboxes,
      vMargin,
      hMargin,
      minSpacing
    );
  } else {
    centeringData = displays.columnCenterSimple(
      divBbox,
      bboxes,
      vMargin,
      hMargin,
      minSpacing
    );
  }
  const transforms = centeringData.transforms;

  // TODO(kashomon): Могут ли трансформации быть меньше центрированных иконок? 
  // Думаю, да. В любом случае, этот случай, вероятно, нужно обработать.
  for (let j = 0; j < transforms.length && j < wrappedIcons.length; j++) {
    wrappedIcons[j].performTransform(transforms[j]);
  }
  return transforms;
}

/**
 * Объединение функций модуля для обратной совместимости
 */
export const iconCentering = {
  rowCenterWrapped,
  columnCenterWrapped,
  _centerWrapped
};
