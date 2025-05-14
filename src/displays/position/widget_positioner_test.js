/**
 * Тесты для WidgetPositioner
 * @module displays/position/widget_positioner_test
 */

import { positioner, WidgetPositioner } from './widget_positioner.js';
import { orientation } from '../../orientation/orientation.js';
import { util } from '../../util/util.js';
import { enums, BoardComponent } from '../../enums.js';

describe('displays.position.widgetPositionerTest', () => {
  const point = util.point;
  const components = BoardComponent;
  const horzBbox = orientation.bbox.fromSides(point(100, 300), 300, 100);
  const vertBbox = orientation.bbox.fromSides(point(100, 300), 100, 300);
  const squareBbox = orientation.bbox.fromSides(point(100, 300), 200, 200);
  const oneColSplits = {
    first: [
      { component: 'STATUS_BAR', ratio: 0.08 },
      { component: 'BOARD', ratio: 0.7 },
      { component: 'COMMENT_BOX', ratio: 0.1 },
      { component: 'ICONBAR', ratio: 0.12 },
    ],
  };
  const twoColSplits = {
    first: [{ component: 'BOARD', ratio: 1 }],
    second: [
      { component: 'STATUS_BAR', ratio: 0.08 },
      { component: 'COMMENT_BOX', ratio: 0.8 },
      { component: 'ICONBAR', ratio: 0.12 },
    ],
  };

  // Вспомогательная функция-конструктор с большим количеством значений по умолчанию.
  const construct = function (options) {
    options = options || {};
    return new WidgetPositioner(
      options.divBox || squareBbox,
      options.boardRegion || enums.boardRegions.ALL,
      options.intersections || 19,
      options.componentsToUse || [
        components.BOARD,
        components.COMMENT_BOX,
        components.ICONBAR,
        components.STATUS_BAR,
      ],
      options.oneColSplits || oneColSplits,
      options.twoColSplits || twoColSplits
    );
  };

  const floatsEqual = function (f1, f2, sigs) {
    if (!sigs) throw new Error('Sigs must be defined. was: ' + sigs);
    if (typeof f1 !== 'number')
      throw new Error('First arg must be number. was: ' + f1);
    if (typeof f2 !== 'number')
      throw new Error('Second arg must be number. was: ' + f2);
    let tens = 1;
    for (let i = 0; i < sigs; i++) {
      tens = tens * 10;
    }
    const left = Math.round(f1 * tens) / tens;
    const right = Math.round(f2 * tens) / tens;
    expect(left).toEqual(right);
  };

  it('floats equal', () => {
    floatsEqual(100, 100, 1);
    floatsEqual(100, 100, 3);
    floatsEqual(100.00002, 100.00003, 3);
  });

  it('Must construct', () => {
    const p = construct();
    expect(p).toBeTruthy();
    expect(p.divBox).toBeTruthy();
    expect(p.ints).toBeTruthy();
    expect(p.compsToUse).toBeTruthy();
    expect(p.oneColSplits).toBeTruthy();
    expect(p.twoColSplits).toBeTruthy();
  });

  it('Orientations', () => {
    expect(construct().useHorzOrientation()).toBeFalsy();
    expect(construct({ divBox: horzBbox }).useHorzOrientation()).toBeTruthy();
    expect(construct({ divBox: vertBbox }).useHorzOrientation()).toBeFalsy();
  });

  it('Recalc Splits: one col, no change', () => {
    const positioner = construct();
    const out = positioner.recalcSplits(positioner.oneColSplits);
    const before = positioner.oneColSplits.first;
    const after = out.first;
    floatsEqual(before[0].ratio, after[0].ratio, 7);
    floatsEqual(before[1].ratio, after[1].ratio, 7);
    floatsEqual(before[2].ratio, after[2].ratio, 7);
    floatsEqual(before[3].ratio, after[3].ratio, 7);
  });

  it('Recalc Splits: two cols, no change', () => {
    const positioner = construct();
    const before = positioner.twoColSplits;
    const after = positioner.recalcSplits(positioner.twoColSplits);
    expect(before.first[0].component).toEqual('BOARD');
    expect(before.first[0].ratio).toEqual(1);

    floatsEqual(before.second[0].ratio, after.second[0].ratio, 7);
    floatsEqual(before.second[1].ratio, after.second[1].ratio, 7);
    floatsEqual(before.second[2].ratio, after.second[2].ratio, 7);
  });

  it('Recalc Splits: one col, only one comp', () => {
    const positioner = construct({
      componentsToUse: [components.COMMENT_BOX],
    });
    const after = positioner.recalcSplits(positioner.oneColSplits).first;
    expect(after.length).toEqual(1);
    expect(after[0].component).toEqual('COMMENT_BOX');
    expect(after[0].ratio).toEqual(1);
  });

  it('Recalc Splits: one col, -one comp', () => {
    const positioner = construct({
      componentsToUse: [
        components.BOARD,
        components.ICONBAR,
        components.COMMENT_BOX,
      ],
      oneColSplits: {
        first: [
          { component: 'STATUS_BAR', ratio: 0.4 },
          { component: 'BOARD', ratio: 0.4 },
          { component: 'COMMENT_BOX', ratio: 0.1 },
          { component: 'ICONBAR', ratio: 0.1 },
        ],
      },
    });
    const out = positioner.recalcSplits(positioner.oneColSplits);
    const after = out.first;
    expect(after).toBeDefined();
    expect(after.length).toEqual(3);

    expect(after[0].component).toEqual('BOARD');
    floatsEqual(after[0].ratio, 0.666667, 5);
    expect(after[1].component).toEqual('COMMENT_BOX');
    floatsEqual(after[1].ratio, 0.166667, 5);
    expect(after[2].component).toEqual('ICONBAR');
    floatsEqual(after[2].ratio, 0.166667, 5);
  });

  it('Recalc Splits: one col, -two comps', () => {
    const positioner = construct({
      componentsToUse: [components.BOARD, components.COMMENT_BOX],
      oneColSplits: {
        first: [
          { component: 'STATUS_BAR', ratio: 0.4 },
          { component: 'BOARD', ratio: 0.4 },
          { component: 'COMMENT_BOX', ratio: 0.1 },
          { component: 'ICONBAR', ratio: 0.1 },
        ],
      },
    });
    const after = positioner.recalcSplits(positioner.oneColSplits).first;
    expect(after.length).toEqual(2);
    expect(after[0].component).toEqual('BOARD');
    floatsEqual(after[0].ratio, 0.8, 5);
    expect(after[1].component).toEqual('COMMENT_BOX');
    floatsEqual(after[1].ratio, 0.2, 5);
  });

  it('Recalc Splits: two cols, -one comp', () => {
    const positioner = construct({
      componentsToUse: [
        components.BOARD,
        components.ICONBAR,
        components.COMMENT_BOX,
      ],
      twoColSplits: {
        first: [{ component: 'BOARD', ratio: 1 }],
        second: [
          { component: 'STATUS_BAR', ratio: 0.6 },
          { component: 'COMMENT_BOX', ratio: 0.3 },
          { component: 'ICONBAR', ratio: 0.1 },
        ],
      },
    });
    const out = positioner.recalcSplits(positioner.twoColSplits);
    expect(out.first.length).toEqual(1);
    expect(out.first[0].component).toEqual('BOARD');
    expect(out.first[0].ratio).toEqual(1);

    expect(out.second.length).toEqual(2);
    expect(out.second[0].component).toEqual('COMMENT_BOX');
    floatsEqual(out.second[0].ratio, 0.75, 5);
    expect(out.second[1].component).toEqual('ICONBAR');
    floatsEqual(out.second[1].ratio, 0.25, 5);
  });

  it('Position widget vertically', () => {
    const boxes = construct().calcVertPositioning();
    expect(boxes).toBeDefined();
    expect(boxes.first()).toBeDefined();
    expect(boxes.first().ordering.length).toEqual(4);
    expect(boxes.first().ordering).toEqual([
      'STATUS_BAR',
      'BOARD',
      'COMMENT_BOX',
      'ICONBAR',
    ]);
  });

  it('Position widget horizontally', () => {
    // Используем большой контейнер, чтобы обеспечить горизонтальную ориентацию.
    const boxes = construct({ divBox: horzBbox }).calcHorzPositioning();
    expect(boxes).toBeDefined();
    expect(boxes.first()).toBeDefined();
    expect(boxes.second()).toBeDefined();
    expect(boxes.first().ordering.length).toEqual(1);
    expect(boxes.second().ordering.length).toEqual(3);
    expect(boxes.first().ordering).toEqual(['BOARD']);
    expect(boxes.second().ordering).toEqual([
      'STATUS_BAR',
      'COMMENT_BOX',
      'ICONBAR',
    ]);
  });
});
