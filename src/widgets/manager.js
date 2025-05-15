/**
 * Класс для управления виджетами Glift.
 * 
 * @module widgets/manager
 */

import { BaseWidget } from './base_widget.js';
import { idGenerator } from './id_generator.js';
import * as ajax from '../ajax/index.js';
import * as global from '../global.js';
import { SgfOptions } from '../api/sgf_options.js';
import * as util from '../util/index.js';
import * as dom from '../dom/index.js';

/**
 * Менеджер виджетов управляет состоянием виджетов. Когда виджеты создаются,
 * они всегда создаются в контексте менеджера виджетов.
 */
export class WidgetManager {
  /**
   * @param {Object} options Опции для создания менеджера виджетов
   */
  constructor(options) {
    /**
     * Глобально уникальный ID, уникальный для всех экземпляров Glift на странице.
     * @type {string}
     */
    this.id = options.divId + '-glift-' + idGenerator.next();

    // Регистрируем экземпляр
    global.instanceRegistry[this.id] = this;

    // Устанавливаем как активный, если активный экземпляр еще не установлен
    !global.activeInstanceId && this.setActive();

    /**
     * Исходный div id.
     * @type {string}
     */
    this.divId = options.divId;

    /**
     * ID div для полноэкранного режима.
     * @type {string|null}
     */
    this.fullscreenDivId = null;
    
    /**
     * Позиция прокрутки страницы перед переходом в полноэкранный режим.
     * @type {number|null}
     */
    this.prevScrollTop = null;
    
    /**
     * Если мы установили обработчик изменения размера окна, сохраняем старый обработчик.
     * @type {Function|null}
     */
    this.oldWindowResize = null;

    /**
     * Коллекция SGF файлов.
     * @type {Array<Object|string>}
     */
    this.sgfCollection = [];

    /**
     * URL для получения всей коллекции SGF.
     * @type {string|null}
     */
    this.sgfCollectionUrl = null;

    // Инициализируем коллекцию SGF
    this._initSgfCollection(options);

    /**
     * Кэш SGF. Полезно для уменьшения количества AJAX запросов.
     * Карта от имени SGF к содержимому строки.
     * @type {Object<string, string>}
     */
    this.sgfCache = options.sgfMapping || {};

    /**
     * Индекс в коллекции SGF.
     * @type {number}
     */
    this.sgfColIndex = options.initialIndex || 0;

    /** 
     * Разрешить циклический переход при навигации по коллекции.
     * @type {boolean} 
     */
    this.allowWrapAround = !!options.allowWrapAround;

    /**
     * Шаблон настроек SGF по умолчанию.
     * @type {Object}
     */
    this.sgfDefaults = options.sgfDefaults || {};
    
    /**
     * Опции отображения
     * @type {Object}
     */
    this.displayOptions = options.display || {};

    /**
     * Действия для иконок
     * @type {Object}
     */
    this.iconActions = options.iconActions || {};

    /**
     * Действия для камней
     * @type {Object}
     */
    this.stoneActions = options.stoneActions || {};

    /**
     * Загружать ли SGF в фоновом режиме.
     * @type {boolean}
     */
    this.loadColInBack = options.loadCollectionInBackground !== undefined ? 
      options.loadCollectionInBackground : true;
    
    /**
     * Было ли начато фоновое загрузка.
     * @type {boolean}
     */
    this.initBackgroundLoading = false;

    /**
     * Основной рабочий механизм: базовый виджет Glift.
     * @type {BaseWidget|undefined}
     */
    this.currentWidget = undefined;
    
    /**
     * Временный виджет для особых случаев.
     * @type {BaseWidget|undefined}
     */
    this.temporaryWidget = undefined;

    /**
     * Глобальные метаданные для этого экземпляра менеджера.
     * @type {Object|undefined}
     */
    this.metadata = options.metadata;

    /**
     * Внешние хуки, предоставленные пользователями.
     * @type {Object}
     */
    this.hooks = options.hooks || {};
  }

