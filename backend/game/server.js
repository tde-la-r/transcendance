const { WebSocketServer } = require("ws");

function startGameServer(server) {
	const wss = new WebSocketServer({ server, path: "/ws" });

	const GAME_WIDTH = 800;
	const GAME_HEIGHT = 400;
	const PADDLE_LENGTH = 80;
	const PADDLE_HEIGHT = 10;
	const PADDLE_SPEED = 6;
	const TICK_MS = 1000 / 60;
	const LEFT_PADDLE_X = -GAME_WIDTH / 2 + PADDLE_HEIGHT;
	const RIGHT_PADDLE_X = GAME_WIDTH / 2 - PADDLE_HEIGHT;
	const BALL_RADIUS = 10;

	// ---- Game State ----
	const state = createInitialState();

	// ---- Init ----
	resetBall(state);

	// ---- Init WebSocket ----
	setupWebSocket(wss, state);

	// ---- Ga;e loop ----
	setInterval(() => gameLoop(state, wss), TICK_MS);

	/* ========================== //
	//       Sous-fonctions	  	  //
	// ========================== */

	function createInitialState() {
		return {
			ball: { x: 0, y: 0, vx: 0, vy: 0, speed: 5 },
			left: { y: 0, up: false, down: false },
			right: { y: 0, up: false, down: false },
			score: { left: 0, right: 0 },
		};
	}

	function resetBall(state) {
		state.ball.x = 0;
		state.ball.y = 0;
		state.ball.vx = 0;
		state.ball.vy = 0;
		state.ball.speed = 0;

		setTimeout(() => {
			state.ball.speed = 5;
			state.ball.vx = state.ball.speed * (Math.random() > 0.5 ? 1 : -1);
			state.ball.vy = (Math.random() - 0.5) * 4;
		}, 1000);
	}

	function setupWebSocket(wss, state) {
		wss.on("connection", (ws) => {
			console.log("Client connecté Pong WS");
			ws.send(JSON.stringify({ type: "state", state }));

			ws.on("message", (msg) => handleClientMessage(state, msg));
			ws.on("close", () => console.log("Client déconnecté Pong WS"));
		});
	}

	function handleClientMessage(state, msg) {
		const data = JSON.parse(msg.toString());
		if (data.type === "move") {
			const player = data.side === "left" ? state.left : state.right;
			if (data.dir === "stop") {
				player.up = false;
				player.down = false;
			} else {
				player.up = data.dir === "up";
				player.down = data.dir === "down";
			}
		}
	}

	function updatePaddles(state) {
		[state.left, state.right].forEach((p) => {
			if (p.up && p.y + PADDLE_LENGTH / 2 < GAME_HEIGHT / 2) p.y += PADDLE_SPEED;
			if (p.down && p.y - PADDLE_LENGTH / 2 > -GAME_HEIGHT / 2) p.y -= PADDLE_SPEED;
		});
	}

	function updateBall(state) {
		const steps = Math.ceil(state.ball.speed / 5);
		for (let i = 0; i < steps; i++) {
			state.ball.x += state.ball.vx / steps;
			state.ball.y += state.ball.vy / steps;

			// Up/Down bounces
			if (
				state.ball.y > GAME_HEIGHT / 2 - PADDLE_HEIGHT ||
				state.ball.y < -GAME_HEIGHT / 2 + PADDLE_HEIGHT
			) {
				state.ball.vy *= -1;
			}

			handleCollisions(state);
		}
	}

	function handleCollisions(state) {
		// left paddle
		if (
			state.ball.x - BALL_RADIUS < LEFT_PADDLE_X &&
			state.ball.x + BALL_RADIUS > LEFT_PADDLE_X &&
			state.ball.y < state.left.y + PADDLE_LENGTH / 2 &&
			state.ball.y > state.left.y - PADDLE_LENGTH / 2
		) {
			state.ball.vx = Math.abs(state.ball.vx);
			state.ball.speed *= 1.05;
			state.ball.vx = state.ball.speed;
			const hitPos = (state.ball.y - state.left.y) / (PADDLE_LENGTH / 2);
			state.ball.vy = hitPos * 5;
		}

		// right paddle
		if (
			state.ball.x + BALL_RADIUS > RIGHT_PADDLE_X &&
			state.ball.x - BALL_RADIUS < RIGHT_PADDLE_X &&
			state.ball.y < state.right.y + PADDLE_LENGTH / 2 &&
			state.ball.y > state.right.y - PADDLE_LENGTH / 2
		) {
			state.ball.vx = -Math.abs(state.ball.vx);
			state.ball.speed *= 1.05;
			state.ball.vx = -state.ball.speed;
			const hitPos = (state.ball.y - state.right.y) / (PADDLE_LENGTH / 2);
			state.ball.vy = hitPos * 5;
		}
	}

	function handleScore(state) {
		if (state.ball.x < -GAME_WIDTH / 2) {
			state.score.right++;
			resetBall(state);
		}
		if (state.ball.x > GAME_WIDTH / 2) {
			state.score.left++;
			resetBall(state);
		}
	}

	function broadcastState(wss, state) {
		wss.clients.forEach((client) => {
			if (client.readyState === 1) {
				client.send(JSON.stringify({ type: "state", state }));
			}
		});
	}

	function gameLoop(state, wss) {
		updatePaddles(state);
		updateBall(state);
		//handleCollisions(state);
		handleScore(state);
		broadcastState(wss, state);
	}
}

module.exports = { startGameServer };
