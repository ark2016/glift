/**
 * Модуль статусбара для библиотеки Glift.
 * @module displays/statusbar
 */

import { StatusBar, createStatusBar } from './statusbar.js';
import { InfoWindow, createInfoWindow } from './info_window.js';
import { selectId, newElement } from '../../dom/index.js';

// Экспорт классов и функций
export {
  // Основной класс статусбара
  StatusBar,
  createStatusBar,
  
  // Информационное окно
  InfoWindow,
  createInfoWindow
};

/**
 * Модуль отображения статусной панели для библиотеки Glift.
 * Содержит классы и функции для отображения статусной информации игры.
 */

/**
 * Создает отображение статусной панели.
 * @param {Object} options - Опции для создания панели
 * @return {Object} Созданное отображение статусной панели
 */
export const create = (options = {}) => {
  return createStatusBar(options);
};

/**
 * Типы отображений статусбара.
 * @enum {string}
 * @const
 */
export const STATUSBAR_TYPE = Object.freeze({
  /** Стандартный статусбар */
  STANDARD: 'STANDARD',
  
  /** Статусбар с информационным окном */
  WITH_INFO: 'WITH_INFO',
  
  /** Минимальный статусбар */
  MINIMAL: 'MINIMAL'
}); 