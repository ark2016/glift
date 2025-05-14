/**
 * Заглушка для библиотеки marked - парсера markdown.
 * В реальной реализации здесь должен быть полный marked.js.
 * 
 * @module markdown/marked
 */

/**
 * Базовая функция для преобразования markdown в HTML.
 * @param {string} src - Исходный текст markdown
 * @param {Object=} options - Опции для парсера
 * @return {string} HTML разметка
 */
export function marked(src, options) {
  // Очень примитивная реализация markdown парсера
  // В реальной реализации здесь должна быть полная библиотека marked
  return src
    .replace(/^# (.*?)$/gm, '<h1>$1</h1>')
    .replace(/^## (.*?)$/gm, '<h2>$1</h2>')
    .replace(/^### (.*?)$/gm, '<h3>$1</h3>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n\n/g, '<br><br>');
}

/**
 * Разбирает markdown текст на токены.
 * @param {string} src - Исходный текст markdown
 * @param {Object=} options - Опции для лексера
 * @return {Array<Object>} Массив токенов
 */
marked.lexer = function(src, options) {
  // Упрощенная версия лексера
  const tokens = [];
  
  // Разбиваем на строки
  const lines = src.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Обрабатываем заголовки
    if (line.startsWith('# ')) {
      tokens.push({
        type: 'heading',
        depth: 1,
        text: line.substring(2)
      });
    } else if (line.startsWith('## ')) {
      tokens.push({
        type: 'heading',
        depth: 2,
        text: line.substring(3)
      });
    } else if (line.startsWith('### ')) {
      tokens.push({
        type: 'heading',
        depth: 3,
        text: line.substring(4)
      });
    } else if (line.trim() !== '') {
      // Обычный текст
      tokens.push({
        type: 'paragraph',
        text: line
      });
    }
  }
  
  return tokens;
};

/**
 * Парсер для преобразования токенов в HTML.
 * @param {Array<Object>} tokens - Массив токенов
 * @param {Object=} options - Опции для парсера
 * @return {string} HTML разметка
 */
marked.parse = function(tokens, options) {
  return marked(tokens.map(token => {
    if (token.type === 'heading') {
      return '#'.repeat(token.depth) + ' ' + token.text;
    } else if (token.type === 'paragraph') {
      return token.text;
    }
    return '';
  }).join('\n'));
};

// Экспорт для обратной совместимости
export { marked }; 