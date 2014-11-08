/**
 * Cloud.
 */

function Cloud(options) {

  /**
   * Setup.
   */

  var self = this;

  this.x = options.x;
  this.y = options.y;
  this.maxWidth = options.maxWidth;
  this.maxHeight = options.maxHeight;
  this.horizontalDirection = options.horizontalDirection;
  this.verticalDirection = options.verticalDirection;
  this.initialX = options.x;
  this.initialY = options.y;
  this.maxXDisplacement = options.maxXDisplacement;
  this.maxYDisplacement = options.maxYDisplacement;
  this.image = new Image();
  this.image.src = "/game/img/cloud" + options.id + ".png";
  this.verticalToggle = false;
  this.animating = true;

  this.image.onload = function () {
    self.ready = true;
  };

  /**
   * Methods.
   */

  var frameCount = 0;
  this.animate = function() {
    if(this.animating) {
      frameCount++;
      if(this.verticalDirection === 'up') {
        if(this.y <= this.initialY - this.maxYDisplacement) {
          this.verticalDirection = 'down';
        } else {
          this.y--;
        }
      } else {
        if(this.y >= this.initialY + this.maxYDisplacement) {
          this.verticalDirection = 'up';
        } else {
          this.y++;
        }
      }

      this.verticalToggle = !this.verticalToggle;

      if(this.horizontalDirection === 'left') {
        if(this.x <= this.initialX - this.maxXDisplacement) {
          this.horizontalDirection = 'right';
        } else {
          if(this.verticalToggle) this.x--;
        }
      } else {
        if(this.x >= this.initialX + this.maxXDisplacement) {
          this.horizontalDirection = 'left';
        } else {
          if(this.verticalToggle) this.x++;
        }
      }
    }
  }

  this.stopAnimating = function() {
    this.animating = false;
  }

  return this;
}
