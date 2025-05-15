/**
 * Модуль для представления дерева ходов в игре Го.
 * @module rules/movetree
 */

import { movenode, createNode } from './movenode.js';
import { properties } from './properties.js';
import { util } from '../../src/util/util.js';
import { parse } from '../../src/parse/parse.js';
import { global } from '../../src/global.js';

/**
 * Когда SGF анализируется парсером, он преобразуется в следующее:
 *
 * MoveTree {
 *  currentNode_
 *  rootNode_
 * }
 *
 * И где MoveNode выглядит следующим образом:
 * MoveNode: {
 *    nodeId: { ... },
 *    properties: Properties,
 *    children: [MoveNode, MoveNode, MoveNode],
 *    parent: MoveNode
 *  }
 * }
 *
 * Кроме того, каждый узел в дереве ходов имеет свойство ID, которое выглядит так:
 *
 * node : {
 *  nodeId : <num>,  // Вертикальное положение в дереве.
 *  varId  : <num>,  // Номер варианта, который идентичен положению
 *                   // в массиве 'nodes'. Также "горизонтальное" положение.
 * }
 *
 * Если вы знакомы с форматом SGF, это должно выглядеть очень похоже на
 * фактический формат SGF, и его легко преобразовать обратно в SGF. Таким образом,
 * MoveTree - это простая обертка вокруг проанализированного SGF.
 *
 * Каждый ход представляет собой объект с двумя свойствами: tokens и nodes,
 * последнее из которых является списком для представления идеи множества вариаций.
 */

/**
 * Создает пустое дерево ходов.
 *
 * @param {number=} opt_intersections Опциональное количество пересечений. По умолчанию 19.
 * @return {!MoveTree} Новый экземпляр дерева ходов.
 */
export function getInstance(opt_intersections) {
  var mt = new MoveTree(movenode());
  if (opt_intersections !== undefined) {
    mt.setIntersections_(opt_intersections);
  }
  return mt;
}

/**
 * Создает дерево ходов из SGF.
 * Примечание: initPosition и parseType являются опциональными.
 *
 * @param {string} sgfString
 * @param {(string|number|!Array<number>)=} opt_initPosition
 * @param {string=} opt_parseType
 * @return {!MoveTree}
 */
export function getFromSgf(sgfString, opt_initPosition, opt_parseType) {
  var initPosition = opt_initPosition || []; // treepath.
  var parseType = opt_parseType || 'SGF';

  if (
    util.typeOf(initPosition) === 'string' ||
    util.typeOf(initPosition) === 'number'
  ) {
    initPosition = parseInitialPath(initPosition);
  }

  var initTreepath = initPosition;

  if (sgfString === undefined || sgfString === '') {
    return getInstance(19);
  }

  var mt = parse.fromString(sgfString, parseType);

  mt = mt.getTreeFromRoot(initTreepath);

  return mt;
}

/**
 * Ищет узлы с помощью поиска в глубину.
 * @param {!MoveTree} moveTree
 * @param {function(!MoveTree)} func
 */
export function searchMoveTreeDFS(moveTree, func) {
  func(moveTree);
  for (var i = 0; i < moveTree.node().numChildren(); i++) {
    var mtz = moveTree.newTreeRef();
    searchMoveTreeDFS(mtz.moveDown(i), func);
  }
}

/**
 * Удобный метод для установки корневых свойств стандартным образом
 * @param {!MoveTree} mt
 * @return {!MoveTree} Инициализированное дерево ходов.
 */
