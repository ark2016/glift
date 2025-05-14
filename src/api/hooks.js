goog.provide('glift.api.HookOptions');

/**
 * Обработчики событий для интеграции с Glift.
 * Позволяют подключать внешние функции к ключевым событиям библиотеки.
 */
class HookOptions {
  /**
   * Создает новый объект опций обработчиков событий.
   * 
   * @param {!Object=} opt_o Опциональные параметры
   */
  constructor(opt_o = {}) {
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
    this.getNextSgf = opt_o.getNextSgf;

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
    this.problemCorrect = opt_o.problemCorrect;

    /**
     * Срабатывает, когда пользователь неправильно решает проблему.
     *
     * @type {function():void|undefined}
     */
    this.problemIncorrect = opt_o.problemIncorrect;
    
    /**
     * Срабатывает при изменении состояния доски.
     * Полезно для синхронизации внешнего UI с состоянием доски.
     *
     * @type {function(!glift.flattener.Flattened):void|undefined}
     */
    this.stateChanged = opt_o.stateChanged;
    
    /**
     * Срабатывает, когда виджет полностью загружен и отрисован.
     * 
     * @type {function(!glift.widgets.BaseWidget):void|undefined}
     */
    this.widgetLoaded = opt_o.widgetLoaded;
  }
}

// Присваиваем класс к пространству имен
glift.api.HookOptions = HookOptions;
