goog.provide('glift.themes.classes');

/**
 * CSS class names used to style Glift components.
 * 
 * These constants are used throughout the application to ensure
 * consistent class naming and to avoid typos.
 *
 * @enum {string}
 * @readonly
 */
glift.themes.classes = Object.freeze({
  /** Container for generic text boxes */
  TEXT_BOX: 'glift-text-box',

  /** Element with absolute positioning */
  ABSOLUTE_ELEM: 'glift-absolute-elem',

  /// ///////////////////////
  // Basic board elements //
  /// ///////////////////////

  /** The main Go board element */
  BOARD: 'glift-board',
  
  /** Star points on the Go board */
  STARPOINTS: 'glift-starpoints',
  
  /** Board grid lines */
  BOARD_LINES: 'glift-board-lines',
  
  /** Coordinate labels around the board */
  BOARD_COORD_LABELS: 'glift-board-coord-labels',

  /** Shadow effects for stones */
  STONE_SHADOWS: 'glift-stone-shadows',
  
  /** Marks on stones (triangles, circles, etc.) */
  STONE_MARKS: 'glift-stone-marks',
});
