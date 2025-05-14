/**
 * Модуль для центрирования элементов интерфейса.
 * @module displays/center
 */

import { orientation } from '../orientation/index.js';

/**
 * Объект трансформации. Обратите внимание, что масштаб устанавливается немедленно,
 * в то время как xMove и yMove часто устанавливаются позже.
 */
export class Transform {
  /**
   * @param {number} scale Коэффициент масштабирования. 1 означает, что объект
   *    не должен масштабироваться.
   * @param {number=} opt_xMove По умолчанию равен нулю, если не установлен.
   * @param {number=} opt_yMove По умолчанию равен нулю, если не установлен.
   */
  constructor(scale, opt_xMove, opt_yMove) {
    /**
     * Насколько масштабировать объект.
     * @type {number}
     */
    this.scale = scale;
    /**
     * Насколько смещать объект по оси x.
     * @type {number}
     */
    this.xMove = opt_xMove || 0;
    /**
     * Насколько смещать объект по оси y.
     * @type {number}
     */
    this.yMove = opt_yMove || 0;
  }
}

/**
 * Результат операции центрирования группы элементов (строки или столбца)
 */
export class MultiCenter {
  /**
   * @param {!Array<!Transform>} transforms Трансформации для выполнения.
   * @param {!Array<!Object>} bboxes Трансформированные ограничивающие прямоугольники.
   * @param {!Array<!Object>} unfit Ограничивающие прямоугольники, которые
   *    не поместились с учетом заданных параметров.
   */
  constructor(transforms, bboxes, unfit) {
    this.transforms = transforms;
    this.bboxes = bboxes;
    this.unfit = unfit;
  }
}

/**
 * Результат центрирования одиночного элемента.
 */
export class SingleCenter {
  /**
   * @param {!Transform} transform Трансформация для выполнения.
   * @param {!Object} bbox Трансформированный ограничивающий прямоугольник.
   */
  constructor(transform, bbox) {
    this.transform = transform;
    this.bbox = bbox;
  }
}

/**
 * Центрирует набор иконок (точнее, ограничивающих прямоугольников) внутри другого
 * ограничивающего прямоугольника. Примечание: Возвращаемые элементы гарантированно 
 * будут в том же порядке, в котором они были переданы в качестве входных данных.
 *
 * @param {!Object} outerBox Внешний ограничивающий прямоугольник
 * @param {!Array<!Object>} inBboxes Массив ограничивающих прямоугольников для центрирования
 * @param {number} vertMargin Вертикальный отступ
 * @param {number} horzMargin Горизонтальный отступ
 * @param {number} minSpacing Минимальное расстояние между элементами
 *
 * @return {!MultiCenter} Результат центрирования
 */
export function rowCenterSimple(
  outerBox,
  inBboxes,
  vertMargin,
  horzMargin,
  minSpacing
) {
  return linearCentering_(
    outerBox,
    inBboxes,
    vertMargin,
    horzMargin,
    minSpacing,
    0,
    'h'
  );
}

/**
 * Центрирует элементы в столбец внутри ограничивающего прямоугольника.
 * 
 * @param {!Object} outerBox Внешний ограничивающий прямоугольник
 * @param {!Array<!Object>} inBboxes Массив ограничивающих прямоугольников для центрирования
 * @param {number} vertMargin Вертикальный отступ
 * @param {number} horzMargin Горизонтальный отступ
 * @param {number} minSpacing Минимальное расстояние между элементами
 *
 * @return {!MultiCenter} Результат центрирования
 */
export function columnCenterSimple(
  outerBox,
  inBboxes,
  vertMargin,
  horzMargin,
  minSpacing
) {
  return linearCentering_(
    outerBox,
    inBboxes,
    vertMargin,
    horzMargin,
    minSpacing,
    0,
    'v'
  );
}

/**
 * Выполняет линейное центрирование по вертикали или горизонтали.
 *
 * @private
 *
 * @param {!Object} outerBox Внешний ограничивающий прямоугольник
 * @param {!Array<!Object>} inBboxes Массив ограничивающих прямоугольников для центрирования
 * @param {number} vertMargin Вертикальный отступ
 * @param {number} horzMargin Горизонтальный отступ
 * @param {number} minSpacing Минимальное расстояние между элементами
 * @param {number} maxSpacing Максимальное расстояние между элементами. Ноль означает отсутствие ограничения
 * @param {string} dir Направление ('v' - вертикальное, 'h' - горизонтальное)
 *
 * @return {!MultiCenter} Результат центрирования
 */
