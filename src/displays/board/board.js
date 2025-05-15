/**
 * Модуль отображения доски.
 * 
 * @module displays/board
 */

import * as svg from '../../svg/index.js';
import * as dom from '../../dom/index.js';
import { enums } from '../../util/index.js';
import { Intersections } from './intersections.js';
import { Board } from '../../flattener/board.js';
import { Flattened } from '../../flattener/flattened.js';

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
import { Point } from '../../util/point.js';
import { symbols } from '../../flattener/symbols.js';
import { states } from '../../util/enums.js';

// Создаем заглушки для flattener, пока не имплементируем этот модуль полностью
const flattener = {
  emptyFlattened: (size) => ({ 
    board: () => [] 
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
    const boardData = new Board(this.numIntersections());
    this.flattened_ = new Flattened(boardData);
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
    console.log('Initializing board with ID:', this.divId());
    const containerElem = dom.selectId(this.divId());
    
    if (containerElem) {
      // Проверим размеры контейнера
      const rect = containerElem.boundingClientRect();
      console.log('Container size:', rect.width, 'x', rect.height);
      
      // Убедимся, что контейнер имеет высоту
      if (rect.height === 0) {
        console.log('Container has zero height, setting explicit height');
        containerElem.style('height', '400px'); // Установим явную высоту
      }
      if (rect.width === 0) {
        console.log('Container has zero width, setting explicit width');
        containerElem.style('width', '400px'); // Установим явную ширину
      }
      
      // Установим стили для контейнера
      containerElem.style('position', 'relative');
      containerElem.style('display', 'block');
      containerElem.style('overflow', 'hidden');
      containerElem.style('background-color', '#F7D26E');
    } else {
      console.error('Container not found for ID:', this.divId());
    }
    
    if (!this.svg_) {
      this.destroy(); // make sure everything is cleared out of the div.
      this.svg_ = svg.svg({
        height: '100%',
        width: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        id: this.divId() + '_svgboard',
      });
      
      console.log('Created SVG element with ID:', this.divId() + '_svgboard');
    } else {
      console.log('SVG already initialized');
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

    console.log('Drawing board with dimensions:', goBox.width(), 'x', goBox.height());
    console.log('Board points:', boardPoints.data().length);
    console.log('Theme:', theme);

    // Добавим видимый фон для всей доски, чтобы проверить, рендерится ли SVG
    svgObj.append(
      svg.rect()
        .setAttr('x', 0)
        .setAttr('y', 0)
        .setAttr('width', '100%')
        .setAttr('height', '100%')
        .setAttr('fill', '#F7D26E') // Светло-коричневый фон для доски го
        .setAttr('stroke', 'black')
        .setAttr('stroke-width', 2)
    );

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

    // Добавляем тестовый камень прямо здесь для проверки
    const testPoint = new Point(9, 9);
    this.addStone(9, 9, 'BLACK');

    this.flush();
    console.log('Board drawing complete. SVG:', this.svg_);
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
      console.log('Flushing SVG to DOM element with ID:', this.divId());
      const container = dom.selectId(this.divId());
      if (container) {
        console.log('Container found:', container);
        // Явно установим размеры и видимость контейнера
        container.style('width', '100%');
        container.style('height', '100%');
        container.style('display', 'block');
        container.style('background-color', '#F7D26E');
        container.empty(); // Очищаем контейнер перед добавлением
        
        console.log('SVG object to flush:', this.svg_);
        
        // Добавляем SVG вручную в контейнер
        if (this.svg_.element) {
          console.log('Appending SVG element directly to container');
          container.append(this.svg_.element);
        } else {
          console.log('Using attachToParent for SVG object');
          dom.attachToParent(this.svg_, this.divId());
        }
      } else {
        console.error('Container not found for ID:', this.divId());
      }
    } else {
      console.error('SVG not initialized in flush()');
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

  /**
   * Добавляет камень на доску.
   * @param {number} x Координата X
   * @param {number} y Координата Y
   * @param {string} color Цвет камня ('black' или 'white' в нижнем регистре)
   */
  addStone(x, y, color) {
    console.log(`Добавление камня цвета ${color} в точке (${x},${y})`);
    
    // Нормализуем цвет для внутреннего использования
    const normalizedColor = color.toUpperCase();
    const stoneState = normalizedColor === 'BLACK' ? states.BLACK : 
                      normalizedColor === 'WHITE' ? states.WHITE : states.EMPTY;
    
    const point = new Point(x, y);
    const stoneSymbol = stoneState === states.BLACK ? symbols.BSTONE :
                       stoneState === states.WHITE ? symbols.WSTONE : symbols.EMPTY;

    console.log(`Нормализованный цвет: ${normalizedColor}, symbol: ${stoneSymbol}`);

    // Обновляем flattened состояние
    const intersection = this.flattened_.getIntBoardPt(point);
    if (intersection) {
      console.log(`Intersection найден для точки (${x},${y})`);
      intersection.setStone(stoneSymbol);
    } else {
      console.warn(`Intersection not found for point: (${x},${y})`);
      return;
    }

    // Обновляем SVG отображение
    if (this.intersections_) {
      console.log(`Вызываем setStoneColor для точки (${x},${y}) с цветом ${normalizedColor}`);
      // Передаем нормализованный цвет
      this.intersections_.setStoneColor(point, normalizedColor);
    } else {
      console.warn('Intersections object not initialized in Display.addStone');
    }

    // Обновляем SVG
    this.flush();
  }
}
