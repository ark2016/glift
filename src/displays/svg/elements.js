/**
 * Перечисление элементов SVG, используемых в Glift.
 *
 * Используется для создания идентификаторов элементов SVG.
 * Значения немного модифицированы для совместимости с именами классов/идентификаторов.
 *
 * @enum {string}
 * @readonly
 */
export const Element = Object.freeze({
  SVG: 'svg',
  BOARD: 'board',
  BOARD_COORD_LABELS: 'board_coord_labels',
  INTERSECTIONS_CONTAINER: 'intersections',
  BOARD_LINE: 'board_line',
  BOARD_LINE_CONTAINER: 'board_line_container',
  BUTTON: 'button',
  BUTTON_CONTAINER: 'button_container',
  FULL_BOARD_BUTTON: 'full_board_button',
  MARK: 'mark',
  TEMP_MARK_GROUP: 'temp_mark_group',
  MARK_CONTAINER: 'mark_container',
  GLIFT_ELEMENT: 'glift_element',
  STARPOINT: 'starpoint',
  STARPOINT_CONTAINER: 'starpoint_container',
  STONE: 'stone',
  STONE_CONTAINER: 'stone_container',
  STONE_SHADOW: 'stone_shadow',
  STONE_SHADOW_CONTAINER: 'stone_shadow_container',
  GUIDE_LINE: 'guide_line',

  // Элементы для панели иконок
  ICON: 'icon',
  ICON_CONTAINER: 'icon_container',
  TEMP_ICON: 'temp_icon',
  TEMP_TEXT: 'temp_text',
  TEMP_ICON_CONTAINER: 'temp_icon_container',
});
