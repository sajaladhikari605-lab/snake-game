let inputDirection = { x: 0, y: 0 };

const musicSound = new Audio('gamesound.mov.mp3');
const gameOverSound = new Audio('gameover.mp3');
const foodSound = new Audio('foodsound.mp3');
musicSound.preload = 'auto';
gameOverSound.preload = 'auto';
foodSound.preload = 'auto';
let speed = 5;
let score = 0;
let lastPaintTime = 0;
let snakeArr = [
    { x: 13, y: 15 }
]
let food = { x: 6, y: 7 };
let board;
let scoreElement;
let isGameRunning = false;









// game functions
function main(currentTime) {
    try {
        window.requestAnimationFrame(main);
        // console.log(currentTime);
        if ((currentTime - lastPaintTime) / 1000 < 1 / speed) {
            return;
        }
        lastPaintTime = currentTime;
        gameEngine();
    } catch (err) {
        console.error('Error in main loop:', err);
    }

}

// game over function
function isCollide(snake) {
    // Check if snake collides with itself
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }

    }
    // Check if snake collides with the walls
    if (snake[0].x >= 18 || snake[0].x <= 0 || snake[0].y >= 18 || snake[0].y <= 0) {
        return true;
    }
    return false;
}

function gameEngine() {
    //  part 1 updating the snake array and food
    if (isCollide(snakeArr)) {
        musicSound.pause();
        musicSound.currentTime = 0;
        isGameRunning = false;
        gameOverSound.currentTime = 0;
        gameOverSound.play().catch(e => console.warn('gameOverSound play prevented', e));
        inputDirection = { x: 0, y: 0 };
        snakeArr = [{ x: 13, y: 15 }];
        score = 0;
        if (scoreElement) {
            scoreElement.innerText = "Score: " + score;
        }
        window.setTimeout(() => {
            alert("Game Over noob. Press any key to play again!");
        }, 20);
    }

    // if you have eaten the food, increment the score and regenerate the food
    if (snakeArr[0].y === food.y && snakeArr[0].x === food.x) {
        foodSound.play().catch(e => console.warn('foodSound play prevented', e));
        score += 1;
        if (scoreElement) {
            scoreElement.innerText = "Score: " + score;
        }
        snakeArr.unshift({ x: snakeArr[0].x + inputDirection.x, y: snakeArr[0].y + inputDirection.y });
        let a = 2;
        let b = 16;
        food = { x: 2 + Math.round(a + (b - a) * Math.random()), y: 2 + Math.round(a + (b - a) * Math.random()) }
    }

    //  moving the snake
    for (let i = snakeArr.length - 2; i >= 0; i--) {

        snakeArr[i + 1] = { ...snakeArr[i] }

    }

    snakeArr[0].x += inputDirection.x;
    snakeArr[0].y += inputDirection.y;

    // part2 display the snake 
    board.innerHTML = "";
    snakeArr.forEach((e, index) => {
        const snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;
        if (index === 0) {
            snakeElement.classList.add('head');
        }
        else {
            snakeElement.classList.add('snake');
        }
        board.appendChild(snakeElement);
    });
    // display the food
    const foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food')
    board.appendChild(foodElement);

}













// main logic start here — initialize after DOM ready to avoid null errors
function init() {
    board = document.getElementById('board');
    scoreElement = document.getElementById('score');
    if (!board) {
        console.error('Board element not found.');
        return;
    }
    if (scoreElement) {
        scoreElement.innerText = "Score: " + score;
    }
    window.requestAnimationFrame(main);

    window.addEventListener('keydown', e => {
        let newDirection = null;
        switch (e.key) {
            case "ArrowUp":
                newDirection = { x: 0, y: -1 };
                break;

            case "ArrowDown":
                newDirection = { x: 0, y: 1 };
                break;

            case "ArrowLeft":
                newDirection = { x: -1, y: 0 };
                break;

            case "ArrowRight":
                newDirection = { x: 1, y: 0 };
                break;

            default:
                return;
        }

        if (!isGameRunning) {
            musicSound.play().catch(e => console.warn('musicSound play prevented', e));
            isGameRunning = true;
        }

        inputDirection = newDirection;
    });
}

if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', init);
} else {
    init();
}