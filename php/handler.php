<?php

declare(strict_types=1);

require __DIR__ . '/webhook.php';

$rawBody = file_get_contents('php://input') ?: '';
$signature = $_SERVER['HTTP_X_XPAYR_SIGNATURE'] ?? '';
$secret = getenv('XPAYR_WEBHOOK_SECRET') ?: '';

if (!verify_xpayr_signature($rawBody, $signature, $secret)) {
    http_response_code(400);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Invalid signature']);
    exit;
}

$event = json_decode($rawBody, true, flags: JSON_THROW_ON_ERROR);
if (!is_array($event) || !is_string($event['id'] ?? null)) {
    http_response_code(400);
    echo json_encode(['error' => 'Event ID is required']);
    exit;
}

// Insert event.id into a UNIQUE database column and update payment state in the same transaction.
http_response_code(200);
header('Content-Type: application/json');
echo json_encode(['received' => true]);
