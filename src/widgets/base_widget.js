/**
 * Базовый класс виджетов для библиотеки Glift.
 * Представляет основной UI-компонент для отображения и взаимодействия с доской Го.
 */
import { selectId, newElement } from '../dom/index.js';
import * as displays from '../displays/index.js';

export class BaseWidget {
  /**
   * Создает новый экземпляр базового виджета.
   * @param {Object} options - Опции для создания виджета
   */
  constructor(options) {
    /**
     * ID div-контейнера виджета.
     * @type {string}
     */
    this.divId = options.divId;
    
    /**
     * ID внутреннего контейнера, создаваемого внутри основного.
     * @type {string}
     */
    this.innerDivId = options.divId + '-inner';
    
    /**
     * Опции отображения.
     * @type {Object}
     */
    this.displayOptions = options.display || {};
    
    /**
     * Опции SGF.
     * @type {Object}
     */
    this.sgfOptions = options.sgfDefaults || {};
    
    /**
     * Путь или содержимое SGF файла.
     * @type {string|undefined}
     */
    this.sgf = options.sgf;
    
    /**
     * Тип виджета.
     * @type {string}
     */
    this.widgetType = options.widgetType;
    
    /**
     * Обработчики событий.
     * @type {Object}
     */
    this.hooks = options.hooks || {};
    
    /**
     * Контроллер для управления логикой игры.
     * @type {Object|undefined}
     * @private
     */
    this._controller = undefined;
    
    /**
     * Объект отображения.
     * @type {Object|undefined}
     * @private
     */
    this._display = undefined;
    
    /**
     * Обработчики событий.
     * @type {Map<string, Array<function>>}
     * @private
     */
    this._eventHandlers = new Map();
    
    // Инициализируем виджет
    this._init();
  }
  
  /**
   * Инициализирует виджет.
   * @private
   */
  _init() {
    try {
      // Создаем DOM-элементы
      this._createDom();
      
      // Загружаем SGF
      this._loadSgf();
      
      // Вызываем хук инициализации
      if (this.hooks.widgetLoaded) {
        this.hooks.widgetLoaded(this);
      }
    } catch (error) {
      console.error('Ошибка инициализации виджета:', error);
    }
  }
  
  /**
   * Создает необходимые DOM-элементы.
   * @private
   */
  _createDom() {
    // Получаем контейнер
    const container = selectId(this.divId);
    if (!container) {
      throw new Error(`Не удалось найти контейнер с ID: ${this.divId}`);
    }
    
    // Создаем внутренний контейнер
    const innerContainer = newElement('div', this.innerDivId);
    innerContainer.style('position', 'relative')
      .style('width', '100%')
      .style('height', '100%');
    
    container.append(innerContainer);
  }
  
  /**
   * Загружает SGF и инициализирует контроллер и отображение.
   * @private
   */
  _loadSgf() {
    // Создаем контейнеры для доски и панели статуса
    const boardId = `${this.innerDivId}-board`;
    const statusbarId = `${this.innerDivId}-statusbar`;
    
    // Получаем контейнер
    const container = selectId(this.innerDivId);
    if (!container) {
      console.error('Не найден контейнер:', this.innerDivId);
      return;
    }
    
    // Создаем базовую структуру для тестирования
    const html = `
      <div id="${boardId}" style="width: 100%; height: 90%; background-color: #E8C064; position: relative; border: 2px solid black; box-sizing: border-box;">
        <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; display: flex; justify-content: center; align-items: center; font-size: 24px; font-weight: bold;">
          Доска Го
        </div>
        <div style="position: absolute; top: 20px; left: 20px; width: 20px; height: 20px; background-color: black; border-radius: 50%;">
        </div>
        <div style="position: absolute; top: 20px; right: 20px; width: 20px; height: 20px; background-color: white; border-radius: 50%; border: 1px solid black;">
        </div>
        <div style="position: absolute; bottom: 20px; left: 20px; width: 20px; height: 20px; background-color: white; border-radius: 50%; border: 1px solid black;">
        </div>
        <div style="position: absolute; bottom: 20px; right: 20px; width: 20px; height: 20px; background-color: black; border-radius: 50%;">
        </div>
        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 20px; height: 20px; background-color: black; border-radius: 50%;">
        </div>
      </div>
      <div id="${statusbarId}" style="width: 100%; height: 10%; background-color: #f5f5f5; border: 1px solid #ddd; box-sizing: border-box; display: flex; align-items: center; padding: 0 10px;">
        <span style="font-weight: bold;">Ход: 5 (Черные)</span>
      </div>
    `;
    
    // Устанавливаем HTML напрямую
    container.html(html);
    
    console.log('Создан простой HTML для отображения доски');
    
    // Проверяем, создались ли элементы
    if (document.getElementById(boardId)) {
      console.log('Контейнер доски найден в DOM');
    } else {
      console.error('Контейнер доски НЕ найден в DOM:', boardId);
    }
    
    // Устанавливаем заглушку для контроллера
    this._controller = {
      initialize: () => {},
      getBoard: () => ({ stones: [] }),
      currentState: () => ({ stones: [] })
    };
  }
  
  /**
   * Возвращает ID виджета.
   * @return {string} ID виджета
   */
  id() {
    return this.divId;
  }
  
  /**
   * Отрисовывает виджет заново.
   * @return {BaseWidget} this для цепочки вызовов
   */
  redraw() {
    if (this._display) {
      if (this._display.board) {
        this._display.board.draw();
      }
      if (this._display.statusbar) {
        this._display.statusbar.draw();
      }
    }
    return this;
  }
  
  /**
   * Уничтожает виджет и освобождает ресурсы.
   */
  destroy() {
    // Удаляем обработчики событий
    this._eventHandlers.clear();
    
    // Уничтожаем отображение
    if (this._display) {
      if (this._display.board) {
        this._display.board.destroy();
      }
      if (this._display.statusbar) {
        this._display.statusbar.destroy();
      }
    }
    
    // Очищаем DOM
    const container = selectId(this.divId);
    if (container) {
      container.empty();
    }
  }
  
  /**
   * Добавляет обработчик события.
   * @param {string} eventName - Имя события
   * @param {Function} handler - Обработчик события
   * @return {BaseWidget} this для цепочки вызовов
   */
  addEventListener(eventName, handler) {
    if (!this._eventHandlers.has(eventName)) {
      this._eventHandlers.set(eventName, []);
    }
    
    this._eventHandlers.get(eventName).push(handler);
    return this;
  }
  
  /**
   * Удаляет обработчик события.
   * @param {string} eventName - Имя события
   * @param {Function} handler - Обработчик события
   * @return {BaseWidget} this для цепочки вызовов
   */
  removeEventListener(eventName, handler) {
    if (!this._eventHandlers.has(eventName)) {
      return this;
    }
    
    const handlers = this._eventHandlers.get(eventName);
    const index = handlers.indexOf(handler);
    if (index !== -1) {
      handlers.splice(index, 1);
    }
    
    return this;
  }
  
  /**
   * Вызывает событие.
   * @param {string} eventName - Имя события
   * @param {...*} args - Аргументы для обработчиков
   * @private
   */
  _dispatchEvent(eventName, ...args) {
    if (!this._eventHandlers.has(eventName)) {
      return;
    }
    
    const handlers = this._eventHandlers.get(eventName);
    for (const handler of handlers) {
      handler(...args);
    }
  }
  
  /**
   * Возвращает опции отображения.
   * @return {Object} Опции отображения
   */
  getDisplayOptions() {
    return this.displayOptions;
  }
}
