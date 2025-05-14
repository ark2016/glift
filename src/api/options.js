/**
 * Опции для библиотеки Glift.
 * 
 * Содержит настройки для управления виджетами и отображением.
 * 
 * @module api/options
 */

import { SgfOptions } from './sgf_options.js';
import { HookOptions } from './hooks.js'; 
import { DisplayOptions } from './display_options.js';
import { StoneActions } from './stone_actions.js';
import { iconActionDefaults } from './icon_actions.js';

/**
 * Option defaults. Иногда я буду ссылаться на подмножество этих опций как на
 * Glift Spec.
 *
 * Есть три класса опций:
 *
 * 1. Manager Options - метаопции для управления виджетами.
 *    Обычно находятся на верхнем уровне.
 * 2. Display Options - опции для отображения виджетов
 * 3. SGF Options - опции, относящиеся к SGF-файлам.
 *
 * Терминология:
 *  - Я использую термин SGF для обозначения файлов с данными игры Го.
 *    В будущем SGF строки и URL могут включать другие типы данных, 
 *    например, файлы Tygem .gib.
 */
export class Options {
  /**
   * @param {Object=} opt_o - Объект опций
   */
  constructor(opt_o = {}) {
    /**
     * Параметр sgf может быть одним из следующих:
     *  - SGF в виде строки
     *  - URL к SGF-файлу
     *  - Объект SGF с параметрами, указанными в SGF Defaults
     *
     * Если sgf указан как объект, он может содержать любые опции
     * из sgfDefaults. Также могут быть указаны следующие параметры:
     *  - sgfString: строка SGF
     *  - initialPosition: начальная позиция в SGF
     *  - url: URL к SGF
     */
    this.sgf = opt_o.sgf || undefined;

    /**
     * Настройки SGF по умолчанию
     * @const
     * @type {Object}
     */
    this.sgfDefaults = new SgfOptions(opt_o.sgfDefaults);

    /**
     * ID div-элемента, в котором будет создана доска Го
     * @const
     * @type {string}
     */
    this.divId = opt_o.divId || 'glift_display';

    /**
     * Коллекция SGF представляет набор SGF-файлов. Может принимать одно из трех значений:
     * - Массив объектов SGF
     * - URL (для асинхронной загрузки). Полученные данные должны быть
     *   JSON-массивом, содержащим список сериализованных объектов SGF.
     *
     * @const
     * @type {Array|string}
     */
    this.sgfCollection = opt_o.sgfCollection || [];

    /**
     * Экспериментальная функция. Создает ассоциацию между именем и SGF-строкой.
     * Определяет основу кэша SGF в менеджере.
     *
     * Ожидаемая структура:
     *  {
     *    [имя/псевдоним]: <строка sgf>
     *  }
     *
     * @type {Object}
     */
    this.sgfMapping = opt_o.sgfMapping || {};

    /**
     * Индекс в коллекции SGF. Полезно для запоминания
     * позиции пользователя в коллекции.
     *
     * @type {number}
     */
    this.initialIndex = opt_o.initialIndex || 0;

    /**
     * Если в списке SGF несколько файлов, этот флаг указывает,
     * разрешено ли пользователю возвращаться к началу (или, наоборот, к концу).
     *
     * @type {boolean}
     */
    this.allowWrapAround = !!opt_o.allowWrapAround || false;

    /**
     * Загружать ли коллекцию в фоновом режиме через XHR-запросы.
     *
     * @type {boolean}
     */
    this.loadCollectionInBackground =
      opt_o.loadCollectionInBackground !== undefined
        ? !!opt_o.loadCollectionInBackground
        : true;

    /**
     * Глобальные метаданные для этого набора опций или коллекции SGF.
     *
     * @type {Object|undefined}
     */
    this.metadata = opt_o.metadata || undefined;

    /**
     * Хуки - места, где пользователи могут предоставить пользовательские функции
     * для взаимодействия с поведением Glift.
     *
     * @type {Object}
     */
    this.hooks = new HookOptions(opt_o.hooks);

    /**
     * Различные опции для отображения.
     *
     * @type {Object}
     */
    this.display = new DisplayOptions(opt_o.display);

    /**
     * Действия по умолчанию для камней.
     *
     * @type {Object}
     */
    this.stoneActions = new StoneActions(opt_o.stoneActions);

    /**
     * Действия для иконок.
     *
     * @type {Object}
     */
    this.iconActions = opt_o.iconActions || {};

    // Добавляем действия иконок по умолчанию
    for (const iconName in iconActionDefaults) {
      if (!this.iconActions[iconName]) {
        this.iconActions[iconName] = iconActionDefaults[iconName];
      }
    }
  }
}
