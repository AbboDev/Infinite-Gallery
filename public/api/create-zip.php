<?php

/**
 *
 */

if (!isset($_GET['data']) || empty($_GET['data'])) {
  require_once('404.php');
}

/******************************************************************************/

$file = tempnam("tmp", "zip");
$zip = new ZipArchive();
$zip->open($file, ZipArchive::OVERWRITE);

$path_to_json = realpath(__DIR__ . "/../json/{$_GET['data']}");

$string = file_get_contents($path_to_json);
$json_a = json_decode($string, true);

foreach ($json_a as $index => $image) {
	if (file_exists(realpath(__DIR__ . "/../images/optimized/optimized-{$image}")) ){
		$zip->addFile(realpath(__DIR__ . "/../images/optimized/optimized-{$image}", $image));
	} else if (file_exists(realpath(__DIR__ . "/../images/{$image}"))) {
		$zip->addFile(realpath(__DIR__ . "/../images/{$image}", $image));
	}
}

$zip->close();

header('Content-Type: application/zip');
header('Content-Length: ' . filesize($file));
header('Content-Disposition: attachment; filename="download.zip"');

readfile($file);
unlink($file);
unlink($path_to_json);
