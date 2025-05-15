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
  pointFromSgfCoord as sgfToPoint
} from '../../deps/glift-core/util/util.js';

// Импортируем класс Point
import { Point } from '../../deps/glift-core/util/point.js';

// Импортируем объектные утилиты
import * as objUtil from './obj.js';

// Импортируем утилиты цветов
import * as colorUtil from './colors.js';

// Импортируем утилиты массивов
import * as arrayUtil from './array.js';

import { states, marks, problemResults, rotations, boardRegions } from './enums.js';

// Экспортируем все утилиты
export {
  coordToString,
  stringToCoord,
  pointFromString,
  Point
};

// Экспортируем объектные утилиты
export * from './obj.js';

// Экспортируем утилиты цветов
export * from './colors.js';

// Экспортируем утилиты массивов
export * from './array.js';

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
 * Генератор ID для элементов.
 */
export const idGenerator = {
  next: () => {
    return 'id_' + Math.random().toString(36).substring(2, 9);
  }
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
      if (rotation === rotations.NO_ROTATION) {
        return point(x, y);
      }
      
      // Для квадратной доски размера size
      if (rotation === rotations.CLOCKWISE_90) {
        return point(y, size - 1 - x);
      } else if (rotation === rotations.CLOCKWISE_180) {
        return point(size - 1 - x, size - 1 - y);
      } else if (rotation === rotations.CLOCKWISE_270) {
        return point(size - 1 - y, x);
      }
      
      // Если неизвестный поворот, возвращаем исходную точку
      return point(x, y);
    },
    
    // Отменяет поворот точки на доске указанного размера
    antirotate: (size, rotation) => {
      if (rotation === rotations.NO_ROTATION) {
        return point(x, y);
      }
      
      // Для квадратной доски размера size
      if (rotation === rotations.CLOCKWISE_90) {
        return point(size - 1 - y, x);
      } else if (rotation === rotations.CLOCKWISE_180) {
        return point(size - 1 - x, size - 1 - y);
      } else if (rotation === rotations.CLOCKWISE_270) {
        return point(y, size - 1 - x);
      }
      
      // Если неизвестный поворот, возвращаем исходную точку
      return point(x, y);
    },
    
    // Преобразование в SGF-координату
    toSgfCoord: () => {
      const letters = 'abcdefghijklmnopqrstuvwxyz';
      return letters.charAt(x) + letters.charAt(y);
    }
  };
};

/**
 * Создает объект Point из SGF-координаты.
 * 
 * @param {string} sgfCoord - SGF-координата (например, 'ab')
 * @return {Object} Точка
 */
export const pointFromSgfCoord = (sgfCoord) => {
  if (!sgfCoord || sgfCoord.length !== 2) {
    throw new Error(`Некорректная SGF-координата: ${sgfCoord}`);
  }
  const letters = 'abcdefghijklmnopqrstuvwxyz';
  const x = letters.indexOf(sgfCoord.charAt(0));
  const y = letters.indexOf(sgfCoord.charAt(1));
  if (x < 0 || y < 0) {
    throw new Error(`Не удалось создать точку из строки: ${sgfCoord}`);
  }
  return point(x, y);
};

/**
 * Создает массив точек из SGF-свойства с форматом "aa:bb".
 * SGF-спецификация позволяет использовать прямоугольники для представления 
 * группы точек. Например, aa:cc представляет 9 точек в прямоугольнике 3x3.
 * 
 * @param {string} str - Строка в формате "tl:br", где tl - верхняя левая точка,
 *    а br - правая нижняя точка прямоугольника в SGF-координатах
 * @return {Array<Object>} Массив точек, представляющих все точки в прямоугольнике
 */
export const pointArrFromSgfProp = (str) => {
  if (!str) {
    return [];
  }
  
  const split = str.split(':');
  if (split.length !== 2) {
    // Если это не прямоугольник, просто возвращаем одну точку
    return [pointFromSgfCoord(str)];
  }
  
  const tl = pointFromSgfCoord(split[0]);
  const br = pointFromSgfCoord(split[1]);
  const points = [];
  
  for (let i = tl.x(); i <= br.x(); i++) {
    for (let j = tl.y(); j <= br.y(); j++) {
      points.push(point(i, j));
    }
  }
  
  return points;
};

// Экспортируем перечисления для использования в других модулях
export const enums = {
  states,
  marks,
  problemResults,
  rotations,
  boardRegions
}; 