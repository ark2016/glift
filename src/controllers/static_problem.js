/**
 * Контроллер статической задачи инкапсулирует идею решения
 * проблемы Го. Когда игрок ставит камень, контроллер проверяет:
 *
 * - Действительно ли существует вариация с такой позицией/цветом.
 * - Действительно ли существует узел где-то под вариацией, который приводит к
 *   'правильному' результату.
 * 
 * @module controllers/static_problem
 */

import { BaseController, createBaseController } from './base.js';
import { Point } from '../util/index.js';
import { states, problemResults } from '../util/enums.js';
import { rules } from '../rules/index.js';
import { sgf } from '../sgf/index.js';

/**
 * Создает контроллер статической задачи.
 *
 * @param {!Object} sgfOptions Опции SGF
 * @return {!StaticProblem} Новый контроллер статической задачи
 */
export const createStaticProblemController = (sgfOptions) => {
  if (!sgfOptions) {
    throw new Error('SGF Options не определены, но должны быть определены');
  }
  
  const controller = new StaticProblem();
  controller.initOptions(sgfOptions);
  return controller;
};

/**
 * Контроллер статической задачи для обработки проблем Го.
 *
 * @extends {BaseController}
 */
export class StaticProblem extends BaseController {
  /**
   * Создает новый экземпляр контроллера статической задачи.
   */
  constructor() {
    super();
  }

  /** 
   * Переопределяет дополнительные опции
   */
  extraOptions() {
    // Перебазируем дерево ходов, если мы не на нулевом ходе
    if (this.movetree.node().getNodeNum() !== 0) {
      this.movetree = this.movetree.rebase();
      this.treepath = [];
      this.captureHistory = [];
      this.initialPosition = [];
      // Это хак для сброса строки SGF, но она используется кнопкой/виджетом
      // объяснения задачи.
      this.sgfString = this.movetree.toSgf();
      // Не нужно сбрасывать goban.
    }
  }

  /** 
   * Перезагружает задачу.
   * @return {!StaticProblem} this, для цепочки вызовов
   */
  reload() {
    this.initialize();
    return this;
  }

  /**
   * Добавляет камень на доску. Поскольку это задача, мы проверяем
   * 'правильность', которую мы проверяем, все ли дочерние узлы помечены (в каком-то
   * виде) как правильные.
   *
   * Примечание: цвет должен быть одним из states (либо BLACK, либо WHITE).
   *
   * @param {!Point} point Точка, куда добавляется камень
   * @param {string} color Цвет камня
   * @return {!Object} уплощенный объект
   */
  addStone(point, color) {
    const CORRECT = problemResults.CORRECT;
    const INCORRECT = problemResults.INCORRECT;
    const INDETERMINATE = problemResults.INDETERMINATE;
    const FAILURE = problemResults.FAILURE;

    if (
      !this.goban.placeable(point) ||
      !this.goban.testAddStone(point, color)
    ) {
      const flattened = this.flattenedState();
      flattened.setProblemResult(FAILURE);
      return flattened;
    }

    const nextVarNum = this.movetree.findNextMove(point, color);
    if (nextVarNum === null) {
      // Нет вариаций, соответствующих сделанному ходу (т.е.,
      // nextVarNum равен null), поэтому мы предполагаем, что ход НЕПРАВИЛЬНЫЙ. Однако,
      // мы все еще добавляем ход вниз по дереву ходов, добавляя узел при необходимости.
      // Это позволяет нам поддерживать консистентное состояние.
      this.movetree.addNode(); // добавляем узел и перемещаемся вниз
      this.movetree
        .properties()
        .add(sgf.colorToToken(color), sgf.pointToString(point));
      this.movetree.moveUp();
      nextVarNum = this.movetree.node().numChildren() - 1;
    }

    const outData = this.nextMove(nextVarNum);
    let correctness = rules.problems.positionCorrectness(
      this.movetree,
      this.problemConditions
    );
    if (correctness === CORRECT) {
      // Не разыгрывать вариации для КОРРЕКТНОГО хода.
      outData.setProblemResult(correctness);
      return outData;
    } else if (
      correctness === CORRECT ||
      correctness === INCORRECT ||
      correctness === INDETERMINATE
    ) {
      // Играем за противоположного игрока. Выбор вариации раньше был случайным,
      // но случайность вносит путаницу.
      const nextVariation = 0;
      this.nextMove(nextVariation);
      // Возможно, что *этот* ход правильный, поэтому мы делаем еще одну проверку
      // корректности.
      // (см. https://github.com/Kashomon/glift/issues/122).
      correctness = rules.problems.positionCorrectness(
        this.movetree,
        this.problemConditions
      );
      const outData = this.flattenedState();
      outData.setProblemResult(correctness);
      return outData;
    } else {
      throw new Error('Неожиданный результат вывода: ' + correctness);
    }
  }

  /**
   * Получить текущий статус корректности.
   * @return {string}
   */
  correctnessStatus() {
    return rules.problems.positionCorrectness(
      this.movetree,
      this.problemConditions
    );
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
