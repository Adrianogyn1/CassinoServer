$(function() {
    let chipSelected = null;
    const bet = { banker: 0, player: 0, draw: 0, total: 0 };

    const $el = {
        betBoxes: $("#bet_player, #bet_banker, #bet_draw"),
        log: $("#log"),
        history: $('#history'),
        playerDeck: $('#player'),
        bankerDeck: $('#banker'),
        historico: $('#historico'),
        tempo: $('#tempo'),
        status: $('#status'),
        error: $('#error')
    };
    
        // ================= SOCKET =================
    const params = new URLSearchParams(window.location.search);
    const $roomName = params.get('room');
    const socket = io("https://cassinoserver-production.up.railway.app");
    const myHistorico = [];

    // ================= BET FUNCTIONS =================
    function updateBet() {
        $el.betBoxes.each(function() {
            const id = $(this).attr("id");
            const total = $(this).find(".chip").toArray()
                .reduce((sum, c) => sum + parseInt($(c).data("value")) || 0, 0);

            if (id.includes("player")) bet.player = total;
            if (id.includes("banker")) bet.banker = total;
            if (id.includes("draw")) bet.draw = total;
        });
        bet.total = bet.player + bet.banker + bet.draw;
       socket.emit("myBet",bet);
        console.log(bet);
    }

    function addChip(value, container) {
        // remove primeira ficha existente e soma valor
        const $first = container.find(".chip").first();
        if ($first.length) {
            value += parseFloat($first.data("value"));
            $first.remove();
        }

        const $chip = $(`<div class="chip" style="--chip-bg:blue" data-value="${value}">${value}</div>`)
            .draggable({
                helper: "original",
                cursor: "move",
                revert: "invalid",
                start: (e, ui) => ui.helper.css("z-index", 1000),
                stop: (e, ui) => { if (!ui.helper.data("dropped")) { ui.helper.remove(); updateBet(); } }
            });

        container.append($chip);
        updateBet();
    }

    $(".chip").click(function() {
        chipSelected = parseFloat($(this).data("value"));
        console.log("Valor selecionado:", chipSelected);
    });

    $el.betBoxes.click(function() {
        const $amount = $(this).find(".bet-amount");
        addChip(chipSelected, $amount);
    });

    $el.betBoxes.droppable({
        accept: ".chip",
        hoverClass: "border border-3 border-warning",
        drop: function(event, ui) {
            const value = parseFloat(ui.helper.data("value"));
            const $amount = $(this).find(".bet-amount");
            ui.helper.data("dropped", true).remove();
            addChip(value, $amount);
        }
    });

    // ================= CARD FUNCTIONS =================
    function renderCarta(c) {
        const cor = (c.nipe==="♥"||c.nipe==="♦") ? "text-danger":"text-dark";
        return `
            <div class="carta col-auto mb-2">
                <div class="card border-dark bg-white text-center d-flex flex-column justify-content-between" style="width:5rem;height:7rem">
                    <div class="d-flex justify-content-start p-1"><span class="${cor} fw-bold">${c.val}${c.nipe}</span></div>
                    <div class="d-flex align-items-center justify-content-center flex-grow-1"><span class="${cor} fs-2">${c.nipe}</span></div>
                    <div class="d-flex justify-content-end p-1"><span class="${cor} fw-bold" style="transform:rotate(180deg)">${c.val}${c.nipe}</span></div>
                </div>
            </div>`;
    }

    function addDeck(data){
        $el.playerDeck.html(data.player.map(renderCarta).join(''));
        $el.bankerDeck.html(data.banker.map(renderCarta).join(''));
        ["#player","#banker"].forEach(id => $(`${id} .carta`).eq(2).css("box-shadow","none").addClass("rot90"));
    }

    function atualizarHistoricoBigRoad(array){
        $el.historico.empty();
        let lastType = null, $col;
        array.forEach(v => {
            if(v==='d' && $col){
                const $last = $col.children().last();
                let count = parseInt($last.attr("data-draws")||0)+1;
                $last.attr("data-draws",count).find(".draw-count").remove();
                $("<div>").addClass("draw-count").text(count).css({
                    position:"absolute", top:"-12px", left:"50%", transform:"translateX(-50%)",
                    color:"green", "font-size":"10px", "font-weight":"bold"
                }).appendTo($last);
                return;
            }
            if(v!==lastType){
                $col = $("<div>").css({display:"flex","flex-direction":"column-reverse",gap:"5px","align-items":"center"});
                $el.historico.append($col);
                lastType = v;
            }
            $("<div>").addClass("bead").css({
                width:"20px", height:"20px", "border-radius":"50%", display:"flex",
                "align-items":"center","justify-content":"center", color:"#fff",
                "font-weight":"bold", position:"relative",
                "background-color":v==='b'?'red':v==='p'?'blue':'transparent'
            }).text(v.toUpperCase()).appendTo($col);
        });
        $el.historico.scrollLeft($el.historico[0].scrollWidth);
    }



    function log(msg){
        $el.log.append(`<div>${msg}</div>`);
        $el.log.scrollTop($el.log[0].scrollHeight);
    }

    socket.on('connect', () => { 
        $el.status.text("Conectado"); 
        socket.emit("joinRoom",$roomName); 
        log(`✅ Conectado (ID:${socket.id})`) 
    });
    socket.on('disconnect', ()=> $el.status.text("Desconectado"));
    socket.on('connect_error', err => $el.status.text(`Erro: ${err.message}`));
    socket.on('reconnect_attempt', a => $el.status.text(`Reconectando... #${a}`));
    socket.on('history', data => {
        myHistorico.push(...data);
        atualizarHistoricoBigRoad(myHistorico.map(c=>c.vencedor));
        $el.history.html(data.map(r=>`<b>${r.vencedor}</b>`).join(''));
        log(`📜 Histórico carregado (${data.length})`);
    });
    socket.on('newResult', data => {
        addDeck(data);
        myHistorico.push(data);
        atualizarHistoricoBigRoad(myHistorico.map(c=>c.vencedor));
        setTimeout(()=>{$el.playerDeck.empty(); $el.bankerDeck.empty();},4000);
        log(`🎲 Novo resultado ${data.vencedor}`);
    });
    socket.on('betAceira', data=>{console.log("bet aceita");});
    socket.on('round', addDeck);
    socket.on('tempo', data => $el.tempo.text(data));
    socket.on('status', data => $el.status.text(data));
    socket.on('error', data => $el.error.text(data.error||data));
});
