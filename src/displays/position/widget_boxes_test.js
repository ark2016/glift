/**
 * Тесты для классов WidgetBoxes и WidgetColumn
 * @module displays/position/widget_boxes_test
 */

import { WidgetBoxes, WidgetColumn } from './widget_boxes.js';
import { orientation } from '../../orientation/orientation.js';
import { util } from '../../util/util.js';
import { BoardComponent } from '../../enums.js';

describe('displays.position.widgetBoxesTest', () => {
  const defaultBbox1 = orientation.bbox.fromPts(
    util.point(0, 0),
    util.point(100, 100)
  );
  const defaultBbox2 = orientation.bbox.fromPts(
    util.point(10, 10),
    util.point(200, 200)
  );
  const defaultBbox3 = orientation.bbox.fromPts(
    util.point(10, 10),
    util.point(150, 300)
  );
  const comps = BoardComponent;

  const make = function () {
    return new WidgetBoxes();
  };

  it('Widget Column construction', () => {
    const w = new WidgetColumn();
    expect(w.mapping).toEqual({});
    expect(w.ordering).toEqual([]);
  });

  it('Widget Column: set/get', () => {
    const w = new WidgetColumn();
    w.setComponent(comps.BOARD, defaultBbox1);
    w.setComponent(comps.COMMENT_BOX, defaultBbox2);
    expect(w.getBbox(comps.BOARD)).toBe(defaultBbox1);
    expect(w.getBbox(comps.COMMENT_BOX)).toBe(defaultBbox2);
  });

  it('Widget Column: ordering: set/orderfn', () => {
    const w = new WidgetColumn();
    w.setOrderingFromRatioArray([
      { component: 'BOARD', ratio: 0.2 },
      { component: 'COMMENT_BOX', ratio: 0.3 },
      { component: 'ICONBAR', ratio: 0.4 },
    ]);
    const out = [];
    w.orderFn(function (compName) {
      out.push(compName);
    });
    expect(out).toEqual(['BOARD', 'COMMENT_BOX', 'ICONBAR']);
  });

  it('Must construct Widget boxes', () => {
    const b = make();
    expect(b._first).toBeNull();
    expect(b._second).toBeNull();
  });

  it('Widget Boxes: map', () => {
    const wboxes = new WidgetBoxes();
    wboxes.setFirst(
      new WidgetColumn()
        .setOrderingFromRatioArray([{ component: 'BOARD', ratio: 1 }])
        .setComponent('BOARD', defaultBbox1)
    );
    wboxes.setSecond(
      new WidgetColumn()
        .setOrderingFromRatioArray([
          { component: 'STATUS_BAR', ratio: 0.3 },
          { component: 'COMMENT_BOX', ratio: 0.3 },
          { component: 'ICONBAR', ratio: 0.4 },
        ])
        .setComponent('STATUS_BAR', defaultBbox1)
        .setComponent('COMMENT_BOX', defaultBbox2)
        .setComponent('ICONBAR', defaultBbox3)
    );
    const comps = [];
    const bboxes = [];
    wboxes.forEach(function (comp, bbox) {
      comps.push(comp);
      bboxes.push(bbox);
    });
    expect(comps).toEqual(['BOARD', 'STATUS_BAR', 'COMMENT_BOX', 'ICONBAR']);
    expect(bboxes).toEqual([defaultBbox1, defaultBbox1, defaultBbox2, defaultBbox3]);

    const pt = util.point;
    expect(wboxes.fullWidgetBbox()).toEqual(
      orientation.bbox.fromPts(pt(0, 0), pt(200, 300))
    );
  });
});
