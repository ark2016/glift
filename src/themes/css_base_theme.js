goog.provide('glift.themes.cssBaseTheme');
goog.provide('glift.themes.CssDef');

/**
 * CSS Definition class for storing CSS properties and extra metadata.
 */
class CssDef {
  /**
   * @param {!Object<string, string>} css Core CSS properties
   * @param {!Object<string, (string|number)>=} extra Optional extra properties
   */
  constructor(css, extra = {}) {
    /**
     * Base CSS Properties (stroke, fill, etc.)
     * @type {!Object<string, string>}
     */
    this.css = css;
    
    /**
     * Extra properties sometimes necessary for construction
     * @type {!Object<string, (string|number)>}
     */
    this.extra = extra;
  }
}

// Export class to namespace
glift.themes.CssDef = CssDef;

/**
 * Base CSS theme for Glift components.
 * @type {!Object<glift.themes.classes, !glift.themes.CssDef>}
 */
glift.themes.cssBaseTheme = (() => {
  const theme = {};
  const classes = glift.themes.classes;
  
  /**
   * Helper for creating CSS definitions
   * @param {!Object<string, string>} css CSS properties
   * @param {!Object<string, (string|number)>=} extra Optional extra properties
   * @return {!glift.themes.CssDef} The created CSS definition
   */
  const cssDef = (css, extra) => new CssDef(css, extra);
  
  // Board styling
  theme[classes.BOARD] = cssDef({
    fill: '#f5be7e',
    stroke: '#000000',
    'stroke-width': '1',
  });
  
  // Star points
  theme[classes.STARPOINTS] = cssDef(
    {
      fill: 'black',
    },
    {
      // Settings for star point rendering
      sizeFraction: 0.15, // As a fraction of spacing
    }
  );
  
  // Board lines
  theme[classes.BOARD_LINES] = cssDef({
    stroke: 'black',
    'stroke-width': 0.5,
  });
  
  // Coordinate labels
  theme[classes.BOARD_COORD_LABELS] = cssDef({
    fill: 'black',
    stroke: 'black',
    opacity: '0.6',
    'font-family': 'sans-serif',
    'font-size': '0.6',
  });
  
  return theme;
})();
