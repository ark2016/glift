/**
 * Модуль marked - облегченный парсер Markdown.
 * Эта версия создана на основе оригинальной библиотеки marked,
 * но адаптирована для использования с ES модулями.
 * 
 * @module markdown/marked
 */

/**
 * Базовая функция для преобразования markdown в HTML.
 * @param {string} src - Исходный текст markdown
 * @param {Object=} options - Опции для парсера
 * @return {string} HTML разметка
 */
export function marked(src, options = {}) {
  // Используем парсер для преобразования текста
  const tokens = marked.lexer(src, options);
  return marked.parser(tokens, options);
}

/**
 * Парсер токенов.
 * @type {Object}
 */
marked.parser = function(tokens, options = {}) {
  let html = '';
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    switch (token.type) {
      case 'heading':
        html += `<h${token.depth}>${token.text}</h${token.depth}>`;
        break;
      case 'paragraph':
        html += `<p>${token.text}</p>`;
        break;
      case 'list_start':
        html += token.ordered ? '<ol>' : '<ul>';
        break;
      case 'list_item_start':
        html += '<li>';
        break;
      case 'list_item_end':
        html += '</li>';
        break;
      case 'list_end':
        html += token.ordered ? '</ol>' : '</ul>';
        break;
      case 'code':
        html += `<pre><code>${token.text}</code></pre>`;
        break;
      case 'blockquote_start':
        html += '<blockquote>';
        break;
      case 'blockquote_end':
        html += '</blockquote>';
        break;
      case 'text':
        html += token.text;
        break;
      case 'space':
        html += ' ';
        break;
      case 'hr':
        html += '<hr>';
        break;
      default:
        if (token.text) {
          html += token.text;
        }
    }
  }
  return html;
};

/**
 * Лексер для разбора markdown текста на токены.
 * @param {string} src - Исходный текст markdown
 * @param {Object=} options - Опции для лексера
 * @return {Array<Object>} Массив токенов
 */
marked.lexer = function(src, options = {}) {
  const tokens = [];
  
  // Разбиваем на строки и блоки
  const blocks = src
    .replace(/\r\n|\r/g, '\n')
    .replace(/\t/g, '    ')
    .replace(/\u00a0/g, ' ')
    .replace(/\u2424/g, '\n')
    .split(/\n\n+/);
  
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i].trim();
    
    // Пропускаем пустые блоки
    if (!block) continue;
    
    // Заголовки
    const headingMatch = block.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      tokens.push({
        type: 'heading',
        depth: headingMatch[1].length,
        text: headingMatch[2]
      });
      continue;
    }
    
    // Горизонтальная линия
    if (/^(?:\*\s*){3,}$|^(?:-\s*){3,}$|^(?:_\s*){3,}$/.test(block)) {
      tokens.push({ type: 'hr' });
      continue;
    }
    
    // Блок кода
    if (block.startsWith('    ') || block.startsWith('\t')) {
      tokens.push({
        type: 'code',
        text: block.replace(/^    /gm, '')
      });
      continue;
    }
    
    // Цитата
    if (block.startsWith('>')) {
      const text = block.replace(/^>\s?/gm, '');
      tokens.push({ type: 'blockquote_start' });
      // Рекурсивно обрабатываем содержимое цитаты
      Array.prototype.push.apply(tokens, marked.lexer(text));
      tokens.push({ type: 'blockquote_end' });
      continue;
    }
    
    // Списки
    const listMatch = block.match(/^([*+-]|\d+\.)\s/);
    if (listMatch) {
      const isOrdered = /^\d+\./.test(listMatch[1]);
      tokens.push({ 
        type: 'list_start',
        ordered: isOrdered
      });
      
      // Разбиваем на элементы списка
      const items = block.split(/\n(?=[*+-]|\d+\.)\s/);
      for (let j = 0; j < items.length; j++) {
        const item = items[j].replace(/^([*+-]|\d+\.)\s/, '');
        tokens.push({ type: 'list_item_start' });
        // Рекурсивно обрабатываем содержимое элемента
        Array.prototype.push.apply(tokens, marked.lexer(item));
        tokens.push({ type: 'list_item_end' });
      }
      
      tokens.push({ 
        type: 'list_end',
        ordered: isOrdered
      });
      continue;
    }
    
    // Обычный параграф
    tokens.push({
      type: 'paragraph',
      text: inlineLexer(block)
    });
  }
  
  return tokens;
};

/**
 * Обрабатывает встроенные элементы markdown (выделение, ссылки и т.д.)
 * @param {string} text - Текст для обработки
 * @return {string} Обработанный HTML
 */
function inlineLexer(text) {
  // Обрабатываем встроенные элементы
  return text
    // Жирный текст
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/__(.*?)__/g, '<strong>$1</strong>')
    // Курсив
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/_(.*?)_/g, '<em>$1</em>')
    // Зачеркнутый текст
    .replace(/~~(.*?)~~/g, '<del>$1</del>')
    // Встроенный код
    .replace(/`(.*?)`/g, '<code>$1</code>')
    // Ссылки [текст](url)
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');
}

// Экспорт модуля
export { marked }; 