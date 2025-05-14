/**
 * Модуль обработчиков событий для Glift.
 * @module api/hooks
 */

/**
 * Обработчики событий для интеграции с Glift.
 * Позволяют подключать внешние функции к ключевым событиям библиотеки.
 */
export class HookOptions {
  /**
   * Создает новый объект опций обработчиков событий.
   * 
   * @param {Object} options - Объект с опциями
   */
  constructor(options = {}) {
    /**
     * Функция для получения следующего SGF из внешнего источника.
     * Вместо коллекции SGF пользователи могут предоставить функцию getNextSgf.
     * Это означает, что SGF файлы хранятся вне Glift (например, на сервере проблем).
     *
     * Имеет формат: function(callback)
     *
     * Функция обратного вызова всегда ожидает объект SGF, который имеет форму:
     * ```
     * {
     *   sgfString: <string-содержимое SGF>,
     *   alias: <строка для кэш-попаданий>
     * }
     * ```
     *
     * @type {function(function(!{sgfString: string, alias: string})):void|undefined}
     */
    this.getNextSgf = options.getNextSgf;

    /**
     * Срабатывает, когда пользователь правильно решает проблему.
     * Это функция только для уведомления.
     *
     * Пример использования:
     * ```
     * new HookOptions({
     *   problemCorrect: () => {
     *     console.log('Проблема решена правильно!');
     *     updateUserScore(+1);
     *   }
     * })
     * ```
     *
     * @type {function():void|undefined}
     */
    this.problemCorrect = options.problemCorrect;

    /**
     * Срабатывает, когда пользователь неправильно решает проблему.
     *
     * @type {function():void|undefined}
     */
    this.problemIncorrect = options.problemIncorrect;
    
    /**
     * Срабатывает при изменении состояния доски.
     * Полезно для синхронизации внешнего UI с состоянием доски.
     *
     * @type {function(!Object):void|undefined}
     */
    this.stateChanged = options.stateChanged;
    
    /**
     * Срабатывает, когда виджет полностью загружен и отрисован.
     * 
     * @type {function(!Object):void|undefined}
     */
    this.widgetLoaded = options.widgetLoaded;
  }
}
