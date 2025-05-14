/**
 * @fileoverview Модуль DOM-утилит для библиотеки Glift.
 * Содержит функции и классы для работы с DOM-элементами в современном стиле.
 * 
 * @module dom
 */

// Импортируем DOM-компоненты
import {
  Element,
  selectId as selectIdBase,
  newDiv,
  newElement as createElement,
  convertText,
  absBboxDiv,
  sanitize
} from './dom.js';

import * as ux from './ux.js';
import { GliftException } from './error.js';

// Экспортируем основные компоненты DOM
export {
  Element,
  selectIdBase,
  newDiv,
  convertText,
  absBboxDiv,
  sanitize,
  ux,
  GliftException
};

/**
 * Выбирает элемент по ID и оборачивает его в Element.
 * @function
 * @param {string|HTMLElement} arg - ID элемента или DOM-элемент
 * @return {?Element} Обернутый DOM-элемент или null, если элемент не найден
 * @example
 * // Выбор элемента по ID
 * const element = glift.dom.selectId('my-element');
 */
export const selectId = selectIdBase;

/**
 * Создает новый DOM-элемент указанного типа.
 * @function
 * @param {string} tagName - Имя тега элемента (div, span, p и т.д.)
 * @param {string=} opt_id - Опциональный ID элемента
 * @param {string=} opt_className - Опциональный класс элемента
 * @return {Element} Новый элемент
 * @example
 * // Создание элемента с ID и классом
 * const button = glift.dom.newElement('button', 'submit-btn', 'btn-primary');
 */
export const newElement = (tagName, opt_id, opt_className) => {
  const el = createElement(tagName);
  if (opt_id) el.setAttr('id', opt_id);
  if (opt_className) el.setAttr('class', opt_className);
  return el;
};

/**
 * Устанавливает CSS-стили для элемента.
 * @function
 * @param {Element|HTMLElement} element - DOM-элемент или Element
 * @param {Object} styles - Объект со стилями в формате {property: value}
 * @return {Element} Элемент с установленными стилями
 * @example
 * // Установка стилей для элемента
 * glift.dom.setStyles(myElement, {
 *   color: 'white',
 *   backgroundColor: '#333',
 *   padding: '10px'
 * });
 */
export const setStyles = (element, styles) => {
  const el = element instanceof Element ? element : new Element(element);
  Object.entries(styles).forEach(([property, value]) => {
    el.style(property, value);
  });
  return el;
};

/**
 * Отображает сообщение об ошибке в указанном контейнере.
 * @function
 * @param {string} message - Текст сообщения об ошибке
 * @param {Element|string} container - Контейнер или ID контейнера для отображения ошибки
 * @example
 * // Показать сообщение об ошибке
 * glift.dom.showError('Невозможно загрузить данные', 'error-container');
 */
export const showError = (message, container) => {
  const errorContainer = typeof container === 'string' 
    ? selectId(container) 
    : container;
  
  if (!errorContainer) {
    console.error('Не удалось найти контейнер для ошибки:', message);
    return;
  }
  
  errorContainer.setAttr('role', 'alert')
    .setAttr('aria-live', 'assertive')
    .addClass('glift-error')
    .html(sanitize(message));
};

/**
 * Присоединяет SVG элемент к родительскому DOM элементу.
 * @function
 * @param {Object} svgObj - SVG объект для присоединения
 * @param {string} parentId - ID родительского элемента
 * @example
 * // Присоединить SVG к родительскому элементу
 * glift.dom.attachToParent(mySvgObject, 'board-container');
 */
export const attachToParent = (svgObj, parentId) => {
  const container = selectId(parentId);
  if (!container) {
    console.error('Не удалось найти родительский контейнер:', parentId);
    return;
  }
  
  // Очищаем контейнер перед добавлением SVG
  container.empty();
  
  // Проверяем, что есть правильный SVG объект
  if (svgObj && svgObj.el) {
    container.append(svgObj);
  } else if (svgObj && svgObj.element) {
    // Поддержка для старого формата SVG объектов
    container.append(svgObj.element);
  } else {
    console.error('Передан некорректный SVG объект');
  }
}; 