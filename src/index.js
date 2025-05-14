/**
 * @preserve Glift: Модульная библиотека JavaScript для игры Го.
 *
 * @copyright Josh Hoak
 * @license MIT License (see LICENSE.txt)
 */

/**
 * Главная точка входа для библиотеки Glift.
 * 
 * Этот файл экспортирует все публичные части API Glift.
 * 
 * @module glift
 */

// Импортируем мост для Google Closure Library
import goog from './goog-bridge.js';

// Импортируем основные компоненты
import * as util from './util/index.js';
import * as widgets from './widgets/index.js';
import * as displays from './displays/index.js';
import * as controllers from './controllers/index.js';
import * as themes from './themes/index.js';
import * as api from './api/index.js';
import * as dom from './dom/index.js';
import { setupGlobalGlift } from './exports.js';

// Версия библиотеки
export const VERSION = '2.0.0-alpha';

// Создаем глобальный объект для совместимости
export const global = {
  version: VERSION,
  activeInstanceId: null,
  instanceRegistry: {}
};

// Функция инициализации библиотеки
export const init = (disableZoomForMobile, divId) => {
  if (disableZoomForMobile) {
    dom.selectId(document.body).attr('style', 'touch-action: manipulation;');
  }
  
  console.log('Glift инициализирован в контейнере:', divId);
};

// Создаем функцию для создания экземпляра Glift
export const create = api.create;

// Для обратной совместимости - создаем глобальный объект glift
setupGlobalGlift();

// Экспортируем публичное API
export {
  util,
  widgets,
  displays,
  controllers,
  themes,
  api,
  dom
};

// Экспорт по умолчанию для совместимости с UMD
const gliftExport = {
  VERSION,
  create,
  util,
  widgets,
  displays,
  controllers,
  themes,
  api,
  dom,
  global
};

export default gliftExport;

// Экспорт модулей в качестве пространств имен
export { BoardComponent } from './board_component.js';
export { platform } from './platform.js';
export { keyMappings } from './key_mappings.js';

// Экспорт из подмодулей
export * from './controllers/index.js';
export * from './widgets/index.js';
export * from './themes/index.js';
export * from './displays/index.js';
export * from './rules/index.js';
export * from './sgf/index.js';

// Избегаем конфликта с экспортом board из displays/index.js
import * as flattenerModule from './flattener/index.js';
export {
  flattener,
  Flattened,
  symbols,
  BoardPoints,
  EdgeLabel,
  intersection,
  starpoints,
  BoardPt
} from './flattener/index.js'; 