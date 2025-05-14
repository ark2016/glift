/**
 * Модуль для позиционирования виджетов в интерфейсе Glift.
 * @module displays/position/widget_positioner
 */

import { displays } from '../../displays/displays.js';
import { enums } from '../../enums.js';
import { orientation } from '../../orientation/orientation.js';
import { util } from '../../util/util.js';
import { BoardComponent } from '../../enums.js';
import { WidgetBoxes, WidgetColumn } from './widget_boxes.js';

/**
 * Найти оптимальное позиционирование виджета. Возвращает рассчитанные div-боксы.
 *
 * divBox: Область обрезки для div.
 * boardRegion: Регион доски Го, который будет отображаться.
 * intersections: Количество пересечений (обычно 9-19);
 * compsToUse: Компоненты доски, запрошенные пользователем
 * oneColSplits: Проценты разделения для одноколоночного формата
 * twoColSplits: Проценты разделения для двухколоночного формата
 *
 * @return {!WidgetPositioner} Позиционер виджета
 */
export function positioner(
  divBox,
  boardRegion,
  intersections,
  componentsToUse,
  oneColSplits,
  twoColSplits
) {
  if (!divBox) {
    throw new Error('No Div box. [' + divBox + ']');
  }
  if (!boardRegion || !enums.boardRegions[boardRegion]) {
    throw new Error('Invalid Board Region. [' + boardRegion + ']');
  }
  if (!intersections) {
    throw new Error('No intersections. [' + intersections + ']');
  }
  if (!oneColSplits) {
    throw new Error('No one col splits. [' + oneColSplits + ']');
  }
  if (!twoColSplits) {
    throw new Error('No two col splits. [' + twoColSplits + ']');
  }
  return new WidgetPositioner(
    divBox,
    boardRegion,
    intersections,
    componentsToUse,
    oneColSplits,
    twoColSplits
  );
}

/**
 * Внутренний объект позиционирования виджета
 */
export class WidgetPositioner {
  constructor(divBox, boardRegion, ints, compsToUse, oneColSplits, twoColSplits) {
    this.divBox = divBox;
    this.boardRegion = boardRegion;
    this.ints = ints;
    this.compsToUse = compsToUse;
    this.oneColSplits = oneColSplits;
    this.twoColSplits = twoColSplits;

    // Вычисляемые значения
    this.componentSet = this._getComponentSet();
    this.cropbox = displays.cropbox.getFromRegion(boardRegion, ints);
  }

  /**
   * Вычислить позиционирование виджета. Использует эвристику для определения,
   * должна ли ориентация быть горизонтальной или вертикальной.
   *
   * @return {!WidgetBoxes}
   */
  calcWidgetPositioning() {
    if (this.useHorzOrientation()) {
      return this.calcHorzPositioning();
    } else {
      return this.calcVertPositioning();
    }
  }

  /**
   * Определяет, использовать ли горизонтальную ориентацию или вертикальную
   * ориентацию.
   * Возвращает: True или False
   */
  useHorzOrientation() {
    const divBox = this.divBox;
    const boardRegion = this.boardRegion;
    const componentSet = this.componentSet;
    const comps = BoardComponent;
    const hwRatio = divBox.height() / divBox.width();
    const longBoxRegions = { TOP: true, BOTTOM: true };
    
    if (!componentSet[comps.COMMENT_BOX] || !componentSet[comps.BOARD]) {
      return false; // Принудительно вертикально, если нет блока комментариев или доски
    } else if (hwRatio < 0.45 && longBoxRegions[boardRegion]) {
      return true;
    } else if (hwRatio < 0.8 && !longBoxRegions[boardRegion]) {
      return true;
    } else {
      return false; // По умолчанию вертикальная ориентация
    }
  }

  /**
   * Вычисляет позиционирование виджета для вертикальной ориентации.
   * Возвращает Widget Boxes.
   *
   * @return {!WidgetBoxes}
   */
  calcVertPositioning() {
    const recalCol = this.recalcSplits(this.oneColSplits).first;
    const boxes = new WidgetBoxes();
    boxes.setFirst(
      this.calculateColumn(
        recalCol,
        this.divBox,
        enums.boardAlignments.TOP,
        0 /* startTop */
      )
    );
    return boxes;
  }

