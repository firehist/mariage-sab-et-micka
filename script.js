
AOS.init({
    once: false
});

var myModal = new bootstrap.Modal(document.getElementById('modalKonamiCode'))

var pattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
var current = 0;

var keyHandler = function (event) {

    // If the key isn't in the pattern, or isn't the current key in the pattern, reset
    if (pattern.indexOf(event.key) < 0 || event.key !== pattern[current]) {
        current = 0;
        return;
    }

    // Update how much of the pattern is complete
    current++;

    // If complete, alert and reset
    if (pattern.length === current) {
        current = 0;
        myModal.toggle()
        runSnake()
    }

};

// Listen for keydown events
document.addEventListener('keydown', keyHandler);


const snakeAlreadyInit = false
const runSnake = () => {
    // Canvas and context
    const cvs = document.getElementById("snake");
    const ctx = cvs.getContext("2d");

    // Create the unit
    const box = 32;

    // Load images
    const groundImg = new Image();
    const foodImg = new Image();
    groundImg.src = "img/ground.png";
    foodImg.src = "img/food.png";

    // Load audio files
    const dead = new Audio();
    const eat = new Audio();
    const up = new Audio();
    const left = new Audio();
    const right = new Audio();
    const down = new Audio();
    dead.src = "audio/dead.mp3";
    eat.src = "audio/eat.mp3";
    up.src = "audio/up.mp3";
    left.src = "audio/left.mp3";
    right.src = "audio/right.mp3";
    down.src = "audio/down.mp3";

    // Create the snake
    let snake = [];
    snake[0] = {
        x: 9 * box,
        y: 10 * box
    }

    // Create the food
    let food = {
        x: Math.floor(Math.random() * 17 + 1) * box,
        y: Math.floor(Math.random() * 15 + 3) * box
    }

    // Create the score
    let score = 0;

    // Function to control the snake
    let d;
    if (!snakeAlreadyInit) {
        document.addEventListener("keydown", direction);
    }

    function direction(event) {
        if (event.keyCode == 37 && d != "RIGHT") {
            left.play();
            d = "LEFT";
        } else if (event.keyCode == 38 && d != "DOWN") {
            up.play();
            d = "UP";
        } else if (event.keyCode == 39 && d != "LEFT") {
            right.play();
            d = "RIGHT";
        } else if (event.keyCode == 40 && d != "UP") {
            down.play();
            d = "DOWN";
        } else if (event.keyCode == 13) {
            dead.play();
            snake = [];
            snake[0] = {
                x: 9 * box,
                y: 10 * box
            }
            score = 0
            game = setInterval(draw, 100)
        }
    }

    // Function to check collision
    function collision(head, array) {
        for (let i = 0; i < array.length; i++) {
            if (head.x == array[i].x && head.y == array[i].y) {
                return true;
            }
        }
        return false;
    }

    // Draw everything to canvas
    function draw() {

        // Background
        ctx.drawImage(groundImg, 0, 0);

        // Snake
        for (let i = 0; i < snake.length; i++) {
            ctx.fillStyle = (i == 0) ? "green" : "white";
            ctx.fillRect(snake[i].x, snake[i].y, box, box);

            ctx.strokeStyle = "red";
            ctx.strokeRect(snake[i].x, snake[i].y, box, box);

        }

        // Food
        ctx.drawImage(foodImg, food.x, food.y);

        // Old head position
        let snakeX = snake[0].x;
        let snakeY = snake[0].y;

        // Which direction
        if (d == "LEFT") snakeX -= box;
        if (d == "UP") snakeY -= box;
        if (d == "RIGHT") snakeX += box;
        if (d == "DOWN") snakeY += box;

        // If the snake eats the food
        if (snakeX == food.x && snakeY == food.y) {
            eat.play();
            score++;
            food = {
                x: Math.floor(Math.random() * 17 + 1) * box,
                y: Math.floor(Math.random() * 15 + 3) * box
            }
        } else {
            // Remove the tail
            snake.pop();
        }

        // New head
        let newHead = {
            x: snakeX,
            y: snakeY
        }

        // Check for game over
        if (snakeX < box || snakeX > 17 * box ||
            snakeY < 3 * box || snakeY > 17 * box ||
            collision(newHead, snake)) {
            dead.play();
            clearInterval(game);
        } else {
            // Add new head
            snake.unshift(newHead);
        }

        // Score
        ctx.fillStyle = "white";
        ctx.font = "45px Changa One";
        ctx.fillText(score, 2 * box, 1.6 * box);
    }

    // Call draw function every 100 ms
    let game = setInterval(draw, 100)

    snakeAlreadyInit = true
}