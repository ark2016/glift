/**
 * Модуль для представления хода в игре Го.
 * @module rules/move
 */

import { states } from '../util/enums.js';

/**
 * Тип, представляющий ход в игре.
 * Ход может иметь неопределенную точку, так как игроки могут пропускать ход (пас).
 *
 * @typedef {{
 *  point: (!Object|undefined), // Точка хода, может быть undefined для паса
 *  color: string // Цвет хода (BLACK или WHITE)
 * }}
 */
export let Move;

/**
 * Создает новый объект хода.
 * 
 * @param {string} color - Цвет хода (BLACK или WHITE)
 * @param {Object=} point - Точка хода (может быть undefined для паса)
 * @return {!Object} Объект хода
 */
export function create(color, point) {
  return {
    color: color,
    point: point
  };
}

/**
 * Проверяет, является ли ход пасом.
 * 
 * @param {!Object} move - Объект хода
 * @return {boolean} true, если ход является пасом
 */
export function isPass(move) {
  return move.point === undefined || move.point === null;
}

/**
 * Создает ход-пас для указанного цвета.
 * 
 * @param {string} color - Цвет хода (BLACK или WHITE)
 * @return {!Object} Объект хода-паса
 */
export function pass(color) {
  return create(color);
}

/**
 * Создает ход черных.
 * 
 * @param {!Object=} point - Точка хода (может быть undefined для паса)
 * @return {!Object} Объект хода черных
 */
export function black(point) {
  return create(states.BLACK, point);
}

/**
 * Создает ход белых.
 * 
 * @param {!Object=} point - Точка хода (может быть undefined для паса)
 * @return {!Object} Объект хода белых
 */
export function white(point) {
  return create(states.WHITE, point);
}

// Экспорт объекта для обратной совместимости
export const move = {
  create,
  isPass,
  pass,
  black,
  white
}; 