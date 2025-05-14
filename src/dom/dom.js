/**
 * Утилиты DOM и обертка для элементов.
 * 
 * Предоставляет упрощенную обертку для работы с элементами DOM.
 * 
 * @namespace
 */

/**
 * Создает объект Element из DOM элемента или ID.
 * @param {string|!Element} arg ID элемента или DOM элемент
 * @return {?Element} Обернутый DOM элемент или null
 */
export const selectId = (arg) => {
  if (typeof arg === 'string') {
    // Предполагаем, что это ID элемента
    const el = document.getElementById(arg);
    return el ? new Element(el, arg) : null;
  } else if (arg && arg.nodeType === Node.ELEMENT_NODE) {
    // Предполагаем, что это HTML Element (nodeType 1 = ELEMENT_NODE)
    return new Element(/** @type {!Element} */ (arg));
  }
  
  return null;
};

/**
 * Создает новый div элемент с указанным ID.
 * @param {string} id Идентификатор элемента
 * @return {!Element} Новый элемент div
 */
export const newDiv = (id) => {
  const elem = selectId(document.createElement('div'));
  elem.setAttr('id', id);
  return elem;
};

/**
 * Преобразует текст в элементы DOM, опционально используя markdown.
 * @param {string} text Исходный текст
 * @param {boolean} useMarkdown Использовать ли markdown для рендеринга
 * @param {!Object=} opt_css Опциональный CSS объект для применения к строкам
 * @return {!Element} Обертка DOM с преобразованным текстом
 */
export const convertText = (text, useMarkdown, opt_css) => {
  text = sanitize(text);
  
  if (useMarkdown) {
    // Импортируем markdown на лету, если потребуется
    // В финальной версии лучше импортировать в начале файла
    // text = markdownRenderer.render(text);
    text = text; // временно, пока не реализуем markdown
  }
  
  const wrapper = newElement('div');
  
  if (useMarkdown) {
    wrapper.html(text);
  } else {
    const textSegments = text.split('\n');
    
    for (const seg of textSegments) {
      const baseCss = { 
        margin: 0, 
        padding: 0, 
        'min-height': '1em' 
      };
      
      if (opt_css) {
        Object.assign(baseCss, opt_css);
      }
      
      const pNode = newElement('p').css(baseCss);
      pNode.html(seg);
      wrapper.append(pNode);
    }
  }
  
  return wrapper;
};

/**
 * Создает абсолютно позиционированный div из ограничивающего прямоугольника.
 * @param {!Object} bbox Ограничивающий прямоугольник
 * @param {string} id Идентификатор элемента
 * @return {!Element} Новый абсолютно позиционированный div
 */
export const absBboxDiv = (bbox, id) => {
  const newDiv = newDiv(id);
  const cssObj = {
    position: 'absolute',
    margin: '0px',
    padding: '0px',
    top: `${bbox.top()}px`,
    left: `${bbox.left()}px`,
    width: `${bbox.width()}px`,
    height: `${bbox.height()}px`,
    MozBoxSizing: 'border-box',
    boxSizing: 'border-box',
  };
  
  newDiv.css(cssObj);
  return newDiv;
};

/**
 * Создает новый элемент указанного типа.
 * @param {string} type Тип создаваемого элемента
 * @return {!Element} Новый элемент
 * @throws {Error} Если тип не является строкой
 */
export const newElement = (type) => {
  if (!type || typeof type !== 'string') {
    throw new Error(`Тип должен быть строкой, но был: [${type}]`);
  }
  return selectId(document.createElement(type));
};

/**
 * Безопасно обрабатывает HTML для предотвращения XSS-атак.
 * @param {string} html HTML для очистки
 * @return {string} Очищенный HTML
 */
export const sanitize = (html) => {
  if (!html) return '';
  
  // Для простых строк без HTML возвращаем текст как есть
  if (!/<[a-z][\s\S]*>/i.test(html)) {
    return escapeHtml(html);
  }
  
  // Создаем DOM-парсер
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  
  // Получаем очищенный HTML
  return doc.body.innerHTML;
};

/**
 * Экранирует HTML-сущности в строке.
 * @param {string} str Строка для экранирования
 * @return {string} Экранированная строка
 * @private
 */
