/**
 * Модуль для представления узла в дереве ходов.
 * @module rules/movenode
 */

import { properties } from './properties.js';

/**
 * ID для конкретного узла. Примечание: ID не гарантированно уникален 
 * из-за разветвления дерева. Однако он однозначно идентифицирует 
 * дочерний элемент родительского элемента.
 *
 * @typedef {{
 *  nodeNum: number, // Номер узла (глубина)
 *  varNum: number // Номер варианта
 * }}
 */
export let NodeId;

/**
 * Класс, представляющий узел в дереве ходов.
 */
export class MoveNode {
  /**
   * @param {!Object=} opt_properties - Свойства узла
   * @param {!Array<!MoveNode>=} opt_children - Дочерние узлы
   * @param {!NodeId=} opt_nodeId - ID узла
   * @param {!MoveNode=} opt_parentNode - Родительский узел
   */
  constructor(opt_properties, opt_children, opt_nodeId, opt_parentNode) {
    /** @private {!Object} */
    this.properties_ = opt_properties || properties();
    /** @type {!Array<!MoveNode>} */
    this.children = opt_children || [];
    /** @private {!NodeId} */
    this.nodeId_ = opt_nodeId || { nodeNum: 0, varNum: 0 };
    /** @type {?MoveNode} */
    this.parentNode_ = opt_parentNode || null;

    /**
     * Маркер для определения основной линии.
     * @package {boolean}
     */
    this.mainline_ = false;
  }

  /**
   * Возвращает свойства узла.
   * @return {!Object} Свойства узла
   */
  properties() {
    return this.properties_;
  }

  /**
   * Устанавливает ID узла. Каждый узел имеет ID на основе глубины и номера варианта.
   *
   * Этот метод следует использовать с осторожностью. Если не корректировать
   * окружающие узлы, дерево ходов может прийти в некорректное состояние.
   * @param {number} nodeNum - Номер узла
   * @param {number} varNum - Номер варианта
   * @private
   * @return {!MoveNode} this для цепочки вызовов
   */
  setNodeId_(nodeNum, varNum) {
    this.nodeId_ = { nodeNum: nodeNum, varNum: varNum };
    return this;
  }

  /**
   * Получает номер узла (т.е. номер глубины). 
   * @return {number} Номер узла
   */
  getNodeNum() {
    return this.nodeId_.nodeNum;
  }

  /**
   * Получает номер варианта.
   * @return {number} Номер варианта
   */
  getVarNum() {
    return this.nodeId_.varNum;
  }

  /**
   * Получает количество дочерних узлов.
   * @return {number} Количество дочерних узлов
   */
  numChildren() {
    return this.children.length;
  }

  /**
   * Добавляет новый дочерний узел.
   * @return {!MoveNode} this для цепочки вызовов
   */
  addChild() {
    this.children.push(
      new MoveNode(
        properties(),
        [], // дочерние узлы
        { nodeNum: this.getNodeNum() + 1, varNum: this.numChildren() },
        this
      )
    );
    return this;
  }

  /**
   * Получает следующий дочерний узел. Семантически это то же самое, что и
   * перемещение вниз по дереву ходов.
   * @param {number=} variationNum - Номер варианта (по умолчанию 0)
   * @return {?MoveNode} Узел или null, если он не существует
   */
  getChild(variationNum) {
    variationNum = variationNum || 0;
    if (this.children.length > 0) {
      return this.children[variationNum];
    } else {
      return null;
    }
  }

  /**
   * Возвращает родительский узел. Возвращает null, если родительский узел не существует.
   * @return {?MoveNode} Родительский узел
   */
  getParent() {
    return this.parentNode_;
  }

  /**
   * Перенумеровывает узлы. Полезно, когда узлы удаляются при редактировании SGF.
   * Примечание: перенумерация выполняется рекурсивно.
   * @return {!MoveNode} this для цепочки вызовов
   */
  renumber() {
    numberMoves_(this, this.nodeId_.nodeNum, this.nodeId_.varNum);
    return this;
  }
}

/**
 * Рекурсивно перенумеровывает узлы.
 * @param {!MoveNode} move - Узел хода
 * @param {number} nodeNum - Номер узла
 * @param {number} varNum - Номер варианта
 * @return {!MoveNode} Узел хода
 * @private
 */
export function numberMoves_(move, nodeNum, varNum) {
  move.setNodeId_(nodeNum, varNum);
  for (let i = 0; i < move.children.length; i++) {
    const next = move.children[i];
    numberMoves_(next, nodeNum + 1, i);
  }
  return move;
}

/**
 * Создает новый узел хода.
 * @param {!Object=} opt_properties - Свойства узла
 * @param {!Array<!MoveNode>=} opt_children - Дочерние узлы
 * @param {!NodeId=} opt_nodeId - ID узла
 * @param {!MoveNode=} opt_parentNode - Родительский узел
 * @return {!MoveNode} Новый узел хода
 */
export function createNode(opt_properties, opt_children, opt_nodeId, opt_parentNode) {
  return new MoveNode(opt_properties, opt_children, opt_nodeId, opt_parentNode);
}

// Экспорт для обратной совместимости
export const movenode = createNode; 