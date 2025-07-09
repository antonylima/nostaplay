<?php

$dia = date('d/m/Y');
$hora = date('H:i:s');
$ip_acesso = $_SERVER['REMOTE_ADDR'];
$file = fopen("host/visitas".".txt","a");
fwrite($file,"#$ip_acesso\n$dia\n$hora\n");		
fclose($file);

$srcs = array("SONGS/","SERTANEJO/");
foreach( $srcs as $src) {
    if (dir($src)) {
        scanner($src);
    }
}
function scanner($folder)
{
    $path = dir($folder);
    while ($arq = $path->read()) {
        if ($arq != '.' && $arq != '..') {
            $temp = $folder . $arq . "/";
            $GLOBALS['temp'] = $temp;
            if (is_dir($GLOBALS['temp'])) {
                if ($GLOBALS['temp'] != $folder . '.debris/') {
                    $GLOBALS['dirtemp'] = $GLOBALS['temp'];
                    scanner($GLOBALS['temp']);
                }
            } else {
                $GLOBALS['temp'] = substr(
                    $GLOBALS['temp'],
                    strlen($GLOBALS['temp']) - strlen($arq) - 1,
                    -1
                );
                if (
                    substr($GLOBALS['temp'], -3) == 'wma' ||
                    substr($GLOBALS['temp'], -3) == 'wma'
                ) {
                    unset($GLOBALS['dirtemp']);
                } else {
                    if (
                        (substr($GLOBALS['temp'], -3) == 'mp3') ||
                        (substr($GLOBALS['temp'], -3) == 'wav') ||
                        (substr($GLOBALS['temp'], -3) == 'm4a') ||
                        (substr($GLOBALS['temp'], -3) == 'ogg') ||
                            //(substr($GLOBALS['temp'], -3) == 'lac') ||
                            //(substr($GLOBALS['temp'], -3) == 'mid') ||
                            //(substr($GLOBALS['temp'], -3) == 'lac') ||
                            //(substr($GLOBALS['temp'], -3) == 'mid') ||
                        (substr($GLOBALS['temp'], -3) == 'aac') ||
                        (substr($GLOBALS['temp'], -3) == 'MP3') ||
                        (substr($GLOBALS['temp'], -3) == 'WAV') ||
                        (substr($GLOBALS['temp'], -3) == 'M4A') ||
                        (substr($GLOBALS['temp'], -3) == 'OGG') ||
                        (substr($GLOBALS['temp'], -3) == 'AAC')

                    ) {
                        //$GLOBALS['song'] = $GLOBALS['temp'];
                        $song = $GLOBALS['temp'];
                    } else {

                        //unset($GLOBALS['dirtemp']);
                    }

                }

                $tmp[] = $song;
            }
        }
    }

    $GLOBALS['diretorio'][$GLOBALS['dirtemp']] = $tmp;
}
$json = json_encode($GLOBALS['diretorio']);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
echo $json;
?>

