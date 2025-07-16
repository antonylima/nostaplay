//const url = "https://apiapp.kesug.com";
const url = "http://localhost:8002/";
fetch(url)
    .then(response => response.json())
    //.then(response => response.json())
    .then(data => {
        //console.log(data);
        jsondb = data;
        //jsondb = data;
    })
    .catch(error => console.error('Erro:', error));

let albumDir = "";
let albumTracks = "";
let termo = document.querySelector('#termo')
termo.value = ""
let faixa = "";
//let pasta = "https://hyena-rich-slightly.ngrok-free.app/";
let pasta = "http://localhost:8002/";
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

//termo.activeElement = true;

termo.addEventListener("focus", function () {
    document.addEventListener("keyup", function (e) {
        if (e.key === "Enter") {
            search();
        }
    })
})


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
        for (let alb in arrayList) {
            //console.log(arrayList[alb]);
            var item = document.createElement('li')
            var texto = arrayList[alb].substring(
                0, arrayList[alb].length - 1)
                .substring(
                    arrayList[alb].substring(
                        0, arrayList[alb].length - 1)
                        .lastIndexOf('/') + 1
                )
            texto = texto.toUpperCase().split(' ');
            if (jsondb[arrayList[alb]]) {
                //console.log("same below: ",jsondb[arrayList[alb]])
                var newtxt = tratar(texto);
                item.textContent = newtxt;
                item.addEventListener("click", function () {
                    pasta = "http://localhost:8002/";
                    inc = 0
                    albumDir = pasta + arrayList[alb];
                    //console.log("album: ",albumDir);
                    albumTracks = jsondb[arrayList[alb]]//.sort()//(a,b)=>a.localeCompare(b));
                    //console.log("same above: ",albumTracks);
                    faixa = albumTracks[0];
                    //console.log("faixa: ",faixa)
                    pasta = albumDir.substring(0, albumDir.length - 1);
                    //console.log(pasta);
                    display = newtxt + ' - ' + faixa.substring(0, faixa.length - 4)
                    fonte = pasta + '/' + faixa;
                    //console.log("fonte: ", fonte);
                    play();
                })
                lista.appendChild(item);
            }
        }
    }
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
        rpt.src = "assets/img/rptoff.png"
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

function tratar(text) {
                  var temptxt = [];
                var newtxt = "";
                for (let w in text) {
                    if ((text[w].length > 2 ||
                        text[w] === text[0] ||
                        text[w - 1] === "-")
                    ) {
                        temptxt.push(text[w][0] + text[w].substring(1).toLowerCase());

                    } else {

                        if (text[w] === '-') {
                            temptxt.push("-")

                        } else {
                            if (text[w][0] === '-') {
                                temptxt.push("- " + text[w][1] + text[w].substring(2))//.toLowerCase())//&& texto[w].length

                            } else {
                                temptxt.push(text[w].toLowerCase())

                            }

                        }

                    }

                }
                newtxt = temptxt.join(" ")
                if (newtxt.length > 30) {
                    newtxt = newtxt.substring(0, 29) + '...';
                }
                return newtxt;
}


//console.log(albumTracks.sort((a,b)=>b.localeCompare(a)))
//console.log(albumTracks.length)
//console.log(jsondb[albumDir].lenght)
