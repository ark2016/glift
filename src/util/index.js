/**
 * Модуль утилит для библиотеки Glift.
 * Содержит основные вспомогательные функции и классы.
 * 
 * @module util
 */

// Импортируем базовые утилиты из glift-core
import { 
  coordToString,
  stringToCoord,
  pointFromString,
  pointFromSgfCoord
} from '../../deps/glift-core/util/util.js';

// Импортируем класс Point
import { Point } from '../../deps/glift-core/util/point.js';

import * as enumValues from './enums.js';

// Экспортируем все утилиты
export {
  coordToString,
  stringToCoord,
  pointFromString,
  pointFromSgfCoord,
  Point
};

/**
 * Проверяет, является ли значение определенным (не undefined и не null).
 * @param {*} val - Проверяемое значение
 * @return {boolean} true, если значение определено
 */
export const defined = (val) => val !== undefined && val !== null;

/**
 * Генерирует уникальный идентификатор.
 * @return {string} Уникальный идентификатор
 */
export const uuid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

/**
 * Объединяет несколько объектов в один.
 * @param {Object} target - Целевой объект
 * @param {...Object} sources - Исходные объекты
 * @return {Object} Объединенный объект
 */
export const mergeObjects = (target, ...sources) => {
  return Object.assign(target, ...sources);
};

// Экспортируем перечисления
export const enums = enumValues;

/**
 * Функция для определения типа переменной.
 * Более точная, чем встроенный оператор typeof.
 * 
 * @param {*} obj - Объект для проверки типа
 * @return {string} Тип объекта
 */
export const typeOf = (obj) => {
  if (obj === null) {
    return 'null';
  }
  
  if (Array.isArray(obj)) {
    return 'array';
  }
  
  return typeof obj;
};

/**
 * Создает глубокую копию объекта.
 * 
 * @param {*} obj - Объект для клонирования
 * @return {*} Клон объекта
 */
export const clone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Создает простую копию объекта (без вложенных объектов).
 * 
 * @param {Object} obj - Объект для клонирования
 * @return {Object} Клон объекта
 */
export const simpleClone = (obj) => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return [...obj];
  }
  
  return {...obj};
};

/**
 * Создает точку (координату) на доске.
 * 
 * @param {number} x - Координата X
 * @param {number} y - Координата Y
 * @return {Object} Объект точки
 */
export const point = (x, y) => {
  return {
    x: () => x,
    y: () => y,
    equals: (pt) => x === pt.x() && y === pt.y(),
    toString: () => `(${x},${y})`,
    
    // Поворачивает точку на доске указанного размера
    rotate: (size, rotation) => {
      if (rotation === enums.rotations.NO_ROTATION) {
        return point(x, y);
      }
      
      // Для квадратной доски размера size
      if (rotation === enums.rotations.CLOCKWISE_90) {
        return point(y, size - 1 - x);
      } else if (rotation === enums.rotations.CLOCKWISE_180) {
        return point(size - 1 - x, size - 1 - y);
      } else if (rotation === enums.rotations.CLOCKWISE_270) {
        return point(size - 1 - y, x);
      }
      
      // Если неизвестный поворот, возвращаем исходную точку
      return point(x, y);
    },
    
    // Отменяет поворот точки на доске указанного размера
    antirotate: (size, rotation) => {
      if (rotation === enums.rotations.NO_ROTATION) {
        return point(x, y);
      }
      
      // Для квадратной доски размера size
      if (rotation === enums.rotations.CLOCKWISE_90) {
        return point(size - 1 - y, x);
      } else if (rotation === enums.rotations.CLOCKWISE_180) {
        return point(size - 1 - x, size - 1 - y);
      } else if (rotation === enums.rotations.CLOCKWISE_270) {
        return point(y, size - 1 - x);
      }
      
      // Если неизвестный поворот, возвращаем исходную точку
      return point(x, y);
    }
  };
}; 