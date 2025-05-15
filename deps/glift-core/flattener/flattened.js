/**
 * Модуль для представления уплощенной доски.
 * @module flattener/flattened
 */

import { BoardPoints } from './board_points.js';
import { util } from '../util/util.js';
import { enums } from '../../../src/util/enums.js';
import { Board } from './board.js';
import { Intersection } from './intersection.js';

/**
 * Параметры для уплощенной доски.
 */
export class FlattenedParams {
  constructor() {
    /**
     * Доска должна иметь эффект затенения - глубина камней.
     * @type {boolean}
     */
    this.enableShadows = true;

    /**
     * Надо ли рисовать линии на доске. Обычно это так, но иногда
     * лучше отключить для распечатки.
     * @type {boolean}
     */
    this.drawBoardLines = true;

    /**
     * Добавлять ли координаты доски.
     * @type {boolean}
     */
    this.drawBoardCoords = false;

    /**
     * Нужно ли рисовать опорные точки (звезды).
     * @type {boolean}
     */
    this.drawStarPoints = true;

    /**
     * Должны ли метки быть на фоне.
     * @type {boolean}
     */
    this.fragmentOpacity = false;
  }
}

/**
 * Уплощенный объект go-боард. Это конечное представление доски, используемое
 * для отображения. Создается с помощью glift.bridge.transformations.
 */
export class Flattened {
  /**
   * @param {!Board} board Доска, которую нужно уплощить.
   * @param {!FlattenedParams=} opt_params Опциональные параметры.
   */
  constructor(board, opt_params) {
    /** @private {!Array<!Array<!Intersection>>} */
    this.board_ = board.raw();

    /** @private @const {number} */
    this.maxBoardSize_ = 19;

    /** @private @const {!Array<string>} */
    this.collisions_ = [];

    /**
     * ID, присвоенный на момент создания. Используется для идентификации экземпляра.
     * @private @const {string}
     */
    this.id_ = util.idGenerator.next();

    /** @private @const {!FlattenedParams} */
    this.params_ = opt_params || new FlattenedParams();

    /**
     * Отображение интов на строки для уникальной идентификации позиций.
     * @private @const {!Array<string>}
     */
    this.ints_ = 'abcdefghijklmnopqrstuvwxyz'.split('');

    /**
     * Информация о точках доски.
     * @private {?BoardPoints}
     */
    this.boardPoints_ = null;

    /**
     * Ширина скрытой доски. Не совпадает с реальной шириной доски.
     * @private {?number}
     */
    this.boardWidth_ = null;

    /**
     * Ширина скрытой доски. Не совпадает с реальной высотой доски.
     * @private {?number}
     */
    this.boardHeight_ = null;
  }

  /**
   * @return {!FlattenedParams} Параметры этого уплощенного объекта.
   */
  getParams() {
    return this.params_;
  }

  /**
   * @return {!Array<!Array<!Intersection>>} Доска как 2D массив объектов перекрестий.
   */
  board() {
    return this.board_;
  }

  /**
   * @return {!Array<string>} Список коллизий символов, произошедших при создании
   * этого уплощенного объекта.
   */
  collisions() {
    return this.collisions_;
  }

  /**
   * @return {string} ID для этого уплощенного объекта.
   */
  id() {
    return this.id_;
  }

  /**
   * @return {?BoardPoints} Объект BoardPoints связанный с этой уплощенной
   * доской, если он был установлен.
   */
  boardPoints() {
    return this.boardPoints_;
  }

  /**
   * Устанавливает объект BoardPoints.
   * @param {!BoardPoints} bpoints
   */
  setBoardPoints(bpoints) {
    this.boardPoints_ = bpoints;
  }

  /**
   * @return {number} Получает ширину доски (обычно 19).
   */
  width() {
    return this.board_.length;
  }

  /**
   * @return {number} Получает высоту доски (обычно 19).
   */
  height() {
    if (this.board_.length > 0) {
      return this.board_[0].length;
    }
    return 0;
  }

  /**
   * @param {!Intersection} intersection
   * @return {string} уникальный представительский ключ для перекрестия.
   * @private
   */
  _intKey(intersection) {
    return this.ints_[intersection.point().x()] +
      this.ints_[intersection.point().y()];
  }

  /**
   * Возвращает уникальные данные для уплощенной доски.
   * @return {!Object}
   */
  displayData() {
    var outData = {
      intersections: {},
      bounds: {
        width: this.width(),
        height: this.height(),
      },
      collisions: this.collisions_,
    };
    var extraData = {};
    for (var i = 0; i < this.board_.length; i++) {
      var row = this.board_[i];
      for (var j = 0; j < row.length; j++) {
        var intersection = row[j];
        // Используем a-z для создания уникального ключа пересечения.
        var key = this._intKey(intersection);
        if (intersection.mark() !== undefined &&
            intersection.mark() !== 0 /* EMPTY */) {
          var data = {};
          data.base = intersection.base();
          data.mark = intersection.mark();
          if (intersection.textLabel() !== undefined &&
              intersection.textLabel() !== null) {
            data.textLabel = intersection.textLabel();
          }
          if (intersection.stone() !== undefined &&
              intersection.stone() !== 0 /* EMPTY */) {
            data.stone = intersection.stone();
          }
          outData.intersections[key] = data;
        } else if (intersection.stone() !== undefined &&
            intersection.stone() !== 0 /* EMPTY */) {
          var data = {};
          data.base = intersection.base();
          data.stone = intersection.stone();
          outData.intersections[key] = data;
        }
      }
    }
    return outData;
  }

  /**
   * Получает перекрестие из определенной точки.
   * @param {!Object} pt Точка с координатами x, y.
   * @return {Intersection} Объект перекрестия.
   */
  getIntBoardPt(pt) {
    if (pt.x() < 0 || pt.y() < 0 ||
        pt.x() >= this.width() || pt.y() >= this.height()) {
      return null;
    }
    return this.board_[pt.x()][pt.y()];
  }

  /**
   * Обертка вокруг getIntBoardPt(). Возвращает true если состояние перекрестия
   * имеет камень указанного цвета (BLACK или WHITE), в противном случае false.
   *
   * @param {!Object} pt
   * @param {enums.states} color
   * @return {boolean}
   */
  hasStone(pt, color) {
    var intersection = this.getIntBoardPt(pt);
    if (!intersection) {
      return false;
    }
    var stone = intersection.stone();
    if (stone === 0 /* EMPTY */) {
      return false;
    }

    var stoneColor;
    if (stone === 1 /* BLACK */) {
      stoneColor = enums.states.BLACK;
    } else if (stone === 2 /* WHITE */) {
      stoneColor = enums.states.WHITE;
    }
    return stoneColor === color;
  }
}
