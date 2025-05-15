/**
 * Модуль для работы с опорными точками (хоси) на доске Го.
 * @module flattener/starpoints
 */

import { Point } from '../util/point.js';

/**
 * Утилиты для работы с опорными точками на доске Го.
 */
export const starpoints = {
  /**
   * @const {!Object<number, !Array<!Array<number>>>}
   * @private
   */
  pts_: {
    9: [[4, 4]],
    13: [
      [3, 3],
      [3, 9],
      [6, 6],
      [9, 3],
      [9, 9],
    ],
    19: [
      [3, 3],
      [3, 9],
      [3, 15],
      [9, 3],
      [9, 9],
      [9, 15],
      [15, 3],
      [15, 9],
      [15, 15],
    ],
  },

  /**
   * Lookup map for pts.
   * @private {!Object<number, !Object<string, boolean>>}
   */
  map_: {},

  /**
   * @param {Point} pt
   * @param {number} size
   * @return {boolean} Whether the point is a starpoint.
   */
  isPt: function(pt, size) {
    let map = starpoints.map_[size];
    if (!map) {
      const newmap = {};
      const allPts = starpoints.allPts(size);
      for (let i = 0; i < allPts.length; i++) {
        newmap[allPts[i].toString()] = true;
      }
      starpoints.map_[size] = newmap;
      map = newmap;
    }
    return !!map[pt.toString()];
  },

  /**
   * @param {number} size
   * @return {!Array<!Point>} All the points that should be considered
   * starpoints.
   */
  allPts: function(size) {
    /** @type {!Array<!Point>} */
    const out = [];
    const ptz = starpoints.pts_[size] || [];
    for (let i = 0; i < ptz.length; i++) {
      const p = ptz[i];
      out.push(new Point(p[0], p[1]));
    }
    return out;
  },
}; 