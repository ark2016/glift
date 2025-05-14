/**
 * Модуль тем оформления для библиотеки Glift.
 */

// Импортируем существующие компоненты тем
import { DEFAULT, DEPTH, MOODY, TRANSPARENT, TEXTBOOK } from './themes.js';
import { CssBaseTheme } from './css_base_theme.js';
import * as classes from './classes.js';

/**
 * Доступные темы оформления
 * @enum {string}
 * @const
 */
export const THEME_TYPES = Object.freeze({
  /** Стандартная тема с обычными камнями */
  DEFAULT: 'DEFAULT',
  
  /** Камни с тенями для объемного эффекта */
  DEPTH: 'DEPTH',
  
  /** Серый фон, камни без контура */
  MOODY: 'MOODY',
  
  /** Прозрачная доска */
  TRANSPARENT: 'TRANSPARENT',
  
  /** Черно-белое оформление */
  TEXTBOOK: 'TEXTBOOK'
});

/**
 * Карта доступных тем
 * @type {Map<string, Object>}
 */
export const themeMap = new Map([
  [THEME_TYPES.DEFAULT, DEFAULT],
  [THEME_TYPES.DEPTH, DEPTH],
  [THEME_TYPES.MOODY, MOODY],
  [THEME_TYPES.TRANSPARENT, TRANSPARENT],
  [THEME_TYPES.TEXTBOOK, TEXTBOOK]
]);

/**
 * Получает тему по имени.
 * @param {string} themeName - Имя темы из THEME_TYPES
 * @return {Object} Объект темы
 */
export const getTheme = (themeName) => {
  if (!themeMap.has(themeName)) {
    console.warn(`Тема "${themeName}" не найдена. Используется тема по умолчанию.`);
    return themeMap.get(THEME_TYPES.DEFAULT);
  }
  return themeMap.get(themeName);
};

// Экспортируем все компоненты
export {
  DEFAULT,
  DEPTH,
  MOODY,
  TRANSPARENT,
  TEXTBOOK,
  CssBaseTheme,
  classes
}; 