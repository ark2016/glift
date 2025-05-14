/**
 * Модуль отображения компонентов библиотеки Glift.
 * 
 * @module displays
 */

// Импортируем компоненты отображения
import * as board from './board/index.js';
import * as statusbar from './statusbar/index.js';

// Экспортируем все подмодули
export {
  board,
  statusbar
};

/**
 * Типы отображений.
 * @enum {string}
 * @const
 */
export const DISPLAY_TYPE = Object.freeze({
  /** Полное отображение с доской и статусбаром */
  FULL: 'FULL',
  
  /** Только доска */
  BOARD_ONLY: 'BOARD_ONLY',
  
  /** Только статусбар */
  STATUSBAR_ONLY: 'STATUSBAR_ONLY'
});

/**
 * Создает комплексное отображение.
 * @param {Object} options - Опции для создания отображения
 * @return {Object} Созданное отображение
 */
export const create = (options) => {
  const display = {};
  
  // Создаем доску, если она нужна
  if (options.boardDisplay !== false) {
    display.board = board.create(options.boardOptions || {});
  }
  
  // Создаем статусбар, если он нужен
  if (options.statusbarDisplay !== false) {
    display.statusbar = statusbar.create(options.statusbarOptions || {});
  }
  
  return display;
};

/**
 * Создает отображение нужного типа.
 * @param {string} type - Тип отображения
 * @param {Object} options - Опции для создания отображения
 * @return {Object} Созданное отображение
 */
export const createByType = (type, options = {}) => {
  switch (type) {
    case DISPLAY_TYPE.BOARD_ONLY:
      return create({ boardDisplay: true, statusbarDisplay: false, ...options });
    case DISPLAY_TYPE.STATUSBAR_ONLY:
      return create({ boardDisplay: false, statusbarDisplay: true, ...options });
    case DISPLAY_TYPE.FULL:
    default:
      return create({ boardDisplay: true, statusbarDisplay: true, ...options });
  }
}; 