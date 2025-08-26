export function initPongPage() {
  const canvas = document.getElementById("pong-canvas") as HTMLCanvasElement;
  if (!canvas) return;
  const ctx = canvas.getContext("2d")!;

  const PADDLE_WIDTH = 10;
  const PADDLE_HEIGHT = 80;
  const BALL_SIZE = 10;

  let leftY = canvas.height / 2 - PADDLE_HEIGHT / 2;
  let rightY = canvas.height / 2 - PADDLE_HEIGHT / 2;
  let ballX = canvas.width / 2;
  let ballY = canvas.height / 2;
  let ballVX = 4 * (Math.random() > 0.5 ? 1 : -1);
  let ballVY = 2 * (Math.random() > 0.5 ? 1 : -1);
  let ballSpeed = 5;

  const keysPressed: Record<string, boolean> = {};

  document.addEventListener("keydown", (e) => {
    if (["ArrowUp", "ArrowDown", "w", "s"].includes(e.key)) {
      e.preventDefault();
      keysPressed[e.key] = true;
    }
  });

  document.addEventListener("keyup", (e) => {
    if (["ArrowUp", "ArrowDown", "w", "s"].includes(e.key)) {
      e.preventDefault();
      keysPressed[e.key] = false;
    }
  });

  function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeed = 5;
    ballVX = ballSpeed * (Math.random() > 0.5 ? 1 : -1);
    ballVY = (Math.random() - 0.5) * 4;
  }

  function update() {
    const paddleSpeed = 6;

    if (keysPressed["w"] && leftY > 0) {
      leftY -= paddleSpeed;
    }
    if (keysPressed["s"] && leftY + PADDLE_HEIGHT < canvas.height) {
      leftY += paddleSpeed;
    }

    if (keysPressed["ArrowUp"] && rightY > 0) {
      rightY -= paddleSpeed;
    }
    if (keysPressed["ArrowDown"] && rightY + PADDLE_HEIGHT < canvas.height) {
      rightY += paddleSpeed;
    }

    ballX += ballVX;
    ballY += ballVY;

    if (ballY < BALL_SIZE / 2 || ballY > canvas.height - BALL_SIZE / 2) {
      ballVY *= -1;
    }

    if (
      ballX < PADDLE_WIDTH &&
      ballY > leftY &&
      ballY < leftY + PADDLE_HEIGHT
    ) {
      let hitPos = (ballY - (leftY + PADDLE_HEIGHT / 2)) / (PADDLE_HEIGHT / 2);
      ballVX = Math.abs(ballVX);
      ballVY = hitPos * 5;
      ballSpeed *= 1.05;
      ballVX = ballSpeed;
    }

    if (
      ballX > canvas.width - PADDLE_WIDTH &&
      ballY > rightY &&
      ballY < rightY + PADDLE_HEIGHT
    ) {
      let hitPos = (ballY - (rightY + PADDLE_HEIGHT / 2)) / (PADDLE_HEIGHT / 2);
      ballVX = -Math.abs(ballVX);
      ballVY = hitPos * 5;
      ballSpeed *= 1.05;
      ballVX = -ballSpeed;
    }

    if (ballX < 0 || ballX > canvas.width) {
      resetBall();
    }

    draw();
    requestAnimationFrame(update);
  }

  function draw() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    ctx.fillRect(0, leftY, PADDLE_WIDTH, PADDLE_HEIGHT);
    ctx.fillRect(
      canvas.width - PADDLE_WIDTH,
      rightY,
      PADDLE_WIDTH,
      PADDLE_HEIGHT
    );

    ctx.fillRect(
      ballX - BALL_SIZE / 2,
      ballY - BALL_SIZE / 2,
      BALL_SIZE,
      BALL_SIZE
    );
  }

  resetBall();
  update();
}
