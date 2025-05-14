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
    if (!container) return;
    
    // Создаем и добавляем контейнер для доски
    const boardContainer = newElement('div', boardId);
    boardContainer.style('width', '100%')
      .style('height', '90%')
      .style('position', 'relative');
    
    // Создаем и добавляем контейнер для статусбара
    const statusbarContainer = newElement('div', statusbarId);
    statusbarContainer.style('width', '100%')
      .style('height', '10%')
      .style('position', 'relative');
    
    // Добавляем контейнеры
    container.append(boardContainer);
    container.append(statusbarContainer);
    
    try {
      console.log('Создание отображения...');
      console.log('boardId:', boardId);
      console.log('DISPLAY_TYPE:', displays.DISPLAY_TYPE);
      
      // Создаем отображение
      this._display = displays.createByType(
        displays.DISPLAY_TYPE.FULL, 
        {
          boardOptions: {
            divId: boardId,
            boardSize: this.displayOptions.boardSize || 19,
            theme: this.displayOptions.theme || 'DEFAULT',
            showCoordinates: this.displayOptions.drawBoardCoords || false
          },
          statusbarOptions: {
            divId: statusbarId,
            theme: this.displayOptions.theme || 'DEFAULT'
          }
        }
      );
      
      console.log('Отображение создано:', this._display);
      
      // Отрисовываем доску и добавляем тестовые камни
      if (this._display && this._display.board) {
        console.log('Добавление камней на доску...');
        // Рисуем несколько тестовых камней
        this._display.board.addStone(3, 3, 'black');
        this._display.board.addStone(3, 15, 'white');
        this._display.board.addStone(15, 3, 'white');
        this._display.board.addStone(15, 15, 'black');
        this._display.board.addStone(9, 9, 'black');
        
        // Обновляем статусбар
        if (this._display.statusbar) {
          this._display.statusbar.setMove(5, 'black');
          this._display.statusbar.setCaptures(1, 2);
        }
      } else {
        console.error('Объект доски не создан!');
      }
    } catch (error) {
      console.error('Ошибка при создании отображения:', error);
    }
    
    // В полноценной реализации здесь бы загружался SGF и создавался контроллер
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
