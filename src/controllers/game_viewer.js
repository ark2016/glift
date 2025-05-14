/**
 * Контроллер просмотрщика игры для навигации по записям игр SGF.
 * 
 * Просмотрщик игры инкапсулирует идею перемещения по SGF только для чтения.
 * 
 * @module controllers/game_viewer
 */

import { BaseController, createBaseController } from './base.js';
import { Point } from '../util/index.js';
import { enums } from '../util/enums.js';
import { CONTROLLER_TYPES } from './base.js';

/**
 * Создает контроллер просмотрщика игры.
 *
 * @param {!Object} sgfOptions Опции SGF
 * @return {!GameViewer} Новый контроллер просмотрщика игры
 */
export const createGameViewerController = (sgfOptions) => {
  if (!sgfOptions) {
    throw new Error('SGF Options не определены, но должны быть определены');
  }
  
  const controller = new GameViewer();
  controller.initOptions(sgfOptions);
  return controller;
};

/**
 * Контроллер просмотрщика игры для навигации по SGF записям игр.
 *
 * @extends {BaseController}
 */
export class GameViewer extends BaseController {
  /**
   * Создает новый экземпляр контроллера просмотрщика игры.
   */
  constructor() {
    super();
  }

  /**
   * Вызывается во время initOptions в BaseController.
   *
   * Создает сохраненный treepath и индекс для запоминания последней
   * вариации, выбранной игроком.
   */
  extraOptions() {}

  /**
   * Найти вариацию, связанную с сыгранным ходом.
   *
   * @param {!Point} point Точка, где был размещен камень
   * @param {enums.states} color Цвет камня
   * @return {?Object} Уплощенное состояние или null, если ход недействителен
   */
  addStone(point, color) {
    const possibleMap = this.possibleNextMoves_();
    const key = `${point.toString()}-${color}`;
    
    if (possibleMap[key] === undefined) {
      return null;
    }
    
    const nextVariationNum = possibleMap[key];
    return this.nextMove(nextVariationNum);
  }

  /**
   * Вернуться к предыдущей ветке или комментарию.
   *
   * @param {number=} maxMovesPrevious Максимальное количество ходов для возврата
   * @return {!Object} Уплощенное состояние
   */
  previousCommentOrBranch(maxMovesPrevious) {
    let displayData = null;
    let movesSeen = 0;
    
    do {
      displayData = this.prevMove();
      const comment = this.movetree.properties().getComment();
      const numChildren = this.movetree.node().numChildren();
      movesSeen++;
      
      if (maxMovesPrevious && movesSeen === maxMovesPrevious) {
        break;
      }
    } while (displayData && !comment && numChildren <= 1);
    
    // Сбросить 'следующую' вариацию на ноль
    this.setNextVariation(0);
    return this.flattenedState();
  }

  /**
   * Перейти к следующей ветке или комментарию.
   *
   * @param {number=} maxMovesNext Максимальное количество ходов вперед
   * @return {!Object} Уплощенное состояние
   */
  nextCommentOrBranch(maxMovesNext) {
    let displayData = null;
    let movesSeen = 0;
    
    do {
      displayData = this.nextMove();
      const comment = this.movetree.properties().getComment();
      const numChildren = this.movetree.node().numChildren();
      movesSeen++;
      
      if (maxMovesNext && movesSeen === maxMovesNext) {
        break;
      }
    } while (displayData && !comment && numChildren <= 1);
    
    return this.flattenedState();
  }

  /**
   * Переместить вверх вариацию, которая будет извлечена следующей.
   * @return {!GameViewer} this, для цепочки вызовов
   */
  moveUpVariations() {
    const numChildren = this.movetree.node().numChildren();
    return this.setNextVariation(
      (this.nextVariationNumber() + 1) % numChildren
    );
  }

  /**
   * Переместить вниз вариацию, которая будет извлечена следующей.
   * @return {!GameViewer} this, для цепочки вызовов
   */
  moveDownVariations() {
    // Модуль определен неправильно для отрицательных чисел.
    // Нам нужно добавить n к результату.
    const numChildren = this.movetree.node().numChildren();
    return this.setNextVariation(
      (this.nextVariationNumber() - 1 + numChildren) % numChildren
    );
  }

  /**
   * Получить возможные следующие ходы.
   *
   * Реализовано как отображение от строки-точки+цвета к номеру вариации:
   * например, "10,10-BLACK" : 1
   * Для пасса мы используем 'PASS' в качестве строки точки.
   *
   * @private
   * @return {!Object<string, number>} Карта ключа хода к номеру вариации
   */
  possibleNextMoves_() {
    const possibleMap = {};
    const nextMoves = this.movetree.nextMoves();
    
    for (let i = 0; i < nextMoves.length; i++) {
      const move = nextMoves[i];
      const pointStr = move.point !== undefined ? move.point.toString() : 'PASS';
      const key = `${pointStr}-${move.color}`;
      possibleMap[key] = i;
    }
    
    return possibleMap;
  }
  
  /**
   * Обрабатывает клик на точку доски.
   * @param {!Object} pt - Точка на доске
   * @return {boolean} Успешность обработки
   */
  handleClick(pt) {
    const currentPlayer = this.getCurrentPlayer();
    return this.addStone(pt, currentPlayer) !== null;
  }
}
