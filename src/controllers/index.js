/**
 * Модуль контроллеров для библиотеки Glift.
 * Содержит классы и функции для управления игровой логикой.
 * 
 * @module controllers
 */

// Заглушка для контроллеров - в полной реализации здесь будут настоящие контроллеры
export const controllers = {
  version: '2.0.0-alpha'
};

/**
 * Базовый контроллер для всех режимов игры.
 */
export class BaseController {
  /**
   * @param {Object} options - Опции для контроллера
   */
  constructor(options = {}) {
    /**
     * Опции контроллера.
     * @type {Object}
     */
    this.options = options;
  }
  
  /**
   * Инициализирует контроллер.
   */
  init() {
    console.log('Инициализация базового контроллера');
  }
  
  /**
   * Обрабатывает нажатие на точку доски.
   * @param {Object} pt - Точка нажатия
   */
  handleClick(pt) {
    console.log(`Нажатие на точку (${pt.x()},${pt.y()})`);
  }
  
  /**
   * Обрабатывает наведение на точку доски.
   * @param {Object} pt - Точка наведения
   */
  handleHover(pt) {
    console.log(`Наведение на точку (${pt.x()},${pt.y()})`);
  }
}

/**
 * Создает контроллер нужного типа.
 * @param {string} controllerType - Тип контроллера
 * @param {Object} sgfOptions - Опции SGF
 * @return {BaseController} Созданный контроллер
 */
export const createController = (controllerType, sgfOptions) => {
  // По умолчанию используем базовый контроллер
  return new BaseController(sgfOptions);
};

/**
 * Типы контроллеров.
 * @enum {string}
 * @const
 */
export const CONTROLLER_TYPE = Object.freeze({
  /** Базовый контроллер для игры */
  GAME: 'GAME',
  
  /** Контроллер для проблем */
  PROBLEM: 'PROBLEM',
  
  /** Контроллер для редактора */
  EDITOR: 'EDITOR',
  
  /** Контроллер для просмотра SGF-коллекций */
  COLLECTION: 'COLLECTION'
});

/**
 * Фабрика для создания контроллеров определенного типа.
 */
export class ControllerFactory {
  /**
   * Создает новую фабрику контроллеров.
   */
  constructor() {
    /**
     * Карта зарегистрированных типов контроллеров.
     * @type {Map<string, Function>}
     * @private
     */
    this._constructors = new Map([
      [CONTROLLER_TYPE.GAME, BaseController]
    ]);
  }
  
  /**
   * Регистрирует новый тип контроллера.
   * @param {string} type - Тип контроллера
   * @param {Function} constructor - Конструктор контроллера
   */
  register(type, constructor) {
    this._constructors.set(type, constructor);
  }
  
  /**
   * Создает контроллер нужного типа.
   * @param {string} type - Тип контроллера
   * @param {Object} options - Опции для создания контроллера
   * @return {BaseController} Созданный контроллер
   */
  create(type, options) {
    const Constructor = this._constructors.get(type) || BaseController;
    return new Constructor(options);
  }
}; 