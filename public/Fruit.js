function Fruit(x, y, size, color, bad) {
  this.position = createVector(x, y);
  this.color = color;
  this.bad = bad;
  this.size = size;
  this.velocity = createVector(randomXVelocity(x), random(-7, -11));
  this.sliced = false;
  this.slicedTime = 0;
  this.visible = true;
}

Fruit.prototype.update = function () {
  this.position.add(this.velocity);
  this.velocity.x *= 0.99;
  this.velocity.y += GRAVITY;
  this.visible = this.position.y < height;
  if (this.sliced) {
    this.slicedTime++;
  }
};

Fruit.prototype.draw = function () {
  if (this.bad) {
    // Draw skull emoji for bad fruit
    if (this.sliced) {
      endGame();
    }
    textAlign(CENTER, CENTER);
    textSize(this.size * 0.8); // Scale emoji to match fruit size
    noStroke();
    fill(255); // White emoji for visibility
    text("💀", this.position.x, this.position.y);
  } else {
    // Draw good fruit
    var fillColor = this.color;
    if (this.sliced) {
      var interp = constrain(this.slicedTime, 0, 15) / 15;
      fillColor = lerpColor(this.color, color(51), interp);
    }
    noStroke();
    fill(fillColor);
    ellipse(this.position.x, this.position.y, this.size);
  }
};

function randomFruit() {
  var x = random(width);
  var y = height;
  var size = noise(frameCount) * 20 + 20;
  var bad = random() > BAD_FRUIT_PROBABILITY;
  var col;
  if (bad) {
    col = color(100); // Fallback grey for bad fruit (not used in draw)
  } else {
    // Vibrant colors for good fruit
    var goodColors = [
      color(255, 0, 0), // Red (apple)
      color(255, 255, 0), // Yellow (banana)
      color(0, 200, 0), // Green (lime)
      color(128, 0, 128), // Purple (blueberry)
    ];
    col = random(goodColors);
  }
  return new Fruit(x, y, size, col, bad);
}

function randomXVelocity(x) {
  if (x > width / 2) {
    return random(-1.5, -0.5);
  } else {
    return random(0.5, 1.5);
  }
}

// function Fruit(x, y, size, color, bad) {
//   this.position = createVector(x, y);
//   this.color = color;
//   this.bad = bad;
//   this.size = size;
//   this.velocity = createVector(randomXVelocity(x), random(-7, -11));
//   this.sliced = false;
//   this.slicedTime = 0;
//   this.visible = true;
// }

// Fruit.prototype.update = function () {
//   this.position.add(this.velocity);
//   this.velocity.x *= 0.99;
//   this.velocity.y += GRAVITY;
//   this.visible = this.position.y < height;
//   if (this.sliced) {
//     this.slicedTime++;
//   }
// };

// Fruit.prototype.draw = function () {
//   var fillColor = this.color;
//   if (this.sliced) {
//     if (this.bad) {
//       endGame();
//     }
//     var interp = constrain(this.slicedTime, 0, 15) / 15;
//     fillColor = lerpColor(this.color, color(51), interp);
//   }
//   if (this.bad) {
//     stroke("red");
//     strokeWeight(5);
//   } else {
//     noStroke();
//   }
//   fill(fillColor);
//   ellipse(this.position.x, this.position.y, this.size);
// };

// function randomFruit() {
//   var x = random(width);
//   var y = height;
//   var size = noise(frameCount) * 20 + 20;
//   var bad = random() > BAD_FRUIT_PROBABILITY;
//   var r = bad ? 225 : 0;
//   var g = bad ? 0 : noise(frameCount * 2) * 255;
//   var b = bad ? 0 : noise(frameCount * 3) * 255;
//   var col = color(r, g, b);
//   return new Fruit(x, y, size, col, bad);
// }

// function randomXVelocity(x) {
//   if (x > width / 2) {
//     return random(-1.5, -0.5);
//   } else {
//     return random(0.5, 1.5);
//   }
// }
