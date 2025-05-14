/**
 * Модуль контроллеров для библиотеки Glift.
 * Контроллеры обеспечивают логический слой (мозг) виджетов доски Го.
 * 
 * @module controllers
 */

import { 
  BaseController, 
  createBaseController, 
  CONTROLLER_TYPES 
} from './base.js';

import { GameViewer, createGameViewerController } from './game_viewer.js';
import { StaticProblem, createStaticProblemController } from './static_problem.js';
import { BoardEditor, createBoardEditorController } from './board_editor.js';

/**
 * Экспорт контроллеров и их фабричных функций
 */
export { 
  BaseController, 
  createBaseController,
  GameViewer,
  createGameViewerController,
  StaticProblem,
  createStaticProblemController,
  BoardEditor,
  createBoardEditorController,
  CONTROLLER_TYPES
};

/**
 * Создает контроллер нужного типа.
 * @param {string} controllerType - Тип контроллера
 * @param {Object} sgfOptions - Опции SGF
 * @return {BaseController} Созданный контроллер
 */
export const createController = (controllerType, sgfOptions) => {
  if (!sgfOptions) {
    throw new Error('SGF Options не определены, но должны быть определены');
  }
  
  switch (controllerType) {
    case CONTROLLER_TYPES.GAME_VIEWER:
      return createGameViewerController(sgfOptions);
    case CONTROLLER_TYPES.STATIC_PROBLEM:
      return createStaticProblemController(sgfOptions);
    case CONTROLLER_TYPES.BOARD_EDITOR:
      return createBoardEditorController(sgfOptions);
    case CONTROLLER_TYPES.BASE:
    default:
      return createBaseController(sgfOptions);
  }
};

// Экспорт объекта, содержащего все типы контроллеров,
// для обратной совместимости
export const controllers = {
  base: createBaseController,
  gameViewer: createGameViewerController,
  staticProblem: createStaticProblemController,
  boardEditor: createBoardEditorController,
  TYPES: CONTROLLER_TYPES
}; 