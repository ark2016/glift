/**
 * Модуль для разбора SGF файлов.
 * @module parse/sgf
 */

import { movetree } from '../rules/movetree.js';

/**
 * Метаданные Start и End теги позволяют нам вставлять метаданные напрямую, в формате
 * JSON, в комментарии SGF. Они не будут отображаться Glift (хотя они будут
 * отображаться другими редакторами, конечно). Его основное использование - это API для
 * встраивания сторонних данных.
 *
 * В настоящее время ожидается, что это свойство прикреплено к корневому узлу.
 *
 * Некоторые другие заметки:
 *  - Извлечение метаданных происходит в парсере.
 *  - Если поле metadataProperty установлено, оно будет брать все данные из
 *  соответствующего свойства и пытаться преобразовать их в JSON.
 *
 * Чтобы отключить это поведение, установите metadataProperty в null.
 *
 * api:experimental
 */
export const sgfMetadataProperty = 'GC';

/**
 * Экранирует текст, преобразуя ] в \\]
 * @param {string} text - Текст для экранирования
 * @return {string} Экранированный текст
 */
export function sgfEscape(text) {
  return text.toString().replace(/]/g, '\\]');
}

/**
 * Убирает экранирование текста, преобразуя \\] в ]
 * @param {string} text - Текст для обработки
 * @return {string} Текст без экранирования
 */
export function sgfUnescape(text) {
  return text.toString().replace(/\\]/g, ']');
}

/**
 * Упрощенная заглушка для парсера SGF.
 * В реальной реализации здесь будет полноценный парсер SGF формата.
 *
 * @param {string} sgfString - Строка SGF для разбора
 * @return {!Object} Дерево ходов
 */
export function sgf(sgfString) {
  // Заглушка - в будущем здесь будет полная реализация парсера
  const mt = movetree.getInstance();
  
  // Базовое чтение свойств - очень упрощенный подход
  if (sgfString && sgfString.includes('(;')) {
    // Извлекаем первый узел
    const firstNode = sgfString.substring(
      sgfString.indexOf('(;') + 2, 
      sgfString.indexOf(';', sgfString.indexOf('(;') + 2) > 0 ? 
        sgfString.indexOf(';', sgfString.indexOf('(;') + 2) : 
        sgfString.indexOf(')')
    );
    
    // Извлекаем простые свойства вида XX[значение]
    const propRegex = /([A-Z]+)\[([^\]]*)\]/g;
    let match;
    while ((match = propRegex.exec(firstNode)) !== null) {
      const prop = match[1];
      const value = match[2];
      mt.properties().add(prop, [value]);
    }
  }
  
  return mt;
} 