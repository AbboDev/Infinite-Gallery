<?php

/**
 * Force download of image file specified in URL query string and which
 * is in the same directory as the download.php script.
 *
 * @author Thomas Abbondi
 */

if (!isset($_GET['img']) || empty($_GET['img'])) {
  require_once('404.php');
}

/******************************************************************************/

$basename = basename($_GET['img']);
$path = __DIR__ . "/images/";
$filename = $path . $basename;
$optimized = $path . "optimized/optimized-{$basename}";

if (file_exists($optimized)) {
  $mime = ($mime = getimagesize($optimized)) ? $mime['mime'] : $mime;
  $size = filesize($optimized);
  $fp = fopen($optimized, "rb");

  if (!($mime && $size && $fp)) {
      exit();
  }

  header("Content-type: {$mime}");
  header("Content-Length: {$size}");
  // NOTE: Possible header injection via $basename
  header("Content-Disposition: attachment; filename={$basename}");
  header("Content-Transfer-Encoding: binary");
  header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
  fpassthru($fp);
} else {
  require_once("resize.php");
}
