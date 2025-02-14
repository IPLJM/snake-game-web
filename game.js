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
let specialGameOverImage;
let score = 0;
let scoreDiv;
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
    specialGameOverImage = loadImage("gameover_special.png"); // Image pour le score de 50
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
    scoreDiv.style('bottom', '10px');
    scoreDiv.style('left', '50%');
    scoreDiv.style('transform', 'translateX(-50%)');
}

function draw() {
    if (gameOver) {
        if (score >= 70) {
            image(specialGameOverImage, 0, 0, width, height);
        } else {
            image(gameOverImages[gameOverImageIndex], 0, 0, width, height);
        }
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

function keyPressed() {
    if (keyCode === UP_ARROW && direction.y === 0) {
        nextDirection = createVector(0, -1);
    } else if (keyCode === DOWN_ARROW && direction.y === 0) {
        nextDirection = createVector(0, 1);
    } else if (keyCode === LEFT_ARROW && direction.x === 0) {
        nextDirection = createVector(-1, 0);
    } else if (keyCode === RIGHT_ARROW && direction.x === 0) {
        nextDirection = createVector(1, 0);
    }
}

function touchStarted() {
    if (gameOver) {
        resetGame();
        return;
    }
    touchStartX = mouseX;
    touchStartY = mouseY;
}

function touchEnded() {
    let dx = mouseX - touchStartX;
    let dy = mouseY - touchStartY;
    
    if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 0 && direction.x === 0) {
            nextDirection = createVector(1, 0);
        } else if (dx < 0 && direction.x === 0) {
            nextDirection = createVector(-1, 0);
        }
    } else {
        if (dy > 0 && direction.y === 0) {
            nextDirection = createVector(0, 1);
        } else if (dy < 0 && direction.y === 0) {
            nextDirection = createVector(0, -1);
        }
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
