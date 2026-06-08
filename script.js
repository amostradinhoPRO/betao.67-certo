// ===== DADOS DOS JOGOS =====
const jogos = [
  {
    id: 1, esporte: "futebol", liga: "Brasileirão Série A", ao_vivo: true,
    time1: { nome: "Flamengo", emoji: "🦅" },
    time2: { nome: "Palmeiras", emoji: "🐷" },
    placar: "1 × 0",
    odds: { casa: 2.10, empate: 3.25, fora: 3.80 }
  },
  {
    id: 2, esporte: "futebol", liga: "Premier League", ao_vivo: false,
    time1: { nome: "Manchester City", emoji: "🔵" },
    time2: { nome: "Arsenal", emoji: "🔴" },
    placar: null,
    odds: { casa: 1.75, empate: 3.60, fora: 4.50 }
  },
  {
    id: 3, esporte: "basquete", liga: "NBA", ao_vivo: true,
    time1: { nome: "Lakers", emoji: "💜" },
    time2: { nome: "Warriors", emoji: "💛" },
    placar: "68 × 71",
    odds: { casa: 1.95, empate: null, fora: 1.90 }
  },
  {
    id: 4, esporte: "futebol", liga: "Champions League", ao_vivo: false,
    time1: { nome: "Real Madrid", emoji: "⚪" },
    time2: { nome: "Barcelona", emoji: "🔵" },
    placar: null,
    odds: { casa: 2.30, empate: 3.10, fora: 3.20 }
  },
  {
    id: 5, esporte: "tenis", liga: "ATP Masters", ao_vivo: true,
    time1: { nome: "Alcaraz", emoji: "🇪🇸" },
    time2: { nome: "Djokovic", emoji: "🇷🇸" },
    placar: "6-4 | 3-5",
    odds: { casa: 2.05, empate: null, fora: 1.82 }
  },
  {
    id: 6, esporte: "futebol", liga: "Copa do Brasil", ao_vivo: false,
    time1: { nome: "Corinthians", emoji: "⚫" },
    time2: { nome: "São Paulo", emoji: "🔴" },
    placar: null,
    odds: { casa: 2.40, empate: 3.05, fora: 2.90 }
  },
];

// ===== ESTADO DA APOSTA =====
let apostas = [];
let filtroAtivo = "todos";

// ===== RENDERIZAR CARDS =====
function renderCards(filtro = "todos") {
  const grid = document.getElementById("cardsGrid");
  grid.innerHTML = "";

  const lista = filtro === "todos" ? jogos : jogos.filter(j => j.esporte === filtro);

  lista.forEach((jogo, i) => {
    const temEmpate = jogo.odds.empate !== null;

    const card = document.createElement("div");
    card.className = "game-card";
    card.style.animationDelay = `${i * 0.08}s`;

    card.innerHTML = `
      <div class="card-header">
        <span class="card-league">${jogo.liga}</span>
        ${jogo.ao_vivo ? '<span class="card-live">🔴 Ao Vivo</span>' : '<span style="font-size:.75rem;color:var(--text2)">Em breve</span>'}
      </div>
      <div class="card-body">
        <div class="team">
          <span class="team-emoji">${jogo.time1.emoji}</span>
          <span class="team-name">${jogo.time1.nome}</span>
        </div>
        <div class="vs">
          ${jogo.placar ? `<div class="placar">${jogo.placar}</div>` : '<span>VS</span>'}
        </div>
        <div class="team">
          <span class="team-emoji">${jogo.time2.emoji}</span>
          <span class="team-name">${jogo.time2.nome}</span>
        </div>
      </div>
      <div class="card-odds">
        <button class="odd-btn" onclick="selecionarOdd(${jogo.id}, '${jogo.time1.nome}', ${jogo.odds.casa}, this)">
          <span class="odd-label">1</span>
          <span class="odd-val">${jogo.odds.casa.toFixed(2)}</span>
        </button>
        ${temEmpate
          ? `<button class="odd-btn" onclick="selecionarOdd(${jogo.id}, 'Empate', ${jogo.odds.empate}, this)">
              <span class="odd-label">X</span>
              <span class="odd-val">${jogo.odds.empate.toFixed(2)}</span>
            </button>`
          : `<button class="odd-btn" style="opacity:.35;cursor:not-allowed;" disabled>
              <span class="odd-label">X</span>
              <span class="odd-val">—</span>
            </button>`
        }
        <button class="odd-btn" onclick="selecionarOdd(${jogo.id}, '${jogo.time2.nome}', ${jogo.odds.fora}, this)">
          <span class="odd-label">2</span>
          <span class="odd-val">${jogo.odds.fora.toFixed(2)}</span>
        </button>
      </div>
    `;

    grid.appendChild(card);
  });
}

