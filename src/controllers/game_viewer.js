goog.provide('glift.controllers.GameViewer');

goog.require('glift.controllers.BaseController');

/**
 * A GameViewer encapsulates the idea of traversing a read-only SGF.
 *
 * @type {!glift.controllers.ControllerFunc}
 */
glift.controllers.gameViewer = function (sgfOptions) {
  const ctrl = glift.controllers;
  const baseController = glift.util.beget(ctrl.base());
  
  const newController = /** @type {!glift.controllers.BaseController} */ (
    glift.util.setMethods(baseController, ctrl.GameViewer.prototype)
  );
  
  if (!sgfOptions) {
    throw new Error('SGF Options was not defined, but must be defined');
  }
  
  newController.initOptions(sgfOptions);
  return newController;
};

/**
 * Game Viewer controller for navigating SGF game records.
 *
 * @extends {glift.controllers.BaseController}
 * @constructor
 */
glift.controllers.GameViewer = function () {};

glift.controllers.GameViewer.prototype = {
  /**
   * Called during initOptions, in the BaseController.
   *
   * Creates a persisted treepath and an index to remember the last
   * variation taken by the player.
   */
  extraOptions() {},

  /**
   * Find the variation associated with the played move.
   *
   * @param {!glift.Point} point The point where the stone was placed
   * @param {glift.enums.states} color The stone color
   * @return {?glift.flattener.Flattened} Flattened state or null if invalid move
   */
  addStone(point, color) {
    const possibleMap = this.possibleNextMoves_();
    const key = `${point.toString()}-${color}`;
    
    if (possibleMap[key] === undefined) {
      return null;
    }
    
    const nextVariationNum = possibleMap[key];
    return this.nextMove(nextVariationNum);
  },

  /**
   * Go back to the previous branch or comment.
   *
   * @param {number=} maxMovesPrevious Maximum number of moves to go back
   * @return {!glift.flattener.Flattened} Flattened state
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
    
    // Reset the 'next' variation to zero
    this.setNextVariation(0);
    return this.flattenedState();
  },

  /**
   * Go to the next branch or comment.
   *
   * @param {number=} maxMovesNext Maximum number of moves to go forward
   * @return {!glift.flattener.Flattened} Flattened state
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
  },

  /**
   * Move up what variation will be next retrieved.
   * @return {!glift.controllers.GameViewer} this, for chaining
   */
  moveUpVariations() {
    const numChildren = this.movetree.node().numChildren();
    return this.setNextVariation(
      (this.nextVariationNumber() + 1) % numChildren
    );
  },

  /**
   * Move down what variation will be next retrieved.
   * @return {!glift.controllers.GameViewer} this, for chaining
   */
  moveDownVariations() {
    // Module is defined incorrectly for negative numbers.
    // We need to add n to the result.
    const numChildren = this.movetree.node().numChildren();
    return this.setNextVariation(
      (this.nextVariationNumber() - 1 + numChildren) % numChildren
    );
  },

  /**
   * Get the possible next moves.
   *
   * Implemented as a map from point-string+color to variationNumber:
   * e.g., "10,10-BLACK" : 1
   * For pass, we use 'PASS' as the point string.
   *
   * @private
   * @return {!Object<string, number>} Map of move key to variation number
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
  },
};
