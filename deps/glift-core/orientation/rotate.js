/**
 * Модуль вращения и обрезки доски.
 * @module orientation/rotate
 */

import { enums } from '../util/enums.js';
import { orientation } from './orientation.js';

/**
 * Опции для обрезки
 * - Какие регионы обрезки должны быть? Можно указать сторону или угол (или оба).
 * - Должны ли точки быть перевернуты по оси X или Y для достижения
 *   нужной обрезки? По умолчанию переворачиваем, но это можно переопределить
 *   для предпочтения вращения (если возможно). Вращение может показаться более
 *   естественным подходом, но обычно это не идеально из-за асимметрии crop-box'ов.
 *
 * @typedef {{
 *  corner: (string|undefined),
 *  side: (string|undefined),
 *  preferRotate: (boolean|undefined)
 * }}
 */
export class AutoRotateCropPrefs {
  /**
   * @param {Object} options - Настройки обрезки
   */
  constructor(options = {}) {
    this.corner = options.corner;
    this.side = options.side;
    this.preferRotate = !!options.preferRotate;
  }
}

/**
 * Вращает все свойства с точками в дереве ходов.
 * @param {Object} movetree
 * @param {string} rotation
 * @return {Object} Дерево ходов от корня.
 */
export const rotateMovetree = (movetree, rotation) => {
  if (!rotation || rotation === enums.rotations.NO_ROTATION) {
    return movetree.getTreeFromRoot();
  }
  movetree = movetree.newTreeRef();
  const size = movetree.getIntersections();
  movetree.recurseFromRoot(function (mt) {
    const props = mt.properties();
    props.forEach(function (prop, vals) {
      props.rotate(prop, size, rotation);
    });
  });
  return movetree.getTreeFromRoot();
};

/**
 * Переворачивает все свойства с точками в дереве ходов.
 * @param {Object} movetree
 * @param {string} flip
 * @return {Object} Дерево ходов от корня.
 */
export const flipMovetree = (movetree, flip) => {
  if (!flip || flip === enums.Flip.NO_FLIP) {
    return movetree.getTreeFromRoot();
  }
  movetree = movetree.newTreeRef();
  const size = movetree.getIntersections();
  movetree.recurseFromRoot(function (mt) {
    const props = mt.properties();
    props.forEach(function (prop, vals) {
      if (flip === enums.Flip.VERTICAL) {
        props.flipVert(prop, size);
      } else {
        props.flipHorz(prop, size);
      }
    });
  });
  return movetree.getTreeFromRoot();
};

/**
 * Находит правильное вращение для обрезки.
 *
 * @param {string} region
 * @param {AutoRotateCropPrefs=} opt_prefs
 * @return {string} Поворот, который должен быть выполнен.
 * @private
 */
const findCropRotation_ = (region, opt_prefs) => {
  const boardRegions = enums.boardRegions;
  const rotations = enums.rotations;
  const cornerRegions = {
    TOP_LEFT: 0,
    BOTTOM_LEFT: 90,
    BOTTOM_RIGHT: 180,
    TOP_RIGHT: 270,
  };
  const sideRegions = {
    TOP: 0,
    LEFT: 90,
    BOTTOM: 180,
    RIGHT: 270,
  };

  const prefs = opt_prefs || {};
  const isCorner = cornerRegions.hasOwnProperty(region);
  const isSide = sideRegions.hasOwnProperty(region);

  if (!prefs.side && isSide) {
    // Не указаны предпочтения вращения для сторон.
    return rotations.NO_ROTATION;
  }
  if (!prefs.corner && isCorner) {
    // Не указаны предпочтения вращения для углов.
    return rotations.NO_ROTATION;
  }
  if (!isCorner && !isSide) {
    // Ни угол, ни сторона. Нечего делать.
    return rotations.NO_ROTATION;
  }

  if (
    cornerRegions[region] !== undefined ||
    sideRegions[region] !== undefined
  ) {
    let start = 0, end = 0;
    if (cornerRegions[region] !== undefined) {
      start = cornerRegions[region];
      end = cornerRegions[prefs.corner];
    }

    if (sideRegions[region] !== undefined) {
      start = sideRegions[region];
      end = sideRegions[prefs.side];
    }

    const rot = (360 + start - end) % 360;
    switch (rot) {
      case 0:
        return rotations.NO_ROTATION;
      case 90:
        return rotations.CLOCKWISE_90;
      case 180:
        return rotations.CLOCKWISE_180;
      case 270:
        return rotations.CLOCKWISE_270;
      default:
        return rotations.NO_ROTATION;
    }
  }

  // Нет вращений. Мы вращаем только когда регион обрезки - угол или сторона.
  return rotations.NO_ROTATION;
};

/**
 * Определяет переворот для вращения.
 * @param {string} region
 * @param {string} rotation
 * @return {string}
 * @private
 */
