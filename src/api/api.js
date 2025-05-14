/**
 * Модуль API для библиотеки Glift.
 * Предоставляет основные методы для создания и управления виджетами.
 * 
 * @module api
 */

// Импортируем необходимые зависимости
import { Options } from './options.js';
import { WidgetManager } from '../widgets/manager.js';
import { init } from '../init.js';

/**
 * Создает и рисует экземпляр Glift.
 * Основная точка входа для библиотеки.
 *
 * @param {Object} inOptions Объект с опциями Glift (обычно определяется как литерал объекта).
 *    См. api.Options. 
 * @return {Object} Экземпляр виджета
 */
export const create = (inOptions) => {
  const manager = createNoDraw(inOptions);

  // Инициализируем библиотеку перед отрисовкой
  init(manager.displayOptions.disableZoomForMobile, manager.divId);

  // Отрисовываем виджет
  manager.draw();
  return manager;
};

/**
 * Создает менеджер виджетов без выполнения отрисовки.
 * Также имеет побочный эффект в виде пропуска кода инициализации.
 *
 * Этот метод публичный, поскольку иногда полезно создать экземпляр Glift
 * без немедленной отрисовки (например, для отложенной инициализации).
 *
 * @param {Object} inOptions Объект с опциями для Glift
 * @return {Object} Менеджер виджетов без отрисовки
 */
export const createNoDraw = (inOptions) => {
  const options = new Options(inOptions);
  return new WidgetManager(options);
};

/**
 * Примеры использования:
 * ```
 * // Простое создание доски
 * const gliftInstance = glift.create({
 *   divId: 'glift-container',
 *   sgf: 'path/to/game.sgf'
 * });
 * 
 * // Создание проблемы
 * glift.create({
 *   divId: 'problem-container',
 *   sgf: 'path/to/problem.sgf',
 *   widgetType: 'STANDARD_PROBLEM'
 * });
 * ```
 */
