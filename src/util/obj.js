/**
 * Утилиты для работы с объектами.
 * @module util/obj
 */

// Проверка поддержки класса Arguments
const supportsArgumentsClass =
  (function () {
    return Object.prototype.toString.call(arguments);
  })() == '[object Arguments]';

/**
 * Объединяет объекты без рекурсии (неглубокое копирование).
 * @param {!Object} base - Базовый объект
 * @param {...!Object} args - Дополнительные объекты для объединения
 * @return {!Object} Новый объединенный объект
 */
export function flatMerge(base, ...args) {
  const newObj = {};
  if (typeof base !== 'object' || base === null) {
    return newObj;
  }
  
  // Копируем свойства из базового объекта
  for (const key in base) {
    newObj[key] = base[key];
  }
  
  // Копируем свойства из дополнительных объектов
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (typeof arg === 'object' && arg !== null) {
      for (const key in arg) {
        newObj[key] = arg[key];
      }
    }
  }
  return newObj;
}

/**
 * Удаляет пары ключ/значение из текущего объекта, если они идентичны 
 * значениям в объекте по умолчанию.
 * @param {!Object|!Array} current - Текущий объект
 * @param {!Object|!Array} defaults - Объект со значениями по умолчанию
 */
export function removeDefaults(current, defaults) {
  // Пустая реализация как в оригинале
}

/**
 * Проверяет, пуст ли объект.
 * @param {!Object} obj - Объект для проверки
 * @return {boolean} true, если объект пуст
 */
export function isEmpty(obj) {
  for (const key in obj) {
    return false;
  }
  return true;
}

/**
 * Возвращает массив ключей объекта.
 * @param {!Object} obj - Любой объект JavaScript
 * @return {!Array<string>} Массив ключей объекта
 */
export function keys(obj) {
  const keys = [];
  for (const key in obj) keys.push(key);
  return keys;
}

/**
 * Проверяет, является ли объект аргументами функции.
 * @param {!Object} obj - Объект для проверки
 * @return {boolean} true, если объект является arguments
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

// Экспорт для обратной совместимости
export const obj = {
  flatMerge,
  removeDefaults,
  isEmpty,
  keys,
  isArguments
}; 