const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
let scale = 20;
let rows, cols;

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

requestAnimationFrame(loop);
