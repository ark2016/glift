/**
 * Calculates the spacing between intersections for a Go board.
 *
 * @param {!glift.orientation.BoundingBox} boardBox The bounding box for the board
 * @param {!glift.displays.DisplayCropBox} cropbox The cropbox defining visible intersections
 * @return {number} The spacing to use between intersections (in pixels)
 */
glift.displays.getSpacing = (boardBox, cropbox) => {
  // Calculate spacing in x and y directions
  const xSpacing = boardBox.width() / cropbox.widthIntersections();
  const ySpacing = boardBox.height() / cropbox.heightIntersections();
  
  // Spacing must be equal in both directions to maintain square intersections
  return Math.min(xSpacing, ySpacing);
};