  /**
   * Позиционировать виджет горизонтально, т.е.,
   * |   X   X   |
   *
   * Поскольку resizedBox предназначен для заполнения либо h, либо w размерности.
   * Существуют только три сценария:
   *  1. GoBoardBox естественно касается верха и низа
   *  2. GoBoardBox естественно касается левой и правой стороны
   *  3. GoBoardBox идеально подходит.
   *
   * Примечание: мы никогда не должны позиционировать горизонтально для регионов доски TOP и BOTTOM.
   *
   * возвращает: экземпляр WidgetBoxes.
   *
   * @return {!WidgetBoxes}
   */
  calcHorzPositioning() {
    const splits = this.recalcSplits(this.twoColSplits);
    const horzSplits = this.splitDivBoxHoriz();
    const boxes = new WidgetBoxes();
    boxes.setFirst(
      this.calculateColumn(
        splits.first,
        horzSplits[0],
        enums.boardAlignments.RIGHT,
        0 /* startTop */
      )
    );
    boxes.setSecond(
      this.calculateColumn(
        splits.second,
        horzSplits[1],
        null,
        boxes.first().getBbox(boxes.first().ordering[0]).top()
      )
    );
    return boxes;
  }

  /**
   * Вычисляет столбец виджета. Достаточно общая функция, чтобы использовать ее
   * для вертикального или горизонтального позиционирования.
   *
   * Возвращает завершенный WidgetColumn.
   */
  calculateColumn(recalCol, wrapperDiv, alignment, startTop) {
    let top = startTop || 0;
    const column = new WidgetColumn();
    const components = BoardComponent;
    let divBoxSplits = [wrapperDiv];
    const ratios = this._extractRatios(recalCol);
    column.setOrderingFromRatioArray(recalCol);
    
    if (ratios.length > 1) {
      // Мы удаляем последнее соотношение, чтобы быть точными с последним компонентом
      // соотношение, потому что мы предполагаем, что:
      // splitN.ratio = 1 - split1.ratio + split2.ratio + ... splitN-1.ratio.
      //
      // Это разделяет div-бокс на строки.
      divBoxSplits = wrapperDiv.hSplit(ratios.slice(0, ratios.length - 1));
    }

    // Сопоставление от компонента к разделению.
    const splitMap = {};
    for (let i = 0; i < recalCol.length; i++) {
      splitMap[recalCol[i].component] = divBoxSplits[i];
    }

    let board = null;
    // Повторно используем вычисления окружения, если у нас есть доступная доска.
    if (splitMap.BOARD) {
      // Мы полагаемся на вычисления дисплея, которые приходят из окружения.
      board = displays.getResizedBox(
        splitMap.BOARD,
        this.cropbox,
        alignment
      );
      column.setComponent(components.BOARD, board);
    }

    const colWidth = board ? board.width() : wrapperDiv.width();
    const colLeft = board ? board.left() : wrapperDiv.left();
    column.orderFn(function (comp) {
      if (comp === components.BOARD) {
        top += board.height();
        return;
      }
      const split = splitMap[comp];
      const bbox = orientation.bbox.fromSides(
        util.point(colLeft, top),
        colWidth,
        split.height()
      );
      column.setComponent(comp, bbox);
      top += bbox.height();
    });
    return column;
  }

