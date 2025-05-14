goog.provide('glift.api.StoneActions');
goog.provide('glift.api.StoneFn');

/**
 * Определение типа для функции обработки действий с камнями.
 * Представляет действие, которое может быть выполнено при взаимодействии с камнем.
 *
 * @typedef {function(
 *  !Event,
 *  !glift.widgets.BaseWidget,
 *  !glift.Point
 * )}
 */
glift.api.StoneFn;

/**
 * Действия для камней на игровой доске.
 * Определяет поведение при взаимодействии пользователя с камнями.
 * Если пользователь указывает свои действия, они имеют приоритет
 * над встроенными действиями.
 */
class StoneActions {
  /**
   * @param {!Object=} opt_o Опциональные параметры с функциями действий
   */
  constructor(opt_o = {}) {
    /**
     * Добавляет отображение "призрачного" камня при наведении курсора.
     * Показывает предварительный просмотр камня, который будет установлен при клике.
     *
     * @type {!glift.api.StoneFn}
     */
    this.mouseover = opt_o.mouseover || ((event, widget, pt) => {
      const hoverColors = { 
        BLACK: 'BLACK_HOVER', 
        WHITE: 'WHITE_HOVER' 
      };
      
      const currentPlayer = widget.controller.getCurrentPlayer();
      
      if (widget.controller.canAddStone(pt, currentPlayer)) {
        widget.display
          .intersections()
          .setStoneColor(pt, hoverColors[currentPlayer]);
      }
    });

    /**
     * Удаляет "призрачный" камень при выходе курсора.
     * Возвращает пересечение к исходному пустому состоянию.
     *
     * @type {!glift.api.StoneFn}
     */
    this.mouseout = opt_o.mouseout || ((event, widget, pt) => {
      const currentPlayer = widget.controller.getCurrentPlayer();
      
      if (widget.controller.canAddStone(pt, currentPlayer)) {
        widget.display?.intersections()
          .setStoneColor(pt, glift.enums.states.EMPTY);
      }
    });

    /**
     * Базовая функция для обработки события touchend.
     * По умолчанию делегирует управление обычному обработчику кликов.
     * В будущем может быть расширена для включения направляющих линий.
     *
     * @type {!glift.api.StoneFn}
     */
    this.touchend = opt_o.touchend || ((event, widget, pt) => {
      // Предотвращаем стандартные действия браузера
      event.preventDefault?.();
      event.stopPropagation?.();
      
      // Вызываем обработчик кликов для камня
      widget.sgfOptions.stoneClick(event, widget, pt);
    });
    
    /**
     * Обработчик клика на камне по умолчанию.
     * В базовой реализации отсутствует, так как зависит от типа виджета.
     * Должен быть переопределен в конкретных экземплярах.
     *
     * @type {glift.api.StoneFn|undefined}
     */
    this.click = opt_o.click;
  }
}

// Присваиваем класс к пространству имен
glift.api.StoneActions = StoneActions;
