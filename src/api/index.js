/**
 * Модуль API для библиотеки Glift.
 * Содержит основные классы и функции для взаимодействия с библиотекой.
 * @module api
 */

// Импортируем классы API
import { HookOptions } from './hooks.js';
import { DisplayOptions, themes } from './display_options.js';
import { StoneActions, StoneFn } from './stone_actions.js';
import { IconActions, IconDef, IconFn } from './icon_actions.js';
import { SgfOptions } from './sgf_options.js';
import { BaseWidget } from '../widgets/base_widget.js';

/**
 * Класс опций для типов виджетов.
 * Определяет общую структуру опций для всех типов виджетов.
 */
export class WidgetTypeOptions {
  /**
   * Создает новый экземпляр WidgetTypeOptions.
   * @param {Object} options Объект с опциями
   */
  constructor(options = {}) {
    /** @type {boolean} Отмечать ли последний ход */
    this.markLastMove = options.markLastMove;
    
    /** @type {boolean} Включить прокрутку колесиком */
    this.enableMousewheel = options.enableMousewheel;
    
    /** @type {Object} Карта привязок клавиш к действиям */
    this.keyMappings = options.keyMappings;
    
    /** @type {Object} Условия задачи */
    this.problemConditions = options.problemConditions;
    
    /** @type {Function} Функция контроллера */
    this.controllerFunc = options.controllerFunc;
    
    /** @type {Array} Иконки для панели инструментов */
    this.icons = options.icons;
    
    /** @type {string} Настройка отображения вариаций */
    this.showVariations = options.showVariations;
    
    /** @type {Array} Иконки для статусбара */
    this.statusBarIcons = options.statusBarIcons;
    
    /** @type {Function} Обработчик клика на камне */
    this.stoneClick = options.stoneClick;
    
    /** @type {Function} Обработчик наведения на камень */
    this.stoneMouseover = options.stoneMouseover;
    
    /** @type {Function} Обработчик ухода с камня */
    this.stoneMouseout = options.stoneMouseout;
  }
}

// Экспортируем публичные классы API
export {
  // Классы опций
  HookOptions,
  DisplayOptions,
  SgfOptions,
  
  // Определения и действия
  StoneActions,
  StoneFn,
  IconActions,
  IconDef,
  IconFn,
  
  // Енумы и константы
  themes
};

// Импортируем типы виджетов
import { WIDGET_TYPE } from '../widget_type.js';

/**
 * Создает новый экземпляр виджета Glift с указанной конфигурацией.
 * @param {Object} config - Конфигурация виджета
 * @return {Object} Экземпляр виджета
 */
export const create = (config) => {
  // Проверяем наличие обязательных параметров
  if (!config.divId) {
    throw new Error('Не указан обязательный параметр divId');
  }

  // Применяем настройки отображения
  const displayOptions = new DisplayOptions(config.display || {});
  
  // Применяем настройки обработчиков
  const hookOptions = new HookOptions(config.hooks || {});
  
  // Настройки SGF по умолчанию
  const sgfDefaults = config.sgfDefaults || {};
  
  // Определяем тип виджета
  const widgetType = sgfDefaults.widgetType || WIDGET_TYPE.GAME_VIEWER;
  
  // Создаем и возвращаем виджет
  return createWidget({
    divId: config.divId,
    sgf: config.sgf,
    display: displayOptions,
    hooks: hookOptions,
    sgfDefaults,
    widgetType
  });
};

/**
 * Создает виджет указанного типа.
 * @param {Object} options - Опции для создания виджета
 * @private
 */
const createWidget = (options) => {
  return new BaseWidget(options);
};

/**
 * Регистрирует новый тип виджета.
 * @param {string} name - Имя типа виджета
 * @param {Function} constructor - Конструктор виджета
 */
export const registerWidgetType = (name, constructor) => {
  if (WIDGET_TYPE[name]) {
    console.warn(`Тип виджета "${name}" уже существует. Переопределение.`);
  }
  WIDGET_TYPE[name] = name;
  // Здесь можно добавить регистрацию конструктора
}; 