/**
 * Тема оформления "Moody" для Glift.
 * Темная тема для игры Го.
 * 
 * @module themes/moody
 */

import { baseTheme } from './base_theme.js';

/**
 * Настройки темы Moody
 */
export const MOODY = {
  ...baseTheme,
  stones: {
    ...baseTheme.stones,
    BLACK: { fill: '#222', stroke: 'none' },
    WHITE: { fill: '#eee', stroke: 'none' },
    WHITE_HOVER: {
      fill: 'white',
      stroke: 'white',
      opacity: 0.5,
    }
  },
  board: {
    ...baseTheme.board,
    fill: '#777',
    borderColor: '#555',
    lineColor: '#555'
  },
  lines: {
    ...baseTheme.lines,
    stroke: '#888'
  },
  commentBox: {
    ...baseTheme.comment,
    css: {
      background: 'none',
      border: ''
    }
  }
};
