/**
 * @fileoverview Модуль для обработки ошибок в DOM.
 * 
 * @module dom/error
 */

/**
 * Реестр документации по ошибкам Glift.
 * Содержит ссылки на документацию с описанием различных ошибок.
 * @enum {string}
 * @readonly
 */
export const ErrorDoc = Object.freeze({
  // В будущем добавить реальные ссылки на документацию
  SGF_PARSE_ERROR: 'https://github.com/Kashomon/glift/wiki/SGF-Parsing-Errors',
  WIDGET_ERROR: 'https://github.com/Kashomon/glift/wiki/Widget-Errors',
  DISPLAY_ERROR: 'https://github.com/Kashomon/glift/wiki/Display-Errors',
});

/**
 * Создает DOM-элемент для отображения пользовательской ошибки.
 * Стилизует сообщение об ошибке и добавляет опциональную ссылку на документацию.
 *
 * @param {string} msg Сообщение об ошибке для пользователя
 * @param {ErrorDoc=} opt_docLink Опциональная ссылка на документацию
 * @return {!Element} Новый элемент с сообщением об ошибке
 */
export const createErrorElement = (msg, opt_docLink) => {
  const elem = document.createElement('div');
  
  // Задаем стили для элемента ошибки
  elem.style.cssText = `
    color: #E00;
    padding: 10px;
    border: 1px solid #E00;
    border-radius: 5px;
    background-color: #FFF0F0;
    margin: 10px 0;
    font-family: sans-serif;
  `;
  
  // Добавляем текст сообщения
  const formattedMsg = `::Glift Error:: ${msg}`;
  elem.appendChild(document.createTextNode(formattedMsg));
  
  // Добавляем ссылку на документацию, если предоставлена
  if (opt_docLink) {
    const link = document.createElement('a');
    link.href = opt_docLink;
    link.textContent = ' Подробнее о решении этой проблемы.';
    link.style.color = '#00A';
    elem.appendChild(link);
  }
  
  return elem;
};

/**
 * Класс ошибки для библиотеки Glift.
 * Расширяет стандартный Error для более информативных сообщений.
 */
export class GliftException extends Error {
  /**
   * @param {string} message - Сообщение об ошибке
   * @param {Object=} data - Дополнительные данные об ошибке
   */
  constructor(message, data) {
    super(message);
    this.name = 'GliftException';
    this.data = data || {};
    
    // Сохраняем стек вызовов
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, GliftException);
    }
  }
  
  /**
   * Форматирует ошибку в строку для отображения.
   * @return {string} Отформатированное сообщение об ошибке
   */
  toString() {
    let result = `${this.name}: ${this.message}`;
    
    if (Object.keys(this.data).length > 0) {
      result += `\nДополнительные данные: ${JSON.stringify(this.data, null, 2)}`;
    }
    
    return result;
  }
}

/**
 * Отображает сообщение об ошибке в указанном контейнере.
 * @param {string} message - Сообщение об ошибке
 * @param {string=} containerId - ID контейнера для отображения ошибки
 */
export const showError = (message, containerId) => {
  console.error(`[Glift] ${message}`);
  
  if (containerId) {
    const container = document.getElementById(containerId);
    
    if (container) {
      const errorEl = createErrorElement(message);
      container.appendChild(errorEl);
    }
  }
};

/**
 * Скрывает все сообщения об ошибках.
 */
export const hideErrors = () => {
  const errors = document.querySelectorAll('.glift-error');
  errors.forEach(error => {
    if (error.parentNode) {
      error.parentNode.removeChild(error);
    }
  });
};

/**
 * Вспомогательная функция для вывода визуального предупреждения пользователю.
 * @param {string} message - Сообщение предупреждения
 * @param {string=} containerId - ID элемента для вывода (опционально)
 */
export const showWarning = (message, containerId) => {
  console.warn(`[Glift] ${message}`);
  
  if (containerId) {
    const container = document.getElementById(containerId);
    
    if (container) {
      const warningEl = document.createElement('div');
      warningEl.className = 'glift-warning';
      warningEl.textContent = message;
      warningEl.style.cssText = 'color: #e74c3c; background: #fdecea; padding: 10px; border-radius: 4px; margin: 10px 0;';
      
      container.appendChild(warningEl);
      
      // Автоматически удаляем предупреждение через 5 секунд
      setTimeout(() => {
        if (warningEl.parentNode) {
          warningEl.parentNode.removeChild(warningEl);
        }
      }, 5000);
    }
  }
};
