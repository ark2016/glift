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
    
    const idGen = svg.ids.gen(this.divId_);
    const stoneId = idGen.stone(pt);
    
    console.log('Looking for stone with ID:', stoneId);
    
    // Поиск элемента камня по ID в DOM
    const stoneElement = document.getElementById(stoneId);
    if (stoneElement) {
      console.log('Stone DOM element found:', stoneElement);
      
      const stoneTheme = this.theme_.stones[color.toUpperCase()];
      if (color === enums.states.EMPTY) {
        stoneElement.setAttribute('opacity', '0');
        stoneElement.setAttribute('stone_color', 'EMPTY');
      } else if (stoneTheme) {
        console.log('Using theme for stone:', stoneTheme);
        stoneElement.setAttribute('opacity', stoneTheme.opacity || '1');
        stoneElement.setAttribute('fill', stoneTheme.fill);
        stoneElement.setAttribute('stroke', stoneTheme.stroke);
        stoneElement.setAttribute('stone_color', color.toUpperCase());
      } else {
        console.warn(`Theme not found for stone color: ${color}`);
        // Устанавливаем значения по умолчанию
        stoneElement.setAttribute('opacity', '1');
        stoneElement.setAttribute('fill', color.toLowerCase());
        stoneElement.setAttribute('stone_color', color.toUpperCase());
      }
    } else {
      console.warn(`Stone element not found with ID: ${stoneId}`);
      // Попробуем создать камень
      this._createStone(pt, color);
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
      
      const stoneTheme = this.theme_.stones[color.toUpperCase()];
      if (stoneTheme) {
        stone.setAttr('opacity', stoneTheme.opacity || '1');
        stone.setAttr('fill', stoneTheme.fill);
        stone.setAttr('stroke', stoneTheme.stroke);
      } else {
        stone.setAttr('opacity', '1');
        stone.setAttr('fill', color.toLowerCase());
      }
      stone.setAttr('stone_color', color.toUpperCase());
      stone.setAttr('class', 'stone');
      
      // Находим группу камней и добавляем в нее новый камень
      const stoneGroup = document.getElementById(idGen.stoneGroup());
      if (stoneGroup) {
        stoneGroup.appendChild(stone.element);
      } else {
        console.error('Stone group not found');
      }
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
