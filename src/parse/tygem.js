/**
 * Модуль для разбора файлов формата Tygem (.gib)
 * @module parse/tygem
 */

import { movetree } from '../rules/movetree.js';
import { point } from '../util/index.js';

/**
 * Формат GIB (формат файлов Tygem) не является публичным, поэтому довольно
 * сложно узнать, является ли этот парсер действительно точным. Ну да ладно.
 *
 * Кроме того, это ужасный формат. И это довольно хакерский парсер.
 *
 * @param {string} gibString - Строка в формате GIB для разбора
 * @return {!Object} Дерево ходов
 */
export function tygem(gibString) {
  const states = {
    HEADER: 1,
    BODY: 2,
  };
  const colorToToken = { 1: 'B', 2: 'W' };

  const WHITE_NAME = 'GAMEWHITENAME';
  const BLACK_NAME = 'GAMEBLACKNAME';
  const KOMI = 'GAMECONDITION';

  const mt = movetree.getInstance();
  const lines = gibString.split('\n');

  const grabHeaderProp = function (name, line, prop, mt) {
    line = line.substring(
      line.indexOf(name) + name.length + 1,
      line.length - 2
    );
    if (/\\$/.test(line)) {
      // Это ужасный хак. Иногда \ появляется как последний символ
      line = line.substring(0, line.length - 1);
    }
    mt.properties().add(prop, line);
  };

  let curstate = states.HEADER;
  for (let i = 0, len = lines.length; i < len; i++) {
    const str = lines[i];
    const firstTwo = str.substring(0, 2);
    if (firstTwo === '\\[') {
      // Мы в заголовке.
      const eqIdx = str.indexOf('=');
      const type = str.substring(2, eqIdx);
      if (type === WHITE_NAME) {
        grabHeaderProp(WHITE_NAME, str, 'PW', mt);
      } else if (type === BLACK_NAME) {
        grabHeaderProp(BLACK_NAME, str, 'PB', mt);
      }
    } else if (firstTwo === 'ST') {
      if (curstate !== states.BODY) {
        // Мы в части с размещением камней и вышли из заголовка.
        curstate = states.BODY;
      }

      // Строки камней выглядят так:
      //     ? MoveNumber Color (1=B,2=W) x y
      // STO 0 2          2               15 15
      //
      // Обратите внимание, что доска индексируется с левого нижнего угла,
      // а не с левого верхнего, как в SGF. Также, пересечения индексируются с 0.
      const splat = str.split(' ');
      const colorToken = colorToToken[splat[3]];
      const x = parseInt(splat[4], 10);
      const y = parseInt(splat[5], 10);
      mt
        .addNode()
        .properties()
        .add(colorToken, point(x, y).toSgfCoord());
    }
  }
  return mt.getTreeFromRoot();
} 