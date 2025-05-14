/**
 * Модуль отображения статусной панели для библиотеки Glift.
 * Содержит классы и функции для отображения статусной информации игры.
 */

import { selectId, newElement } from '../../dom/index.js';

/**
 * Класс для отображения статусной панели.
 */
export class StatusBar {
  /**
   * Создает новый экземпляр статусной панели.
   * @param {Object} options - Опции для создания панели
   */
  constructor(options = {}) {
    /**
     * ID контейнера статусной панели.
     * @type {string}
     */
    this.divId = options.divId || '';
    
    /**
     * Тема оформления.
     * @type {string}
     */
    this.theme = options.theme || 'DEFAULT';
    
    /**
     * DOM-элемент контейнера.
     * @type {HTMLElement|null}
     * @private
     */
    this._container = null;
    
    /**
     * DOM-элемент для отображения хода.
     * @type {HTMLElement|null}
     * @private
     */
    this._moveElement = null;
    
    /**
     * DOM-элемент для отображения захваченных камней.
     * @type {HTMLElement|null}
     * @private
     */
    this._capturesElement = null;
    
    // Инициализируем отображение
    this._init();
  }
  
  /**
   * Инициализирует отображение статусной панели.
   * @private
   */
  _init() {
    const container = selectId(this.divId);
    if (!container) {
      console.error(`Контейнер не найден: ${this.divId}`);
      return;
    }
    
    this._container = container;
    
    // Создаем элементы статусной панели
    const statusBarElement = newElement('div');
    statusBarElement
      .setAttr('class', 'glift-statusbar')
      .css({
        display: 'flex',
        justifyContent: 'space-between',
        padding: '8px',
        backgroundColor: '#f5f5f5',
        borderTop: '1px solid #ddd',
        boxSizing: 'border-box',
        fontSize: '14px',
        height: '100%'
      });
    
    // Создаем элемент для отображения текущего хода
    this._moveElement = newElement('div')
      .setAttr('class', 'glift-statusbar-move')
      .text('Ход: -');
    
    // Создаем элемент для отображения захваченных камней
    this._capturesElement = newElement('div')
      .setAttr('class', 'glift-statusbar-captures')
      .text('Захвачено: Черные (0), Белые (0)');
    
    // Добавляем элементы в контейнер
    statusBarElement.append(this._moveElement);
    statusBarElement.append(this._capturesElement);
    
    container.append(statusBarElement);
  }
  
  /**
   * Устанавливает информацию о текущем ходе.
   * @param {number} moveNumber - Номер хода
   * @param {string} player - Игрок ('black' или 'white')
   */
  setMove(moveNumber, player) {
    if (!this._moveElement) return;
    
    const playerText = player === 'black' ? 'Черные' : 'Белые';
    this._moveElement.text(`Ход: ${moveNumber} (${playerText})`);
  }
  
  /**
   * Устанавливает информацию о захваченных камнях.
   * @param {number} blackCaptures - Количество камней, захваченных черными
   * @param {number} whiteCaptures - Количество камней, захваченных белыми
   */
  setCaptures(blackCaptures, whiteCaptures) {
    if (!this._capturesElement) return;
    
    this._capturesElement.text(
      `Захвачено: Черные (${blackCaptures}), Белые (${whiteCaptures})`
    );
  }
  
  /**
   * Отрисовывает статусную панель.
   */
  draw() {
    // Обновление при необходимости
    console.log('Статусная панель отрисована');
  }
  
  /**
   * Уничтожает статусную панель и освобождает ресурсы.
   */
  destroy() {
    if (!this._container) return;
    
    this._container.empty();
    this._moveElement = null;
    this._capturesElement = null;
  }
}

/**
 * Создает отображение статусной панели.
 * @param {Object} options - Опции для создания панели
 * @return {StatusBar} Созданное отображение статусной панели
 */
export const create = (options = {}) => {
  return new StatusBar(options);
};

/**
 * Типы отображений статусбара.
 * @enum {string}
 * @const
 */
export const STATUSBAR_TYPE = Object.freeze({
  /** Стандартный статусбар */
  STANDARD: 'STANDARD',
  
  /** Статусбар с информационным окном */
  WITH_INFO: 'WITH_INFO',
  
  /** Минимальный статусбар */
  MINIMAL: 'MINIMAL'
}); 