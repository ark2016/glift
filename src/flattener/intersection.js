/**
 * Модуль для работы с перекрестиями (пересечениями линий) на доске Го.
 * @module flattener/intersection
 */

import { Point } from '../util/point.js';
import { states } from '../util/enums.js';
import { symbols, symbolStr } from './symbols.js';
import { starpoints } from './starpoints.js';

/**
 * Утилиты для работы с перекрестиями.
 */
export const intersection = {
  /**
   * Creates an intersection obj.
   *
   * @param {!Point} pt 0-indexed and bounded by the number
   *    of intersections.  Thus, typically between 0 and 18. Note, the zero for
   *    this point is the top-left rather than the more traditional
   *    bottom-right, as it is for kifus.
   * @param {states} stoneColor EMPTY here is used to indicate that
   *    we don't want to set the stone.
   * @param {!symbols} mark Mark for the stone
   * @param {string} textLabel text label for the stone. Should really only be
   *    set when the mark is TEXTLABEL.
   * @param {number} maxInts The maximum number of intersections on the board.
   *    Typically 9, 13 or 19.
   *
   * @return {!Intersection}
   */
  create: function(pt, stoneColor, mark, textLabel, maxInts) {
    const intsect = new Intersection(pt);

    if (pt.x() < 0 || pt.y() < 0 || pt.x() >= maxInts || pt.y() >= maxInts) {
      throw new Error(
        'Pt (' + pt.x() + ',' + pt.y() + ')' + ' is out of bounds.'
      );
    }

    const intz = maxInts - 1;
    let baseSymb = symbols.EMPTY;
    if (pt.x() === 0 && pt.y() === 0) {
      baseSymb = symbols.TL_CORNER;
    } else if (pt.x() === 0 && pt.y() === intz) {
      baseSymb = symbols.BL_CORNER;
    } else if (pt.x() === intz && pt.y() === 0) {
      baseSymb = symbols.TR_CORNER;
    } else if (pt.x() === intz && pt.y() === intz) {
      baseSymb = symbols.BR_CORNER;
    } else if (pt.y() === 0) {
      baseSymb = symbols.TOP_EDGE;
    } else if (pt.x() === 0) {
      baseSymb = symbols.LEFT_EDGE;
    } else if (pt.x() === intz) {
      baseSymb = symbols.RIGHT_EDGE;
    } else if (pt.y() === intz) {
      baseSymb = symbols.BOT_EDGE;
    } else if (starpoints.isPt(pt, maxInts)) {
      baseSymb = symbols.CENTER_STARPOINT;
    } else {
      baseSymb = symbols.CENTER;
    }
    intsect.setBase(baseSymb);

    if (stoneColor === states.BLACK) {
      intsect.setStone(symbols.BSTONE);
    } else if (stoneColor === states.WHITE) {
      intsect.setStone(symbols.WSTONE);
    }

    if (mark !== undefined) {
      intsect.setMark(mark);
    }

    if (textLabel !== undefined) {
      intsect.setTextLabel(textLabel);
    }

    return intsect;
  },

  /**
   * Static maps to evaluate symbol validity.
   */
  layerMapping: {
    base: {
      EMPTY: true,
      TL_CORNER: true,
      TR_CORNER: true,
      BL_CORNER: true,
      BR_CORNER: true,
      TOP_EDGE: true,
      BOT_EDGE: true,
      LEFT_EDGE: true,
      RIGHT_EDGE: true,
      CENTER: true,
      CENTER_STARPOINT: true,
    },
    stone: {
      EMPTY: true,
      BSTONE: true,
      WSTONE: true,
    },
    mark: {
      EMPTY: true,
      TRIANGLE: true,
      SQUARE: true,
      CIRCLE: true,
      XMARK: true,
      TEXTLABEL: true,
      LASTMOVE: true,
      NEXTVARIATION: true,
      CORRECT_VARIATION: true,
      KO_LOCATION: true,
    },
  }
};

/**
 * Represents a flattened intersection. Separated into 3 layers:
 *  - Base layer (intersection abels)
 *  - Stone layer (black, white, or empty)
 *  - Mark layer (shapes, text labels, etc.)
 *
 * Shouldn't be constructed directly outside of this file.
 *
 * @param {!Point} pt
 *
 * @constructor @final @struct
 */
export class Intersection {
  constructor(pt) {
    const EMPTY = symbols.EMPTY;

    /** @private {!Point} */
    this.pt_ = pt;
    /** @private {symbols} */
    this.baseLayer_ = EMPTY;
    /** @private {symbols} */
    this.stoneLayer_ = EMPTY;
    /** @private {symbols} */
    this.markLayer_ = EMPTY;

    /**
     * Optional text label. Should only be set when the mark layer symbol is some
     * sort of text-symbol (e.g., TEXTLABEL, NEXTVARIATION)
     * @private {?string}
     */
    this.textLabel_ = null;
  }

  /**
   * @param {symbols} s Symbol to validate
   * @param {string} layer
   * @private
   */
  validateSymbol_(s, layer) {
    const str = symbolStr(s);
    if (!str) {
      throw new Error('Symbol Val: ' + s + ' is not a defined symbol.');
    }
    if (!intersection.layerMapping[layer][str]) {
      throw new Error(
        'Incorrect layer for: ' + str + ',' + s + '. Layer was ' + layer
      );
    }
    return s;
  }

  /**
   * Test whether this intersection is equal to another intersection.
   * @param {!Object} thatint
   * @return {boolean}
   */
  equals(thatint) {
    if (thatint == null) {
      return false;
    }
    const that = /** @type {!Intersection} */ (thatint);
    return (
      this.pt_.equals(that.pt_) &&
      this.baseLayer_ === that.baseLayer_ &&
      this.stoneLayer_ === that.stoneLayer_ &&
      this.markLayer_ === that.markLayer_ &&
      this.textLabel_ === that.textLabel_
    );
  }

  /** @return {symbols} Returns the base layer. */
  base() {
    return this.baseLayer_;
  }

  /** @return {symbols} Returns the stone layer. */
  stone() {
    return this.stoneLayer_;
  }

  /** @return {symbols} Returns the mark layer. */
  mark() {
    return this.markLayer_;
  }

  /** @return {?string} Returns the text label. */
  textLabel() {
    return this.textLabel_;
  }

  /** @return {!Point} Returns the point. */
  point() {
    return this.pt_;
  }

  /** @param {symbols} s Set the base layer. */
  setBase(s) {
    this.baseLayer_ = this.validateSymbol_(s, 'base');
    return this;
  }

  /** @param {symbols} s Set the stone layer. */
  setStone(s) {
    this.stoneLayer_ = this.validateSymbol_(s, 'stone');
    return this;
  }

  /** @param {symbols} s Set the mark layer. */
  setMark(s) {
    this.markLayer_ = this.validateSymbol_(s, 'mark');
    return this;
  }

  /** @param {?string} t Set the text label. */
  setTextLabel(t) {
    this.textLabel_ = t;
    return this;
  }
} 