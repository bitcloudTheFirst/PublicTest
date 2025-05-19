const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const startScreen = document.getElementById('start-screen');
const startButton = document.getElementById('start-button');

let scale = 20;
let rows, cols;
let score = 0;
let running = false;

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playTone(freq, duration) {
    const oscillator = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    oscillator.connect(gain);
    gain.connect(audioCtx.destination);
    oscillator.type = 'square';
    oscillator.frequency.value = freq;
    oscillator.start();
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
    oscillator.stop(audioCtx.currentTime + duration / 1000);
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    rows = Math.floor(canvas.height / scale);
    cols = Math.floor(canvas.width / scale);
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

let snake = {
    x: Math.floor(cols / 2) * scale,
    y: Math.floor(rows / 2) * scale,
    dx: scale,
    dy: 0,
    cells: [],
    maxCells: 4
};

let food = getRandomFood();

function getRandomFood() {
    return {
        x: Math.floor(Math.random() * cols) * scale,
        y: Math.floor(Math.random() * rows) * scale
    };
}

function loop() {
    requestAnimationFrame(loop);
    if (!running) return;

    if (++count < 5) {
        return;
    }
    count = 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    snake.x += snake.dx;
    snake.y += snake.dy;

    if (snake.x < 0) {
        snake.x = canvas.width - scale;
    } else if (snake.x >= canvas.width) {
        snake.x = 0;
    }

    if (snake.y < 0) {
        snake.y = canvas.height - scale;
    } else if (snake.y >= canvas.height) {
        snake.y = 0;
    }

    snake.cells.unshift({x: snake.x, y: snake.y});

    if (snake.cells.length > snake.maxCells) {
        snake.cells.pop();
    }

    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, scale, scale);

    ctx.fillStyle = 'lime';
    snake.cells.forEach((cell, index) => {
        ctx.fillRect(cell.x, cell.y, scale, scale);

        if (cell.x === food.x && cell.y === food.y) {
            snake.maxCells++;
            score += 10;
            scoreEl.textContent = `Score: ${score}`;
            playTone(440, 150);
            food = getRandomFood();
        }

        for (let i = index + 1; i < snake.cells.length; i++) {
            if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
                snake.maxCells = 4;
                snake.cells = [];
                snake.x = Math.floor(cols / 2) * scale;
                snake.y = Math.floor(rows / 2) * scale;
                snake.dx = scale;
                snake.dy = 0;
                food = getRandomFood();
                running = false;
                playTone(220, 300);
                startButton.textContent = 'Restart Game';
                startScreen.style.display = 'flex';
            }
        }
    });
}

let count = 0;
document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft' && snake.dx === 0) {
        snake.dx = -scale;
        snake.dy = 0;
    } else if (e.key === 'ArrowUp' && snake.dy === 0) {
        snake.dy = -scale;
        snake.dx = 0;
    } else if (e.key === 'ArrowRight' && snake.dx === 0) {
        snake.dx = scale;
        snake.dy = 0;
    } else if (e.key === 'ArrowDown' && snake.dy === 0) {
        snake.dy = scale;
        snake.dx = 0;
    }
});

startButton.addEventListener('click', () => {
    startScreen.style.display = 'none';
    score = 0;
    scoreEl.textContent = 'Score: 0';
    snake.x = Math.floor(cols / 2) * scale;
    snake.y = Math.floor(rows / 2) * scale;
    snake.dx = scale;
    snake.dy = 0;
    snake.cells = [];
    snake.maxCells = 4;
    food = getRandomFood();
    running = true;
    playTone(660, 150);
});

requestAnimationFrame(loop);
