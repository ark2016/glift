/**
 * Модуль иконок для библиотеки Glift.
 * Содержит классы и функции для работы с иконками в интерфейсе.
 * @module displays/icons
 */

import { IconBar, createIconBar } from './bar.js';
import { WrappedIcon, wrapIcon } from './wrapped_icon.js';
import { iconSelector, IconSelector } from './icon_selector.js';
import { iconCentering, columnCenterWrapped } from './icon_centering.js';
import * as iconSvg from './svg.js';

// Экспортируем все компоненты
export {
  // Основные классы иконок
  IconBar,
  createIconBar,
  WrappedIcon,
  wrapIcon,
  
  // Селектор иконок
  iconSelector,
  IconSelector,
  
  // Центрирование иконок
  iconCentering,
  columnCenterWrapped,
  
  // SVG функции для иконок
  iconSvg
};