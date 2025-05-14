/**
 * Модуль информационного окна для статусбара.
 * @module displays/statusbar/info_window
 */

import { selectId, absBboxDiv, newDiv } from '../../dom/index.js';
import { mergeObjects } from '../../util/index.js';
import { platform } from '../../platform.js';
import { keyMappings } from '../../key_mappings.js';

/**
 * Создает информационное окно. Само по себе оно не очень полезно - 
 * оно предназначено для заполнения данными.
 * 
 * @param {string} wrapperDivId ID обертывающего div-элемента
 * @param {Object} bbox Ограничивающий прямоугольник
 * @param {Object} theme Тема оформления
 * @param {string} instanceId ID экземпляра
 * @return {InfoWindow} Созданное информационное окно
 */
export function createInfoWindow(
  wrapperDivId,
  bbox,
  theme,
  instanceId
) {
  const suffix = '_info_window';
  const newDivId = wrapperDivId + suffix + '_wrapper';
  const wrapperDivEl = selectId(wrapperDivId);
  const fullBox = bbox;

  const baseDiv = absBboxDiv(fullBox, newDivId);
  baseDiv.css({ 'z-index': 100 }); // убедиться, что окно отображается поверх

  const textDiv = newDiv(wrapperDivId + suffix + '_textdiv');
  const textDivCss = mergeObjects(
    {
      position: 'relative',
      margin: '0px',
      padding: '0px',
      'overflow-y': 'auto',
      height: fullBox.height() + 'px',
      width: fullBox.width() + 'px',
      MozBoxSizing: 'border-box',
      boxSizing: 'border-box',
    },
    theme.textDiv
  );
  textDiv.css(textDivCss);

  const exitScreen = function () {
    baseDiv.remove();
  };

  if (platform.isMobile()) {
    textDiv.on('touchend', exitScreen);
  } else {
    textDiv.on('click', exitScreen);
  }

  const oldEscAction = keyMappings.getFuncOrIcon(instanceId, 'ESCAPE');
  keyMappings.registerKeyAction(instanceId, 'ESCAPE', function () {
    exitScreen();
    if (oldEscAction) {
      keyMappings.registerKeyAction(instanceId, 'ESCAPE', oldEscAction);
    }
  });
  return new InfoWindow(wrapperDivEl, baseDiv, textDiv);
}

/**
 * Класс обертки информационного окна.
 */
export class InfoWindow {
  /**
   * @param {Object} wrapperDiv Div-элемент, который оборачивает как baseDiv, так и textDiv
   * @param {Object} baseStatusDiv Div-элемент, который определяет все размеры и z-index
   * @param {Object} textDiv Div-элемент, в котором пользователи размещают контент
   */
  constructor(wrapperDiv, baseStatusDiv, textDiv) {
    /**
     * Div-элемент, который оборачивает как baseDiv, так и textDiv
     * @private
     */
    this.wrapperDiv_ = wrapperDiv;

    /**
     * Div-элемент, который определяет все размеры и z-index
     * @private
     */
    this.baseStatusDiv_ = baseStatusDiv;

    /**
     * Div-элемент, в котором пользователи размещают контент
     */
    this.textDiv = textDiv;
  }

  /** 
   * Завершает информационное окно, присоединяя все элементы. 
   * @return {InfoWindow} this
   */
  finish() {
    this.baseStatusDiv_.append(this.textDiv);
    this.wrapperDiv_.prepend(this.baseStatusDiv_);
    return this;
  }
}
