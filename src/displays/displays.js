goog.provide('glift.displays');

/**
 * Display related utilities and board creation functions.
 * @namespace
 */
glift.displays = {
  /**
   * Creates an SVG-based Go board display.
   *
   * @param {string} elemId The DOM element ID to use for the board container
   * @param {!glift.orientation.BoundingBox} boardBox Bounding box for board dimensions
   * @param {!glift.themes.base} theme Glift theme for styling
   * @param {glift.enums.boardRegions} boardRegion Region to crop the board to
   * @param {number} intersections Number of intersections (9, 13, 19, etc.)
   * @param {glift.enums.rotations} rotation Optional rotation to apply to the board
   * @param {boolean} drawBoardCoords Whether to draw board coordinates
   *
   * @return {!glift.displays.board.Display} The board display instance
   */
  create(
    elemId,
    boardBox,
    theme,
    boardRegion,
    intersections,
    rotation,
    drawBoardCoords
  ) {
    const env = glift.displays.environment.get(
      boardBox,
      boardRegion,
      intersections,
      drawBoardCoords
    );

    return glift.displays.board.create(elemId, env, theme, rotation);
  },

  /**
   * Creates a bounding box for a div element based on its dimensions.
   * 
   * @param {string} divId ID of a div element
   * @return {!glift.orientation.BoundingBox} Bounding box for the div
   */
  bboxFromDiv(divId) {
    const elem = glift.dom.elem(divId);
    return glift.orientation.bbox.fromSides(
      glift.util.point(0, 0),
      elem.width(),
      elem.height()
    );
  },

  /**
   * Creates a bounding box for an element relative to the window.
   * 
   * @param {string} elemId ID of an element
   * @return {!glift.orientation.BoundingBox} Bounding box relative to window
   */
  bboxFromWindowSize(elemId) {
    const elem = glift.dom.elem(elemId);
    const position = elem.boundingClientRect();
    
    return glift.orientation.bbox.fromSides(
      glift.util.point(position.left, position.top),
      position.width,
      position.height
    );
  }
};
