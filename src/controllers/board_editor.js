/**
 * Контроллер редактора доски.
 * 
 * Предоставляет функциональность для редактирования позиций на доске Го,
 * добавления меток и других отметок.
 * 
 * @module controllers/board_editor
 */

import { BaseController, createBaseController } from './base.js';
import { Point } from '../util/index.js';
import { boardRegions, marks, rotations, states } from '../util/enums.js';
import { sgf } from '../sgf/index.js';
import { pointFromSgfCoord, typeOf } from '../util/index.js';

/**
 * Создает контроллер редактора доски.
 *
 * @param {!Object} sgfOptions Опции SGF
 * @return {!BoardEditor} Новый контроллер редактора доски
 */
export const createBoardEditorController = (sgfOptions) => {
  if (!sgfOptions) {
    throw new Error('SGF Options не определены, но должны быть определены');
  }
  
  const controller = new BoardEditor();
  controller.initOptions(sgfOptions);
  return controller;
};

/**
 * Контроллер редактора доски.
 *
 * @extends {BaseController}
 */
export class BoardEditor extends BaseController {
  /**
   * Called during initialization, after the goban/movetree have been
   * initializied.
   */
  extraOptions() {
    // _initLabelTrackers creates:
    //
    // this._alphaLabels: An array of available alphabetic labels.
    // this._numericLabels: An array of available numeric labels.
    // this._ptTolabelMap: A map from pt (string) to label.  This is so we can ensure
    // that there is only ever one label per point.
    this._initLabelTrackers();

    // Note: it's unnecessary to initialize the stones, since they are
    // initialized into the built-in initialize method.
  }

  /**
   * Initialize the label trackers.  Thus should be called after every move up
   * or down, so that the labels are synced with the current position.
   *
   * Specifically, initializes:
   * this._alphaLabels: An array of available alphabetic labels.
   * this._numericLabels: An array of available numeric labels (as numbers).
   * this._ptTolabelMap: A map from pt (string) to {label + optional data}.
   */
  _initLabelTrackers() {
    const numericLabelMap = {}; // number-string to 'true'
    const alphaLabelMap = {}; // alphabetic label to 'true'
    this._ptTolabelMap = {}; // pt string to {label + optional data}
    for (let i = 0; i < 100; i++) {
      numericLabelMap[i + 1] = true;
    }
    for (let j = 0; j < 26; j++) {
      const label = '' + String.fromCharCode('A'.charCodeAt(0) + j);
      alphaLabelMap[label] = true;
    }

    const marksToExamine = [
      marks.CIRCLE,
      marks.LABEL,
      marks.SQUARE,
      marks.TRIANGLE,
      marks.XMARK,
    ];
    const alphaRegex = /^[A-Z]$/;
    const digitRegex = /^\d*$/;

    for (let k = 0; k < marksToExamine.length; k++) {
      const curMark = marksToExamine[k];
      const sgfProp = sgf.markToProperty(curMark);
      const mtLabels = this.movetree.properties().getAllValues(sgfProp);
      if (mtLabels) {
        for (let l = 0; l < mtLabels.length; l++) {
          const splat = mtLabels[l].split(':');
          const markData = { mark: curMark };
          let lbl = null;
          if (splat.length > 1) {
            lbl = splat[1];
            markData.data = lbl;
            if (alphaRegex.test(lbl)) {
              markData.mark = marks.LABEL_ALPHA;
            } else if (digitRegex.test(lbl)) {
              lbl = parseInt(lbl, 10);
              markData.mark = marks.LABEL_NUMERIC;
            }
          }
          const pt = pointFromSgfCoord(splat[0]);
          this._ptTolabelMap[pt.toString()] = markData;
          if (numericLabelMap[lbl]) {
            delete numericLabelMap[lbl];
          }
          if (alphaLabelMap[lbl]) {
            delete alphaLabelMap[lbl];
          }
        }
      }
    }
    //
    this._alphaLabels = this._convertLabelMap(alphaLabelMap);
    this._numericLabels = this._convertLabelMap(numericLabelMap);
  }

  /**
   * Convert either the numericLabelMap or alphaLabelMap.  Recall that these are
   * maps from either number => true or alpha char => true, where the keys
   * represent unused labels.
   */
  _convertLabelMap(map) {
    const base = [];
    const digitRegex = /^\d+$/;
    for (const key in map) {
      if (digitRegex.test(key)) {
        base.push(parseInt(key, 10));
      } else {
        base.push(key);
      }
    }
    if (base.length > 0 && typeOf(base[0]) === 'number') {
      base.sort((a, b) => a - b);
      base.reverse();
    } else {
      base.sort().reverse();
    }
    return base;
  }

  /**
   * Retrieve the current alphabetic mark. Returns null if there are no more
   * labels available.
   */
  currentAlphaMark() {
    return this._alphaLabels.length > 0
      ? this._alphaLabels[this._alphaLabels.length - 1]
      : null;
  }

