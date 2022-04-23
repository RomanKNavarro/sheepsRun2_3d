var canvas = document.getElementById("canvas1");
var cxt = canvas.getContext("2d");
canvas.width = 900;
canvas.height = 800;

let distance = 0;
let frame = 0;
let sheepFrame = 15;

let oppSpeed = 1;
let oppSizePlus = 0.28;

let nextLevelScore = 100;
let gameOver = false;

var controller;

controller = {
  right: false,
  left: false,
  spacebar: false,
  keyListener: function (event) {
    var key_state = event.type === "keydown" ? true : false;

    switch (event.keyCode) {
      case 39: // right key
        controller.right = key_state;
        sheep1.leaningRight = key_state;

        break;
    }

    switch (event.keyCode) {
      case 37: // left key
        controller.left = key_state;
        sheep1.leaningLeft = key_state;

        break;
    }

    switch (event.keyCode) {
      case 32: // space bar
        controller.spacebar = key_state;
        break;
    }
  }
};

window.addEventListener("keydown", controller.keyListener);
window.addEventListener("keyup", controller.keyListener);

class Floor {
  constructor() {
    this.y = canvas.height - 150;
    this.x = 0;
    this.width = canvas.width;
    this.height = canvas.height / 2;
  }
  draw() {
    cxt.fillStyle = "yellow";
    cxt.fillRect(this.x, this.y, this.width, this.height);
  }
}

let floor1 = new Floor();

function gameStatus() {
  cxt.fillStyle = "black";
  cxt.font = "40px Tourney";
  cxt.fillText("Score: " + distance, 20, 40);

  cxt.fillStyle = "black";
  cxt.font = "40px Tourney";
  cxt.fillText("To Next Level: " + nextLevelScore, 320, 40);

  if (gameOver) {
    cxt.fillStyle = "black";
    cxt.font = "90px Tourney";
    cxt.fillText("GAME OVER", 135, 300);
  }

  if (distance === nextLevelScore) {
    advance();
  }
}

function advance() {
  oppSpeed += 0.1;
  oppSizePlus += 0.05;
  nextLevelScore += 100;
}

setInterval(function () {
  if (!gameOver) {
    distance++;
  }
}, 100);

const roadImage = new Image();
roadImage.src = "/src/images/roadBaseImage.png";

class roadLine {
  // ALSO HANDLES ROAD ITSELF
  constructor() {
    this.height = 10;
    this.width = 5;
    this.y = canvas.height * 0.1;
    this.x = canvas.width * 0.475;
    this.speed = oppSpeed;
    this.delete = false;

    // road shit
    this.roadx = canvas.width * 0.1;
    this.roady = -50;
    this.roadwidth = 700;
    this.roadheight = 900;
  }

  draw() {
    cxt.fillStyle = "yellow";
    cxt.fillRect(this.x, this.y, this.width, this.height);
  }

  drawRoad() {
    // ROAD IMAGE
    cxt.drawImage(
      roadImage,
      this.roadx,
      this.roady,
      this.roadwidth,
      this.roadheight
    );
  }
  update() {
    this.y += oppSpeed;

    this.height += oppSpeed * 0.1;
    this.width += 0.02;
  }
}

let road1 = new roadLine();
function handleRoad() {
  road1.drawRoad();
  for (let i = 0; i < oppQueue.length; i++) {
    let current = oppQueue[i];
    current.update();
    current.draw();
    //console.log(current.x);

    if (current.y >= canvas.height - 20) {
      current.delete = true;
    }
  }

  if (frame % 100 === 0) {
    oppQueue.push(new roadLine());
  }
}

function drawHorizon() {
  cxt.fillStyle = "red";
  cxt.fillRect(0, 0, canvas.width, 144); // this.x, this.y, this.size, this.size

  cxt.fillStyle = "yellow";
  cxt.beginPath();
  cxt.ellipse(
    canvas.width * 0.5 - 50,
    100,
    50,
    50,
    Math.PI / 4,
    0,
    4 * Math.PI
  );
  cxt.fill();
}

const foregroundLayer1 = new Image();
foregroundLayer1.src = "src/images/pixelGrass.jpg";