export function initRootProperties(mt) {
  var root = mt.getTreeFromRoot();
  var props = root.properties();
  var prop = {
    GM: 'GM',
    FF: 'FF',
    CA: 'CA',
    AP: 'AP',
    KM: 'KM',
    RU: 'RU',
    SZ: 'SZ',
    PB: 'PB',
    PW: 'PW'
  };
  
  if (!props.contains(prop.GM)) {
    props.add(prop.GM, '1');
  }
  if (!props.contains(prop.FF)) {
    props.add(prop.FF, '4');
  }
  if (!props.contains(prop.CA)) {
    props.add(prop.CA, 'UTF-8');
  }
  if (!props.contains(prop.AP)) {
    // The global.version - это версия пользовательского интерфейса. Используйте эту версию, если
    // она существует. В противном случае полагайтесь на базовую версию rules.
    var version = global.version;
    if (version) {
      props.add(prop.AP, 'Glift:' + global.version);
    } else {
      props.add(prop.AP, 'Glift-core:' + global['core-version']);
    }
  }
  if (!props.contains(prop.KM)) {
    props.add(prop.KM, '0.00');
  }
  if (!props.contains(prop.RU)) {
    props.add(prop.RU, 'Japanese');
  }
  if (!props.contains(prop.SZ)) {
    props.add(prop.SZ, '19');
  }
  if (!props.contains(prop.PB)) {
    props.add(prop.PB, 'Black');
  }
  if (!props.contains(prop.PW)) {
    props.add(prop.PW, 'White');
  }
  // Примечание: мы не устанавливаем ST, потому что это глупая опция. (Стиль
  // отображения вариантов).
  return mt;
}

/**
 * Вспомогательная функция для анализа начального пути.
 * @param {(string|number)} initPos
 * @return {!Array<number>}
 */
export function parseInitialPath(initPos) {
  if (initPos === undefined) {
    return [];
  }
  var num = parseInt(initPos, 10);
  if (isNaN(num)) {
    return [];
  }
  if (num === 0) {
    return [];
  } else if (num === 1) {
    return [0];
  }
  var answer = [];
  for (var i = 0; i < num; i++) {
    answer.push(0);
  }
  return answer;
}

/**
 * Дерево ходов - это дерево сделанных ходов. Дерево ходов - это (обычно)
 * обработанный проанализированный SGF, но может быть создано и органически.
 *
 * Семантически дерево ходов можно рассматривать как игру, но также может быть
 * задачей, демонстрацией или примером. Таким образом, это место, где такие ходы
 * как currentPlayer или lastMove.
 *
 * @param {!Object} rootNode
 * @param {!Object=} opt_currentNode
 * @param {Object=} opt_metadata
 *
 * @constructor @final @struct
 */
export class MoveTree {
  constructor(rootNode, opt_currentNode, opt_metadata) {
    /** @private {!Object} */
    this.rootNode_ = rootNode;
    /** @private {!Object} */
    this.currentNode_ = opt_currentNode || rootNode;
    /** @private {boolean} */
    this.markedMainline_ = false;

    /**
     * Метаданные - это произвольные данные, прикрепленные к узлу.
     *
     * Как побочное примечание, извлечение метаданных в Glift происходит в парсере и поэтому
     * не будет отображаться в комментариях. См. опцию metadataProperty в
     * options.baseOptions.
     * @private {Object}
     */
    this.metadata_ = opt_metadata || null;
  }

  /////////////////////////
  // Most common methods //
  /////////////////////////

  /**
   * Получает текущий узел - то есть, узел в текущей позиции.
   * @return {!Object}
   */
  node() {
    return this.currentNode_;
  }

  /**
   * Получает объект свойств текущего узла.
   * @return {!Object}
   */
  properties() {
    return this.node().properties();
  }

  /**
   * Получает глобальные метаданные дерева ходов.
   * @return {Object}
   */
  metadata() {
    return this.metadata_;
  }

  /**
   * Устанавливает метаданные для этого дерева ходов.
   * @param {Object} data
   * @return {!MoveTree} this
   */
  setMetdata(data) {
    this.metadata_ = data;
    return this;
  }

  /**
   * Перемещается вниз, но только если есть доступный вариант. variationNum может
   * быть неопределенным для удобства, в этом случае по умолчанию он равен 0.
   * @param {number=} opt_variationNum
   * @return {!MoveTree} this
   */
  moveDown(opt_variationNum) {
    var num = opt_variationNum || 0;
    var child = this.node().getChild(num);
    if (child != null) {
      this.currentNode_ = child;
    }
    return this;
  }

