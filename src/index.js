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
import * as apiModule from './api/index.js';
import { create as apiCreate } from './api/api.js';
import * as dom from './dom/index.js';
import * as parse from './parse/index.js';
import * as svgModule from './svg/index.js';
import * as orientation from './orientation/index.js';
import { setupGlobalGlift } from './exports.js';

// Пересобираем модуль svg без конфликтов
const svg = {
  ...svgModule,
  // Используем только SvgIdGenerator из svg/index.js и не включаем IdGenerator из widgets/index.js
  IdGenerator: svgModule.SvgIdGenerator 
};

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
export const create = apiCreate;

// Переименовываем импорт для корректности
const api = apiModule;

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
  dom,
  parse,
  svg,
  orientation
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
  parse,
  svg,
  orientation,
  global
};

export default gliftExport;

// Экспорт модулей в качестве пространств имен
export { BoardComponent } from './board_component.js';
export { platform } from './platform.js';
export { keyMappings } from './key_mappings.js';

// Экспорт из подмодулей
export * from './controllers/index.js';

// Избегаем звездного экспорта для widgets и изменяем его на явный экспорт
import { 
  BaseWidget,
  IdGenerator as WidgetIdGenerator,
  idGenerator as widgetIdGenerator,
  createId,
  registerEventHandler,
  WidgetManager
} from './widgets/index.js';

export {
  BaseWidget,
  WidgetIdGenerator,
  widgetIdGenerator,
  createId,
  registerEventHandler,
  WidgetManager
};

export * from './themes/index.js';
export * from './displays/index.js';
export * from './rules/index.js';
export * from './sgf/index.js';
export * from './parse/index.js';

// Избегаем звездного экспорта для svg и изменяем его на явный экспорт
import {
  svg as svgFunc,
  group,
  circle,
  rect,
  path,
  line,
  image,
  text,
  svgPathUtils,
  SvgIdGenerator,
  ids,
  svgObj,
  pathutils,
  SvgObj,
  ViewBox,
  createObj
} from './svg/index.js';

export {
  svgFunc,
  group,
  circle,
  rect,
  path,
  line,
  image,
  text,
  svgPathUtils,
  SvgIdGenerator,
  ids,
  svgObj,
  pathutils,
  SvgObj,
  ViewBox,
  createObj
};

export * from './orientation/index.js';

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