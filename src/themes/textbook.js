/**
 * Тема оформления "Textbook" для Glift.
 * Черно-белая тема, напоминающая оформление учебников по игре Го.
 * 
 * @module themes/textbook
 */

import { baseTheme } from './base_theme.js';

/**
 * Настройки темы Textbook
 */
export const TEXTBOOK = {
  ...baseTheme,
  stones: {
    ...baseTheme.stones,
    BLACK: { fill: 'black', stroke: 'none' },
    WHITE: { fill: 'white', stroke: 'black', strokeWidth: 0.5 }
  },
  board: {
    ...baseTheme.board,
    fill: 'white',
    borderColor: 'black',
    shadow: false
  },
  lines: {
    ...baseTheme.lines,
    stroke: 'black'
  },
  commentBox: {
    ...baseTheme.comment,
    css: {
      background: '#FFF'
    }
  }
};
