<?php

require_once __DIR__ . '/vendor/autoload.php';

$url = urldecode($_REQUEST['url']);

$mpdf = new \Mpdf\Mpdf();
$mpdf->WriteHTML($url);
$mpdf->Output();

?>