/**
 * Модуль для работы с путями в дереве ходов.
 * @module rules/treepath
 */

import { util } from '../../src/util/util.js';

/**
 * @typedef {!Array<number>}
 */
export let Treepath;

/**
 * Результат применения пути к дереву ходов.
 *
 * @typedef {{
 *  movetree: !Object,
 *  stones: !Array<!Object>
 * }}
 */
export let AppliedTreepath;

/**
 * Опции для поиска findNextMovesPath.
 *
 * initTreepath: Начальный путь. Если не указан или undefined, используется
 *    текущее положение в дереве ходов
 * minusMovesOverride: Заставляет findNextMoves возвращать
 *    nextMovesPath этой длины, начиная с начального пути. Фактический
 *    nextMovesPath может быть короче, если есть прерывание, но это устанавливает
 *    верхний предел.
 * breakOnComment: Прерывать ли на комментариях в основной вариации.
 *    По умолчанию true, если не указано.
 *
 * @typedef {{
 *  initTreepath: (!Array<number>|undefined),
 *  minusMovesOverride: (number|undefined),
 *  breakOnComment: (boolean|undefined),
 * }}
 */
export let NextMovesPathOptions;

/**
 * # Treepath (Путь в дереве)
 *
 * Treepath - это список вариаций, который указывает, как перемещаться по дереву
 * ходов. Так,
 *
 *    [0,1,0]
 *
 * Означает, что мы сначала возьмем 0-ю вариацию, затем 1-ю вариацию, и, наконец,
 * снова 0-ю вариацию. Для удобства путь также может быть указан строкой, где
 * начинается самое интересное. В простейшем случае,
 *
 *    [0,0,0] становится 0.0.0
 *
 * но есть несколько различных сокращений, которые делают использование путей
 * немного проще
 *
 *    0.1+    Взять 0-ю вариацию, затем 1-ю вариацию, затем перейти к концу
 *    0.1:2   Взять 0-ю вариацию, затем повторно взять 1-ю вариацию дважды
 *
 * Ниже обсуждаются два типа путей -- *фрагмент пути*
 * (который мы описывали) и *начальный путь*.
 *
 * ## Фрагменты пути
 *
 * Пути указывают, как перейти от позиции n к позиции m. Таким образом, числа
 * всегда являются вариациями, за исключением случая синтаксиса AxB, где B - множитель
 * для вариации.
 *
 * Вот как анализируются строки фрагментов:
 *
 *    0             становится [0]
 *    1             становится [1]
 *    53            становится [53] (53-я вариация)
 *    2.3           становится [2,3]
 *    0.0.0.0       становится [0,0,0]
 *    0:4           становится [0,0,0,0]
 *    1+            становится [1,0...(500 раз)]
 *    1:4           становится [1,1,1,1]
 *    1.2:1.0.2:3'  становится [1,2,0,2,2,2]
 *
 * ## Начальные пути.
 *
 * Начальный путь всегда рассматривает первое число как 'номер хода'
 * вместо вариации. Таким образом
 *
 *    3.1.0
 *
 * означает начать с хода 3 (всегда принимая путь 0-й вариации), а затем взять
 * фрагмент пути [1,0].
 *
 * Некоторые примеры:
 *
 *    0         - Начать с 0-го хода (корневого узла)
 *    53        - Начать с 53-го хода (принимая 0-ю вариацию)
 *    2.3       - Начать с 3-й вариации на ходе 2 (фактически ход 3)
 *    3         - Начать с 3-го хода
 *    2.0       - Начать с 3-го хода
 *    0.0.0.0   - Начать с 3-го хода
 *    0.0:3     - Начать с 3-го хода
 *
 * Как и с фрагментами, возвращаемая начальная позиция - это массив номеров
 * вариаций, через которые проходят. Номер хода точно равен длине массива.
 *
 * Так, при анализе
 *
 *    0         становится []
 *    1         становится [0]
 *    0.1       становится [1]
 *    53        становится [0,0,0,...,0] (53 раза)
 *    2.3       становится [0,0,3]
 *    0.0.0.0   становится [0,0,0]
 *    1+        становится [0,0,...(500 раз)]
 *    0.1+      становится [1,0,...(500 раз)]
 *    0.2.6+    становится [2,6,0,...(500 раз)]
 *    0.0:3.1x3 становится [0,0,0,1,1,1]
 *
 * Как упоминалось ранее, '+' - это специальный символ, который означает "перейти к концу через
 * первую вариацию". Это реализовано путем добавления 500 нулей к
 * массиву пути. Это хак, но на практике игры не превышают 500 ходов.
 *
 * Устаревший синтаксис:
 *    2.3-4.1 становится [0,0,3,0,1]
 */

