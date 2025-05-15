/**
 * Модуль для определения всех свойств SGF.
 * @module rules/all_properties
 */

/**
 * Все свойства SGF плюс некоторые дополнительные.
 * @enum {string}
 */
export const prop = {
  /** Node: Black placements. */
  AB: 'AB',
  /** Node: Clear Intersections.  */
  AE: 'AE',
  AN: 'AN',
  /** Root: Creating program ex:[Glift:1.1.0] */
  AP: 'AP',
  AR: 'AR',
  AS: 'AS',
  AW: 'AW',
  /** Node: Black move */
  B: 'B',
  BL: 'BL',
  BM: 'BM',
  BR: 'BR',
  BS: 'BS',
  BT: 'BT',
  /** Node: Comment */
  C: 'C',
  /** Root: Encoding ex:[UTF-8] */
  CA: 'CA',
  CH: 'CH',
  CP: 'CP',
  CR: 'CR',
  DD: 'DD',
  DM: 'DM',
  DO: 'DO',
  DT: 'DT',
  EL: 'EL',
  EV: 'EV',
  EX: 'EX',
  /** Root: SGF Version. */
  FF: 'FF',
  FG: 'FG',
  GB: 'GB',
  /** Root: Game Comment. */
  GC: 'GC',
  /** Root: Game */
  GM: 'GM',
  /** Root: Game Name */
  GN: 'GN',
  GW: 'GW',
  HA: 'HA',
  HO: 'HO',
  ID: 'ID',
  IP: 'IP',
  IT: 'IT',
  IY: 'IY',
  /** Root: Komi ex:[0.00]*/
  KM: 'KM',
  KO: 'KO',
  L: 'L',
  /** Node: Label Mark */
  LB: 'LB',
  LN: 'LN',
  LT: 'LT',
  M: 'M',
  MA: 'MA',
  MN: 'MN',
  N: 'N',
  OB: 'OB',
  OH: 'OH',
  OM: 'OM',
  ON: 'ON',
  OP: 'OP',
  OT: 'OT',
  OV: 'OV',
  OW: 'OW',
  PB: 'PB',
  PC: 'PC',
  /** Node: Current player */
  PL: 'PL',
  PM: 'PM',
  PW: 'PW',
  RE: 'RE',
  RG: 'RG',
  RO: 'RO',
  RU: 'RU',
  SC: 'SC',
  SE: 'SE',
  SI: 'SI',
  SL: 'SL',
  SO: 'SO',
  /** Node: Square-mark */
  SQ: 'SQ',
  ST: 'ST',
  SU: 'SU',
  /** Root: Size of the Go board */
  SZ: 'SZ',
  TB: 'TB',
  TC: 'TC',
  TE: 'TE',
  TM: 'TM',
  TR: 'TR',
  TW: 'TW',
  UC: 'UC',
  US: 'US',
  V: 'V',
  VW: 'VW',
  /** Node: White Move. */
  W: 'W',
  WL: 'WL',
  WR: 'WR',
  WS: 'WS',
  WT: 'WT',
  MU: 'MU',
};

/**
 * Свойства, которые принимают значения точек. Полезно в основном для модификаций 
 * полной доски (например, вращений).
 *
 * Примечания: существует несколько способов представления точек в SGF.
 *  [ab] - Простая точка в 0,1 (начало координат=верхний левый угол. ориентировано вниз-вправо)
 *  [aa:cc] - Прямоугольник точек (все точки от 0,0 до 2,2 в прямоугольнике)
 *
 * Кроме того, метки (LB) имеют формат
 *  [ab:label]
 *
 * @type {!Object<string, boolean>}
 */
export const propertiesWithPts = {
  // Marks
  CR: true,
  LB: true,
  MA: true,
  SQ: true,
  TR: true,
  // Stones
  B: true,
  W: true,
  AW: true,
  AB: true,
  // Clear Stones
  AE: true,
  // Misc. These properties are very rare, and usually can be ignored.
  // Still, they're here for completeness.
  AR: true, // arrow
  DD: true, // gray area
  LN: true, // line
  TB: true, // black area/territory
  TW: true, // white area
};
