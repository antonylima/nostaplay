// Declarações de variáveis globais
let dmh, fth, bdh, bdh2, rph;
let rmp = null;
let albumDir = "";
let albumTracks = [];
let termo, song, panel, mq, result, rpt;
let faixa = "";
let display = "";
let fonte = "";
let pasta = ""; // Bug fix: variável não estava declarada
let start = false;
let pausa = false;
let inc = 0;
let albumDisplayName = "";
let chave1 = "", chave2 = "", chave3 = "", chave4 = "";
let testador = null;
let busca = false;
let rptctrl = false;
let jsondb = null;
let jsondbEntries = [];

const url = "https://nostaplay.com/api/api.php";
//const url = "http://localhost:8000/api/api.php";
const getResultOffsetPx = () => {
    const deepmain = document.querySelector('#deepmain');
    if (!deepmain) return null;
    const gap = Math.min(Math.max(6, Math.round(window.innerHeight * 0.012)), 14);
    return deepmain.offsetHeight + gap;
};
// Bug fix: Mover inicializações para DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
    // Inicializar elementos do DOM
    const deepmain = document.querySelector('#deepmain');
    const footer = document.querySelector('#footer');
    const res = document.querySelector('#res');
    
    if (deepmain && footer) {
        dmh = deepmain.offsetHeight;
        fth = footer.offsetHeight;
    }
    
    bdh = window.screen.height;
    bdh2 = window.screen.availHeight;
    
    termo = document.querySelector('#termo');
    song = document.querySelector('#song');
    panel = document.querySelector("#painel");
    mq = document.querySelector("#mq");
    result = document.querySelector("#res");
    rpt = document.querySelector("#repeat");
    
    // Verificar orientação inicial
    if (screen.orientation.type === "portrait-primary" || 
        screen.orientation.type === "portrait-secondary") {
        const offset = getResultOffsetPx();
        if (offset && res) {
            rmp = offset;
            res.style.marginTop = rmp + "px";
        }
    }
    
    // Event listeners
    if (termo) {
        termo.value = "";
        termo.addEventListener("keyup", function (e) {
            if (e.key === "Enter") {
                search();
            }
        });
    }
    
    const prevBtn = document.querySelector("#prev");
    const nextBtn = document.querySelector("#next");
    
    if (prevBtn) prevBtn.addEventListener('click', previous);
    if (nextBtn) nextBtn.addEventListener('click', next);
    
    // Bug fix: Adicionar listener para ended em vez de setInterval
    if (song) {
        song.addEventListener('ended', handleSongEnded);
    }
    
    // Sleep timer elements
    const set = document.querySelector('#set');
    const opc = document.querySelector('#opc');
    const sleepmn = document.querySelector('#sleepmn');
    const sleepop = document.querySelector('#sleepop');
    
    if (set && opc) {
        set.onclick = () => {
            opc.style.display = "block";
            setTimeout(() => {
                opc.style.display = "none";
            }, 5000);
        };
    }
    
    if (sleepmn && sleepop) {
        setupSleepTimer(sleepmn, sleepop);
    }
});

// Bug fix: Função para lidar com fim da música
function handleSongEnded() {
    if (inc === albumTracks.length - 1) {
        if (!rptctrl) {
            stop();
        } else {
            inc = 0;
            playTrack();
        }
    } else {
        inc++;
        playTrack();
    }
}

// Bug fix: Função separada para tocar faixa
function playTrack() {
    faixa = albumTracks[inc];
    display = albumDisplayName + ' - ' + displayTrackName(faixa);
    if (panel) panel.innerHTML = display;
    if (song) {
        song.src = pasta + '/' + faixa;
        song.play();
    }
}

