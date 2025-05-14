/**
 * Селектор иконок для отображения расширенных опций в пользовательском интерфейсе Glift.
 * @module displays/icons/icon_selector
 */

import { dom } from '../../dom/dom.js';
import { displays } from '../../displays/displays.js';
import { svg } from '../../svg/svg.js';
import { columnCenterWrapped } from './icon_centering.js';

/**
 * Создаёт и отображает селектор иконок.
 * 
 * @param {string} parentDivId ID родительского div-элемента
 * @param {string} iconBarDivId ID div-элемента для панели иконок
 * @param {Object} icon Базовая иконка
 * @return {IconSelector} Созданный селектор иконок
 */
export function iconSelector(parentDivId, iconBarDivId, icon) {
  return new IconSelector(
    parentDivId,
    iconBarDivId,
    icon
  ).draw();
}

/**
 * Класс селектора иконок.
 */
export class IconSelector {
  /**
   * @param {string} parentDivId ID родительского div-элемента
   * @param {string} iconBarId ID панели иконок
   * @param {Object} icon Базовая иконка
   */
  constructor(parentDivId, iconBarId, icon) {
    // Предполагается, что может быть только один IconSelector.
    // Это может быть неверно, но может быть легко пересмотрено позже.
    this.iconBarId = iconBarId;
    this.parentDivId = parentDivId;
    this.icon = icon; // базовая иконка

    this.baseId = 'iconSelector_' + parentDivId;
    this.wrapperDivId = this.baseId + '_wrapper';

    this.displayedIcons = undefined; // определяется при отрисовке

    // ID для столбцов
    this.columnIdList = [];
    // SVG структуры данных для каждого столбца
    this.svgColumnList = []; // определяется при отрисовке. Одиночный массив.
    // список столбцов обёрнутых иконок. Двойной массив.
    this.iconList = [];
  }

  /**
   * Отрисовывает селектор иконок и возвращает экземпляр.
   * @return {IconSelector} this
   */
  draw() {
    // TODO(kashomon): Это нуждается в очистке. В настоящее время это довольно 
    // беспорядочно.
    this.destroy();
    const parentBbox = displays.bboxFromDiv(this.parentDivId);

    const barElem = dom.elem(this.iconBarId);
    const barPosLeft = barElem.boundingClientRect().left;

    const iconBarBbox = displays.bboxFromDiv(this.iconBarId);
    const iconBbox = this.icon.bbox;
    // Предполагается, что панель иконок всегда внизу.
    const columnHeight = parentBbox.height() - iconBarBbox.height();
    const paddingPx = 5; // TODO(kashomon): Получить из темы.
    const rewrapped = [];

    for (let i = 0; i < this.icon.associatedIcons.length; i++) {
      rewrapped.push(this.icon.associatedIcons[i].rewrapIcon());
    }

    const newWrapperDiv = dom.newDiv(this.wrapperDivId);
    newWrapperDiv.css({
      position: 'absolute',
      height: parentBbox.height() + 'px',
      width: parentBbox.width() + 'px',
    });
    dom.elem(this.parentDivId).append(newWrapperDiv);

    let columnIndex = 0;
    while (rewritten.length > 0) {
      this.iconList.push([]);
      const columnId = this.baseId + '_column_' + columnIndex;
      this.columnIdList.push(columnId);

      const newColumnDiv = dom.newDiv(columnId);
      newColumnDiv.css({
        bottom: iconBarBbox.height() + 'px',
        height: columnHeight + 'px',
        left: barPosLeft + columnIndex * iconBbox.width() + 'px',
        width: iconBbox.width() + 'px',
        position: 'absolute',
      });
      newWrapperDiv.append(newColumnDiv);

      const columnBox = displays.bboxFromDiv(columnId);
      const transforms = columnCenterWrapped(
        columnBox,
        rewrapped,
        paddingPx,
        paddingPx
      );

      const svgId = columnId + '_svg';
      const svgObj = svg.svg()
        .setId(columnId + '_svg')
        .setAttr('height', '100%')
        .setAttr('width', '100%');
      const idGen = displays.svg.ids.gen(columnId);
      const container = svg.group().setId(idGen.iconGroup());
      svgObj.append(container);
      for (let j = 0, len = transforms.length; j < len; j++) {
        const icon = rewrapped.shift(); // Используем rewrapped здесь
        const id = svgId + '_' + icon.iconName;
        icon.setElementId(id);
        this.iconList[columnIndex].push(icon);
        container.append(
          svg.path()
            .setId(icon.elementId)
            .setAttr('d', icon.iconStr)
            .setAttr('fill', 'black') // заменить на тему
            .setAttr('transform', icon.transformString())
        );
      }
      this.svgColumnList.push(svgObj);
      columnIndex++;
    }

    this._createIconButtons();
    this._setBackgroundEvent();
    for (let k = 0; k < this.svgColumnList.length; k++) {
      displays.svg.dom.attachToParent(
        this.svgColumnList[k],
        this.columnIdList[k]
      );
    }
    return this;
  }

  /**
   * Создаёт кнопки для иконок
   * @private
   */
  _createIconButtons() {
    for (let i = 0; i < this.iconList.length; i++) {
      const svgObj = this.svgColumnList[i];
      const idGen = displays.svg.ids.gen(this.columnIdList[i]);
      const iconColumn = this.iconList[i];
      const container = svg.group().setId(idGen.buttonGroup());
      svgObj.append(container);
      for (let j = 0; j < iconColumn.length; j++) {
        const icon = iconColumn[j];
        container.append(
          svg.rect()
            .setData(icon.iconName)
            .setAttr('x', icon.bbox.topLeft().x())
            .setAttr('y', icon.bbox.topLeft().y())
            .setAttr('width', icon.bbox.width())
            .setAttr('height', icon.bbox.height())
            .setAttr('fill', 'blue') // цвет не имеет значения, но нужно заполнение
            .setAttr('opacity', 0)
            .setId(idGen.button(icon.iconName))
        );
      }
    }
  }

  /**
   * Устанавливает обработчик событий для фона
   * @private
   * @return {IconSelector} this
   */
  _setBackgroundEvent() {
    const self = this; // Сохраняем ссылку на this
    dom.elem(this.wrapperDivId).on('click', function (e) {
      self.destroy(); // Используем self вместо this
    });
    return this;
  }

  /**
   * Устанавливает обработчики событий для иконок
   * @param {string} eventName Имя события
   * @param {Function} func Функция-обработчик
   * @return {IconSelector} this
   */
  setIconEvents(eventName, func) {
    for (let i = 0; i < this.iconList.length; i++) {
      const idGen = displays.svg.ids.gen(this.columnIdList[i]);
      for (let j = 0; j < this.iconList[i].length; j++) {
        const icon = this.iconList[i][j];
        const buttonId = idGen.button(icon.iconName);
        this._setOneEvent(eventName, buttonId, icon, func);
      }
    }
    return this;
  }

  /**
   * Устанавливает один обработчик события
   * @private
   * @param {string} eventName Имя события
   * @param {string} buttonId ID кнопки
   * @param {Object} icon Иконка
   * @param {Function} func Функция-обработчик
   * @return {IconSelector} this
   */
  _setOneEvent(eventName, buttonId, icon, func) {
    dom.elem(buttonId).on(eventName, function (event) {
      func(event, icon);
    });
    return this;
  }

  /**
   * Уничтожает селектор иконок
   * @return {IconSelector} this
   */
  destroy() {
    dom.elem(this.wrapperDivId) &&
      dom.elem(this.wrapperDivId).remove();
    return this;
  }
}
