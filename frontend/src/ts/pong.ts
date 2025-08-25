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
  let ballVX = 4;
  let ballVY = 2;

  document.addEventListener("keydown", (e) => {
    if (e.key === "z") leftY -= 20;
    if (e.key === "s") leftY += 20;
    if (e.key === "ArrowUp") rightY -= 20;
    if (e.key === "ArrowDown") rightY += 20;
  });

  function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballVX = 4 * (Math.random() > 0.5 ? 1 : -1);
    ballVY = 2 * (Math.random() > 0.5 ? 1 : -1);
  }

  function draw() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    ctx.fillRect(0, leftY, PADDLE_WIDTH, PADDLE_HEIGHT);
    ctx.fillRect(canvas.width - PADDLE_WIDTH, rightY, PADDLE_WIDTH, PADDLE_HEIGHT);
    ctx.fillRect(ballX - BALL_SIZE / 2, ballY - BALL_SIZE / 2, BALL_SIZE, BALL_SIZE);

    ballX += ballVX;
    ballY += ballVY;

    if (ballY < BALL_SIZE / 2 || ballY > canvas.height - BALL_SIZE / 2) ballVY *= -1;
    if (ballX < PADDLE_WIDTH && ballY > leftY && ballY < leftY + PADDLE_HEIGHT) ballVX *= -1;
    if (ballX > canvas.width - PADDLE_WIDTH && ballY > rightY && ballY < rightY + PADDLE_HEIGHT) ballVX *= -1;

    if (ballX < 0 || ballX > canvas.width) resetBall();

    requestAnimationFrame(draw);
  }

  draw();
}
