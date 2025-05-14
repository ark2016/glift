/**
 * @preserve Glift: A Responsive Javascript library for the game Go.
 *
 * @copyright Josh Hoak
 * @license MIT License (see LICENSE.txt)
 * --------------------------------------
 */

// Define some closure primitives for compatibility with dev mode.
// This allows us to use goog.require and goog.provides in dev mode.
if (window && !window.goog) {
  window.goog = {
    /** Override default closure function */
    require: (ns) => {},
    
    /** Override goog.scope function */
    scope: (fn) => {
      fn();
    },
    
    /** Override goog.provide function */
    provide: (ns) => {}
  };
}

goog.provide('glift');

// Initialize the main glift namespace using a more modern pattern
(() => {
  // Use the existing glift object if it exists, otherwise create a new one
  const g = (typeof glift !== 'undefined') ? glift : 
            (typeof window.glift !== 'undefined') ? window.glift : {};
  
  // Expose Glift as a global
  if (window) {
    window.glift = g;
  }
})(window);
