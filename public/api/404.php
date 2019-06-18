<?php

/**
 *
 */

header("HTTP/1.0 404 Not Found");
echo "<h1>Not Found</h1><p>The requested URL {$_SERVER['REQUEST_URI']} was not found on this server.</p>";
exit();
