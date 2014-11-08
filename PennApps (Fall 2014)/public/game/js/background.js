/**
 * Background.
 */

function Pole(x, y) {

  /**
   * Setup.
   */

  var self = this;

  this.x = x;
  this.y = y;
  this.image = new Image();

  this.image.onload = function () {
    self.ready = true;
    self.width = self.image.width;
    self.height = self.image.height;
    self.x -= (self.image.width / 2);
  };
  
  this.image.src = "/game/img/pole-small.png";

  /**
   * Methods.
   */

  var isMovingUp = false;
  var isMovingDown = false;
  var callbackFn = false;
  var lastMoveTime = Date.now();
 
  this.startMovingUp = function(fn){
    if (this.isMoving()){
      return;
    }
    isMovingUp = true;
    callbackFn = fn;
    lastMoveTime = Date.now();
  }

  this.moveUp = function(){
    this.move(10);
  }

  this.isMovingUp = function(){
    return isMovingUp;
  }

  this.isMovingDown = function(){
    return isMovingDown;
  }

  this.startMovingDown = function(fn){
    if (this.isMoving()){
      return;
    }
    isMovingDown = true;
    callbackFn = fn;
    lastMoveTime = Date.now();
  }

  this.isMoving = function(){
    return isMovingDown || isMovingUp;
  }

  this.moveDown = function(){
    this.move(-10);
  }

  this.canMove = function() {
    return (Date.now() - lastMoveTime >= 100);
  }

  // returns true if the character shouldn't move down
  // because she's right above a branch
  this.isAboveBranch = function() {
    if ((branch1.orientation === hero.orientation) && (( branch1.y - hero.bottom) < PADDING_BRANCH)) {
	  return true;
	}
	
	else if ((branch2.orientation === hero.orientation) && ((branch2.y - hero.bottom) < PADDING_BRANCH)) {
	  return true;
	}
	
	return false;
  };
  
  this.isUnderBranch = function() {
    if ((branch1.orientation === hero.orientation) && ((hero.y - branch1.bottom) < PADDING_BRANCH)) {
	  return true;
	}
	
	else if ((branch2.orientation === hero.orientation) && ((hero.y - branch2.bottom) < PADDING_BRANCH)) {
	  return true;
	}
	
	return false;
  }
  
  this.move = function (moveAmount){
    var time = Date.now();

    this.y += moveAmount;
    this.y %= pole.height / 2;

	// move branches on the pole
	branch1.y += moveAmount;
	branch1.bottom += moveAmount;
	branch2.y += moveAmount;
	branch2.bottom += moveAmount;
	highestBranchY += moveAmount;
	
    if (this.canMove() && this.isMoving()) {
      isMovingDown = false;
      isMovingUp = false;
      lastMoveTime = time;
      callbackFn();
    }
  }

  return this;
}
