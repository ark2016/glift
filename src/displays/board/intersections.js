/**
 * Модуль для работы с пересечениями на доске Го.
 * 
 * @module displays/board/intersections
 */

import { enums } from '../../util/enums.js'; // Добавлено для states
import * as svg from '../../svg/index.js'; // Добавлено для svg

/**
 * Класс для управления пересечениями на доске Го.
 */
export class Intersections {
  /**
   * @param {string} divId - ID div-контейнера
   * @param {Object} svg - SVG группа для пересечений
   * @param {Object} boardPoints - Точки доски
   * @param {Object} theme - Тема оформления
   * @param {string} rotation - Поворот доски
   */
  constructor(divId, svg, boardPoints, theme, rotation) {
    /**
     * ID div-контейнера.
     * @type {string}
     * @private
     */
    this.divId_ = divId;
    
    /**
     * SVG группа для пересечений.
     * @type {Object}
     * @private
     */
    this.svg_ = svg;
    
    /**
     * Точки доски.
     * @type {Object}
     * @private
     */
    this.boardPoints_ = boardPoints;
    
    /**
     * Тема оформления.
     * @type {Object}
     * @private
     */
    this.theme_ = theme;
    
    /**
     * Поворот доски.
     * @type {string}
     * @private
     */
    this.rotation_ = rotation;
    
    // В полной реализации здесь будет дополнительная инициализация
    console.log('Инициализация пересечений на доске');
  }
  
  /**
   * Устанавливает цвет камня в указанной точке.
   * @param {Object} pt - Точка на доске
   * @param {string} color - Цвет камня
   */
  setStoneColor(pt, color) {
    console.log(`Установка цвета камня ${color} в точке ${pt.x()},${pt.y()}`);
    
    if (!pt || typeof pt.x !== 'function' || typeof pt.y !== 'function') {
      console.error('Некорректная точка:', pt);
      return;
    }
    
    const idGen = svg.ids.gen(this.divId_);
    const stoneId = idGen.stone(pt);
    
    console.log('Looking for stone with ID:', stoneId);
    
    // Нормализуем цвет
    const normalizedColor = (color || 'EMPTY').toUpperCase();
    
    // Поиск элемента камня по ID в DOM
    let stoneElement = document.getElementById(stoneId);
    
    // Если камень не найден, создаем его
    if (!stoneElement) {
      console.log('Stone element not found, creating new one');
      this._createStone(pt, normalizedColor);
      stoneElement = document.getElementById(stoneId);
      
      // Если создание не удалось, выходим
      if (!stoneElement) {
        console.error('Failed to create stone element');
        return;
      }
    }
    
    console.log('Stone DOM element found/created:', stoneElement);
    
    // Применяем стиль на основе цвета
    try {
      if (normalizedColor === 'EMPTY') {
        stoneElement.setAttribute('opacity', '0');
        stoneElement.setAttribute('stone_color', 'EMPTY');
      } else {
        const stoneTheme = this.theme_.stones[normalizedColor];
        if (stoneTheme) {
          console.log('Using theme for stone:', stoneTheme);
          stoneElement.setAttribute('opacity', stoneTheme.opacity || '1');
          stoneElement.setAttribute('fill', stoneTheme.fill);
          stoneElement.setAttribute('stroke', stoneTheme.stroke);
          stoneElement.setAttribute('stone_color', normalizedColor);
        } else {
          console.warn(`Theme not found for stone color: ${normalizedColor}`);
          // Устанавливаем значения по умолчанию
          stoneElement.setAttribute('opacity', '1');
          stoneElement.setAttribute('fill', normalizedColor.toLowerCase());
          stoneElement.setAttribute('stone_color', normalizedColor);
        }
      }
    } catch (error) {
      console.error('Error setting stone color:', error);
    }
  }
  
  /**
   * Создает камень, если его не существует.
   * @param {Object} pt - Точка на доске
   * @param {string} color - Цвет камня
   * @private
   */
  _createStone(pt, color) {
    try {
      console.log(`Создание камня цвета ${color} в точке ${pt.x()},${pt.y()}`);
      
      const idGen = svg.ids.gen(this.divId_);
      const stoneId = idGen.stone(pt);
      
      // Проверяем, существует ли уже камень с таким ID
      if (document.getElementById(stoneId)) {
        console.log(`Камень с ID ${stoneId} уже существует`);
        return;
      }
      
      // Найдем координаты для точки на доске
      const boardPoints = this.boardPoints_;
      let coordPt = null;
      
      // Ищем соответствующую точку в данных доски
      for (let i = 0; i < boardPoints.data().length; i++) {
        const bpt = boardPoints.data()[i];
        if (bpt.intPt.x() === pt.x() && bpt.intPt.y() === pt.y()) {
          coordPt = bpt.coordPt;
          break;
        }
      }
      
      if (!coordPt) {
        console.error('Coordinate point not found for intersection:', pt);
        return;
      }
      
      // Создаем новый элемент камня
      const stone = svg.circle()
        .setAttr('cx', coordPt.x())
        .setAttr('cy', coordPt.y())
        .setAttr('r', boardPoints.radius - 0.4)
        .setId(stoneId);
      
      // Получаем тему для камня
      const normalizedColor = color.toUpperCase();
      const stoneTheme = this.theme_.stones[normalizedColor];
      
      // Применяем тему или устанавливаем значения по умолчанию
      if (normalizedColor === 'EMPTY') {
        stone.setAttr('opacity', '0');
      } else if (stoneTheme) {
        stone.setAttr('opacity', stoneTheme.opacity || '1');
        stone.setAttr('fill', stoneTheme.fill);
        stone.setAttr('stroke', stoneTheme.stroke);
      } else {
        stone.setAttr('opacity', '1');
        stone.setAttr('fill', normalizedColor.toLowerCase());
        stone.setAttr('stroke', normalizedColor === 'BLACK' ? '#000' : '#555');
      }
      
      stone.setAttr('stone_color', normalizedColor);
      stone.setAttr('class', 'stone');
      
      // Находим группу камней
      const stoneGroupId = idGen.stoneGroup();
      let stoneGroup = document.getElementById(stoneGroupId);
      
      // Если группа не найдена, создаем её
      if (!stoneGroup) {
        console.log(`Создаем группу камней с ID ${stoneGroupId}`);
        const svgElement = document.querySelector('svg');
        if (!svgElement) {
          console.error('SVG element not found');
          return;
        }
        
        stoneGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        stoneGroup.setAttribute('id', stoneGroupId);
        svgElement.appendChild(stoneGroup);
      }
      
      // Добавляем камень в группу
      stoneGroup.appendChild(stone.element);
      console.log(`Камень успешно создан с ID ${stoneId}`);
      
    } catch (error) {
      console.error('Error creating stone:', error);
    }
  }
  
  /**
   * Добавляет метку в указанной точке.
   * @param {Object} pt - Точка на доске
   * @param {string} mark - Тип метки
   * @param {string=} label - Текст метки (опционально)
   */
  addMarkPt(pt, mark, label) {
    // Заглушка - в полной реализации здесь будет добавление метки
    console.log(`Добавление метки ${mark} в точке ${pt} с текстом ${label}`);
  }
  
  /**
   * Очищает все метки на доске.
   */
  clearMarks() {
    // Заглушка - в полной реализации здесь будет очистка меток
    console.log('Очистка всех меток на доске');
  }
  
  /**
   * Очищает эффекты наведения.
   */
  clearHover() {
    // Заглушка - в полной реализации здесь будет очистка эффектов наведения
    console.log('Очистка эффектов наведения');
  }
}
