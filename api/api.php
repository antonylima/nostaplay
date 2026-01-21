<?php
//$raiz = "../music/";
$raiz = "/mnt/storage/songs/";
function period($v)
{
    if ($v !== "." && $v !== "..") {
        return true;
    } else
        return false;
}
function scan($folder)
{
    $path = dir($folder);
    while ($i = $path->read()) {
        if (period($i)) {
            if (is_dir($folder . $i)) {
                if (period($folder . $i)) {
                    if (substr(scandir($folder . $i)[2], -3) === "mp3") {
                        //echo $folder . $i . "</br>---------";
                        $songs = scandir($folder . $i);
                        unset($songs[0]);
                        unset($songs[1]);
			foreach($songs as $k => $v){
                            if(substr($songs[$k],-3) !== "mp3"){
                                unset($songs[$k]);
                            }
                        }
                        $songs = array_values($songs);
                        $GLOBALS["db"][$folder . $i . "/"] = $songs;
                        $GLOBALS["db"][$folder . $i . "/"] = $songs;
                    }

                    $folders[] = $folder . $i . "/";
                    scan(end($folders));
                }
            }
        }
    }

    return $GLOBALS["db"];

}

$api = json_encode(scan($raiz));

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');


$file = fopen("api".".json","w");
fwrite($file,$api);		
fclose($file);

echo $api;

?>
