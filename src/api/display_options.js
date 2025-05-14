goog.provide('glift.api.DisplayOptions');
goog.provide('glift.api.themes');

/**
 * Доступные темы оформления
 * @enum {string}
 * @const
 */
glift.api.themes = Object.freeze({
  /** Стандартная тема с обычными камнями */
  DEFAULT: 'DEFAULT',
  
  /** Камни с тенями для объемного эффекта */
  DEPTH: 'DEPTH',
  
  /** Серый фон, камни без контура */
  MOODY: 'MOODY',
  
  /** Прозрачная доска */
  TRANSPARENT: 'TRANSPARENT',
  
  /** Черно-белое оформление */
  TEXTBOOK: 'TEXTBOOK'
});

/**
 * Опции отображения для Glift.
 * Управляют визуальным отображением и поведением виджетов.
 * 
 * @api стабильный
 */
class DisplayOptions {
  /**
   * @param {!Object=} opt_o Опциональный объект с настройками отображения
   */
  constructor(opt_o = {}) {
    /**
     * Фоновое изображение доски для игры Го.
     * Можно указать абсолютный или относительный путь.
     * Как и ожидается, нельзя делать запросы к другим доменам.
     *
     * Примеры:
     *  'images/kaya.jpg'
     *  'http://www.example.com/images/kaya.jpg'
     *
     * @type {string}
     */
    this.goBoardBackground = opt_o.goBoardBackground || '';

    /**
     * Имя темы, используемой для этого экземпляра.
     * Используйте константы из glift.api.themes.
     * 
     * @type {string}
     */
    this.theme = opt_o.theme || glift.api.themes.DEFAULT;

    /**
     * Отображать ли координаты по краям доски.
     * - Слева используются цифры 1-19
     * - Снизу используются буквы A-T (все буквы кроме I)
     *
     * @type {boolean}
     */
    this.drawBoardCoords = !!opt_o.drawBoardCoords;

    /**
     * Минимальная высота, которую Glift будет использовать для отображения.
     * Фактически, заставляет содержащий div иметь как минимум эту высоту.
     * Обратите внимание, что пользователи должны указать единицы измерения.
     * Например: '500px'
     *
     * @type {string}
     */
    this.minHeight = opt_o.minHeight || '';

    /**
     * Аналогично minHeight, минимальная ширина для отображения Glift.
     * Как и с высотой, пользователи должны указать единицы измерения.
     * Например: '500px'
     *
     * @type {string}
     */
    this.minWidth = opt_o.minWidth || '';

    /**
     * Проценты разделения для одноколоночного формата виджета.
     * Определяет пропорции для различных компонентов интерфейса.
     *
     * @type {!Object}
     */
    this.oneColumnSplits = opt_o.oneColumnSplits || {
      first: [
        { component: 'STATUS_BAR', ratio: 0.06 },
        { component: 'BOARD', ratio: 0.67 },
        { component: 'COMMENT_BOX', ratio: 0.18 },
        { component: 'ICONBAR', ratio: 0.09 },
      ],
    };

    /**
     * Проценты разделения для двухколоночного формата виджета.
     *
     * @type {!Object}
     */
    this.twoColumnSplits = opt_o.twoColumnSplits || {
      first: [{ component: 'BOARD', ratio: 1 }],
      second: [
        { component: 'STATUS_BAR', ratio: 0.07 },
        { component: 'COMMENT_BOX', ratio: 0.83 },
        { component: 'ICONBAR', ratio: 0.1 },
      ],
    };

    /**
     * Иконка для перехода к предыдущему SGF.
     * @type {string}
     */
    this.previousSgfIcon = opt_o.previousSgfIcon || 'chevron-left';

    /**
     * Иконка для перехода к следующему SGF.
     * @type {string}
     */
    this.nextSgfIcon = opt_o.nextSgfIcon || 'chevron-right';

    /**
     * Отключить масштабирование для мобильных пользователей.
     * Удобно для предотвращения случайного масштабирования.
     * 
     * @type {boolean}
     */
    this.disableZoomForMobile = !!opt_o.disableZoomForMobile;

    /**
     * Включить ли сочетания клавиш.
     * Обратите внимание, что в настоящее время это привязывает события
     * нажатия клавиш к document.body, поэтому возможен конфликт
     * с сочетаниями клавиш других приложений.
     * По умолчанию включено.
     * 
     * @type {boolean}
     */
    this.enableKeyboardShortcuts = opt_o.enableKeyboardShortcuts !== undefined
      ? !!opt_o.enableKeyboardShortcuts
      : true;

    /**
     * Использовать Markdown для комментариев.
     * Это требует, чтобы marked.js был установлен в глобальной области.
     * (https://github.com/chjj/marked)
     * 
     * @type {boolean}
     */
    this.useMarkdown = !!opt_o.useMarkdown;
  }
}

// Присваиваем класс к пространству имен
glift.api.DisplayOptions = DisplayOptions;
