/**
 * Модуль для работы со свойствами SGF.
 * @module rules/properties
 */

import { util } from '../../src/util/util.js';
import { Point } from '../util/point.js';
import { enums } from '../../src/util/enums.js';
import { prop } from './all_properties.js';

/**
 * @param {!Object<string, !Array<string>>=} opt_map
 * @return {!Properties}
 */
export function properties(opt_map) {
  return new Properties(opt_map);
}

/**
 * Коллекция ходов.
 *
 * @typedef {{
 *  WHITE: !Array<!Object>,
 *  BLACK: !Array<!Object>
 * }}
 */
export let MoveCollection;

/**
 * Значение метки. Инкапсулирует тип свойств метки.
 * @typedef {{
 *  point: !Object,
 *  value: string
 * }}
 */
export let MarkValue;

/**
 * Коллекция меток.
 *
 * @typedef {!Object<string, !Array<!MarkValue>>}
 */
export let MarkCollection;

/**
 * Объект, описывающий свойство.
 *
 * Пример:
 * {
 *  prop: GN
 *  displayName: 'Game Name',
 *  value: 'Lee Sedol vs Gu Li'
 * }
 *
 * @typedef {{
 *  prop: string,
 *  displayName: string,
 *  value: string
 * }}
 */
export let PropDescriptor;

/**
 * Properties that accept point values. This is here mostly for full-board
 * modifications (e.g., rotations). It may also be useful for identifying
 * boards.
 *
 * Notes: There are several ways to represent points in SGFs.
 *  [ab] - Simple point at 0,1 (origin=upper left. oriented down-right)
 *  [aa:cc] - Point Rectangle (all points from 0,0 to 2,2 in a rect)
 *
 * Additionally Labels (LB) have the format
 *  [ab:label]
 *
 * @type {!Object<string, boolean>}
 */
export let propertiesWithPts = {
  // Marks
  CR: true,
  LB: true,
  MA: true,
  SQ: true,
  TR: true,
  // Stones
  B: true,
  W: true,
  AW: true,
  AB: true,
  // Clear Stones
  AE: true,
  // Misc. These properties are very rare, and usually can be ignored.
  // Still, they're here for completeness.
  AR: true, // arrow
  DD: true, // gray area
  LN: true, // line
  TB: true, // black area/territory
  TW: true, // white area
};

/**
 * @param {!Object<string, !Array<string>>=} opt_map
 *
 * @package
 * @constructor @final @struct
 */
export class Properties {
  constructor(opt_map) {
    /** @package {!Object<string, !Array<string>>} */
    this.propMap = opt_map || {};
  }
  
  /**
   * Добавляет SGF-свойство к текущему ходу.
   *
   * Обратите внимание, что это не перезаписывает существующее свойство - для этого
   * пользователь должен удалить существующее свойство. Если свойство уже существует,
   * мы добавляем еще один элемент данных в массив.
   *
   * Мы также предполагаем, что все прямоугольники точек были преобразованы парсером
   * в списки точек. http://www.red-bean.com/sgf/sgf4.html#3.5.1
   *
   * @param {string} prop SGF-свойство в форме FF4 (например: AB).
   * @param {string|!Array<string>} value Строка или массив строк.
   * @return {!Properties} this
   */
  add(prop, value) {
    // Возвращаем, если свойство не является строкой или реальным свойством
    if (!prop[prop]) {
      util.logz(
        'Warning! The property [' +
          prop +
          ']' +
          ' is not valid and is not recognized in the SGF spec.' +
          ' Thus, this property will be ignored'
      );
      return this;
    }

    var finished = [];
    if (typeof value === 'string') {
      var zet = /** @type {string} */ (value);
      finished = [value];
    } else {
      finished = /** @type {!Array<string>} */ (value);
    }

    // Если тип является строкой, преобразуем в массив или объединяем.
    if (this.contains(prop)) {
      this.propMap[prop] = this.getAllValues(prop).concat(finished);
    } else {
      this.propMap[prop] = finished;
    }
    return this;
  }

  /**
   * Возвращает массив данных, связанных с ключом свойства. Обратите внимание: это возвращает
   * неглубокую копию свойств.
   *
   * Если свойство не существует, возвращает null.
   */
  getAllValues(strProp) {
    if (prop[strProp] === undefined) {
      return null; // Не действительное свойство
    } else if (this.propMap[strProp]) {
      return this.propMap[strProp].slice(); // Возвращаем неглубокую копию.
    } else {
      return null;
    }
  }