// ===== FILTROS =====
document.querySelectorAll(".filtro").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filtro").forEach(b => b.classList.remove("ativo"));
    btn.classList.add("ativo");
    filtroAtivo = btn.dataset.filtro;
    renderCards(filtroAtivo);
    // re-marcar odds já selecionadas
    remarcarOdds();
  });
});

function remarcarOdds() {
  apostas.forEach(ap => {
    document.querySelectorAll(".odd-btn").forEach(btn => {
      const val = btn.querySelector(".odd-val")?.textContent;
      const label = btn.closest(".game-card")?.querySelector(".team-name");
      if (val === ap.odd.toFixed(2)) btn.classList.add("selected");
    });
  });
}

// ===== SELECIONAR ODD =====
function selecionarOdd(jogoId, resultado, odd, btn) {
  const idx = apostas.findIndex(a => a.jogoId === jogoId);

  // Remove odd anterior do mesmo jogo
  if (idx !== -1) {
    apostas.splice(idx, 1);
    // remove visual selected do mesmo card
    btn.closest(".game-card").querySelectorAll(".odd-btn").forEach(b => b.classList.remove("selected"));
  }

  // Toggle: se clicar no mesmo, desseleciona
  if (!btn.classList.contains("selected")) {
    apostas.push({ jogoId, resultado, odd });
    btn.classList.add("selected");
  }

  renderBilhete();
}

// ===== MODAL =====
function abrirModal() {
  document.getElementById("modalOverlay").classList.add("aberto");
  renderBilhete();
}

function fecharModal() {
  document.getElementById("modalOverlay").classList.remove("aberto");
  document.getElementById("modalMsg").textContent = "";
}

document.getElementById("modalOverlay").addEventListener("click", e => {
  if (e.target === document.getElementById("modalOverlay")) fecharModal();
});

// ===== BILHETE =====
function renderBilhete() {
  const bilhete = document.getElementById("bilhete");
  if (apostas.length === 0) {
    bilhete.innerHTML = '<p class="bilhete-vazio">Nenhuma aposta selecionada.</p>';
    return;
  }

  bilhete.innerHTML = apostas.map(ap => {
    const jogo = jogos.find(j => j.id === ap.jogoId);
    return `
      <div class="aposta-item">
        <div>
          <div style="font-size:.75rem;color:var(--text2)">${jogo.liga}</div>
          <div>${jogo.time1.nome} × ${jogo.time2.nome}</div>
          <div style="font-size:.8rem;color:var(--text2)">→ ${ap.resultado}</div>
        </div>
        <div style="display:flex;align-items:center;gap:.75rem">
          <span class="odd-val">${ap.odd.toFixed(2)}</span>
          <button class="remover-aposta" onclick="removerAposta(${ap.jogoId})">✕</button>
        </div>
      </div>
    `;
  }).join("");
}

