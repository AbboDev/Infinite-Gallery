<?php

/**
 *
 * @author Thomas Abbondi
 */

header('Content-Type: application/json');

$path_to_images = realpath(__DIR__ . "/../images");

$images = array();
$filetypes = array(".", "..", ".gitignore");
define('LIMIT_TO_RETURN', 9);
define('OFFSET_TO_RETURN', (isset($_GET['offset']) && is_numeric($_GET['offset'])) ? (int) $_GET['offset'] : 0);

if (file_exists($path_to_images)) {
  $iterator = new IteratorIterator(
    new DirectoryIterator($path_to_images)
  );

  foreach ($iterator as $path) {
    $match = str_replace($path_to_images, "", $path->__toString());
    if (!$path->isDir() && preg_match('/^([^.])/', $match)) {
      $filetype = pathinfo($match, PATHINFO_EXTENSION);
      if (!in_array(strtolower($filetype), $filetypes)) {
        $images[] = $match;
      }
    }
  }
}

echo json_encode(array_splice($images, OFFSET_TO_RETURN, LIMIT_TO_RETURN));
