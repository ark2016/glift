/**
 * Тесты для модуля sanitize.
 */
(() => {
  module('glift.dom.sanitizeTest');
  const sanitize = glift.dom.sanitize;

  /**
   * Группа тестов для проверки функциональности очистки HTML
   */
  QUnit.module('Очистка HTML', () => {
    test('Простой недопустимый тег должен быть экранирован', () => {
      deepEqual(sanitize('foo<zed>bar'), 'foo&lt;zed&gt;bar');
    });

    test('Вложенные теги должны корректно экранироваться', () => {
      deepEqual(sanitize('foo<<zed>>bar'), 'foo&lt;&lt;zed&gt;&gt;bar');
    });

    test('Опасные теги (script) должны экранироваться', () => {
      deepEqual(
        sanitize('foo<script>zed</script>bar'),
        'foo&lt;script&gt;zed&lt;/script&gt;bar'
      );
    });

    test('Разрешенные теги должны сохраняться', () => {
      const str = 'foo<b><i><br><strong><u><em>zed</b></i></br></strong></u></em>';
      deepEqual(sanitize(str), str);
    });

    test('Теги с атрибутами должны экранироваться', () => {
      const str = 'foo<b class="zed">';
      deepEqual(sanitize(str), 'foo&lt;b class="zed"&gt;');
    });

    test('Специальные символы должны экранироваться', () => {
      const str = '&\'"/';
      deepEqual(sanitize(str), '&amp;&#x27;&quot;&#x2F;');
    });
    
    test('Пустой ввод должен возвращать пустую строку', () => {
      deepEqual(sanitize(''), '');
      deepEqual(sanitize(null), '');
      deepEqual(sanitize(undefined), '');
    });
    
    test('Незакрытые теги должны корректно обрабатываться', () => {
      deepEqual(sanitize('foo<b>bar'), 'foo<b>bar');
      deepEqual(sanitize('foo<zed'), 'foo&lt;zed');
    });
  });
})();
