/**
 * Базовый контроллер для всех типов игровых контроллеров.
 * 
 * Этот контроллер обеспечивает базовые механизмы для взаимодействия с SGF файлами.
 * 
 * @module controllers/base
 */

import { rules } from '../rules/index.js';
import { parse } from '../parse/index.js';
import { flattener } from '../flattener/index.js';
import { enums } from '../util/enums.js';
import { Point } from '../util/point.js';
import { HookOptions } from '../api/hooks.js';
import { orientation } from '../orientation/index.js';
import { Controller, CONTROLLER_TYPE } from './controllers.js';

/**
 * Типы контроллеров
 * @enum {string}
 */
export const CONTROLLER_TYPES = CONTROLLER_TYPE;

/**
 * Создает базовый контроллер.
 * @return {!BaseController} Экземпляр базового контроллера
 */
export const createBaseController = () => {
  return new BaseController();
};

/**
 * Базовый контроллер предоставляет основную функциональность для 
 * взаимодействия с SGF файлами. Типично, объекты, расширяющие этот базовый
 * класс, будут переопределять метод addStone и [опционально] extraOptions.
 * @implements {Controller}
 */
export class BaseController {
  /**
   * Создает экземпляр базового контроллера.
   */
  constructor() {
    //
    // Переменные, установленные во время инициализации, но константные после этого
    //

    /**
     * Исходная SGF строка.
     * @type {string}
     */
    this.sgfString = '';

    /**
     * Исходная начальная позиция.
     * @type {string|Array<number>}
     */
    this.rawInitialPosition = [];

    /**
     * Используется только для проблемного типа.
     * @type {Object}
     */
    this.problemConditions = {};

    /**
     * Тип парсера
     * @type {string}
     */
    this.parseType = parse.parseType.SGF;

    /**
     * Путь для следующих ходов. Используется только для примеров.
     * Указывает, как создавать номера ходов.
     * @private {Array<number>|undefined}
     */
    this.nextMovesPath_ = undefined;

    /**
     * Перечисление, указывающее предпочтение показа вариаций
     * @private {string|undefined}
     */
    this.showVariations_ = undefined;

    /**
     * Булево значение, указывающее, нужно ли отмечать последний ход.
     * @private {boolean}
     */
    this.markLastMove_ = false;

    /**
     * Булево значение, указывающее, нужно ли отмечать ко.
     * @private {boolean}
     */
    this.markKo_ = true;

    //
    // Переменные, устанавливаемые во время инициализации
    //

    /**
     * Путь дерева, представляющий путь к текущей позиции.
     * @type {Array<number>}
     */
    this.treepath = [];

    /**
     * Полное дерево ходов, построенное из SGF.
     * @type {Object}
     */
    // Создаем фиктивное дерево ходов, чтобы убедиться, что оно
    // всегда инициализировано.
    this.movetree = rules.movetree.getInstance();

    /**
     * Goban, представляющий текущее состояние доски. Здесь мы конструируем
     * фиктивный Goban, чтобы убедиться, что goban ненулевой.
     * @type {Object}
     */
    this.goban = rules.goban.getInstance(1);

    /**
     * Инициализируем фиктивный экземпляр hooks и переопределяем его во время initOptions.
     * @type {HookOptions}
     */
    this.hooks = new HookOptions();

    /**
     * История захватов, чтобы мы могли вернуться назад во времени.
     * @type {Array<Object>}
     */
    this.captureHistory = [];

    /**
     * История точек очищенных локаций (т.е. свойство AE). Нам нужно
     * хранить полную историю, чтобы вернуть изменения назад.
     * @type {Array<Array<Object>>}
     */
    this.clearHistory = [];

    /**
     * Массив ко-истории, чтобы когда мы идем назад, мы могли правильно
     * сбросить ко.
     * @type {Array<Point|null>}
     */
    this.koHistory = [];
  }

