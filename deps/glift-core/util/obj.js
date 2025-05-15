/**
 * Модуль для работы с объектами в Glift.
 * @module util/obj
 */

// Проверка поддержки класса аргументов
const supportsArgumentsClass = 
  (function() {
    return Object.prototype.toString.call(arguments);
  })() == '[object Arguments]';

/**
 * Помощник для объединения информации объектов (обычно правила CSS или SVG).
 * Этот метод нерекурсивный и выполняет только поверхностное копирование.
 *
 * @param {!Object} base - Базовый объект
 * @param {...!Object} varArgs - Дополнительные объекты для объединения
 * @return {!Object} Объединенный объект
 */
export function flatMerge(base, ...varArgs) {
  const newObj = {};
  if (typeof base !== 'object') {
    return newObj;
  }
  
  for (const key in base) {
    newObj[key] = base[key];
  }
  
  for (let i = 0; i < varArgs.length; i++) {
    const arg = varArgs[i];
    if (typeof arg === 'object') {
      for (const key in arg) {
        newObj[key] = arg[key];
      }
    }
  }
  
  return newObj;
}

/**
 * Удаляет пары ключ/значение из текущего объекта, когда они точно 
 * такие же, как в объекте по умолчанию.
 * 
 * @param {!Object|!Array} current - Текущий объект
 * @param {!Object|!Array} defaults - Объект с значениями по умолчанию
 */
export function removeDefaults(current, defaults) {
  // Имплементация отсутствует в оригинале
}

/**
 * Проверяет, пуст ли объект.
 * 
 * @param {!Object} obj - Проверяемый объект
 * @return {boolean} true, если объект пуст, false в противном случае
 */
export function isEmpty(obj) {
  for (const key in obj) {
    return false;
  }
  return true;
}

/**
 * Получает ключи объекта.
 * 
 * @param {!Object} obj - Любой JS объект
 * @return {!Array<string>} Ключи объекта
 */
export function keys(obj) {
  const keys = [];
  for (const key in obj) keys.push(key);
  return keys;
}

/**
 * Проверяет, является ли объект аргументами функции.
 * 
 * @param {!Object} obj - Проверяемый объект
 * @return {boolean} true, если объект является аргументами функции
 */
export function isArguments(obj) {
  if (supportsArgumentsClass) {
    return Object.prototype.toString.call(obj) == '[object Arguments]';
  } else {
    return (
      (obj &&
        typeof obj == 'object' &&
        typeof obj.length == 'number' &&
        Object.prototype.hasOwnProperty.call(obj, 'callee') &&
        !Object.prototype.propertyIsEnumerable.call(obj, 'callee')) ||
      false
    );
  }
}

/**
 * Экспорт для обратной совместимости
 */
export const obj = {
  flatMerge,
  removeDefaults,
  isEmpty,
  keys,
  isArguments
};
