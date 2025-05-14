/**
 * Модуль, содержащий различные константы, используемые в библиотеке Glift.
 * @module util/enums
 */

/**
 * Enums для игры Го и настроек библиотеки.
 */
export const enums = {
  /**
   * Преобразует enum в camelCase формат. Может быть полезно для функций или 
   * пакетов, названных по имени enum.
   *
   * @param {string} input Входная строка enum
   * @return {string} Преобразованное имя enum
   */
  toCamelCase: function (input) {
    return input.toLowerCase().replace(/_(.)?/g, function (match, group1) {
      return group1 ? group1.toUpperCase() : '';
    });
  },
};

/**
 * Состояния камней на доске (цвета).
 * @enum{string}
 */
export const states = {
  BLACK: 'BLACK',
  WHITE: 'WHITE',
  EMPTY: 'EMPTY',
};

/**
 * Варианты выравнивания доски.
 * @enum{string}
 */
export const boardAlignments = {
  TOP: 'TOP',
  RIGHT: 'RIGHT',
  CENTER: 'CENTER',
};

/**
 * Список направлений. Используется для различных задач.
 * @enum{string}
 */
export const directions = {
  LEFT: 'LEFT',
  RIGHT: 'RIGHT',
  TOP: 'TOP',
  BOTTOM: 'BOTTOM',
};

/**
 * Список регионов доски. Обычно используется для обрезки.
 * @enum{string}
 */
export const boardRegions = {
  LEFT: 'LEFT',
  RIGHT: 'RIGHT',
  TOP: 'TOP',
  BOTTOM: 'BOTTOM',
  TOP_LEFT: 'TOP_LEFT',
  TOP_RIGHT: 'TOP_RIGHT',
  BOTTOM_LEFT: 'BOTTOM_LEFT',
  BOTTOM_RIGHT: 'BOTTOM_RIGHT',
  ALL: 'ALL',
  // Автоматически определить регион доски.
  AUTO: 'AUTO',
  // Минимальный размер обрезки, учитывая некоторые эвристики. Для этого обычно 
  // нужно дерево ходов и, как правило, информация о следующем пути.
  MINIMAL: 'MINIMAL',
};

/**
 * Типы меток на доске.
 * @enum {string}
 */
export const marks = {
  CIRCLE: 'CIRCLE',
  SQUARE: 'SQUARE',
  TRIANGLE: 'TRIANGLE',
  XMARK: 'XMARK',
  // STONE_MARKER отмечает последний сыгранный камень
  STONE_MARKER: 'STONE_MARKER',
  LABEL: 'LABEL',

  // Следующие типы "меток" являются вариациями типа LABEL.
  // TODO: Объединить их каким-то образом.
  //
  // Ни LABEL_ALPHA, ни LABEL_NUMERIC не используются для рендеринга, но
  // это различие очень удобно при передаче информации от отображения к контроллеру
  LABEL_ALPHA: 'LABEL_ALPHA',
  LABEL_NUMERIC: 'LABEL_NUMERIC',

  // Следующие два - вариации метки LABEL. VARIATION_MARKER используется
  // чтобы мы могли окрашивать метки по-разному для вариаций.
  VARIATION_MARKER: 'VARIATION_MARKER',

  // Мы окрашиваем 'правильные' вариации по-разному в задачах
  CORRECT_VARIATION: 'CORRECT_VARIATION',

  // Отметка позиции Ko
  KO_LOCATION: 'KO_LOCATION',
};

/**
 * Enum для указания, как был разрешен ход для задачи.
 * @enum {string}
 */
export const problemResults = {
  CORRECT: 'CORRECT',
  INCORRECT: 'INCORRECT',
  INDETERMINATE: 'INDETERMINATE',
  FAILURE: 'FAILURE', // то есть, ни один из этих (не удалось разместить камень).
};

/**
 * Показывать ли вариации в интерфейсе.
 * @enum {string}
 */
export const showVariations = {
  ALWAYS: 'ALWAYS',
  NEVER: 'NEVER',
  MORE_THAN_ONE: 'MORE_THAN_ONE',
};

/**
 * Повороты, которые мы можем применить к доскам Го. Не поворачивает 
 * фундаментальные данные (точки SGF), но поворачивает во время отрисовки доски.
 * @enum {string}
 */
export const rotations = {
  NO_ROTATION: 'NO_ROTATION',
  CLOCKWISE_90: 'CLOCKWISE_90',
  CLOCKWISE_180: 'CLOCKWISE_180',
  CLOCKWISE_270: 'CLOCKWISE_270',
};

/**
 * Отражения, которые можно применить к доске Го.
 * @enum {string}
 */
export const Flip = {
  /** Не выполнять отражение. Действие по умолчанию. */
  NO_FLIP: 'NO_FLIP',
  /** Вертикальное отражение. Другими словами, отразить точки относительно оси X (координаты Y). */
  VERTICAL: 'VERTICAL',
  /** Горизонтальное отражение. Другими словами, отразить точки относительно оси Y (координаты X). */
  HORIZONTAL: 'HORIZONTAL',
};

// Добавляем все enum в объект enums для обратной совместимости
enums.states = states;
enums.boardAlignments = boardAlignments;
enums.directions = directions;
enums.boardRegions = boardRegions;
enums.marks = marks;
enums.problemResults = problemResults;
enums.showVariations = showVariations;
enums.rotations = rotations;
enums.Flip = Flip;
