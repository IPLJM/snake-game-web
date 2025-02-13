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
let score = 0;
let scoreDiv;

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
    
    // Créer le cadre pour afficher le score
    scoreDiv = createDiv('Score: 0');
    scoreDiv.style('font-size', '20px');
    scoreDiv.style('padding', '10px');
    scoreDiv.style('background', '#222');
    scoreDiv.style('color', 'white');
    scoreDiv.style('border-radius', '10px');
    scoreDiv.style('text-align', 'center');
    scoreDiv.style('width', '120px');
    scoreDiv.style('position', 'absolute');
    scoreDiv.style('top', '10px');
    scoreDiv.style('left', '50%');
    scoreDiv.style('transform', 'translateX(-50%)');
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
        score++;
        scoreDiv.html('Score: ' + score);
    }
    
    if (snake.isDead()) {
        gameOver = true;
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