// Fetch da API
fetch(url)
    .then(async (response) => {
        const contentType = response.headers.get('content-type') || '';
        const buffer = await response.arrayBuffer();
        let text;
        if (/charset=iso-8859-1|charset=latin1|charset=windows-1252/i.test(contentType)) {
            text = new TextDecoder('iso-8859-1').decode(buffer);
        } else {
            text = new TextDecoder('utf-8').decode(buffer);
            if (text.includes('ï¿½')) {
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
    if (!/[ÃƒÃ‚ï¿½]/.test(value)) {
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

function search() {
    if (!termo || !termo.value || !jsondb) return;
    
    busca = true;
    if (result) result.innerHTML = "";
    console.clear();
    
    const arrayList = [];
    const lista = document.createElement('ul');
    
    if (screen.orientation.type === "portrait-primary" || 
        screen.orientation.type === "portrait-secondary") {
        const offset = getResultOffsetPx();
        if (offset && result) {
            rmp = offset;
            result.style.marginTop = rmp + "px";
        }
    }
    
    if (result) result.appendChild(lista);
    testador = false;
    
    console.log('Termo pesquisado: ' + termo.value);
    chave1 = termo.value.toUpperCase();
    chave2 = termo.value.toLowerCase();
    chave3 = termo.value;
    chave4 = termo.value.replace(/^./, termo.value[0].toUpperCase());
    
    for (const entry of jsondbEntries) {
        const displayKey = entry.displayKey;
        const rawKey = entry.rawKey;
        if (
            displayKey.includes(chave1) ||
            displayKey.includes(chave2) ||
            displayKey.includes(chave3) ||
            displayKey.includes(chave4) ||
            rawKey.includes(chave1) ||
            rawKey.includes(chave2) ||
            rawKey.includes(chave3) ||
            rawKey.includes(chave4)
        ) {
            testador = true;
            arrayList.push(entry);
        }
    }
    
    termo.value = ""; // Bug fix: movido para depois do loop
    
    if (!testador) {
        console.log("Nothing found");
    }
    
    console.log(arrayList.length);
    arrayList.sort((a, b) => a.displayKey.localeCompare(b.displayKey, 'pt-BR', { sensitivity: 'base' }));
    
    for (let alb in arrayList) {
        const entry = arrayList[alb];
        const item = document.createElement('li');
        let texto = displayTitleFromKey(entry.displayKey);
        texto = texto.toUpperCase().split(' ');
        
        if (jsondb[entry.rawKey]) {
            const newtxt = tratar(texto);
            item.textContent = newtxt;
            item.addEventListener("click", function () {
                const baseUrl = url.replace('/api/api.php', '');
                pasta = baseUrl + "/";
                inc = 0;
                albumDir = pasta + entry.rawKey;
                albumTracks = jsondb[entry.rawKey];
                faixa = albumTracks[0];
                pasta = albumDir.substring(0, albumDir.length - 1);
                albumDisplayName = newtxt;
                display = albumDisplayName + ' - ' + displayTrackName(faixa);
                fonte = pasta + '/' + faixa;
                startPlay();
            });
            lista.appendChild(item);
        }
    }
    
    // Adicionar espaçamento extra
    for (let i = 1; i < 11; i++) {
        lista.appendChild(document.createElement("li"));
    }
}

// Orientação
window.screen.orientation.onchange = () => {
    if (!result) return;
    
    if (window.screen.orientation.type === "portrait-primary" ||
        window.screen.orientation.type === "portrait-secondary") {
        const offset = getResultOffsetPx();
        if (offset) {
            rmp = offset;
            result.style.marginTop = rmp + "px";
        }
    } else {
        result.style.marginTop = "1%";
    }
};

function startPlay() {
    if (!busca || !albumTracks[0] || !song) return;
    
    song.src = fonte;
    start = true;
    display = albumDisplayName + ' - ' + displayTrackName(faixa);
    if (panel) panel.innerHTML = display;
    song.play();
}

function repeat() {
    if (!busca || !rpt) return;
    
    rptctrl = !rptctrl;
    rpt.src = rptctrl ? "assets/img/rpton.png" : "assets/img/rptoff.png";
}

function startPause() {
    if (!start || !song) return;
    
    if (!pausa) {
        song.pause();
        pausa = true;
    } else {
        song.play();
        pausa = false;
    }
}

function stop() {
    if (!start || !song) return;
    
    song.pause();
    const pp = document.querySelector('#pp');
    if (pp) pp.src = "assets/img/pause.png";
    song.currentTime = 0;
    if (panel) panel.innerHTML = "Bye bye";
    song.src = fonte;
    faixa = albumTracks[0];
    pasta = albumDir.substring(0, albumDir.length - 1);
    inc = 0;
    start = false;
    pausa = false;
    rptctrl = false;
    if (rpt) rpt.src = "assets/img/rptoff.png";
}

function next() {
    if (!start) return;
    
    if (inc >= albumTracks.length - 1) {
        inc = 0;
    } else {
        inc++;
    }
    playTrack();
}

function previous() {
    if (!start) return;
    
    if (inc <= 0) {
        inc = albumTracks.length - 1;
    } else {
        inc--;
    }
    playTrack();
}

function tratar(text) {
    const temptxt = [];
    for (let w in text) {
        if (text[w].length > 2 ||
            text[w] === text[0] ||
            text[w - 1] === "-") {
            temptxt.push(text[w][0] + text[w].substring(1).toLowerCase());
        } else {
            if (text[w] === '-') {
                temptxt.push("-");
            } else if (text[w][0] === '-') {
                temptxt.push("- " + text[w][1] + text[w].substring(2));
            } else {
                temptxt.push(text[w].toLowerCase());
            }
        }
    }
    let newtxt = temptxt.join(" ");
    if (newtxt.length > 30) {
        newtxt = newtxt.substring(0, 29) + '...';
    }
    return newtxt;
}

// Sleep Timer
let sto0 = null;
let initial = 1;
let sto = null;
let hide = null;
let clickSleep = false;
const timers = [
    'OFF',
    900000,   // 15min
    1800000,  // 30min
    3600000,  // 60min
    5400000,  // 90min
    7200000,  // 120min
    9000000,  // 150min
    10800000, // 180min
];

function setupSleepTimer(sleepmn, sleepop) {
    sleepmn.onclick = () => {
        sleepop.style.display = "block";
        clickSleep = false;
        clearInterval(sto0);
        sto0 = setTimeout(() => {
            if (!clickSleep) {
                sleepop.style.display = "none";
            }
        }, 5000);
    };
    
    sleepop.onclick = () => {
        clickSleep = true;
        if (initial === timers.length) {
            initial = 0;
        }
        if (timers[initial] !== timers[0]) {
            sleepop.innerHTML = timers[initial] / 1000 / 60;
            console.log('Sleep timer ativo');
            clearTimeout(sto);
            sto = setTimeout(() => {
                stop();
                console.log('Sleep timer - parando música');
                initial = 0;
                sleepop.innerHTML = timers[0];
                initial++;
            }, timers[initial]);
        } else {
            sleepop.innerHTML = timers[initial];
            console.log('Sleep timer desativado');
        }
        initial++;
        clearTimeout(hide);
        hide = setTimeout(() => {
            sleepop.style.display = "none";
        }, 3000);
    };
}
