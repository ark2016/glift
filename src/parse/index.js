/**
 * Модуль для разбора SGF-файлов и других форматов.
 * @module parse
 */

// Импортируем все необходимые модули
import * as parseUtils from './parse.js';
import { sgf, sgfEscape, sgfUnescape, sgfMetadataProperty } from './sgf.js';
import { tygem } from './tygem.js';

/**
 * Типы парсеров
 * @enum {string}
 */
export const parseType = {
  /** Стандартный SGF */
  SGF: 'SGF',
  /** Формат TYGEM */
  TYGEM: 'TYGEM',
  /** Формат PANDANET */
  PANDANET: 'PANDANET'
};

// Заполняем карту методов парсинга
parseUtils.methodMap.sgf = sgf;
parseUtils.methodMap.tygem = tygem;

// Экспортируем все функции из parse.js
export const {
  suffixToType,
  knownGoFile,
  parseTypeFromFilename,
  fromFileName,
  fromString
} = parseUtils;

// Экспортируем функции SGF
export {
  sgf,
  sgfEscape,
  sgfUnescape,
  sgfMetadataProperty
};

// Экспортируем функцию Tygem
export { tygem };

// Экспорт для обратной совместимости
export const parse = {
  parseType,
  suffixToType,
  knownGoFile,
  parseTypeFromFilename,
  fromFileName,
  fromString,
  sgf,
  sgfEscape,
  sgfUnescape,
  sgfMetadataProperty,
  tygem
}; 