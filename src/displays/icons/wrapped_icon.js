/**
 * Модуль для работы с обёрнутыми иконками в Glift.
 * @module displays/icons/wrapped_icon
 */

import { util } from '../../util/util.js';
import { orientation } from '../../orientation/orientation.js';
import { displays } from '../../displays/displays.js';
import { svg as iconSvg } from './svg.js';

/**
 * Создает обёртку для иконки.
 *
 * @param {string} iconName имя соответствующей иконки.
 * @return {!WrappedIcon}
 */
export function wrapIcon(iconName) {
  return new WrappedIcon(iconName);
}

/**
 * Оборачивает массив имен иконок.
 *
 * @param {!Array<string|!Array<string>>} iconsRaw
 * @return {Array<WrappedIcon>}
 */
export function wrapIcons(iconsRaw) {
  const out = [];
  for (let i = 0; i < iconsRaw.length; i++) {
    const item = iconsRaw[i];
    if (util.typeOf(item) === 'string') {
      out.push(wrapIcon(/** @type {string} */ (item)));
    } else if (util.typeOf(item) === 'array') {
      const subIcons = item;
      // Только иконка multiopen принимается для этой категории...
      const outerIcon = wrapIcon('multiopen');
      for (let j = 0; j < subIcons.length; j++) {
        outerIcon.addAssociatedIcon(subIcons[j]);
      }
      out.push(outerIcon);
    }
  }
  return out;
}

/**
 * Проверяет, что имя иконки допустимо.
 * @param {string} iconName
 * @return {string}
 */
export function validateIcon(iconName) {
  if (
    iconName === undefined ||
    iconSvg[iconName] === undefined
  ) {
    throw new Error('Icon unknown: [' + iconName + ']');
  }
  return iconName;
}

/**
 * Обёртка для иконки для удобства. Всё, что нужно - это:
 * - Имя иконки
 */
export class WrappedIcon {
  /**
   * @param {string} iconName Имя иконки.
   */
  constructor(iconName) {
    this.iconName = validateIcon(iconName);
    const iconData = iconSvg[iconName];
    this.iconStr = iconData.string;
    this.originalBbox = orientation.bbox.fromPts(
      util.point(iconData.bbox.x, iconData.bbox.y),
      util.point(iconData.bbox.x2, iconData.bbox.y2)
    );
    this.associatedIcons = []; // Добавляется с помощью addAssociatedIcon
    this.activeAssociated = 0; // Индекс в массиве выше
    this.bbox = this.originalBbox; // может изменяться при "translate"
    this.transformObj = undefined; // Задается, если иконка трансформирована
    this.elementId = undefined; // задается с помощью setElementId. ID в DOM.
    this.subboxIcon = undefined; // Устанавливается из setSubboxIcon(...);
    if (iconData.subboxName !== undefined) {
      this.setSubboxIcon(iconData.subboxName);
    }
  }

  /**
   * Добавляет связанную иконку и возвращает новую иконку.
   * @param {string} iconName
   * @return {WrappedIcon}
   */
  addAssociatedIcon(iconName) {
    const newIcon = wrapIcon(iconName);
    this.associatedIcons.push(newIcon);
    return newIcon;
  }

  /**
   * Добавляет связанную обёрнутую иконку и возвращает иконку (для паритета с вышеуказанным).
   * @param {WrappedIcon} wrapped
   * @return {WrappedIcon}
   * @private
   */
  _addAssociatedWrapped(wrapped) {
    if (wrapped.originalBbox === undefined) {
      throw new Error('Wrapped icon not actually a wrapped icon: ' + wrapped);
    }
    this.associatedIcons.push(wrapped);
    return wrapped;
  }

  /**
   * Очищает связанные иконки, возвращая старый список.
   * @return {Array<WrappedIcon>}
   */
  clearAssociatedIcons() {
    const oldIcons = this.associatedIcons;
    this.associatedIcons = [];
    return oldIcons;
  }

  /**
   * Возвращает обёрнутую иконку из списка связанных иконок.
   * Если индекс не указан, предполагается, что индекс - активный индекс.
   * @param {number=} index
   * @return {WrappedIcon}
   */
  getAssociated(index) {
    index = index || this.activeAssociated;
    return this.associatedIcons[index];
  }

  /**
   * Получает активную связанную иконку.
   * @return {WrappedIcon}
   */
  getActive() {
    return this.associatedIcons[this.activeAssociated];
  }

