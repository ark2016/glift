goog.provide('glift.widgets.idGenerator');
goog.require('glift.widgets');

// TODO(kashomon): This isn't really widgets specific, but it's only being used
// in this directory. Long term, it perhaps needs a better resting place.
// However, since the IDs are used to disambiguate different instances of glift,
// perhaps this is an ok location.

/**
 * Generates sequential numbers unique across all Glift instances on the page.
 */
class IdGenerator {
  /**
   * @param {number=} seed Initial seed value
   */
  constructor(seed = 0) {
    /**
     * Current seed value
     * @private {number}
     */
    this.seed_ = seed;
  }

  /**
   * Returns the next ID as a string and increments the counter.
   * @return {string} The next unique ID
   */
  next() {
    const id = `${this.seed_}`;
    this.seed_ += 1;
    return id;
  }
}

/**
 * Global ID generator instance, initialized with seed 0.
 * @type {!IdGenerator}
 */
glift.widgets.idGenerator = new IdGenerator(0);
