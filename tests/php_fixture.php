<?php

declare(strict_types=1);

require dirname(__DIR__) . '/php/webhook.php';
$fixture = json_decode(file_get_contents(dirname(__DIR__) . '/fixtures/webhook.json'), true, flags: JSON_THROW_ON_ERROR);
assert(verify_xpayr_signature($fixture['raw_body'], $fixture['signature'], $fixture['secret']));
assert(!verify_xpayr_signature($fixture['raw_body'] . ' ', $fixture['signature'], $fixture['secret']));
echo "PHP fixture OK\n";