  /**
   * Получает один элемент данных, связанный со свойством. По умолчанию возвращает первый
   * элемент в данных, связанных со свойством.
   *
   * Поскольку getOneValue() всегда возвращает массив, иногда полезно
   * вернуть первое свойство в списке. Как и getOneValue(), если свойство
   * или значение не может быть найдено, возвращается null.
   *
   * @param {string} prop Свойство
   * @param {number=} opt_index Опциональный индекс. По умолчанию 0.
   * @return {?string} Строковое свойство или null.
   */
  getOneValue(prop, opt_index) {
    var index = opt_index || 0;
    var arr = this.getAllValues(prop);
    if (arr && arr.length >= 1) {
      return arr[index];
    } else {
      return null;
    }
  }

  /**
   * Получает значение из свойства и возвращает представление точки.
   * При необходимости пользователь может указать индекс, поскольку каждое свойство указывает на
   * массив значений.
   *
   * @param {string} prop SGF-свойство.
   * @param {number=} opt_index Опциональный индекс. По умолчанию 0.
   * @return {?Object} Возвращает точку Glift или null, если свойство
   *    не существует.
   */
  getAsPoint(prop, opt_index) {
    var out = this.getOneValue(prop, opt_index);
    if (out) {
      // Prop exists
      // Assume the point is in SGF format
      return Point.fromSgfCoord(out);
    } else {
      return null;
    }
  }

  /**
   * Rotates an SGF Property. Note: This only applies to stone-properties.
   *
   * Recall that in the SGF, we should have already converted any point
   * rectangles, so there shouldn't be any issues here with converting point
   * rectangles.
   *
   * @param {string} prop
   * @param {number} size Size of the Go Board.
   * @param {string} rotation Rotation to perform
   */
  rotate(prop, size, rotation) {
    if (!propertiesWithPts[prop]) {
      return;
    }
    if (
      !enums.rotations[rotation] ||
      rotation === enums.rotations.NO_ROTATION
    ) {
      return;
    }
    // Replace all the values for this property.
    this.pointsReplace_(prop, size, function (sgfPoint) {
      return Point.fromSgfCoord(sgfPoint)
        .rotate(size, rotation)
        .toSgfCoord();
    });
  }

  /**
   * Flips the SGF point-values over thy Y axis (Flipping the X-points);
   * @param {string} prop
   * @param {number} size
   */
  flipHorz(prop, size) {
    if (!propertiesWithPts[prop]) {
      return;
    }
    this.pointsReplace_(prop, size, function (sgfPoint) {
      return Point.fromSgfCoord(sgfPoint).flipHorz(size).toSgfCoord();
    });
  }

  /**
   * Flips the SGF point-values over thy X axis (Flipping the Y-points);
   * @param {string} prop
   * @param {number} size
   */
  flipVert(prop, size) {
    if (!propertiesWithPts[prop]) {
      return;
    }
    this.pointsReplace_(prop, size, function (sgfPoint) {
      return Point.fromSgfCoord(sgfPoint).flipVert(size).toSgfCoord();
    });
  }

  /**
   * Helper for replacing SGF points.
   * @param {string} prop
   * @param {number} size
   * @param {function(string): string} replFn
   * @private
   */
  pointsReplace_(prop, size, replFn) {
    if (!propertiesWithPts[prop]) {
      return;
    }
    if (!replFn) {
      throw new Error('Replace function must be supplied');
    }
    var regex = /([a-z][a-z])/g;
    if (prop === prop.LB) {
      // We handle labels specially since labels have a unqiue format
      regex = /([a-z][a-z])(?=:)/g;
    }
    var vals = this.getAllValues(prop);
    for (var i = 0; i < vals.length; i++) {
      vals[i] = vals[i].replace(regex, replFn);
    }
    this.propMap[prop] = vals;
  }

  /**
   * Returns true if the current move has the property "prop".  Return
   * false otherwise.
   *
   * @param {string} prop
   * @return {boolean}
   */
  contains(prop) {
    return prop in this.propMap;
  }

  /**
   * Loop over each property / value list.
   * @param {!function(string, !Array<string>)} func
   */
  forEach(func) {
    for (var p in this.propMap) {
      func(p, this.propMap[p]);
    }
  }

  /**
   * Tests wether a prop contains a value
   *
   * @param {string} prop
   * @param {string} value
   * @return {boolean}
   */
  hasValue(prop, value) {
    if (!this.contains(prop)) {
      return false;
    }
    var vals = this.getAllValues(prop);
    for (var i = 0; i < vals.length; i++) {
      if (vals[i] === value) {
        return true;
      }
    }
    return false;
  }

