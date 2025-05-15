/**
 * Модуль для представления доски для игры в Го (гобан).
 * @module rules/goban
 */

import { util } from '../util/util.js';
import { Point } from '../util/point.js';
import { states } from '../../../src/util/enums.js';

/**
 * Result of a Capture
 *
 * @typedef {{
 *   WHITE: !Array<!Object>,
 *   BLACK: !Array<!Object>
 * }}
 */
export let CaptureResult;

/**
 * Создает Goban экземпляр, только с пересечениями.
 * @param {number=} opt_intersections
 * @return {!Goban}
 */
export function getInstance(opt_intersections) {
  var ints = opt_intersections || 19;
  return new Goban(ints);
}

/**
 * Создает гобан из дерева ходов и (опционально) treePath, который
 * определяет, как перейти от начала к заданному местоположению. Обычно
 * treePath - это initialPosition, но не обязательно.
 *
 * ПРИМЕЧАНИЕ: Это оставляет movetree в измененном состоянии.
 *
 * @param {!Object} mt Дерево ходов.
 * @param {!Array=} opt_treepath Опциональный treepath. Если treepath
 *    не определен, мы создаем treepath до текущего местоположения в
 *    movetree.
 *
 * @return {{
 *   goban: !Goban,
 *   captures: !Array<!CaptureResult>,
 *   clearHistory: !Array<!Array<!Object>>
 * }}
 */
export function getFromMoveTree(mt, opt_treepath) {
  var treepath = opt_treepath || mt.treepathToHere();
  var goban = new Goban(mt.getIntersections()),
    movetree = mt.getTreeFromRoot(),
    clearHistory = [],
    captures = []; // массив захватов.
  goban.loadStonesFromMovetree(movetree); // Загрузка размещений корня.
  // Мы не рассматриваем свойства очистки местоположений (AE) в корне, потому что
  // зачем это делать?

  for (
    var i = 0;
    i < treepath.length && movetree.node().numChildren() > 0;
    i++
  ) {
    movetree.moveDown(treepath[i]);
    clearHistory.push(goban.applyClearLocationsFromMovetree(movetree));
    captures.push(goban.loadStonesFromMovetree(movetree));
  }
  return {
    goban: goban,
    captures: captures,
    clearHistory: clearHistory,
  };
}

/**
 * Инициализирует массив камней для гобана.
 * @param {number} ints Количество пересечений.
 * @return {!Array<!Array<string>>} Двумерный массив камней.
 * @private
 */
function initStones_(ints) {
  var stones = [];
  for (var i = 0; i < ints; i++) {
    stones[i] = [];
    for (var j = 0; j < ints; j++) {
      stones[i][j] = states.EMPTY;
    }
  }
  return stones;
}

/**
 * Гобан отслеживает состояние камней. Поскольку состояние хранится в двойном
 * массиве, позиции на доске индексируются из верхнего левого угла:
 *
 * 0,0    : Верхний левый
 * 0,19   : Нижний левый
 * 19,0   : Верхний правый
 * 19,19  : Нижний правый
 *
 * В настоящее время Гобан имеет элементарную поддержку Ко. Ко в настоящее время
 * поддерживается в простом случае, когда ход, вызывающий захват, может быть
 * немедленно перехвачен:
 *
 * ......
 * ..OX..
 * .OX.X.
 * ..OX..
 * .....
 *
 * В настоящее время все другие повторяющиеся ситуации на доске игнорируются.
 * Беспокойство о хешировании позиции на доске и проверке текущей позиции
 * относительно прошлых позиций выходит за рамки этого класса, поскольку этот
 * класс не содержит состояния, кроме камней и, возможно, одной точки Ко.
 *
 * Историческое примечание: это самая старая часть Glift.
 *
 * @param {number} ints
 *
 * @constructor @final @struct
 */
export class Goban {
  constructor(ints) {
    if (!ints || ints <= 0) {
      throw new Error('Invalid Intersections. Was: ' + ints);
    }

    /** @private {number} */
    this.ints_ = ints;

    /** @private {!Array<string>} */
    this.stones_ = initStones_(ints);

    /**
     * Точка Ко, если она существует. Null, если Ко нет.
     * @private {?Object}
     */
    this.koPoint_ = null;
  }

  /** @return {number} Количество пересечений. */
  intersections() {
    return this.ints_;
  }

  /**
   * Устанавливает точку Ко. Обычно это должно устанавливаться с помощью addStone.
   * Однако пользователи могут захотеть установить это при перемещении в обратном
   * направлении по игре.
   * @param {!Object} pt
   */
  setKo(pt) {
    if (pt && this.inBounds_(pt)) {
      this.koPoint_ = pt;
    }
  }

