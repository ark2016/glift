/**
 * Resizes a box optimally to fit within the containing div box while preserving proportions.
 * This finds the minimum of height and width, creates a box with these dimensions,
 * and centers the box (or aligns according to specified alignment).
 *
 * @param {!glift.orientation.BoundingBox} divBox The containing bounding box
 * @param {!glift.displays.DisplayCropBox} cropbox The cropbox defining dimensions
 * @param {glift.enums.boardAlignments=} opt_alignment Optional alignment (default: CENTER)
 * @return {!glift.orientation.BoundingBox} The new resized bounding box
 */
glift.displays.getResizedBox = (divBox, cropbox, opt_alignment) => {
  const aligns = glift.enums.boardAlignments;
  const alignment = opt_alignment || aligns.CENTER;
  
  // Calculate new dimensions that preserve the crop box proportions
  const { width: newWidth, height: newHeight } = 
    glift.displays.getCropDimensions(divBox.width(), divBox.height(), cropbox);
  
  // Calculate positional differences
  const xDiff = divBox.width() - newWidth;
  const yDiff = divBox.height() - newHeight;
  
  // Determine position based on alignment
  const xDelta = alignment === aligns.RIGHT ? xDiff : xDiff / 2;
  const yDelta = alignment === aligns.TOP ? 0 : yDiff / 2;
  
  // Calculate new position
  const newLeft = divBox.topLeft().x() + xDelta;
  const newTop = divBox.topLeft().y() + yDelta;
  
  // Create and return the new bounding box
  return glift.orientation.bbox.fromSides(
    new glift.Point(newLeft, newTop),
    newWidth,
    newHeight
  );
};

/**
 * Adjusts dimensions to match the proportions of the cropbox.
 * 
 * @param {number} width Original width
 * @param {number} height Original height
 * @param {!glift.displays.DisplayCropBox} cropbox The cropbox defining the target proportions
 * @return {{height: number, width: number}} The new dimensions
 */
glift.displays.getCropDimensions = (width, height, cropbox) => {
  const origRatio = height / width;
  const cropRatio = cropbox.heightIntersections() / cropbox.widthIntersections();
  
  let newHeight = height;
  let newWidth = width;
  
  // Adjust dimensions to match crop ratio
  if (origRatio > cropRatio) {
    // Height is proportionally larger than needed - adjust height
    newHeight = width * cropRatio;
  } else if (origRatio < cropRatio) {
    // Width is proportionally larger than needed - adjust width
    newWidth = height / cropRatio;
  }
  
  return {
    height: newHeight,
    width: newWidth
  };
};
