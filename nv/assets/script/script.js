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
//const url = "https://nostaplay.com/api/api.php";
//const url = "http://192.168.3.101:8000/api/api.php";
const url = "https://latemsom.com.br/api/api.php"
//const url = "http://localhost:8000/api/api.php";
fetch(url)
    .then(async (response) => {
        const contentType = response.headers.get('content-type') || '';
        const buffer = await response.arrayBuffer();
        let text;
        if (/charset=iso-8859-1|charset=latin1|charset=windows-1252/i.test(contentType)) {
            text = new TextDecoder('iso-8859-1').decode(buffer);
        } else {
            text = new TextDecoder('utf-8').decode(buffer);
            if (text.includes('�')) {
                text = new TextDecoder('iso-8859-1').decode(buffer);
            }
        }
        return JSON.parse(text);
    })
    .then(data => {
        jsondb = data;
        jsondbEntries = buildEntries(data);
    })
    .catch(error => console.error('Erro:', error));

function fixMojibake(value) {
    if (typeof value !== 'string') {
        return value;
    }
    if (!/[ÃÂ�]/.test(value)) {
        return value;
    }
    const bytes = Uint8Array.from(value, (ch) => ch.charCodeAt(0));
    return new TextDecoder('utf-8').decode(bytes);
}

function buildEntries(data) {
    return Object.keys(data).map((rawKey) => ({
        rawKey,
        displayKey: fixMojibake(rawKey),
    }));
}

function displayTitleFromKey(key) {
    return key
        .substring(0, key.length - 1)
        .substring(
            key.substring(0, key.length - 1).lastIndexOf('/') + 1
        );
}

function displayTrackName(track) {
    return fixMojibake(track.substring(0, track.length - 4));
}

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
let albumDisplayName = "";
let chave1 = "";
let chave2 = "";
let chave3 = "";
let chave4 = "";
let testador = null
let albumDirx = ''
let busca = false
let rptctrl = false;
let jsondbEntries = [];
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
        for (const entry of jsondbEntries) {
            const displayKey = entry.displayKey;
            const rawKey = entry.rawKey;
            if (
                displayKey.includes(`${chave1}`) ||
                displayKey.includes(`${chave2}`) ||
                displayKey.includes(`${chave3}`) ||
                displayKey.includes(`${chave4}`) ||
                rawKey.includes(`${chave1}`) ||
                rawKey.includes(`${chave2}`) ||
                rawKey.includes(`${chave3}`) ||
                rawKey.includes(`${chave4}`)
            ) {
                testador = true
                termo.value = null;
                console.log("Resutados:")
                arrayList.push(entry);
            }
        }
        if (testador === false) {
            console.log("Nothing found")
        }
        console.log(arrayList.length);
        arrayList.sort((a, b) => a.displayKey.localeCompare(b.displayKey, 'pt-BR', { sensitivity: 'base' }));
        for (let alb in arrayList) {
            const entry = arrayList[alb];
            var item = document.createElement('li')
            var texto = displayTitleFromKey(entry.displayKey)
            texto = texto.toUpperCase().split(' ');
            if (jsondb[entry.rawKey]) {
                //console.log("same below: ",jsondb[entry.rawKey])
                var newtxt = tratar(texto);
                item.textContent = newtxt;
                item.addEventListener("click", function () {
		const baseUrl = url.replace('/api/api.php', '');
		pasta = baseUrl + "/";                    	
                    inc = 0
                    albumDir = pasta + entry.rawKey;
                    //console.log("album: ",albumDir);
                    albumTracks = jsondb[entry.rawKey]//.sort()//(a,b)=>a.localeCompare(b));
                    //console.log("same above: ",albumTracks);
                    faixa = albumTracks[0];
                    //console.log("faixa: ",faixa)
                    pasta = albumDir.substring(0, albumDir.length - 1);
                    //console.log(pasta);
                    albumDisplayName = newtxt;
                    display = albumDisplayName + ' - ' + displayTrackName(faixa);
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
        display = albumDisplayName + ' - ' + displayTrackName(faixa);
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
                    display = albumDisplayName + ' - ' + displayTrackName(faixa);
                    panel.innerHTML = display
                    //console.log(display);
                    song.src = pasta + '/' + faixa;
                    song.play();
                }
            }
            else {
                inc++
                faixa = albumTracks[inc];
                display = albumDisplayName + ' - ' + displayTrackName(faixa);
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
            //pp.src = "assets/img/play.png";
            song.pause();
            pausa = true;
        }
        else {
            //pp.src = "assets/img/pause.png";
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
        display = albumDisplayName + ' - ' + displayTrackName(faixa);
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
        display = albumDisplayName + ' - ' + displayTrackName(faixa);
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

var sto0 = null;
let initial = 1;
var sto = null;
var hide = null;
var clickSleep = false;
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

set.onclick = ()=>{
    opc.style.display = "block";
    setTimeout(()=>{
        opc.style.display = "none";
    },5000)
}
sleepmn.onclick = ()=>{
    sleepop.style.display = "block";
    clickSleep = false;
    clearInterval(sto0)
    sto0 = setTimeout(()=>{
        if(clickSleep !== true){
            sleepop.style.display = "none";
        }
    },5000)
    
}
//let stts = false;
sleepop.onclick = () => {
    clickSleep = true;
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
  clearTimeout(hide)
    hide = setTimeout(()=>{
        sleepop.style.display = "none"
    },3000)
};
