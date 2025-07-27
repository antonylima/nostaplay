const dmh = deepmain.offsetHeight;
const fth = footer.offsetHeight;
const bdh = window.screen.height;
const bdh2 = window.screen.availHeight
const rph = bdh - dmh - fth;
var rmp = null;
console.log(rmp)
document.addEventListener("DOMContentLoaded", () => {
    if (screen.orientation.type === "portrait-primary" || screen.orientation.type === "portrait-secondary") {
        //alert(2)
        rmp = dmh + 10;    
        res.style.marginTop = rmp + "px";
    }
})
//console.log(bdh, "-", bdh2, window.getComputedStyle(master).display)
//footer.style.height = fth + "px";
const url = "https://nostaplay.com/api.php";
//const url = "http://localhost:8000/api.php";
fetch(url)
    .then(response => response.json())
    .then(data => {
        jsondb = data;
    })
    .catch(error => console.error('Erro:', error));

let albumDir = "";
let albumTracks = "";
let termo = document.querySelector('#termo')
termo.value = ""
let faixa = "";
let display = "";
let fonte = "";
let song = document.querySelector('#song')
let panel = document.querySelector("#painel")
let mq = document.querySelector("#mq")
let result = document.querySelector("#res")
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
let busca = false
let rptctrl = false;
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
        if (screen.orientation.type === "portrait-primary" || screen.orientation.type === "portrait-secondary") {
            rmp = dmh + 10;
            result.style.marginTop = rmp + "px";
        }
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
                    pasta = "https://nostaplay.com/";
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
                    startPlay();
                })
                lista.appendChild(item);
            }
        }
    }
    for(let i = 1;i<11;i++){
                    lista.appendChild(document.createElement("li"));
                }
}

/*document.addEventListener('orientationchange', () => {
    if (window.screen.orientation.type === "portrait-primary" ||
        window.screen.orientation.type === "portrait-secondary") {
        //alert("ops")    
        //res.style.marginTop = rmp + "px";
    }
})*/

window.screen.orientation.onchange = () => {
    if (window.screen.orientation.type === "portrait-primary" ||
        window.screen.orientation.type === "portrait-secondary") {
        //alert("ops")
        res.style.marginTop = rmp + "px";
    } else {
        res.style.marginTop = "1%";
    }
}

document.querySelector("#prev").addEventListener('click', previous)
document.querySelector("#next").addEventListener('click', next)



function startPlay() {
    if (busca == true && albumTracks[0]) {
        song.src = fonte
        start = true;
        display = pasta.substring(pasta.lastIndexOf('/') + 1) + ' - ' + faixa.substring(0, faixa.length - 4);
        panel.innerHTML = display;
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
            rpt.src = "assets/img/rpton.png";
        } else {
            rptctrl = false
            rpt.src = "assets/img/rptoff.png";
        }
    }
}

function startPause() {
    if (start == true) {
        if (!pausa) {
            pp.src = "assets/img/play.png";
            song.pause();
            pausa = true;
        }
        else {
            pp.src = "assets/img/pause.png";
            song.play();
            pausa = false
        }
    }
}
function stop() {
    if (start) {
        song.pause()
        pp.src = "assets/img/pause.png";
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


set.onclick = ()=>{
    opc.style.display = "block";
    setTimeout(()=>{
        opc.style.display = "none";
    },5000)
}

sleepmn.onclick = ()=>{
    sleepop.style.display = "block";
}


const timers = [
  'OFF',
  900000,
  1800000,
  3600000,
  5400000,
  7200000,
  9000000,
  10800000,
];
//let stts = false;
let initial = 1;
var sto = null;
var hide = null;
sleepop.onclick = () => {
    clearTimeout(hide)
    hide = setTimeout(()=>{
        sleepop.style.display = "none"
    },3000)
  if (initial === timers.length) {
    initial = 0;
  }
  if (timers[initial] !== timers[0]) {
    sleepop.innerHTML = timers[initial] / 1000 / 60;
    //stts = true;
    console.log('true');
    clearTimeout(sto);
    sto = setTimeout(() => {
      stop();
      console.log('Bye');
      initial = initial = 0;
      sleepop.innerHTML = timers[0];
      initial++;
    }, timers[initial]);
  } else {
    sleepop.innerHTML = timers[initial];
    //stts = false;
    console.log('false');
  }
  initial++;
};