const flipForRotation_ = (region, rotation) => {
  const br = enums.boardRegions;
  const rots = enums.rotations;
  const flip = enums.Flip;

  if (region === br.TOP_RIGHT || region === br.TOP_LEFT ||
      region === br.BOTTOM_RIGHT || region === br.BOTTOM_LEFT) {
    if (rotation === rots.CLOCKWISE_90 || rotation === rots.CLOCKWISE_270) {
      return flip.VERTICAL;
    } else if (rotation === rots.CLOCKWISE_180) {
      return flip.HORIZONTAL;
    }
  } else if (
    region === br.TOP || region === br.BOTTOM || region === br.RIGHT || region === br.LEFT) {
    if (rotation === rots.CLOCKWISE_180) {
      if (region === br.TOP || region === br.BOTTOM) {
        return flip.VERTICAL;
      } else {
        return flip.HORIZONTAL;
      }
    }
  }
  return flip.NO_FLIP;
};

/**
 * Автоматически вращает дерево ходов. Используется findCanonicalRotation для
 * нахождения правильной ориентации.
 *
 * Размер определяется путем изучения свойства sz игры.
 * @param {Object} movetree
 * @param {AutoRotateCropPrefs=} opt_prefs
 * @return {Object}
 */
export const autoRotateCrop = (movetree, opt_prefs) => {
  const nmt = movetree.getTreeFromRoot();
  const region = orientation.getQuadCropFromMovetree(nmt);
  const rotation = findCropRotation_(region, opt_prefs);
  if (rotation == enums.rotations.NO_ROTATION) {
    return nmt.getTreeFromRoot();
  }

  const doRots = !!opt_prefs.preferRotate;
  let flip = enums.Flip.NO_FLIP;
  if (!doRots) {
    flip = flipForRotation_(region, rotation);
  }

  if (flip !== enums.Flip.NO_FLIP) {
    flipMovetree(movetree, flip);
  } else {
    rotateMovetree(movetree, rotation);
  }
  return nmt.getTreeFromRoot();
};

/**
 * Автоматически вращает игру, гарантируя, что первый камень
 * всегда находится в верхнем правом углу.
 * @param {Object} movetree
 * @return {Object}
 */
export const autoRotateGame = (movetree) => {
  const nmt = movetree.getTreeFromRoot();
  let pt = null;
  const props = rules.prop;
  if (nmt.properties().contains(props.B)) {
    pt = nmt.properties().getAsPoint(props.B);
  }
  if (nmt.properties().contains(props.W)) {
    pt = nmt.properties().getAsPoint(props.W);
  }
  if (!pt) {
    nmt.moveDown();
    if (nmt.properties().contains(props.B)) {
      // Самый распространенный случай.
      pt = nmt.properties().getAsPoint(props.B);
    }
    if (nmt.properties().contains(props.W)) {
      pt = nmt.properties().getAsPoint(props.W);
    }
  }
  if (!pt) {
    return nmt.getTreeFromRoot();
  }
  const size = movetree.getIntersections();
  const norm = pt.normalize(size);
  let rot = enums.rotations.NO_ROTATION;
  if (norm.x() > 0 && norm.y() > 0) {
    // Верхний правый. Все хорошо.
    rot = enums.rotations.NO_ROTATION;
  } else if (norm.x() < 0 && norm.y() > 0) {
    // Верхний левый
    rot = enums.rotations.CLOCKWISE_90;
  } else if (norm.x() < 0 && norm.y() < 0) {
    // Нижний левый
    rot = enums.rotations.CLOCKWISE_180;
  } else if (norm.x() > 0 && norm.y() < 0) {
    // Нижний правый
    rot = enums.rotations.CLOCKWISE_270;
  }
  return rotateMovetree(movetree, rot);
};

/**
 * Вычисляет желаемое вращение для дерева ходов, основываясь на
 * предпочтениях вращения и обрезке дерева ходов.
 *
 * Порядок регионов должен указывать, какие регионы должен
 * целевой алгоритм вращения. Если не указано, по умолчанию это
 * TOP_RIGHT / TOP.
 *
 * Это в первую очередь предназначено для задач. Не имеет смысла
 * вращать диаграммы комментариев.
 *
 * @param {Object} movetree
 * @param {AutoRotateCropPrefs=} opt_prefs
 * @return {string} Вращение, которое следует выполнить.
 */
export const findCanonicalRotation = (movetree, opt_prefs) => {
  const region = orientation.getQuadCropFromMovetree(movetree);
  return findCropRotation_(region, opt_prefs);
};

// Добавляем экспортированные функции в объект orientation для обратной совместимости
orientation.AutoRotateCropPrefs = AutoRotateCropPrefs;
orientation.rotateMovetree = rotateMovetree;
orientation.flipMovetree = flipMovetree;
orientation.autoRotateCrop = autoRotateCrop;
orientation.autoRotateGame = autoRotateGame;
orientation.findCanonicalRotation = findCanonicalRotation;
