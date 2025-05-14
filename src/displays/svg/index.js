/**
 * Модуль для работы с SVG элементами в Glift.
 * @module displays/svg
 */

export { Element } from './elements.js';
export { ids, IdGenerator } from './ids.js';
export { dom } from './svgobj.js';

// Реэкспорт для совместимости
import * as svgModule from './svg.js';
export default svgModule; 