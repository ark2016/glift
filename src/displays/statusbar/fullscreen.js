/**
 * Модуль полноэкранного режима для статусбара.
 * @module displays/statusbar/fullscreen
 */

import { StatusBar } from './statusbar.js';
import { dom } from '../../dom/dom.js';
import { util } from '../../util/util.js';

/**
 * Делает Glift полноэкранным. Пока поддерживается только псевдо-полноэкранный режим.
 * Примечание: Привязки клавиш устанавливаются в базовом виджете.
 * 
 * @return {void}
 */
StatusBar.prototype.fullscreen = function() {
  // TODO: Поддержка настоящего полноэкранного режима
  const widget = this.widget;
  const wrapperDivId = widget.wrapperDivId;
  const newDivId = wrapperDivId + '_fullscreen';
  const newDiv = dom.newDiv(newDivId);
  const state = widget.getCurrentState();
  const manager = widget.manager;

  let body = document.body;
  if (body == null) {
    throw new Error(
      'document.body был null, ' +
      'но он не должен быть null для работы полноэкранного режима'
    );
  }
  body = dom.elem(body);

  // Применяем стили для полноэкранного режима
  const cssObj = util.obj.flatMerge(
    {
      position: 'absolute',
      top: '0px',
      bottom: '0px',
      left: '0px',
      right: '0px',
      margin: '0px',
      padding: '0px',
      // Некоторые сайты устанавливают z-index очень высоким (смотрю на тебя, bootstrap).
      // Поэтому для полноценного полноэкранного режима нам нужно установить z-index еще выше.
      'z-index': 110000
    },
    this.theme.statusBar.fullscreen
  );
  newDiv.css(cssObj);

  // Предотвращаем прокрутку за пределами div
  body.addClass('glift-fullscreen-no-scroll').append(newDiv);
  
  // Сохраняем текущую позицию прокрутки
  manager.prevScrollTop =
    window.pageYOffset ||
    document.body.scrollTop ||
    document.documentElement.scrollTop ||
    null;
  
  // Прокручиваем страницу вверх
  window.scrollTo(0, 0);
  
  // Обновляем ID div'а в менеджере
  manager.fullscreenDivId = newDivId;
  
  // Пересоздаем виджет в новом контейнере
  widget.destroy();
  widget.wrapperDivId = newDivId;
  widget.draw();
  widget.applyState(state);
  
  // Включаем автоматическое изменение размеров при изменении окна
  manager.enableFullscreenAutoResize();
};

/**
 * Возвращает Glift из полноэкранного режима в обычный
 * 
 * @return {void}
 */
StatusBar.prototype.unfullscreen = function() {
  if (!this.widget.manager.isFullscreen()) {
    return;
  }
  
  const widget = this.widget;
  const wrapperDivEl = dom.elem(widget.wrapperDivId);
  const state = widget.getCurrentState();
  const manager = widget.manager;
  const body = dom.elem(document.body);

  // Удаляем полноэкранный div
  widget.destroy();
  wrapperDivEl.remove();
  
  // Восстанавливаем исходный контейнер
  widget.wrapperDivId = widget.manager.divId;
  
  // Восстанавливаем позицию прокрутки
  window.scrollTo(0, manager.prevScrollTop || 0);

  // Возвращаем возможность прокрутки страницы
  body.removeClass('glift-fullscreen-no-scroll');

  // Сбрасываем сохраненные значения
  manager.fullscreenDivId = null;
  manager.prevScrollTop = null;

  // Пересоздаем виджет в исходном контейнере
  widget.draw();
  widget.applyState(state);
  
  // Отключаем автоматическое изменение размеров
  widget.manager.disableFullscreenAutoResize();
};
