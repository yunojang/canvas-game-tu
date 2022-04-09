var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');
var info = {
    x: 30,
    y: canvas.height - 40,
    message: '',
    render: function () {
        ctx.fillText(this.message, this.x, this.y);
    }
};
function Ball(x, y) {
    var _this = this;
    this.x = x;
    this.y = y;
    this.radius = 15;
    this.xSpeed = 2.5;
    this.ySpeed = 2.5;
    this.render = function () {
        ctx.beginPath();
        ctx.fillStyle = '#8adffa';
        ctx.arc(_this.x, _this.y, _this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    };
    this.initalize = function () {
        _this.x = x;
        _this.y = y;
        _this.xSpeed = 2.5;
        _this.ySpeed = 2.5;
    };
    this.turnLeft = function () {
        _this.xSpeed = -Math.abs(_this.xSpeed);
    };
    this.turnRight = function () {
        _this.xSpeed = Math.abs(_this.xSpeed);
    };
    this.turnDown = function () {
        _this.ySpeed = Math.abs(_this.ySpeed);
    };
    this.turnUp = function (speed) {
        if (speed === void 0) { speed = 0; }
        _this.ySpeed = -Math.abs(_this.ySpeed + speed);
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
        ctx.fillStyle = '#666';
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
var Visible;
(function (Visible) {
    Visible[Visible["SHOW"] = 0] = "SHOW";
    Visible[Visible["HIDE"] = 1] = "HIDE";
})(Visible || (Visible = {}));
var Block = /** @class */ (function () {
    function Block(x, y) {
        var _this = this;
        this.render = function () {
            ctx.beginPath();
            ctx.fillStyle = '#666';
            ctx.rect(_this.x, _this.y, _this.width, _this.height);
            ctx.fill();
            ctx.closePath();
        };
        this.width = 75;
        this.height = 20;
        this.x = x;
        this.y = y;
        this.state = Visible.SHOW;
    }
    return Block;
}());
var ball = new Ball(canvas.width / 2, canvas.height / 2);
var paddle = new Paddle();
function Player(life) {
    var _this = this;
    this.life = life;
    this.lifeDecrease = function () {
        _this.life--;
        ball.initalize();
        info.message = "life: ".concat(_this.life);
    };
    this.gameover = function () {
        info.message = 'Gameover';
        setTimeout(function () {
            location.reload();
        }, 500);
    };
    this.victory = function () {
        info.message = 'Victory';
        setTimeout(function () {
            location.reload();
        }, 500);
    };
}
var player = new Player(3);
info.message = "life: ".concat(player.life);
var drawBlocks = function (blocks) {
    for (var _i = 0, blocks_1 = blocks; _i < blocks_1.length; _i++) {
        var col = blocks_1[_i];
        for (var _a = 0, col_1 = col; _a < col_1.length; _a++) {
            var block = col_1[_a];
            if (block.state === Visible.SHOW) {
                block.render();
            }
        }
    }
};
var score = 0;
var renderScore = function () {
    ctx.font = '20px Arial';
    ctx.fillStyle = '#888';
    var text = "[".concat(score, "]");
    ctx.fillText(text, 10, 35);
};
var incraseScore = function () {
    score++;
};
var decreaseScore = function () {
    score--;
};
var makeBlock = function (row, col, padding, offsetLeft, offsetTop) {
    var blocks = [];
    for (var c = 0; c < col; c++) {
        blocks[c] = [];
        for (var r = 0; r < row; r++) {
            var block = new Block(0, 0);
            var x = offsetLeft + c * (block.width + padding);
            var y = offsetTop + r * (block.height + padding);
            block.x = x;
            block.y = y;
            blocks[c][r] = block;
        }
    }
    return blocks;
};
var rowCnt = 3;
var colCnt = 7;
var blocks = makeBlock(rowCnt, colCnt, 15, 50, 40);
var collisionDetection = function (blocks) {
    for (var _i = 0, blocks_2 = blocks; _i < blocks_2.length; _i++) {
        var col = blocks_2[_i];
        for (var _a = 0, col_2 = col; _a < col_2.length; _a++) {
            var block = col_2[_a];
            var x = block.x, y = block.y, width = block.width, height = block.height;
            var radius = ball.radius;
            var isVisible = block.state === Visible.SHOW;
            if (isVisible) {
                var inX = x < ball.x + radius && x + width > ball.x - radius;
                var inY = y < ball.y + radius && y + height > ball.y - radius;
                if (inX && inY) {
                    block.state = Visible.HIDE;
                    ball.turnDown();
                    incraseScore();
                    if (score === rowCnt * colCnt) {
                        player.victory();
                    }
                }
            }
        }
    }
};
var draw = function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // blocks
    drawBlocks(blocks);
    collisionDetection(blocks);
    ball.render();
    paddle.render();
    info.render();
    renderScore();
    // ball
    if (ball.x + ball.xSpeed < ball.radius ||
        ball.x + ball.xSpeed > canvas.width - ball.radius) {
        ball.xSpeed = -ball.xSpeed;
    }
    var xSpeed = ball.xSpeed, ySpeed = ball.ySpeed;
    var ballBottom = ball.y + ball.radius;
    var isHit = ballBottom + ySpeed === paddle.y &&
        ball.x > paddle.x &&
        ball.x < paddle.x + paddle.width;
    if (ball.y + ySpeed < ball.radius) {
        ball.turnDown();
    }
    else if (isHit) {
        ball.turnUp(0.5);
        if (control.leftPressed) {
            ball.turnLeft();
        }
        else if (control.rightPressed) {
            ball.turnRight();
        }
    }
    else if (ballBottom + ySpeed > canvas.height) {
        if (player.life > 1) {
            player.lifeDecrease();
        }
        else {
            player.gameover();
        }
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
};
var control = {
    leftPressed: false,
    rightPressed: false,
    isMouseDown: false
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
var handleMouseDown = function (e) {
    control.isMouseDown = true;
    var handleMouseUp = function () {
        control.isMouseDown = false;
        document.removeEventListener('mouseup', handleMouseUp);
    };
    document.addEventListener('mouseup', handleMouseUp);
};
var moveMouse = function (e) {
    if (!control.isMouseDown)
        return;
    paddle.move(e.movementX);
};
document.addEventListener('keydown', handleKeyDown, false);
document.addEventListener('keyup', handleKeyUp, false);
document.addEventListener('mousedown', handleMouseDown, false);
document.addEventListener('mousemove', moveMouse, false);
setInterval(draw, 10);