/**
 * Возвращает путь к концу дерева.
 * @return {!Array<number>} Путь к концу.
 * @private
 */
function toEnd_() {
  var path = [];
  for (var i = 0; i < 500; i++) {
    path.push(0);
  }
  return path;
}

/**
 * Анализирует начальный путь
 *
 * @param {number|string|!Array<number>|undefined} initPos Начальная
 *    позиция, которая может быть определена различными типами.
 * @return {!Array<number>}
 */
export function parseInitialPath(initPos) {
  if (initPos === undefined) {
    return [];
  } else if (util.typeOf(initPos) === 'number') {
    initPos = parseInt(initPos, 10) + '';
  } else if (util.typeOf(initPos) === 'array') {
    return initPos;
  } else if (util.typeOf(initPos) === 'string') {
    // Fallthrough and parse the path.  This is the expected behavior.
  } else {
    return [];
  }

  if (initPos === '+') {
    // Should this syntax even be allowed?
    return toEnd_();
  }

  var out = [];
  var firstNum = parseInt(initPos, 10);
  for (var j = 0; j < firstNum; j++) {
    out.push(0);
  }

  // The only valid next characters are . or +.
  var rest = initPos.replace(firstNum + '', '');
  if (rest == '') {
    return out;
  }

  var next = rest.charAt(0);
  if (next === '.') {
    return out.concat(parseFragment(rest.substring(1)));
  } else if (next === '+') {
    return out.concat(toEnd_());
  } else {
    throw new Error('Unexpected token [' + next + '] for path ' + initPos);
  }
}

/**
 * Фрагменты путей похожи на строки путей, за исключением того, что фрагменты путей
 * разрешают только синтаксис 0.0.1.0 или [0,0,1,0]. Кроме того, пути вроде 3.2.1
 * преобразуются в [3,2,1], а не в [0,0,0,2,1].
 *
 * @param {!Array<number>|string} pathStr Начальный путь.
 * @return {!Array<number>} Проанализированный путь.
 */
export function parseFragment(pathStr) {
  if (!pathStr) {
    pathStr = [];
  }
  var vartype = util.typeOf(pathStr);
  if (vartype === 'array') {
    // Assume the array is in the correct format.
    return pathStr;
  }
  if (vartype !== 'string') {
    throw new Error(
      'When parsing fragments, type should be string. was: ' + vartype
    );
  }
  var splat = pathStr.split(/([\.:+])/);
  var numre = /^\d+$/;
  var out = [];

  var states = {
    VARIATION: 1,
    SEPARATOR: 2,
    NUMBER: 3,
  };
  var curstate = states.VARIATION;
  var accum = 0;
  var repetitions = 0; // How many times to repeat a number
  var repnext = false; // A flag to track repeating a variation
  var appendNum = function (addval) {
    if (repnext) {
      // We need to execute any repetitions we've accumulated
      // Note: we decr repnext to account for the one we've already added.
      repetitions -= 1;
      for (var j = 0; j < repetitions; j++) {
        out.push(addval);
      }
      repetitions = 0;
      repnext = false;
    }
    out.push(addval);
    accum = 0;
  };

  for (var i = 0; i < splat.length; i++) {
    var token = splat[i];
    if (token === '.' || token === ':' || token === '+') {
      if (curstate === states.VARIATION && token === '+') {
        // We're describing a path to the end.
        appendNum(accum);
        return out.concat(toEnd_());
      } else if (curstate === states.VARIATION && token === '.') {
        appendNum(accum);
        curstate = states.VARIATION;
      } else if (curstate === states.VARIATION && token === ':') {
        // A repetition is coming.
        curstate = states.NUMBER;
      } else {
        // This is weird. We're repeating a repetition.
        throw new Error('Unexpected state (2) for path: ' + pathStr);
      }
    } else if (numre.test(token)) {
      if (curstate === states.VARIATION) {
        accum = parseInt(token, 10);
      } else if (curstate === states.NUMBER) {
        repetitions = parseInt(token, 10);
        for (var j = 0; j < repetitions; j++) {
          out.push(accum);
        }
        accum = 0;
        repetitions = 0;
        curstate = states.VARIATION;
      } else {
        throw new Error('Unexpected state (3) for path: ' + pathStr);
      }
    } else if (token !== '') {
      throw new Error('Unexpected token: [' + token + ']' + ' for path ' + pathStr);
    }
  }
  if (accum !== 0) {
    appendNum(accum);
  }
  return out;
}

