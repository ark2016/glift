/**
 * Тесты для модуля widgetopt.
 * @module api/widgetopt/widgetopt_test
 */

import { WIDGET_TYPE } from '../../widget_type.js';
import { widgetopt } from './index.js';

/**
 * Запускает тесты для опций виджетов
 */
export function runTests() {
  describe('api.widgetopt', () => {
    // Список поддерживаемых типов виджетов
    const supportedList = [
      WIDGET_TYPE.BOARD_EDITOR,
      WIDGET_TYPE.CORRECT_VARIATIONS_PROBLEM,
      WIDGET_TYPE.EXAMPLE,
      WIDGET_TYPE.GAME_VIEWER,
      WIDGET_TYPE.REDUCED_GAME_VIEWER,
      WIDGET_TYPE.STANDARD_PROBLEM,
    ];

    const keys = [
      'controllerFunc',
      'enableMousewheel',
      'icons',
      'keyMappings',
      'markLastMove',
      'problemConditions',
      'showVariations',
      'statusBarIcons',
      'stoneClick',
      'stoneMouseout',
      'stoneMouseover',
    ];

    it('должен предоставлять все опции для всех типов виджетов', () => {
      for (let i = 0; i < supportedList.length; i++) {
        const widgetType = supportedList[i];
        const wfn = widgetopt[widgetType];
        expect(wfn).toBeDefined();
        
        const w = wfn();
        expect(w).toBeDefined();
        
        for (let j = 0; j < keys.length; j++) {
          expect(w).toHaveProperty(keys[j]);
        }
      }
    });
  });
}