  /**
   * Очищает точку Ко. Обратите внимание, что точка Ко очищается автоматически
   * некоторыми операциями (clearStone, addStone).
   */
  clearKo() {
    this.koPoint_ = null;
  }

  /** @return {?Object} Точка ко или null, если она не существует. */
  getKo() {
    return this.koPoint_;
  }

  /**
   * @param {!Object} point
   * @return {boolean} True, если доска пуста в определенной точке, и
   *    точка находится в пределах границ доски.
   */
  placeable(point) {
    return (
      this.inBounds_(point) &&
      !point.equals(this.koPoint_) &&
      this.getStone(point) === states.EMPTY
    );
  }

  /**
   * Извлекает состояние (цвет) из доски.
   *
   * Обратите внимание, что для наших целей,
   * x: относится к столбцу.
   * y: относится к строке.
   *
   * Таким образом, чтобы получить определенный "камень", вы должны сделать
   * stones[y][x]. Также, камни индексируются с 0.
   *
   * @param {!Object} pt
   * @return {string} состояние пересечения
   */
  getStone(pt) {
    return this.stones_[pt.y()][pt.x()];
  }

  /**
   * Получить все размещенные камни на доске (BLACK или WHITE)
   * @return {!Array<!Object>}
   */
  getAllPlacedStones() {
    var out = [];
    for (var i = 0; i < this.intersections(); i++) {
      for (var j = 0; j < this.intersections(); j++) {
        var color = this.getStone(point(j, i));
        if (
          color === states.BLACK ||
          color === states.WHITE
        ) {
          out.push({ point: point(j, i), color: color });
        }
      }
    }
    return out;
  }

  /**
   * Очищает камень с пересечения. Очищает точку Ко.
   * @param {!Object} point
   * @return {string} цвет очищенного местоположения
   */
  clearStone(point) {
    this.clearKo();
    var color = this.getStone(point);
    this.setColor(point, states.EMPTY);
    return color;
  }

  /**
   * Очищает массив камней на доске. Очищает точку Ко (так как вызывает
   * clearStone).
   * @param {!Array<!Object>} points
   */
  clearSome(points) {
    for (var i = 0; i < points.length; i++) {
      this.clearStone(points[i]);
    }
  }

  /**
   * Попытка добавить камень на новый экземпляр доски го, но не изменяет состояние.
   *
   * @param {!Object} point
   * @param {string} color
   * @return {boolean} true / false в зависимости от того, было ли 'добавление' успешным.
   */
  testAddStone(point, color) {
    var ko = this.getKo();
    var addStoneResult = this.addStone(point, color);
    if (ko !== null) {
      this.setKo(ko);
    }

    // Отменяем наши изменения (это довольно неприятно). Сначала удаляем камень, а затем
    // добавляем захваты обратно.
    if (addStoneResult.successful) {
      this.clearStone(point);
      var oppositeColor = util.colors.oppositeColor(color);
      for (var i = 0; i < addStoneResult.captures.length; i++) {
        this.setColor(addStoneResult.captures[i], oppositeColor);
      }
    }
    return addStoneResult.successful;
  }

  /**
   * Добавляет камень на доску го (с индексацией с 0). Требуется пересечение (точка),
   * куда должен быть помещен камень, и цвет камня, который должен быть помещен.
   *
   * Гобан также отслеживает, где произошло последнее Ко. Последующие вызовы этого
   * метода аннулируют предыдущее Ко.
   *
   * @param {!Object} pt Точка
   * @param {string} color Состояние для добавления.
   * @return {!Object} Результат размещения и информация о том, было ли
   *    размещение успешным.
   */
  addStone(pt, color) {
    if (
      !(
        color === states.BLACK ||
        color === states.WHITE ||
        color === states.EMPTY
      )
    ) {
      throw 'Unknown color: ' + color;
    }

    // Не удалось добавить камень. Возвращаем неудачный StoneResult.
    if (!this.placeable(pt)) {
      return new StoneResult(false);
    }

    // Устанавливаем камень как активный и смотрим, что происходит!
    this.setColor(pt, color);

    // Сначала находим группы противоположного цвета на каждом из
    // кардинальных направлений.
    var capturedGroups = this.findCapturedGroups_(pt, color);

    if (capturedGroups.length === 0) {
      // Если ход не захватывает, то возможно, что ход является
      // самозахватом. Если есть захваченные группы, это не проблема.
      //
      // Итак, давайте найдем связанную группу для размещенного камня.
      var g = this.findConnected_(pt, color);
      if (g.liberties === 0) {
        // О нет! Ход является самозахватом.
        this.clearStone(pt);
        return new StoneResult(false);
      }
    }

    // Этот ход будет успешным, поэтому теперь мы аннулируем точку Ко.
    this.clearKo();

    // Удаляем захваченные камни с доски.
    var capturedPoints = [];
    for (var i = 0; i < capturedGroups.length; i++) {
      var g = capturedGroups[i];
      for (var j = 0; j < g.group.length; j++) {
        var capPoint = g.group[j].point;
        capturedPoints.push(capPoint);
        this.clearStone(capPoint);
      }
    }

    // Наконец, проверяем на Ко. Технически Ко возникает только тогда, когда один камень
    // захвачен и противник может захватить этот один камень обратно.
    //
    // Некоторые наборы правил указывают, что повторяющиеся позиции доски не допускаются.
    // Это слишком затратно и обычно не нужно, за исключением редких случаев для
    // этого UI.
    if (capturedPoints.length === 1) {
      var oppColor = util.colors.oppositeColor(color);
      var capPt = capturedPoints[0];

      // Пытаемся перезахватить и смотрим, что происходит.
      this.setColor(capPt, oppColor);
      var koCapturedGroups = this.findCapturedGroups_(capPt, oppColor);
      // Отменяем изменения, внесенные в доску.
      this.clearStone(capPt);
      if (koCapturedGroups.length === 1) {
        var g = koCapturedGroups[0];
        if (g.group.length === 1 && g.group[0].point.equals(pt)) {
          // Это Ко!!
          this.setKo(capPt);
          return new StoneResult(true, capturedPoints, capPt);
        }
      }
    }

    // Нет ко, но это го!
    return new StoneResult(true, capturedPoints);
  }

