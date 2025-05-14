/**
 * Модуль панели иконок для библиотеки Glift.
 * @module displays/icons/bar
 */

import { displays } from '../../displays/displays.js';
import { orientation } from '../../orientation/orientation.js';
import { svg as svgLib } from '../../svg/svg.js';
import { util } from '../../util/util.js';
import { wrapIcons } from './wrapped_icon.js';
import { rowCenterWrapped } from './icon_centering.js';

/**
 * Параметры для создания панели иконок
 * 
 * @typedef {Object} IconBarOptions
 * @property {string} divId - ID div-элемента для этого объекта
 * @property {Array<string>} icons - массив имен иконок
 * @property {Object} theme - Тема оформления
 * @property {Object} positioning - ограничивающая рамка для панели
 * @property {Object} parentBbox - ограничивающая рамка для родительского виджета
 * @property {Object} allDivIds - все ID div-элементов
 * @property {Object} allPositioning - позиционирование всех элементов
 */

/**
 * Создаёт панель иконок
 * @param {IconBarOptions} options Параметры для создания панели иконок
 * @return {IconBar} Панель иконок
 */
export function createIconBar(options) {
  return new IconBar(options);
}

/**
 * Класс панели иконок
 */
export class IconBar {
  /**
   * @param {IconBarOptions} options Параметры для создания панели иконок
   */
  constructor(options) {
    if (!options.theme) {
      throw new Error('Theme undefined in iconbar');
    }
    if (!options.divId) {
      throw new Error("Must define an options 'divId' as an option");
    }
    this.divId = options.divId;
    this.position = options.positioning;
    this.divBbox = orientation.bbox.fromPts(
      util.point(0, 0),
      util.point(this.position.width(), this.position.height())
    );
    this.theme = options.theme;
    // parentBbox полезен для создания multiIconSelector.
    this.parentBbox = options.parentBbox;
    // Массив обёрнутых иконок. См. wrapped_icon.js.
    this.icons = wrapIcons(options.icons);

    // Позиционная информация для всех div.
    this.allDivIds = options.allDivIds;
    this.allPositioning = options.allPositioning;

    // Отображение имени иконки на объект иконки. Инициализируется через _initNameMapping
    this.nameMapping = {};

    this.vertMargin = this.theme.icons.vertMargin;
    this.horzMargin = this.theme.icons.horzMargin;
    this.svg = undefined; // инициализируется методом draw
    this.idGen = displays.svg.ids.gen(this.divId);

    // Данные, связанные с всплывающими подсказками.
    this.tooltipTimer = undefined;
    this.tooltipId = undefined;

    // Пост-конструктор инициализации
    this.initIconIds_(); // Устанавливает идентификаторы для иконок выше.
    this.initNameMapping_(); // Инициализирует сопоставление имен.

    /** @type {?Object} */
    this.bbox = null;
  }

  /**
   * Инициализирует сопоставление имен с иконками
   * @private
   */
  initNameMapping_() {
    this.forEachIcon(
      function (icon) {
        this.nameMapping[icon.iconName] = icon;
      }.bind(this)
    );
  }

  /**
   * Создает идентификаторы html-элементов для каждой из иконок.
   * @private
   */
  initIconIds_() {
    this.forEachIcon(
      function (icon) {
        icon.setElementId(this.idGen.icon(icon.iconName));
      }.bind(this)
    );
  }

  /** 
   * Рисует панель иконок. 
   * @return {IconBar} this
   */
  draw() {
    this.destroy();
    const divBbox = this.divBbox;
    this.bbox = divBbox;
    this.svg = svgLib.svg()
      .setAttr('width', '100%')
      .setAttr('height', '100%');
    rowCenterWrapped(
      divBbox,
      this.icons,
      this.vertMargin,
      this.horzMargin
    );
    this._createIcons();
    this._createIconButtons();
    this.flush();
    return this;
  }

  /**
   * Фактически рисует иконку.
   * @private
   */
  _createIcons() {
    const container = svgLib.group().setId(this.idGen.iconGroup());
    this.svg.append(container);
    this.svg.append(svgLib.group().setId(this.idGen.tempIconGroup()));
    for (let i = 0, ii = this.icons.length; i < ii; i++) {
      const icon = this.icons[i];
      const path = svgLib.path()
        .setId(icon.elementId)
        .setAttr('d', icon.iconStr)
        .setAttr('transform', icon.transformString());
      for (const key in this.theme.icons.DEFAULT) {
        path.setAttr(key, this.theme.icons.DEFAULT[key]);
      }
      container.append(path);
    }
  }

  /**
   * Мы рисуем прозрачные прямоугольники вокруг иконки, чтобы использовать их
   * для сенсорных событий. Для сложных иконок оказывается слишком сложно
   * пытаться выбрать саму иконку.
   * @private
   */
  _createIconButtons() {
    const container = svgLib.group().setId(this.idGen.buttonGroup());
    this.svg.append(container);
    for (let i = 0, len = this.icons.length; i < len; i++) {
      const icon = this.icons[i];
      container.append(
        svgLib.rect()
          .setData(icon.iconName)
          .setAttr('x', icon.bbox.topLeft().x())
          .setAttr('y', icon.bbox.topLeft().y())
          .setAttr('width', icon.bbox.width())
          .setAttr('height', icon.bbox.height())
          .setAttr('fill', 'blue') // Цвет не имеет значения, но нужно заполнение.
          .setAttr('opacity', 0)
          .setId(this.idGen.button(icon.iconName))
      );
    }
  }

  /**
   * Выводит SVG на экран
   */
  flush() {
    if (this.svg) {
      displays.svg.dom.attachToParent(this.svg, this.divId);
    }
    const multi = this.getIcon('multiopen');
    if (multi) {
      this.setCenteredTempIcon('multiopen', multi.getActive(), 'black');
    }
  }

