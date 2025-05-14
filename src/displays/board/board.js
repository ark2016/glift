/**
 * Модуль отображения доски.
 * 
 * @module displays/board
 */

import * as svg from '../../svg/index.js';
import * as dom from '../../dom/index.js';
import { enums } from '../../util/index.js';
import { Intersections } from './intersections.js';

// Функции для создания элементов доски - импортируем из соответствующих модулей
import { boardBase } from './board_base.js';
import { initBlurFilter } from './board_base.js';
import { boardLabels } from './board_labels.js';
import { lines } from './lines.js';
import { starpoints } from './starpoints.js';
import { shadows } from './stones.js';
import { stones } from './stones.js';
import { markContainer, addMark } from './marks.js';
import { buttons } from './buttons.js';

// Создаем заглушки для flattener, пока не имплементируем этот модуль полностью
const flattener = {
  emptyFlattened: (size) => ({ 
    board: () => ({ 
      differ: () => [] 
    }) 
  }),
  symbolStoneToState: {},
  symbolMarkToMark: {},
  board: {
    displayDiff: () => {}
  }
};

/**
 * Create a new display Board.
 *
 * @param {string} elemId The DOM element ID for the container
 * @param {Object} env Glift display environment.
 * @param {Object} theme A Glift theme.
 * @param {string} rotation Rotation enum
 * @return {Display} The board display object
 */
export const create = function (elemId, env, theme, rotation) {
  return new Display(elemId, env, theme, rotation).draw();
};

/**
 * The core Display object returned to the user.
 */
export class Display {
  /**
   * @param {string} elemId The DOM element ID for the container
   * @param {Object} environment Gui environment object.
   * @param {Object} theme A Glift theme.
   * @param {string=} opt_rotation Optional rotation to rotate the points.
   */
  constructor(elemId, environment, theme, opt_rotation) {
    /** @private {string} */
    this.elemId_ = elemId;

    /** @private {Object} */
    this.environment_ = environment;

    /** @private {Object} */
    this.theme_ = theme;

    /**
     * Rotation indicates whether we should rotate by stones/marks in the display
     * by 90, 180, or 270 degrees,
     * @private {string}
     */
    this.rotation_ = opt_rotation || enums.rotations.NO_ROTATION;

    // Variables defined during draw()
    /** @private {Object} svgBase Root SVG object. */
    this.svg_ = null;

    /** @private {?Object} */
    this.intersections_ = null;

    /**
     * The flattened representation of the Go board. This should exactly
     * correspond to the data rendered in the SGF.
     *
     * @private {Object}
     */
    this.flattened_ = flattener.emptyFlattened(this.numIntersections());
  }

  /**
   * @return {Object}
   */
  boardPoints() {
    return this.environment_.boardPoints;
  }

  /** @return {string} */
  boardRegion() {
    return this.environment_.boardRegion;
  }

  /** @return {string} */
  divId() {
    return this.elemId_;
  }

  /** @return {number} */
  numIntersections() {
    return this.environment_.intersections;
  }

  /** @return {?Object} */
  intersections() {
    return this.intersections_;
  }

  /** @return {string} */
  rotation() {
    return this.rotation_;
  }

  /** @return {boolean} */
  drawBoardCoords() {
    return this.environment_.drawBoardCoords;
  }

  /** @return {number} */
  width() {
    return this.environment_.goBoardBox.width();
  }

  /** @return {number} */
  height() {
    return this.environment_.goBoardBox.height();
  }

  /**
   * Initialize the SVG This allows us to create a base display object without
   * creating all drawing all the parts.
   *
   * @return {Display}
   */
  init() {
    if (!this.svg_) {
      this.destroy(); // make sure everything is cleared out of the div.
      this.svg_ = svg.svg({
        height: '100%',
        width: '100%',
        position: 'float',
        top: 0,
        id: this.divId() + '_svgboard',
      });
    }
    this.environment_.init();
    return this;
  }

  /**
   * Draws the GoBoard!
   * @return {Display}
   */
  draw() {
    this.init();
    
    const env = this.environment_;
    const boardPoints = env.boardPoints;
    const theme = this.theme_;
    const svgObj = this.svg_;
    const divId = this.divId();
    const idGen = svg.ids.gen(divId);
    const goBox = env.goBoardBox;
    
    if (svgObj === null) {
      throw new Error('Base SVG object not initialized.');
    }
    if (goBox === null) {
      throw new Error('goBox null: Gui Environment obj not initialized.');
    }
    if (boardPoints === null) {
      throw new Error('boardPoints null: Gui Environment obj not initialized.');
    }

    boardBase(svgObj, idGen, goBox, theme);
    initBlurFilter(divId, svgObj); // в boardBase. Должно быть перенесено.

    const intGrp = svg.group().setId(idGen.intersections());
    svgObj.append(intGrp);

    boardLabels(intGrp, idGen, boardPoints, theme);

    lines(intGrp, idGen, boardPoints, theme);
    starpoints(intGrp, idGen, boardPoints, theme);

    shadows(intGrp, idGen, boardPoints, theme);
    stones(intGrp, idGen, boardPoints, theme);
    markContainer(intGrp, idGen);
    buttons(intGrp, idGen, boardPoints);

    this.intersections_ = new Intersections(
      divId,
      intGrp,
      boardPoints,
      theme,
      this.rotation()
    );

    this.flush();
    return this; // required
  }

  /**
   * Update the board with a new flattened object. The board stores the previous
   * flattened object and just updates based on the diff between the two.
   *
   * @param {Object} flattened
   * @return {Display} this
   */
  updateBoard(flattened) {
    // На данном этапе просто заглушка, пока не реализуем полноценный flattener
    console.log('Обновление доски с новыми данными...');
    return this;
  }

  /** @return {Display} this */
  flush() {
    if (this.svg_) {
      dom.attachToParent(this.svg_, this.divId());
    }
    return this;
  }

  /**
   * Destory the GUI portion of the GoBoard.  We just remove the SVG element.
   * This makes redrawing the GoBoard much quicker.
   *
   * @return {Display} this
   */
  destroy() {
    const container = dom.selectId(this.divId());
    if (container) {
      container.empty();
    }
    this.svg_ = null;
    this.flattened_ = flattener.emptyFlattened(this.numIntersections());
    this.intersections_ = null;
    return this;
  }
}