  /**
   * Для текущей позиции в дереве ходов загружает все значения камней
   * в гобан. Это включает размещения [AW,AB] и ходы [B,W].
   *
   * @param {!Object} movetree
   * @return {!CaptureResult} Черные и белые захваты.
   */
  loadStonesFromMovetree(movetree) {
    var colors = [states.BLACK, states.WHITE];
    var captures = { BLACK: [], WHITE: [] };
    for (var i = 0; i < colors.length; i++) {
      var color = colors[i];
      var placements = movetree.properties().getPlacementsAsPoints(color);
      for (var j = 0, len = placements.length; j < len; j++) {
        this.loadStone_({ point: placements[j], color: color }, captures);
      }
    }
    this.loadStone_(movetree.properties().getMove(), captures);
    return captures;
  }

  /**
   * Для текущей позиции в дереве ходов применяет операции очистки локаций (AE),
   * возвращая любые пересечения, которые были фактически очищены. Возвращает пустой
   * массив, если AE не существует или локации не были очищены.
   *
   * @param {!Object} movetree
   * @return {!Array<!Object>} очищенные камни.
   */
  applyClearLocationsFromMovetree(movetree) {
    var clearLocations = movetree.properties().getClearLocationsAsPoints();
    var outMoves = [];
    for (var i = 0; i < clearLocations.length; i++) {
      var pt = clearLocations[i];
      var color = this.clearStone(pt);
      if (color !== states.EMPTY) {
        outMoves.push({ point: pt, color: color });
      }
    }
    return outMoves;
  }

  /////////////////////
  // Private Methods //
  /////////////////////

  /**
   * Устанавливает цвет без выполнения какой-либо проверки. Используйте с осторожностью!!
   *
   * @param {!Object} pt
   * @param {string} color
   */
  setColor(pt, color) {
    this.stones_[pt.y()][pt.x()] = color;
  }

  /**
   * @param {!Object} point
   * @return {boolean} True, если точка находится за пределами границ.
   * @private
   */
  outBounds_(point) {
    return (
      util.outBounds(point.x(), this.intersections()) ||
      util.outBounds(point.y(), this.intersections())
    );
  }

  /**
   * @param {!Object} point
   * @return {boolean} True, если точка находится в пределах границ.
   * @private
   */
  inBounds_(point) {
    return (
      util.inBounds(point.x(), this.intersections()) &&
      util.inBounds(point.y(), this.intersections())
    );
  }

  /**
   * Получает соседей в пределах границ. Таким образом, может вернуть 2, 3 или 4 точки.
   *
   * @param {!Object} pt
   * @return {!Array<!Object>}
   * @private
   */
  neighbors_(pt) {
    // Кардинальные точки. Поскольку массивы индексируются с верхнего левого угла.
    const cardinals_ = {
      left: point(-1, 0),
      right: point(1, 0),
      up: point(0, -1),
      down: point(0, 1),
    };

    var out = [];
    for (var ckey in cardinals_) {
      var c = cardinals_[ckey];
      var outp = point(pt.x() + c.x(), pt.y() + c.y());
      if (this.inBounds_(outp)) {
        out.push(outp);
      }
    }
    return out;
  }

