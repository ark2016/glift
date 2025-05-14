/**
 * Модуль опций отображения для библиотеки Glift.
 * @module api/display_options
 */

/**
 * Доступные темы оформления
 * @enum {string}
 */
export const themes = Object.freeze({
  /** Стандартная тема с обычными камнями */
  DEFAULT: 'DEFAULT',
  
  /** Тема с объемными эффектами теней и глубины */
  DEPTH: 'DEPTH',
  
  /** Тема с темным фоном и насыщенными цветами */
  MOODY: 'MOODY',
  
  /** Тема с прозрачным фоном, подходит для наложения на другие элементы */
  TRANSPARENT: 'TRANSPARENT',
  
  /** Тема в стиле учебника игры Го */
  TEXTBOOK: 'TEXTBOOK'
});

/**
 * Класс опций отображения.
 * Управляет визуальными параметрами отображения Go-доски и элементов интерфейса.
 */
export class DisplayOptions {
  /**
   * @param {!Object=} opt_o Опциональные параметры
   */
  constructor(opt_o = {}) {
    /**
     * Тема для отображения.
     * @type {string}
     */
    this.theme = opt_o.theme || themes.DEFAULT;

    /**
     * Сгущение линий по краям доски. Создает эффект перспективы.
     * @type {boolean}
     */
    this.goBoardBackground = opt_o.goBoardBackground === undefined ? 
        true : !!opt_o.goBoardBackground;

    /**
     * Активировать отображение координат доски.
     * @type {boolean}
     */
    this.drawBoardCoords = !!opt_o.drawBoardCoords;

    /**
     * Минимальный размер (высота/ширина) для доски Го, в пикселях.
     * @type {number}
     */
    this.boardRegionSizeHint = opt_o.boardRegionSizeHint || 0;

    /**
     * Размер камней. По умолчанию - 1 (стандартный размер).
     * @type {number}
     */
    this.stoneSize = opt_o.stoneSize || 1;

    /**
     * Соотношение линий к размеру камней. По умолчанию 0.3.
     * @type {number}
     */
    this.lineWidth = opt_o.lineWidth || 0.3;

    /**
     * Использовать ли растровые камни вместо векторных.
     * @type {boolean}
     */
    this.useRasterStones = !!opt_o.useRasterStones;

    /**
     * Эффект смещения тени для добавления глубины.
     * @type {boolean}
     */
    this.shadowOn = opt_o.shadowOn === undefined ? true : !!opt_o.shadowOn;

    /**
     * Активировать эффект блика на камнях.
     * @type {boolean}
     */
    this.stoneReflectionOn = opt_o.stoneReflectionOn === undefined ?
        true : !!opt_o.stoneReflectionOn;

    /**
     * Версия для печати. Убирает цвета фона и тени.
     * @type {boolean}
     */
    this.printingMode = !!opt_o.printingMode;

    /**
     * Размер звездных точек относительно размера камней. По умолчанию 0.15.
     * @type {number}
     */
    this.starPointSize = opt_o.starPointSize || 0.15;

    /**
     * Соотношение размера меток (буквы, числа) к размеру камней.
     * @type {number}
     */
    this.labelFontRatio = opt_o.labelFontRatio || 0.85;

    /**
     * Включить использование шрифта Montserrat для текста.
     * @type {boolean}
     */
    this.useMontserratFont = opt_o.useMontserratFont === undefined ? 
        true : !!opt_o.useMontserratFont;

    /**
     * Размер внутреннего отступа для видимой области.
     * @type {number}
     */
    this.viewportPadding = opt_o.viewportPadding !== undefined ? 
        opt_o.viewportPadding : 5;

    /**
     * Отображать номера ходов вместо букв А-Z на камнях метки.
     * @type {boolean}
     */
    this.useMarkPts = !!opt_o.useMarkPts;

    /**
     * Использовать ли разметку Markdown для комментариев.
     * @type {boolean}
     */
    this.useMarkdown = !!opt_o.useMarkdown;
  }
}
