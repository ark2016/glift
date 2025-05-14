/**
 * @preserve Glift: Модульная библиотека JavaScript для игры Го.
 *
 * @copyright Josh Hoak
 * @license MIT License (see LICENSE.txt)
 */

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

// Создаем функцию для создания экземпляра Glift
export const create = api.create;

// Для обратной совместимости - создаем глобальный объект glift
setupGlobalGlift(); 