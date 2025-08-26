import { Engine, Scene, Vector3, HemisphericLight, MeshBuilder, StandardMaterial, Color3, FreeCamera } from "@babylonjs/core";

export function initPongPage() {
  const canvas = document.getElementById("pong-canvas") as HTMLCanvasElement;
  if (!canvas) return;

  const engine = new Engine(canvas, true);
  const scene = new Scene(engine);

  const camera = new FreeCamera("camera", new Vector3(0, 0, -1000), scene);
  camera.mode = 1;
  camera.setTarget(Vector3.Zero());

  const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);

  const GAME_WIDTH = 800;
  const GAME_HEIGHT = 400;
  const PADDLE_WIDTH = 10;
  const PADDLE_HEIGHT = 80;
  const BALL_SIZE = 10;

  const paddleMat = new StandardMaterial("paddleMat", scene);
  paddleMat.diffuseColor = Color3.White();
  const ballMat = new StandardMaterial("ballMat", scene);
  ballMat.diffuseColor = Color3.White();

  const leftPaddle = MeshBuilder.CreateBox("leftPaddle", { width: PADDLE_WIDTH, height: PADDLE_HEIGHT, depth: 1 }, scene);
  leftPaddle.material = paddleMat;
  leftPaddle.position.x = -GAME_WIDTH / 2 + PADDLE_WIDTH;

  const rightPaddle = MeshBuilder.CreateBox("rightPaddle", { width: PADDLE_WIDTH, height: PADDLE_HEIGHT, depth: 1 }, scene);
  rightPaddle.material = paddleMat;
  rightPaddle.position.x = GAME_WIDTH / 2 - PADDLE_WIDTH;

  const ball = MeshBuilder.CreateSphere("ball", { diameter: BALL_SIZE }, scene);
  ball.material = ballMat;

  let leftY = 0;
  let rightY = 0;
  let ballPos = new Vector3(0, 0, 0);
  let ballVX = 4 * (Math.random() > 0.5 ? 1 : -1);
  let ballVY = 2 * (Math.random() > 0.5 ? 1 : -1);
  let ballSpeed = 5;

  const keysPressed: Record<string, boolean> = {};

  document.addEventListener("keydown", (e) => {
    if (["w", "s", "ArrowUp", "ArrowDown"].includes(e.key)) {
      e.preventDefault();
      keysPressed[e.key] = true;
    }
  });

  document.addEventListener("keyup", (e) => {
    if (["w", "s", "ArrowUp", "ArrowDown"].includes(e.key)) {
      e.preventDefault();
      keysPressed[e.key] = false;
    }
  });

  function resetBall() {
    ballPos = new Vector3(0, 0, 0);
    ballSpeed = 5;
    ballVX = ballSpeed * (Math.random() > 0.5 ? 1 : -1);
    ballVY = (Math.random() - 0.5) * 4;
  }

  function update() {
    const paddleSpeed = 6;

    if (keysPressed["w"] && leftY + PADDLE_HEIGHT/2 < GAME_HEIGHT/2) leftY += paddleSpeed;
    if (keysPressed["s"] && leftY - PADDLE_HEIGHT/2 > -GAME_HEIGHT/2) leftY -= paddleSpeed;
    if (keysPressed["ArrowUp"] && rightY + PADDLE_HEIGHT/2 < GAME_HEIGHT/2) rightY += paddleSpeed;
    if (keysPressed["ArrowDown"] && rightY - PADDLE_HEIGHT/2 > -GAME_HEIGHT/2) rightY -= paddleSpeed;

    leftPaddle.position.y = leftY;
    rightPaddle.position.y = rightY;

    ballPos.x += ballVX;
    ballPos.y += ballVY;
    ball.position = ballPos;

    if (ballPos.y > GAME_HEIGHT/2 - BALL_SIZE/2 || ballPos.y < -GAME_HEIGHT/2 + BALL_SIZE/2) {
      ballVY *= -1;
    }

    if (
      ballPos.x < leftPaddle.position.x + PADDLE_WIDTH/2 &&
      ballPos.x > leftPaddle.position.x - PADDLE_WIDTH/2 &&
      ballPos.y < leftY + PADDLE_HEIGHT/2 &&
      ballPos.y > leftY - PADDLE_HEIGHT/2
    ) {
      ballVX = Math.abs(ballVX);
      ballSpeed *= 1.05;
      ballVX = ballSpeed;
      let hitPos = (ballPos.y - leftY) / (PADDLE_HEIGHT/2);
      ballVY = hitPos * 5;
    }

    if (
      ballPos.x > rightPaddle.position.x - PADDLE_WIDTH/2 &&
      ballPos.x < rightPaddle.position.x + PADDLE_WIDTH/2 &&
      ballPos.y < rightY + PADDLE_HEIGHT/2 &&
      ballPos.y > rightY - PADDLE_HEIGHT/2
    ) {
      ballVX = -Math.abs(ballVX);
      ballSpeed *= 1.05;
      ballVX = -ballSpeed;
      let hitPos = (ballPos.y - rightY) / (PADDLE_HEIGHT/2);
      ballVY = hitPos * 5;
    }

    if (ballPos.x < -GAME_WIDTH/2 || ballPos.x > GAME_WIDTH/2) {
      resetBall();
    }

    scene.render();
    requestAnimationFrame(update);
  }

  resetBall();
  update();
}
