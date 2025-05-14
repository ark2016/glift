/**
 * Генератор последовательных уникальных идентификаторов для Glift.
 * 
 * @module widgets/id_generator
 */

/**
 * Генерирует последовательные номера, уникальные для всех экземпляров Glift на странице.
 */
export class IdGenerator {
  /**
   * @param {number|string=} seed Начальное значение или префикс
   */
  constructor(seed = 0) {
    /**
     * Текущее значение счетчика
     * @private {number}
     */
    this.seed_ = typeof seed === 'number' ? seed : 0;
    
    /**
     * Префикс для генерируемых ID (если был указан)
     * @private {string|undefined}
     */
    this.prefix_ = typeof seed === 'string' ? seed : undefined;
  }

  /**
   * Возвращает следующий ID в виде строки и увеличивает счетчик.
   * @return {string} Следующий уникальный ID
   */
  next() {
    const id = this.prefix_ ? `${this.prefix_}_${this.seed_}` : `${this.seed_}`;
    this.seed_ += 1;
    return id;
  }
}

/**
 * Глобальный экземпляр генератора ID, инициализированный с начальным значением 0.
 * @type {!IdGenerator}
 */
export const idGenerator = new IdGenerator(0);
