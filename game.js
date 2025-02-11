let snake;
let food;
let gridSize = 20;
let direction;
let nextDirection;
let canvas;

function setup() {
    canvas = createCanvas(400, 400);
    canvas.parent('game-container');
    frameRate(10);
    snake = new Snake();
    food = new Food();
    direction = createVector(1, 0);
    nextDirection = direction;
}

function draw() {
    background(0);
    snake.update();
    snake.show();
    food.show();
    
    if (snake.eat(food)) {
        food = new Food();
    }
    
    if (snake.isDead()) {
        noLoop();
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
    let centerX = width / 2;
    let centerY = height / 2;
    
    if (mouseX < centerX && direction.x === 0) {
        nextDirection = createVector(-1, 0);
    } else if (mouseX > centerX && direction.x === 0) {
        nextDirection = createVector(1, 0);
    } else if (mouseY < centerY && direction.y === 0) {
        nextDirection = createVector(0, -1);
    } else if (mouseY > centerY && direction.y === 0) {
        nextDirection = createVector(0, 1);
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
            this.length = 1;
            this.body = [createVector(200, 200)];
        } else {
            this.body.unshift(newHead);
            if (this.body.length > this.length) {
                this.body.pop();
            }
        }
    }

    show() {
        fill(0, 255, 0);
        for (let segment of this.body) {
            rect(segment.x, segment.y, gridSize, gridSize);
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
        return this.length === 1 && this.body[0].x === 200 && this.body[0].y === 200;
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
        fill(255, 0, 0);
        rect(this.pos.x, this.pos.y, gridSize, gridSize);
    }
}
