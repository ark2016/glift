/**
 * Дополнительные опции для примеров.
 * Используются в виджетах, которые показывают примеры позиций без интерактивности.
 * @module api/widgetopt/example_options
 */

/**
 * Возвращает опции для виджета примеров.
 * @return {Object} Объект с опциями виджета
 */
export function exampleOptions() {
  return {
    markLastMove: undefined, // полагаемся на значения по умолчанию
    keyMappings: undefined, // полагаемся на значения по умолчанию
    enableMousewheel: undefined, // полагаемся на значения по умолчанию (false)

    problemConditions: {},

    controllerFunc: null, // будет заменено на gameViewer при подключении контроллеров

    icons: [],

    showVariations: null, // будет заменено на NEVER при использовании перечислений

    statusBarIcons: [
      // 'game-info', - отключено
      'fullscreen',
    ],

    /**
     * Обработчик клика по камню на доске - пустая функция, так как пример не интерактивен
     */
    stoneClick: function (event, widget, pt) {},
    
    /**
     * Отключаем поведение при наведении и уведении мыши, чтобы было понятно,
     * что с виджетом примера нельзя взаимодействовать.
     */
    stoneMouseover: function () {},
    stoneMouseout: function () {},
  };
}
