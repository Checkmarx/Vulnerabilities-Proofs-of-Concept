<?php

ini_set('display_errors', 1);
error_reporting(E_ALL);


register_shutdown_function(function () {
    $error = error_get_last();
    if ($error !== null && $error['type'] === E_ERROR) {

        header('Content-Type: application/json');
        http_response_code(503);
        echo json_encode([
            'error' => true,
            'error_type' => 'Fatal Error',
            'error_message' => $error['message'],
        ]);
        exit;
    }
});

require '../vendor/autoload.php';


Flight::route('PUT /vulnerable', function () {

    $execution_time = microtime(true) - $_SERVER["REQUEST_TIME_FLOAT"];

    header('Content-Type: application/json');
    echo json_encode([
        'execution_time_sec' => round($execution_time, 4),
        'content_length' => isset($_SERVER['CONTENT_LENGTH']) ? $_SERVER['CONTENT_LENGTH'] : 0,
    ]);
});

Flight::start();