  /**
   * Перемещается вверх на один ход, но только если вы не находитесь в корневом ходе.
   * В корневом узле, movetree.moveUp().moveUp() == movetree.moveUp();
   * @return {!MoveTree} this
   */
  moveUp() {
    var parent = this.currentNode_.getParent();
    if (parent) {
      this.currentNode_ = parent;
    }
    return this;
  }

  /**
   * Получает текущего игрока в виде цвета.
   * @return {string}
   */
  getCurrentPlayer() {
    var states = glift.enums.states;
    var tokenMap = { W: 'WHITE', B: 'BLACK' };
    var curNode = this.currentNode_;

    // The PL property is a short circuit. Usually only used on the root node.
    if (this.properties().contains(glift.rules.prop.PL)) {
      return tokenMap[this.properties().getOneValue(glift.rules.prop.PL)];
    }

    var move = curNode.properties().getMove();
    while (!move) {
      curNode = curNode.getParent();
      if (!curNode) {
        return states.BLACK;
      }
      move = curNode.properties().getMove();
    }
    if (!move) {
      return states.BLACK;
    } else if (move.color === states.BLACK) {
      return states.WHITE;
    } else if (move.color === states.WHITE) {
      return states.BLACK;
    } else {
      return states.BLACK;
    }
  }

  /**
   * Get a new tree reference.  The underlying tree remains the same, but this
   * is a lightway to create new references so the current node position can be
   * changed.
   * @return {!MoveTree}
   */
  newTreeRef() {
    return new MoveTree(
      this.rootNode_,
      this.currentNode_,
      this.metadata_
    );
  }

  /**
   * Creates a new Movetree reference from a particular node. The underlying
   * node-tree remains the same.
   *
   * Since a MoveTree is a tree of connected nodes, we can create a sub-tree
   * from any position in the tree.  This can be useful for recursion.
   *
   * @param {!Object} node
   * @return {!MoveTree} New movetree reference.
   */
  getFromNode(node) {
    return new MoveTree(node, node, this.metadata_);
  }

  /**
   * Gets a new move tree instance from the root node. Important note: this
   * creates a new tree reference. Thus, if you don't assign to a var, nothing
   * will happen.
   *
   * @param {!Array<number>=} treepath
   * @return {!MoveTree} New movetree reference.
   */
  getTreeFromRoot(treepath) {
    var mt = this.getFromNode(this.rootNode_);
    if (treepath && util.typeOf(treepath) === 'array') {
      for (
        var i = 0, len = treepath.length;
        i < len && mt.node().numChildren() > 0;
        i++
      ) {
        mt.moveDown(treepath[i]);
      }
    }
    return mt;
  }

  ///////////////////////////////////
  // Other methods, in Alpha Order //
  ///////////////////////////////////
  /**
   * Add a new Node to the cur position and move to that position.
   * @return {!MoveTree} this
   */
  addNode() {
    this.node().addChild();
    this.moveDown(this.node().numChildren() - 1);
    return this;
  }

  /** Delete the current node and move up */
  // TODO(kashomon): Finish this.
  deleteNode() {
    throw 'Unfinished';
  }

  /**
   * Given a point and a color, find the variation number corresponding to the
   * branch that has the specified move. The idea behind this method is that:
   * some player plays a move: does the move currently exist in the movetree?
   *
   * @param {!glift.Point} point Intersection for the move
   * @param {glift.enums.states} color Color of the move.
   * @return {number|null} either the number or null if no such number exists.
   */
  findNextMove(point, color) {
    var nextNodes = this.node().children,
      token = glift.sgf.colorToToken(color),
      ptSet = {};
    for (var i = 0; i < nextNodes.length; i++) {
      var node = nextNodes[i];
      if (node.properties().contains(token)) {
        if (node.properties().getOneValue(token) == '') {
          // This is a 'PASS'.  Ignore
        } else {
          ptSet[node.properties().getAsPoint(token).toString()] =
            node.getVarNum();
        }
      }
    }
    if (ptSet[point.toString()] !== undefined) {
      return ptSet[point.toString()];
    } else {
      return null;
    }
  }

