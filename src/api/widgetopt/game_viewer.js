/**
 * Дополнительные опции для просмотрщика игр.
 * @module api/widgetopt/game_viewer
 */

/**
 * Возвращает опции для виджета просмотрщика игр.
 * @return {Object} Объект с опциями виджета
 */
export function gameViewerOptions() {
  return {
    markLastMove: true,
    enableMousewheel: true,

    /**
     * Привязки клавиш к действиям
     */
    keyMappings: {
      ARROW_LEFT: 'iconActions.arrowleft.click',
      ARROW_RIGHT: 'iconActions.arrowright.click',
      ',': 'iconActions.arrowleft.click',
      '.': 'iconActions.arrowright.click',
      '<': 'iconActions.jump-left-arrow.click',
      '>': 'iconActions.jump-right-arrow.click',
      /** Переключить выбранную вариацию вверх. */
      ']': function (widget) {
        widget.controller.moveUpVariations();
        widget.applyBoardData(widget.controller.flattenedState());
      },
      /** Переключить выбранную вариацию вниз. */
      '[': function (widget) {
        widget.controller.moveDownVariations();
        widget.applyBoardData(widget.controller.flattenedState());
      },
    },

    problemConditions: {}, // Отключить оценку задач

    controllerFunc: null, // будет заменено на gameViewer при подключении контроллеров

    icons: ['jump-left-arrow', 'jump-right-arrow', 'arrowleft', 'arrowright'],

    showVariations: null, // будет заменено на MORE_THAN_ONE при использовании перечислений

    statusBarIcons: ['game-info', 'move-indicator', 'fullscreen'],

    /**
     * Обработчик клика по камню на доске
     * @param {Event} event - Событие клика
     * @param {Object} widget - Объект виджета
     * @param {Object} pt - Точка на доске
     */
    stoneClick: function (event, widget, pt) {
      const currentPlayer = widget.controller.getCurrentPlayer();
      const partialData = widget.controller.addStone(pt, currentPlayer);
      widget.applyBoardData(partialData);
    },
    stoneMouseover: undefined, // полагаемся на значения по умолчанию
    stoneMouseout: undefined, // полагаемся на значения по умолчанию
  };
}
