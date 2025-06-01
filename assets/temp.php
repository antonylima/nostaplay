<?php
scanner('SONGS/');

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
                if(substr($GLOBALS['temp'], -3) == 'wma'){
                    unset($GLOBALS['dirtemp']);
                }else{
                    if (
                        (substr($GLOBALS['temp'], -3) == 'mp3') ||
                        (substr($GLOBALS['temp'], -3) == 'wav') ||
                        (substr($GLOBALS['temp'], -3) == 'm4a') ||
                        (substr($GLOBALS['temp'], -3) == 'ogg') ||
                            //(substr($GLOBALS['temp'], -3) == 'lac') ||
                            //(substr($GLOBALS['temp'], -3) == 'mid') ||
                        (substr($GLOBALS['temp'], -3) == 'aac')
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
echo "<script>               
               let jsondb = $json;
            </script>";
?>

<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>VanPlayer</title>
    <link rel="icon" type="image/x-icon" href="assets/play.png">
    <link rel="stylesheet" href="assets/style.css">
    <link rel="shortcut icon" href="assets/favicon.ico" type="image/png">
</head>

<body>
    <div id="main">
        <div id="header">
            <img class="imghd" id="img1" src="assets/vinilblack.png" alt="vinil">
            <h1>VanPlayer</h1>
            <img class="imghd" id="img2" src="assets/vinilblack.png" alt="vinil">
        </div>
        <div id="player">
            <audio controls src="" id="song"></audio>
        </div>
        <div id="info">
            <marquee id="mq" direction="right">
                <div id="painel">Hello</div>
            </marquee>
            <!-- <div class="fastpanel" id="painel">Hello</div> -->
        </div>
        <div id="ctrl">
            <div id="ctrl1" class="ctrl">
                <img onclick="play()" src="assets/play.png" alt="play">
                <img onclick="pause()" src="assets/pause.png" alt="pause">
                <img onclick="stop()" src="assets/stop.png" alt="stop">
            </div>
            <div id="ctrl2" class="ctrl">
                <img onclick="previous()" src="assets/previous.png" alt="previous">
                <img onclick="repeat()" src="assets/rpt.webp" alt="repeate">
                <img onclick="next()" src="assets/next.png" alt="next">
            </div>
        </div>
    </div>
    <div id="pesq">
        <input id="termo" class="pesq" type="text" value=" " placeholder="">
        <button class="pesq" onclick="search()">Search</button>
    </div>
    <div id="res">
    </div>
    <script src="assets/script.js">
    </script>
</body>

</html>

<script>
    let albumDir = "";
    let albumTracks = "";
    let termo = document.querySelector('#termo')
    termo.value = ""
    let faixa = "";
    let pasta = "";
    let display = "";
    let fonte = "";
    let song = document.querySelector('#song')
    let player = document.querySelector('#player')
    let info = document.querySelector('#info')
    let panel = document.querySelector("#painel")
    let mq = document.querySelector("#mq")
    let result = document.querySelector("#res")
    let tempo = song.duration;
    let start = false;
    let pausa = false
    var inc = 0
    let chave1 = "";
    let chave2 = "";
    let chave3 = "";
    let chave4 = "";
    let testador = null
    let albumDirx = ''
    let pastax = ''
    let rg = null;
    let busca = false

    function search() {
        if(termo.value != "" && termo.value != null){
            busca = true;
        result.innerHTML = ""
        console.clear();
        var arrayList = [];
        //var unique = ""
        var lista = document.createElement('ul')
        result.appendChild(lista)
        result.style.display = "block";
        testador = false
        console.log('Termo pesquisado: ' + termo.value);
        //rg = /termo.value/i;
        chave1 = termo.value.toUpperCase();
        chave2 = termo.value.toLowerCase();
        chave3 = termo.value;
        chave4 = termo.value.replace(/^./, termo.value[0].toUpperCase());
            for (let i in jsondb) {
                if (i.includes(`${chave1}`) || i.includes(`${chave2}`) || i.includes(`${chave3}`) || i.includes(`${chave4}`)) {
                    testador = true
                    termo.value = null;
                    console.log("Resutados:")
                    arrayList.push(i);
                }
        }
        if (testador === false) {
            console.log("Nothing found")
        }
        console.log(arrayList.length);
        if(arrayList.length > 1){ 
            for (let alb in arrayList) {
            var item = document.createElement('li')
            var texto = arrayList[alb].substring(
                    0, arrayList[alb].length - 1).substring(
                        arrayList[alb].substring(
                            0, arrayList[alb].length - 1)
                            .lastIndexOf('/') + 1
                    )
            if (alb != false && alb != null) {
                console.log(texto)
            }       
            item.textContent = texto
            item.addEventListener("click",function(){
                albumDir = arrayList[alb]
                albumTracks = jsondb[arrayList[alb]].sort()//(a,b)=>a.localeCompare(b));
            if(albumTracks[0].substring(albumTracks[0].length -3) != 'jpg'){
                faixa = albumTracks[0];
            }
            else{
                while(albumTracks[0].substring(albumTracks[0].length -3) == 'jpg'){
                    faixa = albumTracks[teste];
                    teste++;   
                }
            }
            pasta = albumDir.substring(0, albumDir.length - 1);
            display = pasta.substring(pasta.lastIndexOf('/') + 1) + ' - ' + faixa.substring(0, faixa.length - 4);
            fonte = pasta + '/' + faixa;
            })
            lista.appendChild(item);

        }
        }else{
            var item = document.createElement('li')
            var texto = arrayList[0].substring(
                    0, arrayList[0].length - 1).substring(
                        arrayList[0].substring(
                            0, arrayList[0].length - 1)
                            .lastIndexOf('/') + 1
                    )
                    console.log(texto)
            item.textContent = texto
            
            albumDir = arrayList[0];
            lista.appendChild(item);
            albumTracks = jsondb[arrayList[0]].sort()//(a,b)=>a.localeCompare(b));
            if(albumTracks[0].substring(albumTracks[0].length -3) != 'jpg'){
                faixa = albumTracks[0];
            }
            else{
                while(albumTracks[0].substring(albumTracks[0].length -3) == 'jpg'){
                    faixa = albumTracks[teste];
                    teste++;   
                }
            }
            pasta = albumDir.substring(0, albumDir.length - 1);
            display = pasta.substring(pasta.lastIndexOf('/') + 1) + ' - ' + faixa.substring(0, faixa.length - 4);
            fonte = pasta + '/' + faixa;    
        }
        //var teste = 1;
        console.log(arrayList)
       // if (arrayList[0]) {
            //albumDir = arrayList[0];
            //song.src = fonte
       // }

        }

    }


    function play() {
        if(busca == true){
            start = true;
        song.src = fonte
        display = pasta.substring(pasta.lastIndexOf('/') + 1) + ' - ' + faixa.substring(0, faixa.length - 4);
        panel.innerHTML = display
        try {
            song.play();
        } catch (error) {
            console.log(error);
        }
        if (pause) {
            pausa = false;
        }





        }
    }


    function autonext() {
        
        setInterval(function () {
            if (song.currentTime == tempo) {
                if (inc >= albumTracks.length - 1) {
                    stop();
                }
                else {
                    inc++
                    faixa = albumTracks[inc];
                }
                display = pasta.substring(pasta.lastIndexOf('/') + 1) + ' - ' + faixa.substring(0, faixa.length - 4);
                panel.innerHTML = display
                //console.log(display);
                song.src = pasta + '/' + faixa;
                song.play();
            }
            tempo = song.duration

        }, tempo)

    }


    function repeat() {
        
        setInterval(function () {
            if (song.currentTime == tempo) {
                if (inc >= albumTracks.length - 1) {
                    inc = 0;
                    faixa = albumTracks[inc];
                }
                else {
                    inc++
                    faixa = albumTracks[inc];
                }
                display = pasta.substring(pasta.lastIndexOf('/') + 1) + ' - ' + faixa.substring(0, faixa.length - 4);
                panel.innerHTML = display
                //console.log(display);
                song.src = pasta + '/' + faixa;
                song.play();
            }
            tempo = song.duration

        }, tempo)

    }

    function pause() {
        if (!pausa) {
            song.pause();
            pausa = true;
        }
        else {
            song.play();
            pausa = false
        }
    }

    function stop() {
        if (start) {
            song.pause()
            song.currentTime = 0
            panel.innerHTML = "Bye bye";
            song.src = fonte
            faixa = albumTracks[0];
            pasta = albumDir.substring(0, albumDir.length - 1);
            inc = 0
            start = false
            pausa = false
        }
    }
    function next() {
        if (start) {
            if (inc >= albumTracks.length - 1) {
                inc = 0;
                faixa = albumTracks[inc];
            }
            else {
                inc++
                faixa = albumTracks[inc];
            }
            display = pasta.substring(pasta.lastIndexOf('/') + 1) + ' - ' + faixa.substring(0, faixa.length - 4);
            panel.innerHTML = display
            song.src = pasta + '/' + faixa;
            song.play();
        }
    }
    function previous() {
        if (start) {
            if (inc <= 0) {
                inc = albumTracks.length - 1;
                faixa = albumTracks[inc];
            }
            else {
                inc--
                faixa = albumTracks[inc];
            }
            display = pasta.substring(pasta.lastIndexOf('/') + 1) + ' - ' + faixa.substring(0, faixa.length - 4);
            panel.innerHTML = display
            song.src = pasta + '/' + faixa;
            song.play();
        }
    }

    
    //console.log(albumTracks.sort((a,b)=>b.localeCompare(a)))
    //console.log(albumTracks.length)
    //console.log(jsondb[albumDir].lenght)

</script>