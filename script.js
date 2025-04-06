// Game Constants
const TRACK_WIDTH = 40;
const CAR_WIDTH = 30;
const CAR_HEIGHT = 50;
const MAX_SPEED = 8;
const ACCELERATION = 0.2;
const DECELERATION = 0.3;
const TURN_SPEED = 0.05;

// Track Definition (simple oval track)
const trackPoints = [
    {x: 200, y: 200}, {x: 600, y: 200},
    {x: 600, y: 400}, {x: 200, y: 400}
];

// Game State
let gameState = {
    playerName: '',
    isRacing: false,
    lapTime: 0,
    bestLapTime: Infinity,
    currentSpeed: 0,
    position: { x: 400, y: 300 },
    angle: 0,
    keys: {
        up: false, down: false, left: false, right: false
    }
};

// DOM Elements
const canvas = document.getElementById('trackCanvas');
const ctx = canvas.getContext('2d');

// Initialize Game
function initGame() {
    const startButton = document.getElementById('startButton');
    startButton.addEventListener('click', startRace);
    
    // Set up keyboard controls
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    // Start game loop
    requestAnimationFrame(gameLoop);
}

// Game Loop
function gameLoop() {
    if (gameState.isRacing) {
        update();
        render();
    }
    requestAnimationFrame(gameLoop);
}

// Update Game State
function update() {
    // Handle acceleration/deceleration
    if (gameState.keys.up) {
        gameState.currentSpeed = Math.min(gameState.currentSpeed + ACCELERATION, MAX_SPEED);
    } else if (gameState.keys.down) {
        gameState.currentSpeed = Math.max(gameState.currentSpeed - DECELERATION, 0);
    } else {
        // Natural deceleration
        gameState.currentSpeed = Math.max(gameState.currentSpeed - DECELERATION/2, 0);
    }

    // Handle steering
    if (gameState.keys.left) {
        gameState.angle -= TURN_SPEED * gameState.currentSpeed;
    }
    if (gameState.keys.right) {
        gameState.angle += TURN_SPEED * gameState.currentSpeed;
    }

    // Update position
    gameState.position.x += Math.sin(gameState.angle) * gameState.currentSpeed;
    gameState.position.y -= Math.cos(gameState.angle) * gameState.currentSpeed;
}

// Render Game
function render() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw track
    ctx.beginPath();
    ctx.moveTo(trackPoints[0].x, trackPoints[0].y);
    for (let i = 1; i < trackPoints.length; i++) {
        ctx.lineTo(trackPoints[i].x, trackPoints[i].y);
    }
    ctx.closePath();
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = TRACK_WIDTH;
    ctx.stroke();
    
    // Draw car
    ctx.save();
    ctx.translate(gameState.position.x, gameState.position.y);
    ctx.rotate(gameState.angle);
    ctx.fillStyle = '#e11d48';
    ctx.fillRect(-CAR_WIDTH/2, -CAR_HEIGHT/2, CAR_WIDTH, CAR_HEIGHT);
    ctx.restore();
}

// Handle Keyboard Input
function handleKeyDown(e) {
    switch(e.key) {
        case 'ArrowUp': case 'w': gameState.keys.up = true; break;
        case 'ArrowDown': case 's': gameState.keys.down = true; break;
        case 'ArrowLeft': case 'a': gameState.keys.left = true; break;
        case 'ArrowRight': case 'd': gameState.keys.right = true; break;
    }
}

function handleKeyUp(e) {
    switch(e.key) {
        case 'ArrowUp': case 'w': gameState.keys.up = false; break;
        case 'ArrowDown': case 's': gameState.keys.down = false; break;
        case 'ArrowLeft': case 'a': gameState.keys.left = false; break;
        case 'ArrowRight': case 'd': gameState.keys.right = false; break;
    }
}

// Start Race
function startRace() {
    const driverNameInput = document.getElementById('driverName');
    if (driverNameInput.value.length < 3) {
        alert('Please enter a driver name (min 3 characters)');
        return;
    }
    
    gameState = {
        ...gameState,
        playerName: driverNameInput.value,
        isRacing: true,
        currentSpeed: 0,
        position: { x: 400, y: 300 },
        angle: 0
    };
    
    document.getElementById('trackCanvas').classList.remove('hidden');
    document.getElementById('resultsModal').classList.add('hidden');
}

// Call initGame on page load
window.onload = initGame;
