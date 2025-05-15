/**
 * Модуль для работы с SGF-файлами (Smart Game Format).
 * Предоставляет функции для преобразования и обработки SGF-данных.
 * 
 * @module sgf
 */

import {
  colorToToken,
  colorToPlacement,
  markToProperty,
  propertyToMark,
  allSgfCoordsToPoints,
  pointToString,
  convertFromLabelData,
  convertFromLabelArray
} from './sgf.js';

// Экспортируем функции из sgf.js
export {
  colorToToken,
  colorToPlacement,
  markToProperty,
  propertyToMark,
  allSgfCoordsToPoints,
  pointToString,
  convertFromLabelData,
  convertFromLabelArray
};

// Для обратной совместимости
export const sgf = {
  colorToToken,
  colorToPlacement,
  markToProperty,
  propertyToMark,
  allSgfCoordsToPoints,
  pointToString,
  convertFromLabelData,
  convertFromLabelArray
}; 