  /**
   * Инициализирует опции и структуры данных дочерних элементов контроллера.
   *
   * Обратите внимание, что эти опции должны быть защищены парсингом опций
   * (см. options.js в этом же каталоге). Таким образом, здесь не делаются
   * специальные проверки.
   *
   * @param {!Object} sgfOptions Объект, содержащий SGF опции.
   * @return {!BaseController} this
   */
  initOptions(sgfOptions) {
    this.sgfString = sgfOptions.sgfString || '';

    if (sgfOptions.nextMovesPath) {
      this.nextMovesPath_ = rules.treepath.parseFragment(
        sgfOptions.nextMovesPath
      );
    }

    this.rawInitialPosition = sgfOptions.initialPosition || [];
    this.parseType = sgfOptions.parseType || parse.parseType.SGF;
    this.problemConditions = sgfOptions.problemConditions || {};
    this.hooks = sgfOptions.hooks || this.hooks;

    // Контроллер может быть не лучшим местом для следующих нескольких опций,
    // так как они только для отображения; Однако, это сейчас лучшее место для них,
    // так как контроллер отвечает за создание уплощенного представления.
    this.showVariations_ = sgfOptions.showVariations || undefined;
    this.markLastMove_ = sgfOptions.markLastMove;
    this.markKo_ = sgfOptions.markKo;

    this.initialize();
    return this;
  }

  /**
   * Инициализирует:
   *  - initPosition -- Описание начальной позиции.
   *  - treepath -- Путь к текущей позиции. Массив номеров вариаций.
   *  - movetree -- Дерево узлов ходов из SGF.
   *  - goban -- Структура данных, описывающая доску Го. На самом деле, goban
   *    полезен для того, чтобы сказать вам, где могут быть размещены камни, и
   *    (после размещения) какие камни были захвачены.
   *  - capture history -- История захватов.
   *
   * @param {string=} opt_treepath Поскольку мы можем захотеть переинициализировать
   *    GoBoard, мы опционально передаем treepath с самого начала и используем
   *    его вместо treepath начальной позиции.
   * @return {!BaseController} this
   */
  initialize(opt_treepath) {
    const initTreepath = opt_treepath || this.rawInitialPosition;
    this.treepath = rules.treepath.parseInitialPath(initTreepath);

    this.movetree = rules.movetree.getFromSgf(
      this.sgfString,
      this.treepath,
      this.parseType
    );
    const gobanData = rules.goban.getFromMoveTree(
      this.movetree,
      this.treepath
    );

    this.goban = gobanData.goban;
    this.captureHistory = gobanData.captures;
    this.clearHistory = gobanData.clearHistory;
    this.extraOptions(); // Переопределено реализациями
    return this;
  }

  /**
   * Ожидается, что это будет реализовано теми, кто расширяет этот базовый
   * класс. Это вызывается во время initOptions выше.
   * @param {Object=} opt_options
   */
  extraOptions(opt_options) {
    /* Реализовано другими контроллерами. */
  }

  /**
   * Добавляет камень. Предполагается, что это будет переопределено.
   *
   * @param {!Point} point
   * @param {!enums.states} color
   * @return {?Object} Уплощенное представление.
   */
  addStone(point, color) {
    throw new Error('Не реализовано');
  }

  /**
   * Создает уплощенное состояние.
   * @return {!Object}
   */
  flattenedState() {
    const newFlat = flattener.flatten(this.movetree, {
      goban: this.goban,
      showNextVariationsType: this.showVariations_,
      markLastMove: this.markLastMove_,
      markKo: this.markKo_,
      nextMovesPath: this.nextMovesPath_,
      problemConditions: this.problemConditions,
      selectedNextMove: this.selectedNextMove(),
    });
    return newFlat;
  }

  /**
   * Получает текущий номер хода.
   * @return {number}
   */
  currentMoveNumber() {
    return this.movetree.node().getNodeNum();
  }

  /**
   * Получает номер вариации следующего хода. Это будет что-то другое,
   * если мы использовали setNextVariation или если мы уже сыграли в вариацию.
   * Иначе, это будет 0.
   *
   * @return {number}
   */
  nextVariationNumber() {
    return this.treepath[this.currentMoveNumber()] || 0;
  }

  /**
   * Возвращает следующий 'выбранный' ход, эквивалентный использованию
   * следующего номера вариации, коррелирующего со следующими ходами в дереве ходов.
   * @return {?Object}
   */
  selectedNextMove() {
    const nextVar = this.nextVariationNumber();
    const nextMoves = this.movetree.nextMoves();
    if (nextMoves.length) {
      return nextMoves[nextVar] || null;
    }
    return null;
  }

