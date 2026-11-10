/**
 * NÚCLEO — estado da interface, janelas, cabeçalho, desenho da página e ações gerais
 */
'use strict';

/* ============================================================
 * REGISTROS DE TELAS E AÇÕES
 * ============================================================ */

/** Registros preenchidos pelos demais arquivos: V = telas, LST = listas com busca, A = ações de clique (data-a), F = envio de formulários (data-f), C = alterações de campos (data-c). */
const V = {},
  LST = {},
  A = {},
  F = {},
  C = {};

/* ============================================================
 * ESTADO DA INTERFACE
 * ============================================================ */

/** Estado temporário da tela (filtros, busca, período, carrinho aberto e formulário do carrinho). Não é salvo. */
const ui = {
  f: '',
  pf: '',
  q: '',
  hf: '',
  per: 'mes',
  sel: new Set(),
  cart: false,
  v: 'in',
  r: '',
  cb: null,
  ck: {
    tipo: 'Delivery',
    end: 0,
    pg: 'Pix',
    troco: false,
    valor: '',
    comp: '',
    cartao: 0,
    novo: '',
    novoEnd: '',
  },
};

/* ============================================================
 * NOTIFICAÇÕES E JANELAS
 * ============================================================ */

/** Mostra uma mensagem rápida na parte de baixo da tela. */
const toast = (m) => {
  const t = $('#toast');
  t.textContent = m;
  t.classList.add('on');
  clearTimeout(toast.h);
  toast.h = setTimeout(() => t.classList.remove('on'), 2800);
};

/** Monta o HTML de uma janela: título, botão de fechar e corpo. */
const mh = (t, b) =>
  `<div class="modal__cab"><h3>${t}</h3><button class="fechar" data-a="x" aria-label="Fechar">${ic('x')}</button></div><div class="modal__corpo">${b}</div>`;

/** Abre uma janela (modal) com o HTML informado e, opcionalmente, uma largura. */
const modal = (h, w = '') => {
  $('#mod').style.width = w;
  $('#mod').innerHTML = h;
  $('#mod').classList.add('open');
  $('#fundo').classList.add('open');
};

/** Janela de confirmação: executa a função informada se o usuário confirmar. */
const conf = (t, x, fn) => {
  ui.cb = fn;
  modal(
    mh(
      t,
      `<p class="nota">${x}</p><div class="acoes"><button class="btn btn--sec" data-a="x">Voltar</button><button class="btn btn--vermelho" data-a="ok">Confirmar</button></div>`,
    ),
  );
};

/* ============================================================
 * PEÇAS DE INTERFACE REUTILIZÁVEIS
 * ============================================================ */

/** Lista de <option>, em ordem alfabética, com uma opção selecionada. */
const opts = (a, cur) =>
  sb(a, (x) => x)
    .map((x) => `<option${x == cur ? ' selected' : ''}>${esc(x)}</option>`)
    .join('');

/** Alternador liga/desliga que dispara a alteração de dados (data-c). */
const sw = (c, id, on, l1, l0, ex = '') =>
  `<label class="troca"><input type="checkbox" data-c="${c}" data-id="${id}" ${on ? 'checked' : ''} ${ex}><span class="trilho"><span class="bola"></span></span><span class="st ${on ? 'on' : ''}">${on ? l1 : l0}</span></label>`;

/** Barra de pesquisa. */
const search = (ph) =>
  `<label class="busca">${ic('busca')}<input type="search" data-i="q" placeholder="${ph}" value="${esc(ui.q)}" aria-label="Buscar"></label>`;

/** Botões de filtro (chips) com a contagem opcional de itens. */
const chips = (a, cur, act, cnt) =>
  `<div class="filtros">${a.map(([v, l]) => `<button class="chip ${cur == v ? 'on' : ''}" data-a="${act}" data-v="${esc(v)}">${esc(l)}${cnt ? ` (${cnt(v)})` : ''}</button>`).join('')}</div>`;

/** Cabeçalho de uma página: título, subtítulo e ações à direita. */
const titulo = (t, s, x = '') =>
  `<div class="pagina-titulo"><div><h2>${t}</h2><p>${s}</p></div>${x}</div>`;

/* ============================================================
 * CABEÇALHO E DESENHO DA PÁGINA
 * ============================================================ */

/** Cabeçalho: marca, menu do perfil (centralizado), carrinho (só cliente), usuário e botão Sair. */
const header = (u, r) => {
  const n = Object.values(cart()).reduce((a, b) => a + b, 0);
  return `<header class="topo"><div class="topo__faixa"><div class="marca"><span class="marca__selo">F</span><div class="marca__texto"><h1>Fênix Casa dos Assados</h1><p>${SUB[u.perfil]}</p></div></div>
<nav class="nav-principal" aria-label="Navegação">${NAV[u.perfil].map(([k, l, i]) => `<a href="#${k}" ${k == r ? 'aria-current="page"' : ''}>${ic(i)}${l}</a>`).join('')}</nav>
<div class="topo__acoes">${u.perfil == 'cliente' ? `<button class="botao-icone" data-a="cart">${ic('carrinho')}<span>Carrinho</span>${n ? `<span class="badge-contador">${n}</span>` : ''}</button>` : ''}<div class="perfil-usuario"><span class="perfil-usuario__avatar">${ic('usuario')}</span><span class="perfil-usuario__texto"><strong>${esc(u.nome.split(' ')[0])}</strong><span>${PN[u.perfil]}</span></span></div><button class="botao-sair" data-a="sair">${ic('sair')}Sair</button></div></div></header>`;
};

/** Redesenha a tela inteira conforme o usuário logado e a rota (#hash), preservando a rolagem. */
function render() {
  const y = scrollY,
    ds = $('.drawer__b')?.scrollTop,
    u = me(),
    app = $('#app');
  if (!u || !u.ativo) {
    app.innerHTML = login();
    $('#fundo').classList.remove('open');
    return;
  }
  const nav = NAV[u.perfil];
  let r = location.hash.slice(1);
  if (!nav.some((n) => n[0] == r)) r = nav[0][0];
  ui.r = r;
  app.innerHTML =
    header(u, r) +
    `<main class="conteudo">${V[r](u)}</main>` +
    (u.perfil == 'cliente' ? drawer(u) : '');
  $('#fundo').classList.toggle('open', ui.cart || $('#mod').classList.contains('open'));
  scrollTo(0, y);
  if (ds) $('.drawer__b').scrollTop = ds;
}

/* ============================================================
 * AÇÕES GERAIS
 * ============================================================ */

/** Fecha janelas e carrinho. */
A.x = () => {
  ui.cart = false;
  ui.cb = null;
  $('#mod').classList.remove('open');
  render();
};

/** Confirma a ação pendente de uma janela de confirmação. */
A.ok = () => {
  const f = ui.cb;
  A.x();
  f && f();
};

/** Trocam o filtro ativo: categoria (f), perfil (pf), situação do histórico (hf) e período do dashboard (per). */
A.f = (el) => {
  ui.f = el.dataset.v;
  render();
};

A.pf = (el) => {
  ui.pf = el.dataset.v;
  render();
};

A.hf = (el) => {
  ui.hf = el.dataset.v;
  render();
};

A.per = (el) => {
  ui.per = el.dataset.v;
  render();
};

/** Navega para outra tela. */
A.go = (el) => {
  A.x();
  location.hash = el.dataset.to;
};
