const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Load images
const playerImage = new Image();
playerImage.src = 'static/images/player.png';

const enemyImage = new Image();
enemyImage.src = 'static/images/enemy.png';

const backgroundImage = new Image();
backgroundImage.src = 'static/images/backround.png';

// Game state
let score = 0;
let gameOver = false;

// Player character
const player = {
    x: canvas.width / 2,
    y: canvas.height - 100,
    width: 80,
    height: 80,
    speed: 5
};

// Enemies array
let enemies = [];
const enemySpeed = 3;

// Controls
let keys = {
    ArrowLeft: false,
    ArrowRight: false
};

// Event listeners for controls
document.addEventListener('keydown', (e) => {
    if (keys.hasOwnProperty(e.key)) {
        keys[e.key] = true;
    }
});

document.addEventListener('keyup', (e) => {
    if (keys.hasOwnProperty(e.key)) {
        keys[e.key] = false;
    }
});

// Create new enemy
function createEnemy() {
    const enemy = {
        x: Math.random() * (canvas.width - 60),
        y: -60,
        width: 60,
        height: 60
    };
    enemies.push(enemy);
}

// Update game state
function update() {
    if (gameOver) return;

    // Update player position
    if (keys.ArrowLeft && player.x > 0) {
        player.x -= player.speed;
    }
    if (keys.ArrowRight && player.x < canvas.width - player.width) {
        player.x += player.speed;
    }

    // Update enemies
    enemies.forEach((enemy, index) => {
        enemy.y += enemySpeed;

        // Check collision
        if (
            player.x < enemy.x + enemy.width &&
            player.x + player.width > enemy.x &&
            player.y < enemy.y + enemy.height &&
            player.y + player.height > enemy.y
        ) {
            gameOver = true;
        }

        // Remove enemies that are off screen
        if (enemy.y > canvas.height) {
            enemies.splice(index, 1);
            score++;
            document.getElementById('scoreValue').textContent = score;
        }
    });

    // Randomly create new enemies
    if (Math.random() < 0.02) {
        createEnemy();
    }
}

// Draw game objects
function draw() {
    // Clear canvas first
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background
    try {
        ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    } catch (e) {
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Draw player
    try {
        ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);
    } catch (e) {
        ctx.fillStyle = '#00ff00';
        ctx.fillRect(player.x, player.y, player.width, player.height);
    }

    // Draw enemies
    enemies.forEach(enemy => {
        try {
            ctx.drawImage(enemyImage, enemy.x, enemy.y, enemy.width, enemy.height);
        } catch (e) {
            ctx.fillStyle = '#ff0000';
            ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        }
    });

    // Draw game over text
    if (gameOver) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#fff';
        ctx.font = '48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2);
        ctx.font = '24px Arial';
        ctx.fillText(`Final Score: ${score}`, canvas.width / 2, canvas.height / 2 + 40);
        ctx.fillText('Press Space to Restart', canvas.width / 2, canvas.height / 2 + 80);
    }
}

// Handle game restart
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && gameOver) {
        // Reset game state
        gameOver = false;
        score = 0;
        document.getElementById('scoreValue').textContent = score;
        enemies = [];
        player.x = canvas.width / 2;
        player.y = canvas.height - 100;
    }
});

// Game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();
