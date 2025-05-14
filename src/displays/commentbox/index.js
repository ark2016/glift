/**
 * Модуль для работы с блоком комментариев.
 * @module displays/commentbox
 */

import { CommentBox, create } from './create.js';

// Экспортируем класс и функцию создания
export {
  CommentBox,
  create
};

// Для обратной совместимости
export const commentbox = {
  CommentBox,
  create
}; 