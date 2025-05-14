/**
 * Тема оформления "Colorful" для Glift.
 * Красочная тема, используемая для отладки.
 * 
 * @module themes/colorful
 */

import { baseTheme } from './base_theme.js';

/**
 * Настройки темы Colorful
 */
export const COLORFUL = {
  ...baseTheme,
  board: {
    ...baseTheme.board,
    fill: '#f5be7e'
  },
  commentBox: {
    ...baseTheme.comment,
    css: {
      background: '#CCF',
      border: '1px solid'
    }
  },
  icons: {
    DEFAULT: {
      fill: 'blue',
      stroke: 'none'
    },
    DEFAULT_HOVER: {
      fill: 'red',
      stroke: 'none'
    }
  }
};
