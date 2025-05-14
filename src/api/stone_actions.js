/**
 * Модуль действий с камнями для Glift.
 * @module api/stone_actions
 */

/**
 * Определение типа для функции обработки действий с камнями.
 * Представляет действие, которое может быть выполнено при взаимодействии с камнем.
 *
 * @typedef {function(
 *  !Event,
 *  !Object,
 *  !Object
 * )} StoneFn
 */
export const StoneFn = {}; // Только для документации, не используется

/**
 * Действия для камней на игровой доске.
 * Определяет поведение при взаимодействии пользователя с камнями.
 * Если пользователь указывает свои действия, они имеют приоритет
 * над встроенными действиями.
 */
export class StoneActions {
  /**
   * @param {!Object=} opt_o Опциональные параметры с функциями действий
   */
  constructor(opt_o = {}) {
    /**
     * Добавляет отображение "призрачного" камня при наведении курсора.
     * Показывает предварительный просмотр камня, который будет установлен при клике.
     *
     * @type {!StoneFn}
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
     * @type {!StoneFn}
     */
    this.mouseout = opt_o.mouseout || ((event, widget, pt) => {
      const currentPlayer = widget.controller.getCurrentPlayer();
      
      if (widget.controller.canAddStone(pt, currentPlayer)) {
        widget.display?.intersections()
          .setStoneColor(pt, 'EMPTY');
      }
    });

    /**
     * Базовая функция для обработки события touchend.
     * По умолчанию делегирует управление обычному обработчику кликов.
     * В будущем может быть расширена для включения направляющих линий.
     *
     * @type {!StoneFn}
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
     * @type {StoneFn|undefined}
     */
    this.click = opt_o.click;
  }
}
