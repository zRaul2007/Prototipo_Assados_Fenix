/**
 * CLIENTE — cardápio, carrinho, meu pedido e histórico
 */
'use strict';

/* ============================================================
 * CARDÁPIO
 * ============================================================ */

/** Controle de quantidade (− 1 +). */
const stepper = (id, q) =>
  `<div class="step"><button data-a="dec" data-id="${id}" aria-label="Diminuir">−</button><span>${q}</span><button data-a="inc" data-id="${id}" aria-label="Aumentar">+</button></div>`;

/** Cartão de um produto do cardápio. */
const pCard = (p) => {
  const q = cart()[p.id] || 0,
    ok = avail(p);
  return `<article class="pc ${ok ? '' : 'off'}"><div class="thumb ${kc(p.c)}">${ic(cIc(cat(p.c)))}${ok ? '' : '<span class="tag">Esgotado</span>'}</div><div class="pc__b"><small>${esc(p.s)}</small><h4>${esc(p.n)}</h4><p>${esc(p.d)}</p><div class="pc__f"><b>${R(p.p)}</b>${!ok ? '<button class="btn btn--sec sm" disabled>Indisponível</button>' : q ? stepper(p.id, q) : `<button class="btn btn--amarelo sm" data-a="add" data-id="${p.id}">${ic('mais')}Adicionar</button>`}</div></div></article>`;
};

/** Tela Cardápio: destaque, filtros por categoria e produtos em ordem alfabética. */
V.cardapio = () => {
  const cs = sb(S.cats, (c) => c.n);
  return `<section class="hero"><span class="aberto"><i></i>Aberto agora · fecha às 23h</span><h2>Sabor de <em>brasa</em>, direto na sua mesa</h2><p>Escolha os itens, monte o carrinho e finalize com poucos toques. Entregamos em Santa Branca e região.</p></section>${chips([['', 'Todos'], ...cs.map((c) => [c.n, c.n])], ui.f, 'f')}${cs
    .filter((c) => !ui.f || c.n == ui.f)
    .map((c) => {
      const ps = sb(
        S.prods.filter((p) => p.c == c.n),
        (p) => p.n,
      );
      return ps.length
        ? `<section class="bloco"><h3>${ic(cIc(c))}${esc(c.n)}</h3><div class="grade-prod">${ps.map(pCard).join('')}</div></section>`
        : '';
    })
    .join('')}`;
};

/* ============================================================
 * CARRINHO
 * ============================================================ */

/** Opção selecionável (botão de rádio estilizado) do carrinho. */
const rad = (k, v, l, on) =>
  `<label class="pill ${on ? 'on' : ''}"><input type="radio" name="${k}" ${on ? 'checked' : ''} data-c="ckr" data-k="${k}" data-v="${v}">${l}</label>`;

/** Campo de texto do carrinho. */
const fld = (l, k, v, ph, ex = '') =>
  `<label class="f"><span>${l}</span><input data-c="ckt" data-k="${k}" value="${esc(v)}" placeholder="${ph}" ${ex}></label>`;

/** QR Code ilustrativo do Pix. Em produção ele é gerado pelo back-end com a chave Pix e o valor do pedido. */
const QR = (() => {
  let r = 11;
  const rn = () => (r = (r * 16807) % 2147483647) / 2147483647,
    n = 25,
    f = (x, y) => (x < 8 && y < 8) || (x > n - 9 && y < 8) || (x < 8 && y > n - 9);
  let d = '';
  for (let y = 0; y < n; y++)
    for (let x = 0; x < n; x++) {
      let on;
      if (f(x, y)) {
        const a = x < 8 ? x : x - (n - 8),
          b = y < 8 ? y : y - (n - 8);
        on =
          a < 7 &&
          b < 7 &&
          (a == 0 || a == 6 || b == 0 || b == 6 || (a > 1 && a < 5 && b > 1 && b < 5));
      } else on = rn() > 0.5;
      if (on) d += `M${x} ${y}h1v1h-1z`;
    }
  return `<svg viewBox="-2 -2 ${n + 4} ${n + 4}" shape-rendering="crispEdges"><rect x="-2" y="-2" width="${n + 4}" height="${n + 4}" fill="#fff"/><path d="${d}" fill="#0f0d0c"/></svg>`;
})();

