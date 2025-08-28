import {
	Engine,
	Scene,
	Vector3,
	HemisphericLight,
	MeshBuilder,
	StandardMaterial,
	Color3,
	Color4,
	FreeCamera,
	UniversalCamera,
	DynamicTexture,
} from "@babylonjs/core";

export function initPongPage() {
	const canvas = getCanvas("pong-canvas");
	if (!canvas) return;

	const engine = createEngine(canvas);
	const scene = createScene(engine);

	const { leftPaddle, rightPaddle, ball } = createGameObjects(scene);
	const { mainCam, leftCam, rightCam } = createCameras(scene, leftPaddle, rightPaddle, canvas);
	const keysPressed: Record<string, boolean> = {};
	setupControls(keysPressed, scene, canvas, leftCam, rightCam, mainCam);

	const state = initGameState();

	gameLoop(scene, leftPaddle, rightPaddle, ball, keysPressed, state);
}

function getCanvas(id: string): HTMLCanvasElement | null {
	return document.getElementById(id) as HTMLCanvasElement;
}

function createEngine(canvas: HTMLCanvasElement): Engine {
	return new Engine(canvas, true);
}

function createScene(engine: Engine): Scene {
	const scene = new Scene(engine);
	scene.clearColor = new Color4(0, 0, 0, 1);
	new HemisphericLight("light", new Vector3(0, 1, 0), scene);
	return scene;
}

function createMiddleLine(scene: Scene, gameHeight: number, segmentHeight = 10, gap = 10) {
	const lineMaterial = new StandardMaterial("lineMat", scene);
	lineMaterial.diffuseColor = Color3.White();

	const segments = Math.floor(gameHeight / (segmentHeight + gap));

	for (let i = 0; i < segments; i++) {
		const segment = MeshBuilder.CreateBox(`lineSeg${i}`, {
			width: 2,
			height: segmentHeight,
			depth: 1,
		}, scene);

		segment.material = lineMaterial;
		segment.position.x = 0;
		segment.position.y = gameHeight / 2 - (i + 0.5) * (segmentHeight + gap);
		segment.position.z = 0;
	}
}

function createGameObjects(scene: Scene) {
	const GAME_WIDTH = 800;
	const GAME_HEIGHT = 400;
	const PADDLE_LENGTH = 80;
	const PADDLE_HEIGHT = 10;
	const BALL_SIZE = 10;

	const paddleMat = new StandardMaterial("paddleMat", scene);
	paddleMat.diffuseColor = Color3.White();
	const ballMat = new StandardMaterial("ballMat", scene);
	ballMat.diffuseColor = Color3.White();

	const leftPaddle = MeshBuilder.CreateBox(
		"leftPaddle",
		{ width: PADDLE_LENGTH, height: PADDLE_HEIGHT, depth: 1 },
		scene
	);
	leftPaddle.material = paddleMat;
	leftPaddle.position.x = -GAME_WIDTH / 2 + PADDLE_HEIGHT;
	leftPaddle.rotation.z = Math.PI / 2;

	const rightPaddle = MeshBuilder.CreateBox(
		"rightPaddle",
		{ width: PADDLE_LENGTH, height: PADDLE_HEIGHT, depth: 1 },
		scene
	);
	rightPaddle.material = paddleMat;
	rightPaddle.position.x = GAME_WIDTH / 2 - PADDLE_HEIGHT;
	rightPaddle.rotation.z = Math.PI / 2;

	const ball = MeshBuilder.CreateSphere("ball", { diameter: BALL_SIZE }, scene);
	ball.material = ballMat;

	createMiddleLine(scene, GAME_HEIGHT);


	return { leftPaddle, rightPaddle, ball };
}

function createCameras(scene: Scene, leftPaddle: any, rightPaddle: any, canvas: HTMLCanvasElement) {
	const mainCam = new FreeCamera("mainCam", new Vector3(0, 0, -1000), scene);
	mainCam.mode = 1;
	mainCam.setTarget(Vector3.Zero());
	scene.activeCamera = mainCam;
	mainCam.attachControl(canvas, true);

	const leftCam = new UniversalCamera("leftCam", new Vector3(), scene);
	const rightCam = new UniversalCamera("rightCam", new Vector3(), scene);

	scene.onBeforeRenderObservable.add(() => {
		updateCamera(leftCam, leftPaddle, new Vector3(leftPaddle.position.x + 400, leftPaddle.position.y, 0));
		updateCamera(rightCam, rightPaddle, new Vector3(rightPaddle.position.x - 400, rightPaddle.position.y, 0));
	});

	return { mainCam, leftCam, rightCam };
}

function updateCamera(cam: UniversalCamera, paddle: any, target: Vector3) {
	cam.position.x = paddle.position.x - 30;
	cam.position.y = paddle.position.y;
	cam.position.z = -20;
	cam.fov = 0.4;
	paddle.position.z = 0;
	cam.setTarget(target);
}

function setupControls(keysPressed: Record<string, boolean>, scene: Scene, canvas: HTMLCanvasElement, leftCam: UniversalCamera, rightCam: UniversalCamera, mainCam: FreeCamera) {
	document.addEventListener("keydown", (e) => {
		if (["w", "s", "ArrowUp", "ArrowDown"].includes(e.key)) {
			e.preventDefault();
			keysPressed[e.key] = true;
		}
		if (e.key === "1") switchCamera(scene, canvas, leftCam);
		if (e.key === "2") switchCamera(scene, canvas, rightCam);
		if (e.key === "3") switchCamera(scene, canvas, mainCam);
	});

	document.addEventListener("keyup", (e) => {
		if (["w", "s", "ArrowUp", "ArrowDown"].includes(e.key)) {
			e.preventDefault();
			keysPressed[e.key] = false;
		}
	});
}

