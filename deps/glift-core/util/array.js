/**
 * Модуль для работы с массивами в Glift.
 * @module util/array
 */

/**
 * Удаляет элемент из массива.
 * 
 * @param {!Array<T>} arr - Исходный массив
 * @param {T} elem - Элемент для удаления
 * @return {!Array<T>} Массив с удаленным элементом
 * 
 * @template T
 */
export function remove(arr, elem) {
  const index = arr.indexOf(elem);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
}

/**
 * Заменяет элемент в массиве.
 * 
 * @param {!Array<T>} arr - Исходный массив
 * @param {T} elem - Элемент для замены
 * @param {T} elemRep - Заменяющий элемент
 * @return {!Array<T>} Массив с замененным элементом
 * 
 * @template T
 */
export function replace(arr, elem, elemRep) {
  const index = arr.indexOf(elem);
  if (index > -1) {
    arr[index] = elemRep;
  }
  return arr;
}

/**
 * Экспорт для обратной совместимости
 */
export const array = {
  remove,
  replace
};
