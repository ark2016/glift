# Glift: Современная библиотека для игры Го

**Glift** - это модульная JavaScript-библиотека для отображения и взаимодействия с игрой Го (бадук, вейци) в браузере.

## Что нового в версии 2.0

- Полностью переписана с использованием современных ES-модулей
- Удалена зависимость от Google Closure Compiler
- Добавлена поддержка Jest для тестирования
- Улучшена документация и JSDoc-аннотации
- Повышена производительность рендеринга SVG
- Добавлена ​​поддержка современных браузеров и мобильных устройств

## Особенности

- Отображение и взаимодействие с SGF-файлами
- Поддержка различных тем оформления
- Адаптивный дизайн для различных размеров экрана
- Возможность создания задач и проблем
- Поддержка комментариев и вариаций

## Установка

```bash
npm install glift-ui
```

## Быстрый старт

```html
<!DOCTYPE html>
<html>
<head>
  <title>Пример Glift</title>
  <script src="dist/glift.min.js"></script>
</head>
<body>
  <div id="glift_display" style="width: 650px; height: 600px;"></div>
  <script>
    glift.create({
      divId: 'glift_display',
      sgf: 'path/to/game.sgf',
      display: {
        theme: 'DEPTH',
        drawBoardCoords: true
      },
      sgfDefaults: {
        widgetType: 'GAME_VIEWER'
      }
    });
  </script>
</body>
</html>
```

## Модульное использование (ES Modules)

```javascript
import { create } from 'glift-ui';

const player = create({
  divId: 'glift_display',
  sgf: 'path/to/game.sgf',
  display: {
    theme: 'DEPTH'
  }
});
```

## Основные модули

### DOM

Модуль `dom` предоставляет абстракцию над DOM API для облегчения манипуляций с элементами.

```javascript
import { dom } from 'glift-ui';

// Создание элемента
const container = dom.newDiv('glift-container');
container.css({
  width: '400px',
  height: '400px'
});

// Добавление в DOM
document.body.appendChild(container.el);
```

### SVG

Модуль `svg` предоставляет интерфейс для создания и управления SVG элементами.

```javascript
import { svg } from 'glift-ui';

// Создание SVG холста
const board = svg.svg({
  width: '400',
  height: '400',
  viewBox: '0 0 400 400'
});

// Добавление черного камня
const blackStone = svg.circle({
  cx: '100',
  cy: '100',
  r: '15',
  fill: 'black'
});

board.append(blackStone);
```

### Util

Модуль `util` содержит вспомогательные функции.

```javascript
import { util } from 'glift-ui';

// Генерация уникального ID
const id = util.uuid();

// Объединение объектов
const options = util.mergeObjects(defaults, userOptions);
```

## Документация API

### Основные методы

#### create(options)

Создает новый экземпляр Glift с указанными параметрами.

```javascript
const player = glift.create({
  // Обязательный параметр - ID элемента для отображения
  divId: 'glift_display',
  
  // Путь к SGF-файлу или строка SGF
  sgf: 'path/to/game.sgf',
  
  // Настройки отображения
  display: {
    // Тема оформления (DEFAULT, DEPTH, MOODY, TRANSPARENT, TEXTBOOK)
    theme: 'DEPTH',
    
    // Отображать координаты доски
    drawBoardCoords: true,
    
    // Фоновое изображение доски
    goBoardBackground: 'path/to/board.jpg'
  },
  
  // Настройки SGF
  sgfDefaults: {
    // Тип виджета (GAME_VIEWER, PROBLEM_VIEWER и т.д.)
    widgetType: 'GAME_VIEWER'
  },
  
  // Обработчики событий
  hooks: {
    // Вызывается при правильном решении проблемы
    problemCorrect: () => {
      console.log('Проблема решена правильно!');
    }
  }
});
```

## Разработка

### Требования

- Node.js 14+
- npm 6+

### Установка зависимостей

```bash
npm install
```

### Запуск для разработки

```bash
npm run dev
```

### Сборка для production

```bash
npm run build
```

### Запуск тестов

```bash
npm test
```

## Обратная совместимость

Для обеспечения обратной совместимости со старыми скриптами, использующими Glift, библиотека все еще создает глобальный объект `glift` при загрузке.

## Лицензия

MIT License
