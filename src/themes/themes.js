/**
 * Модуль с определениями тем оформления.
 * Содержит различные темы для отображения доски.
 */

// Импортируем базовую тему
import { baseTheme } from './base_theme.js';

/**
 * Тема DEFAULT: Стандартная тема с обычными камнями
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

/**
 * Тема DEPTH: Камни с тенями для объемного эффекта
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
    shadow: true
  },
  board: {
    ...baseTheme.board,
    fill: '#DCB35C',
    borderColor: '#5E2E0C',
    shadow: true
  }
};

/**
 * Тема MOODY: Серый фон, камни без контура
 */
export const MOODY = {
  ...baseTheme,
  stones: {
    ...baseTheme.stones,
    BLACK: { fill: '#222', stroke: 'none' },
    WHITE: { fill: '#eee', stroke: 'none' }
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
  }
};

/**
 * Тема TRANSPARENT: Прозрачная доска
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
  }
};

/**
 * Тема TEXTBOOK: Черно-белое оформление
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
  }
};
