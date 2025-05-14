/**
 * Дополнительные опции для виджета с проблемами с несколькими правильными вариациями.
 * @module api/widgetopt/correct_variations_problem
 */

/**
 * Возвращает опции для виджета проблем с несколькими правильными вариациями.
 * @return {Object} Объект с опциями виджета
 */
export function correctVariationsProblemOptions() {
  return {
    markLastMove: undefined, // полагаемся на значения по умолчанию
    keyMappings: undefined, // полагаемся на значения по умолчанию
    enableMousewheel: undefined, // полагаемся на значения по умолчанию (false)

    problemConditions: undefined, // полагаемся на значения по умолчанию

    controllerFunc: null, // будет заменено на staticProblem при подключении контроллеров

    icons: ['refresh', 'problem-explanation', 'multiopen-boxonly'],

    showVariations: null, // будет заменено на NEVER при использовании перечислений

    statusBarIcons: ['fullscreen'],

    /**
     * Обработчик клика по камню на доске
     * @param {Event} event - Событие клика
     * @param {Object} widget - Объект виджета
     * @param {Object} pt - Точка на доске
     */
    stoneClick: function (event, widget, pt) {
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
      
      const hooks = widget.hooks();
      widget.applyBoardData(flattened);

      if (widget.correctness === undefined) {
        if (flattened.problemResult() === problemResults.CORRECT) {
          widget.iconBar.destroyTempIcons();
          if (widget.correctNextSet[pt.toString()] === undefined) {
            widget.correctNextSet[pt.toString()] = true;
            widget.numCorrectAnswers++;
            if (widget.numCorrectAnswers === widget.totalCorrectAnswers) {
              widget.correctness = problemResults.CORRECT;
              widget.iconBar.addTempText(
                'multiopen-boxonly',
                widget.numCorrectAnswers + '/' + widget.totalCorrectAnswers,
                { fill: '#0CC', stroke: '#0CC' }
              );
              hooks.problemCorrect && hooks.problemCorrect();
            } else {
              widget.iconBar.addTempText(
                'multiopen-boxonly',
                widget.numCorrectAnswers + '/' + widget.totalCorrectAnswers,
                { fill: '#000', stroke: '#000' }
              );
              setTimeout(function () {
                widget.controller.initialize();
                widget.applyBoardData(widget.controller.flattenedState());
              }, widget.sgfOptions.correctVariationsResetTime);
            }
          }
        } else if (flattened.problemResult() === problemResults.INCORRECT) {
          widget.iconBar.destroyTempIcons();
          widget.iconBar.setCenteredTempIcon(
            'multiopen-boxonly',
            'cross',
            'red'
          );
          widget.iconBar.clearTempText('multiopen-boxonly');
          widget.correctness = problemResults.INCORRECT;
          hooks.problemIncorrect && hooks.problemIncorrect();
        }
      }
    },

    stoneMouseover: undefined, // полагаемся на значения по умолчанию
    stoneMouseout: undefined, // полагаемся на значения по умолчанию
  };
}
