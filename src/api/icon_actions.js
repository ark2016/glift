/**
 * Модуль действий с иконками для библиотеки Glift.
 * @module api/icon_actions
 */

/**
 * Определение типа для функции обработки действий с иконками.
 * Представляет действие, которое может быть выполнено при взаимодействии с иконкой.
 *
 * @typedef {function(
 *  !Event,
 *  !Object,
 *  !Object,
 *  !Object
 * )} IconFn
 */
export const IconFn = {}; // Только для документации, не используется

/**
 * Определение иконки.
 * 
 * @typedef {{
 *  click: (IconFn|undefined),
 *  tooltip: (string|undefined)
 * }} IconDef
 */
export const IconDef = {}; // Только для документации, не используется

/**
 * Коллекция действий иконок.
 * @typedef {!Object<string, IconDef>} IconActions
 */
export const IconActions = {}; // Только для документации, не используется

/**
 * Действия для иконок (см. displays/icons/).
 * @type {!IconActions}
 */
export const iconActionDefaults = {
  start: {
    click: function (event, widget, icon, iconBar) {
      widget.applyBoardData(widget.controller.toBeginning());
    },
    tooltip: 'В начало',
  },

  end: {
    click: function (event, widget, icon, iconBar) {
      widget.applyBoardData(widget.controller.toEnd());
    },
    tooltip: 'В конец',
  },

  arrowright: {
    click: function (event, widget, icon, iconBar) {
      widget.applyBoardData(widget.controller.nextMove());
    },
    tooltip: 'Следующий ход',
  },

  arrowleft: {
    click: function (event, widget, icon, iconBar) {
      widget.applyBoardData(widget.controller.prevMove());
    },
    tooltip: 'Предыдущий ход',
  },

  // Перейти к следующей задаче
  'chevron-right': {
    click: function (event, widget, icon, iconBar) {
      widget.manager.nextSgf();
    },
    tooltip: 'Следующая панель',
  },

  // Перейти к предыдущей задаче
  'chevron-left': {
    click: function (event, widget, icon, iconBar) {
      widget.manager.prevSgf();
    },
    tooltip: 'Предыдущая панель',
  },

  // Попробовать снова
  refresh: {
    click: function (event, widget, icon, iconBar) {
      widget.reload();
    },
    tooltip: 'Попробовать задачу снова',
  },

  // Отменить только для задач (т.е. вернуться на один ход назад)
  'undo-problem-move': {
    click: function (event, widget, icon, iconBar) {
      if (
        widget.controller.movetree.node().getNodeNum() <=
        widget.initialMoveNumber
      ) {
        return;
      }

      if (widget.initialPlayerColor === widget.controller.getCurrentPlayer()) {
        // Если сейчас наш ход, то последний ход был сделан противником -- нам нужно
        // сделать дополнительный ход назад.
        widget.applyBoardData(widget.controller.prevMove());
      }

      widget.applyBoardData(widget.controller.prevMove());
      if (
        widget.initialMoveNumber ===
        widget.controller.movetree.node().getNodeNum()
      ) {
        // Мы в корне. Можем считать решение верным, поэтому перезагружаем виджет.
        widget.reload();
      } else {
        const problemResults = widget.sgfOptions.problemResults || {
          CORRECT: 'CORRECT',
          INCORRECT: 'INCORRECT'
        };
        const correctness = widget.controller.correctnessStatus();
        widget.iconBar.clearTempIcons();
        if (correctness === problemResults.CORRECT) {
          widget.iconBar.setCenteredTempIcon(
            'multiopen-boxonly',
            'check',
            '#0CC'
          );
          widget.correctness = problemResults.CORRECT;
        } else if (correctness === problemResults.INCORRECT) {
          widget.iconBar.clearTempIcons();
          widget.iconBar.setCenteredTempIcon(
            'multiopen-boxonly',
            'cross',
            'red'
          );
          widget.correctness = problemResults.INCORRECT;
        }
      }
    },
    tooltip: 'Отменить последнюю попытку хода',
  },

  undo: {
    click: function (event, widget, icon, iconBar) {
      widget.manager.returnToOriginalWidget();
    },
    tooltip: 'Вернуться к родительскому виджету',
  },

  'jump-left-arrow': {
    click: function (event, widget, icon, iconBar) {
      const maxMoves = 20;
      widget.applyBoardData(
        widget.controller.previousCommentOrBranch(maxMoves)
      );
    },
    tooltip: 'Предыдущая ветка или комментарий',
  },

  'jump-right-arrow': {
    click: function (event, widget, icon, iconBar) {
      const maxMoves = 20;
      widget.applyBoardData(widget.controller.nextCommentOrBranch(maxMoves));
    },
    tooltip: 'Следующая ветка или комментарий',
  },

  // Перейти к объяснению задачи
  'problem-explanation': {
    click: function (event, widget, icon, iconBar) {
      const manager = widget.manager;
      const showVariations = widget.sgfOptions.showVariations || {
        ALWAYS: 'ALWAYS'
      };
      const sgfObj = {
        widgetType: 'GAME_VIEWER',
        initialPosition: widget.controller.initialPosition,
        sgfString: widget.controller.originalSgf(),
        showVariations: showVariations.ALWAYS,
        problemConditions: widget.sgfOptions.problemConditions ?
            JSON.parse(JSON.stringify(widget.sgfOptions.problemConditions)) : undefined,
        icons: [
          'jump-left-arrow',
          'jump-right-arrow',
          'arrowleft',
          'arrowright',
          'undo',
        ],
        rotation: widget.sgfOptions.rotation,
        boardRegion: widget.sgfOptions.boardRegion,
      };
      manager.createTemporaryWidget(sgfObj);
    },
    tooltip: 'Изучить решение',
  },

  multiopen: {
    click: function (event, widget, icon, iconBar) {
      const ic = widget.display.createIconSelector(
        widget.wrapperDivId,
        iconBar.divId,
        icon
      );
      ic.setIconEvents('click', function (event, wrappedIcon) {
        const multi = iconBar.getIcon('multiopen');
        multi.setActive(wrappedIcon.iconName);
        iconBar.setCenteredTempIcon('multiopen', multi.getActive(), 'black');
      });
    },
    tooltip: 'Открыть меню опций',
  },

  'multiopen-boxonly': {
    mouseover: function () {},
    mouseout: function () {},
    click: function () {},
    tooltip: 'Shows if the problem is solved',
  },

  //
  // Status Bar Icons
  //

  'game-info': {
    click: function (event, widget, icon, iconBar) {
      widget.statusBar &&
        widget.statusBar.gameInfo(
          widget.controller.getGameInfo(),
          widget.controller.getCaptureCount()
        );
    },
    tooltip: 'Show the game info',
  },

  'move-indicator': {
    click: function () {},
    mouseover: function () {},
    mouseout: function () {},
    tooltip: 'Shows the current move number',
  },

  fullscreen: {
    click: function (event, widget, icon, iconBar) {
      widget.manager.enableFullscreen();
    },
    tooltip: 'Включить полноэкранный режим',
  },

  unfullscreen: {
    click: function (event, widget, icon, iconBar) {
      widget.manager.disableFullscreen();
    },
    tooltip: 'Выйти из полноэкранного режима',
  },

  'settings-wrench': {
    click: function () {},
    tooltip: 'Show Glift Settings',
  },

  // Rotation arrows
  'twistleft-boxonly': {
    click: function (event, widget, icon, iconBar) {
      widget.manager.rotation((widget.sgfOptions.rotation || 0) + 90);
    },
    tooltip: 'Повернуть доску против часовой стрелки',
  },

  'twistright-boxonly': {
    click: function (event, widget, icon, iconBar) {
      widget.manager.rotation((widget.sgfOptions.rotation || 0) - 90);
    },
    tooltip: 'Повернуть доску по часовой стрелке',
  },
};
