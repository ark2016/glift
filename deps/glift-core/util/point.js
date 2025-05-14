/**
 * Класс Point представляет точку на доске Го.
 * @module point
 */

/**
 * Класс для представления точки (координат) на доске Го.
 */
export class Point {
  /**
   * Создает новую точку с координатами (x, y).
   * @param {number} x - Координата X
   * @param {number} y - Координата Y
   */
  constructor(x, y) {
    /**
     * Координата X точки.
     * @type {number}
     */
    this.x = x;
    
    /**
     * Координата Y точки.
     * @type {number}
     */
    this.y = y;
  }
  
  /**
   * Сравнивает текущую точку с другой точкой.
   * @param {Point} pt - Другая точка для сравнения
   * @return {boolean} true, если точки совпадают
   */
  equals(pt) {
    return this.x === pt.x && this.y === pt.y;
  }
  
  /**
   * Создает копию текущей точки.
   * @return {Point} Новая точка с теми же координатами
   */
  clone() {
    return new Point(this.x, this.y);
  }
  
  /**
   * Преобразует точку в строковое представление.
   * @return {string} Строковое представление точки, например "(3,5)"
   */
  toString() {
    return `(${this.x},${this.y})`;
  }
  
  /**
   * Создает новую точку из строкового представления.
   * @param {string} str - Строковое представление точки, например "(3,5)"
   * @return {Point} Новая точка
   * @static
   */
  static fromString(str) {
    const out = /^\((\d+),(\d+)\)$/.exec(str);
    if (out && out.length === 3) {
      return new Point(parseInt(out[1], 10), parseInt(out[2], 10));
    }
    throw new Error(`Не удалось создать точку из строки: ${str}`);
  }
}
