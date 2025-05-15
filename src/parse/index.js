/**
 * Индексный файл для модуля parse.
 * @module parse
 */

export {
  parseType,
  suffixToType,
  knownGoFile,
  parseTypeFromFilename,
  fromFileName,
  fromString
} from './parse.js';

export {
  sgf as sgfParser,
  sgfMetadataProperty,
  sgfEscape,
  sgfUnescape,
  sgfParseError
} from './sgf_parser.js';

// Для обратной совместимости создаем объект parse
import * as parseExports from './parse.js';
import * as sgfParserExports from './sgf_parser.js';

export const parse = {
  ...parseExports,
  sgf: sgfParserExports.sgf,
  sgfMetadataProperty: sgfParserExports.sgfMetadataProperty,
  sgfEscape: sgfParserExports.sgfEscape,
  sgfUnescape: sgfParserExports.sgfUnescape,
  sgfParseError: sgfParserExports.sgfParseError
}; 