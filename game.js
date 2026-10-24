
const flores = [
  { nome: "Rosa normal", preco: 10 },
  { nome: "Dália", preco: 15 },
  { nome: "Girassol", preco: 12 },
  { nome: "Flor de chocolate", preco: 13 },
  { nome: "Margarida", preco: 7 },
  { nome: "Plumeria", preco: 5 }
];

const embalagens = [
  { nome: "Normal", preco: 10 },
  { nome: "Coreana", preco: 12 },
  { nome: "Com detalhes", preco: 15 }
];


const papeis = [
  {
    nome: "Papel preto fosco com borda preta",
    cor: "linear-gradient(90deg, #252329 0%, #252329 78%, #080808 78%, #080808 100%)"
  },
  {
    nome: "Papel fosco preto com borda dourada",
    cor: "linear-gradient(90deg, #000000 0%, #000000 78%, #d6ad48 78%, #d6ad48 100%)"
  },
  {
    nome: "Poli sujinho preto com escritas",
    cor: "repeating-linear-gradient(135deg, #29252b 0px, #29252b 8px, #514952 9px, #29252b 11px)"
  },
  {
    nome: "Papel jornal",
    cor: "repeating-linear-gradient(0deg, #e5dccb 0px, #e5dccb 5px, #c7bba7 6px, #e5dccb 7px)"
  },
  {
    nome: "Papel fosco branco com borda branca",
    cor: "linear-gradient(90deg, #ffffff 0%, #ffffff 78%, #e9e5e8 78%, #e9e5e8 100%)"
  },
  {
    nome: "Poli sujinho branco com borda dourada",
    cor: "linear-gradient(90deg, repeating-linear-gradient(135deg, #ffffff 0px, #ffffff 6px, #e9e1e5 7px, #ffffff 9px) 0 0 / 78% 100% no-repeat, linear-gradient(90deg, #ffffff 0%, #ffffff 78%, #d6ad48 78%, #d6ad48 100%)"
  },
  {
    nome: "Papel fosco com duas camadas com bordas cor cobre",
    cor: "linear-gradient(90deg, #f5d6c8 0%, #f5d6c8 70%, #b87355 70%, #b87355 78%, #f5d6c8 78%, #f5d6c8 88%, #b87355 88%, #b87355 100%)"
  },
  {
    nome: "Papel fosco rosa com borda dourada",
    cor: "linear-gradient(90deg, #f5b6d1 0%, #f5b6d1 78%, #d6ad48 78%, #d6ad48 100%)"
  },
  {
    nome: "Papel fosco roxo com borda dourada",
    cor: "linear-gradient(90deg, #a783cf 0%, #a783cf 78%, #d6ad48 78%, #d6ad48 100%)"
  },
  {
    nome: "Papel fosco rosa escuro com borda rosa",
    cor: "linear-gradient(90deg, #c52d78 0%, #c52d78 78%, #f2a1c9 78%, #f2a1c9 100%)"
  }
];

const adicionais = ["Coroa", "Ursinho", "LED", "Laço especial"];

const taxaFixa = 20;
const precoBorboleta = 2.50;

const quantidades = {};
flores.forEach(flor => quantidades[flor.nome] = 0);

let embalagemSelecionada = "Normal";
let papelSelecionado = "Rosa claro";
let quantidadeBorboletas = 0;
const adicionaisSelecionados = new Set();

const $ = id => document.getElementById(id);

const dinheiro = valor => valor.toLocaleString("pt-BR", {
  style: "currency",
  currency: "BRL"
});

function montarFlores() {
  $("listaFlores").innerHTML = flores.map((flor, i) => `
    <div class="flor-item">
      <div>
        <strong>${flor.nome}</strong>
        <small>${dinheiro(flor.preco)} por unidade</small>
      </div>
      <div class="controle">
        <button type="button" data-menos-flor="${i}" aria-label="Diminuir ${flor.nome}">−</button>
        <span id="qtd-flor-${i}">0</span>
        <button type="button" data-mais-flor="${i}" aria-label="Adicionar ${flor.nome}">+</button>
      </div>
    </div>
  `).join("");
}

