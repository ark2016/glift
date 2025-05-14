/**
 * Тесты для SVG-модуля
 */
import * as svg from './index.js';

describe('SVG-модуль', () => {
  // Очищаем DOM после каждого теста
  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('svg должен создавать SVG элемент', () => {
    const svgEl = svg.svg({ width: '100', height: '100' });
    expect(svgEl.element.tagName).toBe('svg');
    expect(svgEl.element.getAttribute('width')).toBe('100');
    expect(svgEl.element.getAttribute('height')).toBe('100');
  });

  test('group должен создавать элемент группы', () => {
    const group = svg.group();
    expect(group.element.tagName).toBe('g');
  });

  test('circle должен создавать элемент круга', () => {
    const circle = svg.circle({ cx: '50', cy: '50', r: '20' });
    expect(circle.element.tagName).toBe('circle');
    expect(circle.element.getAttribute('cx')).toBe('50');
    expect(circle.element.getAttribute('cy')).toBe('50');
    expect(circle.element.getAttribute('r')).toBe('20');
  });

  test('path должен создавать элемент пути', () => {
    const path = svg.path({ d: 'M10,10 L50,50' });
    expect(path.element.tagName).toBe('path');
    expect(path.element.getAttribute('d')).toBe('M10,10 L50,50');
  });

  test('line должен создавать элемент линии', () => {
    const line = svg.line({ x1: '10', y1: '10', x2: '50', y2: '50' });
    expect(line.element.tagName).toBe('line');
    expect(line.element.getAttribute('x1')).toBe('10');
    expect(line.element.getAttribute('y1')).toBe('10');
    expect(line.element.getAttribute('x2')).toBe('50');
    expect(line.element.getAttribute('y2')).toBe('50');
  });

  test('image должен создавать элемент изображения', () => {
    const image = svg.image({ href: 'image.png', width: '100', height: '100' });
    expect(image.element.tagName).toBe('image');
    expect(image.element.getAttribute('href')).toBe('image.png');
    expect(image.element.getAttribute('width')).toBe('100');
    expect(image.element.getAttribute('height')).toBe('100');
  });

  test('SvgElement.setAttr должен устанавливать атрибуты', () => {
    const svgEl = svg.svg();
    svgEl.setAttr('width', '200');
    expect(svgEl.element.getAttribute('width')).toBe('200');
    
    svgEl.setAttr({ height: '200', viewBox: '0 0 200 200' });
    expect(svgEl.element.getAttribute('height')).toBe('200');
    expect(svgEl.element.getAttribute('viewBox')).toBe('0 0 200 200');
  });

  test('SvgElement.setId должен устанавливать ID', () => {
    const svgEl = svg.svg();
    svgEl.setId('test-svg');
    expect(svgEl.element.getAttribute('id')).toBe('test-svg');
  });

  test('SvgElement.append должен добавлять дочерний элемент', () => {
    const svgEl = svg.svg();
    const circle = svg.circle();
    svgEl.append(circle);
    expect(svgEl.element.firstChild).toBe(circle.element);
  });

  test('IdGenerator должен генерировать ID с префиксом', () => {
    const idGen = svg.ids.gen('test');
    expect(idGen.id('suffix')).toBe('test_suffix');
    expect(idGen.intersections()).toBe('test_intersections');
    expect(idGen.lines()).toBe('test_lines');
    expect(idGen.starpoints()).toBe('test_starpoints');
    expect(idGen.stones()).toBe('test_stones');
    expect(idGen.marks()).toBe('test_marks');
  });
}); 