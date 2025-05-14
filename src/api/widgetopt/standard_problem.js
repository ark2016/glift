/**
 * Дополнительные опции для стандартных задач, где вся задача 
 * хранится на стороне клиента.
 * @module api/widgetopt/standard_problem
 */

/**
 * Возвращает опции для виджета стандартных задач.
 * @return {Object} Объект с опциями виджета
 */
export function standardProblemOptions() {
  return {
    markLastMove: undefined, // полагаемся на значения по умолчанию
    keyMappings: undefined, // полагаемся на значения по умолчанию
    enableMousewheel: undefined, // полагаемся на значения по умолчанию (false)

    problemConditions: undefined, // полагаемся на значения по умолчанию, 
    // которые настроены для стандартной задачи.

    controllerFunc: null, // будет заменено на staticProblem при подключении контроллеров

    // TODO: Рассмотреть возможность использования multiopen-boxonly вместо checkbox
    icons: [
      'undo-problem-move',
      'problem-explanation',
      'multiopen-boxonly', // Статус задачи
    ],

    showVariations: null, // будет заменено на NEVER при использовании перечислений

    statusBarIcons: ['fullscreen'],

    /**
     * Обработчик клика по камню на доске
     * @param {Event} event - Событие клика
     * @param {Object} widget - Объект виджета
     * @param {Object} pt - Точка на доске
     */
    stoneClick: function (event, widget, pt) {
      const hooks = widget.hooks();
      const currentPlayer = widget.controller.getCurrentPlayer();
      const flattened = widget.controller.addStone(pt, currentPlayer);
      const problemResults = {
        CORRECT: 'CORRECT',
        INCORRECT: 'INCORRECT',
        FAILURE: 'FAILURE'
      };
      
      if (flattened.problemResult() === problemResults.FAILURE) {
        // Неправильный ход -- ничего не делаем. Не делаем игрока проигравшим
        // из-за неправильного хода.
        return;
      }
      
      widget.applyBoardData(flattened);
      
      if (flattened.problemResult() === problemResults.CORRECT) {
        widget.iconBar.setCenteredTempIcon(
          'multiopen-boxonly',
          'check',
          '#0CC'
        );
        widget.correctness = problemResults.CORRECT;
        hooks.problemCorrect && hooks.problemCorrect(pt, currentPlayer);
      } else if (flattened.problemResult() === problemResults.INCORRECT) {
        widget.iconBar.destroyTempIcons();
        widget.iconBar.setCenteredTempIcon('multiopen-boxonly', 'cross', 'red');
        widget.correctness = problemResults.INCORRECT;
        hooks.problemIncorrect && hooks.problemIncorrect(pt, currentPlayer);
      }
    },

    stoneMouseover: undefined, // полагаемся на значения по умолчанию
    stoneMouseout: undefined, // полагаемся на значения по умолчанию
  };
}