  /**
   * Создает экземпляр BaseWidget и вызывает метод draw на базовом виджете.
   * @return {WidgetManager} Объект менеджера.
   */
  draw() {
    const afterCollectionLoad = () => {
      if (!this.initBackgroundLoading && this.loadColInBack) {
        // Начинаем фоновую загрузку только один раз
        this.initBackgroundLoading = true;
        this._backgroundLoad();
      }
      const curObj = this.getCurrentSgfObj();
      this._loadSgfString(
        curObj,
        (sgfObj) => {
          // Предотвращаем мерцание, уничтожая виджет после загрузки SGF
          this.destroy();
          this.currentWidget = this.createWidget(sgfObj).draw();
        }
      );
    };

    if (this.sgfCollection.length === 0 && this.sgfCollectionUrl) {
      ajax.get(
        this.sgfCollectionUrl,
        (data) => {
          this.sgfCollection = JSON.parse(data);
          afterCollectionLoad();
        }
      );
    } else {
      afterCollectionLoad();
    }
    return this;
  }

  /**
   * Перерисовывает текущий виджет.
   */
  redraw() {
    const widget = this.getCurrentWidget();
    if (widget) {
      widget.redraw();
    }
  }

  /**
   * Устанавливает как активный виджет в глобальном реестре.
   */
  setActive() {
    global.activeInstanceId = this.id;
  }

  /**
   * Получает текущий (активный) объект виджета или undefined, если виджет не был создан.
   * @return {BaseWidget|undefined}
   */
  getCurrentWidget() {
    if (this.temporaryWidget) {
      return this.temporaryWidget;
    } else {
      return this.currentWidget;
    }
  }

  /**
   * Инициализирует коллекцию SGF / URL коллекции
   * @param {Object} options Входные опции.
   * @private
   */
  _initSgfCollection(options) {
    // Обрабатываем явно определенные массивы коллекций
    if (util.typeOf(options.sgfCollection) === 'array') {
      const coll = options.sgfCollection;
      for (let i = 0; i < coll.length; i++) {
        this.sgfCollection.push(coll[i]);
      }
      if (options.sgf && options.sgfCollection.length > 0) {
        throw new Error(
          'Illegal options configuration: you cannot define both ' +
            'sgf and sgfCollection'
        );
      } else if (options.sgf && options.sgfCollection.length === 0) {
        // Перемещаем одиночный SGF в коллекцию SGF
        this.sgfCollection.push(options.sgf);
      } else if (!options.sgf && this.sgfCollection.length === 0) {
        // Позволяем возможность не указывать SGF для пустого SGF
        this.sgfCollection = [{}];
      }
    } else if (util.typeOf(options.sgfCollection) === 'string') {
      // Если это строка, мы предполагаем, что коллекция SGF должна быть загружена через AJAX
      this.sgfCollectionUrl = options.sgfCollection;
    }
  }

  /**
   * Gets the current SGF Object from the SGF collection.
   */
  getCurrentSgfObj() {
    return this.getSgfObj(this.sgfColIndex);
  }

  /** @return {boolean} Whether there's a 'next' sgf */
  hasNextSgf() {
    if (
      this.sgfCollection.length &&
      this.sgfColIndex >= 0 &&
      this.sgfColIndex < this.sgfCollection.length - 1
    ) {
      return true;
    } else if (
      this.sgfCollection.length &&
      this.sgfColIndex === this.sgfCollection.length - 1 &&
      this.allowWrapAround
    ) {
      return true;
    } else {
      return false;
    }
  }

