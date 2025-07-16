<?php
$dia = date('d/m/Y');
$hora = date('H:i:s');
$ip_acesso = $_SERVER['REMOTE_ADDR'];
$file = fopen("host/visitas".".txt","a");
fwrite($file,"#$ip_acesso\n$dia\n$hora\n");		
fclose($file);
$raiz = "SONGS/";
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

/*foreach (scan($raiz) as $key => $value) {
    //echo count($value).":"."</br>";
    echo $key . ":</br>";
    foreach ($value as $k => $v) {
        echo $v . "</br>";
        # code...
    }
    # code...
}*/
/*
$musicas = array();

exec("ls utra", $musicas, $status);
$songs[2]["utra"] = $musicas;
*/

$api = json_encode(scan($raiz));

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

//echo $api;


$file = fopen("xapi".".json","w");
fwrite($file,$api);		
fclose($file);


$ftp_server = "ftpupload.net";
$ftp_usuario = "if0_35471553";
$ftp_senha = "ftppw241";
$ftp_local_file = "xapi.json";
$ftp_remoto_file = "apiapp.kesug.com/htdocs/api.json";


/*
$ftp_server = "192.168.3.110";
$ftp_usuario = "vando";
$ftp_senha = "lnxvan25";
$ftp_local_file = "api.json";
$ftp_remoto_file = "/home/vando/projects/nostaplay/api/xapix.json";*/
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
