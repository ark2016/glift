/**
 * Модуль SGF (Smart Game Format) для работы с файлами Go.
 * 
 * Этот модуль содержит вспомогательные функции для работы с SGF файлами.
 * 
 * @module sgf
 */

import { pointArrFromSgfProp } from '../util/index.js';
import { enums } from '../util/index.js';

/**
 * Преобразует внутреннее представление цвета в SGF-токен.
 * 
 * @param {string} color - Цвет в формате состояния (BLACK/WHITE)
 * @return {string} Токен цвета в SGF формате (B/W)
 */
export const colorToToken = (color) => {
  if (color === enums.states.BLACK) {
    return 'B';
  } else if (color === enums.states.WHITE) {
    return 'W';
  }
  return null;
};

/**
 * Преобразует внутреннее представление цвета в SGF свойство.
 * 
 * @param {string} color - Цвет в формате состояния (BLACK/WHITE)
 * @return {string} SGF-свойство для размещения камня (B/W)
 */
export const colorToPlacement = (color) => {
  return colorToToken(color);
};

/**
 * Преобразует внутреннее представление метки в SGF-свойство.
 * 
 * @param {string} mark - Внутреннее представление метки
 * @return {string} SGF-свойство метки
 */
export const markToProperty = (mark) => {
  if (mark === enums.marks.TRIANGLE) {
    return 'TR';
  } else if (mark === enums.marks.SQUARE) {
    return 'SQ';
  } else if (mark === enums.marks.CIRCLE) {
    return 'CR';
  } else if (mark === enums.marks.LABEL) {
    return 'LB';
  } else if (mark === enums.marks.XMARK) {
    return 'MA';
  }
  return null;
};

/**
 * Преобразует SGF-свойство метки во внутреннее представление.
 * 
 * @param {string} prop - SGF-свойство метки
 * @return {string} Внутреннее представление метки
 */
export const propertyToMark = (prop) => {
  if (prop === 'TR') {
    return enums.marks.TRIANGLE;
  } else if (prop === 'SQ') {
    return enums.marks.SQUARE;
  } else if (prop === 'CR') {
    return enums.marks.CIRCLE;
  } else if (prop === 'LB') {
    return enums.marks.LABEL;
  } else if (prop === 'MA') {
    return enums.marks.XMARK;
  }
  return null;
};

/**
 * Преобразует SGF-координаты точек в массив объектов точек.
 * 
 * @param {string} str - Строка с SGF-координатами
 * @return {Array<Object>} Массив объектов точек
 */
export const allSgfCoordsToPoints = (str) => {
  if (!str) {
    return [];
  }
  const out = [];
  const coordstrs = str.split(',');
  for (let i = 0; i < coordstrs.length; i++) {
    const coords = pointArrFromSgfProp(coordstrs[i]);
    for (let j = 0; j < coords.length; j++) {
      out.push(coords[j]);
    }
  }
  return out;
};

/**
 * Преобразует внутренний объект точки в строку.
 * 
 * @param {Object} pt - Объект точки
 * @return {string} Строковое представление точки
 */
export const pointToString = (pt) => {
  return pt ? String.fromCharCode(97 + pt.x()) + String.fromCharCode(97 + pt.y()) : '';
};

/**
 * Преобразует данные о метках в формат SGF.
 * 
 * @param {Object} map - Объект с метками
 * @return {Array<string>} Массив меток в формате SGF
 */
export const convertFromLabelData = (map) => {
  const out = [];
  for (const key in map) {
    if (map.hasOwnProperty(key)) {
      const value = map[key];
      const sgfCoord = pointToString(value.point);
      out.push(sgfCoord + ':' + value.label);
    }
  }
  return out;
};

/**
 * Преобразует массив меток в формат SGF.
 * 
 * @param {Array<Object>} labels - Массив с объектами меток
 * @return {Array<string>} Массив меток в формате SGF
 */
export const convertFromLabelArray = (labels) => {
  const out = [];
  for (let i = 0; i < labels.length; i++) {
    const label = labels[i];
    const sgfCoord = pointToString(label.point);
    out.push(sgfCoord + ':' + label.label);
  }
  return out;
}; 