  /**
   * Получает захваты в точке с заданным цветом.
   *
   * @param {!Object} inPoint
   * @param {string} color
   * @return {!ConnectedGroup} Связанная группа с
   *    соответствующим количеством свобод.
   * @private
   */
  findConnected_(inPoint, color) {
    var group = new ConnectedGroup(color);
    var stack = [inPoint];
    while (stack.length > 0) {
      var pt = stack.pop();
      if (group.hasSeen(pt)) {
        continue;
      }
      var stone = this.getStone(pt);
      if (stone === color) {
        group.addStone(pt, color);
        var nbors = this.neighbors_(pt);
        for (var n = 0; n < nbors.length; n++) {
          stack.push(nbors[n]);
        }
      }
      if (stone === states.EMPTY) {
        group.addLiberty();
      }
    }
    return group;
  }

  /**
   * Находит захваченные группы, возникающие в результате размещения камня цвета
   * в точке pt. Это предполагает, что исходная точка уже размещена.
   *
   * @param {!Object} pt
   * @param {string} color
   * @return {!Array<ConnectedGroup>} Группы, которые были
   *    захвачены.
   */
  findCapturedGroups_(pt, color) {
    var oppColor = util.colors.oppositeColor(color);
    var groups = [];
    var nbors = this.neighbors_(pt);
    for (var i = 0; i < nbors.length; i++) {
      var nborPt = nbors[i];
      var alreadySeen = false;
      for (var j = 0; j < groups.length; j++) {
        var g = groups[j];
        if (g.hasSeen(nborPt)) {
          alreadySeen = true;
          break;
        }
      }
      if (!alreadySeen) {
        var newGroup = this.findConnected_(nborPt, oppColor);
        if (newGroup.group.length) {
          groups.push(newGroup);
        }
      }
    }

    var capturedGroups = [];
    for (var i = 0; i < groups.length; i++) {
      var g = groups[i];
      if (g.liberties === 0) {
        capturedGroups.push(g);
      }
    }
    return capturedGroups;
  }

  /**
   * Добавляет ход на доску го. Предназначено для использования из
   * loadStonesFromMovetree.
   *
   * @param {?Object} mv
   * @param {!CaptureResult} captures
   * @private
   */
  loadStone_(mv, captures) {
    // примечание: если mv определен, но mv.point не определен, это ПАС.
    if (mv && mv.point !== undefined) {
      var result = this.addStone(mv.point, mv.color);
      if (result.successful) {
        var oppositeColor = util.colors.oppositeColor(mv.color);
        for (var k = 0; k < result.captures.length; k++) {
          captures[oppositeColor].push(result.captures[k]);
        }
      }
    }
  }
}

/**
 * Связанная группа
 * @param {string} color
 *
 * @constructor @final @struct
 */
export class ConnectedGroup {
  constructor(color) {
    /** @private {string} */
    this.color = color;
    /** @private {number} */
    this.liberties = 0;
    /** @private {!Object<string, boolean>} */
    this.seen = {};
    /** @private {!Array<!Object>} */
    this.group = [];
  }

  /**
   * Добавляет некоторые свободы к группе.
   * @param {!Object} pt
   * @return {boolean} Была ли уже замечена данная точка
   */
  hasSeen(pt) {
    return this.seen[pt.toString()];
  }

  /**
   * Добавляет камень в группу. Обратите внимание, что точка не должна быть замечена и
   * цвет должен быть равен цвету группы.
   *
   * @param {!Object} pt
   * @param {string} color
   * @return {!ConnectedGroup} this
   */
  addStone(pt, color) {
    if (!this.seen[pt.toString()] && this.color === color) {
      this.seen[pt.toString()] = true;
      this.group.push({
        point: pt,
        color: color,
      });
    }
    return this;
  }

  /**
   * Добавляет некоторые свободы к группе.
   * @return {!ConnectedGroup} this
   */
  addLiberty() {
    this.liberties += 1;
    return this;
  }
}

/**
 * StoneResult отслеживает, было ли успешным размещение камня и какие
 * камни (если таковые имеются) были захвачены.
 *
 * @param {boolean} success Было ли успешным размещение камня.
 * @param {!Array<!Object>=} opt_captures Массив захваченных точек, если
 *    есть какие-либо захваты
 * @param {!Object=} opt_koPt Точка ко.
 * @constructor @final @struct
 */
export class StoneResult {
  constructor(success, opt_captures, opt_koPt) {
    /**
     * Было ли размещение успешным.
     * @type {boolean}
     */
    this.successful = success;

    /**
     * Массив захваченных точек.
     * @type {!Array<!Object>}
     */
    this.captures = opt_captures || [];

    /**
     * Точка, где есть Ко. Null, если она не существует.
     * @type {?Object}
     */
    this.koPt = opt_koPt || null;
  }
}

// Экспорт объекта для обратной совместимости
export const goban = {
  getInstance,
  getFromMoveTree
};

// Определяем пустые заглушки перед экспортом
// export const StoneResult = {};
// export const ConnectedGroup = {};
