/**
 * Модуль правил игры Go.
 * Содержит функции и классы для управления доской, деревом ходов и правилами игры.
 * 
 * @module rules
 */

// Импортируем и реэкспортируем компоненты
import { prop } from './all_properties.js';
import { move } from './move.js';
import { movenode, createNode } from './movenode.js';
import { movetree, MoveTree, getInstance, initRootProperties } from './movetree.js';
import { properties, props } from './properties.js';
import { goban, Goban } from '../../deps/glift-core/rules/goban.js';

// Экспортируем компоненты
export {
  move,
  movenode,
  createNode,
  movetree,
  MoveTree,
  getInstance,
  initRootProperties,
  properties,
  props,
  goban,
  Goban
};

// Экспортируем объект rules для обратной совместимости
export const rules = {
  prop,
  move,
  movenode,
  movetree,
  properties,
  goban
}; 