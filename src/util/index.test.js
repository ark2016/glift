/**
 * Тесты для модуля util.
 */

import { defined, uuid, mergeObjects } from './index.js';

describe('Модуль util', () => {
  describe('defined', () => {
    test('должен возвращать true для определенных значений', () => {
      expect(defined(0)).toBe(true);
      expect(defined('')).toBe(true);
      expect(defined(false)).toBe(true);
      expect(defined({})).toBe(true);
      expect(defined([])).toBe(true);
    });

    test('должен возвращать false для undefined и null', () => {
      expect(defined(undefined)).toBe(false);
      expect(defined(null)).toBe(false);
    });
  });

  describe('uuid', () => {
    test('должен генерировать строку нужного формата', () => {
      const id = uuid();
      expect(typeof id).toBe('string');
      expect(id.length).toBe(36);
      expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
    });

    test('должен генерировать уникальные идентификаторы', () => {
      const ids = new Set();
      for (let i = 0; i < 100; i++) {
        ids.add(uuid());
      }
      expect(ids.size).toBe(100);
    });
  });

  describe('mergeObjects', () => {
    test('должен объединять объекты', () => {
      const target = { a: 1 };
      const source1 = { b: 2 };
      const source2 = { c: 3 };
      
      const result = mergeObjects(target, source1, source2);
      
      expect(result).toEqual({ a: 1, b: 2, c: 3 });
      expect(result).toBe(target); // должен изменять оригинальный объект
    });

    test('должен переопределять свойства', () => {
      const target = { a: 1, b: 2 };
      const source = { b: 3, c: 4 };
      
      const result = mergeObjects(target, source);
      
      expect(result).toEqual({ a: 1, b: 3, c: 4 });
    });
  });
}); 