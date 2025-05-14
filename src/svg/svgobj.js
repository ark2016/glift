/**
 * Утилиты для работы с SVG объектами.
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
 * Создает SVG объект-обертку.
 *
 * @param {string} type - Тип SVG элемента
 * @param {!Object<string>=} opt_attrObj - Опциональный объект атрибутов
 * @return {!SvgObj} Новый SVG объект
 */
export function createObj(type, opt_attrObj) {
  return new SvgObj(type, opt_attrObj);
}

/**
 * Создает корневой объект SVG.
 * @param {!Object<string>=} opt_attrObj - Опциональный объект атрибутов
 * @return {!SvgObj} SVG объект
 */
export function svg(opt_attrObj) {
  return new SvgObj('svg', opt_attrObj)
    .setAttr('version', '1.1')
    .setAttr('xmlns', 'http://www.w3.org/2000/svg');
}

/**
 * Создает SVG объект круга.
 * @param {!Object<string>=} opt_attrObj - Опциональный объект атрибутов
 * @return {!SvgObj} SVG объект
 */
export function circle(opt_attrObj) {
  return new SvgObj('circle', opt_attrObj);
}

/**
 * Создает SVG объект пути.
 * @param {!Object<string>=} opt_attrObj - Опциональный объект атрибутов
 * @return {!SvgObj} SVG объект
 */
export function path(opt_attrObj) {
  return new SvgObj('path', opt_attrObj);
}

/**
 * Создает SVG объект прямоугольника.
 * @param {!Object<string>=} opt_attrObj - Опциональный объект атрибутов
 * @return {!SvgObj} SVG объект
 */
export function rect(opt_attrObj) {
  return new SvgObj('rect', opt_attrObj);
}

/**
 * Создает SVG объект изображения.
 * @param {!Object<string>=} opt_attrObj - Опциональный объект атрибутов
 * @return {!SvgObj} SVG объект
 */
export function image(opt_attrObj) {
  return new SvgObj('image', opt_attrObj);
}

/**
 * Создает SVG объект текста.
 * @param {!Object<string>=} opt_attrObj - Опциональный объект атрибутов
 * @return {!SvgObj} SVG объект
 */
export function text(opt_attrObj) {
  return new SvgObj('text', opt_attrObj);
}

/**
 * Создает объект группы (без атрибутов)
 * @return {!SvgObj} SVG объект группы
 */
export function group() {
  return new SvgObj('g');
}

/**
 * SVG объект-обертка.
 */
export class SvgObj {
  /**
   * @param {string} type - Тип SVG элемента
   * @param {Object<string>=} opt_attrObj - Опциональный объект атрибутов
   */
  constructor(type, opt_attrObj) {
    /** @private {string} */
    this.type_ = type;

    /**
     * Опциональный тег стиля. Должен быть только у корневого элемента SVG.
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
   * Возвращает строковую форму SVG объекта.
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

  /** 
   * @param {string} key
   * @return {string} Значение атрибута в карте 
   */
  attr(key) {
    return this.attrMap_[key];
  }

  /**
   * Устанавливает атрибут SVG.
   * @param {string} key - Ключ объекта в карте
   * @param {string|number} value - Значение для установки в карте
   * @return {!SvgObj} Этот объект
   */
  setAttr(key, value) {
    this.attrMap_[key] = value + '';
    return this;
  }

  /**
   * Устанавливает CSS-стиль верхнего уровня.
   * @param {string} s - Строка стиля
   * @return {!SvgObj} Этот объект
   */
  setStyle(s) {
    this.style_ = s;
    return this;
  }

  /**
   * Устанавливает view-box для SVG элемента.
   *
   * @param {number} tlX - Верхний левый X
   * @param {number} tlY - Верхний левый Y
   * @param {number} brX - Нижний правый X
   * @param {number} brY - Нижний правый Y
   * @return {!SvgObj} Этот объект
   */
  setViewBox(tlX, tlY, brX, brY) {
    this.viewBox_ = {
      tlX: tlX,
      tlY: tlY,
      brX: brX,
      brY: brY,
    };
    return this;
  }

  /** @return {?string} ID этого объекта или null */
  id() {
    return /** @type {?string} */ (this.attrMap_['id'] || null);
  }

  /**
   * Удобный метод для избежания null ID типа.
   * @return {string}
   */
  idOrThrow() {
    if (this.id() == null) {
      throw new Error('ID был null; ожидалось ненулевое значение');
    }
    return /** @type {string} */ (this.id());
  }

  /**
   * Устанавливает ID (используя объект атрибутов как хранилище).
   * @param {string} id - ID для установки
   * @return {!SvgObj} Этот объект
   */
  setId(id) {
    if (id) {
      this.attrMap_['id'] = id;
    }
    return this;
  }

  /** @return {!Object<string>} Объект атрибутов */
  attrObj() {
    return this.attrMap_;
  }

  /**
   * Устанавливает весь объект атрибутов.
   * @param {!Object<string>} obj - Объект с атрибутами
   * @return {!SvgObj} Этот объект
   */
  setAttrObj(obj) {
    this.attrMap_ = obj;
    return this;
  }

  /**
   * Добавляет дочерний элемент.
   * @param {!SvgObj} obj - Объект для добавления
   * @return {!SvgObj} Этот объект
   */
  append(obj) {
    if (obj.id()) {
      this.idMap_[obj.id()] = obj;
    }
    this.children_.push(obj);
    return this;
  }

  /**
   * Удаляет дочерний элемент.
   * @param {!SvgObj} obj - Объект для удаления
   * @return {!SvgObj} Этот объект
   */
  remove(obj) {
    if (obj.id() && this.idMap_[obj.id()]) {
      delete this.idMap_[obj.id()];
    }
    let spliced = false;
    for (let i = 0; i < this.children_.length; i++) {
      if (this.children_[i] === obj) {
        this.children_.splice(i, 1);
        spliced = true;
        break;
      }
    }
    return this;
  }

  /**
   * Устанавливает внутренний текст элемента SVG.
   * @param {string} text - Текст для установки
   * @return {!SvgObj} Этот объект
   */
  setText(text) {
    this.text_ = text;
    return this;
  }

  /**
   * Сохраняет произвольный объект в виде данных.
   * @param {!Object} data - Данные для хранения
   * @return {!SvgObj} Этот объект
   */
  setData(data) {
    this.data_ = data;
    return this;
  }

  /** @return {?Object} Сохраненный объект данных */
  data() {
    return this.data_;
  }

  /**
   * Находит в дереве объект с указанным ID.
   * Если объект не найден, возвращает null.
   * @param {string} id - ID для поиска
   * @return {?SvgObj} Найденный объект или null
   */
  child(id) {
    return this.idMap_[id] || null;
  }

  /** @return {!Array<!SvgObj>} Дочерние элементы */
  children() {
    return this.children_;
  }

  /**
   * Очищает все дочерние объекты, idMap и сохраненные данные.
   * @return {!SvgObj} Этот объект
   */
  clearChildren() {
    this.children_ = [];
    this.idMap_ = {};
    return this;
  }
}

// Экспорт для обратной совместимости
export const svgobj = {
  createObj,
  svg,
  circle,
  path,
  rect,
  image,
  text,
  group,
  SvgObj
}; 