  /**
   * Пересчитывает проценты разделения на основе используемых компонентов.
   * Это работает путем определения оставшейся области (когда части отключены)
   * и затем распределяя ее на основе относительного размера других компонентов.
   *
   * Это предназначено для работы как с одноколоночными, так и с двухколоночными разделениями.
   *
   * Возвращает пересчитанное отображение разделений. Имеет форму:
   * {
   *  first: [
   *    { component: BOARD, ratio: 0.3 },
   *    ...
   *  ],
   *  second: [...]
   * }
   */
  recalcSplits(columnSplits) {
    const out = {};
    const compsToUseSet = this.componentSet;
    // Примечание: это разработано с внешним циклом таким образом, чтобы работать
    // с one-col-split и two-col-split стилями.
    for (const colKey in columnSplits) {
      // Берем массив объектов component-ratio.
      const col = columnSplits[colKey];
      const colOut = [];

      // Суммируем неиспользуемые части.
      let total = 0;
      for (let i = 0; i < col.length; i++) {
        const part = col[i];
        if (compsToUseSet[part.component]) {
          colOut.push({
            // выполняем копирование.
            component: part.component,
            ratio: part.ratio,
          });
          total += part.ratio;
        }
      }

      // Распределяем общую сумму так, чтобы относительные соотношения сохранялись.
      for (let j = 0; j < colOut.length; j++) {
        const outPart = colOut[j];
        outPart.ratio = outPart.ratio / total;
      }
      out[colKey] = colOut;
    }
    return out;
  }

  /**
   * Разделить окружающий divbox по горизонтали.
   *
   * Возвращает: [
   *    Column 1 BBox,
   *    Column 2 Bbox
   * ]
   */
  splitDivBoxHoriz() {
    // Предварительно создаем бокс доски, чтобы увидеть, сколько места он занимает.
    const boardBox = displays.getResizedBox(
      this.divBox,
      this.cropbox,
      enums.boardAlignments.RIGHT
    );

    // Это проценты от ширины доски. Мы требуем, чтобы правая колонка была
    // не менее 1/2 ширины доски и не более 3/4 ширины доски.
    // TODO(kashomon): Сделать это настраиваемым.
    const minColPercent = 0.5;
    const minColBoxSize = boardBox.width() * minColPercent;
    const maxColPercent = 0.75;
    const maxColBoxSize = boardBox.width() * maxColPercent;
    const widthDiff = this.divBox.width() - boardBox.width();

    // boxPercentage - это процент от ширины доски go, который
    // мы хотим, чтобы правая сторона бокса была.
    let boxPercentage = maxColPercent;
    if (widthDiff < minColBoxSize) {
      boxPercentage = minColPercent;
    } else if (widthDiff >= minColBoxSize && widthDiff < maxColBoxSize) {
      boxPercentage = widthDiff / boardBox.width();
    }
    // splitPercentage - это то, насколько мы хотим разделить боксы.
    const desiredWidth = boxPercentage * boardBox.width();
    const splitPercentage = boardBox.width() / (desiredWidth + boardBox.width());
    const splits = this.divBox.vSplit([splitPercentage]);

    // TODO(kashomon): Это предполагает, что BOARD - единственный элемент
    // в левой колонке.
    const resizedBox = displays.getResizedBox(
      splits[0],
      this.cropbox,
      enums.boardAlignments.RIGHT
    );

    // Опираемся на расчеты высоты доски Go.
    let baseRightCol = orientation.bbox.fromPts(
      util.point(splits[1].topLeft().x(), resizedBox.topLeft().y()),
      util.point(splits[1].botRight().x(), resizedBox.botRight().y())
    );

    // TODO(kashomon): Сделать максимальный размер правой колонки настраиваемым.
    if (splits[1].width() > 0.75 * resizedBox.width()) {
      baseRightCol = baseRightCol.vSplit([
        (0.75 * resizedBox.width()) / baseRightCol.width(),
      ])[0];
    }
    splits[1] = baseRightCol;
    return splits;
  }

  /// /////////////////////////
  // Приватные вспомогательные методы //
  /// /////////////////////////

  /** Преобразует массив компонентов для использования в набор (объект=>true/false). */
  _getComponentSet() {
    const out = {};
    for (let i = 0; i < this.compsToUse.length; i++) {
      out[this.compsToUse[i]] = true;
    }
    return out;
  }

  /** Извлекает соотношения из одноколоночных или двухколоночных разделений. */
  _extractRatios(column) {
    const out = [];
    for (let i = 0; i < column.length; i++) {
      out.push(column[i].ratio);
    }
    return out;
  }
}
