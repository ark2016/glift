/**
 * Модуль для работы с Markdown в Glift.
 * @module markdown/markdown
 */

import { marked as markedParser } from './marked.js';

/**
 * Класс представляющий абстрактное синтаксическое дерево.
 */
export class Ast {
  /**
   * @param {!Array<!marked.Token>} tree Массив токенов.
   */
  constructor(tree) {
    /** Массив токенов */
    this.tree = tree;
  }

  /**
   * Возвращает только заголовки. Предполагается, что вложенных заголовков нет.
   * @return{!Array<!marked.Token>} Массив токенов заголовков.
   */
  headers() {
    var out = [];
    for (var i = 0; i < this.tree.length; i++) {
      var elem = this.tree[i];
      if (elem.type === 'heading') {
        out.push(elem);
      }
    }
    return out;
  }
}

/**
 * Marked встроен в это пространство имен. Для справки
 * https://github.com/chjj/marked
 */
export const markdown = {
  /** Создаёт AST из текста. */
  renderAst: function(text) {
    // Мы ожидаем, что markdown extern будет доступен.
    var lex = markedParser.lexer(text);
    return new Ast(lex);
  },

  render: function(text) {
    return markedParser(text);
  }
};
