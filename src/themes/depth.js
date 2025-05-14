/**
 * Тема оформления "Depth" для Glift.
 * Тема с объемными камнями и тенями.
 * 
 * @module themes/depth
 */

import { baseTheme } from './base_theme.js';

/**
 * Настройки темы Depth
 */
export const DEPTH = {
  ...baseTheme,
  stones: {
    ...baseTheme.stones,
    BLACK: { 
      fill: 'url(#blackStoneGradient)', 
      stroke: 'none',
      opacity: 0.95
    },
    WHITE: { 
      fill: 'url(#whiteStoneGradient)', 
      stroke: '#909090',
      strokeWidth: 0.1,
      opacity: 0.95
    },
    WHITE_HOVER: {
      fill: 'white',
      stroke: 'white',
      opacity: 0.5,
    },
    shadows: {
      stroke: 'none',
      fill: '#777',
    },
    shadow: true
  },
  board: {
    ...baseTheme.board,
    fill: '#DCB35C',
    borderColor: '#5E2E0C',
    shadow: true
  }
};
