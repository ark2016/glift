/**
 * Модуль для создания и управления комментариями к ходам.
 * @module displays/commentbox/create
 */

import { orientation } from '../../orientation/index.js';
import { point, mergeObjects } from '../../util/index.js';
import { selectId, newElement, convertText, sanitize } from '../../dom/index.js';

/**
 * Класс для работы с блоком комментариев.
 */
export class CommentBox {
  /**
   * @param {string} divId ID элемента, в котором должен располагаться блок комментариев
   * @param {!Object} positioningBbox Ограничивающий прямоугольник для позиционирования
   * @param {!Object} theme Объект темы оформления
   * @param {boolean} useMarkdown Использовать ли Markdown-форматирование
   */
  constructor(divId, positioningBbox, theme, useMarkdown) {
    this.divId = divId;
    this.bbox = orientation.bbox.fromPts(
      point(0, 0),
      point(positioningBbox.width(), positioningBbox.height())
    );
    this.theme = theme;
    this.useMarkdown = useMarkdown;
    this.el = undefined;
  }

  /** 
   * Отрисовать блок комментариев
   * @return {!CommentBox} this, для цепочки вызовов
   */
  draw() {
    this.el = selectId(this.divId);
    if (this.el === null) {
      throw new Error('Could not find element with ID ' + this.divId);
    }
    this.el.css(
      mergeObjects(
        {
          'overflow-y': 'auto',
          MozBoxSizing: 'border-box',
          boxSizing: 'border-box',
        },
        this.theme.commentBox.css
      )
    );
    this.el.addClass('glift-comment-box');
    this.scrollFix();
    return this;
  }

  /**
   * Исправляет прокрутку, когда пользователь достигает нижней части div,
   * чтобы пользователь не прокручивал содержимое в никуда.
   */
  scrollFix() {
    const elem = document.getElementById(this.divId);
    if ('onwheel' in elem) {
      elem.addEventListener('wheel', function(e) {
        const deltaY = e.deltaY;
        const pixelsPerTick = 30;
        // Вручную перемещаем область прокрутки
        this.scrollTop += deltaY * pixelsPerTick;
        e.preventDefault();
      });
    }
  }

  /**
   * Устанавливает текст в блоке комментариев. Примечание: это санитизирует текст для 
   * предотвращения XSS и выполняет базовое преобразование в HTML.
   * @param {string} text Текст комментария
   * @param {string=} opt_collisionsLabel Опциональная метка для коллизий
   */
  setText(text, opt_collisionsLabel) {
    this.el.empty();
    const collisionsLabel = opt_collisionsLabel || '';
    if (collisionsLabel) {
      const sanitizedLabel = sanitize(collisionsLabel);
      const em = newElement('em')
        .append(convertText(sanitizedLabel, false));
      this.el.append(em);
    }
    this.el.append(convertText(text, this.useMarkdown));
  }

  /** Очистить текст из блока комментариев. */
  clearText() {
    this.el.empty();
  }

  /** Удалить весь соответствующий HTML блока комментариев. */
  destroy() {
    this.el.remove();
  }
}

/**
 * Создать блок комментариев с заданными параметрами.
 *
 * @param {string} divId ID элемента, в котором должен располагаться блок комментариев
 * @param {!Object} posBbox Ограничивающий прямоугольник элемента
 *    (дорого пересчитывать)
 * @param {!Object} theme Объект темы оформления
 * @param {boolean} useMarkdown Использовать ли Markdown-форматирование
 *
 * @return {!CommentBox} Экземпляр блока комментариев
 */
export function create(divId, posBbox, theme, useMarkdown = false) {
  if (!theme) {
    throw new Error('Theme must be defined. was: ' + theme);
  }
  return new CommentBox(
    divId,
    posBbox,
    theme,
    useMarkdown
  ).draw();
}
