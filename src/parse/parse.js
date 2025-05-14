/**
 * Модуль парсинга для строк Glift.
 * @module parse/parse
 */

import { toCamelCase } from '../util/enums.js';
import { movetree } from '../rules/movetree.js';
import { parseType } from './index.js';

/**
 * Список известных расширений файлов и соответствующих им типов парсеров.
 * @type {!Object<string, string>}
 */
export const suffixToType = {
  '.sgf': 'SGF',
  '.gib': 'TYGEM',
};

/**
 * Определяет, является ли файл известным файлом Го.
 *
 * @param {string} filename - Имя файла
 * @return {boolean} Является ли файл с таким именем известным типом
 */
export function knownGoFile(filename) {
  if (!filename || typeof filename !== 'string') {
    return false;
  }
  for (const key in suffixToType) {
    if (filename.indexOf(key) > -1) {
      return true;
    }
  }
  return false;
}

/**
 * Получить тип парсера из имени файла.
 *
 * @param {string} filename - Имя файла
 * @return {string} Тип парсера
 */
export function parseTypeFromFilename(filename) {
  let ttype = parseType.SGF; // тип по умолчанию = SGF.
  for (const key in suffixToType) {
    if (filename.indexOf(key) > -1) {
      ttype = suffixToType[key];
    }
  }
  return ttype;
}

/**
 * Разбирает строку в формате Го по имени файла.
 *
 * @param {string} str - Необработанное содержимое, которое нужно разобрать
 * @param {string} filename - Имя файла, из которого взято содержимое
 * @return {!Object} Дерево ходов
 */
export function fromFileName(str, filename) {
  return fromString(
    str,
    parseTypeFromFilename(filename)
  );
}

/**
 * Преобразует строку игрового файла в дерево ходов.
 *
 * @param {string} str - Необработанное содержимое, которое нужно разобрать
 * @param {string=} opt_ttype - Тип парсера. По умолчанию SGF, если не указан
 * @return {!Object} Сгенерированное дерево ходов
 */
export function fromString(str, opt_ttype) {
  let ttype = opt_ttype || parseType.SGF;
  if (ttype === parseType.PANDANET) {
    // Тип PANDANET теперь эквивалентен SGF.
    ttype = parseType.SGF;
  }
  const methodName = toCamelCase(ttype);
  const func = methodMap[methodName];
  
  if (!func) {
    throw new Error(`Неизвестный тип парсера: ${ttype}`);
  }
  
  const moveTree = func(str);
  return movetree.initRootProperties(moveTree);
}

// Экспорт для обратной совместимости
export const parseObj = {
  parseType,
  suffixToType,
  knownGoFile,
  parseTypeFromFilename,
  fromFileName,
  fromString
};

// Карта методов будет заполнена в index.js после импорта всех парсеров
export const methodMap = {}; 