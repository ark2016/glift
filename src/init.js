/**
 * Инициализация Glift UI при создании.
 * Выполняет следующие операции:
 * - Проверка совместимости (поддержка SVG)
 * - Отключение масштабирования на мобильных устройствах (если указан параметр)
 * - Добавление необходимых CSS классов
 * 
 * @param {boolean} disableZoomForMobile Отключить масштабирование на мобильных устройствах
 * @param {string} divId ID элемента DOM для отображения ошибок
 * @throws {Error} Если браузер не поддерживает SVG или произошла другая ошибка
 */
glift.init = (disableZoomForMobile, divId) => {
  // Проверяем совместимость
  _checkCompatibility(divId);
  
  // Отключаем масштабирование для мобильных устройств
  if (disableZoomForMobile) {
    _disableMobileZoom();
  }
  
  // Добавляем необходимые CSS классы
  _addCssClasses();
};

/**
 * Проверяет совместимость браузера с Glift (поддержка SVG)
 * @param {string} divId ID элемента для отображения ошибки
 * @private
 */
const _checkCompatibility = (divId) => {
  if (!glift.platform.supportsSvg()) {
    const errorMessage =
      'Ваш браузер не поддерживает Glift, этот просмотрщик игры Го, ' +
      'из-за отсутствия поддержки SVG. ' +
      'Пожалуйста, обновите браузер или попробуйте один из ' +
      '<a href="http://browsehappy.com/">этих</a>';
      
    glift.dom.elem(divId).html(errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * Отключает масштабирование страницы на мобильных устройствах
 * @private
 */
const _disableMobileZoom = () => {
  // Выполняем только если масштабирование еще не отключено и устройство мобильное
  if (glift.global.disabledZoom || !glift.platform.isMobile()) {
    return;
  }
  
  const viewportContent = 'width=device-width, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no';
  
  // Удаляем существующие метатеги viewport
  [...document.getElementsByTagName('meta')]
    .filter(meta => meta?.getAttribute('name')?.toLowerCase() === 'viewport')
    .forEach(meta => glift.dom.elem(meta).remove());
  
  // Проверяем наличие head
  const head = document.head;
  if (!head) {
    throw new Error(
      'document.head отсутствует, но необходим для отключения масштабирования.'
    );
  }
  
  // Добавляем новый метатег viewport
  const newMeta = glift.dom
    .elem(document.createElement('meta'))
    .setAttr('name', 'viewport')
    .setAttr('content', viewportContent);
  
  glift.dom.elem(head).prepend(newMeta);
  glift.global.disabledZoom = true;
};

/**
 * Добавляет необходимые CSS классы в документ
 * @private
 */
const _addCssClasses = () => {
  if (glift.global.addedCssClasses) {
    return;
  }
  
  const style = document.createElement('style');
  style.type = 'text/css';
  
  const cssRules = [
    // Отключаем прокрутку (работает в основном для десктопов)
    '.glift-fullscreen-no-scroll { overflow: hidden; }',
    // Класс для комментариев используется в основном как идентификатор
    '.glift-comment-box {}'
  ].join('\n');
  
  style.innerHTML = cssRules;
  document.head?.appendChild(style);
  glift.global.addedCssClasses = true;
};
