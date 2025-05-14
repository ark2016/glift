/**
 * Модуль статусбара для библиотеки Glift.
 * @module displays/statusbar/statusbar
 */

/**
 * Опции для создания статусбара.
 * 
 * @typedef {Object} StatusBarOptions
 * @property {Object} iconBarPrototype - Прототип панели иконок
 * @property {Object} theme - Тема оформления
 * @property {Object} widget - Виджет
 * @property {Object} allPositioning - Позиционирование всех элементов
 */

/**
 * Создает статусбар. Также выполняет предварительную обработку опций, если необходимо.
 *
 * @param {StatusBarOptions} options Опции для создания статусбара
 * @return {StatusBar} Экземпляр статусбара
 */
export function createStatusBar(options) {
  return new StatusBar(
    options.iconBarPrototype,
    options.theme,
    options.widget,
    options.allPositioning
  );
}

/**
 * Компонент статусбара. Отображается в верхней части Glift и используется для
 * отображения информации об игре, такой как номер хода, настройки и информация об игре.
 */
export class StatusBar {
  /**
   * @param {Object} iconBarPrototype Прототип панели иконок
   * @param {Object} theme Тема оформления
   * @param {Object} widget Виджет
   * @param {Object} positioning Позиционирование
   */
  constructor(iconBarPrototype, theme, widget, positioning) {
    this.iconBar = iconBarPrototype;
    this.theme = theme;
    // TODO(kashomon): Реструктурировать так, чтобы статусбар не зависел от объекта виджета
    this.widget = widget;

    // Ограничивающие прямоугольники для всех компонентов.
    this.positioning = positioning;

    // TODO(kashomon): Не зависеть от данных менеджера.
    this.totalPages = widget.manager.sgfCollection.length;
    this.pageIndex = widget.manager.sgfColIndex + 1;
  }

  /**
   * Рисует статусбар.
   * @return {StatusBar} this
   */
  draw() {
    this.iconBar.draw();
    this.setPageNumber(this.pageIndex, this.totalPages);
    return this;
  }

  /**
   * Устанавливает номер хода для текущего хода.
   * @param {number} number Номер хода
   * @return {StatusBar} this
   */
  setMoveNumber(number) {
    // TODO(kashomon): Примечание: Это жестко кодирует имя индикатора хода.
    if (!this.iconBar.hasIcon('move-indicator')) {
      return this;
    }
    const num = (number || '0') + ''; // Принудительно строка.
    const color = this.theme.statusBar.icons.DEFAULT.fill;
    // var mod = num.length > 2 ? 0.35 : null;
    this.iconBar.addTempText(
      'move-indicator',
      num,
      { fill: color, stroke: color },
      null /* модификатор размера, как float */
    );
    return this;
  }

  /**
   * Устанавливает номер страницы для текущего хода.
   * @param {number} number Номер страницы
   * @param {number} denominator Знаменатель (общее количество страниц)
   * @return {StatusBar} this
   */
  setPageNumber(number, denominator) {
    if (!this.iconBar.hasIcon('widget-page')) {
      return this;
    }
    const num = (number || '0') + ''; // Принудительно строка.
    const color = this.theme.statusBar.icons.DEFAULT.fill;
    this.iconBar.addTempText(
      'widget-page',
      num,
      { fill: color, stroke: color },
      0.85
    );
    return this;
  }
}
