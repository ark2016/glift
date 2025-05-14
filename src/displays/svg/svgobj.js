/**
 * Методы DOM для работы с SVG.
 * @module displays/svg/dom
 */

/** 
 * Набор методов DOM для манипуляции с SVG элементами.
 */
export const dom = {
  /**
   * Присоединяет SVG-контент к элементу по его ID.
   * @param {!Object} svgObj Объект SVG 
   * @param {string} divId ID элемента-контейнера
   */
  attachToParent: function(svgObj, divId) {
    const svgContainer = document.getElementById(divId);
    if (svgContainer) {
      dom.attachToElem_(svgObj, svgContainer);
    }
  },

  /**
   * Присоединяет SVG-контент к уже определенному элементу.
   * @param {!Object} svgObj Объект SVG
   * @param {!Element|!Object} elem HTML-элемент или объект-обертка
   * @private
   */
  attachToElem_: function(svgObj, elem) {
    const possibleElem = /** @type {!Element} */ (elem);
    if (possibleElem && possibleElem.nodeType) {
      possibleElem.appendChild(dom.asElement(svgObj));
    } else {
      const domEl = /** @type {!Object} */ (elem);
      domEl.el.appendChild(dom.asElement(svgObj));
    }
  },

  /**
   * Добавляет SVG-элемент и присоединяет его к DOM.
   * @param {!Object} svgObj Родительский объект SVG
   * @param {!Object} obj Объект SVG для добавления
   */
  appendAndAttach: function(svgObj, obj) {
    svgObj.append(obj);
    if (svgObj.id()) {
      dom.attachToParent(obj, svgObj.idOrThrow());
    }
  },

  /**
   * Удаляет элемент из DOM.
   * @param {!Object} obj Объект SVG для удаления
   */
  removeFromDom: function(obj) {
    if (obj.id()) {
      const elem = document.getElementById(obj.idOrThrow());
      if (elem) {
        elem.parentNode.removeChild(elem);
      }
    }
  },

  /**
   * Преобразует узел объекта (и все дочерние узлы) в элементы SVG.
   * @param {!Object} o Объект SVG
   * @return {!Element} HTML-элемент SVG
   */
  asElement: function(o) {
    const elem = document.createElementNS('http://www.w3.org/2000/svg', o.type());
    for (const attr in o.attrObj()) {
      if (attr === 'xlink:href') {
        elem.setAttributeNS(
          'http://www.w3.org/1999/xlink',
          'href',
          o.attr(attr)
        );
      } else {
        elem.setAttribute(attr, o.attr(attr));
      }
    }
    if (o.type() === 'text') {
      const textNode = document.createTextNode(o.text());
      elem.appendChild(textNode);
    }
    for (let i = 0; i < o.children().length; i++) {
      elem.appendChild(dom.asElement(o.children()[i]));
    }
    return elem;
  },

  /**
   * Обновляет определенный атрибут в DOM атрибутом, существующим в этом элементе.
   * @param {!Object} obj Объект SVG
   * @param {string} attrName Имя атрибута
   */
  updateAttrInDom: function(obj, attrName) {
    const id = obj.id();
    if (id) {
      const elem = document.getElementById(id);
      if (elem && attrName && obj.attr(attrName)) {
        const value = /** @type {boolean|number|string} */ (obj.attr(attrName));
        elem.setAttribute(attrName, value);
      }
    } else {
      throw new Error('No ID present: could not update the dom:' + id);
    }
  },

  /**
   * Очищает все дочерние элементы и обновляет DOM.
   * @param {!Object} obj Объект SVG
   */
  emptyChildrenAndUpdate: function(obj) {
    obj.emptyChildren();
    const elem = document.getElementById(obj.idOrThrow());
    while (elem && elem.firstChild) {
      elem.removeChild(elem.firstChild);
    }
  },
};
