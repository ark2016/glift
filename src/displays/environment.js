goog.provide('glift.displays.environment');
goog.provide('glift.displays.GuiEnvironment');

/**
 * Display environment utilities and classes.
 * 
 * The Environment contains:
 *  - The bounding box for the lines
 *  - The bounding box for the whole board
 *  - The bounding boxes for the sidebars
 *  - Board points calculations
 * 
 * @namespace
 */
glift.displays.environment = {
  /**
   * Creates and returns a GUI environment.
   * 
   * @param {!glift.orientation.BoundingBox} boardBox The bounding box for the board
   * @param {!glift.enums.boardRegions} boardRegion Region to display
   * @param {number} intersections Number of intersections (usually 19)
   * @param {boolean} drawBoardCoords Whether to draw board coordinates
   * @return {!glift.displays.GuiEnvironment} The environment object
   */
  get(boardBox, boardRegion, intersections, drawBoardCoords) {
    // For speed and isolation purposes, it's preferred to define the boardBox
    // externally rather than to calculate the h/w by inspecting the div here.
    if (!boardBox) {
      throw new Error('No Bounding Box defined for display environment!');
    }

    return new glift.displays.GuiEnvironment(
      boardBox,
      boardRegion,
      intersections,
      drawBoardCoords
    );
  },
};

/**
 * GUI Environment for Go board displays.
 * 
 * Handles calculations for board positioning, cropping, and drawing.
 *
 * @param {!glift.orientation.BoundingBox} bbox The overall bounding box
 * @param {!glift.enums.boardRegions} boardRegion Region of the board to display
 * @param {number} intersections Number of intersections
 * @param {boolean} drawBoardCoords Whether to draw board coordinates
 *
 * @constructor
 * @final
 * @struct
 */
glift.displays.GuiEnvironment = class {
  constructor(bbox, boardRegion, intersections, drawBoardCoords) {
    /** @const {!glift.orientation.BoundingBox} */
    this.bbox = bbox;
    
    /** @const {number} */
    this.divHeight = bbox.height();
    
    /** @const {number} */
    this.divWidth = bbox.width();
    
    /** @const {!glift.enums.boardRegions} */
    this.boardRegion = boardRegion;
    
    /** @const {number} */
    this.intersections = intersections;
    
    /** @const {boolean} */
    this.drawBoardCoords = drawBoardCoords;

    /** @type {!glift.displays.DisplayCropBox} */
    this.cropbox = glift.displays.cropbox.getFromRegion(
      this.boardRegion,
      this.intersections,
      this.drawBoardCoords
    );

    // ------- Defined during init ------- //
    /** @private {glift.orientation.BoundingBox} */
    this.divBox_ = null;

    /**
     * The 'true' outer-draw box for the go board.
     * @type {?glift.orientation.BoundingBox}
     */
    this.goBoardBox = null;

    /**
     * The BoardPoints object contains all intersection coordinates
     * for drawing the go-board.
     * @type {?glift.flattener.BoardPoints}
     */
    this.boardPoints = null;
  }

  /**
   * Initializes the internal variables for board placement.
   * @return {!glift.displays.GuiEnvironment} this, for chaining
   */
  init() {
    const { divHeight, divWidth, cropbox } = this;
    
    // The box for the entire div
    const divBox = glift.orientation.bbox.fromPts(
      glift.util.point(0, 0), // top left point
      glift.util.point(divWidth, divHeight) // bottom right point
    );
    
    // The resized goboard box, accounting for the cropbox
    const goBoardBox = glift.displays.getResizedBox(divBox, cropbox);
    
    // Calculate spacing between intersections
    const spacing = glift.displays.getSpacing(goBoardBox, cropbox);
    
    // Calculate the coordinates and bounding boxes for each intersection
    const boardPoints = glift.flattener.BoardPoints.fromBbox(
      this.cropbox.bboxWithoutCoords(),
      spacing,
      this.intersections,
      {
        drawBoardCoords: this.drawBoardCoords,
        padding: cropbox.basePadding(),
        croppedEdgePadding: cropbox.croppedEdgePadding(),
        offsetPt: goBoardBox.topLeft(),
      }
    );

    // Save calculated values
    this.divBox_ = divBox;
    this.goBoardBox = goBoardBox;
    this.boardPoints = boardPoints;
    
    return this;
  }
};
