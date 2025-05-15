/**
 * Модуль для работы с деревом ходов.
 * @module rules/movetree
 */

import { createNode } from './movenode.js';
import { properties } from './properties.js';

/**
 * Класс MoveTree представляет дерево ходов игры.
 * 
 * Семантически MoveTree можно рассматривать как игру, но также может быть
 * задачей, демонстрацией или примером.
 */
export class MoveTree {
  /**
   * @param {!Object} rootNode Корневой узел дерева
   * @param {!Object=} opt_currentNode Текущий узел (по умолчанию корневой)
   * @param {Object=} opt_metadata Метаданные
   */
  constructor(rootNode, opt_currentNode, opt_metadata) {
    /** @private {!Object} */
    this.rootNode_ = rootNode;
    /** @private {!Object} */
    this.currentNode_ = opt_currentNode || rootNode;
    /** @private {boolean} */
    this.markedMainline_ = false;
    /** @private {Object} */
    this.metadata_ = opt_metadata || null;
  }

  /**
   * Получает текущий узел.
   * @return {!Object} Текущий узел
   */
  node() {
    return this.currentNode_;
  }

  /**
   * Получает объект свойств текущего узла.
   * @return {!Object} Свойства
   */
  properties() {
    return this.node().properties();
  }

  /**
   * Получает метаданные дерева ходов.
   * @return {Object} Метаданные
   */
  metadata() {
    return this.metadata_;
  }

  /**
   * Устанавливает метаданные для дерева ходов.
   * @param {Object} data Метаданные
   * @return {!MoveTree} this для цепочки вызовов
   */
  setMetdata(data) {
    this.metadata_ = data;
    return this;
  }

  /**
   * Перемещает указатель вниз по дереву, но только если есть доступный вариант.
   * @param {number=} opt_variationNum Номер варианта (по умолчанию 0)
   * @return {!MoveTree} this для цепочки вызовов
   */
  moveDown(opt_variationNum) {
    const num = opt_variationNum || 0;
    const child = this.node().getChild(num);
    if (child != null) {
      this.currentNode_ = child;
    }
    return this;
  }

  /**
   * Перемещает указатель вверх по дереву, но только если мы не в корневом узле.
   * @return {!MoveTree} this для цепочки вызовов
   */
  moveUp() {
    const parent = this.currentNode_.getParent();
    if (parent) {
      this.currentNode_ = parent;
    }
    return this;
  }

  /**
   * Получает текущего игрока.
   * @return {string} Цвет текущего игрока ('BLACK' или 'WHITE')
   */
  getCurrentPlayer() {
    // Упрощенная логика - просто чередуем цвета
    // В реальной реализации здесь должна быть более сложная логика,
    // учитывающая свойства узла
    const moveNum = this.node().getNodeNum();
    return moveNum % 2 === 0 ? 'BLACK' : 'WHITE';
  }

  /**
   * Получает дерево от корня с указанным путем.
   * @param {Array=} opt_treepath Путь в дереве (по умолчанию пустой массив)
   * @return {!MoveTree} Новое дерево
   */
  getTreeFromRoot(opt_treepath) {
    const treepath = opt_treepath || [];
    const mt = new MoveTree(this.rootNode_);
    
    // Перемещаемся по дереву согласно пути
    for (let i = 0; i < treepath.length; i++) {
      mt.moveDown(treepath[i]);
    }
    
    return mt;
  }

  /**
   * Создает новую ссылку на дерево.
   * @return {!MoveTree} Новая ссылка на то же дерево
   */
  newTreeRef() {
    return new MoveTree(this.rootNode_, this.currentNode_, this.metadata_);
  }

  /**
   * Добавляет новый узел в дерево.
   * @return {!MoveTree} this для цепочки вызовов
   */
  addNode() {
    this.node().addChild();
    return this.moveDown(this.node().numChildren() - 1);
  }
}

/**
 * Создает новый экземпляр дерева ходов.
 * @param {number=} opt_intersections Опционально количество пересечений (по умолчанию 19)
 * @return {!MoveTree} Новый экземпляр дерева ходов
 */
export function getInstance(opt_intersections) {
  const mt = new MoveTree(createNode());
  
  if (opt_intersections !== undefined) {
    // Устанавливаем размер доски
    const props = mt.properties();
    props.add('SZ', String(opt_intersections));
  }
  
  return mt;
}

/**
 * Инициализирует корневые свойства дерева ходов стандартным образом.
 * @param {!MoveTree} mt Дерево ходов для инициализации
 * @return {!MoveTree} Инициализированное дерево ходов
 */
export function initRootProperties(mt) {
  const root = mt.getTreeFromRoot();
  const props = root.properties();
  
  // Устанавливаем стандартные свойства SGF
  if (!props.contains('GM')) {
    props.add('GM', '1');
  }
  if (!props.contains('FF')) {
    props.add('FF', '4');
  }
  if (!props.contains('CA')) {
    props.add('CA', 'UTF-8');
  }
  if (!props.contains('AP')) {
    props.add('AP', 'Glift-core');
  }
  if (!props.contains('KM')) {
    props.add('KM', '0.00');
  }
  if (!props.contains('RU')) {
    props.add('RU', 'Japanese');
  }
  if (!props.contains('SZ')) {
    props.add('SZ', '19');
  }
  if (!props.contains('PB')) {
    props.add('PB', 'Black');
  }
  if (!props.contains('PW')) {
    props.add('PW', 'White');
  }
  
  return mt;
}

/**
 * Обходит дерево ходов с помощью поиска в глубину и применяет функцию к каждому узлу.
 * @param {!MoveTree} moveTree Дерево ходов
 * @param {function(!MoveTree)} func Функция для применения к каждому узлу
 */
export function searchMoveTreeDFS(moveTree, func) {
  func(moveTree);
  for (let i = 0; i < moveTree.node().numChildren(); i++) {
    const mtz = moveTree.newTreeRef();
    searchMoveTreeDFS(mtz.moveDown(i), func);
  }
}

// Экспорт для обратной совместимости
export const movetree = {
  getInstance,
  initRootProperties,
  searchMoveTreeDFS
}; 