  /**
   * Добавляет временную связанную иконку и центрирует ее. Если у parentIcon
   * задан subbox, то используется он. В противном случае просто центрирует
   * в пределах bbox родительской иконки.
   *
   * Если tempIcon указан как строка, он сначала оборачивается.
   *
   * @param {string} parentIconNameOrIndex Имя родительской иконки.
   * @param {string|Object} tempIcon Временная иконка для отображения.
   * @param {string} color Строка цвета
   * @param {number=} opt_vMargin Опциональное вертикальное поле. По умолчанию 2px.
   * @param {number=} opt_hMargin Опциональное горизонтальное поле. По умолчанию 2px.
   */
  setCenteredTempIcon(parentIconNameOrIndex, tempIcon, color, opt_vMargin, opt_hMargin) {
    let vmargin = opt_vMargin || 2;
    let hmargin = opt_hMargin || 2;
    let parentIcon = this.getIcon(parentIconNameOrIndex);
    if (parentIcon === undefined) {
      return;
    }
    
    // Удаляет все временные иконки и воссоздает контейнер.
    this.clearTempIcons();
    
    // Оборачивает иконку, если это необходимо.
    let wrappedIcon;
    if (typeof tempIcon === 'string') {
      wrappedIcon = this.createTempIcon(tempIcon);
    } else {
      wrappedIcon = tempIcon;
    }
    
    // Предоставлены ли уже трансформированные данные? Если нет,
    // преобразовать на лету.
    let transformedIcon;
    if (parentIcon.subboxIcon !== undefined) {
      transformedIcon = parentIcon.centerWithinSubbox(wrappedIcon, vmargin, hmargin);
    } else {
      transformedIcon = parentIcon.centerWithinIcon(wrappedIcon, vmargin, hmargin);
    }
    this._performCenteredIconAction(transformedIcon, color);
  }

  /**
   * Создает временную иконку.
   * @param {string} iconName
   * @return {Object} Обёрнутая иконка
   * @private
   */
  createTempIcon(iconName) {
    return wrapIcon(iconName);
  }

  /**
   * Удаляет все временные иконки и воссоздает контейнер временных иконок. 
   * @return {IconBar} this
   */
  clearTempIcons() {
    if (this.svg !== undefined) {
      const tempIconGroup = displays.svg.ids.tempIconGroup(this.divId);
      displays.svg.dom.elem(tempIconGroup) &&
        displays.svg.dom.elem(tempIconGroup).removeChildren();
    }
    return this;
  }

  /**
   * Непосредственно создает SVG-элемент, соответствующий иконке.
   * @param {Object} transformedIcon Преобразованная иконка
   * @param {string} color Строка цвета
   * @private
   */
  _performCenteredIconAction(transformedIcon, color) {
    const containerBox = displays.svg.ids.tempIconGroup(this.divId);
    const container = displays.svg.dom.elem(containerBox);
    if (container && color && transformedIcon) {
      const path = svgLib.path()
        .setAttr('d', transformedIcon.iconStr)
        .setAttr('fill', color)
        .setAttr('transform', transformedIcon.transformString());
      container.append(path);
    }
    return this;
  }

  /**
   * Возвращает иконку по индексу или имени. Для multiIcona это может быть
   * один из активно открытых в данный момент.
   *
   * @param {string|number} iconNameOrIndex
   * @return {Object} Обёрнутая иконка
   */
  getIcon(iconNameOrIndex) {
    if (typeof iconNameOrIndex === 'number') {
      return this.icons[iconNameOrIndex];
    } else if (typeof iconNameOrIndex === 'string') {
      return this.nameMapping[iconNameOrIndex];
    }
    return undefined;
  }

  /**
   * Перебирает каждую иконку и выполняет над ней какое-либо действие.
   * @param {function(Object)} func Функция для выполнения
   * @return {IconBar} this
   */
  forEachIcon(func) {
    for (let i = 0; i < this.icons.length; i++) {
      func(this.icons[i]);
    }
    return this;
  }

  /**
   * Добавляет обработчик событий для всех иконок.
   * @param {string} eventName
   * @param {function(Event, Object)} func Функция должна принимать событие и иконку
   * @return {IconBar} this
   */
  addEvent(eventName, func) {
    for (let i = 0; i < this.icons.length; i++) {
      const icon = this.icons[i];
      const iconId = this.idGen.button(icon.iconName);
      this._addEventInternal(eventName, iconId, icon, func);
    }
    return this;
  }

  /**
   * Добавляет обработчик событий для конкретной иконки, определенной по имени или индексу.
   * @param {string} eventName
   * @param {string|number} iconNameOrIndex
   * @param {function(Event, Object)} func Функция должна принимать событие и иконку
   * @return {IconBar} this
   */
  addEventForIcon(eventName, iconNameOrIndex, func) {
    const icon = this.getIcon(iconNameOrIndex);
    const iconId = this.idGen.button(icon.iconName);
    this._addEventInternal(eventName, iconId, icon, func);
    return this;
  }

  /**
   * Внутренний метод для добавления обработчика событий
   * @param {string} eventName
   * @param {string} iconId
   * @param {Object} icon 
   * @param {function(Event, Object)} func
   * @return {IconBar} this
   * @private
   */
  _addEventInternal(eventName, iconId, icon, func) {
    displays.svg.dom.elem(iconId).on(eventName, function (e) {
      func(e, icon);
    });
    return this;
  }

  /**
   * Удаляет панель иконок
   * @return {IconBar} this
   */
  destroy() {
    displays.svg.dom.elem(this.divId) &&
      displays.svg.dom.elem(this.divId).empty();
    return this;
  }
}
