$(function() {
  const params = new URLSearchParams(window.location.search);
  const $roomName = params.get('room');
  const url = "https://cassinoserver-production.up.railway.app";
  const socket = io(url);
  var myHistorico = [];
  
  const $history = $('#history');
  const $status = $('#status');
  const $error = $('#error');
  
  const $playerDeck = $('#player');
  const $bankerDeck = $('#banker');
  const $historico = $("#historico");
  
  const $log = $('#log');
  const $tempo = $('#tempo');
  
  function AddDeck(data)
  {
    $playerDeck.html("");
    $bankerDeck.html("");
    
    // Adiciona no container $round
    $playerDeck.append(data.player.map(c => renderCarta(c)));
    $bankerDeck.append(data.banker.map(c => renderCarta(c)));
    
    // Adiciona a classe rot90 na terceira carta
    $("#player .carta").eq(2).css({ "box-shadow": "none" }).addClass("rot90").prependTo("#player");
    $("#banker .carta").eq(2).css({ "box-shadow": "none" }).addClass("rot90").appendTo("#banker");
    
  }
  
  function atualizarHistoricoBigRoad(array) {
    //const $historico = $("#historico");
    $historico.empty();
    
    let lastType = null;
    let $col = null;
    
    $.each(array, function(i, v) {
      if (v === 'd') {
        if ($col) {
          const $lastBead = $col.children().last();
          $lastBead.css("position", "relative");
          
          // Atualiza contador
          let count = parseInt($lastBead.attr("data-draws") || "0");
          count++;
          $lastBead.attr("data-draws", count);
          
          // Remove contador antigo se existir
          $lastBead.find(".draw-count").remove();
          
          // Adiciona traço ou número verde acima da bola
          const $counter = $("<div></div>").addClass("draw-count").text(count)
            .css({
              position: "absolute",
              top: "-12px",
              left: "50%",
              transform: "translateX(-50%)",
              color: "green",
              "font-size": "10px",
              "font-weight": "bold"
            });
          $lastBead.append($counter);
        }
      } else {
        if (v !== lastType) {
          $col = $("<div></div>").css({
            display: "flex",
            "flex-direction": "column-reverse",
            gap: "5px",
            "align-items": "center"
          });
          $historico.append($col);
          lastType = v;
        }
        
        const $bead = $("<div></div>").addClass("bead").css({
          width: "20px",
          height: "20px",
          "border-radius": "50%",
          display: "flex",
          "align-items": "center",
          "justify-content": "center",
          color: "#fff",
          "font-weight": "bold",
          position: "relative"
        }).text(v.toUpperCase());
        
        if (v === 'b') $bead.css("background-color", "red");
        if (v === 'p') $bead.css("background-color", "blue");
        
        $col.append($bead);
      }
    });
    
    $historico.scrollLeft($historico[0].scrollWidth);
  }
  
  
  
  function renderCarta(carta) {
    const cor = (carta.nipe === "♥" || carta.nipe === "♦") ? "text-danger" : "text-dark";
    return `
        <div class="carta col-auto mb-2">
          <div class="card border-dark bg-white text-center d-flex flex-column justify-content-between" style="width: 5rem; height: 7rem;">
            <!-- Topo esquerdo -->
            <div class="d-flex justify-content-start p-1">
              <span class="${cor} fw-bold">${carta.val}${carta.nipe}</span>
            </div>
            <!-- Centro -->
            <div class="d-flex align-items-center justify-content-center flex-grow-1">
              <span class="${cor} fs-2">${carta.nipe}</span>
            </div>
            <!-- Base direita -->
            <div class="d-flex justify-content-end p-1">
              <span class="${cor} fw-bold" style="transform: rotate(180deg);">${carta.val}${carta.nipe}</span>
            </div>
          </div>
        </div>
      `;
  }
  
  
  
  
  function log(msg)
  {
    $log.append(`<div>${msg}</div>`);
    $log.scrollTop($log[0].scrollHeight); // rola sempre pro final
  }
  
  // Recebe histórico completo da sala
  socket.on('history', data => {
    // myHistorico=data;
    data.forEach(r => myHistorico.push(r));
    
    atualizarHistoricoBigRoad(myHistorico.map(c => c.vencedor));
    
    $history.empty();
    data.forEach(r => $history.append(`<b>${r.vencedor} </b>`));
    log("📜 Histórico carregado (" + data.length + " itens)");
  });
  
  // Recebe novos resultados
  socket.on('newResult', data => {
    
    //add carta
    AddDeck(data);
    
    //atualização do histórico 
    myHistorico.push(data);
    atualizarHistoricoBigRoad(myHistorico.map(c => c.vencedor));
    
    setTimeout(() => {
      $playerDeck.empty();
      $bankerDeck.empty();
    }, 4000);
    
    log("🎲 Novo resultado" + data.vencedor);
  });
  
  // Atualiza status da sala
  socket.on('status', data => {
    $status.text(data);
    //log("ℹ️ Status: " + data);
  });
  
  socket.on('round', data => {
    AddDeck(data);
    
    
    // console.log("Round:", data);
  });
  
  
  socket.on('tempo', data => {
    $tempo.text(data);
    // log("ℹ️ Status: " + data);
  });
  
  // Exibe erros
  socket.on('error', data => {
    $error.text(data.error || 'Erro desconhecido');
    // log("❌ Erro: " + (data.error || 'Erro desconhecido'));
  });
  
  // Eventos de conexão
  socket.on("connect", () => {
    $status.text("Conectado");
    socket.emit("joinRoom", $roomName);
    log("✅ Conectado ao servidor (ID: " + socket.id + ")");
  });
  
  socket.on("connect_error", (err) => {
    $status.text("Erro");
    $error.text("Erro ao conectar: " + err.message);
    // log("❌ Erro de conexão: " + err.message);
  });
  
  socket.on("reconnect_attempt", (attempt) => {
    $status.text("Reconectando...");
    // log("🔄 Tentando reconectar... tentativa #" + attempt);
  });
  
  socket.on("disconnect", (reason) => {
    $status.text("Desconectado");
    //log("⚠️ Desconectado: " + reason);
  });
});