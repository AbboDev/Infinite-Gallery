<?php

/**
 * Force download of image file specified in URL query string and which
 * is in the same directory as the download.php script.
 *
 * @author Thomas Abbondi
 */

if (!isset($_POST['imgs']) || empty($_POST['imgs'])) {
  require_once('404.php');
}

/******************************************************************************/

$images = explode(',', $_POST['imgs']);
$dir = __DIR__ . "/images/optimized/";
$path_to_json = __DIR__ . "/json";

if (!file_exists($path_to_json)) {
  mkdir($path_to_json, 0777, true);
}

$jsonfile = date("HisdmY", time()) . ".json";
$fp = fopen($path_to_json . "/{$jsonfile}", 'w');
fwrite($fp, json_encode($images));
fclose($fp);

echo $jsonfile;
