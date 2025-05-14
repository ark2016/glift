/**
 * Глобальные настройки и переменные Glift.
 * 
 * @module global
 */

/**
 * ID активного экземпляра Glift.
 * @type {string|null}
 */
export let activeInstanceId = null;

/**
 * Реестр экземпляров Glift.
 * @type {Object}
 */
export const instanceRegistry = {};

/**
 * Возвращает активный экземпляр Glift или null, если нет активного экземпляра.
 * @return {Object|null} Активный экземпляр Glift
 */
export const activeInstance = () => {
  if (activeInstanceId && instanceRegistry[activeInstanceId]) {
    return instanceRegistry[activeInstanceId];
  }
  return null;
};

/**
 * Глобальные настройки по умолчанию.
 * @type {Object}
 */
export const settings = {
  /**
   * Режим отладки. Если true, выводит дополнительную информацию в консоль.
   * @type {boolean}
   */
  debug: false,
  
  /**
   * Добавлять ли метки (координаты) на доску по умолчанию.
   * @type {boolean}
   */
  drawBoardCoords: true,
  
  /**
   * Тема по умолчанию.
   * @type {string}
   */
  theme: 'DEFAULT'
};

/**
 * Включает режим отладки.
 */
export const enableDebug = () => {
  settings.debug = true;
};

/**
 * Отключает режим отладки.
 */
export const disableDebug = () => {
  settings.debug = false;
};

/**
 * Выводит отладочное сообщение, если включен режим отладки.
 * @param {string} message Сообщение для вывода
 * @param {...*} args Дополнительные аргументы
 */
export const log = (message, ...args) => {
  if (settings.debug) {
    console.log(`[Glift] ${message}`, ...args);
  }
};
