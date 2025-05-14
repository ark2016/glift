/**
 * Тесты для DOM-модуля
 */
import * as dom from './dom.js';

// Настройка JSDOM-окружения для тестов
describe('DOM-модуль', () => {
  // Подготовка документа перед каждым тестом
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="test-div"></div>
    `;
  });

  test('selectId должен находить элемент по ID', () => {
    const element = dom.selectId('test-div');
    expect(element).not.toBeNull();
    expect(element.el.id).toBe('test-div');
  });

  test('newDiv должен создавать новый div элемент', () => {
    const div = dom.newDiv('new-div');
    expect(div.el.tagName).toBe('DIV');
    expect(div.el.id).toBe('new-div');
  });

  test('newElement должен создавать элемент указанного типа', () => {
    const span = dom.newElement('span');
    expect(span.el.tagName).toBe('SPAN');
  });

  test('Element.text должен устанавливать текстовое содержимое', () => {
    const div = dom.selectId('test-div');
    div.text('Тестовый текст');
    expect(div.el.textContent).toBe('Тестовый текст');
  });

  test('Element.html должен устанавливать HTML-содержимое', () => {
    const div = dom.selectId('test-div');
    div.html('<span>Тестовый HTML</span>');
    expect(div.el.innerHTML).toBe('<span>Тестовый HTML</span>');
  });

  test('Element.css должен применять стили', () => {
    const div = dom.selectId('test-div');
    div.css({
      color: 'red',
      backgroundColor: 'blue'
    });
    expect(div.el.style.color).toBe('red');
    expect(div.el.style.backgroundColor).toBe('blue');
  });

  test('Element.addClass должен добавлять класс', () => {
    const div = dom.selectId('test-div');
    div.addClass('test-class');
    expect(div.el.classList.contains('test-class')).toBe(true);
  });

  test('Element.removeClass должен удалять класс', () => {
    const div = dom.selectId('test-div');
    div.addClass('test-class');
    div.removeClass('test-class');
    expect(div.el.classList.contains('test-class')).toBe(false);
  });

  test('Element.append должен добавлять дочерний элемент', () => {
    const parent = dom.selectId('test-div');
    const child = dom.newElement('span');
    child.text('Дочерний элемент');
    parent.append(child);
    expect(parent.el.firstChild).toBe(child.el);
  });

  test('sanitize должен безопасно обрабатывать HTML', () => {
    const maliciousInput = '<script>alert("XSS")</script>';
    const sanitized = dom.sanitize(maliciousInput);
    expect(sanitized).not.toContain('<script>');
  });
}); 