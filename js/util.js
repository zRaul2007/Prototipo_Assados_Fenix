/**
 * UTILITÁRIOS — funções de apoio e regras de negócio compartilhadas
 */
'use strict';

/* ============================================================
 * FUNÇÕES DE APOIO: SELEÇÃO, FORMATAÇÃO E TEXTO
 * ============================================================ */

/** Atalho para document.querySelector. */
const $ = (s, e = document) => e.querySelector(s);

/** Formata um número como moeda (R$ 0,00). */
const R = (n) => 'R$ ' + (+n).toFixed(2).replace('.', ',');

/** Escapa texto antes de inseri-lo no HTML, evitando injeção de código. */
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => '&#' + c.charCodeAt(0) + ';');

/** Gera o HTML de um ícone do conjunto de ícones da página. */
const ic = (n) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><use href="#i-${n}"/></svg>`;

/** Comparação alfabética em português (al) e ordenação de uma lista por um campo (sb). */
const al = (a, b) => a.localeCompare(b, 'pt', { sensitivity: 'base' }),
  sb = (a, f) => [...a].sort((x, y) => al(f(x), f(y)));

/** Normaliza texto para buscas: sem acentos e em minúsculas. */
const norm = (s) =>
  String(s)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

/** Troca a rota (#hash) sem criar histórico; se o navegador não permitir, usa location.hash. */
const setHash = (r) => {
  try {
    history.replaceState(null, '', '#' + r);
  } catch (e) {
    location.hash = r;
  }
};

/* ============================================================
 * ACESSO AOS DADOS E REGRAS DE NEGÓCIO
 * ============================================================ */

/** Atalhos de consulta: usuário logado (me), categoria (cat), produto (prod) e pedido (ord). */
const me = () => S.users.find((u) => u.id === S.sess),
  cat = (n) => S.cats.find((c) => c.n === n) || { subs: [] },
  prod = (id) => S.prods.find((p) => p.id == id),
  ord = (id) => S.orders.find((o) => o.id == id);

/** Um produto está disponível se tiver estoque (categorias com estoque) ou se estiver marcado como disponível. */
const avail = (p) => (cat(p.c).est ? p.est > 0 : p.disp);

/** Total de um pedido: itens mais taxa de entrega. */
const tot = (o) => o.itens.reduce((a, i) => a + i.p * i.q, 0) + o.taxa;

/** Carrinho do usuário logado, no formato { idDoProduto: quantidade }. */
const cart = () => (S.carts[S.sess] = S.carts[S.sess] || {});

/** Ícone de uma categoria. */
const cIc = (c) => (c.est ? 'copo' : c.n == 'Guarnições' ? 'tigela' : 'fogo');

/** Escolhe uma das três cores de fundo das miniaturas a partir do nome da categoria. */
const kc = (n) => 'k' + ([...n].reduce((a, x) => a + x.charCodeAt(0), 0) % 3);

/** Nome do cliente de um pedido. */
const nome = (id) => (S.users.find((u) => u.id == id) || { nome: 'Cliente' }).nome;

/** Ícone da modalidade do pedido (delivery ou retirada). */
const tIc = (t) => (t == 'Delivery' ? 'moto' : 'balcao');

/** Resumo textual dos itens de um pedido. */
const itens = (o) => o.itens.map((i) => `${i.q}x ${i.n}`).join(' · ');

/** Tempo decorrido em formato curto ("há 5 min", data...). */
const ago = (t) => {
  const m = Math.round((Date.now() - t) / 6e4);
  return m < 1
    ? 'agora'
    : m < 60
      ? `há ${m} min`
      : m < 1440
        ? `há ${Math.round(m / 60)} h`
        : new Date(t).toLocaleDateString('pt-BR');
};

/** Etiquetas de modalidade, pagamento e troco de um pedido. */
const tags = (o) =>
  `<span class="tag-op">${ic(tIc(o.tipo))}${o.tipo}</span><span class="tag-op">${ic(PG[o.pg])}${o.pg}</span>${o.troco ? `<span class="tag-op info">Troco p/ ${R(o.troco)}</span>` : ''}`;

/** Estoque: dá baixa (sinal -1) ou estorna (sinal +1) os produtos controlados por estoque de um pedido e registra a movimentação. */
function baixa(o, sg) {
  o.itens.forEach((i) => {
    const p = prod(i.pid);
    if (p && cat(p.c).est) {
      p.est += sg * i.q;
      S.mov.unshift({
        t: Date.now(),
        txt: `${sg < 0 ? 'Baixa automática' : 'Estorno automático'} — Pedido #${o.id} (${i.n})`,
        v: sg * i.q,
      });
    }
  });
}

/** Cancela um pedido e devolve os produtos ao estoque. */
function cancel(o) {
  if (o.st == 'Cancelado' || o.st == 'Entregue') return;
  baixa(o, 1);
  o.st = 'Cancelado';
  save();
  render();
  toast('Pedido cancelado.');
}
