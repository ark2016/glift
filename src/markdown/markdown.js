/**
 * Модуль для работы с Markdown в Glift.
 * @module markdown/markdown
 */

import { marked } from './marked.js';

/**
 * Класс для работы с абстрактным синтаксическим деревом Markdown.
 */
export class Ast {
  /**
   * @param {!Array<!Object>} tree - Массив токенов
   */
  constructor(tree) {
    /** Массив токенов */
    this.tree = tree;
  }

  /**
   * Возвращает только заголовки. Предполагаем, что вложенных заголовков нет.
   * @return {!Array<!Object>} Массив токенов заголовков
   */
  headers() {
    const out = [];
    for (let i = 0; i < this.tree.length; i++) {
      const elem = this.tree[i];
      if (elem.type === 'heading') {
        out.push(elem);
      }
    }
    return out;
  }
}

/**
 * Рендерит AST из текста Markdown.
 * @param {string} text - Текст Markdown для разбора
 * @return {!Ast} Объект AST
 */
export function renderAst(text) {
  // Используем markdown лексер
  const lex = marked.lexer(text);
  return new Ast(lex);
}

/**
 * Рендерит HTML из текста Markdown.
 * @param {string} text - Текст Markdown для рендеринга
 * @return {string} HTML-разметка
 */
export function render(text) {
  return marked(text);
}

// Экспорт для обратной совместимости
export const markdown = {
  renderAst,
  render,
  Ast
}; 