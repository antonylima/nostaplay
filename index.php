<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nostaplay</title>
    <link rel="icon" type="image/x-icon" href="assets/play.png">
    <link rel="stylesheet" href="assets/style.css" type="text/css">
    <link rel="stylesheet" href="assets/normalize.css" type="text/css">
    <link rel="shortcut icon" href="assets/favicon.ico" type="image/png">
</head>

<body>
    <dialog id="ch"></dialog>
    <div id="master">
    <div id="deepmain">
        <div id="main">
            <div id="header">
                <img class="imghd" id="img1" src="assets/vinil.png" alt="vinil">
                <img id="title" src="assets/title.png" alt="title">
                <img class="imghd" id="img2" src="assets/vinil.png" alt="vinil">
            </div>
            <div id="player">
                <audio controls src="" id="song"></audio>
            </div>
            <div id="info">
                <marquee id="mq" direction="left">
                    <div id="painel">Hello</div>
                </marquee>
            </div>
            <div id="ctrl">
                <div id="ctrl1" class="ctrl"> 
                   <img onclick="play()" src="assets/play.png" alt="play">
                   <img onclick="pause()" src="assets/pause.png" alt="pause">
                   <img onclick="stop()" src="assets/stop.png" alt="stop">
                </div>
                <div id="ctrl2" class="ctrl">
                    <img onclick="previous()" src="assets/previous.png" alt="previous">
                    <img id="repeat" onclick="repeat()" src="assets/rptoff.png" alt="repeat">
                    <img onclick="next()" src="assets/next.png" alt="next">
                </div>
            </div>
        </div>
        <div id="pesq">
            <input id="termo" class="pesq" type="text" value="" placeholder="Digite um gênero ou artista">
            <img class="pesq" onclick="search()" src="assets/lens.png" alt="search">
        </div>
    </div>
    <div id="res">
    </div>
    </div>
    
    
    <script src="assets/script.js">
    </script>
</body>

</html>


<?php
$srcs = array("SERTANEJO/","");
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
echo "<script>               
    let jsondb = $json;
