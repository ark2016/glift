/**
 * Тесты для основного модуля библиотеки Glift
 */

// Мокаем зависимости, которые могут вызвать проблемы в тестах
jest.mock('./widgets/index.js', () => ({
  // Заглушки для модуля widgets
}));

jest.mock('./controllers/index.js', () => ({
  // Заглушки для модуля controllers
}));

jest.mock('./displays/index.js', () => ({
  // Заглушки для модуля displays
}));

jest.mock('./api/index.js', () => ({
  create: jest.fn()
}));

import * as glift from './index.js';

describe('Основной модуль Glift', () => {
  test('должен экспортировать версию', () => {
    expect(glift.VERSION).toBe('2.0.0-alpha');
  });

  test('должен экспортировать глобальный объект', () => {
    expect(glift.global).toBeDefined();
    expect(glift.global.version).toBe('2.0.0-alpha');
    expect(glift.global.instanceRegistry).toBeDefined();
  });

  test('должен экспортировать основные модули', () => {
    expect(glift.util).toBeDefined();
    expect(glift.widgets).toBeDefined();
    expect(glift.displays).toBeDefined();
    expect(glift.controllers).toBeDefined();
    expect(glift.themes).toBeDefined();
    expect(glift.api).toBeDefined();
    expect(glift.dom).toBeDefined();
  });

  test('должен экспортировать функцию create', () => {
    expect(typeof glift.create).toBe('function');
  });
}); 