  /** Retrieve the current numeric mark as a string. */
  currentNumericMark() {
    return this._numericLabels.length > 0
      ? this._numericLabels[this._numericLabels.length - 1] + ''
      : null;
  }

  /**
   * Get a mark if a mark exists at a point on the board. Returns
   *
   *  For a label:
   *    { mark:<markstring>, data:<label> }
   *  For a triangle, circle, square, or xmark:
   *    { mark:<markstring> }
   *  If there's no mark at the point:
   *    null
   */
  getMark(pt) {
    return this._ptTolabelMap[pt.toString()] || null;
  }

  /**
   * Use the current alpha mark (as a string). This removes the mark frome the
   * available alphabetic labels. Returns null if no mark is available.
   */
  _useCurrentAlphaMark() {
    const label = this._alphaLabels.pop();
    if (!label) {
      return null;
    }
    return label;
  }

  /**
   * Use the current numeric mark (as a string). This removes the mark from the
   * available numeric labels. Returns null if no mark is available.
   */
  _useCurrentNumericMark() {
    const label = this._numericLabels.pop() + ''; // Ensure a string.
    if (!label) {
      return null;
    }
    return label;
  }

  /**
   * Returns whether or not the editor supports the given mark.
   * Supported marks: LABEL_ALPHA, LABEL_NUMERIC, SQUARE, TRIANGLE, and XMARK.
   */
  isSupportedMark(mark) {
    return mark === marks.LABEL_ALPHA ||
      mark === marks.LABEL_NUMERIC ||
      mark === marks.SQUARE ||
      mark === marks.TRIANGLE ||
      mark === marks.CIRCLE ||
      mark === marks.XMARK;
  }

  /**
   * Add a mark to the current position.
   */
  addMark(point, mark) {
    if (!this.isSupportedMark(mark)) {
      console.error('Mark type not supported: ', mark);
      return;
    }
    this.removeMark(point);

    let data = null;
    if (mark === marks.LABEL_ALPHA) {
      data = this._useCurrentAlphaMark();
    } else if (mark === marks.LABEL_NUMERIC) {
      data = this._useCurrentNumericMark();
    }

    if (data) {
      this._ptTolabelMap[point.toString()] = {
        mark: mark,
        data: data
      };
    } else {
      this._ptTolabelMap[point.toString()] = {
        mark: mark
      };
    }

    const sgfProp = sgf.markToProperty(mark);
    const sgfPoint = sgf.pointToString(point);
    let newVal = sgfPoint;
    if (data) {
      newVal = sgfPoint + ':' + data;
    }
    this.movetree.properties().add(sgfProp, newVal);
    this.goban.clearStone(point);
    this.flattenedState();
    return this.flattenedState();
  }

  /**
   * Remove a mark and update the state.
   */
  removeMark(point) {
    const marks = ['CR', 'LB', 'MA', 'SQ', 'TR'];
    const lblData = this._ptTolabelMap[point.toString()];
    if (lblData) {
      const label = lblData.data;
      const markType = lblData.mark;
      delete this._ptTolabelMap[point.toString()];
      if (markType === marks.LABEL_ALPHA && label) {
        this._alphaLabels.push(label);
        this._alphaLabels.sort().reverse();
      }
      if (markType === marks.LABEL_NUMERIC && label) {
        this._numericLabels.push(parseInt(label, 10));
        this._numericLabels.sort((a, b) => a - b).reverse();
      }

      const sgfProp = sgf.markToProperty(markType);
      const sgfPoint = sgf.pointToString(point);
      const newVal = this.movetree.properties().getOneValue(sgfProp);
      const regex = new RegExp(sgfPoint + '(:[A-Za-z0-9])?');
      if (newVal && newVal.match(regex)) {
        this.movetree.properties().remove(sgfProp, newVal);
      } else {
        const allValues = this.movetree.properties().getAllValues(sgfProp);
        for (let i = 0; i < allValues.length; i++) {
          if (allValues[i].match(regex)) {
            this.movetree.properties().remove(sgfProp, allValues[i]);
            break;
          }
        }
      }
    }
  }

  /**
   * Add a stone.  Essentially delegates to the add stone method but also clears
   * the ko marker and any overlapping display markers.
   */
  addStone(point, color) {
    this.addPlacement(point, color); // Clear the ko marker.
    return this.flattenedState();
  }

  /**
   * Add a stone placement, without performing a full move. This is useful for
   * problems with multiple correct answers.
   */
  addPlacement(point, color) {
    this.goban.clearStone(point); // clears the stone-in-ko marker
    this.removeMark(point); // Also removes any associated labels.
    if (this.goban.placeMustBeMoveColor(point, color)) {
      this.movetree.properties().add(sgf.colorToToken(color), sgf.pointToString(point));
      return this.flattenedState();
    } else {
      return null;
    }
  }

  /** Pass.  Does nothing for the editor. */
  pass() { return null; }

  /** Clear a stone (AE). */
  clearStone() { return null; }
}