/** Detalhes da forma de pagamento escolhida: QR Code (Pix), cartão ou troco (dinheiro). */
const pgPanel = (u, k) =>
  k.pg == 'Pix'
    ? `<div class="qr" role="img" aria-label="QR Code do Pix">${QR}</div>`
    : k.pg == 'Cartão'
      ? `<div class="painel"><div class="pills col1">${u.cartoes.map((c, i) => rad('cartao', i, esc(c), k.cartao == i)).join('')}${rad('cartao', -1, 'Novo cartão', k.cartao == -1)}</div>${k.cartao == -1 ? fld('Final do cartão (4 dígitos)', 'novo', k.novo, '0000', 'inputmode="numeric" maxlength="4"') : ''}</div>`
      : `<div class="painel"><p class="nota">Vai precisar de troco?</p><div class="pills">${rad('troco', 'nao', 'Não', !k.troco)}${rad('troco', 'sim', 'Sim', k.troco)}</div>${k.troco ? fld('Troco para quanto? (R$)', 'valor', k.valor, '100,00', 'inputmode="decimal"') : ''}</div>`;

/** Gaveta do carrinho: itens, entrega, endereço, pagamento e totais. */
function drawer(u) {
  const c = cart(),
    its = Object.keys(c)
      .map((id) => ({ p: prod(id), q: c[id] }))
      .filter((x) => x.p),
    k = ui.ck;
  if (k.end != -1 && !u.end[k.end]) k.end = u.end.length ? 0 : -1;
  if (k.cartao != -1 && !u.cartoes[k.cartao]) k.cartao = u.cartoes.length ? 0 : -1;
  const sub = its.reduce((a, x) => a + x.p.p * x.q, 0),
    del = k.tipo == 'Delivery',
    taxa = del ? (k.end >= 0 ? u.end[k.end].x : 8) : 0,
    n = its.reduce((a, x) => a + x.q, 0);
  return `<aside class="drawer ${ui.cart ? 'open' : ''}" aria-label="Carrinho"><div class="drawer__h"><h2>${ic('carrinho')}Carrinho <span class="pill-n">${n}</span></h2><button class="fechar" data-a="x" aria-label="Fechar carrinho">${ic('x')}</button></div><div class="drawer__b">
${
  its.length
    ? `${its.map((x) => `<div class="it"><span class="thumb ${kc(x.p.c)}">${ic(cIc(cat(x.p.c)))}</span><div class="info"><strong>${esc(x.p.n)}</strong><small>${R(x.p.p)} / un.</small>${stepper(x.p.id, x.q)}</div><button class="rm" data-a="rm" data-id="${x.p.id}" aria-label="Remover ${esc(x.p.n)}">${ic('lixeira')}</button></div>`).join('')}
<h4>Como você quer receber?</h4><div class="pills">${rad('tipo', 'Delivery', ic('moto') + 'Delivery', del)}${rad('tipo', 'Retirada', ic('balcao') + 'Retirar no balcão', !del)}</div>
${del ? `<h4>Entregar em</h4><div class="pills col1">${u.end.map((e, i) => rad('end', i, `<span><b>${esc(e.r)}</b><br>${esc(e.t)}</span>`, k.end == i)).join('')}${rad('end', -1, 'Outro endereço', k.end == -1)}</div>${k.end == -1 ? fld('Endereço (Santa Branca/SP)', 'novoEnd', k.novoEnd, 'Rua, número – bairro, Santa Branca/SP') : ''}` : ''}
<h4>Forma de pagamento</h4><div class="pills">${['Pix', 'Cartão', 'Dinheiro'].map((p) => rad('pg', p, p, k.pg == p)).join('')}</div>${pgPanel(u, k)}`
    : `<div class="vazio grande">${ic('carrinho')}<p>Seu carrinho está vazio.<br>Adicione itens do cardápio.</p></div>`
}</div>
<div class="drawer__f"><div class="lv"><span>Subtotal</span><span>${R(sub)}</span></div><div class="lv"><span>Taxa de entrega</span><span>${del ? R(taxa) : 'Grátis'}</span></div><div class="lv tt"><span>Total</span><span>${R(sub + taxa)}</span></div><button class="btn btn--amarelo w big" data-a="fin" ${its.length ? '' : 'disabled'}>Finalizar Pedido</button></div></aside>`;
}

/* ============================================================
 * MEU PEDIDO E HISTÓRICO
 * ============================================================ */

