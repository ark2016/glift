/**
 * Модуль экспорта глобального объекта glift для обратной совместимости.
 * 
 * @module exports
 */

import * as api from './api/index.js';
import { create } from './api/api.js';
import { VERSION } from './index.js';
import * as util from './util/index.js';
import * as widgets from './widgets/index.js';
import * as displays from './displays/index.js';
import * as controllers from './controllers/index.js';
import * as themes from './themes/index.js';
import * as dom from './dom/index.js';

/**
 * Создает глобальный объект glift для обратной совместимости.
 * Экспортирует все публичные API библиотеки как свойства объекта glift.
 */
export const setupGlobalGlift = () => {
  // Создаем глобальный объект glift
  window.glift = {
    // Версия библиотеки
    VERSION,
    
    // Основная функция создания виджета
    create: create,
    
    // Публичные модули
    util,
    widgets,
    displays,
    controllers,
    themes,
    api,
    dom,
    
    // Глобальные данные и настройки
    global: {
      activeInstanceId: null,
      instanceRegistry: {}
    }
  };
  
  // Для отладки
  console.log('Glift глобальный объект инициализирован, версия:', VERSION);
}; 