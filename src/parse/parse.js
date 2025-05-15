/**
 * Модуль для парсинга строк Го-формата.
 * @module parse/parse
 */

import { toCamelCase } from '../util/enums.js';
import { initRootProperties } from '../rules/movetree.js';
import { sgf } from './sgf_parser.js';

/**
 * Типы парсинга
 * @enum {string}
 */
export const parseType = {
  /** FF1-FF4 Parse Type. */
  SGF: 'SGF',

  /** Tygem .gib files. */
  TYGEM: 'TYGEM',

  /**
   * УСТАРЕВШИЙ. Создан, когда я не понимал различия
   * между различными версиями FF1-3 и FF4
   *
   * Предпочитайте SGF, теперь это эквивалентно.
   */
  PANDANET: 'PANDANET',
};

/**
 * Список известных суффиксов и типов файлов, которым они соответствуют.
 * @type {!Object<string, string>}
 */
export const suffixToType = {
  '.sgf': 'SGF',
  '.gib': 'TYGEM',
};

/**
 * Определяет, является ли файл известным файлом Го.
 *
 * @param {string} filename Имя файла
 * @return {boolean} является ли имя файла известным типом
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
 * Получает тип парсинга из имени файла
 *
 * @param {string} filename Имя файла
 * @return {string} Тип парсинга
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
 * Парсит формат Го из строки.
 *
 * @param {string} str Сырое содержимое, которое нужно проанализировать.
 * @param {string} filename Имя файла, из которого пришло содержимое.
 * @return {!Object} Дерево ходов
 */
export function fromFileName(str, filename) {
  return fromString(
    str,
    parseTypeFromFilename(filename)
  );
}

/**
 * Преобразует строковый игровой файл в дерево ходов.
 *
 * @param {string} str Сырое содержимое, которое нужно проанализировать.
 * @param {string=} opt_ttype Тип парсинга. По умолчанию SGF,
 *    если не указан.
 * @return {!Object} Сгенерированное дерево ходов
 */
export function fromString(str, opt_ttype) {
  let ttype = opt_ttype || parseType.SGF;
  if (ttype === parseType.PANDANET) {
    // Тип PANDANET теперь эквивалентен SGF.
    ttype = parseType.SGF;
  }
  
  let moveTr;
  if (ttype === parseType.SGF) {
    moveTr = sgf(str);
  } else if (ttype === parseType.TYGEM) {
    // В настоящее время не поддерживается
    throw new Error('Tygem parsing not yet supported.');
  } else {
    throw new Error('Unknown parse type: ' + ttype);
  }
  
  return initRootProperties(moveTr);
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