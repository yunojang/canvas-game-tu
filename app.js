var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext("2d");
function Ball(x, y) {
    var _this = this;
    this.x = x;
    this.y = y;
    this.radius = 15;
    this.xSpeed = 2.5;
    this.ySpeed = 2.5;
    this.render = function () {
        ctx.beginPath();
        ctx.fillStyle = 'skyblue';
        ctx.arc(_this.x, _this.y, _this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    };
    this.move = function (mx, my) {
        _this.x += mx;
        _this.y += my;
    };
}
function Paddle() {
    var _this = this;
    this.width = 120;
    this.height = 10;
    this.x = (canvas.width - this.width) / 2;
    this.y = canvas.height - this.height - 10;
    this.render = function () {
        ctx.beginPath();
        ctx.fillStyle = '#888';
        ctx.rect(_this.x, _this.y, _this.width, _this.height);
        ctx.fill();
        ctx.closePath();
    };
    this.move = function (mx) {
        var dx = _this.x + mx;
        dx = Math.max(dx, 0);
        dx = Math.min(dx, canvas.width - _this.width);
        _this.x = dx;
    };
}
function Block(x, y) {
    this.width = 75;
    this.height = 20;
    this.x = x;
    this.y = y;
}
var ball = new Ball(canvas.width / 2, canvas.height / 2);
var paddle = new Paddle();
var gameover = function () {
    location.reload();
};
var draw = function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // ball
    if (ball.x + ball.xSpeed < ball.radius || ball.x + ball.xSpeed > canvas.width - ball.radius) {
        ball.xSpeed = -ball.xSpeed;
        // dx = -dx;
    }
    var xSpeed = ball.xSpeed, ySpeed = ball.ySpeed;
    var ballBottom = ball.y + ball.radius;
    var isHit = (ballBottom + ySpeed === paddle.y) && ball.x > paddle.x && ball.x < paddle.x + paddle.width;
    if (ball.y + ySpeed < ball.radius) {
        ball.ySpeed = -ySpeed;
        // dy = -dy;
    }
    else if (isHit) {
        ball.ySpeed = -ySpeed;
        if (control.leftPressed) {
            ball.xSpeed = -(Math.abs(xSpeed));
        }
        else if (control.rightPressed) {
            ball.xSpeed = Math.abs(xSpeed);
        }
    }
    else if (ballBottom + ySpeed > canvas.height) {
        gameover();
    }
    ball.move(xSpeed, ySpeed);
    // paddle
    var speed = 7;
    if (control.leftPressed) {
        paddle.move(-speed);
    }
    else if (control.rightPressed) {
        paddle.move(speed);
    }
    // block
    ball.render();
    paddle.render();
};
var control = {
    leftPressed: false,
    rightPressed: false
};
var handleKeyDown = function (e) {
    var key = e.key;
    if (key === 'ArrowLeft') {
        control.leftPressed = true;
    }
    else if (key === 'ArrowRight') {
        control.rightPressed = true;
    }
};
var handleKeyUp = function (e) {
    var key = e.key;
    if (key === 'ArrowLeft') {
        control.leftPressed = false;
    }
    else if (key === 'ArrowRight') {
        control.rightPressed = false;
    }
};
document.addEventListener('keydown', handleKeyDown, false);
document.addEventListener('keyup', handleKeyUp, false);
setInterval(draw, 10);
