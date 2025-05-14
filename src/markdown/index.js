/**
 * Модуль Markdown для Glift.
 * Предоставляет функциональность для работы с разметкой Markdown.
 * 
 * @module markdown
 */

import { marked } from './marked.js';
import { markdown, Ast, renderAst, render } from './markdown.js';

// Экспортируем все из markdown.js
export * from './markdown.js';

// Экспортируем marked
export { marked };

// Экспорт для обратной совместимости
export default markdown; 