  /**
   * Устанавливает 'активную' иконку. Примечание: это не обновляет иконки на экране.
   * Эта задача оставлена панели или селектору.
   * @param {string} iconName
   * @return {WrappedIcon} this
   */
  setActive(iconName) {
    for (let i = 0, len = this.associatedIcons.length; i < len; i++) {
      const icon = this.associatedIcons[i];
      if (icon.iconName === iconName) {
        this.activeAssociated = i;
      }
    }
    return this;
  }

  /**
   * Устанавливает id элемента div.
   * @param {string} id
   * @return {WrappedIcon} this
   */
  setElementId(id) {
    this.elementId = id;
    return this;
  }

  /**
   * Устанавливает вложенный блок, чтобы мы могли центрировать иконки внутри вложенного блока.
   * Предупреждение: вложенный блок должен быть указан как иконка.
   * @param {string} iconName
   * @return {WrappedIcon}
   */
  setSubboxIcon(iconName) {
    this.subboxIcon = wrapIcon(iconName);
    return this.subboxIcon;
  }

  /**
   * Центрирует иконку (указанную как обёрнутую иконку) в пределах вложенного блока.
   * Возвращает обёрнутую иконку с правильным масштабированием.
   * @param {WrappedIcon} wrapped
   * @param {number} vMargin
   * @param {number} hMargin
   * @return {WrappedIcon}
   */
  centerWithinSubbox(wrapped, vMargin, hMargin) {
    if (this.subboxIcon === undefined) {
      throw new Error('No subbox defined, so cannot centerWithin.');
    }
    const centerObj = displays.centerWithin(
      this.subboxIcon.bbox,
      wrapped.bbox,
      vMargin,
      hMargin
    );
    wrapped.performTransform(centerObj.transform);
    return wrapped;
  }

  /**
   * Центрирует иконку (указанную как обёрнутую иконку) в пределах текущей иконки.
   * Возвращает обёрнутую иконку с правильным масштабированием.
   * @param {WrappedIcon} wrapped
   * @param {number} vMargin
   * @param {number} hMargin
   * @return {WrappedIcon}
   */
  centerWithinIcon(wrapped, vMargin, hMargin) {
    const centerObj = displays.centerWithin(
      this.bbox,
      wrapped.bbox,
      vMargin,
      hMargin
    );
    wrapped.performTransform(centerObj.transform);
    return wrapped;
  }

  /**
   * Параметр transform выглядит следующим образом:
   *  {
   *    scale: num,
   *    xMove: num,
   *    yMove: num
   *  }
   *
   * Это преобразует ограничивающий прямоугольник иконки.
   *
   * Обратите внимание, что сначала выполняется масштабирование, затем - перемещение.
   * @param {Object} transformObj
   * @return {WrappedIcon} this
   */
  performTransform(transformObj) {
    if (transformObj.scale) {
      this.bbox = this.bbox.scale(transformObj.scale);
    }
    if (transformObj.xMove && transformObj.yMove) {
      this.bbox = this.bbox.translate(transformObj.xMove, transformObj.yMove);
    }
    if (this.subboxIcon !== undefined) {
      this.subboxIcon.performTransform(transformObj);
    }
    // TODO(kashomon): Следует ли трансформировать связанные иконки?
    this.transformObj = transformObj;
    return this;
  }

  /**
   * Сбрасывает ограничивающий прямоугольник до исходного положения.
   * @return {WrappedIcon} this
   */
  resetTransform() {
    this.bbox = this.originalBbox;
    this.transformObj = undefined;
    return this;
  }

  /**
   * Получает строку масштабирования, которая будет использоваться
   * в качестве параметра преобразования SVG.
   *
   * @return {string} строка преобразования SVG.
   */
  transformString() {
    if (this.transformObj !== undefined) {
      return (
        'translate(' +
        this.transformObj.xMove +
        ',' +
        this.transformObj.yMove +
        ') ' +
        'scale(' +
        this.transformObj.scale +
        ')'
      );
    } else {
      return '';
    }
  }

  /**
   * Создает копию обёрнутой иконки.
   * @return {WrappedIcon}
   */
  rewrapIcon() {
    const newIcon = wrapIcon(this.iconName);
    if (this.subboxIcon !== undefined) {
      newIcon.setSubboxIcon(this.subboxIcon.iconName);
    }
    return newIcon;
  }
}
