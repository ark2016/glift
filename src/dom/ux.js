/**
 * @fileoverview Модуль UX содержит утилиты для пользовательского интерфейса.
 * 
 * @module dom/ux
 */

import { selectId } from './index.js';

/**
 * Определяет положение элемента относительно страницы.
 * @param {Element|string} element - DOM-элемент или его ID
 * @return {Object} Объект с координатами {top, left, bottom, right}
 */
export const offset = (element) => {
  const el = typeof element === 'string' ? document.getElementById(element) : element;
  
  if (!el) {
    console.error('Не удалось найти элемент для определения позиции:', element);
    return { top: 0, left: 0, bottom: 0, right: 0 };
  }
  
  const rect = el.getBoundingClientRect();
  const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  
  return {
    top: rect.top + scrollTop,
    left: rect.left + scrollLeft,
    bottom: rect.bottom + scrollTop,
    right: rect.right + scrollLeft
  };
};

/**
 * Определяет размеры окна просмотра.
 * @return {Object} Объект с размерами окна {width, height}
 */
export const viewport = () => {
  return {
    width: window.innerWidth,
    height: window.innerHeight
  };
};

/**
 * Определяет, отображается ли элемент в области видимости.
 * @param {Element|string} element - DOM-элемент или его ID
 * @return {boolean} true, если элемент видим
 */
export const isVisible = (element) => {
  const el = typeof element === 'string' ? document.getElementById(element) : element;
  
  if (!el) {
    return false;
  }
  
  const rect = el.getBoundingClientRect();
  const win = viewport();
  
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= win.height &&
    rect.right <= win.width
  );
};

/**
 * Прокручивает страницу к элементу.
 * @param {Element|string} element - DOM-элемент или его ID
 * @param {boolean} smooth - Использовать плавную прокрутку
 */
export const scrollToElement = (element, smooth = true) => {
  const el = typeof element === 'string' ? document.getElementById(element) : element;
  
  if (!el) {
    console.error('Не удалось найти элемент для прокрутки:', element);
    return;
  }
  
  el.scrollIntoView({
    behavior: smooth ? 'smooth' : 'auto',
    block: 'center'
  });
};

/**
 * Возвращает информацию о событии касания или мыши.
 * @param {Event} event - Событие
 * @return {Object} Объект с координатами {x, y}
 */
export const getEventPosition = (event) => {
  // Если это касание
  if (event.touches && event.touches.length) {
    return {
      x: event.touches[0].pageX,
      y: event.touches[0].pageY
    };
  }
  
  // Если это мышь
  return {
    x: event.pageX,
    y: event.pageY
  };
};

/**
 * Вычисляет относительное положение события мыши относительно элемента.
 * 
 * @param {!Element} elem - DOM элемент
 * @param {!Event} e - Событие мыши
 * @return {{x: number, y: number}} Позиция относительно элемента
 */
export const getRelativeMousePosition = (elem, e) => {
  const rect = elem.getBoundingClientRect();
  const evt = e.touches ? e.touches[0] : e;
  
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
};

/**
 * Делает элемент невыделяемым.
 * 
 * @param {string|Element} el - ID элемента или DOM элемент
 * @return {Element} Измененный элемент
 */
export const setNotSelectable = (el) => {
  const elem = typeof el === 'string' ? selectId(el) : selectId(el);
  
  if (!elem) return null;
  
  elem.css({
    webkitTouchCallout: 'none',
    webkitUserSelect: 'none',
    MozUserSelect: 'none',
    msUserSelect: 'none',
    userSelect: 'none',
    webkitHighlight: 'none',
    webkitTapHighlightColor: 'rgba(0,0,0,0)',
    cursor: 'default',
    outline: 'none'
  });
  
  return elem;
};

/**
 * Делает элемент кликабельным.
 * 
 * @param {string|Element} el - ID элемента или DOM элемент
 * @return {Element} Измененный элемент
 */
export const setClickable = (el) => {
  const elem = typeof el === 'string' ? selectId(el) : selectId(el);
  
  if (!elem) return null;
  
  elem.css({
    cursor: 'pointer',
    webkitTapHighlightColor: 'rgba(0,0,0,0.3)'
  });
  
  return elem;
};

/**
 * Добавляет CSS переходы для элемента.
 * 
 * @param {string|Element} el - ID элемента или DOM элемент
 * @param {string=} properties - Свойства для анимации (по умолчанию "all")
 * @param {string=} duration - Продолжительность анимации (по умолчанию "0.2s")
 * @param {string=} timingFunction - Функция времени (по умолчанию "ease")
 * @return {Element} Измененный элемент
 */
export const setTransition = (el, properties = 'all', duration = '0.2s', timingFunction = 'ease') => {
  const elem = typeof el === 'string' ? selectId(el) : selectId(el);
  
  if (!elem) return null;
  
  const transitionValue = `${properties} ${duration} ${timingFunction}`;
  
  elem.css({
    webkitTransition: transitionValue,
    MozTransition: transitionValue,
    msTransition: transitionValue,
    OTransition: transitionValue,
    transition: transitionValue
  });
  
  return elem;
};

/**
 * Отключает скролл страницы.
 */
export const disableScrolling = () => {
  document.body.style.overflow = 'hidden';
  document.body.style.position = 'fixed';
  document.body.style.width = '100%';
  document.body.style.height = '100%';
};

/**
 * Включает скролл страницы.
 */
export const enableScrolling = () => {
  document.body.style.overflow = '';
  document.body.style.position = '';
  document.body.style.width = '';
  document.body.style.height = '';
};
