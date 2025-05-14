/**
 * @fileoverview Основные определения опций виджетов.
 * Этот файл оставлен для обратной совместимости.
 * Рекомендуется использовать импорты из index.js.
 */

import { widgetopt, WidgetOptFunc } from './index.js';

// Экспортируем для обратной совместимости
export { widgetopt, WidgetOptFunc };

/**
 * @typedef {function():glift.api.WidgetTypeOptions}
 */
// glift.api.WidgetOptFunc;

/**
 * A collection of widget options keyed by widget types.
 *
 * @type {!Object<glift.WidgetType, glift.api.WidgetOptFunc>}
 */
glift.api.widgetopt = {};
