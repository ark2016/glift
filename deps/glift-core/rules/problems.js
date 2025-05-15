/**
 * Модуль для работы с задачами Го.
 * @module rules/problems
 */

import { enums } from '../../src/util/enums.js';
import { treepath } from './treepath.js';

/**
 * Карта свойство-значения.
 *
 * @typedef {!Object<string, !Array<string>>}
 */
export let ProblemConditions;

/**
 * Определяет, является ли "ход" правильным. Принимает дерево ходов и ряд
 * условий, которые представляют собой карту свойств в массив возможных совпадений
 * подстрок. Должно быть выполнено только одно условие.
 *
 * Результаты задачи:
 *
 * CORRECT - Свойства позиции должны соответствовать одному из нескольких условий
 *    задачи.
 * INDETERMINATE - Должен существовать путь к правильной позиции из
 *    текущей позиции.
 * INCORRECT - Позиция не имеет пути к правильной позиции.
 *
 * Некоторые примеры:
 *    Правильно, если есть свойство GB или слова 'Correct' или 'is correct' в
 *    комментарии. Это значение по умолчанию.
 *    { GB: [], C: ['Correct', 'is correct'] }
 *
 *    Ничего не правильно
 *    {}
 *
 *    Правильно, если есть тег комментария.
 *    { C: [] }
 *
 *    Правильно, если есть черный камень (странное условие).
 *    { B: [] }
 *
 * @param {!Object} movetree Дерево ходов
 * @param {!ProblemConditions} conditions Условия задачи
 * @return {string} Результат проверки задачи
 */
export function positionCorrectness(movetree, conditions) {
  const problemResults = enums.problemResults;
  if (movetree.properties().matches(conditions)) {
    return problemResults.CORRECT;
  } else {
    const flatPaths = treepath.flattenMoveTree(movetree);

    /** @type {!Object<string, boolean>} */
    const successTracker = {};

    // Для каждого пути мы оцениваем, имеет ли каждый путь возможность быть
    // правильным.
    for (let i = 0; i < flatPaths.length; i++) {
      const path = flatPaths[i];
      const newmt = movetree.getFromNode(movetree.node());
      let pathCorrect = false;
      for (let j = 0; j < path.length; j++) {
        newmt.moveDown(path[j]);
        if (newmt.properties().matches(conditions)) {
          pathCorrect = true;
        }
      }
      if (pathCorrect) {
        successTracker[problemResults.CORRECT] = true;
      } else {
        // Если ни одно условие задачи не совпадает, путь (вариация) считается
        // неправильным.
        successTracker[problemResults.INCORRECT] = true;
      }
    }

    if (
      successTracker[problemResults.CORRECT] &&
      !successTracker[problemResults.INCORRECT]
    ) {
      if (movetree.properties().matches(conditions)) {
        return problemResults.CORRECT;
      } else {
        return problemResults.INDETERMINATE;
      }
    } else if (
      successTracker[problemResults.CORRECT] &&
      successTracker[problemResults.INCORRECT]
    ) {
      return problemResults.INDETERMINATE;
    } else {
      return problemResults.INCORRECT;
    }
  }
}

/**
 * Получает правильные следующие ходы. Предполагается, что SGF является подобным
 * задаче SGF с указанными правильными условиями.
 *
 * @param {!Object} movetree Дерево ходов
 * @param {!ProblemConditions} conditions Условия задачи
 * @return {!Array<!Object>} Массив правильных следующих ходов
 */
export function correctNextMoves(movetree, conditions) {
  const nextMoves = movetree.nextMoves();
  const INCORRECT = enums.problemResults.INCORRECT;
  const correctNextMoves = [];
  for (let i = 0; i < nextMoves.length; i++) {
    movetree.moveDown(i);
    if (positionCorrectness(movetree, conditions) !== INCORRECT) {
      correctNextMoves.push(nextMoves[i]);
    }
    movetree.moveUp(); // сбрасываем позицию
  }
  return correctNextMoves;
}

// Экспорт объекта для обратной совместимости
export const problems = {
  positionCorrectness,
  correctNextMoves
};
