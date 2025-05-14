/**
 * Модуль контроллеров обеспечивает логический слой (мозг) виджетов доски Го.
 * 
 * Контроллеры абстрагируют сложность работы напрямую с правилами и деревом ходов.
 * Можно использовать movetree и rules напрямую, но контроллеры предоставляют 
 * более простой API для выполнения общих операций. Это разделение также упрощает
 * тестирование логики независимо от изменений UI.
 * 
 * @module controllers
 */

/**
 * Интерфейс для всех контроллеров.
 * @interface
 */
export class Controller {
  /**
   * Инициализирует контроллер.
   * @return {!Controller}
   */
  initialize() {}
  
  /**
   * Обновляет отображение игровой доски.
   * @return {!Controller}
   */
  updateBoard() {}
  
  /**
   * Обрабатывает клик на точку доски.
   * @param {!Object} pt - Точка на доске
   * @return {boolean} Успешность обработки
   */
  handleClick(pt) {}
}

/**
 * Типы контроллеров
 * @enum {string}
 * @readonly
 */
export const CONTROLLER_TYPE = Object.freeze({
  /** Базовый контроллер */
  BASE: 'BASE',
  /** Просмотрщик игр */
  GAME_VIEWER: 'GAME_VIEWER',
  /** Редактор доски */
  BOARD_EDITOR: 'BOARD_EDITOR',
  /** Статическая задача */
  STATIC_PROBLEM: 'STATIC_PROBLEM'
});
