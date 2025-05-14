/**
 * Базовая CSS-тема для компонентов Glift.
 * 
 * Этот модуль содержит определения CSS для основных элементов UI.
 * 
 * @module themes/css_base_theme
 */

import { CLASSES } from './classes.js';

/**
 * Класс определения CSS для хранения свойств CSS и дополнительных метаданных.
 */
export class CssDef {
  /**
   * @param {!Object<string, string>} css Основные CSS-свойства
   * @param {!Object<string, (string|number)>=} extra Опциональные дополнительные свойства
   */
  constructor(css, extra = {}) {
    /**
     * Базовые CSS-свойства (stroke, fill и т.д.)
     * @type {!Object<string, string>}
     */
    this.css = css;
    
    /**
     * Дополнительные свойства, иногда необходимые для конструирования
     * @type {!Object<string, (string|number)>}
     */
    this.extra = extra;
  }
}

/**
 * Базовая CSS-тема для компонентов Glift.
 * @type {!Object<string, !CssDef>}
 */
export const cssBaseTheme = (() => {
  const theme = {};
  
  /**
   * Помощник для создания определений CSS
   * @param {!Object<string, string>} css CSS-свойства
   * @param {!Object<string, (string|number)>=} extra Опциональные дополнительные свойства
   * @return {!CssDef} Созданное определение CSS
   */
  const cssDef = (css, extra) => new CssDef(css, extra);
  
  // Стилизация доски
  theme[CLASSES.BOARD] = cssDef({
    fill: '#f5be7e',
    stroke: '#000000',
    'stroke-width': '1',
  });
  
  // Звездные точки (хоси)
  theme[CLASSES.STARPOINTS] = cssDef(
    {
      fill: 'black',
    },
    {
      // Настройки для отрисовки звездных точек
      sizeFraction: 0.15, // Как доля от расстояния между линиями
    }
  );
  
  // Линии доски
  theme[CLASSES.BOARD_LINES] = cssDef({
    stroke: 'black',
    'stroke-width': 0.5,
  });
  
  // Метки координат
  theme[CLASSES.BOARD_COORD_LABELS] = cssDef({
    fill: 'black',
    stroke: 'black',
    opacity: '0.6',
    'font-family': 'sans-serif',
    'font-size': '0.6',
  });
  
  return theme;
})();
