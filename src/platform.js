goog.provide('glift.platform');

goog.require('glift');

/**
 * Утилиты для определения платформы и проверки поддержки функций браузера.
 * @namespace
 */
glift.platform = {
  /**
   * Регулярные выражения для определения мобильных платформ
   * @private {Object<string, RegExp>}
   */
  _platformRegexes: Object.freeze({
    ios: /iPhone|iPad|iPod/i,
    android: /Android/i,
    winPhone: /Windows Phone/i
  }),
  
  /**
   * Проверяет, работает ли устройство под управлением iOS.
   * @return {boolean} true, если устройство работает под iOS
   */
  isIOS: () => glift.platform._platformRegexes.ios.test(navigator.userAgent),

  /**
   * Проверяет, работает ли устройство под управлением Android.
   * @return {boolean} true, если устройство работает под Android
   */
  isAndroid: () => glift.platform._platformRegexes.android.test(navigator.userAgent),

  /**
   * Проверяет, работает ли устройство под управлением Windows Phone.
   * @return {boolean} true, если устройство работает под Windows Phone
   */
  isWinPhone: () => glift.platform._platformRegexes.winPhone.test(navigator.userAgent),

  /**
   * Проверяет, используется ли страница на мобильном устройстве.
   * @return {boolean} true, если страница просматривается в мобильном браузере
   */
  isMobile() {
    if (this._isMobileCache !== undefined) {
      return this._isMobileCache;
    }
    
    // Современный подход к определению мобильных устройств:
    // 1. Проверка User-Agent
    const uaResult = this.isAndroid() || this.isIOS() || this.isWinPhone();
    
    // 2. Проверка размера окна (дополнительно)
    const smallScreen = window.innerWidth <= 768 || window.innerHeight <= 768;
    
    // Сохраняем результат в кеше
    this._isMobileCache = uaResult || (smallScreen && 'ontouchstart' in window);
    return this._isMobileCache;
  },

  /** @private {boolean|undefined} Кеш для результата isMobile() */
  _isMobileCache: undefined,
  
  /** @private {boolean|null} Кеш для поддержки SVG */
  _supportsSvg: null,

  /**
   * Проверяет, поддерживает ли браузер SVG (и, следовательно, Glift).
   * @return {boolean} true, если браузер поддерживает SVG
   */
  supportsSvg() {
    if (this._supportsSvg !== null) {
      return this._supportsSvg;
    }
    
    // Современный способ проверки поддержки SVG
    try {
      // Проверка через document.implementation
      const hasFeature = document.implementation.hasFeature(
        'http://www.w3.org/TR/SVG11/feature#Image',
        '1.1'
      );
      
      // Дополнительная проверка через создание элемента
      const testSvg = !!document.createElementNS && 
                     document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect;
                     
      this._supportsSvg = hasFeature || testSvg;
    } catch (e) {
      this._supportsSvg = false;
    }
    
    return this._supportsSvg;
  },
  
  /**
   * Сбрасывает все кешированные значения. Полезно для тестирования.
   * @return {void}
   */
  resetCache() {
    this._isMobileCache = undefined;
    this._supportsSvg = null;
  }
};
