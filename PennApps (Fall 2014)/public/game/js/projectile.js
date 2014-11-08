/**
 * Cloud.
 */

function Projectile(width, height, targetX, targetY) {

  /**
   * Setup.
   */

  var self = this;

  this.originDirection = Math.floor(Math.random() * 2) === 0 ? 'left' : 'right';

  this.image = new Image();

  if(this.originDirection === 'left') {
    this.x = width / 2 - 200;
    this.image.src = "/game/img/missiles/missile3.png";
  } else {
    this.x = width / 2 + 60;
    this.image.src = "/game/img/missiles/missile3.png";
  }

  this.image.onload = function () {
    self.ready = true;
  };

  this.y = 0 - self.image.height;
  this.reachedTarget = false;

  this.animate = function(orientation, heroHeight, endGame) {
    self.y += 4;

    if(self.originDirection === orientation && 
      (self.y + self.image.height) - 50 >= height - heroHeight) {
      endGame();
    }

    if(self.y + 100 > height) {
      self.reachedTarget = true;
    }
  }

  return this;
}
