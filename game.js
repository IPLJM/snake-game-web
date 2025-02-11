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

function preload() {
    backgroundImg = loadImage("background.png", 
        () => console.log("Image de fond chargée ✅"),
        () => console.log("❌ Erreur: background.png introuvable !")
    );
    
    noteImage = loadImage("note.png", 
        () => console.log("Image de note chargée ✅"),
        () => console.log("❌ Erreur: note.png introuvable !")
    );
    
    for (let i = 1; i <= 5; i++) {
        snakeImages.push(loadImage(`snake${i}.png`, 
            () => console.log(`Image snake${i}.png chargée ✅`),
            () => console.log(`❌ Erreur: snake${i}.png introuvable !`)
        ));
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
}

function draw() {
    if (gameOver) {
        background(50);
        fill(255, 0, 0);
        textSize(24);
        textAlign(CENTER, CENTER);
        text("Game Over! Tap to Restart", width / 2, height / 2);
        return;
    }

    if (backgroundImg) {
        background(backgroundImg);
    } else {
        background(50);
    }
    
    snake.update();
    snake.show();
    food.show();
    
    if (snake.eat(food)) {
        food = new Food();
    }
    
    if (snake.isDead()) {
        gameOver = true;
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

function touchStarted(event) {
    if (gameOver) {
        resetGame();
        return;
    }
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
}

function touchEnded(event) {
    let touchEndX = event.changedTouches[0].clientX;
    let touchEndY = event.changedTouches[0].clientY;
    let dx = touchEndX - touchStartX;
    let dy = touchEndY - touchStartY;
    
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
    loop();
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

document.addEventListener("touchstart", touchStarted);
document.addEventListener("touchend", touchEnded);