function removerAposta(jogoId) {
  apostas = apostas.filter(a => a.jogoId !== jogoId);
  // remove visual
  document.querySelectorAll(".odd-btn.selected").forEach(btn => {
    const card = btn.closest(".game-card");
    // encontra o card pelo id do jogo não é trivial; remove todos do filtro atual por segurança
  });
  renderCards(filtroAtivo);
  renderBilhete();
  // re-marcar os que sobraram
  setTimeout(() => {
    apostas.forEach(ap => {
      document.querySelectorAll(".odd-btn").forEach(btn => {
        const val = parseFloat(btn.querySelector(".odd-val")?.textContent);
        if (val === ap.odd) btn.classList.add("selected");
      });
    });
  }, 50);
}

// ===== CONFIRMAR APOSTA =====
function confirmarAposta() {
  const msg = document.getElementById("modalMsg");
  const valor = parseFloat(document.getElementById("valorAposta").value);

  if (apostas.length === 0) {
    msg.style.color = "#ef4444";
    msg.textContent = "❌ Adicione pelo menos um jogo ao bilhete.";
    return;
  }

  if (!valor || valor < 5) {
    msg.style.color = "#ef4444";
    msg.textContent = "❌ Valor mínimo de aposta: R$ 5,00.";
    return;
  }

  const odd_total = apostas.reduce((acc, a) => acc * a.odd, 1);
  const retorno = (valor * odd_total).toFixed(2);

  msg.style.color = "#16a34a";
  msg.textContent = `✅ Aposta de R$ ${valor.toFixed(2)} confirmada! Retorno potencial: R$ ${retorno}`;

  setTimeout(() => {
    apostas = [];
    renderCards(filtroAtivo);
    renderBilhete();
    msg.textContent = "";
    fecharModal();
  }, 2500);
}

// ===== DARK MODE =====
const darkToggle = document.getElementById("darkToggle");
const body = document.body;

// Salvar preferência
if (localStorage.getItem("tema") === "dark") {
  body.classList.replace("light-mode", "dark-mode");
  darkToggle.textContent = "☀️";
}

darkToggle.addEventListener("click", () => {
  if (body.classList.contains("dark-mode")) {
    body.classList.replace("dark-mode", "light-mode");
    darkToggle.textContent = "🌙";
    localStorage.setItem("tema", "light");
  } else {
    body.classList.replace("light-mode", "dark-mode");
    darkToggle.textContent = "☀️";
    localStorage.setItem("tema", "dark");
  }
});

// ===== HAMBURGER MENU =====
document.getElementById("hamburger").addEventListener("click", () => {
  document.getElementById("navLinks").classList.toggle("open");
});

// fechar menu ao clicar num link
document.querySelectorAll(".nav-item").forEach(link => {
  link.addEventListener("click", () => {
    document.getElementById("navLinks").classList.remove("open");
  });
});

// ===== NAV ATIVO AO SCROLLAR =====
const sections = document.querySelectorAll("section[id]");
const navItems = document.querySelectorAll(".nav-item");

window.addEventListener("scroll", () => {
  let atual = "";
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) atual = sec.id;
  });
  navItems.forEach(item => {
    item.classList.toggle("active", item.getAttribute("href") === `#${atual}`);
  });
});

// ===== FORMULÁRIO CONTATO =====
document.getElementById("formContato").addEventListener("submit", function(e) {
  e.preventDefault();
  const fb = document.getElementById("formFeedback");
  fb.style.color = "#16a34a";
  fb.textContent = "✅ Mensagem enviada com sucesso! Retornaremos em breve.";
  this.reset();
  setTimeout(() => { fb.textContent = ""; }, 4000);
});

// ===== CONTAGEM ANIMADA (hero stats) =====
function animarContagem() {
  document.querySelectorAll(".stat-num").forEach(el => {
    const target = parseInt(el.dataset.target);
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) { current = target; clearInterval(timer); }
      el.textContent = Math.floor(current).toLocaleString("pt-BR");
    }, 16);
  });
}

// Disparar ao entrar na viewport
const heroObs = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) {
    animarContagem();
    heroObs.disconnect();
  }
}, { threshold: 0.3 });
heroObs.observe(document.querySelector(".hero-stats"));

// ===== INIT =====
renderCards();
