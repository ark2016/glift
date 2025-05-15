/**
 * Модуль для рендеринга Markdown.
 * @module markdown/renderer
 */

/**
 * A renderer for use with Marked. This is a record type, so as to indicate the
 * types.
 *
 * @record
 */
export class Renderer {
  /**
   * Renders a code block.
   * @param {string} code
   * @param {string} language
   * @return {string}
   */
  code(code, language) {}

  /**
   * Renders a blockquote.
   * @param {string} quote
   * @return {string}
   */
  blockquote(quote) {}

  /**
   * Renders HTML.
   * @param {string} html
   * @return {string}
   */
  html(html) {}

  /**
   * Renders a header/heading.
   * @param {string} text The text
   * @param {number} level Of the header
   * @return {string}
   */
  heading(text, level) {}

  /**
   * Renders a horizontal rule.
   * @return {string} The horizontal rule.
   */
  hr() {}

  /**
   * Render a list
   * @param {string} body
   * @param {boolean} ordered Whether the list is an ordered list.
   * @return {string}
   */
  list(body, ordered) {}

  /**
   * Render a list item
   * @param {string} text
   * @return {string}
   */
  listitem(text) {}

  /**
   * Render a paragraph
   * @param {string} text
   * @return {string}
   */
  paragraph(text) {}

  /**
   * @param {string} header
   * @param {string} body
   * @return {string}
   */
  table(header, body) {}

  /**
   * @param {string} content
   * @return {string}
   */
  tablerow(content) {}

  /**
   * @param {string} content
   * @param {!Object} flags
   * @return {string}
   */
  tablecell(content, flags) {}

  ///////////////////////////////////
  // Inline level renderer methods //
  ///////////////////////////////////

  /**
   * @param {string} text
   * @return {string}
   */
  strong(text) {}

  /**
   * @param {string} text
   * @return {string}
   */
  em(text) {}

  /**
   * @param {string} code
   * @return {string}
   */
  codespan(code) {}

  /** @return {string} Rendered line break. */
  br() {}

  /**
   * @param {string} text
   * @return {string}
   */
  del(text) {}

  /**
   * Render a link.
   * @param {string} href
   * @param {string} title
   * @param {string} text
   * @return {string}
   */
  link(href, title, text) {}

  /**
   * @param {string} image
   * @param {string} title
   * @param {string} text
   * @return {string}
   */
  image(image, title, text) {}
}
