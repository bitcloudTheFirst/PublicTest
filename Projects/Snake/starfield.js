const starCanvas = document.getElementById('starfield');
const starCtx = starCanvas.getContext('2d');
let stars = [];
const STAR_COUNT = 100;

function resizeStarfield() {
    starCanvas.width = window.innerWidth;
    starCanvas.height = window.innerHeight;
    stars = [];
    for (let i = 0; i < STAR_COUNT; i++) {
        stars.push({
            x: Math.random() * starCanvas.width,
            y: Math.random() * starCanvas.height,
            speed: 0.5 + Math.random() * 1.5,
            size: Math.random() * 2 + 0.5
        });
    }
}

function updateStars() {
    starCtx.fillStyle = 'black';
    starCtx.fillRect(0, 0, starCanvas.width, starCanvas.height);
    starCtx.fillStyle = 'white';
    for (const star of stars) {
        star.y += star.speed;
        if (star.y > starCanvas.height) {
            star.y = 0;
            star.x = Math.random() * starCanvas.width;
        }
        starCtx.fillRect(star.x, star.y, star.size, star.size);
    }
    requestAnimationFrame(updateStars);
}

window.addEventListener('resize', resizeStarfield);
resizeStarfield();
updateStars();