  /**
   * Get the intersections number of the go board, by looking at the props.
   * @return {number}
   */
  getIntersections() {
    var mt = this.getTreeFromRoot(),
      prop = glift.rules.prop;
    if (mt.properties().contains(prop.SZ)) {
      var ints = parseInt(mt.properties().getAllValues(prop.SZ), 10);
      return ints;
    } else {
      return 19;
    }
  }

  /**
   * Get the last move ([B] or [W]). This is a convenience method, since it
   * delegates to properties().getMove();
   *
   * Returns a move object: { color:<color point:<point } or null;
   *
   * There are two cases where null can be returned:
   *  - At the root node.
   *  - When, in the middle of the game, stone-placements are added for
   *    illustration (AW,AB).
   * @return {?glift.rules.Move}
   */
  getLastMove() {
    return this.properties().getMove();
  }

  /**
   * If not on the mainline, returns the appriate 'move number' for a variation,
   * for the current location, which is the number of moves to mainline
   *
   * @return {number} The number of moves to get to the mainline branch and 0 if
   *    already on the mainline branch.
   */
  movesToMainline() {
    var mt = this.newTreeRef();
    for (var n = 0; !mt.onMainline() && mt.node().getParent(); n++) {
      mt.moveUp();
    }
    return n;
  }

  /**
   * Gets the the first node in the parent chain that is on the mainline.
   *
   * @return {!Object}
   */
  getMainlineNode() {
    var mt = this.newTreeRef();
    while (!mt.onMainline()) {
      mt.moveUp();
    }
    return mt.node();
  }

  /**
   * Get the next moves (i.e., nodes with either B or W properties);
   *
   * The ordering of the moves is guaranteed to be the ordering of the
   *    variations at the time of creation.
   *
   * @return {!Array<!glift.rules.Move>}
   */
  nextMoves() {
    var curNode = this.node();
    var nextMoves = [];
    for (var i = 0; i < curNode.numChildren(); i++) {
      var nextNode = curNode.getChild(i);
      var move = nextNode.properties().getMove();
      if (move) {
        nextMoves.push(move);
      }
    }
    return nextMoves;
  }

  /**
   * Returns true if the tree is currently on a mainline variation and false
   * otherwise.
   * @return {boolean}
   */
  onMainline() {
    if (!this.markedMainline_) {
      var mt = this.getTreeFromRoot();
      mt.node().mainline_ = true;
      while (mt.node().numChildren() > 0) {
        mt.moveDown();
        mt.node().mainline_ = true;
      }
      this.markedMainline_ = true;
    }
    return this.node().mainline_;
  }

  /**
   * Construct an entirely new movetree, but add all the previous stones as
   * placements.  If the tree is at the root, it's equivalent to a copy of the
   * movetree.
   *
   * @return {!MoveTree} Entirely new movetree.
   */
  rebase() {
    var path = this.treepathToHere();
    var oldMt = this.getTreeFromRoot();
    var oldCurrentPlayer = this.getCurrentPlayer();

    var mt = getInstance();
    var propMap = { BLACK: 'AB', WHITE: 'AW' };
    for (var i = 0; i <= path.length; i++) {
      var stones = oldMt.properties().getAllStones();
      for (var color in stones) {
        var moves = stones[color];
        var prop = propMap[color];
        for (var j = 0; j < moves.length; j++) {
          var point = moves[j].point;
          if (point && prop) {
            mt.properties().add(prop, point.toSgfCoord());
          }
        }
      }
      if (i < path.length) {
        oldMt.moveDown(path[i]);
      }
    }

    // Recursive function for copying data.
    var copier = function (oldnode, newnode) {
      for (var prop in oldnode.properties().propMap) {
        if (newnode.getNodeNum() === 0 && (prop === 'AB' || prop === 'AW')) {
          continue; // Ignore. We've already copied stones on the root.
        }
        newnode
          .properties()
          .set(
            prop,
            util.simpleClone(oldnode.properties().getAllValues(prop))
          );
      }
      for (var i = 0; i < oldnode.children.length; i++) {
        var oldChild = oldnode.getChild(i);
        var newChild = newnode.addChild().getChild(i);
        copier(oldChild, newChild);
      }
    };
    copier(oldMt.node(), mt.node());

    // Ensure the current player remains the same.
    var tokenmap = { BLACK: 'B', WHITE: 'W' };
    var mtCurPlayer = mt.getCurrentPlayer();
    if (mtCurPlayer !== oldCurrentPlayer) {
      mt.properties().add(glift.rules.prop.PL, tokenmap[oldCurrentPlayer]);
    }
    return mt;
  }