function montarEmbalagens() {
  $("opcoesEmbalagem").innerHTML = embalagens.map(item => `
    <label class="opcao-card ${item.nome === embalagemSelecionada ? "selecionada" : ""}">
      <input type="radio" name="embalagem" value="${item.nome}"
        ${item.nome === embalagemSelecionada ? "checked" : ""}>
      <span>${item.nome} — ${dinheiro(item.preco)}</span>
    </label>
  `).join("");
}

function montarPapeis() {
  $("opcoesPapel").innerHTML = papeis.map(papel => `
    <label class="opcao-card ${papel.nome === papelSelecionado ? "selecionada" : ""}">
      <input type="radio" name="papel" value="${papel.nome}"
        ${papel.nome === papelSelecionado ? "checked" : ""}>
      <span class="bolinha-papel" style="background:${papel.cor}"></span>
      <span>${papel.nome}</span>
    </label>
  `).join("");
}

function montarAdicionais() {
  $("opcoesAdicionais").innerHTML = adicionais.map(nome => `
    <label class="opcao-card">
      <input type="checkbox" value="${nome}">
      <span>${nome}</span>
    </label>
  `).join("");
}

function atualizarSelecoes() {
  document.querySelectorAll(".opcao-card").forEach(card => {
    const input = card.querySelector("input");
    if (input) card.classList.toggle("selecionada", input.checked);
  });
}

function atualizarResumo() {
  let totalFlores = 0;
  const linhas = [];

  flores.forEach((flor, i) => {
    const qtd = quantidades[flor.nome];
    const subtotal = qtd * flor.preco;
    totalFlores += subtotal;

    $(`qtd-flor-${i}`).textContent = qtd;

    if (qtd > 0) {
      linhas.push(`
        <div class="linha-resumo">
          <span>${flor.nome} × ${qtd}</span>
          <strong>${dinheiro(subtotal)}</strong>
        </div>
      `);
    }
  });

  const embalagem = embalagens.find(item => item.nome === embalagemSelecionada);
  const totalEmbalagem = embalagem.preco;
  const totalBorboletas = quantidadeBorboletas * precoBorboleta;
  const total = totalFlores + totalEmbalagem + totalBorboletas + taxaFixa;

  $("resumoFlores").innerHTML = linhas.length
    ? linhas.join("")
    : "Nenhuma flor selecionada ainda.";

  $("resumoEmbalagem").textContent = embalagemSelecionada;
  $("resumoPapel").textContent = papelSelecionado;
  $("resumoBorboletas").textContent = quantidadeBorboletas;
  $("resumoAdicionais").textContent =
    [...adicionaisSelecionados].join(", ") || "Nenhum";

  $("qtdBorboletas").textContent = quantidadeBorboletas;
  $("valorFlores").textContent = dinheiro(totalFlores);
  $("valorEmbalagem").textContent = dinheiro(totalEmbalagem);
  $("valorBorboletas").textContent = dinheiro(totalBorboletas);
  $("valorTaxa").textContent = dinheiro(taxaFixa);
  $("precoTotal").textContent = dinheiro(total);

  $("resumoMensagem").textContent =
    $("mensagem").value.trim() || "Sua mensagem aparecerá aqui.";

  $("caracteres").textContent = $("mensagem").value.length;

  $("nomeFoto").textContent = $("foto").files.length
    ? `Foto selecionada: ${$("foto").files[0].name}`
    : "Nenhuma foto selecionada.";

  atualizarSelecoes();
}

