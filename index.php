<?php
$dia = date('d/m/Y');
$hora = date('H:i:s');
$ip_acesso = $_SERVER['REMOTE_ADDR'];
$file = fopen("host/visitas".".txt","a");
fwrite($file,"#$ip_acesso\n$dia\n$hora\n");		
fclose($file);
<!DOCTYPE html>
<html lang="pt-br">
?>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0 user-scalable=no">
    <title>Nostaplay</title>
    <link rel="icon" type="image/x-icon" href="assets/img/play.png">
    <link rel="stylesheet" href="assets/style/style.css" type="text/css">
    <link rel="stylesheet" href="assets/style/normalize.css" type="text/css">
    <link rel="shortcut icon" href="assets/img/favicon.ico" type="image/png">
</head>

<body>
    <dialog id="ch"></dialog>
    <div id="master">
        <div id="deepmain">
            <div id="header">
                <img class="imghd" id="img1" src="assets/img/vinilblack.png" alt="vinil">
                <img id="title" src="assets/img/title.png" alt="title">
                <img class="imghd" id="img2" src="assets/img/vinilblack.png" alt="vinil">
            </div>
            <div id="player">
                <audio controls src="" id="song"></audio>
            </div>
            <div id="info">
                <marquee id="mq" direction="left">
                    <div id="painel">Hello</div>
                </marquee>
            </div>
            <div id="cs">
                <div id="ctrl">
                    <div id="ctrl1" class="ctrl">
                        <img id="pp" onclick="startPause()" src="assets/img/pp.png" alt="pause">
                        <img onclick="stop()" src="assets/img/stop.png" alt="stop">
                    </div>
                    <div id="ctrl2" class="ctrl">
                        <img id="prev" src="assets/img/previous.png" alt="previous">
                        <img id="repeat" onclick="repeat()" src="assets/img/rptoff.png" alt="repeat">
                        <img id="next" src="assets/img/next.png" alt="next">
                    </div>
                </div>
            </div>
            <div id="pesq">
                <input id="termo" class="pesq" type="text" value="" placeholder="Gênero ou Artista">
                <button id="search" class="pesq" onclick="search()">OK</button>
            </div>

        </div>
        <div id="res">
        </div>
    </div>
    <div id="sleepop">
        <span>
            OFF
        </span>
    </div>
    <div id="footer">
        <img id="set" src="assets/img/setnbg.png" alt="">
        <ul id="opc">
            <li id="sleepmn">Sleep</li>
            <li>Source</li>
            <li>Sobre</li>
        </ul>
        <a id="author" href="https://sulivando.com.br" target="blank">Desenvolvedor</a>
    </div>


    <script src="assets/script/script.js">
    </script>
</body>

</html>