// for the moving grass
class Layer {
  constructor(image, speedModifier, yStart, stretch) {
    this.x = 0;
    this.y = yStart;
    this.width = 900;
    this.height = 800;
    this.image = image;
    this.speedModifier = speedModifier;
    this.speed = oppSpeed;
  }
  update() {
    this.speed = oppSpeed;
    if (this.y >= this.height) {
      this.y = 0;
    }
    //this.y = this.y + this.speed;
    this.y = this.y + this.speed;
  }
  draw() {
    cxt.drawImage(
      this.image,
      this.x,
      this.y - this.height,
      this.width,
      this.height
    );
    cxt.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
}

//const layer1 = new Layer(foregroundLayer1, 1.5, -195, 100);
const layer1 = new Layer(foregroundLayer1, 1.5, 100, 100);
function handleLayer() {
  layer1.draw();
  if (!gameOver) {
    layer1.update();
  }
}

let randFrames = [300, 250, 200];

const lanes = [
  //[-10, -0.6],
  [0, -0.2],
  [15, -0.3],
  [20, -0.3],
  [25, 0],
  [30, 0.3],
  [35, 0.3],
  [40, 0.2]
]; // spawn point, x increase/decrease;

const oppTypes = {
  jumpOverBar: [10, 5, oppSpeed],
  smallDitch: [5, 5, oppSpeed],
  evilBall: [5, 5, oppSpeed + 5]
}; // TODO: width, height, speed

let sins3 = [
  ["👺", "Warren sold his soul to the devil!"],
  ["👶", "Warren felt good for 2 seconds and now must pay forever!"],
  ["👃", "Warren was sniffed out!"],
  ["🦻", "Warren heard some gay shit and impaired his hearing!"],
  ["🤰", "Warren did not pull out in time!"],
  ["👨‍🦼", "Warren hit an impaired person and became impaired himself!"],
  ["🍆", "Warren looked at Roman and became gay!"],
  ["🍌", "Warren looked at Roman and became gay!"]
];

class Sheep {
  constructor() {
    this.color = "purple";

    this.height = 150;
    this.width = 150;
    this.x = canvas.width * 0.5;
    this.y = floor1.y - 80;
    this.y_velocity = 0;
    this.timer = 0;
    this.jumping = true;
    this.deadSpace = 70;

    this.frameX = 0;
    this.frameY = 0;
    this.spriteWidth = 302;
    this.spriteHeight = 300;
    this.minFrame = 0;
    this.maxFrame = 2;

    this.enemyFrame = 100;

    this.size = 50;

    this.jumping = true;

    this.leaningLeft = false;
    this.leaningRight = false;
  }
  update() {
    /*if (!this.leaningLeft && !this.leaningRight) {
      this.frameX = 0;
      this.leaningLeft = false;
      this.leaningRight = false;
    }

 */

    if (frame % sheepFrame === 0 && sheepFrame > 0) {
      if (this.frameX < this.maxFrame) this.frameX++;
      else this.frameX = this.minFrame;
    }
    if (this.leaningLeft) {
      this.frameX = 1;
    }
    if (this.leaningRight) {
      this.frameX = 2;
    }
  }

  draw() {
    cxt.drawImage(
      warren,
      this.frameX * this.spriteWidth,
      0,
      this.spriteWidth,
      this.spriteHeight,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }
}

let sheep1 = new Sheep();

const warren = new Image();
warren.src = "/src/images/warrenFrames.png";

function handleSheep() {
  sheep1.draw();

  if (!gameOver) {
    sheep1.update();
  }

  if (controller.right && !gameOver) {
    sheep1.x += 5;
  }

  if (controller.left && !gameOver) {
    sheep1.x -= 5;
  }

  if (controller.spacebar && sheep1.jumping === false && !gameOver) {
    sheep1.y_velocity -= 40;
    sheep1.jumping = true;
  }

  sheep1.y_velocity += 1;
  sheep1.y += sheep1.y_velocity;
  sheep1.y_velocity *= 0.9; // jump logic itself

  if (sheep1.y > floor1.y) {
    // keeps sheep from falling under floor
    sheep1.jumping = false;
    sheep1.y = floor1.y;
    sheep1.y_velocity = 0;
  }
}

// characters
let oppQueue = [];

const mcqueen = new Image();
mcqueen.src = "/src/images/mcqueenBed2.png";

const char1 = [mcqueen, oppSpeed * 2, 150, 150]; // image, width, height
let characterTypes = [char1];

class Opp {
  constructor() {
    this.character =
      characterTypes[Math.floor(Math.random() * characterTypes.length)];

    this.image = this.character[0];
    this.speed = this.character[1];
    this.width = this.character[2];
    this.height = this.character[3];

    this.spawnAreaLeft = this.spawnAreaLeft = 300;
    this.spawnAreaRight = canvas.width - 300;

    this.y = canvas.height * 0.15;

    this.randomLane = lanes[Math.floor(Math.random() * lanes.length)];

    /*this.randomLane[0] =
      randomSpawns[Math.floor(Math.random() * randomSpawns.length)]; */
    this.x = canvas.width * 0.45 + this.randomLane[0];

    this.delete = false;

    this.sizePlus = oppSizePlus;

    this.spawnFrame = randFrames[Math.floor(Math.random() * randFrames.length)];
  }

  draw() {
    cxt.drawImage(mcqueen, this.x, this.y, this.width, this.height);
  }
  update() {
    this.y += this.speed;
    this.x += this.randomLane[1] * oppSpeed;

    if (this.size <= 50) this.size += this.sizePlus;
  }
}

function handleOpp() {
  for (let i = 0; i < oppQueue.length; i++) {
    let current = oppQueue[i];
    current.update();
    current.draw();
    //console.log(current.x);

    if (current.y >= canvas.height - 20) {
      current.delete = true;
    }
  }

  if (frame % randFrames[Math.floor(Math.random() * randFrames.length)] === 0) {
    oppQueue.push(new Opp());
  }
}

function loop() {
  cxt.clearRect(0, 0, canvas.width, canvas.height); // clears screen
  handleLayer();
  gameStatus();
  //drawHorizon();
  //gameDisplay();
  //handleRoad();

  handleRoad();
  handleOpp();
  handleSheep();
  frame++;

  window.requestAnimationFrame(loop);
}

window.requestAnimationFrame(loop);
