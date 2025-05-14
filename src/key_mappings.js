/**
 * Модуль обработки привязок клавиш и клавиатурных событий для Glift.
 * @module key_mappings
 */

import * as global from './global.js';

/**
 * Специальные символы, которые должны быть привязаны к событию 'keydown', а не keypress.
 * @const {!Object<string, number>}
 */
export const specialChars = Object.freeze({
  BACKSPACE: 8,
  ESCAPE: 27,
  ARROW_LEFT: 37,
  ARROW_UP: 38,
  ARROW_RIGHT: 39,
  ARROW_DOWN: 40,
});

/** @private {Map<number, string>} Карта кодов клавиш в имена (создается при первом использовании) */
let _codeToNameKeyDown = null;

/**
 * Основной реестр привязок клавиш.
 * Структура: InstanceId -> KeyName -> функция или имя иконки
 * @private {!Map<string, !Map<string, (function(!Object)|string)>>}
 */
const _keyBindingMap = new Map();

/** @private {boolean} Инициализирован ли слушатель событий */
let _initializedListener = false;

/**
 * Преобразует имя клавиши в стандартный код клавиши.
 * @param {string} name Имя клавиши
 * @return {?number} Код клавиши или null, если не найден
 */
export function nameToCode(name) {
  if (name.length !== 1) {
    // Проверяем, что это формат КОНСТАНТЫ
    if (/[A-Z](_[A-Z]+)*/.test(name)) {
      return specialChars[name] ?? null;
    }
    return null;
  }
  return name.charCodeAt(0);
}

/**
 * Преобразует стандартный код клавиши в имя клавиши.
 * @param {number} keyCode Код клавиши
 * @return {?string} Имя клавиши или null, если не найден
 */
export function codeToName(keyCode) {
  if (!_codeToNameKeyDown) {
    // Инициализируем карту при первом использовании
    _codeToNameKeyDown = new Map(
      Object.entries(specialChars).map(([name, code]) => [code, name])
    );
  }
  
  return _codeToNameKeyDown.get(keyCode) || String.fromCharCode(keyCode) || null;
}

/**
 * Регистрирует функцию привязки клавиши для экземпляра менеджера.
 * @param {string} id ID экземпляра менеджера Glift
 * @param {string} keyName Имя клавиши (должно быть в nameToCode)
 * @param {function(!Object)|string} funcOrIcon Функция или имя иконки
 * @throws {Error} Если имя клавиши неизвестно
 */
export function registerKeyAction(id, keyName, funcOrIcon) {
  if (!nameToCode(keyName)) {
    throw new Error(`Неизвестное имя клавиши: ${keyName}`);
  }

  if (!_keyBindingMap.has(id)) {
    _keyBindingMap.set(id, new Map());
  }
  
  if (id && keyName && funcOrIcon) {
    _keyBindingMap.get(id).set(keyName, funcOrIcon);
  }
}

/**
 * Удаляет все привязки клавиш, связанные с экземпляром.
 * @param {string} id ID экземпляра
 */
export function unregisterInstance(id) {
  if (_keyBindingMap.has(id)) {
    _keyBindingMap.delete(id);
  }
}

/**
 * Получает функцию привязки клавиши или путь к иконке.
 * @param {string} id ID экземпляра менеджера Glift
 * @param {string} keyName Имя клавиши
 * @return {(function(!Object)|string|null)}
 */
export function getFuncOrIcon(id, keyName) {
  if (id && keyName && _keyBindingMap.has(id)) {
    const instanceMap = _keyBindingMap.get(id);
    if (instanceMap.has(keyName)) {
      return instanceMap.get(keyName);
    }
  }
  return null;
}

/**
 * Внутренняя функция для обработки нажатий клавиш.
 * @param {!KeyboardEvent} keyEvent Событие клавиатуры
 * @private
 */
function _keyHandlerFunc(keyEvent) {
  const keyName = codeToName(keyEvent.which);
  
  // Для событий keydown пропускаем обычные символы (они будут обработаны в keypress)
  if (keyEvent.type === 'keydown' && !/[A-Z_]+/.test(keyName)) {
    return;
  }

  const activeId = global.activeInstanceId;
  if (!activeId) return;
  
  const funcOrIcon = getFuncOrIcon(activeId, keyName);
  if (!funcOrIcon) return;

  const manager = global.instanceRegistry[activeId];
  if (!manager) return;

  const widget = manager.getCurrentWidget();
  if (!widget) return;

  // Обработка в зависимости от типа действия
  switch (typeof funcOrIcon) {
    case 'function':
      funcOrIcon(widget);
      break;
    
    case 'string':
      // Обрабатываем пути действий иконок (например, "iconActions.arrowleft.mouseup")
      const actionNamespace = funcOrIcon.split('.');
      const mainNamespace = actionNamespace[0];
      
      if (mainNamespace !== 'iconActions' && mainNamespace !== 'stoneActions') {
        throw new Error(`Неожиданное пространство имен действия: ${mainNamespace}`);
      }
      
      // Перемещаемся по пространству имен для поиска действия
      let action = widget[mainNamespace];
      for (let i = 1; i < actionNamespace.length; i++) {
        action = action[actionNamespace[i]];
      }
      
      action(keyEvent, widget);
      break;
    
    default:
      return; // Неизвестный тип, ничего не делаем
  }
  
  // Предотвращаем стандартные действия в полноэкранном режиме
  if (manager.isFullscreen()) {
    keyEvent.preventDefault();
  }
}

/**
 * Инициализирует глобальный слушатель нажатий клавиш.
 * Эта функция идемпотентна - её безопасно вызывать несколько раз.
 * @param {string} divId ID элемента-контейнера
 */
export function initKeybindingListener(divId) {
  if (_initializedListener) {
    return;
  }
  
  // Замечание: мы могли бы добавить обработчики событий только к элементу с tabindex=0,
  // но для упрощения используем document.body
  // Контекст: https://github.com/Kashomon/glift/issues/132
  const body = document.body;

  // Используем keydown для перехвата клавиш-стрелок, но keypress предпочтительнее
  // для обычных символов, так как проще получить charCode
  body.addEventListener('keydown', _keyHandlerFunc);
  body.addEventListener('keypress', _keyHandlerFunc);
  _initializedListener = true;
}

/**
 * Экспорт всех функций в единый объект для обратной совместимости
 */
export const keyMappings = {
  specialChars,
  nameToCode,
  codeToName,
  registerKeyAction,
  unregisterInstance,
  getFuncOrIcon,
  initKeybindingListener,
  // Приватные методы, оставлены для совместимости
  _keyHandlerFunc,
  _keyBindingMap,
  _codeToNameKeyDown,
  _initializedListener
};
