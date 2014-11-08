var NUMBER_OF_BRANCHES = 6;
var BRANCH_FREQUENCY = 700; //higher value makes branches less frequent
var PADDING_BRANCH = 20; // space required between hero and branch


/**
 * Branch class. Placed on either left or right side of
 * tree trunk. Starts off-screen.
 */
 
function Branch(leftSideOfTree_X, rightSideOfTree_X) {
  var self = this;
  this.ready = false;
  
  /**
   * Setup.
   */
  var randomBranchNumber = 1 +	Math.floor(Math.random() * NUMBER_OF_BRANCHES);
  
  var isLeft = Math.floor(Math.random() * 2);
  
  if (isLeft === 1) {
  	this.orientation = 'left';
  	createBranch(randomBranchNumber);
  } else {
  	this.orientation = 'right';
    createBranch(randomBranchNumber);
  }

  function createBranch(randomBranchNumber) {
    var that = this;
	
  	self.image = new Image();
    self.image.src =  "/game/img/branch_" + self.orientation + "_" + randomBranchNumber + ".png";
	
    self.image.onload = function() {
  	  self.width = self.image.width;
      self.height = self.image.height;
     
      if (self.orientation === 'left') {
        self.x = leftSideOfTree_X - self.width;
      } else {
        self.x = rightSideOfTree_X; 
      }
	  
	  do {
	    var y_distance = Math.floor(Math.random() * BRANCH_FREQUENCY);
	    console.log("do it");
		self.y = (-1) * y_distance;
	  } while (Math.abs(highestBranchY - self.y) < (hero.height + 2 * PADDING_BRANCH));
		
	  highestBranchY = self.y;
	  self.bottom = self.y + self.height;
	  self.ready = true;
    }
  }
  
  return this;
}