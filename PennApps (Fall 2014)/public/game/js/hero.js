var SPRITE_TILE_COLUMNS = 2;

/**
 * Hero.
 */

function Hero(x, y) {
  var self = this;
  
  /**
   * Setup.
   */

  this.x = x;
  this.y = y;
  this.initialX = x;
  this.initialY = y;
  this.alive = true;

  loadImages();
  setDefaults();

  /**
   * Methods.
   */

  function setDefaults(){
    self.orientation = 'right';
    self.frame = 'b';
    self.image = self.images['right']['b'];
  }

  function loadImages(){
    self.images = {};
    self.images['right'] = {};
    self.images['left'] = {};

    self.images['right']['a'] = new Image();
    self.images['right']['a'].src = "/game/img/river-right-a.png";

    self.images['right']['b'] = new Image();
    self.images['right']['b'].src = "/game/img/river-right-b.png";

    self.images['left']['a'] = new Image();
    self.images['left']['a'].src = "/game/img/river-left-a.png";

    self.images['left']['b'] = new Image();
    self.images['left']['b'].src = "/game/img/river-left-b.png";


    self.images['right']['a'].onload = function () {
      self.width = this.width;
      self.height = this.height;
      self.x -= (this.width / 2) - 17;
      self.y += ((3 * this.height) / 5);
	  self.bottom = self.y + self.height;
    };
  }

 this.isAcrossFromBranch = function() {
  	if (hero.orientation !== branch1.orientation) {
  	  if (((hero.y - branch1.bottom) < PADDING_BRANCH)) {
  		return true;
      }
  	}
  	else if (hero.orientation !== branch2.orientation) {
  	  if (((hero.y - branch2.bottom) < PADDING_BRANCH)) {
  		return true;
      }
  	}
  	return false;
  }
  
  var lastFlipTime = 0;

  this.flipTrunkSide = function(orientation) {  
    if(self.alive && !self.isAcrossFromBranch()) {
	  console.log("flip!");
      var time = Date.now();

      if (time - lastFlipTime > 100 && this.orientation !== orientation) {

        this.x += orientation === 'left' ? -32 : 32;

        this.orientation = orientation;
        this.setNextImageFrame();
        lastFlipTime = time;
      }
    }
  }

  this.adjustPosition = function() {
    if(self.alive) {
      this.setNextImageFrame();
    }
  }

  this.setNextImageFrame = function() {
    if (this.frame === 'a') {
      this.frame = 'b';
    } else {
      this.frame = 'a';
    }

    this.image = this.images[this.orientation][this.frame];
  }

  this.fallDirection = 'up';

  this.animateFall = function() {
    this.x += this.orientation === 'left' ? -4 : 4;
    this.y += 4;
  }

  return this;
}
