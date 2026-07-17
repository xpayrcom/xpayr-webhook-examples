<?php

declare(strict_types=1);

function verify_xpayr_signature(string $rawBody, string $signatureHeader, string $secret): bool
{
    if ($secret === '') {
        throw new InvalidArgumentException('Webhook secret is required.');
    }
    $signature = strtolower(trim($signatureHeader));
    if (str_starts_with($signature, 'sha256=')) {
        $signature = substr($signature, 7);
    }
    if (preg_match('/^[a-f0-9]{64}$/', $signature) !== 1) {
        return false;
    }
    return hash_equals(hash_hmac('sha256', $rawBody, $secret), $signature);
}
