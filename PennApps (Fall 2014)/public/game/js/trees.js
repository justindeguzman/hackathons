/**
 * Trees. Dancing trees.
 */

function Trees(yCoord, imgPath) {
  /**
   * Setup.
   */
  this.x = 0;
  this.y = yCoord;
  var self = this;
  
  this.image = new Image();
  this.image.src = imgPath;

  this.image.onload = function () {
    self.ready = true;
	self.y -= self.image.height;
  };

  return this;
}
