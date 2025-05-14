/**
 * Стандартная тема оформления Glift.
 * 
 * @module themes/default
 */

import { baseTheme } from './base_theme.js';

/**
 * Настройки темы Default
 */
export const DEFAULT = {
  ...baseTheme,
  stones: {
    ...baseTheme.stones,
    BLACK: { fill: 'black', stroke: 'black' },
    WHITE: { fill: 'white', stroke: '#505050' }
  },
  board: {
    ...baseTheme.board,
    fill: '#DCB35C',
    borderColor: '#5E2E0C'
  }
};