function switchCamera(scene: Scene, canvas: HTMLCanvasElement, cam: any) {
	scene.activeCamera = cam;
	cam.attachControl(canvas, true);
}

function initGameState() {
	return {
		leftY: 0,
		rightY: 0,
		ballPos: new Vector3(0, 0, 0),
		ballVX: 4 * (Math.random() > 0.5 ? 1 : -1),
		ballVY: 2 * (Math.random() > 0.5 ? 1 : -1),
		ballSpeed: 5,
	};
}

function gameLoop(scene: Scene, leftPaddle: any, rightPaddle: any, ball: any, keysPressed: Record<string, boolean>, state: any) {
	const GAME_WIDTH = 800;
	const GAME_HEIGHT = 400;
	const PADDLE_LENGTH = 80;
	const PADDLE_HEIGHT = 10;
	const BALL_SIZE = 10;
	const paddleSpeed = 6;
	const MAX_POINTS = 10;

	const { plane: scorePlane, dt: scoreTexture } = createScorePlane(scene);
	let leftPoints = 0;
	let rightPoints = 0;

	function resetBall() {
		state.ballPos = new Vector3(0, 0, 0);
		state.ballSpeed = 5;
		state.ballVX = state.ballSpeed * (Math.random() > 0.5 ? 1 : -1);
		state.ballVY = (Math.random() - 0.5) * 4;
	}

	resetBall();

	function update() {
		if (keysPressed["w"] && state.leftY + PADDLE_LENGTH / 2 < GAME_HEIGHT / 2) state.leftY += paddleSpeed;
		if (keysPressed["s"] && state.leftY - PADDLE_LENGTH / 2 > -GAME_HEIGHT / 2) state.leftY -= paddleSpeed;
		if (keysPressed["ArrowUp"] && state.rightY + PADDLE_LENGTH / 2 < GAME_HEIGHT / 2) state.rightY += paddleSpeed;
		if (keysPressed["ArrowDown"] && state.rightY - PADDLE_LENGTH / 2 > -GAME_HEIGHT / 2) state.rightY -= paddleSpeed;

		leftPaddle.position.y = state.leftY;
		rightPaddle.position.y = state.rightY;

		state.ballPos.x += state.ballVX;
		state.ballPos.y += state.ballVY;
		ball.position = state.ballPos;

		if (state.ballPos.y > GAME_HEIGHT / 2 - BALL_SIZE / 2 || state.ballPos.y < -GAME_HEIGHT / 2 + BALL_SIZE / 2) {
			state.ballVY *= -1;
		}

		handlePaddleCollision(state, leftPaddle, rightPaddle, PADDLE_LENGTH, PADDLE_HEIGHT);

if (state.ballPos.x < -GAME_WIDTH/2) {
	rightPoints++;
	updateScoreDynamicTexture(scoreTexture, leftPoints, rightPoints);
	resetBall();
}

if (state.ballPos.x > GAME_WIDTH/2) {
	leftPoints++;
	updateScoreDynamicTexture(scoreTexture, leftPoints, rightPoints);
	resetBall();
}

		scene.render();
		requestAnimationFrame(update);
	}

	update();
}

function handlePaddleCollision(state: any, leftPaddle: any, rightPaddle: any, PADDLE_LENGTH: number, PADDLE_HEIGHT: number) {
	if (
		state.ballPos.x < leftPaddle.position.x + PADDLE_HEIGHT &&
		state.ballPos.x > leftPaddle.position.x - PADDLE_HEIGHT &&
		state.ballPos.y < state.leftY + PADDLE_LENGTH / 2 &&
		state.ballPos.y > state.leftY - PADDLE_LENGTH / 2
	) {
		state.ballVX = Math.abs(state.ballVX);
		state.ballSpeed *= 1.05;
		state.ballVX = state.ballSpeed;
		const hitPos = (state.ballPos.y - state.leftY) / (PADDLE_LENGTH / 2);
		state.ballVY = hitPos * 5;
	}

	if (
		state.ballPos.x > rightPaddle.position.x - PADDLE_HEIGHT &&
		state.ballPos.x < rightPaddle.position.x + PADDLE_HEIGHT &&
		state.ballPos.y < state.rightY + PADDLE_LENGTH / 2 &&
		state.ballPos.y > state.rightY - PADDLE_LENGTH / 2
	) {
		state.ballVX = -Math.abs(state.ballVX);
		state.ballSpeed *= 1.05;
		state.ballVX = -state.ballSpeed;
		const hitPos = (state.ballPos.y - state.rightY) / (PADDLE_LENGTH / 2);
		state.ballVY = hitPos * 5;
	}
}

function createScorePlane(scene: Scene) {
	const plane = MeshBuilder.CreatePlane("scorePlane", { width: 100, height: 40 }, scene);

	const dt = new DynamicTexture("scoreDT", { width: 256, height: 128 }, scene);
	const mat = new StandardMaterial("scoreMat", scene);
	mat.diffuseTexture = dt;
	mat.emissiveColor = Color3.White();
	plane.material = mat;

	plane.position.y = 175;
	plane.position.z = 0;

	return { plane, dt };
}

function updateScoreDynamicTexture(dt: DynamicTexture, leftPoints: number, rightPoints: number) {
	dt.getContext().clearRect(0, 0, dt.getSize().width, dt.getSize().height);

	dt.drawText(
		`${leftPoints} - ${rightPoints}`,
		null,
		64,
		"bold 64px Arial",
		"white",
		"transparent",
		true
	);
}
