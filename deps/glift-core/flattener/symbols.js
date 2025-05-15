/**
 * Модуль символов для представления элементов доски Го.
 * @module flattener/symbols
 */

import { enums } from '../../../src/util/enums.js';

/**
 * Symbolic representation of a Go Board display.
 * @enum {number}
 */
export const symbols = {
  // Empty location.  Useful for creating dense arrays.  Can be used for any of
  // the three layers. Assigned to 0 for the usefulness of truthiness.
  EMPTY: 0,

  //
  // Board symbols.  This comprises the first layer.
  //
  TL_CORNER: 2,
  TR_CORNER: 3,
  BL_CORNER: 4,
  BR_CORNER: 5,
  TOP_EDGE: 6,
  BOT_EDGE: 7,
  LEFT_EDGE: 8,
  RIGHT_EDGE: 9,
  CENTER: 10,
  // Center + starpoint. Maybe should just be starpoint, but this is more clear.
  CENTER_STARPOINT: 11,

  //
  // Stone symbols. This comprises the second layer.
  //
  BSTONE: 20,
  WSTONE: 21,

  //
  // Labels and marks. This comprises the third layer.
  //
  TRIANGLE: 30,
  SQUARE: 31,
  CIRCLE: 32,
  XMARK: 33,

  // Text Labeling (numbers or letters)
  TEXTLABEL: 34,

  // Extra marks, used for display.  These are not specified by the SGF
  // specification, but they are often useful.
  LASTMOVE: 35,

  // It's useful to destinguish between standard TEXTLABELs and NEXTVARIATION
  // labels.
  NEXTVARIATION: 36,

  // Variation identified as correct
  CORRECT_VARIATION: 37,

  // Location for a Ko
  KO_LOCATION: 38,
};

/**
 * Mapping between flattener stone symbol and a glift color-state enum.
 * @type {!Object<symbols, enums.states>}
 */
export const symbolStoneToState = {
  0: enums.states.EMPTY,
  20: enums.states.BLACK, // BSTONE,
  21: enums.states.WHITE, // WSTONE
};

/**
 * Mapping between flattener mark symbol and a glift mark enum.
 * @type {!Object<symbols, enums.marks>}
 */
export const symbolMarkToMark = {
  30: enums.marks.TRIANGLE,
  31: enums.marks.SQUARE,
  32: enums.marks.CIRCLE,
  33: enums.marks.XMARK,

  34: enums.marks.LABEL, // TEXTLABEL

  35: enums.marks.STONE_MARKER, // LASTMOVE
  36: enums.marks.VARIATION_MARKER, // NEXTVARIATION
  37: enums.marks.CORRECT_VARIATION, // CORRECT_VARIATION
  38: enums.marks.KO_LOCATION,
};

/**
 * Look-up map that allows us to determine a string key for a symbol number.
 * Lazily initialized via symbolStr.
 *
 * @private {Object<number, string>}
 */
let reverseSymbol_ = null;

/**
 * Convert a symbol number to a symbol string.
 * @param {number} num Symbol number
 * @return {string} Symbol name
 */
export function symbolStr(num) {
  if (reverseSymbol_ == null) {
    // Create and store a reverse mapping.
    var reverse = {};
    for (var key in symbols) {
      reverse[symbols[key]] = key;
    }
    reverseSymbol_ = reverse;
  }
  return reverseSymbol_[num];
}
