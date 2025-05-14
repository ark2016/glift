/**
 * Модуль информации об игре для статусбара.
 * @module displays/statusbar/gameinfo
 */

import { StatusBar } from './statusbar.js';
import { createInfoWindow } from './info_window.js';
import { dom } from '../../dom/dom.js';
import { util } from '../../util/util.js';

/**
 * Создает объект информации об игре. Принимает массив данных об игре.
 * Примечание: Привязки клавиш устанавливаются в базовом виджете.
 * 
 * @param {Array<Object>} gameInfoArr - Массив с информацией об игре
 * @param {Object} captureCount - Количество захваченных камней
 * @return {Object} Информационное окно
 */
StatusBar.prototype.gameInfo = function(gameInfoArr, captureCount) {
  const infoWindow = createInfoWindow(
    this.widget.wrapperDivId,
    this.positioning.fullWidgetBbox(),
    this.theme.statusBar.gameInfo,
    this.widget.manager.id
  );

  // Это временное решение для отображения захваченных камней,
  // пока не будет разработано лучшее решение
  const captureArr = [
    { displayName: 'Захваченные белые камни', value: captureCount.WHITE },
    { displayName: 'Захваченные черные камни', value: captureCount.BLACK }
  ];

  // Объединяем информацию о захваченных камнях с общей информацией
  gameInfoArr = captureArr.concat(gameInfoArr);

  // Формируем текстовый массив для отображения
  const textArray = [];
  for (let i = 0; i < gameInfoArr.length; i++) {
    const obj = gameInfoArr[i];
    textArray.push('<strong>' + obj.displayName + ': </strong>' + obj.value);
  }

  // Применяем тему оформления
  const gameInfoTheme = this.theme.statusBar.gameInfo;
  
  // Добавляем заголовок и содержимое в окно
  infoWindow.textDiv
    .append(
      dom.newElem('h3')
        .appendText('Информация об игре')
        .css(
          util.obj.flatMerge(gameInfoTheme.textTitle, gameInfoTheme.text)
        )
    )
    .append(
      dom.convertText(
        textArray.join('\n'),
        false /* не использовать Markdown */,
        util.obj.flatMerge(gameInfoTheme.textBody, gameInfoTheme.text)
      )
    )
    .css({ padding: '10px' });
  
  // Завершаем и отображаем окно
  infoWindow.finish();
  
  return infoWindow;
};