function linearCentering_(
  outerBox,
  inBboxes,
  vertMargin,
  horzMargin,
  minSpacing,
  maxSpacing,
  dir
) {
  const outerWidth = outerBox.width(),
    innerWidth = outerWidth - 2 * horzMargin,
    outerHeight = outerBox.height(),
    innerHeight = outerHeight - 2 * vertMargin;
  const transforms = [];
  const newBboxes = [];
  
  // TODO: Минимальное расстояние полностью сломано и не имеет тестов.
  // Вероятно, следует просто удалить его.
  minSpacing = minSpacing || 0;
  maxSpacing = maxSpacing || 0;
  dir = dir === 'v' || dir === 'h' ? dir : 'h';
  
  const getLongSide = function(bbox, dir) {
    return dir === 'h' ? bbox.width() : bbox.height();
  };

  const outsideLongSide = getLongSide(outerBox, dir);
  // Используем некоторое произвольно большое число в качестве верхней границы по умолчанию
  maxSpacing = maxSpacing <= 0 ? 10000000 : maxSpacing;
  minSpacing = minSpacing <= 0 ? 0 : minSpacing;

  // Корректируем все ограничивающие прямоугольники, чтобы они имели правильный масштаб
  let totalElemLength = 0;
  for (let i = 0; i < inBboxes.length; i++) {
    let scale;
    if (innerHeight > innerWidth) {
      scale = innerWidth / inBboxes[i].width();
    } else {
      scale = innerHeight / inBboxes[i].height();
    }
    const partialTransform = new Transform(scale);
    const newBbox = inBboxes[i].scale(scale);
    transforms.push(partialTransform);
    newBboxes.push(newBbox);
    totalElemLength += getLongSide(newBbox, dir);
    if (i < inBboxes.length - 1) {
      totalElemLength += minSpacing;
    }
  }

  // Убираем элементы, которые не помещаются
  const unfitBoxes = [];
  while (outsideLongSide < totalElemLength) {
    const newBbox = newBboxes.pop();
    transforms.pop();
    totalElemLength -= getLongSide(newBbox, dir);
    totalElemLength -= minSpacing;
    unfitBoxes.push(newBbox);
  }

  // Находим, сколько места использовать для элементов
  let extraSpace;
  if (dir === 'h') {
    extraSpace = innerWidth - totalElemLength;
  } else {
    extraSpace = innerHeight - totalElemLength;
  }
  
  let extraSpacing = extraSpace / (transforms.length + 1);
  let elemSpacing = extraSpacing;
  let extraMargin = extraSpacing;
  
  if (extraSpacing > maxSpacing) {
    elemSpacing = maxSpacing;
    const totalExtraMargin = extraSpace - elemSpacing * (transforms.length - 1);
    extraMargin = totalExtraMargin / 2;
  }

  let left = outerBox.left() + horzMargin;
  let top = outerBox.top() + vertMargin;
  if (dir === 'h') {
    left += extraMargin;
  } else {
    top += extraMargin;
  }

  // Находим x и y смещения
  const finishedBoxes = [];
  for (let j = 0; j < newBboxes.length; j++) {
    const newBbox = newBboxes[j];
    const partialTransform = transforms[j];
    const yTranslate = top - newBbox.top();
    const xTranslate = left - newBbox.left();
    partialTransform.xMove = xTranslate;
    partialTransform.yMove = yTranslate;
    finishedBoxes.push(newBbox.translate(xTranslate, yTranslate));
    if (dir === 'h') {
      left += newBbox.width() + elemSpacing;
    } else {
      top += newBbox.height() + elemSpacing;
    }
  }

  return new MultiCenter(transforms, finishedBoxes, unfitBoxes);
}

/**
 * Центрирует ограничивающий прямоугольник внутри другого ограничивающего прямоугольника.
 *
 * @param {!Object} outerBbox Внешний ограничивающий прямоугольник
 * @param {!Object} bbox Ограничивающий прямоугольник для центрирования внутри outerBbox
 * @param {number} vertMargin Вертикальный отступ
 * @param {number} horzMargin Горизонтальный отступ
 *
 * @return {!SingleCenter} Результат центрирования
 */
export function centerWithin(outerBbox, bbox, vertMargin, horzMargin) {
  const outerWidth = outerBbox.width();
  const innerWidth = outerWidth - 2 * horzMargin;
  const outerHeight = outerBbox.height();
  const innerHeight = outerHeight - 2 * vertMargin;

  let scale;
  if (innerHeight / innerWidth > bbox.height() / bbox.width()) {
    scale = innerWidth / bbox.width();
  } else {
    scale = innerHeight / bbox.height();
  }

  const partialTransform = new Transform(scale);
  const newBbox = bbox.scale(scale);
  
  const left = outerBbox.left() + (outerBbox.width() - newBbox.width()) / 2;
  const top = outerBbox.top() + (outerBbox.height() - newBbox.height()) / 2;
  
  partialTransform.xMove = left - newBbox.left();
  partialTransform.yMove = top - newBbox.top();
  
  const outBbox = newBbox.translate(partialTransform.xMove, partialTransform.yMove);
  
  return new SingleCenter(partialTransform, outBbox);
}

export const center = {
  Transform,
  MultiCenter,
  SingleCenter,
  rowCenterSimple,
  columnCenterSimple,
  centerWithin
};
