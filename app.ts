let canvas  = document.getElementById('myCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext("2d");

function Ball(x: number, y: number) {
  this.x = x;
  this.y = y;
  this.radius = 15;

  this.xSpeed = 2.5;
  this.ySpeed = 2.5;
  
  this.render = () => {
    ctx.beginPath();
    ctx.fillStyle = 'skyblue';
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
  }

  this.move = (mx:number, my:number) => {
    this.x += mx;
    this.y += my;
  }
}

function Paddle() {
  this.width = 120;
  this.height = 10;
  this.x = (canvas.width - this.width) /2;
  this.y = canvas.height - this.height - 10

  this.render = () => {
    ctx.beginPath();
    ctx.fillStyle = '#888';
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.fill();
    ctx.closePath();
  }

  this.move = (mx: number) => {
    let dx = this.x + mx;
    dx = Math.max(dx, 0);
    dx = Math.min(dx, canvas.width - this.width);

    this.x = dx;
  }
}

class Block {
  width: number;
  height: number;
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.width = 75;
    this.height = 20;
    this.x = x;
    this.y = y;
  }

   render = () => {
    ctx.beginPath();
    ctx.fillStyle = '#888';
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.fill();
    ctx.closePath();
   }
}

const ball = new Ball(canvas.width/2, canvas.height/2);
const paddle = new Paddle();

const gameover = () => {
  location.reload();
}

const blockRow = 3;
const blockCol = 5;
const blockPadding = 10;
const blockOffsetTop = 30;
const blockOffsetLeft = 30;

const makeBlocks = () => {
  const blocks: (Block[])[] = [];

  for(let c=0; c<blockCol; c++) {
    blocks[c] = [];
    for(let r=0; r<blockRow; r++) {
      blocks[c][r] = new Block(0,0);
    }
  }

}

const draw = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // ball
  if (ball.x + ball.xSpeed < ball.radius || ball.x + ball.xSpeed > canvas.width - ball.radius) {
    ball.xSpeed = -ball.xSpeed;
  }

  const {xSpeed, ySpeed} = ball;
  const ballBottom = ball.y + ball.radius;
  const isHit = (ballBottom + ySpeed === paddle.y) && ball.x > paddle.x && ball.x < paddle.x + paddle.width

  if ( ball.y + ySpeed < ball.radius) {
    ball.ySpeed = -ySpeed;
  } else if (isHit) {
    ball.ySpeed = -ySpeed;

    if (control.leftPressed) {
      ball.xSpeed = -(Math.abs(xSpeed));
    } else if (control.rightPressed) {
      ball.xSpeed = Math.abs(xSpeed);
    }
  } else if ( ballBottom + ySpeed > canvas.height) {
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

  // block
  

  ball.render();
  paddle.render();
}

interface Control {
  leftPressed: boolean,
  rightPressed: boolean,
}

const control: Control = {
  leftPressed: false,
  rightPressed: false,
}

const handleKeyDown = (e: KeyboardEvent) => {
  const { key } = e;

  if (key === 'ArrowLeft') {
    control.leftPressed = true;
  } else if (key === 'ArrowRight') {
    control.rightPressed = true;
  }
}

const handleKeyUp = (e: KeyboardEvent) => {
  const { key } = e;

  if (key === 'ArrowLeft') {
    control.leftPressed = false;
  } else if (key === 'ArrowRight') {
    control.rightPressed = false;
  }
}

document.addEventListener('keydown', handleKeyDown, false);
document.addEventListener('keyup', handleKeyUp, false);

setInterval(draw, 10);