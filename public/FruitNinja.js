const GRAVITY = 0.2;
const BLADE_SIZE = 20; // number of strokes before fading
const BLADE_LENGTH = 150; // maximum distance between points to connect two strokes
const BAD_FRUIT_PROBABILITY = 0.9; // chance of each fruit being bad
var sword;
var fruit = []; // on-screen fruit
var lives;
var score;
let video;
let poseNet;
let noseX = 0;
let noseY = 0;
let eyelX = 0;
let eyelY = 0;
let gameState = "start";
let errorMessage = null;

function setup() {
  let cnv = createCanvas(640, 480);
  cnv.position(370, 50);
  video = createCapture(VIDEO);
  video.hide();
  poseNet = ml5.poseNet(video, modelReady);
  poseNet.on("pose", gotPoses);
  sword = new Blade(color("#FFF0EE"));
  frameRate(60);
  lives = 20;
  score = 0;
  setupButtons();
}

function setupButtons() {
  const playButton = document.getElementById("playButton");
  const pauseButton = document.getElementById("pauseButton");
  const resumeButton = document.getElementById("resumeButton");
  const restartButton = document.getElementById("restartButton");

  playButton.addEventListener("click", () => {
    console.log("Play button clicked");
    gameState = "playing";
    lives = 5;
    score = 0;
    fruit = [];
    sword.swipes = [];
    loop();
    updateButtonVisibility();
  });

  pauseButton.addEventListener("click", () => {
    console.log("Pause button clicked");
    pauseGame();
  });

  resumeButton.addEventListener("click", () => {
    console.log("Resume button clicked");
    resumeGame();
  });

  restartButton.addEventListener("click", () => {
    console.log("Restart button clicked");
    restartGame();
  });
}

function updateButtonVisibility() {
  document.getElementById("playButton").style.display =
    gameState === "start" ? "block" : "none";
  document.getElementById("pauseButton").style.display =
    gameState === "playing" ? "block" : "none";
  document.getElementById("resumeButton").style.display =
    gameState === "paused" ? "block" : "none";
  document.getElementById("restartButton").style.display =
    gameState === "playing" ||
    gameState === "paused" ||
    gameState === "gameover"
      ? "block"
      : "none";
}

function pauseGame() {
  gameState = "paused";
  noLoop();
  updateButtonVisibility();
}

function resumeGame() {
  gameState = "playing";
  loop();
  updateButtonVisibility();
}

function restartGame() {
  gameState = "playing";
  lives = 5;
  score = 0;
  fruit = [];
  sword.swipes = [];
  noseX = 0;
  noseY = 0;
  eyelX = 0;
  eyelY = 0;
  loop();
  updateButtonVisibility();
}

function gotPoses(poses) {
  console.log(poses);
  if (poses.length > 0) {
    let nX = poses[0].pose.keypoints[0].position.x;
    let nY = poses[0].pose.keypoints[0].position.y;
    let leX = poses[0].pose.keypoints[1].position.x;
    let leY = poses[0].pose.keypoints[1].position.y;
    noseX = lerp(noseX, width - nX, 0.2); // Invert x-coordinate
    noseY = lerp(noseY, nY, 0.2);
    eyelX = lerp(eyelX, width - leX, 0.2); // Invert x-coordinate
    eyelY = lerp(eyelY, leY, 0.2);
  }
}

function modelReady() {
  console.log("model ready");
}

function draw() {
  if (gameState === "start") {
    background(51);
    textAlign(CENTER, CENTER);
    noStroke();
    fill("#FFFFFF");
    // textSize(45);
    // text("Click Play to Start", width / 2, 50);
    textSize(18);
    text(
      "🪑 Get OFF YOUR CHAIR and MOVE yourself to touch colors",
      width / 2,
      120
    );
    text("🕺🏽💃🏽 Dodge skulls 💀", width / 2, 160);
    text("⚪ You got 5 lives, have fun!", width / 2, 200);
  } else if (gameState === "paused") {
    // Keep last frame, add paused text
    textAlign(CENTER, CENTER);
    noStroke();
    fill("#FFFFFF");
    textSize(50);
    text("Paused", width / 2, height / 2);
  } else if (gameState === "gameover") {
    background(51);
    textAlign(CENTER, CENTER);
    noStroke();
    fill("#888888");
    textSize(100);
    text("Game over!", width / 2, height / 2);
  } else if (gameState === "playing") {
    background(51);
    image(video, 0, 0);
    filter(THRESHOLD, 1);
    d = dist(noseX, noseY, eyelX, eyelY);
    ellipse(noseX, noseY, d);
    handleMouse();
    score += handleFruit();
    drawScore();
    drawLives();
  }
}

/**
 * swings and draws the sword
 */
function handleMouse() {
  sword.swing(noseX, noseY);
  if (frameCount % 2 === 0) {
    sword.update();
  }
  sword.draw();
}

/**
 * pushes and updates fruit
 * returns number of points scored
 */
function handleFruit() {
  if (frameCount % 10 === 0) {
    if (noise(frameCount) > 0.66) {
      fruit.push(randomFruit());
    }
  }
  var points = 0;
  for (var i = fruit.length - 1; i >= 0; i--) {
    fruit[i].update();
    fruit[i].draw();
    if (!fruit[i].visible) {
      if (!fruit[i].sliced && !fruit[i].bad) {
        lives--;
      }
      if (lives < 1) {
        endGame();
      }
      fruit.splice(i, 1);
    } else {
      points += sword.checkForSlice(fruit[i]) ? 1 : 0;
    }
  }
  return points;
}

/**
 * draws lives in the top right
 */
function drawLives() {
  stroke(51);
  strokeWeight(1);
  fill("#F9F9F9");
  for (var i = lives; i > 0; i--) {
    ellipse(width - (i * 20 + 20), 50, 20);
  }
}

/**
 * draws score in the top left
 */
function drawScore() {
  textAlign(LEFT);
  noStroke();
  fill(50, 168, 82);
  textSize(50);
  text(score, 10, 50);
}

/**
 * ends the loop, draws message
 */
function endGame() {
  gameState = "gameover";
  noLoop();
  updateButtonVisibility();
}
