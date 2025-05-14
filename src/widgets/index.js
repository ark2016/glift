/**
 * Модуль виджетов для библиотеки Glift.
 * Содержит классы и функции для работы с различными виджетами.
 */

// Импортируем классы виджетов
import { BaseWidget } from './base_widget.js';
import { IdGenerator, idGenerator } from './id_generator.js';

// Экспортируем все классы виджетов
export {
  BaseWidget,
  IdGenerator,
  idGenerator
};

/**
 * Создает уникальный идентификатор элемента.
 * @param {string} prefix - Префикс идентификатора
 * @return {string} Уникальный идентификатор
 */
export const createId = (prefix = 'glift') => {
  return new IdGenerator(prefix).next();
};

/**
 * Регистрирует обработчик события для виджета.
 * @param {BaseWidget} widget - Экземпляр виджета
 * @param {string} eventName - Имя события
 * @param {Function} handler - Обработчик события
 */
export const registerEventHandler = (widget, eventName, handler) => {
  if (!widget || !widget.addEventListener) {
    console.error('Передан неверный виджет для регистрации события');
    return;
  }
  
  widget.addEventListener(eventName, handler);
};

/**
 * Диспетчер виджетов.
 * Управляет созданием и уничтожением виджетов Glift.
 */
export class WidgetManager {
  /**
   * Создает новый диспетчер виджетов.
   */
  constructor() {
    /**
     * Карта всех активных виджетов.
     * @type {Map<string, BaseWidget>}
     * @private
     */
    this._widgets = new Map();
  }
  
  /**
   * Создает и регистрирует новый виджет.
   * @param {Object} options - Опции для создания виджета
   * @return {BaseWidget} Созданный виджет
   */
  create(options) {
    const widget = new BaseWidget(options);
    this._widgets.set(widget.id(), widget);
    return widget;
  }
  
  /**
   * Уничтожает виджет.
   * @param {string|BaseWidget} widgetOrId - Виджет или его ID
   * @return {boolean} true, если виджет был уничтожен
   */
  destroy(widgetOrId) {
    const id = typeof widgetOrId === 'string' 
      ? widgetOrId 
      : widgetOrId.id();
      
    const widget = this._widgets.get(id);
    if (!widget) return false;
    
    widget.destroy();
    this._widgets.delete(id);
    return true;
  }
  
  /**
   * Получает виджет по ID.
   * @param {string} id - ID виджета
   * @return {BaseWidget|undefined} Найденный виджет или undefined
   */
  get(id) {
    return this._widgets.get(id);
  }
}; 