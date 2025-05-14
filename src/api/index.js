/**
 * Модуль API для библиотеки Glift.
 * Предоставляет основные методы для создания и управления виджетами Glift.
 */

// Импортируем классы API
import { HookOptions } from './hooks.js';
import { DisplayOptions } from './display_options.js';
import { StoneActions } from './stone_actions.js';
import { BaseWidget } from '../widgets/base_widget.js';

// Экспортируем публичные классы API
export {
  HookOptions,
  DisplayOptions,
  StoneActions
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