  /**
   * Deletes the prop and return the value.
   * @param {string} prop
   * @return {?Array<string>} The former values of this property.
   */
  remove(prop) {
    if (this.contains(prop)) {
      var allValues = this.getAllValues(prop);
      delete this.propMap[prop];
      return allValues;
    } else {
      return null;
    }
  }

  /**
   * Remove one value from the property list. Returns the value if it was
   * successfully removed.  Removes only the first value -- any subsequent value
   * remains in the property list.
   * @param {string} prop
   * @param {string} value
   */
  removeOneValue(prop, value) {
    if (this.contains(prop)) {
      var allValues = this.getAllValues(prop);
      var index = -1;
      for (var i = 0, len = allValues.length; i < len; i++) {
        if (allValues[i] === value) {
          index = i;
          break;
        }
      }
      if (index !== -1) {
        allValues.splice(index, 1);
        this.set(prop, allValues);
      }
    } else {
      return null;
    }
  }

  /**
   * Sets current value, even if the property already exists.
   * @param {string} prop
   * @param {string|!Array<string>} value
   * @return {Properties} this
   */
  set(prop, value) {
    if (prop && value && prop[prop]) {
      if (typeof value === 'string') {
        this.propMap[prop] = [/** @type {string} */ (value)];
      } else if (typeof value === 'array') {
        this.propMap[prop] = /** @type {!Array<string>} */ (value);
      }
    }
    return this;
  }

  //---------------------//
  // Convenience methods //
  //---------------------//

  /**
   * Get all the placements for a color.  Return as an array.
   * @param {string} color
   * @return {!Array<!Object>} points. If no placements are found, returns
   *    an empty array.
   */
  getPlacementsAsPoints(color) {
    var prop;
    if (color === enums.states.BLACK) {
      prop = prop.AB;
    } else if (color === enums.states.WHITE) {
      prop = prop.AW;
    } else {
      return [];
    }

    if (!this.contains(prop)) {
      return [];
    }
    return Point.allSgfCoordsToPoints(this.getAllValues(prop));
  }

  /**
   * Get all the clear-locations as points. Clear locations are indicated by AE.
   * The SGF spec is unclear about how to handle clear-locations when there are
   * other stone properties (B,W,AB,AW). Generally, it probably makes the most
   * sense to apply the clear-locations first.
   *
   * @return {!Array<!Object>} the points. If the AE property isn't found,
   *    returns an empty array.
   */
  getClearLocationsAsPoints() {
    var AE = prop.AE;
    if (!this.contains(AE)) {
      return [];
    }
    return Point.allSgfCoordsToPoints(this.getAllValues(AE));
  }

  /**
   * Get the current comment on the move. It's provided as a convenience method
   * since it's an extremely comment operation.
   *
   * @return {?string}
   */
  getComment() {
    if (this.contains(prop.C)) {
      return this.getOneValue(prop.C);
    } else {
      return null;
    }
  }

  /**
   * Get the current Move.  Returns null if no move exists.
   *
   * If the move is a pass, then in the SGF, we'll see B[] or W[].  Thus,
   * we will return { color: BLACK } or { color: WHITE }, but we won't have any
   * point associated with this.
   *
   * @return {?Object}.
   */
  getMove() {
    var BLACK = enums.states.BLACK;
    var WHITE = enums.states.WHITE;
    if (this.contains(prop.B)) {
      if (this.getOneValue(prop.B) === '') {
        return { color: BLACK }; // This is a PASS
      } else {
        return {
          color: BLACK,
          point: this.getAsPoint(prop.B) || undefined,
        };
      }
    } else if (this.contains(prop.W)) {
      if (this.getOneValue(prop.W) === '') {
        return { color: WHITE }; // This is a PASS
      } else {
        return {
          color: WHITE,
          point: this.getAsPoint(prop.W) || undefined,
        };
      }
    } else {
      return null;
    }
  }

  /**
   * Test whether this set of properties match a series of conditions.  Returns
   * true or false.  Conditions have the form:
   *
   * { <property>: [series,of,conditions,to,match], ... }
   *
   * Example:
   *    Matches if there is a GB property or the words 'Correct' or 'is correct' in
   *    the commentj
   *    { GB: [], C: ['Correct', 'is correct'] }
   *
   * Note: This is an O(lnm) ~ O(n^3).  But practice, you'll want to test
   * against singular properties, so it's more like O(n^2)
   *
   * @param {!Object} conditions Set of
   *    property-conditions to check.
   * @return {boolean}
   */
  matches(conditions) {
    for (var key in conditions) {
      if (this.contains(key)) {
        var substrings = conditions[key];
        if (substrings.length === 0) {
          return true;
        }
        var allValues = this.getAllValues(key);
        for (var i = 0, len = allValues.length; i < len; i++) {
          for (var j = 0, slen = substrings.length; j < slen; j++) {
            var value = allValues[i];
            var substr = substrings[j];
            if (value.indexOf(substr) !== -1) {
              return true;
            }
          }
        }
      }
    }
    return false;
  }

