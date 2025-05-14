import { Element } from './elements.js';

/**
 * Утилиты для создания идентификаторов SVG-элементов.
 * @module displays/svg/ids
 */

/**
 * Набор утилит для работы с идентификаторами SVG-элементов.
 */
export const ids = {
  /**
   * Создаёт генератор идентификаторов.
   * @param {string} divId Идентификатор контейнера
   * @return {!IdGenerator}
   */
  gen: function(divId) {
    return new IdGenerator(divId);
  },

  /**
   * Получает идентификатор для SVG-элемента (возвращает строковый id).
   *
   * @param {string} divId Идентификатор контейнера
   * @param {string} type Тип элемента
   * @param {(!{x: function(): number, y: function(): number}|!Object|string)=} opt_extraData
   * Дополнительные данные (может отсутствовать). Обычно точка, но может быть и именем иконки.
   * @return {string} Соответствующий идентификатор
   */
  element: function(divId, type, opt_extraData) {
    const base = divId + '_' + type;
    if (opt_extraData !== undefined) {
      if (opt_extraData.x !== undefined) {
        return base + '_' + opt_extraData.x() + '_' + opt_extraData.y();
      } else {
        return base + '_' + opt_extraData.toString();
      }
    } else {
      return base;
    }
  },
};

/**
 * Генератор идентификаторов для SVG-элементов.
 */
export class IdGenerator {
  /**
   * @param {string} divId Идентификатор контейнера
   * @param {string=} opt_prefix Опциональный префикс для идентификаторов
   */
  constructor(divId, opt_prefix = '') {
    /** @const {string} */
    this.divId = opt_prefix ? `${opt_prefix}_${divId}` : divId;

    const eidFn = ids.element;

    /** @private {string} */
    this.svg_ = eidFn(this.divId, Element.SVG);
    /** @private {string} */
    this.board_ = eidFn(this.divId, Element.BOARD);
    /** @private {string} */
    this.boardCoordLabelGroup_ = eidFn(this.divId, Element.BOARD_COORD_LABELS);
    /** @private {string} */
    this.stoneGroup_ = eidFn(this.divId, Element.STONE_CONTAINER);
    /** @private {string} */
    this.stoneShadowGroup_ = eidFn(this.divId, Element.STONE_SHADOW_CONTAINER);
    /** @private {string} */
    this.starpointGroup_ = eidFn(this.divId, Element.STARPOINT_CONTAINER);
    /** @private {string} */
    this.buttonGroup_ = eidFn(this.divId, Element.BUTTON_CONTAINER);
    /** @private {string} */
    this.boardButton_ = eidFn(this.divId, Element.FULL_BOARD_BUTTON);
    /** @private {string} */
    this.lineGroup_ = eidFn(this.divId, Element.BOARD_LINE_CONTAINER);
    /** @private {string} */
    this.markGroup_ = eidFn(this.divId, Element.MARK_CONTAINER);
    /** @private {string} */
    this.iconGroup_ = eidFn(this.divId, Element.ICON_CONTAINER);
    /** @private {string} */
    this.intersectionsGroup_ = eidFn(this.divId, Element.INTERSECTIONS_CONTAINER);
    /** @private {string} */
    this.tempMarkGroup_ = eidFn(this.divId, Element.TEMP_MARK_GROUP);
  }

  /** @return {string} Идентификатор для контейнера SVG. */
  svg() {
    return this.svg_;
  }

  /** @return {string} Идентификатор для доски. */
  board() {
    return this.board_;
  }

  /** @return {string} Идентификатор группы для меток координат на доске */
  boardCoordLabelGroup() {
    return this.boardCoordLabelGroup_;
  }

  /** @return {string} Идентификатор для группы пересечений. */
  intersections() {
    return this.intersectionsGroup_;
  }

  /** @return {string} Идентификатор группы для камней. */
  stoneGroup() {
    return this.stoneGroup_;
  }

  /**
   * @param {!{x: function(): number, y: function(): number}} pt Точка 
   * @return {string} Идентификатор для камня.
   */
  stone(pt) {
    return ids.element(
      this.divId,
      Element.STONE,
      pt
    );
  }

  /** @return {string} Идентификатор группы для теней камней. */
  stoneShadowGroup() {
    return this.stoneShadowGroup_;
  }

  /**
   * @param {!{x: function(): number, y: function(): number}} pt Точка
   * @return {string} Идентификатор для тени камня.
   */
  stoneShadow(pt) {
    return ids.element(
      this.divId,
      Element.STONE_SHADOW,
      pt
    );
  }

  /** @return {string} Идентификатор группы для отметок звездных точек. */
  starpointGroup() {
    return this.starpointGroup_;
  }

  /**
   * @param {!{x: function(): number, y: function(): number}} pt Точка
   * @return {string} Идентификатор для звездной точки
   */
  starpoint(pt) {
    return ids.element(
      this.divId,
      Element.STARPOINT,
      pt
    );
  }

  /** @return {string} Идентификатор группы для кнопок. */
  buttonGroup() {
    return this.buttonGroup_;
  }

  /**
   * @param {!string} name Имя кнопки.
   * @return {string} Идентификатор для кнопки.
   */
  button(name) {
    return ids.element(
      this.divId,
      Element.BUTTON,
      name
    );
  }

  /** @return {string} Идентификатор для кнопки полной доски. */
  fullBoardButton() {
    return this.boardButton_;
  }

  /** @return {string} Идентификатор группы для линий. */
  lineGroup() {
    return this.lineGroup_;
  }

  /**
   * @param {!{x: function(): number, y: function(): number}} pt Точка
   * @return {string} Идентификатор для линии доски.
   */
  line(pt) {
    return ids.element(
      this.divId,
      Element.BOARD_LINE,
      pt
    );
  }

  /** @return {string} Идентификатор группы для отметок. */
  markGroup() {
    return this.markGroup_;
  }

  /**
   * @param {!{x: function(): number, y: function(): number}} pt Точка
   * @return {string} Идентификатор для отметки.
   */
  mark(pt) {
    return ids.element(
      this.divId,
      Element.MARK,
      pt
    );
  }

  /** @return {string} Идентификатор группы для временных отметок. */
  tempMarkGroup() {
    return this.tempMarkGroup_;
  }

  /** @return {string} Идентификатор для направляющей линии. */
  guideLine() {
    return ids.element(
      this.divId,
      Element.GUIDE_LINE
    );
  }

  /** @return {string} Идентификатор группы для иконок. */
  iconGroup() {
    return this.iconGroup_;
  }

  /**
   * @param {string} name Имя иконки.
   * @return {string} Идентификатор для иконки.
   */
  icon(name) {
    return ids.element(
      this.divId,
      Element.ICON,
      name
    );
  }

  /** @return {string} Идентификатор для временной группы иконок. */
  tempIconGroup() {
    return ids.element(
      this.divId,
      Element.TEMP_ICON_CONTAINER
    );
  }

  /**
   * @param {string} name Имя иконки.
   * @return {string} Идентификатор для временной иконки.
   */
  tempIcon(name) {
    return ids.element(
      this.divId,
      Element.TEMP_ICON,
      name
    );
  }

  /**
   * @param {string} textId Идентификатор текста.
   * @return {string} Идентификатор для временного текста.
   */
  tempIconText(textId) {
    return ids.element(
      this.divId,
      Element.TEMP_TEXT,
      textId
    );
  }
}