const escapeHtml = (str) => {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

/**
 * Класс для работы с DOM-элементами.
 * Обеспечивает удобный интерфейс для манипуляций с DOM.
 */
export class Element {
  /**
   * Создает обертку для DOM-элемента.
   * @param {HTMLElement} el - DOM-элемент
   */
  constructor(el) {
    /**
     * Внутренний DOM-элемент.
     * @type {HTMLElement}
     */
    this.el = el;
  }
  
  /**
   * Устанавливает или получает атрибут элемента.
   * @param {string} key - Имя атрибута
   * @param {string=} value - Значение атрибута (опционально)
   * @return {string|Element} Значение атрибута или текущий экземпляр
   */
  setAttr(key, value) {
    if (value === undefined) {
      return this.el.getAttribute(key);
    }
    this.el.setAttribute(key, value);
    return this;
  }
  
  /**
   * Устанавливает или получает CSS-свойство элемента.
   * @param {string|Object} property - Имя CSS-свойства или объект стилей
   * @param {string=} value - Значение CSS-свойства (опционально)
   * @return {string|Element} Значение свойства или текущий экземпляр
   */
  style(property, value) {
    if (typeof property === 'object') {
      // Применить множество стилей
      for (const [key, val] of Object.entries(property)) {
        this.el.style[key] = val;
      }
      return this;
    }
    
    if (value === undefined) {
      return getComputedStyle(this.el)[property];
    }
    this.el.style[property] = value;
    return this;
  }
  
  /**
   * Устанавливает CSS стили через объект.
   * @param {Object} cssObj - Объект CSS свойств
   * @return {Element} Текущий экземпляр
   */
  css(cssObj) {
    return this.style(cssObj);
  }
  
  /**
   * Добавляет класс к элементу.
   * @param {string} className - Имя класса
   * @return {Element} Текущий экземпляр
   */
  addClass(className) {
    this.el.classList.add(className);
    return this;
  }
  
  /**
   * Удаляет класс из элемента.
   * @param {string} className - Имя класса
   * @return {Element} Текущий экземпляр
   */
  removeClass(className) {
    this.el.classList.remove(className);
    return this;
  }
  
  /**
   * Проверяет наличие класса у элемента.
   * @param {string} className - Имя класса
   * @return {boolean} true, если класс есть
   */
  hasClass(className) {
    return this.el.classList.contains(className);
  }
  
  /**
   * Устанавливает или получает HTML-содержимое элемента.
   * @param {string=} htmlContent - HTML-содержимое (опционально)
   * @return {string|Element} HTML-содержимое или текущий экземпляр
   */
  html(htmlContent) {
    if (htmlContent === undefined) {
      return this.el.innerHTML;
    }
    this.el.innerHTML = htmlContent;
    return this;
  }
  
  /**
   * Устанавливает или получает текстовое содержимое элемента.
   * @param {string=} textContent - Текстовое содержимое (опционально)
   * @return {string|Element} Текстовое содержимое или текущий экземпляр
   */
  text(textContent) {
    if (textContent === undefined) {
      return this.el.textContent;
    }
    this.el.textContent = textContent;
    return this;
  }
  
  /**
   * Добавляет дочерний элемент.
   * @param {Element|HTMLElement} child - Дочерний элемент
   * @return {Element} Текущий экземпляр
   */
  append(child) {
    if (child instanceof Element) {
      this.el.appendChild(child.el);
    } else {
      this.el.appendChild(child);
    }
    return this;
  }
  
  /**
   * Удаляет дочерний элемент.
   * @param {Element|HTMLElement} child - Дочерний элемент
   * @return {Element} Текущий экземпляр
   */
  remove(child) {
    if (child instanceof Element) {
      this.el.removeChild(child.el);
    } else {
      this.el.removeChild(child);
    }
    return this;
  }
  
  /**
   * Очищает элемент, удаляя все дочерние элементы.
   * @return {Element} Текущий экземпляр
   */
  empty() {
    while (this.el.firstChild) {
      this.el.removeChild(this.el.firstChild);
    }
    return this;
  }
  
  /**
   * Устанавливает обработчик события.
   * @param {string} eventName - Имя события
   * @param {Function} handler - Обработчик события
   * @return {Element} Текущий экземпляр
   */
  on(eventName, handler) {
    this.el.addEventListener(eventName, handler);
    return this;
  }
  
  /**
   * Удаляет обработчик события.
   * @param {string} eventName - Имя события
   * @param {Function} handler - Обработчик события
   * @return {Element} Текущий экземпляр
   */
  off(eventName, handler) {
    this.el.removeEventListener(eventName, handler);
    return this;
  }
}