  /**
   * Get all the stones (placements and moves).  This ignores 'PASS' moves.
   *
   * @return {!Object}
   */
  getAllStones() {
    var states = enums.states,
      out = {},
      BLACK = states.BLACK,
      WHITE = states.WHITE;
    out.WHITE = [];
    out.BLACK = [];

    var bplace = this.getPlacementsAsPoints(states.BLACK);
    var wplace = this.getPlacementsAsPoints(states.WHITE);
    for (var i = 0; i < bplace.length; i++) {
      out.BLACK.push({ point: bplace[i], color: BLACK });
    }
    for (var i = 0; i < wplace.length; i++) {
      out.WHITE.push({ point: wplace[i], color: WHITE });
    }
    var move = this.getMove();
    if (move && move.point) {
      out[move.color].push(move);
    }
    return out;
  }

  /**
   * Gets all the marks, where the output is a map from glift mark enum to array
   * of points. In the case of labels, a value key is supplied as well to
   * indicate the label. Note that the board must contain at least one mark for
   * a key to exist in the output map
   *
   * The return has the format:
   *  {
   *    LABEL: [{value: lb, point: pt}, ...],
   *    : [{point: pt}, ...]
   *  }
   * return {!Object}
   */
  getAllMarks() {
    /**
     * @type {!Object<string, string>}
     */
    var propertiesToMarks = {
      CR: enums.marks.CIRCLE,
      LB: enums.marks.LABEL,
      MA: enums.marks.XMARK,
      SQ: enums.marks.SQUARE,
      TR: enums.marks.TRIANGLE,
    };
    var outMarks = {};
    for (var prop in propertiesToMarks) {
      var mark = propertiesToMarks[prop];
      if (this.contains(prop)) {
        var data = this.getAllValues(prop);
        var marksToAdd = [];
        for (var i = 0; i < data.length; i++) {
          if (prop === prop.LB) {
            // Labels have the form { point: pt, value: 'A' }
            marksToAdd.push(Point.convertFromLabelData(data[i]));
          } else {
            // A single point or a point rectangle (which is why the return-type
            // is an array.
            var newPts = Point.pointArrFromSgfProp(data[i]);
            for (var j = 0; j < newPts.length; j++) {
              marksToAdd.push({
                point: newPts[j],
              });
            }
          }
        }
        outMarks[mark] = marksToAdd;
      }
    }
    return outMarks;
  }

  /**
   * Get the game info key-value pairs. Ex:
   * [{
   *  prop: GN
   *  displayName: 'Game Name',
   *  value: 'Lee Sedol vs Gu Li'
   * },...
   * ]
   * @return {!Array<!Object>}
   */
  // TODO(kashomon): Add test
  getGameInfo() {
    var gameInfoArr = [];
    /**
     * @type {!Object<string, string>}
     */
    var propNameMap = {
      PW: 'White Player',
      PB: 'Black Player',
      RE: 'Result',
      AN: 'Commenter',
      SO: 'Source',
      RU: 'Ruleset',
      KM: 'Komi',
      GN: 'Game Name',
      EV: 'Event',
      RO: 'Round',
      PC: 'Place Name',
      DT: 'Date',
    };
    for (var key in propNameMap) {
      if (this.contains(key)) {
        var displayName = propNameMap[key];
        var obj = {
          prop: key,
          displayName: displayName,
          value: this.getOneValue(key),
        };
        // Post processing for some values.
        // We attach the ranks like Kashomon [9d], if they exist.
        if (key === prop.PW && this.contains(prop.WR)) {
          obj.value += ' [' + this.getOneValue(prop.WR) + ']';
        } else if (
          key === prop.PB &&
          this.contains(prop.BR)
        ) {
          obj.value += ' [' + this.getOneValue(prop.BR) + ']';
        }
        // Remove trailing zeroes on komi amounts.
        else if (key === prop.KM) {
          obj.value = parseFloat(this.getOneValue(key)) + '' || '0';
        }
        gameInfoArr.push(obj);
      }
    }
    return gameInfoArr;
  }
}