  /**
   * Устанавливает, какой будет следующая вариация. Число применяется
   * по модулю количества возможных вариаций.
   *
   * @param {number} num
   * @return {!BaseController} this
   */
  setNextVariation(num) {
    // Напомним, что currentMoveNumber такой же, как номер глубины ==
    // this.treepath.length (если в конце). Таким образом, если старый treepath был
    // [0,1,2,0] и currentMoveNumber был 2, у нас будет [0, 1, num].
    this.treepath = this.treepath.slice(0, this.currentMoveNumber());
    this.treepath.push(num % this.movetree.node().numChildren());
    return this;
  }

  /**
   * Получает treepath к текущей позиции.
   * @return {!Array<number>}.
   */
  pathToCurrentPosition() {
    return this.movetree.treepathToHere();
  }

  /**
   * Получает пары ключ-значение с информацией об игре. Это состоит из глобальных
   * данных об игре, таких как имена игроков, результат игры,
   * название турнира и т.д.
   * @return {!Array<!Object>}
   */
  getGameInfo() {
    return this.movetree.getGameInfo();
  }

  /**
   * Получает захваты, которые произошли для текущего хода.
   *
   * @return {!Object}
   */
  getCaptures() {
    if (this.captureHistory.length === 0) {
      return { BLACK: [], WHITE: [] };
    }
    return this.captureHistory[this.currentMoveNumber() - 1];
  }

  /**
   * Получает количество захватов.
   * @return {{
   *  BLACK: number,
   *  WHITE: number
   * }}
   */
  getCaptureCount() {
    const countObj = { BLACK: 0, WHITE: 0 };
    for (let i = 0; i < this.captureHistory.length; i++) {
      const obj = this.captureHistory[i];
      for (const color in obj) {
        countObj[color] += obj[color].length;
      }
    }
    return countObj;
  }

  /**
   * Возвращает true, если камень (вероятно) может быть добавлен на доску, и false
   * в противном случае.
   *
   * Обратите внимание, что этот метод не всегда полностью точен. Этот метод должен быть
   * очень быстрым, так как ожидается, что он будет использоваться для событий наведения.
   *
   * @param {!Point} point
   * @param {!enums.states} color
   * @return {boolean}
   */
  canAddStone(point, color) {
    return this.goban.placeable(point);
  }

  /**
   * Возвращает состояние (либо BLACK, либо WHITE). Должен быть быстрым, так как
   * используется для отображения цвета при наведении в дисплее.
   *
   * Это будет undefined, пока не будет вызван initialize, поэтому клиенты
   * контроллера должны убедиться, что всегда инициализируют позицию доски
   * в первую очередь.
   *
   * @return {!enums.states}
   */
  getCurrentPlayer() {
    return this.movetree.getCurrentPlayer();
  }

  /** @return {string} Текущая SGF строка. */
  currentSgf() {
    return this.movetree.toSgf();
  }

  /** @return {string} Оригинальная SGF строка. */
  originalSgf() {
    return this.sgfString;
  }

  /** @return {number} Возвращает количество пересечений. */
  getIntersections() {
    return this.movetree.getIntersections();
  }

  /**
   * Получает рекомендуемую обрезку квадранта для дерева ходов. Это
   * соображение отображения, но знание о том, как обрезать, зависит от
   * дерева ходов, поэтому этот метод должен жить в контроллере.
   *
   * @return {string} Рекомендуемый регион доски для использования.
   */
  getQuadCropFromBeginning() {
    return orientation.getQuadCropFromMovetree(this.movetree);
  }

  /**
   * Получает набор правильных следующих ходов. Это должно применяться только к
   * виджетам на основе задач.
   *
   * @return {!Array<!Object>}
   */
  getCorrectNextMoves() {
    return rules.problems.correctNextMoves(
      this.movetree,
      this.problemConditions
    );
  }

