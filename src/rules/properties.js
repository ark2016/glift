/**
 * Модуль для работы со свойствами SGF.
 * @module rules/properties
 */

/**
 * Коллекция ходов.
 *
 * @typedef {{
 *  WHITE: !Array<!Object>,
 *  BLACK: !Array<!Object>
 * }}
 */
export let MoveCollection;

/**
 * Значение отметки. Инкапсулирует тип свойств отметки.
 * @typedef {{
 *  point: !Object,
 *  value: string
 * }}
 */
export let MarkValue;

/**
 * Коллекция отметок.
 *
 * @typedef {!Object<string, !Array<!MarkValue>>}
 */
export let MarkCollection;

/**
 * Объект, описывающий свойство.
 *
 * Пример:
 * {
 *  prop: 'GN',
 *  displayName: 'Game Name',
 *  value: 'Lee Sedol vs Gu Li'
 * }
 *
 * @typedef {{
 *  prop: string,
 *  displayName: string,
 *  value: string
 * }}
 */
export let PropDescriptor;

/**
 * Свойства, которые принимают значения точек.
 * @type {!Object<string, boolean>}
 */
export const propertiesWithPts = {
  // Отметки
  CR: true,
  LB: true,
  MA: true,
  SQ: true,
  TR: true,
  // Камни
  B: true,
  W: true,
  AW: true,
  AB: true,
  // Очистка камней
  AE: true,
  // Разное
  AR: true, // стрелка
  DD: true, // серая область
  LN: true, // линия
  TB: true, // территория черных
  TW: true, // территория белых
};

/**
 * Класс Properties для работы со свойствами SGF.
 */
export class Properties {
  /**
   * @param {!Object<string, !Array<string>>=} opt_map
   */
  constructor(opt_map) {
    /** @package {!Object<string, !Array<string>>} */
    this.propMap = opt_map || {};
  }

  /**
   * Добавляет свойство SGF к текущему ходу.
   *
   * @param {string} prop Свойство SGF в формате FF4 (например, AB)
   * @param {string|!Array<string>} value Строка или массив строк
   * @return {!Properties} this для цепочки вызовов
   */
  add(prop, value) {
    // Проверка на валидность свойства можно реализовать более полно
    let finished = [];
    if (typeof value === 'string') {
      finished = [value];
    } else {
      finished = value;
    }

    // Если тип - строка, преобразуем в массив или конкатенируем
    if (this.contains(prop)) {
      this.propMap[prop] = this.getAllValues(prop).concat(finished);
    } else {
      this.propMap[prop] = finished;
    }
    return this;
  }

  /**
   * Возвращает массив данных, связанных с ключом свойства.
   * Если свойство не существует, возвращает null.
   *
   * @param {string} strProp Ключ свойства
   * @return {?Array<string>} Массив значений или null
   */
  getAllValues(strProp) {
    if (this.propMap[strProp]) {
      return this.propMap[strProp].slice(); // Возвращаем поверхностную копию
    } else {
      return null;
    }
  }

  /**
   * Получает один элемент данных, связанный со свойством.
   *
   * @param {string} prop Свойство
   * @param {number=} opt_index Опциональный индекс (по умолчанию 0)
   * @return {?string} Строковое свойство или null
   */
  getOneValue(prop, opt_index) {
    const index = opt_index || 0;
    const arr = this.getAllValues(prop);
    if (arr && arr.length >= 1) {
      return arr[index];
    } else {
      return null;
    }
  }

  /**
   * Проверяет, содержит ли объект свойств указанное свойство.
   *
   * @param {string} prop Свойство для проверки
   * @return {boolean} True, если свойство существует
   */
  contains(prop) {
    return this.propMap[prop] !== undefined;
  }

  /**
   * Удаляет свойство.
   *
   * @param {string} prop Свойство для удаления
   * @return {!Properties} this для цепочки вызовов
   */
  remove(prop) {
    if (this.contains(prop)) {
      delete this.propMap[prop];
    }
    return this;
  }

  /**
   * Возвращает все ключи в propMap.
   * @return {!Array<string>} Массив ключей
   */
  getKeys() {
    return Object.keys(this.propMap);
  }
}

/**
 * Создает новый объект Properties.
 * @param {!Object<string, !Array<string>>=} opt_map
 * @return {!Properties}
 */
export function properties(opt_map) {
  return new Properties(opt_map);
}

// Экспорт для обратной совместимости
export { properties as props }; 