/**
 * Находит следующие ходы, где следующие ходы - это ходы, которые должны быть
 * воспроизведены при создании sgf.
 *
 * @param {!Object} movetree Дерево ходов.
 * @param {NextMovesPathOptions=} opt_options Опции для findNextMovesPath.
 * @return {!Array<number>} Ходы, которые следует предпринять.
 */
export function findNextMovesPath(movetree, opt_options) {
  var options = opt_options || {};
  var initTreepath = options.initTreepath;
  var initPos = initTreepath;
  if (initPos !== undefined && util.typeOf(initPos) === 'string') {
    initPos = parseFragment(initPos);
  } else if (initPos === undefined) {
    initPos = [];
  }
  var breakOnComment = options.breakOnComment;
  if (breakOnComment === undefined) {
    breakOnComment = true;
  }

  var mt = movetree.getTreeFromRoot(initPos);
  var minusMovesOverride = options.minusMovesOverride;

  var nextMovesPath = []; // The treepath, starting from initPos.
  for (var i = 0; i < 500 && mt.node().numChildren() > 0; i++) {
    if (mt.node().numChildren() > 1) {
      if (minusMovesOverride !== undefined) {
        break;
      }
      break;
    } else if (breakOnComment && mt.properties().hasComment()) {
      if (minusMovesOverride !== undefined) {
        break;
      }
      if (i > 0) {
        break;
      }
    }
    nextMovesPath.push(0);
    mt.moveDown(0);
  }

  // If we've specified a minusMovesOverride, we use that instead of guessing
  // based on variations or comments.
  if (minusMovesOverride !== undefined) {
    nextMovesPath = nextMovesPath.slice(0, minusMovesOverride);
  }
  return nextMovesPath;
}

/**
 * Находит длину пути из корня до текущего узла.
 * @param {!Object} movetree Дерево ходов
 * @return {number} Длина пути
 */
export function treepathToHere(movetree) {
  var mt = movetree.newTreeRef();
  var n = 0;
  while (mt.node().getParent()) {
    n++;
    mt.moveUp();
  }
  return n;
}

/**
 * Деконструирует путь, удаляя ход из конца.
 * @param {!Array<number>} treepath
 * @return {!Array<number>} Новый путь с удаленным последним ходом.
 */
export function flattenTreepath(treepath) {
  if (treepath.length === 0) {
    return [];
  }
  var newTreepath = treepath.slice(0, treepath.length - 1);
  return newTreepath;
}

/**
 * Применяет действие с путем. Обычно возвращает дерево ходов, настроенное на
 * определенный пути, и массив камней, добавленных последним ходом.
 * @param {!Object} movetree Дерево ходов
 * @param {!Array<number>} treepath Путь в дереве
 * @return {!AppliedTreepath} Путь применен к дереву ходов.
 */
export function applyNextMove(movetree, treepath) {
  var mt = movetree.getTreeFromRoot();
  var stones = [];
  if (treepath.length === 0) {
    // This is a bit of a hack, but we need to re-evaluate the SGF. I'm not quite
    // sure how this happens.
    mt.validateMove();
    return { movetree: mt, stones: stones };
  }
  var lastMove = treepath[treepath.length - 1];
  var partpath = treepath.slice(0, treepath.length - 1);
  for (var i = 0; i < partpath.length; i++) {
    var nextVariation = partpath[i];
    mt.moveDown(nextVariation);
  }
  var move = mt.node().getChild(lastMove).properties().getMove();
  if (move && move.point) {
    stones.push(move);
  }
  mt.moveDown(lastMove);
  return { movetree: mt, stones: stones };
}

// Экспорт объекта для обратной совместимости
export const treepath = {
  parseInitialPath,
  parseFragment,
  findNextMovesPath,
  treepathToHere,
  flattenTreepath,
  applyNextMove
};
