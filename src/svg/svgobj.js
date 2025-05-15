/**
 * Модуль для работы с SVG объектами.
 * @module svg/svgobj
 */

/**
 * @typedef {{
 *  tlX: number,
 *  tlY: number,
 *  brX: number,
 *  brY: number
 * }}
 */
export let ViewBox;

/**
 * Оболочка для SVG объекта.
 */
export class SvgObj {
  /**
   * @param {string} type Тип элемента SVG.
   * @param {!Object<string>=} opt_attrObj Опциональный объект атрибутов.
   */
  constructor(type, opt_attrObj) {
    /** @private {string} */
    this.type_ = type;

    /**
     * Опциональный тег стиля. Должен быть только на элементе SVG верхнего уровня.
     * Подробнее см.:
     * https://developer.mozilla.org/en-US/docs/Web/SVG/Element/style
     * @private {string}
     */
    this.style_ = '';

    /** @private {!Object<string>} */
    this.attrMap_ = opt_attrObj || {};
    /** @private {!Array<!SvgObj>} */
    this.children_ = [];
    /** @private {!Object<!SvgObj>} */
    this.idMap_ = {};
    /** @private {string} */
    this.text_ = '';
    /** @private {!ViewBox|undefined} */
    this.viewBox_ = undefined;
    /** @private {?Object} */
    this.data_ = null;
  }

  /**
   * Возвращает строковую форму объекта svg.
   * @return {string}
   */
  render() {
    let base = '<' + this.type_;
    for (const key in this.attrMap_) {
      base += ' ' + key + '="' + this.attrMap_[key] + '"';
    }
    if (this.viewBox_) {
      const vb = this.viewBox_;
      base +=
        ' viewBox="' +
        vb.tlX +
        ' ' +
        vb.tlY +
        ' ' +
        vb.brX +
        ' ' +
        vb.brY +
        '"';
      if (!this.attrMap_['preserveAspectRatio']) {
        base += ' preserveAspectRatio="xMidYMid"';
      }
    }
    base += '>' + this.text_;
    if (this.style_) {
      base +=
        '\n' +
        '<style type="text/css">\n' +
        '/* <![CDATA[ */\n' +
        this.style_ +
        '\n' +
        '/* ]]> */\n' +
        '</style>\n';
    }
    if (this.children_.length > 0) {
      base += '\n';
      for (let i = 0; i < this.children_.length; i++) {
        base += this.children_[i].render() + '\n';
      }
      base += '</' + this.type_ + '>';
    } else {
      base += '</' + this.type_ + '>';
    }
    return base;
  }

  /** @return {string} Значение в карте атрибутов. */
  attr(key) {
    return this.attrMap_[key];
  }

  /**
   * Устанавливает атрибут SVG.
   * @param {string} key Ключ объекта в карте.
   * @param {string|number} value Значение для установки в карту.
   * @return {!SvgObj} Этот объект.
   */
  setAttr(key, value) {
    this.attrMap_[key] = value + '';
    return this;
  }

  /**
   * Устанавливает CSS-стиль верхнего уровня.
   * @param {string} s
   * @return {!SvgObj} Этот объект.
   */
  setStyle(s) {
    this.style_ = s;
    return this;
  }

  /**
   * Устанавливает view-box для элемента SVG.
   * https://css-tricks.com/scale-svg/
   *
   * @param {number} tlX tl.y
   * @param {number} tlY br.x
   * @param {number} brX br.y
   * @param {number} brY
   * @return {!SvgObj} сам объект
   */
  setViewBox(tlX, tlY, brX, brY) {
    this.viewBox_ = { tlX: tlX, tlY: tlY, brX: brX, brY: brY };
    return this;
  }

  /**
   * Добавить id в отображение id.
   * @param {string} id
   * @return {!SvgObj} сам объект
   */
  setId(id) {
    this.attrMap_['id'] = id;
    return this;
  }

  /**
   * Получает объект из карты id.
   * @param {string} id
   * @return {SvgObj} объект из карты id.
   */
  child(id) {
    return this.idMap_[id];
  }

