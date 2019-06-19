<?php

/**
 *
 * @author Thomas Abbondi
 */

if (!isset($_GET['img']) || empty($_GET['img'])) {
  require_once('404.php');
}

require_once("./constants.php");

/******************************************************************************/

require_once("./lib/Tinify/Exception.php");
require_once("./lib/Tinify/ResultMeta.php");
require_once("./lib/Tinify/Result.php");
require_once("./lib/Tinify/Source.php");
require_once("./lib/Tinify/Client.php");
require_once("./lib/Tinify.php");

try {
  \Tinify\setKey("Nh0rAnKCijS93VHZPjxGgibQaWrTdmZ3");
  \Tinify\validate();

  if (isset($_GET['action']) && !empty($_GET['img'])) {
    switch ($_GET['action']) {
      case 'thumb':
        $option = 'thumb';
        break;
      case 'large':
        $option = 'large';
        break;
      case 'optimize':
      case 'optimized':
      default:
        $option = 'optimized';
        break;
    }
  } else {
    $option = 'optimized';
  }

  $path = realpath(str_replace('\\', '/', __DIR__) . "/../images");

  $prefix = "{$option}-";

  $original = $path . "/" . $_GET['img'];
  $compress = $path . "/" . $option . "/" . $prefix . $_GET['img'];

  if (file_exists($original)) {
    if (!file_exists($compress) && \Tinify\compressionCount() >= 500) {
      $compress = $original;
    } else if (!file_exists($compress)) {
      try {
        $source = \Tinify\fromFile($original);

        switch ($option) {
          case 'thumb':
            $resized = $source->resize(array(
                "method" => "cover",
                "width" => 600,
                "height" => 337
            ));
            $bool = $resized->toFile($compress);
            break;
          case 'large':
            $resized = $source->resize(array(
                "method" => "fit",
                "width" => 1440/*1280*/,
                "height" => 810/*720*/
            ));
            $bool = $resized->toFile($compress);
            break;
          default:
          case 'large':
            $bool = $source->toFile($compress);
            break;
        }
      } catch(\Tinify\AccountException $e) {
        print("The error message is: " . $e->getMessage());
        // Verify your API key and account limit.
      } catch(\Tinify\ClientException $e) {
        // Check your source image and request options.
      } catch(\Tinify\ServerException $e) {
        // Temporary issue with the Tinify API.
      } catch(\Tinify\ConnectionException $e) {
        // A network connection error occurred.
      } catch(Exception $e) {
        // Something else went wrong, unrelated to the Tinify API.
      }
    }
  }
} catch(\Tinify\Exception $e) {
}

$mime = ($mime = getimagesize($compress)) ? $mime['mime'] : $mime;
$size = filesize($compress);

header("Content-type: {$mime}");
header("Content-Length: {$size}");
// NOTE: Possible header injection via $basename
header("Content-Disposition: attachment; filename={$_GET['img']}");
header("Content-Transfer-Encoding: binary");
header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
echo file_get_contents($compress);
