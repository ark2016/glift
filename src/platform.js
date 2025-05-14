/**
 * Утилиты для определения платформы и проверки поддержки функций браузера.
 * @module platform
 */

/**
 * Регулярные выражения для определения мобильных платформ
 * @private {Object<string, RegExp>}
 */
const _platformRegexes = Object.freeze({
  ios: /iPhone|iPad|iPod/i,
  android: /Android/i,
  winPhone: /Windows Phone/i
});

/** @private {boolean|undefined} Кеш для результата isMobile() */
let _isMobileCache = undefined;

/** @private {boolean|null} Кеш для поддержки SVG */
let _supportsSvg = null;

/**
 * Проверяет, работает ли устройство под управлением iOS.
 * @return {boolean} true, если устройство работает под iOS
 */
export const isIOS = () => _platformRegexes.ios.test(navigator.userAgent);

/**
 * Проверяет, работает ли устройство под управлением Android.
 * @return {boolean} true, если устройство работает под Android
 */
export const isAndroid = () => _platformRegexes.android.test(navigator.userAgent);

/**
 * Проверяет, работает ли устройство под управлением Windows Phone.
 * @return {boolean} true, если устройство работает под Windows Phone
 */
export const isWinPhone = () => _platformRegexes.winPhone.test(navigator.userAgent);

/**
 * Проверяет, используется ли страница на мобильном устройстве.
 * @return {boolean} true, если страница просматривается в мобильном браузере
 */
export function isMobile() {
  if (_isMobileCache !== undefined) {
    return _isMobileCache;
  }
  
  // Современный подход к определению мобильных устройств:
  // 1. Проверка User-Agent
  const uaResult = isAndroid() || isIOS() || isWinPhone();
  
  // 2. Проверка размера окна (дополнительно)
  const smallScreen = window.innerWidth <= 768 || window.innerHeight <= 768;
  
  // Сохраняем результат в кеше
  _isMobileCache = uaResult || (smallScreen && 'ontouchstart' in window);
  return _isMobileCache;
}

/**
 * Проверяет, поддерживает ли браузер SVG (и, следовательно, Glift).
 * @return {boolean} true, если браузер поддерживает SVG
 */
export function supportsSvg() {
  if (_supportsSvg !== null) {
    return _supportsSvg;
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
                   
    _supportsSvg = hasFeature || testSvg;
  } catch (e) {
    _supportsSvg = false;
  }
  
  return _supportsSvg;
}

/**
 * Сбрасывает все кешированные значения. Полезно для тестирования.
 * @return {void}
 */
export function resetCache() {
  _isMobileCache = undefined;
  _supportsSvg = null;
}

/**
 * Все экспортируемые функции платформы
 */
export const platform = {
  isIOS,
  isAndroid,
  isWinPhone,
  isMobile,
  supportsSvg,
  resetCache
};
