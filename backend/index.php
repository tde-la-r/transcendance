<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: http://0.0.0.0:8080");
header("Access-Control-Allow-Methods: POST, PUT, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', '/tmp/php-error.log'); // chemin vers fichier log
error_reporting(E_ALL);

try {
    $pdo = new PDO("pgsql:host=db;dbname=app", "app", "app");
} catch (PDOException $e) {
    echo json_encode(['status' => 'Refuser', 'error' => 'Erreur connexion DB']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$pdo = new PDO("pgsql:host=db;dbname=app", "app", "app");

$method = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents("php://input"), true);

if ($method === 'POST') {
    if (!isset($data['action'])) {
        echo json_encode(['status' => 'Refuser', 'error' => 'Action manquante']);
        exit;
    }

    if ($data['action'] === 'register') {
        // Inscription
        if (!isset($data['username']) || !isset($data['password'])) {
            echo json_encode(['status' => 'Refuser', 'error' => 'Données manquantes']);
            exit;
        }

        $stmt = $pdo->prepare("SELECT id FROM users WHERE username = :username");
        $stmt->execute(['username' => $data['username']]);
        if ($stmt->fetch()) {
            echo json_encode(['status' => 'Refuser', 'error' => 'Utilisateur déjà existant']);
            exit;
        }

        $stmt = $pdo->prepare("INSERT INTO users (username, password) VALUES (:username, :password)");
        $stmt->execute([
            'username' => $data['username'],
            'password' => password_hash($data['password'], PASSWORD_DEFAULT)
        ]);

        echo json_encode(['status' => 'Accepte']);
        exit;

    } elseif ($data['action'] === 'login') {
        // Connexion
        if (!isset($data['username']) || !isset($data['password'])) {
            echo json_encode(['status' => 'Refuser', 'error' => 'Données manquantes']);
            exit;
        }

        $stmt = $pdo->prepare("SELECT password FROM users WHERE username = :username");
        $stmt->execute(['username' => $data['username']]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user && password_verify($data['password'], $user['password'])) {
            echo json_encode(['status' => 'Accepte']);
        } else {
            echo json_encode(['status' => 'Refuser', 'error' => 'Identifiants invalides']);
        }
        exit;

    } else {
        echo json_encode(['status' => 'Refuser', 'error' => 'Action inconnue']);
        exit;
    }
} else {
    echo json_encode(['status' => 'Refuser', 'error' => 'Méthode non autorisée']);
    exit;
}
