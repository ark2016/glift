/**
 * Библиотека SGF содержит функции для работы с SGF-файлами.
 * Включает функции преобразования и утилиты для SGF.
 * 
 * @module sgf/sgf
 */

import { marks } from '../util/enums.js';
import { states } from '../util/enums.js';
import { pointFromSgfCoord } from '../util/index.js';
import { prop } from '../rules/all_properties.js';

/**
 * Преобразует цвет в токен для SGF.
 * @param {string} color - Цвет ('BLACK' или 'WHITE')
 * @return {string} Токен ('B' или 'W')
 */
export const colorToToken = (color) => {
  if (color === states.WHITE) {
    return 'W';
  } else if (color === states.BLACK) {
    return 'B';
  } else {
    throw new Error('Неизвестное преобразование цвета в токен для: ' + color);
  }
};

/**
 * Преобразует цвет в свойство размещения камня.
 * @param {string} color - Цвет ('BLACK' или 'WHITE')
 * @return {string} Свойство ('AW' или 'AB')
 */
export const colorToPlacement = (color) => {
  if (color === states.WHITE) {
    return 'AW';
  } else if (color === states.BLACK) {
    return 'AB';
  } else {
    throw new Error('Неизвестное преобразование цвета в токен для: ' + color);
  }
};

/**
 * Преобразует тип метки Glift в соответствующее свойство SGF.
 * @param {string} mark - Тип метки
 * @return {string|null} Свойство SGF или null если не найдено
 */
export const markToProperty = (mark) => {
  const markToPropertyMap = {
    LABEL_ALPHA: prop.LB,
    LABEL_NUMERIC: prop.LB,
    LABEL: prop.LB,
    XMARK: prop.MA,
    SQUARE: prop.SQ,
    CIRCLE: prop.CR,
    TRIANGLE: prop.TR,
  };
  return markToPropertyMap[mark] || null;
};

/**
 * Преобразует свойство SGF в соответствующий тип метки Glift.
 * @param {string} prop - Свойство SGF
 * @return {string|null} Тип метки или null если не найдено
 */
export const propertyToMark = (prop) => {
  const propertyToMarkMap = {
    LB: marks.LABEL,
    MA: marks.XMARK,
    SQ: marks.SQUARE,
    CR: marks.CIRCLE,
    TR: marks.TRIANGLE,
  };
  return propertyToMarkMap[prop] || null;
};

/**
 * Преобразует массив SGF-координат в массив точек Glift.
 * @param {Array<string>} arr - Массив SGF-координат
 * @return {Array<Object>} Массив точек
 */
export const allSgfCoordsToPoints = (arr) => {
  const out = [];
  if (!arr) {
    return out;
  }
  for (let i = 0; i < arr.length; i++) {
    out.push(pointFromSgfCoord(arr[i]));
  }
  return out;
};

/**
 * Преобразует точку в SGF-строку.
 * @param {Object} point - Точка
 * @return {string} SGF-координата
 */
export const pointToString = (point) => {
  if (!point || typeof point.x !== 'number' || typeof point.y !== 'number') {
    throw new Error('Недопустимая точка: ' + point);
  }
  const letters = 'abcdefghijklmnopqrstuvwxyz';
  return letters.charAt(point.x) + letters.charAt(point.y);
};

/**
 * Преобразует данные метки в простой объект.
 * @param {string} data - Данные метки
 * @return {Object} Объект с точкой и значением
 */
export const convertFromLabelData = (data) => {
  const parts = data.split(':');
  const pt = pointFromSgfCoord(parts[0]);
  const value = parts[1];
  return { point: pt, value: value };
};

/**
 * Преобразует массив данных меток в массив объектов.
 * @param {Array<string>} arr - Массив данных меток
 * @return {Array<Object>} Массив объектов с точками и значениями
 */
export const convertFromLabelArray = (arr) => {
  const out = [];
  for (let i = 0; i < arr.length; i++) {
    out.push(convertFromLabelData(arr[i]));
  }
  return out;
}; 