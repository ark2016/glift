/**
 * Тема оформления "Transparent" для Glift.
 * Прозрачная тема, в которой видна только разметка доски.
 * 
 * @module themes/transparent
 */

import { baseTheme } from './base_theme.js';

/**
 * Настройки темы Transparent
 */
export const TRANSPARENT = {
  ...baseTheme,
  board: {
    ...baseTheme.board,
    fill: 'none',
    borderColor: 'rgba(0,0,0,0.12)'
  },
  lines: {
    ...baseTheme.lines,
    stroke: 'rgba(0,0,0,0.5)'
  },
  commentBox: {
    ...baseTheme.comment,
    css: {
      background: 'none',
      border: ''
    }
  }
};
