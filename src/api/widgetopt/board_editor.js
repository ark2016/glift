/**
 * Опции для редактора доски Го.
 * @module api/widgetopt/board_editor
 */

/**
 * Возвращает опции для виджета редактора доски.
 * @return {Object} Объект с опциями виджета
 */
export function boardEditorOptions() {
  // Карта преобразования иконок в типы меток
  const iconToMark = {
    bstone_a: 'LABEL_ALPHA', // будет заменено на соответствующее перечисление
    bstone_1: 'LABEL_NUMERIC', // будет заменено на соответствующее перечисление
    bstone_square: 'SQUARE', // будет заменено на соответствующее перечисление
    bstone_triangle: 'TRIANGLE', // будет заменено на соответствующее перечисление
  };

  // Карта преобразования иконок в цвета камней
  const placementMap = {
    bstone: 'BLACK', // будет заменено на соответствующее перечисление
    wstone: 'WHITE', // будет заменено на соответствующее перечисление
  };

  return {
    markLastMove: undefined, // полагаемся на значения по умолчанию
    enableMousewheel: undefined, // полагаемся на значения по умолчанию
    keyMappings: undefined, // полагаемся на значения по умолчанию

    problemConditions: {},

    controllerFunc: null, // будет заменено на boardEditor при подключении контроллеров

    icons: [
      'start',
      'end',
      'arrowleft',
      'arrowright',
      [
        // Иконки для изменения поведения клика
        'twostones', // обычный ход
        'bstone', // размещение черного камня
        'wstone', // размещение белого камня
        'bstone_a', // метка A-Z
        'bstone_1', // метка 1+
        'bstone_triangle', // метка треугольник
        'bstone_square', // метка квадрат
        'nostone-xmark', // стереть
        // TODO: Добавить удаление, круг
      ],
    ],

    showVariations: null, // будет заменено на ALWAYS при использовании перечислений

    statusBarIcons: ['game-info', 'move-indicator', 'fullscreen'],

    /**
     * Обработчик клика по камню на доске
     * @param {Event} event - Событие клика
     * @param {Object} widget - Объект виджета
     * @param {Object} pt - Точка на доске
     */
    stoneClick: function (event, widget, pt) {
      let partialData;
      widget.display.intersections().clearTempMarks();
      const iconName = widget.iconBar.getIcon('multiopen').getActive().iconName;
      const currentPlayer = widget.controller.getCurrentPlayer();

      if (placementMap[iconName]) {
        const color = placementMap[iconName];
        partialData = widget.controller.addPlacement(pt, color);
        widget.applyBoardData(partialData);
      } else if (iconToMark[iconName]) {
        partialData = widget.controller.addMark(pt, iconToMark[iconName]);
        if (partialData) {
          widget.applyBoardData(partialData);
        }
      } else if (iconName === 'twostones') {
        partialData = widget.controller.addStone(pt, currentPlayer);
        if (partialData) {
          widget.applyBoardData(partialData);
        }
      }
      // TODO: Обработать 'nostone-xmark' -- т.е. очистку пересечения.
    },

    /**
     * Обработчик наведения мыши на камень
     * @param {Event} event - Событие наведения
     * @param {Object} widget - Объект виджета
     * @param {Object} pt - Точка на доске
     */
    stoneMouseover: function (event, widget, pt) {
      let colorKey;
      const marks = {
        LABEL_ALPHA: 'LABEL_ALPHA',
        LABEL_NUMERIC: 'LABEL_NUMERIC'
      }; // будет заменено на соответствующее перечисление
      const hoverColors = { BLACK: 'BLACK_HOVER', WHITE: 'WHITE_HOVER' };
      const currentPlayer = widget.controller.getCurrentPlayer();
      const intersections = widget.display.intersections();
      const iconName = widget.iconBar.getIcon('multiopen').getActive().iconName;

      if (placementMap[iconName] !== undefined) {
        colorKey = placementMap[iconName];
        if (widget.controller.canAddStone(pt, currentPlayer)) {
          intersections.setStoneColor(pt, hoverColors[colorKey]);
        }
      } else if (iconName === 'twostones') {
        colorKey = widget.controller.getCurrentPlayer();
        if (widget.controller.canAddStone(pt, currentPlayer)) {
          intersections.setStoneColor(pt, hoverColors[colorKey]);
        }
      } else if (iconToMark[iconName] && !intersections.hasMark(pt)) {
        const markType = iconToMark[iconName];
        if (markType === marks.LABEL_NUMERIC) {
          intersections.addTempMark(
            pt,
            markType,
            widget.controller.currentNumericMark()
          );
        } else if (markType === marks.LABEL_ALPHA) {
          intersections.addTempMark(
            pt,
            markType,
            widget.controller.currentAlphaMark()
          );
        } else {
          intersections.addTempMark(pt, markType);
        }
      }
    },

    /**
     * Обработчик ухода мыши с камня
     * @param {Event} event - Событие ухода мыши
     * @param {Object} widget - Объект виджета
     * @param {Object} pt - Точка на доске
     */
    stoneMouseout: function (event, widget, pt) {
      const currentPlayer = widget.controller.getCurrentPlayer();
      const iconName = widget.iconBar.getIcon('multiopen').getActive().iconName;
      const intersections = widget.display.intersections();
      if (
        iconName === 'twostones' ||
        iconName === 'bstone' ||
        iconName === 'wstone'
      ) {
        if (widget.controller.canAddStone(pt, currentPlayer)) {
          intersections.setStoneColor(pt, 'EMPTY');
        }
      }
      intersections.clearTempMarks();
    },
  };
}