  /**
   * Устанавливает текст для объекта SVG.
   * @param {string} text
   * @return {!SvgObj} Этот объект.
   */
  setText(text) {
    this.text_ = text;
    return this;
  }

  /**
   * Добавить дочерний объект.
   * @param {!SvgObj} obj
   * @return {!SvgObj} Только что добавленный дочерний элемент.
   */
  appendObject(obj) {
    this.children_.push(obj);
    const id = obj.attr('id');
    if (id) {
      this.idMap_[id] = obj;
    }
    return obj;
  }

  /**
   * Приложить к родителю.
   * @param {!SvgObj} obj
   * @return {!SvgObj} Этот объект.
   */
  appendToParent(obj) {
    obj.appendObject(this);
    return this;
  }

  /**
   * Вспомогательная функция, которая создает объект svgbase, а затем
   * добавляет его как дочерний элемент
   *
   * @param {string} type
   * @param {!Object<string>=} opt_attrObj
   * @return {!SvgObj} Новый дочерний объект.
   */
  child(type, opt_attrObj) {
    const obj = createObj(type, opt_attrObj);
    return this.appendObject(obj);
  }

  /**
   * Вспомогательная функция для добавления атрибутов в карту атрибутов.
   * @param {!Object<string>} attrObj Атрибуты для добавления.
   * @return {!SvgObj} this
   */
  addAttrObj(attrObj) {
    for (const key in attrObj) {
      this.attrMap_[key] = attrObj[key];
    }
    return this;
  }

  /**
   * Прикрепляет произвольные данные к svg элементу.
   * @param {!Object} data Произвольные данные.
   * @return {!SvgObj} this
   */
  setData(data) {
    this.data_ = data;
    return this;
  }

  /**
   * Получает прикрепленные произвольные данные.
   * @return {?Object} Прикрепленные данные или null.
   */
  data() {
    return this.data_;
  }
}

/**
 * Создает оболочку SVG.
 *
 * @param {string} type Тип элемента svg.
 * @param {!Object<string>=} opt_attrObj опциональный объект атрибутов.
 * @return {!SvgObj}
 */
export function createObj(type, opt_attrObj) {
  return new SvgObj(type, opt_attrObj);
}

/**
 * Создает корневой объект SVG.
 * @param {!Object<string>=} opt_attrObj опциональный объект атрибутов.
 * @return {!SvgObj}
 */
export function svg(opt_attrObj) {
  return new SvgObj('svg', opt_attrObj)
    .setAttr('version', '1.1')
    .setAttr('xmlns', 'http://www.w3.org/2000/svg');
}

/**
 * Создает объект circle svg.
 * @param {!Object<string>=} opt_attrObj опциональный объект атрибутов.
 * @return {!SvgObj}
 */
export function circle(opt_attrObj) {
  return new SvgObj('circle', opt_attrObj);
}

/**
 * Создает объект path svg.
 * @param {!Object<string>=} opt_attrObj опциональный объект атрибутов.
 * @return {!SvgObj}
 */
export function path(opt_attrObj) {
  return new SvgObj('path', opt_attrObj);
}

/**
 * Создает объект rectangle svg.
 * @param {!Object<string>=} opt_attrObj опциональный объект атрибутов.
 * @return {!SvgObj}
 */
export function rect(opt_attrObj) {
  return new SvgObj('rect', opt_attrObj);
}

/**
 * Создает объект image svg.
 * @param {!Object<string>=} opt_attrObj опциональный объект атрибутов.
 * @return {!SvgObj}
 */
export function image(opt_attrObj) {
  return new SvgObj('image', opt_attrObj);
}

/**
 * Создает объект text svg.
 * @param {!Object<string>=} opt_attrObj опциональный объект атрибутов.
 * @return {!SvgObj}
 */
export function text(opt_attrObj) {
  return new SvgObj('text', opt_attrObj);
}

/**
 * Создает объект group (без атрибутов)
 * @return {!SvgObj}
 */
export function group() {
  return new SvgObj('g');
} 