document.addEventListener("click", event => {
  const maisFlor = event.target.closest("[data-mais-flor]");
  const menosFlor = event.target.closest("[data-menos-flor]");

  if (maisFlor) {
    const flor = flores[Number(maisFlor.dataset.maisFlor)];
    quantidades[flor.nome]++;
    atualizarResumo();
  }

  if (menosFlor) {
    const flor = flores[Number(menosFlor.dataset.menosFlor)];
    quantidades[flor.nome] = Math.max(0, quantidades[flor.nome] - 1);
    atualizarResumo();
  }

  if (event.target.closest("[data-mais-borboletas]")) {
    quantidadeBorboletas++;
    atualizarResumo();
  }

  if (event.target.closest("[data-menos-borboletas]")) {
    quantidadeBorboletas = Math.max(0, quantidadeBorboletas - 1);
    atualizarResumo();
  }
});

document.addEventListener("change", event => {
  const alvo = event.target;

  if (alvo.name === "embalagem") {
    embalagemSelecionada = alvo.value;
  }

  if (alvo.name === "papel") {
    papelSelecionado = alvo.value;
  }

  if (alvo.type === "checkbox" && adicionais.includes(alvo.value)) {
    if (alvo.checked) {
      adicionaisSelecionados.add(alvo.value);
    } else {
      adicionaisSelecionados.delete(alvo.value);
    }
  }

  atualizarResumo();
});

$("mensagem").addEventListener("input", atualizarResumo);
$("foto").addEventListener("change", atualizarResumo);


$("finalizar").addEventListener("click", () => {
  const floresEscolhidas = flores
    .filter(flor => quantidades[flor.nome] > 0)
    .map(flor =>
      `${quantidades[flor.nome]}x ${flor.nome} — ${dinheiro(
        quantidades[flor.nome] * flor.preco
      )}`
    );

  const embalagem = embalagens.find(
    item => item.nome === embalagemSelecionada
  );

  const totalFlores = flores.reduce(
    (soma, flor) =>
      soma + quantidades[flor.nome] * flor.preco,
    0
  );

  const totalEmbalagem = embalagem.preco;
  const totalBorboletas = quantidadeBorboletas * precoBorboleta;

  const total =
    totalFlores + totalEmbalagem + totalBorboletas + taxaFixa;

  const mensagem = $("mensagem").value.trim();
  const temFoto = $("foto").files.length > 0;

  const pedido = [
    "🌷 *PEDIDO DE BUQUÊ — CARLA TARAS*",
    "",
    "*Flores:*",
    ...(floresEscolhidas.length
      ? floresEscolhidas
      : ["Nenhuma flor selecionada"]),
    "",
    `🎀 *Embalagem:* ${embalagemSelecionada} — ${dinheiro(totalEmbalagem)}`,
    `🩷 *Papel:* ${papelSelecionado}`,
    `🦋 *Borboletas:* ${quantidadeBorboletas} — ${dinheiro(totalBorboletas)}`,
    `✨ *Adicionais:* ${[...adicionaisSelecionados].join(", ") || "Nenhum"}`,
    "",
    `💌 *Mensagem:* ${mensagem || "Não informada"}`,
    `📷 *Foto personalizada:* ${temFoto ? "Sim, vou enviar pelo WhatsApp" : "Não"}`,
    "",
    `🌹 *Subtotal das flores:* ${dinheiro(totalFlores)}`,
    `🎀 *Embalagem:* ${dinheiro(totalEmbalagem)}`,
    `🦋 *Borboletas:* ${dinheiro(totalBorboletas)}`,
    `🧾 *Taxa fixa:* ${dinheiro(taxaFixa)}`,
    `💗 *TOTAL CALCULADO: ${dinheiro(total)}*`,
    "",
    "Gostaria de confirmar meu pedido! 🩷",
    "Se houver adicionais sem preço definido, por favor, me informe o valor final."
  ].join("\n");

  const telefone = "554284328377";
  const linkWhatsApp =
    `https://wa.me/${telefone}?text=${encodeURIComponent(pedido)}`;

  window.open(linkWhatsApp, "_blank");
});


montarFlores();
montarEmbalagens();
montarPapeis();
montarAdicionais();
atualizarResumo();
