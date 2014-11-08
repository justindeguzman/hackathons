var HALF_OF_POLE = 30;

/**
 * Setup.
 */

var w = window;
var requestAnimationFrame = w.requestAnimationFrame   ||
                        w.webkitRequestAnimationFrame ||
                        w.msRequestAnimationFrame     ||
                        w.mozRequestAnimationFrame;

/**
 * Add key listeners.
 */
 
var keysDown = {};

addEventListener("keydown", function (e) {
  keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
  delete keysDown[e.keyCode];
}, false);

var score = 0;

var scoreSpan = document.getElementsByClassName('score-value')[0];

var projectiles = [];
var PROJECTILE_COUNT = 1;

function updateScore() {
  scoreSpan.innerHTML = score;
}

var ostAudio;
function playMusic(){
  ostAudio = new Audio('../game/audio/OST.mp3');

  ostAudio.addEventListener('ended', function() {
      this.currentTime = 0;
      this.play();
  }, false);

  ostAudio.play();
}

function playPause(){
  var playPauseButton = document.getElementById('play-pause');
  playPauseButton.classList.toggle('paused');

  if (ostAudio.paused){
    ostAudio.play();
  } else {
    ostAudio.pause();
  }
}

window.onload = function() {
  playMusic();
  
  var canvas = document.getElementById('main');
  var ctx = canvas.getContext("2d");

  window.onresize = function(event) {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  };

  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  var center_x = canvas.width / 2;

  hero = new Hero(center_x, canvas.height / 2);
  pole = new Pole(center_x, 0);
  
  highestBranchY = 0;
  branch1 = new Branch(center_x - HALF_OF_POLE, center_x + HALF_OF_POLE);
  branch2 = new Branch(center_x - HALF_OF_POLE, center_x + HALF_OF_POLE);  
  treesSm = new Trees(canvas.height, "/game/img/trees.png");
  treesLg = new Trees(canvas.height, "/game/img/trees-larger.png");

  for(var j = 0; j < PROJECTILE_COUNT; j++) {
    projectiles.push(new Projectile(
      canvas.width, canvas.height, center_x, (canvas.height * 1/2) + 70));
  }
  
  cloud1 = new Cloud({
    x: center_x + 200,
    y: 50,
    maxWidth: canvas.width,
    maxHeight: canvas.height,
    maxXDisplacement: 70,
    maxYDisplacement: 30,
    horizontalDirection: 'left',
    verticalDirection: 'down',
    id: 1
  });

  cloud2 = new Cloud({
    x: center_x - 600,
    y: 130,
    maxWidth: canvas.width,
    maxHeight: canvas.height,
    maxXDisplacement: 120,
    maxYDisplacement: 40,
    horizontalDirection: 'right',
    verticalDirection: 'down',
    id: 2
  });

  cloud3 = new Cloud({
    x: center_x + 300,
    y: 250,
    maxWidth: canvas.width,
    maxHeight: canvas.height,
    maxXDisplacement: 60,
    maxYDisplacement: 40,
    horizontalDirection: 'right',
    verticalDirection: 'up',
    id: 3
  });

  function endGame() {
    alert('Game over!');

    cloud1.stopAnimating();
    cloud2.stopAnimating();
    cloud3.stopAnimating();

    hero.alive = false;
  }

  // Draw everything
  var render = function () {
    // clear context
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();

    if(cloud1.ready) {
      ctx.drawImage(cloud1.image, cloud1.x, cloud1.y);
    }

    if(cloud2.ready) {
      ctx.drawImage(cloud2.image, cloud2.x, cloud2.y);
    }

    if(cloud3.ready) {
      ctx.drawImage(cloud3.image, cloud3.x, cloud3.y);
    }

  	if(treesSm.ready) {
  	  ctx.drawImage(treesSm.image, 0, treesSm.y);
  	}
  	
  	if(treesLg.ready) {
  	  ctx.drawImage(treesLg.image, 0, treesLg.y);
  	}
	
    if(pole.ready) {
      ctx.drawImage(pole.image, pole.x,
      pole.y - pole.height);
	    ctx.drawImage(pole.image, pole.x, pole.y);
	    ctx.drawImage(pole.image, pole.x,
      pole.y + pole.height);
    }
	
	if (branch1.ready) {
	  ctx.drawImage(branch1.image, branch1.x, branch1.y);
	  firstPass = false;
	}
		
	if (branch2.ready) {
	  ctx.drawImage(branch2.image, branch2.x, branch2.y);
	  firstPass = false;
	}

	if (branch1.y > canvas.height) {
	  branch1 = new Branch(center_x - HALF_OF_POLE, center_x +HALF_OF_POLE);
   	  ctx.drawImage(branch1.image, branch1.x, branch2.y);
	}
	if (branch2.y > canvas.height) {
	  branch2 = new Branch(center_x - HALF_OF_POLE, center_x +HALF_OF_POLE);
	  ctx.drawImage(branch2.image, branch2.x, branch2.y);
	}
	
    ctx.drawImage(hero.image, hero.x, hero.y);

    // while(projectiles.length < PROJECTILE_COUNT) {
    //   projectiles.push(new Projectile(
    //     canvas.width, canvas.height, center_x, (canvas.height * 1/2) + 70));
    // }

    projectiles.forEach(function(projectile, i) {
      if(projectile.ready && !projectile.reachedTarget) {
        ctx.drawImage(projectile.image, projectile.x, projectile.y);
      } else if(projectile.reachedTarget) {
        projectiles[i] = new Projectile(
          canvas.width, canvas.height, (canvas.height * 1/2) + 70);
      }
    });

    ctx.drawImage(hero.image, hero.x, hero.y);
  };

  var isOffScreen = function(object) {
    if (object.y > canvas.height)
	  return true;
	  return false;
  }

  // Update game objects

  var hasReloaded = false;
  var endGameClearScreen = function(){
    hero.animateFall();

    projectiles.forEach(function(projectile) {
      projectile.y += 4;
    });

    if (isOffScreen(hero) && !hasReloaded){
      hasReloaded = true;
      location.reload();
    }
  }

  var update = function (modifier) {
    if(!hero.alive) {
      endGameClearScreen();
      return;
    }

    var KEY_UP = 38;
    var KEY_DOWN = 40;
    var KEY_LEFT = 37;
    var KEY_RIGHT = 39;

    cloud1.animate();
    cloud2.animate();
    cloud3.animate();

    projectiles.forEach(function(projectile) {
      projectile.animate(hero.orientation, hero.image.height, endGame);
    });

    if (pole.isMovingUp()) {
      pole.moveUp();
    } else if (pole.isMovingDown()){
      pole.moveDown();
    } else if (pole.canMove() && KEY_UP in keysDown && !pole.isUnderBranch()){
      score += 10;

      // if(score !== 0 && score % 500 === 0) {
      //   PROJECTILE_COUNT++;
      // }

      treesSm.y += 1;
      treesLg.y += 1;

      pole.startMovingUp(function(){
        hero.adjustPosition();
      });

      hero.adjustPosition();
    } else if (pole.canMove() && KEY_DOWN in keysDown && !pole.isAboveBranch()) {
      if(score > 0) {
        score -= 10;

        treesSm.y -= 1;
        treesLg.y -= 1;

        pole.startMovingDown(function(){
          hero.adjustPosition();
        });

        hero.adjustPosition();
      }
    }

    if (KEY_LEFT in keysDown) {
      hero.flipTrunkSide('left');
    }

    if (KEY_RIGHT in keysDown) {
      hero.flipTrunkSide('right');
    }
  };
  
  var then = Date.now();

  /**
   * Main game loop.
   */
  var main = function () {
    var now = Date.now();
    var delta = now - then;

    update(delta / 1000);
    updateScore();
    render();

    then = now;

    // Request to do this again ASAP
    requestAnimationFrame(main);
  };

  main();
};