/** Cartão de acompanhamento de um pedido, com as etapas e o cancelamento (só enquanto "Recebido"). */
const trk = (o) => {
  const del = o.tipo == 'Delivery',
    E = ['Recebido', 'Em Preparo', del ? 'Em Rota' : 'Pronto p/ retirar', 'Entregue'],
    i = { Recebido: 0, 'Em Preparo': 1, Pronto: del ? 1 : 2, 'Em Rota': 2, Entregue: 3 }[o.st],
    ent = o.ent && S.users.find((x) => x.id == o.ent),
    av = (c, m) => `<p class="aviso ${c}">${ic(c ? 'check' : 'alerta')}${m}</p>`;
  return `<article class="card-p"><div class="card-p__t"><div><h3>Pedido #${o.id}</h3><small class="mut2">Feito ${ago(o.t)} · ${o.itens.length} ${o.itens.length > 1 ? 'itens' : 'item'}</small></div><span class="tag-op">${ic(tIc(o.tipo))}${o.tipo}</span></div>
<ol class="etapas">${E.map((e, k) => `<li class="${k < i ? 'ok' : k == i ? 'at' : ''}"><span>${k < i ? ic('check') : k + 1}</span>${e}</li>`).join('')}</ol>
${o.pg == 'Pix' && !o.pixOk ? av('', 'Aguardando a confirmação do pagamento via Pix. Envie o comprovante pelo WhatsApp do restaurante.') : ''}${o.st == 'Pronto' && !del ? av('ok', `Seu pedido está pronto! Venha buscar no balcão informando o número #${o.id}.`) : ''}${o.st == 'Pronto' && del ? av('', `Pedido pronto${ent ? `, aguardando ${esc(ent.nome.split(' ')[0])} retirar` : ' — aguardando entregador'}.`) : ''}${o.st == 'Em Rota' && ent ? av('ok', `${esc(ent.nome)} está a caminho com o seu pedido.`) : ''}
<div class="det">${o.itens.map((i) => `<div><span><b>${i.q}x</b> ${esc(i.n)}</span><span>${R(i.p * i.q)}</span></div>`).join('')}<div class="mut"><span>Taxa de entrega</span><span>${o.taxa ? R(o.taxa) : 'Grátis'}</span></div><div class="tt"><span>Total</span><span>${R(tot(o))}</span></div></div>
<p class="mut2">${ic(tIc(o.tipo))}${esc(o.end)} · Pagamento: ${o.pg}</p><div class="acoes">${o.st == 'Recebido' ? `<button class="btn btn--perigo" data-a="cancel" data-id="${o.id}">Cancelar pedido</button>` : `<span class="nota">O cancelamento só é possível enquanto o pedido está como “Recebido”.</span>`}</div></article>`;
};

/** Tela Meu Pedido: pedidos do cliente ainda em andamento. */
V.pedido = (u) => {
  const os = S.orders
    .filter((o) => o.uid == u.id && !['Entregue', 'Cancelado'].includes(o.st))
    .sort((a, b) => b.t - a.t);
  return (
    titulo('Meu Pedido', 'Acompanhe o andamento do seu pedido') +
    (os.length
      ? os.map(trk).join('')
      : `<div class="vazio grande">${ic('relogio')}<h3>Nenhum pedido em andamento</h3><p>Seu próximo pedido aparece aqui assim que for feito.</p><a class="btn btn--amarelo" href="#cardapio">Ver cardápio</a></div>`)
  );
};

/** Tela Histórico: pedidos entregues ou cancelados, com "Pedir novamente". */
V.historico = (u) => {
  const os = S.orders
      .filter((o) => o.uid == u.id && ['Entregue', 'Cancelado'].includes(o.st))
      .sort((a, b) => b.t - a.t),
    n = (s) => os.filter((o) => !s || o.st == s).length,
    l = os.filter((o) => !ui.hf || o.st == ui.hf);
  return (
    titulo('Histórico de Pedidos', 'Consulte seus pedidos anteriores') +
    chips(
      [
        ['', 'Todos'],
        ['Entregue', 'Entregues'],
        ['Cancelado', 'Cancelados'],
      ],
      ui.hf,
      'hf',
      n,
    ) +
    `<div class="lista">${l.map((o) => `<article class="row"><div class="info"><strong>#${o.id} · ${new Date(o.t).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}</strong><small>${esc(itens(o))}</small><div class="tags">${tags(o)}</div></div><span class="badge ${o.st == 'Entregue' ? 'b-on' : 'b-zero'}">${o.st == 'Entregue' ? 'Entregue' : 'Cancelado'}</span><span class="preco" ${o.st == 'Cancelado' ? 'style="text-decoration:line-through;color:var(--cinza-400)"' : ''}>${R(tot(o))}</span><button class="btn btn--amarelo sm" data-a="again" data-id="${o.id}">Pedir novamente</button></article>`).join('') || '<p class="vazio">Nenhum pedido encontrado.</p>'}</div>`
  );
};

/* ============================================================
 * AÇÕES DO CLIENTE
 * ============================================================ */

/** Abre o carrinho. */
A.cart = () => {
  ui.cart = true;
  render();
};

/** Acrescenta um item ao carrinho (respeitando o estoque). */
A.add = A.inc = (el) => {
  const p = prod(el.dataset.id),
    c = cart();
  if (cat(p.c).est && (c[p.id] || 0) >= p.est)
    return toast('Quantidade máxima disponível em estoque.');
  c[p.id] = (c[p.id] || 0) + 1;
  save();
  render();
};

/** Diminui a quantidade de um item. */
A.dec = (el) => {
  const c = cart(),
    id = el.dataset.id;
  if (--c[id] <= 0) delete c[id];
  save();
  render();
};

/** Remove um item do carrinho. */
A.rm = (el) => {
  delete cart()[el.dataset.id];
  save();
  render();
};

/** Pedir novamente: coloca no carrinho os itens de um pedido antigo que ainda estejam disponíveis. */
A.again = (el) => {
  const o = ord(el.dataset.id),
    c = cart();
  let n = 0;
  o.itens.forEach((i) => {
    const p = prod(i.pid);
    if (p && avail(p)) {
      c[p.id] = Math.min((c[p.id] || 0) + i.q, cat(p.c).est ? p.est : 99);
      n++;
    }
  });
  if (!n) return toast('Esses itens não estão mais disponíveis.');
  save();
  ui.cart = true;
  render();
};

/** Finalizar pedido: valida endereço, pagamento e estoque, cria o pedido e dá baixa no estoque. */
A.fin = () => {
  const u = me(),
    c = cart(),
    k = ui.ck,
    its = Object.keys(c)
      .map((id) => ({ p: prod(id), q: c[id] }))
      .filter((x) => x.p);
  const bad = its.find((x) => !avail(x.p) || (cat(x.p.c).est && x.q > x.p.est));
  if (bad) return toast(`“${bad.p.n}” não está disponível na quantidade escolhida.`);
  let end = BALCAO,
    taxa = 0;
  if (k.tipo == 'Delivery') {
    if (k.end >= 0) {
      end = u.end[k.end].t;
      taxa = u.end[k.end].x;
    } else {
      const t = (k.novoEnd || '').trim();
      if (!t) return toast('Informe o endereço de entrega.');
      if (!/santa branca/i.test(t))
        return toast(
          'Esse endereço está fora da nossa área de entrega. Escolha a retirada no balcão.',
        );
      u.end.push({ r: 'Outro', t, x: 8 });
      end = t;
      taxa = 8;
    }
  }
  const total = its.reduce((a, x) => a + x.p.p * x.q, 0) + taxa;
  let troco = 0;
  if (k.pg == 'Cartão' && k.cartao == -1) {
    if (!/^\d{4}$/.test(k.novo || '')) return toast('Informe os 4 últimos dígitos do cartão.');
    u.cartoes.push(`Cartão •••• ${k.novo}`);
  }
  if (k.pg == 'Dinheiro' && k.troco) {
    troco = parseFloat(String(k.valor).replace(',', '.'));
    if (!(troco >= total))
      return toast('O valor para troco deve ser maior ou igual ao total do pedido.');
  }
  const o = {
    id: Math.max(...S.orders.map((x) => x.id)) + 1,
    uid: u.id,
    itens: its.map((x) => ({ pid: x.p.id, n: x.p.n, q: x.q, p: x.p.p })),
    tipo: k.tipo,
    end,
    pg: k.pg,
    troco,
    pixOk: k.pg != 'Pix',
    taxa,
    st: 'Recebido',
    t: Date.now(),
  };
  baixa(o, -1);
  S.orders.push(o);
  S.carts[u.id] = {};
  Object.assign(ui.ck, { novo: '', novoEnd: '', valor: '', troco: false });
  ui.cart = false;
  save();
  render();
  modal(
    `<div class="modal__corpo" style="text-align:center"><h3 style="font-family:var(--fonte-display);font-size:22px">Pedido #${o.id} enviado!</h3><p class="nota">${k.pg == 'Pix' ? 'Pague pelo QR Code e envie o comprovante pelo WhatsApp do restaurante. Assim que o pagamento for confirmado, o preparo começa.' : 'Recebemos seu pedido e vamos começar o preparo.'}</p><div class="resumo"><div><span>Entrega</span><b>${o.tipo}</b></div><div><span>Pagamento</span><b>${o.pg}</b></div><div><span>Total</span><b>${R(tot(o))}</b></div></div><button class="btn btn--amarelo w big" data-a="go" data-to="pedido">Acompanhar pedido</button></div>`,
  );
};

/** Cancelar pedido (cliente), com confirmação. */
A.cancel = (el) =>
  conf('Cancelar este pedido?', 'O pedido será cancelado e os itens voltam ao estoque.', () =>
    cancel(ord(el.dataset.id)),
  );

/** Escolhas do carrinho (entrega, endereço, pagamento, troco): guarda e redesenha. */
C.ckr = (t) => {
  const k = t.dataset.k,
    v = t.dataset.v;
  ui.ck[k] = k == 'end' || k == 'cartao' ? +v : k == 'troco' ? v == 'sim' : v;
  render();
};

/** Campos de texto do carrinho: apenas guarda o valor. */
C.ckt = (t) => {
  ui.ck[t.dataset.k] = t.value;
};
