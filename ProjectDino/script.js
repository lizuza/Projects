//board
let board;
let boardWidth = 750;
let boardHeight = 250;
let context;

//track
let trackWidth = 2404;
let trackHeight = 28;
let trackX = 0;
let trackY = boardHeight - trackHeight;

//dino
let dinoWidth = 88;
let dinoHeight = 94;
let dinoX = 50;
let dinoY = boardHeight - dinoHeight;
let dinoImg;

//cactus
let cactusArray = [];

let cactus1Width = 34;
let cactus2Width = 69
let cactus3Width = 102;

let cactusHeight = 70;
let cactusX = 700;
let cactusY = boardHeight - cactusHeight;

let cactus1Img;
let cactus2Img;
let cactus3Img;

//physics
let velocityX = -8; //speed of the cactus
let velocityY = 0;
let gravity = .4;

let gameOver = false;
let score = 0;

let dino = {
    x : dinoX,
    y : dinoY,
    width : dinoWidth,
    height : dinoHeight,
}

let counter = 0;
let gameRunning = false;

window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;

    context = board.getContext("2d");

    let trackImg = new Image();
    trackImg.src = "./img/track.png";

    let dinoDeadImg = new Image();
    dinoDeadImg.src = "./img/dino-dead.png";
    dinoDeadImg.onload = function() {
        context.drawImage(dinoDeadImg, dino.x, dino.y, dino.width, dino.height);
    };

    dinoImg = new Image();
    dinoImg.src = "./img/dino.png";
    dinoImg.onload = function() {
        context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
    };

    cactus1Img = new Image();
    cactus1Img.src = "./img/cactus1.png";

    cactus2Img = new Image();
    cactus2Img.src = "./img/cactus2.png";

    cactus3Img = new Image();
    cactus3Img.src = "./img/cactus3.png";

    // Start the game loop
    gameRunning = true;
    gameLoop();
    setInterval(placeCactus, 1000);
    document.addEventListener("keydown", moveDino);
}

async function gameLoop() {
    while (gameRunning) {
        update();
        // Wait for next frame (approximately 60 FPS)
        await new Promise(resolve => setTimeout(resolve, 16));
    }
}

function update(){
    counter++
    console.log("counter", counter);

    if(gameOver){
        context.drawImage(dinoDeadImg, dino.x, dino.y, dino.width, dino.height);
        alert("Game Over! Your score: " + score);
        gameRunning = false; // Stop the game loop
        return;
    }

    context.clearRect(0, 0, board.width, board.height);

    //track
    context.drawImage(trackImg, trackX, trackY, trackWidth, trackHeight);
    context.drawImage(trackImg, trackX + trackWidth, trackY, trackWidth, trackHeight);
    trackX += velocityX;
    if (trackX <= -trackWidth) {
        trackX = 0;
    }

    //dino
    context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);

    velocityY += gravity;
    dino.y += velocityY;

    if (dino.y < 0) {
        dino.y = 0;
        velocityY = 0;
    }
    if (dino.y > dinoY) {
        dino.y = dinoY;
        velocityY = 0;
    }

    //cactus
    for(let i = 0; i < cactusArray.length; i++){
        let cactus = cactusArray[i];
        cactus.x += velocityX;
        context.drawImage(cactus.img, cactus.x, cactus.y, cactus.width, cactus.height);

        if (detectCollision(dino, cactus)) {
            gameOver = true;
        }
    }

    //score
    context.fillStyle = "black";
    context.font = "20px courier";
    score++;
    context.fillText(score, 5, 20);
}

function moveDino(e){
    if(gameOver){
        return
    }

    if ((e.code === "Space" || e.code === "ArrowUp") && dino.y === dinoY) {
        velocityY = -10;
    }
}

function placeCactus(){
    if(gameOver){
        return
    }
    let cactus = {
        img : null,
        x : cactusX,
        y : cactusY,
        width : null,
        height : cactusHeight,
    }
    let placeCactusChance = Math.random();

    if(placeCactusChance > 0.70){
        cactus.img = cactus1Img;
        cactus.width = cactus1Width;
        cactusArray.push(cactus);
    }
    else if(placeCactusChance > 0.60){
        cactus.img = cactus2Img;
        cactus.width = cactus2Width;
        cactusArray.push(cactus);
    }
    else if(placeCactusChance > 0.80){
        cactus.img = cactus3Img;
        cactus.width = cactus3Width;
        cactusArray.push(cactus);
    }

    if(cactusArray.length > 5){
        cactusArray.shift(); //remove the first cactus
    }
}

function detectCollision(a, b){
    return a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y;
}