</script>";
?>

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
    //let player = document.querySelector('#player')
    //let info = document.querySelector('#info')
    let panel = document.querySelector("#painel")
    let mq = document.querySelector("#mq")
    let result = document.querySelector("#res")
    //let lista = document.querySelector("#l")
    let rpt = document.querySelector("#repeat")
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
    let rptctrl = false;
    let choice = document.querySelector('#ch')
    let chtxt = null
    //choice.id = "ch"

    function search() {
        if (termo.value != "" && termo.value != null && jsondb) {
            busca = true;
            result.innerHTML = ""
            console.clear();
            var arrayList = [];
            //var unique = ""
            var lista = document.createElement('ul')
            result.appendChild(lista)
            testador = false
            console.log('Termo pesquisado: ' + termo.value);
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
            arrayList.sort();
            if (arrayList.length > 1) {
                for (let alb in arrayList) {
                    var item = document.createElement('li')
                    var texto = arrayList[alb].substring(
                        0, arrayList[alb].length - 1)
                        .substring(
                            arrayList[alb].substring(
                                0,arrayList[alb].length - 1)
                                .lastIndexOf('/') + 1
                        )
                    
                        texto = texto.toUpperCase().split(' ');
                        //console.log(texto)
                    if (jsondb[arrayList[alb]]) {

                        //tratar(texto)
                        var temptxt = [];
                        var newtxt = "";
                        for (let w in texto) {
                            if ((texto[w].length > 2 ||
                                texto[w] === texto[0] ||
                                texto[w-1] === "-") 
                                //&& texto[w][0] !== '-'
                            ) {
                                    //temptxt.push(texto[w][0].replace(/^./,texto[w][0].toUpperCase()+texto[w].substring(1)))
                                temptxt.push(texto[w][0] + texto[w].substring(1).toLowerCase());
    
                                }else{

                                    if (texto[w] === '-') {
                                        temptxt.push("-")

                                    }else{
                                        if(texto[w][0] === '-'){
                                           //console.log("- " + texto[w][1] + texto[w].substring(2))
                                           
                                            temptxt.push("- " + texto[w][1] + texto[w].substring(2))//.toLowerCase())//&& texto[w].length

                                        }else{
                                            temptxt.push(texto[w].toLowerCase())

                                        }
                                        
                                    }

                                } // else do > 2
                     
                    }
                    newtxt = temptxt.join(" ")
                    if(newtxt.length > 30){
                            newtxt = newtxt.substring(0,29) + '...';
                        }
                    
                    console.log(newtxt);

                    item.textContent = newtxt
                    item.addEventListener("click", function () {
                        // chtxt = arrayList[alb].substring(
                        //     0, arrayList[alb].length - 1).substring(
                        //         arrayList[alb].substring(
                        //             0, arrayList[alb].length - 1)
                        //             .lastIndexOf('/') + 1)
                        // choice.innerHTML = chtxt 
                        // choice.show()  
                        // setInterval(() => document.querySelector('#ch').close()
                        //      , 2000)
                        inc = 0
                        albumDir = arrayList[alb]
                        albumTracks = jsondb[arrayList[alb]].sort()//(a,b)=>a.localeCompare(b));
                        if (albumTracks[0].substring(albumTracks[0].length - 3) != 'jpg') {
                            faixa = albumTracks[0];
                        }
                        else {
                            while (albumTracks[0].substring(albumTracks[0].length - 3) == 'jpg') {
                                faixa = albumTracks[teste];
                                teste++;
                            }
                        }
                        pasta = albumDir.substring(0, albumDir.length - 1);

                        display = newtxt + ' - ' + faixa.substring(0, faixa.length - 4)
                        fonte = pasta + '/' + faixa;
                        play();
                    })
                    lista.appendChild(item);
                }
            }
        } 
        
        /*-------------------------------------------------------------------------*/ 
        
        
        else {
            //for (let alb in arrayList) {
                    var item = document.createElement('li')
                    var texto = arrayList[0].substring(
                        0, arrayList[0].length - 1)
                        .substring(
                            arrayList[0].substring(
                                0,arrayList[0].length - 1)
                                .lastIndexOf('/') + 1
                        )
                        if(texto.length > 35){
                            texto = texto.substring(0,34) + '...';
                        }
                        texto = texto.split(' ');
                    if (jsondb[arrayList[0]]) {
                        var temptxt = [];
                        var newtxt = "";
                        for (let w in texto) {
                            if (texto[w].length > 2 ||
                                texto[w] === "Zé" ||
                                texto[w] === "zé" ||
                                texto[w] === "Di" ||
                                texto[w] === "di" ||
                                texto[w] === "pe" ||
                                texto[w] === "Pe" ||
                                texto[w] === texto[0]
                            ) {
                                //temptxt.push(texto[w][0].replace(/^./,texto[w][0].toUpperCase()+texto[w].substring(1)))
                                temptxt.push(texto[w][0].toUpperCase() + texto[w].substring(1).toLowerCase());
                            }
                            else {
                               temptxt.push(texto[w].toLowerCase());
                                
                      }
                    }
                    newtxt = temptxt.join(" ")
                    
                    console.log(newtxt);

                    item.textContent = newtxt
                    item.addEventListener("click", function () {
                        inc = 0
                        albumDir = arrayList[0]
                        albumTracks = jsondb[arrayList[0]].sort()//(a,b)=>a.localeCompare(b));
                        if (albumTracks[0].substring(albumTracks[0].length - 3) != 'jpg') {
                            faixa = albumTracks[0];
                        }
                        else {
                            while (albumTracks[0].substring(albumTracks[0].length - 3) == 'jpg') {
                                faixa = albumTracks[teste];
                                teste++;
                            }
                        }
                        pasta = albumDir.substring(0, albumDir.length - 1);
                        display = newtxt + ' - ' + faixa.substring(0, faixa.length - 4)
                        fonte = pasta + '/' + faixa;
                        play();
                    })
                    lista.appendChild(item);
                }
         //   }
        
        }
        console.log(arrayList)

    }
      //      else {
        //alert('None main directory found')
    //}

        }

    function play() {
        if (busca == true && albumTracks[0]) {
            start = true;
            if (pause) {
                pausa = false;
            }
            song.src = fonte
            display = pasta.substring(pasta.lastIndexOf('/') + 1) + ' - ' + faixa.substring(0, faixa.length - 4);
            panel.innerHTML = display
            song.play();

            autonext();
        }
    }
    function autonext() {
        setInterval(function () {
            if (song.currentTime == tempo) {
                if (inc == albumTracks.length - 1) {
                    if (rptctrl == false) {
                        stop();
                    } else {
                        inc = 0;
                        faixa = albumTracks[inc];
                        display = pasta.substring(pasta.lastIndexOf('/') + 1) + ' - ' + faixa.substring(0, faixa.length - 4);
                        panel.innerHTML = display
                        //console.log(display);
                        song.src = pasta + '/' + faixa;
                        song.play();
                    }
                }
                else {
                    inc++
                    faixa = albumTracks[inc];
                    display = pasta.substring(pasta.lastIndexOf('/') + 1) + ' - ' + faixa.substring(0, faixa.length - 4);
                    panel.innerHTML = display
                    //console.log(display);
                    song.src = pasta + '/' + faixa;
                    song.play();
                }
            }
            tempo = song.duration
        }, tempo)

    }


    function repeat() {
        if (busca == true) {
            if (rptctrl === false) {
                rptctrl = true
                rpt.src = "assets/rpton.png"
            } else {
                rptctrl = false
                rpt.src = "assets/rptoff.png"
            }
        }
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
            rptctrl = false
            rpt.src = "assets/rptoff.png"
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


    // Função para remover um elemento HTML com base em um seletor CSS
    function removeElemento(query) {
        // Pega o elemento usando o seletor
        var el = document.querySelector(query)

        // Se o elemento não foi encontrado finaliza a função
        if (!el)
            return

        // Remove o elemento
        el.parentElement.removeChild(el)
    }


    function tratar(text){
        var temptxt = [];
                        var newtxt = "";
                        for (let w in text) {
                            if ((text[w].length > 2 ||
                                text[w] === text[0] ||
                                text[w-1] === "-") 
                                //&& text[w][0] !== '-'
                            ) {
                                    //temptxt.push(text[w][0].replace(/^./,text[w][0].toUpperCase()+text[w].substring(1)))
                                temptxt.push(text[w][0] + text[w].substring(1).toLowerCase());
    
                                }else{

                                    if (text[w] === '-') {
                                        temptxt.push("-")

                                    }else{
                                        if(text[w][0] === '-'){
                                           //console.log("- " + text[w][1] + text[w].substring(2))
                                           
                                            temptxt.push("- " + text[w][1] + text[w].substring(2))//.toLowerCase())//&& text[w].length

                                        }else{
                                            temptxt.push(text[w].toLowerCase())

                                        }
                                        
                                    }

                                } // else do > 2
                     
                    }
                    newtxt = temptxt.join(" ");
                    return newtxt;
                }


    //console.log(albumTracks.sort((a,b)=>b.localeCompare(a)))
    //console.log(albumTracks.length)
    //console.log(jsondb[albumDir].lenght)

</script>