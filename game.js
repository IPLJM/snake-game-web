let snake;
let food;
let gridSize = 20;
let direction;
let nextDirection;
let canvas;
let backgroundImg;
let noteImage;
let gameOver = false;
let touchStartX, touchStartY;
let snakeImages = [];
let gameOverImages = [];
let score = 0;
let scoreDiv;
let eventInfoDiv;
let titleDiv;
let gameOverImageIndex = 0;

function preload() {
    backgroundImg = loadImage("background.png");
    noteImage = loadImage("note.png");
    for (let i = 1; i <= 5; i++) {
        snakeImages.push(loadImage(`snake${i}.png`));
    }
    for (let i = 1; i <= 3; i++) {
        gameOverImages.push(loadImage(`gameover${i}.png`));
    }
}

class Snake {
    constructor() {
        this.body = [createVector(200, 200)];
        this.length = 1;
    }

    update() {
        direction = nextDirection;
        let newHead = this.body[0].copy().add(p5.Vector.mult(direction, gridSize));

        if (newHead.x >= width || newHead.x < 0 || newHead.y >= height || newHead.y < 0 || this.intersect(newHead)) {
            gameOver = true;
        } else {
            this.body.unshift(newHead);
            if (this.body.length > this.length) {
                this.body.pop();
            }
        }
    }

    show() {
        for (let i = 0; i < this.body.length; i++) {
            let imgIndex = i % snakeImages.length;
            image(snakeImages[imgIndex], this.body[i].x, this.body[i].y, gridSize, gridSize);
        }
    }

    eat(food) {
        if (this.body[0].dist(food.pos) < 1) {
            this.length++;
            return true;
        }
        return false;
    }

    isDead() {
        return gameOver;
    }

    intersect(pos) {
        return this.body.some(segment => segment.equals(pos));
    }
}

class Food {
    constructor() {
        this.pos = createVector(floor(random(width / gridSize)) * gridSize, floor(random(height / gridSize)) * gridSize);
    }

    show() {
        image(noteImage, this.pos.x, this.pos.y, gridSize, gridSize);
    }
}

function setup() {
    canvas = createCanvas(400, 400);
    canvas.parent('game-container');
    frameRate(7);
    snake = new Snake();
    food = new Food();
    direction = createVector(1, 0);
    nextDirection = direction;
    
    document.addEventListener('touchstart', (e) => e.preventDefault(), { passive: false });
    document.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });
    
    // Affichage du titre en haut
    titleDiv = createDiv('🐍 Fais plus de 25 et gagne ta place pour la Boom du Rex 🕺');
    titleDiv.style('font-size', '20px');
    titleDiv.style('padding', '10px');
    titleDiv.style('background', '#222');
    titleDiv.style('color', 'white');
    titleDiv.style('border-radius', '10px');
    titleDiv.style('text-align', 'center');
    titleDiv.style('width', '100%');
    titleDiv.style('position', 'absolute');
    titleDiv.style('top', '10px');
    titleDiv.style('left', '0');
    
    // Affichage du score en bas
    scoreDiv = createDiv('Score: 0');
    scoreDiv.style('font-size', '20px');
    scoreDiv.style('padding', '10px');
    scoreDiv.style('background', '#222');
    scoreDiv.style('color', 'white');
    scoreDiv.style('border-radius', '10px');
    scoreDiv.style('text-align', 'center');
    scoreDiv.style('width', '120px');
    scoreDiv.style('position', 'absolute');
    scoreDiv.style('bottom', '50px');
    scoreDiv.style('left', '50%');
    scoreDiv.style('transform', 'translateX(-50%)');
    
    // Affichage des infos de l'événement
    eventInfoDiv = createDiv('🪩 La Boom du Rex<br>📅 21 février, 00h-5h<br>📍 Le Rex Toulouse');
    eventInfoDiv.style('font-size', '18px');
    eventInfoDiv.style('padding', '10px');
    eventInfoDiv.style('background', '#222');
    eventInfoDiv.style('color', 'white');
    eventInfoDiv.style('border-radius', '10px');
    eventInfoDiv.style('text-align', 'center');
    eventInfoDiv.style('width', '100%');
    eventInfoDiv.style('position', 'absolute');
    eventInfoDiv.style('bottom', '10px');
    eventInfoDiv.style('left', '0');
}

function draw() {
    if (gameOver) {
        image(gameOverImages[gameOverImageIndex], 0, 0, width, height);
        return;
    }
    
    background(backgroundImg);
    
    snake.update();
    snake.show();
    food.show();
    
    if (snake.eat(food)) {
        food = new Food();
        score++;
        scoreDiv.html('Score: ' + score);
    }
    
    if (snake.isDead()) {
        gameOver = true;
        gameOverImageIndex = (gameOverImageIndex + 1) % gameOverImages.length;
    }
}

function resetGame() {
    gameOver = false;
    snake = new Snake();
    food = new Food();
    direction = createVector(1, 0);
    nextDirection = direction;
    score = 0;
    scoreDiv.html('Score: 0');
    loop();
}

document.addEventListener("touchstart", touchStarted);
document.addEventListener("touchend", touchEnded);
