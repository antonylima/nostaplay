<?php
$dia = date('d/m/Y');
$hora = date('H:i:s');
$ip_acesso = $_SERVER['REMOTE_ADDR'];
$file = fopen("host/visitas" . ".txt", "a");
fwrite($file, "#$ip_acesso\n$dia\n$hora\n");
fclose($file);

$srcs = array("SONGS/", "SERTANEJO/");
foreach ($srcs as $src) {
    if (dir($src)) {
        scanner($src);
    }
}
function scanner($folder)
{
    $path = dir($folder);
    while ($arq = $path->read()) {
        if ($arq != '.' && $arq != '..') {
            echo "<script>console.log('$arq')</script>";
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
//echo $json;

$file = fopen("api" . ".json", "w");
fwrite($file, $json);
fclose($file);

$ftp_server = "ftpupload.net";
$ftp_usuario = "if0_35471553";
$ftp_senha = "ftppw241";
$ftp_local_file = "api.json";
$ftp_remoto_file = "apiapp.kesug.com/htdocs/api.json";

/*
$ftp_server = "192.168.3.110";
$ftp_usuario = "vando";
$ftp_senha = "lnxvan25";
$ftp_local_file = "api.json";
$ftp_remoto_file = "/home/vando/projects/nostaplay/api/api.json";*/
// Conexão com o servidor FTP
$conn_id = ftp_connect($ftp_server);

// Login
$login_result = ftp_login($conn_id, $ftp_usuario, $ftp_senha);

// Verifica se a conexão e o login foram bem-sucedidos
if ((!$conn_id) || (!$login_result)) {
    echo "A conexão FTP falhou!";
    echo "Tentativa de conectar a: " . $ftp_server . ", usuário: " . $ftp_usuario . ", senha: " . $ftp_senha;
    exit;
} else {
    echo "Conectado com sucesso a " . $ftp_server . ", usuário: " . $ftp_usuario . "\n";
}

// Ativa o modo passivo (opcional, mas recomendado)
ftp_pasv($conn_id, true);

// Envia o arquivo
if (ftp_put($conn_id, $ftp_remoto_file, $ftp_local_file, FTP_BINARY)) {
    echo "Arquivo '" . $ftp_local_file . "' enviado para '" . $ftp_remoto_file . "' com sucesso\n";
} else {
    echo "Houve um problema no envio do arquivo\n";
}

// Fecha a conexão
ftp_close($conn_id);

?>