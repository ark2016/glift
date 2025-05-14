/**
 * Модуль опций SGF.
 * Определяет класс для хранения настроек SGF и типы для виджетов.
 * @module api/sgf_options
 */

import { boardRegions, rotations } from '../util/enums.js';

/**
 * Класс опций SGF.
 * Используется для хранения и передачи настроек SGF между компонентами.
 */
export class SgfOptions {
  /**
   * Создает новый экземпляр SgfOptions.
   * @param {Object} options Объект с опциями
   */
  constructor(options = {}) {
    /** @type {string} SGF строка или путь к файлу */
    this.sgfString = options.sgfString || '';

    /** @type {Array<number|string>} Начальная позиция в SGF */
    this.initialPosition = options.initialPosition || [];

    /** @type {string} Тип парсера */
    this.parseType = options.parseType || 'SGF';

    /** @type {Object} Условия для задач */
    this.problemConditions = options.problemConditions || {};

    /** @type {Object} Обработчики событий */
    this.hooks = options.hooks || {};

    /** @type {string} Показывать вариации */
    this.showVariations = options.showVariations;

    /** @type {boolean} Отмечать последний ход */
    this.markLastMove = options.markLastMove;

    /** @type {boolean} Отмечать ко */
    this.markKo = options.markKo;

    /** @type {string} Угол поворота */
    this.rotation = options.rotation || rotations.NO_ROTATION;

    /** @type {string} Регион доски */
    this.boardRegion = options.boardRegion || boardRegions.ALL;

    /** @type {number} Время сброса правильных вариаций (мс) */
    this.correctVariationsResetTime = options.correctVariationsResetTime || 750;

    /** @type {function} Функция для обработки клика */
    this.stoneClick = options.stoneClick;

    /** @type {Array<string>} Компоненты UI */
    this.uiComponents = options.uiComponents || [];

    /** @type {Object} Результаты задачи */
    this.problemResults = options.problemResults || {};

    /**
     * URL для загрузки SGF
     * @type {string|undefined}
     */
    this.url = options.url;

    /**
     * Псевдоним для SGF
     * @type {string|undefined}
     */
    this.alias = options.alias;

    /**
     * Тип виджета
     * @type {string}
     */
    this.widgetType = options.widgetType;

    /**
     * Путь для следующих ходов
     * @type {string|Array<number>}
     */
    this.nextMovesPath = options.nextMovesPath || '';

    /**
     * Компоненты UI для отображения
     * @type {Array<string>}
     */
    this.uiComponents = options.uiComponents || [
      BoardComponent.BOARD,
      BoardComponent.COMMENT_BOX,
      BoardComponent.STATUS_BAR,
      BoardComponent.ICONBAR
    ];

    // Флаги для отключения компонентов
    this.disableStatusBar = !!options.disableStatusBar;
    this.disableBoard = !!options.disableBoard;
    this.disableCommentBox = !!options.disableCommentBox;
    this.disableIconBar = !!options.disableIconBar;

    /**
     * Метаданные для SGF
     * @type {Object|undefined}
     */
    this.metadata = options.metadata;

    /**
     * Переопределение общего количества правильных вариаций
     * @type {number|undefined}
     */
    this.totalCorrectVariationsOverride = options.totalCorrectVariationsOverride;
  }
}

/**
 * Тип для опций виджетов.
 * Определяет общую структуру опций для всех типов виджетов.
 * @typedef {Object} WidgetTypeOptions
 * @property {boolean} [markLastMove] Отмечать ли последний ход
 * @property {boolean} [enableMousewheel] Включить прокрутку колесиком
 * @property {Object} [keyMappings] Карта привязок клавиш к действиям
 * @property {Object} [problemConditions] Условия задачи
 * @property {Function} [controllerFunc] Функция контроллера
 * @property {Array} [icons] Иконки для панели инструментов
 * @property {string} [showVariations] Настройка отображения вариаций
 * @property {Array} [statusBarIcons] Иконки для статусбара
 * @property {Function} [stoneClick] Обработчик клика на камне
 * @property {Function} [stoneMouseover] Обработчик наведения на камень
 * @property {Function} [stoneMouseout] Обработчик ухода с камня
 */

// Типы экспортируются через JSDoc, не нужно экспортировать повторно 