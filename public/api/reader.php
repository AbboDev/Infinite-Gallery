<?php

/**
 *
 * @author Thomas Abbondi
 */

header('Content-Type: application/json');

$path_to_images = realpath(__DIR__ . "/../images");

$images = array();

if (file_exists($path_to_images)) {
  $images = array_filter(
    array_values(scandir($path_to_images)),
    function($v, $k) {
      return ($v !== "."
        && $v !== ".."
        && $v !== ".gitignore"
        && strpos($v, 'large-') === false
        && strpos($v, 'thumb-') === false
        && strpos($v, 'optimized-') === false
      );
    },
    ARRAY_FILTER_USE_BOTH
  );

  // $iterator = new RecursiveIteratorIterator(
  //   new RecursiveDirectoryIterator($path_to_images),
  //   RecursiveIteratorIterator::SELF_FIRST
  // );

  // foreach ($iterator as $path) {
  //   $match = str_replace($path_to_images, "", $path->__toString());
  //   if (!$path->isDir()) {
  //     if (!in_array($match, array(".", ".."))) {
  //       $images[] = $match;
  //     } else {
  //
  //     }
  //   }
  // }
}

echo json_encode(array_values($images));