  /** @return {boolean} Whether there's a previous sgf */
  hasPrevSgf() {
    if (
      this.sgfCollection.length &&
      this.sgfColIndex > 0 &&
      this.sgfColIndex <= this.sgfCollection.length - 1
    ) {
      return true;
    } else if (
      this.sgfCollection.length &&
      this.sgfColIndex === 0 &&
      this.allowWrapAround
    ) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Get the current SGF Object from the sgfCollection. Note: If the item in the
   * array is a string, then we try to figure out whether we're looking at an
   * SGF or a URL and then we manufacture a simple sgf object.
   *
   * @return {!glift.api.SgfOptions}
   */
  getSgfObj(index) {
    if (index < 0 || index > this.sgfCollection.length) {
      throw new Error(
        'Index [' +
          index +
          ' ] out of bounds.' +
          ' List size was ' +
          this.sgfCollection.length
      );
    }
    var curSgfObj = this.sgfCollection[index];
    var toProc;
    if (util.typeOf(curSgfObj) === 'string') {
      var str = curSgfObj;
      var out = {};
      if (/^\s*\(;/.test(str)) {
        // We assume that this is a standard SGF String.
        out.sgfString = str;
      } else {
        // Assume a URL.
        out.url = str;
      }
      toProc = out;
    } else {
      toProc = curSgfObj;
    }
    return this.sgfDefaults.createSgfObj(toProc);
  }

  /**
   * Gets the SGF Object loaded with the SGF string. Since these can be loaded
   * with an XHR request, the data needs to be returned with a callback.
   *
   * @param {!glift.api.SgfOptions} sgfObj
   * @param {!function(glift.api.SgfOptions)} callback
   * @private
   */
  _loadSgfString(sgfObj, onSuccess) {
    var toProc;
    if (sgfObj.alias && this.sgfCache[sgfObj.alias]) {
      toProc = util.simpleClone(sgfObj);
      toProc.sgfString = this.sgfCache[sgfObj.alias];
      onSuccess(toProc);
    } else if (sgfObj.url && this.sgfCache[sgfObj.url]) {
      toProc = util.simpleClone(sgfObj);
      toProc.sgfString = this.sgfCache[sgfObj.url];
      onSuccess(toProc);
    } else if (sgfObj.url) {
      this.loadSgfWithAjax(sgfObj.url, sgfObj, onSuccess);
    } else {
      toProc = util.simpleClone(sgfObj);
      if (toProc.alias && toProc.sgfString) {
        this.sgfCache[toProc.alias] = toProc.sgfString;
      }
      onSuccess(toProc);
    }
  }

  /**
   * Like the above function, but doesn't do XHR -- returns the input SGF object
   * if no SGF exists in the sgf cache. Convenient for contexts where you are
   * certain that the SGF has already been loaded.
   *
   * As a historical note, this was created for GPub, which has an interesting
   * usecase where all SGFs are guaranteed to be in the cache.
   *
   * @param {!glift.api.SgfOptions} sgfObj
   * @return {!glift.api.SgfOptions} Now we ensure that the SGF object has the
   *    sgf finished.
   * @export
   */
  loadSgfStringSync(sgfObj) {
    var alias = sgfObj.alias;
    var url = sgfObj.url;
    if (alias && this.sgfCache[alias]) {
      // First, check the cache for aliases.
      sgfObj.sgfString = this.sgfCache[alias];
      return sgfObj;
    } else if (url && this.sgfCache[url]) {
      // Next, check the cache for urls.
      sgfObj.sgfString = this.sgfCache[url];
      return sgfObj;
    } else {
      return sgfObj;
    }
  }

  /**
   * Get the currentDivId. This is only interesting because it's possible for
   * the current div ID to be the fullscreened div id.
   * @return {string}
   */
  getDivId() {
    if (this.fullscreenDivId) {
      return this.fullscreenDivId;
    } else {
      return this.divId;
    }
  }

  /**
   * Create a Sgf Widget that actually does the work of fitting together the
   * board and icons.
   * @param {!glift.api.SgfOptions} sgfObj
   * @return {!glift.widgets.BaseWidget} The construct widget. Note: at this
   *    point, the widget has not yet been 'drawn'.
   * @export
   */
  createWidget(sgfObj) {
    // Создаем объект опций для BaseWidget
    const options = {
      divId: this.getDivId(),
      sgf: sgfObj.sgfString,
      sgfDefaults: sgfObj,
      display: this.displayOptions,
      stoneActions: this.stoneActions,
      iconActions: this.iconActions,
      hooks: this.hooks,
      widgetType: sgfObj.widgetType
    };
    
    return new BaseWidget(options);
  }

  /**
   * Temporarily replace the current widget with another widget. Used in the
   * case of the problem viewer. The use case is that it's often useful to, once
   * you want to see an answer, you jump to a separate game viewer widget.
   * @param {!glift.api.SgfOptions} sgfObj
   */
  createTemporaryWidget(sgfObj) {
    this.currentWidget && this.currentWidget.destroy();
    var obj = this.sgfDefaults.createSgfObj(sgfObj);
    this.temporaryWidget = this.createWidget(obj).draw();
  }

  /**
   * Returns from the temporary widget to the original widget.
   */
  returnToOriginalWidget() {
    this.temporaryWidget && this.temporaryWidget.destroy();
    this.temporaryWidget = undefined;
    this.currentWidget.draw();
  }

  /**
   * Internal implementation of nextSgf/previous sgf.
   * @param {number} indexChange
   * @private
   */
  nextSgfInternal_(indexChange) {
    if (!this.sgfCollection.length > 1) {
      return; // Nothing to do
    }
    if (this.allowWrapAround) {
      this.sgfColIndex =
        (this.sgfColIndex + indexChange + this.sgfCollection.length) %
        this.sgfCollection.length;
    } else {
      this.sgfColIndex = this.sgfColIndex + indexChange;
      if (this.sgfColIndex < 0) {
        this.sgfColIndex = 0;
      } else if (this.sgfColIndex >= this.sgfCollection.length) {
        this.sgfColIndex = this.sgfCollection.length - 1;
      }
    }
    this.draw();
  }

  /**
   * Load the next SGF. Requires that the collection list be non-empty. Note
   * that this returns nothing since it simply changes which SGF is 'active' and
   * then redraws the widget.
   * @export
   */
  nextSgf() {
    this.nextSgfInternal_(1);
  }

  /**
   * Very similar to nextSgf. Load the previous SGF.
   * @export
   */
  prevSgf() {
    this.nextSgfInternal_(-1);
  }

  /**
   * Load a urlOrObject with AJAX.  If the urlOrObject is an object, then we
   * assume that the caller is trying to set some objects in the widget.
   * @param {string} url
   * @param {!glift.api.SgfOptions} sgfObj
   * @param {!function(glift.api.SgfOptions)} callback For when the ajax request
   *    completes.
   */
  loadSgfWithAjax(url, sgfObj, callback) {
    ajax.get(
      url,
      (data) => {
        this.sgfCache[url] = data;
        sgfObj.sgfString = data;
        callback(sgfObj);
      }
    );
  }

  /**
   * Load the SGFs in the background.  Try once every 250ms until we get to the
   * end of the SGF collection.
   * @private
   */
  _backgroundLoad() {
    var loader = function (idx) {
      if (idx < this.sgfCollection.length) {
        var curObj = this.getSgfObj(idx);
        this._loadSgfString(curObj, function () {
          setTimeout(function () {
            loader(idx + 1);
          }, 250); // 250ms
        });
      }
    }.bind(this);
    loader(this.sgfColIndex + 1);
  }

  /**
   * Whether or not the widget is currently fullscreened.
   * @return {boolean}
   * @export
   */
  isFullscreen() {
    return !!this.fullscreenDivId;
  }

  /**
   * Enable auto-resizing of the glift instance, but only in the case that the
   * widget is already fullscreened. This is not meant generally as an API, but
   * is public since it's called from statusbar/fullscreen.js
   *
   * Note: this isn't generally meant as an API since because currently,
   * this only works for one Glift instance, since it binds event function to
   * window.onresize.
   * @export
   */
  enableFullscreenAutoResize() {
    // It might be tempting to write check if we're fullscreened, but currently
    // the enableFullscreenAutoResize is called after widget destruction.
    if (window.onresize) {
      this.oldWindowResize = window.onresize;
    }
    window.onresize = function () {
      this.redraw();
    }.bind(this);
  }

  /**
   * Disable auto-resizing of the glift instance. Called from the status bar.
   * @export
   */
  disableFullscreenAutoResize() {
    window.onresize = this.oldWindowResize;
    this.oldWindowResize = null;
  }

  /**
   * Удаляет текущий виджет и освобождает ресурсы.
   * @return {WidgetManager} this
   */
  destroy() {
    if (this.currentWidget) {
      this.currentWidget.destroy();
      this.currentWidget = undefined;
    }
    if (this.temporaryWidget) {
      this.temporaryWidget.destroy();
      this.temporaryWidget = undefined;
    }
    return this;
  }
}
