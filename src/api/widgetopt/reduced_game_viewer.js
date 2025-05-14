/**
 * Опции для упрощенного просмотрщика игр.
 * Используется как часть другого виджета.
 * @module api/widgetopt/reduced_game_viewer
 */

/**
 * Возвращает опции для виджета упрощенного просмотрщика игр.
 * @return {Object} Объект с опциями виджета
 */
export function reducedGameViewerOptions() {
  return {
    markLastMove: undefined, // полагаемся на значения по умолчанию
    keyMappings: undefined, // полагаемся на значения по умолчанию
    enableMousewheel: true,

    problemConditions: {},

    controllerFunc: null, // будет заменено на gameViewer при подключении контроллеров

    icons: ['arrowleft', 'arrowright'],

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