  /**
   * Recursive over the movetree. func is called on the movetree.
   * @param {function(MoveTree)} func
   */
  recurse(func) {
    searchMoveTreeDFS(this, func);
  }

  /**
   * Recursive over the movetree from root. func is called on the movetree.
   * @param {function(MoveTree)} func
   */
  recurseFromRoot(func) {
    searchMoveTreeDFS(this.getTreeFromRoot(), func);
  }

  /**
   * Convert this movetree to an SGF.
   * @return {string}
   */
  toSgf() {
    return this.toSgfBuffer_(this.getTreeFromRoot().node(), []).join('');
  }

  /**
   * Create a treepath to the current location. This does not change the current
   * movetree.
   *
   * @return {!Array<number>} A treepath (an array of variation numbers);
   */
  treepathToHere() {
    var newTreepath = [];
    var movetree = this.newTreeRef();
    while (movetree.node().getParent()) {
      newTreepath.push(movetree.node().getVarNum());
      movetree.moveUp();
    }
    return newTreepath.reverse();
  }

  /**
   * Set the intersections property.
   * Note: This is quite dangerous. If the goban and other data structures are
   * not also updated, chaos will ensue
   *
   * @param {number} intersections
   * @return {MoveTree} this object.
   * @private
   */
  setIntersections_(intersections) {
    var mt = this.getTreeFromRoot(),
      prop = glift.rules.prop;
    if (!mt.properties().contains(prop.SZ)) {
      this.properties().add(prop.SZ, intersections + '');
    }
    return this;
  }

  /**
   * Recursive method to build an SGF into an array of data.
   * @param {!Object} node A MoveNode instance.
   * @param {!Array<string>} builder String buffer
   * @return {!Array<string>} the built buffer
   * @private
   */
  toSgfBuffer_(node, builder) {
    if (node.getParent()) {
      // Don't add a \n if we're at the root node
      builder.push('\n');
    }

    if (!node.getParent() || node.getParent().numChildren() > 1) {
      builder.push('(');
    }

    builder.push(';');
    for (var prop in node.properties().propMap) {
      var values = node.properties().getAllValues(prop);
      var out = prop;
      if (values.length > 0) {
        for (var i = 0; i < values.length; i++) {
          // Ensure a string and escape right brackets.
          var val = glift.parse.sgfEscape(values[i]);
          out += '[' + val + ']';
        }
      } else {
        out += '[]';
      }
      builder.push(out);
    }

    for (var i = 0, len = node.numChildren(); i < len; i++) {
      var child = node.getChild(i);
      if (child) {
        // Child should never be null here since we're iterating over the
        // children, but the method can return null.
        this.toSgfBuffer_(child, builder);
      }
    }

    if (!node.getParent() || node.getParent().numChildren() > 1) {
      builder.push(')');
    }
    return builder;
  }
}

// Экспорт для обратной совместимости
export const movetree = {
  getInstance,
  getFromSgf,
  searchMoveTreeDFS,
  initRootProperties,
  parseInitialPath
};
