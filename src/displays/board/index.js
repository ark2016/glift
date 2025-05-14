/**
 * Модуль для отображения доски Го.
 * 
 * @module displays/board
 */

import { create, Display } from './board.js';
import { Intersections } from './intersections.js';
import { boardBase, initBlurFilter } from './board_base.js';
import { boardLabels } from './board_labels.js';
import { lines } from './lines.js';
import { starpoints } from './starpoints.js';
import { shadows, stones } from './stones.js';
import { markContainer } from './marks.js';
import { buttons } from './buttons.js';

// Экспортируем все компоненты
export {
  create,
  Display,
  Intersections,
  boardBase,
  initBlurFilter,
  boardLabels,
  lines,
  starpoints,
  shadows,
  stones,
  markContainer,
  buttons
}; 