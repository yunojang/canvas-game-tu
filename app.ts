let canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');

function Ball(x: number, y: number) {
  this.x = x;
  this.y = y;
  this.radius = 15;

  this.xSpeed = 2.5;
  this.ySpeed = 2.5;

  this.render = () => {
    ctx.beginPath();
    ctx.fillStyle = '#8adffa';
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
  };

  this.turnLeft = () => {
    this.xSpeed = -Math.abs(this.xSpeed);
  };

  this.turnRight = () => {
    this.xSpeed = Math.abs(this.xSpeed);
  };

  this.turnDown = () => {
    this.ySpeed = Math.abs(this.ySpeed);
  };

  this.turnUp = () => {
    this.ySpeed = -Math.abs(this.ySpeed);
  };

  this.move = (mx: number, my: number) => {
    this.x += mx;
    this.y += my;
  };
}

function Paddle() {
  this.width = 120;
  this.height = 10;
  this.x = (canvas.width - this.width) / 2;
  this.y = canvas.height - this.height - 10;

  this.render = () => {
    ctx.beginPath();
    ctx.fillStyle = '#666';
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.fill();
    ctx.closePath();
  };

  this.move = (mx: number) => {
    let dx = this.x + mx;
    dx = Math.max(dx, 0);
    dx = Math.min(dx, canvas.width - this.width);

    this.x = dx;
  };
}

enum Visible {
  SHOW,
  HIDE,
}

class Block {
  width: number;
  height: number;
  x: number;
  y: number;
  state: Visible;

  constructor(x: number, y: number) {
    this.width = 75;
    this.height = 20;
    this.x = x;
    this.y = y;
    this.state = Visible.SHOW;
  }

  render = () => {
    ctx.beginPath();
    ctx.fillStyle = '#666';
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.fill();
    ctx.closePath();
  };
}

const ball = new Ball(canvas.width / 2, canvas.height / 2);
const paddle = new Paddle();

const gameover = () => {
  location.reload();
};

type Blocks = Block[][];

const makeBlock = (
  row: number,
  col: number,
  padding: number,
  offsetLeft: number,
  offsetTop: number
) => {
  const blocks: Blocks = [];

  for (let c = 0; c < col; c++) {
    blocks[c] = [];
    for (let r = 0; r < row; r++) {
      const block = new Block(0, 0);
      const x = offsetLeft + c * (block.width + padding);
      const y = offsetTop + r * (block.height + padding);
      block.x = x;
      block.y = y;
      blocks[c][r] = block;
    }
  }

  return blocks;
};

const drawBlocks = (blocks: Blocks) => {
  for (const col of blocks) {
    for (const block of col) {
      if (block.state === Visible.SHOW) {
        block.render();
      }
    }
  }
};

const collisionDetection = (blocks: Blocks) => {
  for (const col of blocks) {
    for (const block of col) {
      const { x, y, width, height } = block;
      const { radius } = ball;
      const isVisible = block.state === Visible.SHOW;

      if (isVisible) {
        const inX = x < ball.x + radius && x + width > ball.x - radius;
        const inY = y < ball.y + radius && y + height > ball.y - radius;

        if (inX && inY) {
          block.state = Visible.HIDE;
          ball.turnDown();
        }
      }
    }
  }
};

const blocks = makeBlock(4, 7, 15, 50, 40);

const draw = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // blocks
  drawBlocks(blocks);
  collisionDetection(blocks);

  ball.render();
  paddle.render();

  // ball
  if (
    ball.x + ball.xSpeed < ball.radius ||
    ball.x + ball.xSpeed > canvas.width - ball.radius
  ) {
    ball.xSpeed = -ball.xSpeed;
  }

  const { xSpeed, ySpeed } = ball;
  const ballBottom = ball.y + ball.radius;
  const isHit =
    ballBottom + ySpeed === paddle.y &&
    ball.x > paddle.x &&
    ball.x < paddle.x + paddle.width;

  if (ball.y + ySpeed < ball.radius) {
    ball.turnDown();
  } else if (isHit) {
    ball.turnUp();

    if (control.leftPressed) {
      ball.turnLeft();
    } else if (control.rightPressed) {
      ball.turnRight();
    }
  } else if (ballBottom + ySpeed > canvas.height) {
    gameover();
  }

  ball.move(xSpeed, ySpeed);

  // paddle
  const speed = 7;
  if (control.leftPressed) {
    paddle.move(-speed);
  } else if (control.rightPressed) {
    paddle.move(speed);
  }
};

interface Control {
  leftPressed: boolean;
  rightPressed: boolean;
}

const control: Control = {
  leftPressed: false,
  rightPressed: false,
};

const handleKeyDown = (e: KeyboardEvent) => {
  const { key } = e;

  if (key === 'ArrowLeft') {
    control.leftPressed = true;
  } else if (key === 'ArrowRight') {
    control.rightPressed = true;
  }
};

const handleKeyUp = (e: KeyboardEvent) => {
  const { key } = e;

  if (key === 'ArrowLeft') {
    control.leftPressed = false;
  } else if (key === 'ArrowRight') {
    control.rightPressed = false;
  }
};

document.addEventListener('keydown', handleKeyDown, false);
document.addEventListener('keyup', handleKeyUp, false);

setInterval(draw, 10);
