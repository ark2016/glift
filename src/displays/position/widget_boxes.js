/**
 * Классы для хранения и управления блоками виджетов Glift.
 * @module displays/position/widget_boxes
 */

import { orientation } from '../../orientation/orientation.js';
import { util } from '../../util/util.js';
import { BoardComponent } from '../../enums.js';

/**
 * Контейнер для боксов виджета. Изначально все параметры не определены.
 */
class WidgetBoxes {
  constructor() {
    /** @private {WidgetColumn} */
    this._first = null;
    /** @private {WidgetColumn} */
    this._second = null;
  }

  /** @param {!WidgetColumn} col */
  setFirst(col) {
    this._first = col;
    return this;
  }

  /** @param {!WidgetColumn} col */
  setSecond(col) {
    this._second = col;
    return this;
  }

  /** @return {WidgetColumn} Первая колонка */
  first() {
    return this._first;
  }

  /** @return {WidgetColumn} Вторая колонка */
  second() {
    return this._second;
  }

  /**
   * Получить компонент по ID.
   * @param {BoardComponent} key Ключ компонента
   * @return {?orientation.BoundingBox} Ограничивающий бокс или null.
   */
  getBbox(key) {
    if (this._first && this._first.mapping[key]) {
      return this._first.mapping[key];
    }
    if (this._second && this._second.mapping[key]) {
      return this._second.mapping[key];
    }
    return null;
  }

  /**
   * Получить ограничивающий бокс компонента или вызвать исключение
   *
   * @param {BoardComponent} key Ключ компонента
   * @return {!orientation.BoundingBox}.
   */
  mustGetBbox(key) {
    const bbox = this.getBbox(key);
    if (bbox == null) {
      throw new Error('Column was null for component: ' + key);
    }
    return bbox;
  }

  /**
   * Перебрать все ограничивающие боксы.
   *
   * Этот метод передает как имя компонента, так и соответствующий бокс в функцию.
   * Другими словами, функция имеет форму:
   *
   * fn(<component-name>, bbox>);
   */
  forEach(fn) {
    if (util.typeOf(fn) !== 'function') {
      return;
    }
    const applyOrdering = function (col, inFn) {
      const ordering = col.ordering;
      for (let j = 0; j < ordering.length; j++) {
        const key = ordering[j];
        inFn(key, col.mapping[key]);
      }
    };
    this._first && applyOrdering(this._first, fn.bind(this));
    this._second && applyOrdering(this._second, fn.bind(this));
    return undefined;
  }

  /**
   * Получить ограничивающий бокс для всего виджета. Полезно для создания временных
   * div-элементов. Примечание: Возвращает новый ограничивающий бокс каждый раз, так как он
   * рассчитывается на основе существующих боксов.
   */
  fullWidgetBbox() {
    let top = null;
    let left = null;
    let bottom = null;
    let right = null;
    this.forEach(function (compName, bbox) {
      if (top === null) {
        top = bbox.top();
        left = bbox.left();
        bottom = bbox.bottom();
        right = bbox.right();
        return;
      }
      if (bbox.top() < top) {
        top = bbox.top();
      }
      if (bbox.left() < left) {
        left = bbox.left();
      }
      if (bbox.bottom() > bottom) {
        bottom = bbox.bottom();
      }
      if (bbox.right() > right) {
        right = bbox.right();
      }
    });
    if (top !== null && left !== null && bottom !== null && right !== null) {
      return orientation.bbox.fromPts(
        util.point(left, top),
        util.point(right, bottom)
      );
    } else {
      return null;
    }
  }
}

/**
 * Контейнер данных для информации о том, как позиционирован виджет.
 */
class WidgetColumn {
  constructor() {
    /** Отображение от компонента к ограничивающему боксу. */
    this.mapping = {};

    /** Порядок компонентов. */
    this.ordering = [];
  }

  /** Установить отображение от компонента к ограничивающему боксу. */
  setComponent(component, bbox) {
    if (!BoardComponent[component]) {
      throw new Error('Unknown component: ' + component);
    }
    this.mapping[component] = bbox;
    return this;
  }

  /**
   * Получить ограничивающий бокс компонента или вернуть null.
   *
   * @param {BoardComponent} component Ключ компонента
   * @return {?orientation.BoundingBox} Ограничивающий бокс или null.
   */
  getBbox(component) {
    return this.mapping[component] || null;
  }

  /**
   * Получить ограничивающий бокс компонента или вызвать исключение.
   *
   * @param {BoardComponent} component Ключ компонента
   * @return {!orientation.BoundingBox}
   */
  mustGetBbox(component) {
    const bbox = this.getBbox(component);
    if (bbox == null) {
      throw new Error('Bbox was null for component: ' + component);
    }
    return bbox;
  }

  /**
   * Установить колонку из упорядочения. Напомним, что массивы соотношений имеют
   * следующий формат:
   * [
   *  { component: BOARD, ratio: 0.3}
   *  { component: COMMENT_BOX, ratio: 0.6}
   *  ...
   * ].
   *
   * Обычно устанавливается перед установкой компонентов.
   */
  setOrderingFromRatioArray(column) {
    const ordering = [];
    for (let i = 0; i < column.length; i++) {
      const item = column[i];
      if (item && item.component) {
        ordering.push(item.component);
      }
    }
    this.ordering = ordering;
    return this;
  }

  /**
   * Функция упорядочения. Ожидает, что функция принимает имя компонента.
   */
  orderFn(fn) {
    for (let i = 0; i < this.ordering.length; i++) {
      fn(this.ordering[i]);
    }
  }
}

export { WidgetBoxes, WidgetColumn };
