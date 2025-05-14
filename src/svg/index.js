/**
 * @fileoverview Модуль для работы с SVG элементами в библиотеке Glift.
 * 
 * Этот модуль предоставляет интерфейс для создания и управления SVG элементами.
 * SVG используется для отрисовки доски Го, камней и других визуальных элементов.
 * 
 * @module svg
 */

import { Element } from '../dom/dom.js';

/**
 * Создает корневой SVG элемент с заданными атрибутами.
 * 
 * @function
 * @param {Object} attrObj - Объект с атрибутами для SVG элемента
 * @return {SvgElement} SVG объект
 * @example
 * // Создание SVG холста размером 400x400
 * const board = svg.svg({
 *   width: '400',
 *   height: '400',
 *   viewBox: '0 0 400 400'
 * });
 */
export const svg = (attrObj) => {
  const el = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  const svgObj = new SvgElement(el);
  
  if (attrObj) {
    svgObj.setAttr(attrObj);
  }
  
  return svgObj;
};

/**
 * Создает группу SVG элементов. Группы используются для организации
 * и объединения элементов, чтобы применять трансформации или стили
 * ко всей группе сразу.
 * 
 * @function
 * @return {SvgElement} SVG элемент группы
 * @example
 * // Создание группы камней
 * const stonesGroup = svg.group();
 * stonesGroup.setId('stones-group');
 * svgBoard.append(stonesGroup);
 */
export const group = () => {
  const el = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  return new SvgElement(el);
};

/**
 * Создает SVG круг. Используется для отрисовки камней и звездных точек.
 * 
 * @function
 * @param {Object} attrObj - Объект с атрибутами для круга
 * @param {string} [attrObj.cx] - X-координата центра круга
 * @param {string} [attrObj.cy] - Y-координата центра круга
 * @param {string} [attrObj.r] - Радиус круга
 * @param {string} [attrObj.fill] - Цвет заливки
 * @param {string} [attrObj.stroke] - Цвет обводки
 * @return {SvgElement} SVG элемент круга
 * @example
 * // Создание черного камня
 * const blackStone = svg.circle({
 *   cx: '100',
 *   cy: '100',
 *   r: '15',
 *   fill: 'black',
 *   stroke: 'none'
 * });
 */
export const circle = (attrObj) => {
  const el = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  const circle = new SvgElement(el);
  
  if (attrObj) {
    circle.setAttr(attrObj);
  }
  
  return circle;
};

/**
 * Создает SVG путь. Пути используются для рисования сложных форм.
 * 
 * @function
 * @param {Object} attrObj - Объект с атрибутами для пути
 * @param {string} [attrObj.d] - Строка, описывающая путь
 * @param {string} [attrObj.fill] - Цвет заливки
 * @param {string} [attrObj.stroke] - Цвет обводки
 * @return {SvgElement} SVG элемент пути
 * @example
 * // Создание треугольной метки
 * const triangle = svg.path({
 *   d: 'M10,0 L20,20 L0,20 Z',
 *   fill: 'black',
 *   transform: 'translate(100, 100)'
 * });
 */
export const path = (attrObj) => {
  const el = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  const path = new SvgElement(el);
  
  if (attrObj) {
    path.setAttr(attrObj);
  }
  
  return path;
};

/**
 * Создает SVG линию. Используется для отрисовки линий доски.
 * 
 * @function
 * @param {Object} attrObj - Объект с атрибутами для линии
 * @param {string} [attrObj.x1] - X-координата начальной точки
 * @param {string} [attrObj.y1] - Y-координата начальной точки
 * @param {string} [attrObj.x2] - X-координата конечной точки
 * @param {string} [attrObj.y2] - Y-координата конечной точки
 * @param {string} [attrObj.stroke] - Цвет линии
 * @return {SvgElement} SVG элемент линии
 * @example
 * // Создание горизонтальной линии на доске
 * const horizLine = svg.line({
 *   x1: '30',
 *   y1: '100',
 *   x2: '370',
 *   y2: '100',
 *   stroke: 'black',
 *   'stroke-width': '1'
 * });
 */
export const line = (attrObj) => {
  const el = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  const line = new SvgElement(el);
  
  if (attrObj) {
    line.setAttr(attrObj);
  }
  
  return line;
};

/**
 * Создает SVG изображение. Может использоваться для добавления изображений
 * на доску или для использования растровых текстур.
 * 
 * @function
 * @param {Object} attrObj - Объект с атрибутами для изображения
 * @param {string} [attrObj.href] - URL изображения
 * @param {string} [attrObj.width] - Ширина изображения
 * @param {string} [attrObj.height] - Высота изображения
 * @param {string} [attrObj.x] - X-координата верхнего левого угла
 * @param {string} [attrObj.y] - Y-координата верхнего левого угла
 * @return {SvgElement} SVG элемент изображения
 * @example
 * // Добавление текстуры дерева для доски
 * const boardTexture = svg.image({
 *   href: 'textures/wood.jpg',
 *   x: '0',
 *   y: '0',
 *   width: '400',
 *   height: '400'
 * });
 */
export const image = (attrObj) => {
  const el = document.createElementNS('http://www.w3.org/2000/svg', 'image');
  const image = new SvgElement(el);
  
  if (attrObj) {
    image.setAttr(attrObj);
  }
  
  return image;
};