  /**
   * Получает следующий ход в игре. Если игрок уже прошел путь,
   * то мы следуем этому предыдущему пути.
   *
   * Если varNum не определен, мы пытаемся 'угадать' следующий ход на основе
   * содержимого treepath.
   *
   * Переходит к следующему ходу. Это немного сложнее, чем вы могли бы
   * представить:
   *   - Нам нужно либо добавить к Movetree, либо, если movetree только для чтения,
   *     нам нужно убедиться, что ход/узел существует.
   *   - Нам нужно обновить Goban.
   *   - Нам нужно сохранить захваты.
   *   - Нам нужно обновить текущий номер хода.
   *
   * @param {number=} opt_varNum
   *
   * @return {?Object} Уплощенное представление или null,
   *    если нет следующего хода.
   */
  nextMove(opt_varNum) {
    if (
      this.treepath[this.currentMoveNumber()] !== undefined &&
      (opt_varNum === undefined || this.nextVariationNumber() === opt_varNum)
    ) {
      // Если возможно, мы предпочитаем идти по маршруту, определенному ранее
      // пройденным treepath. Другими словами, не трогайте treepath, если
      // мы 'на вариации'.
      this.movetree.moveDown(this.nextVariationNumber());
    } else {
      // Нет существующего treepath.
      const varNum = opt_varNum === undefined ? 0 : opt_varNum;
      if (varNum >= 0 && varNum <= this.movetree.nextMoves().length - 1) {
        // Мы предпочитаем брать узлы 'хода' вместо узлов не-хода.
        this.setNextVariation(varNum);
        this.movetree.moveDown(varNum);
      } else {
        // Не было доступных 'ходов'. Однако, возможно, есть
        // следующий узел, который не имеет хода.
        if (this.movetree.node().numChildren() > 0) {
          this.setNextVariation(varNum);
          this.movetree.moveDown(varNum);
        } else {
          return null; // Нет доступных ходов
        }
      }
    }
    const clears = this.goban.applyClearLocationsFromMovetree(this.movetree);
    const captures = this.goban.loadStonesFromMovetree(this.movetree);
    this.koHistory.push(this.goban.getKo());
    this.captureHistory.push(captures);
    this.clearHistory.push(clears);
    return this.flattenedState();
  }

  /**
   * Возвращается на ход назад.
   * @return {?Object} Уплощенное представление или null,
   *    если нет предыдущего хода.
   */
  prevMove() {
    if (this.currentMoveNumber() === 0) {
      return null;
    }
    const captures = this.getCaptures();
    const clears = this.clearHistory[this.clearHistory.length - 1] || [];
    const allCurrentStones = this.movetree.properties().getAllStones();
    this.captureHistory = this.captureHistory.slice(
      0,
      this.captureHistory.length - 1
    );
    this.clearHistory = this.clearHistory.slice(
      0,
      this.clearHistory.length - 1
    );
    this.unloadStonesFromGoban_(allCurrentStones, captures);
    for (let i = 0; i < clears.length; i++) {
      const move = clears[i];
      if (move.point === undefined) {
        throw new Error(
          'Неожиданная ошибка! Ходы истории очистки должны иметь точки.'
        );
      }
      this.goban.setColor(move.point, move.color);
    }

    this.movetree.moveUp();
    this.koHistory.pop();
    if (this.koHistory.length) {
      const ko = this.koHistory[this.koHistory.length - 1];
      if (ko) {
        this.goban.setKo(ko);
      }
    }
    return this.flattenedState();
  }

  /**
   * Возвращается к началу.
   * @return {!Object} Уплощенное представление.
   */
  toBeginning() {
    this.movetree = this.movetree.getTreeFromRoot();
    this.goban = rules.goban.getFromMoveTree(this.movetree, []).goban;
    this.captureHistory = [];
    this.clearHistory = [];
    this.koHistory = [];
    return this.flattenedState();
  }

  /**
   * Переходит к концу.
   * @return {!Object} Уплощенное представление
   */
  toEnd() {
    while (this.nextMove()) {
      // Все действия происходят в nextMoveNoState.
    }
    return this.flattenedState();
  }

  /**
   * Обрабатывает клик на точку доски.
   * @param {!Object} pt - Точка на доске
   * @return {boolean} Успешность обработки
   */
  handleClick(pt) {
    return false;
  }

  /**
   * Обновляет отображение игровой доски.
   * @return {!BaseController}
   */
  updateBoard() {
    return this;
  }

  /// //////////////////
  // Приватные методы //
  /// //////////////////

  /**
   * Отменяет добавление дерева ходов (используется для возврата на ход назад).
   *
   * @param {!Object} stones
   * @param {!Object} captures
   *
   * @private
   */
  unloadStonesFromGoban_(stones, captures) {
    for (const color in stones) {
      const c = color;
      const arr = stones[c];
      for (let j = 0; j < arr.length; j++) {
        const move = arr[j];
        if (move.point) {
          this.goban.clearStone(move.point);
        }
      }
    }
    for (const captureColor in captures) {
      const captureC = captureColor;
      const captureArr = captures[captureC];
      for (let i = 0; i < captureArr.length; i++) {
        this.goban.addStone(captureArr[i], captureC);
      }
    }
  }
}
