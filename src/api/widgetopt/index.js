/**
 * Модуль с опциями виджетов для различных типов виджетов.
 * @module api/widgetopt
 */

import { WIDGET_TYPE } from '../../widget_type.js';

/**
 * @typedef {function():Object} WidgetOptFunc
 * Функция, возвращающая опции виджета определенного типа.
 */

/**
 * Коллекция опций виджетов по типам виджетов.
 * @type {!Object<string, WidgetOptFunc>}
 */
const widgetopt = {};

// Импортируем все типы опций
import { boardEditorOptions } from './board_editor.js';
import { correctVariationsProblemOptions } from './correct_variations_problem.js';
import { exampleOptions } from './example_options.js';
import { gameViewerOptions } from './game_viewer.js';
import { reducedGameViewerOptions } from './reduced_game_viewer.js';
import { standardProblemOptions } from './standard_problem.js';

// Регистрируем все типы опций
widgetopt[WIDGET_TYPE.BOARD_EDITOR] = boardEditorOptions;
widgetopt[WIDGET_TYPE.CORRECT_VARIATIONS_PROBLEM] = correctVariationsProblemOptions;
widgetopt[WIDGET_TYPE.EXAMPLE] = exampleOptions;
widgetopt[WIDGET_TYPE.GAME_VIEWER] = gameViewerOptions;
widgetopt[WIDGET_TYPE.REDUCED_GAME_VIEWER] = reducedGameViewerOptions;
widgetopt[WIDGET_TYPE.STANDARD_PROBLEM] = standardProblemOptions;

export { widgetopt, WidgetOptFunc }; 