/**
 * Создает текстовый элемент SVG.
 * 
 * @function
 * @param {Object} attrObj - Объект с атрибутами для текста
 * @param {string} [attrObj.x] - X-координата текста
 * @param {string} [attrObj.y] - Y-координата текста
 * @param {string} [attrObj.fill] - Цвет текста
 * @param {string} [textContent] - Текстовое содержимое
 * @return {SvgElement} SVG элемент текста
 * @example
 * // Создание метки с буквой "A"
 * const label = svg.text({
 *   x: '100',
 *   y: '100',
 *   'font-size': '16',
 *   'text-anchor': 'middle',
 *   fill: 'white'
 * }, 'A');
 */
export const text = (attrObj, textContent) => {
  const el = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  const text = new SvgElement(el);
  
  if (attrObj) {
    text.setAttr(attrObj);
  }
  
  if (textContent) {
    el.textContent = textContent;
  }
  
  return text;
};

/**
 * Класс для генерации уникальных идентификаторов для SVG элементов.
 * Используется для обеспечения уникальности ID и для организации
 * структуры SVG-документа.
 * 
 * @class
 */
export class IdGenerator {
  /**
   * Создает генератор ID с указанным префиксом.
   * 
   * @param {string} prefix - Префикс для ID
   */
  constructor(prefix) {
    this.prefix = prefix;
  }
  
  /**
   * Создает ID с заданным суффиксом.
   * 
   * @param {string} suffix - Суффикс для ID
   * @return {string} Сгенерированный ID
   */
  id(suffix) {
    return this.prefix + '_' + suffix;
  }
  
  /**
   * ID для пересечений доски.
   * 
   * @return {string} ID для пересечений
   */
  intersections() {
    return this.id('intersections');
  }
  
  /**
   * ID для линий доски.
   * 
   * @return {string} ID для линий
   */
  lines() {
    return this.id('lines');
  }
  
  /**
   * ID для звездных точек.
   * 
   * @return {string} ID для звездных точек
   */
  starpoints() {
    return this.id('starpoints');
  }
  
  /**
   * ID для камней.
   * 
   * @return {string} ID для камней
   */
  stones() {
    return this.id('stones');
  }
  
  /**
   * ID для меток.
   * 
   * @return {string} ID для меток
   */
  marks() {
    return this.id('marks');
  }
}

/**
 * Генератор ID для SVG элементов.
 * 
 * @namespace
 */
export const ids = {
  /**
   * Создает генератор ID с префиксом.
   * 
   * @function
   * @param {string} prefix - Префикс для ID
   * @return {IdGenerator} Генератор ID
   * @example
   * // Создание генератора ID с префиксом "goban"
   * const boardIds = svg.ids.gen('goban');
   * const stonesGroupId = boardIds.stones(); // "goban_stones"
   */
  gen: (prefix) => {
    return new IdGenerator(prefix);
  }
};

/**
 * Класс для работы с SVG элементами.
 * 
 * @class
 */
class SvgElement {
  /**
   * @param {SVGElement} element - SVG элемент
   */
  constructor(element) {
    /**
     * SVG элемент DOM
     * @type {SVGElement}
     */
    this.element = element;
  }
  
  /**
   * Устанавливает атрибуты для SVG элемента.
   * 
   * @param {Object|string} keyOrObj - Имя атрибута или объект с атрибутами
   * @param {string=} value - Значение атрибута (если первый параметр - строка)
   * @return {SvgElement} this для цепочки вызовов
   * @example
   * // Установка нескольких атрибутов
   * circle.setAttr({
   *   fill: 'black',
   *   stroke: 'white',
   *   'stroke-width': '2'
   * });
   * 
   * // Установка одного атрибута
   * circle.setAttr('r', '20');
   */
  setAttr(keyOrObj, value) {
    if (typeof keyOrObj === 'object') {
      for (const [key, val] of Object.entries(keyOrObj)) {
        this.element.setAttribute(key, val);
      }
    } else if (typeof keyOrObj === 'string' && value !== undefined) {
      this.element.setAttribute(keyOrObj, value);
    }
    return this;
  }
  
  /**
   * Устанавливает ID элемента.
   * 
   * @param {string} id - ID для установки
   * @return {SvgElement} this для цепочки вызовов
   * @example
   * // Установка ID
   * circle.setId('black-stone-5-5');
   */
  setId(id) {
    this.setAttr('id', id);
    return this;
  }
  
  /**
   * Добавляет дочерний элемент.
   * 
   * @param {SvgElement} child - Дочерний элемент
   * @return {SvgElement} this для цепочки вызовов
   * @example
   * // Добавление круга в группу
   * stonesGroup.append(blackStone);
   */
  append(child) {
    if (child.element) {
      this.element.appendChild(child.element);
    } else {
      this.element.appendChild(child);
    }
    return this;
  }
  
  /**
   * Удаляет дочерний элемент.
   * 
   * @param {SvgElement} child - Дочерний элемент
   * @return {SvgElement} this для цепочки вызовов
   * @example
   * // Удаление элемента
   * stonesGroup.remove(blackStone);
   */
  remove(child) {
    if (child.element) {
      this.element.removeChild(child.element);
    } else {
      this.element.removeChild(child);
    }
    return this;
  }
} 