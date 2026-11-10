/**
 * OPERAÇÃO — fila de pedidos, estoque e entregas
 */
'use strict';

/* ============================================================
 * FILA DE PEDIDOS (ATENDENTE E ADMINISTRADOR)
 * ============================================================ */

/** Cartão de um pedido na fila, com o botão da próxima etapa conforme a situação. */
const opCard = (o, u) => {
  const ent = o.ent && S.users.find((x) => x.id == o.ent),
    del = o.tipo == 'Delivery',
    id = `data-id="${o.id}"`,
    b = (a, l, c = 'amarelo', x = '') =>
      `<button class="btn btn--${c} w" data-a="${a}" ${id} ${x}>${l}</button>`;
  let act = '';
  if (o.st == 'Recebido')
    act =
      o.pg == 'Pix' && !o.pixOk
        ? `<div class="duo"><button class="btn btn--amarelo" data-a="pix" ${id}>Confirmar pagamento</button><button class="btn btn--perigo" data-a="rej" ${id}>Rejeitar</button></div>`
        : b('mv', 'Aprovar pedido', 'amarelo', 'data-to="Em Preparo"');
  if (o.st == 'Em Preparo')
    act = del
      ? b('assign', 'Enviar para entrega')
      : b('mv', 'Liberar para retirada', 'amarelo', 'data-to="Pronto"');
  if (o.st == 'Pronto')
    act = del
      ? ent
        ? `<p class="mut2">Aguardando ${esc(ent.nome)} retirar</p>`
        : b('assign', 'Enviar para entrega')
      : b('mv', 'Confirmar retirada no balcão', 'amarelo', 'data-to="Entregue"');
  if (o.st == 'Em Rota')
    act = `<button class="btn btn--sec w" disabled>Repassado ao entregador</button>`;
  if (u.perfil == 'administrador' && ['Recebido', 'Em Preparo', 'Pronto'].includes(o.st))
    act += `<button class="link c" data-a="cancelo" ${id}>Cancelar pedido</button>`;
  return `<article class="po ${o.st == 'Entregue' ? 'fim' : ''}"><div class="po__t"><span class="po__n">#${o.id}</span><small>${ago(o.t)}</small></div><span class="po__c">${esc(nome(o.uid))}</span><div class="tags">${tags(o)}${o.pg == 'Pix' && !o.pixOk ? `<span class="tag-op warn">${ic('alerta')}Pagamento a confirmar</span>` : ''}</div>${o.st == 'Entregue' ? '' : `<p class="po__i">${esc(itens(o))}</p>`}${ent && o.st != 'Entregue' ? `<p class="mut2">${ic('moto')}Entregador: <b>${esc(ent.nome)}</b></p>` : ''}${act}</article>`;
};

/** Tela Fila de Pedidos: quadro com Recebidos, Em Preparo, Prontos/Em Rota e Entregues hoje. */
V.fila = (u) => {
  const by = (f, s) => S.orders.filter(f).sort(s || ((a, b) => a.t - b.t)),
    cols = [
      ['Para conferir', '#f2a93b', by((o) => o.st == 'Recebido')],
      ['Em Preparo', '#e8804a', by((o) => o.st == 'Em Preparo')],
      ['Prontos / Em Rota', '#6ea8d8', by((o) => ['Pronto', 'Em Rota'].includes(o.st))],
      [
        'Finalizados hoje',
        '#4caf6b',
        by(
          (o) => o.st == 'Entregue' && o.t > Date.now() - DAY,
          (a, b) => b.t - a.t,
        ).slice(0, 6),
      ],
    ];
  return (
    titulo('Fila de Pedidos', 'Confira os pedidos e envie para entrega ou retirada') +
    `<div class="quadro">${cols.map(([t, c, os]) => `<section class="col" style="--c:${c}"><div class="col__h"><h3>${t}</h3><span>${os.length}</span></div>${os.map((o) => opCard(o, u)).join('') || '<p class="vazio">Nada por aqui.</p>'}</section>`).join('')}</div>`
  );
};

/* ============================================================
 * ESTOQUE
 * ============================================================ */

/** Tela Estoque: resumo, quantidade digitável com botões − e +, e movimentações. */
V.estoque = () => {
  const ps = sb(
      S.prods.filter((p) => cat(p.c).est),
      (p) => p.n,
    ),
    un = ps.reduce((a, p) => a + p.est, 0),
    k = (b, l) => `<div class="kpi"><b>${b}</b><small>${l}</small></div>`;
  return (
    titulo(
      'Estoque',
      'Baixas e estornos acontecem automaticamente a cada pedido',
      `<button class="botao-novo" data-a="ent">${ic('mais')}Registrar entrada</button>`,
    ) +
    `<div class="stats">${k(ps.length, 'Produtos controlados')}${k(un, 'Unidades em estoque')}${k(ps.filter((p) => p.est <= 6).length, 'Com estoque baixo ou esgotado')}</div>
<div class="grade-est">${
      ps
        .map((p) => {
          const z = p.est == 0 ? 'zero' : p.est <= 6 ? 'low' : 'ok';
          return `<div class="est e-${z}"><div class="est__t"><div><strong>${esc(p.n)}</strong><small>${esc(p.s)}</small></div><span class="badge ${z == 'zero' ? 'b-zero' : z == 'low' ? 'b-low' : 'b-on'}">${z == 'zero' ? 'Esgotado' : z == 'low' ? 'Estoque baixo' : 'Em estoque'}</span></div><div class="est__q"><button data-a="adj" data-id="${p.id}" data-d="-1" aria-label="Diminuir uma unidade">−</button><label class="qw"><input class="qtd" type="number" min="0" step="1" inputmode="numeric" data-c="estq" data-id="${p.id}" value="${p.est}" aria-label="Quantidade de ${esc(p.n)}"><small>unidades</small></label><button data-a="adj" data-id="${p.id}" data-d="1" aria-label="Acrescentar uma unidade">+</button></div><div class="est__bar"><i style="width:${Math.min(100, (p.est / 50) * 100)}%"></i></div></div>`;
        })
        .join('') || '<p class="vazio">Nenhuma categoria controlada por estoque.</p>'
    }</div>
<h3 class="sec">Últimas movimentações</h3><div class="movs">${S.mov
      .slice(0, 8)
      .map(
        (m) =>
          `<div class="mv ${m.v < 0 ? 'neg' : 'pos'}"><span>${esc(m.txt)}</span><b>${m.v > 0 ? '+' : ''}${m.v} un.</b><small>${ago(m.t)}</small></div>`,
      )
      .join('')}</div>`
  );
};

/* ============================================================
 * ENTREGAS (ENTREGADOR)
 * ============================================================ */

/** Tela Minhas Entregas: corrida em andamento, próximas retiradas e disponibilidade. */
V.entregas = (u) => {
  const mine = S.orders.filter((o) => o.ent == u.id),
    rota = mine.filter((o) => o.st == 'Em Rota'),
    ret = mine.filter((o) => o.st == 'Pronto'),
    h = mine.filter((o) => o.st == 'Entregue' && o.t > Date.now() - DAY).length,
    k = (b, l) => `<div class="kpi"><b>${b}</b><small>${l}</small></div>`;
  return (
    titulo(
      'Minhas Entregas',
      'Sua corrida atual e as próximas retiradas no restaurante',
      sw('udisp', u.id, u.disp, 'Disponível', 'Indisponível'),
    ) +
    `<div class="stats">${k(h, 'Entregues hoje')}${k(rota.length, 'Em rota')}${k(ret.length, 'Aguardando retirada')}</div>
<h3 class="sec">Corrida em andamento</h3>${rota.map((o) => `<article class="card-p"><div class="card-p__t"><h3>Pedido #${o.id}</h3><span class="aviso" style="padding:4px 12px;border-radius:999px">Em Rota</span></div><p class="mut2">${ic('pin')}${esc(o.end)}</p><div class="resumo"><div><span>Cliente</span><b>${esc(nome(o.uid))}</b></div><div><span>Itens</span><b>${esc(itens(o))}</b></div><div><span>Pagamento</span><b>${o.pg}${o.troco ? ` · troco para ${R(o.troco)}` : ''}</b></div></div><button class="btn btn--amarelo w big" data-a="entregar" data-id="${o.id}">${ic('check')}Confirmar entrega</button></article>`).join('') || '<p class="vazio">Nenhuma entrega em andamento.</p>'}
<h3 class="sec">Próximas retiradas no restaurante</h3><div class="lista">${ret.map((o) => `<div class="row"><span class="thumb">${ic('moto')}</span><div class="info"><strong>#${o.id} · ${esc(nome(o.uid))}</strong><small>${esc(o.end)}</small><div class="tags">${tags(o)}</div></div><button class="btn btn--sec" data-a="pick" data-id="${o.id}">Retirei no restaurante</button></div>`).join('') || '<p class="vazio">Nenhuma retirada pendente.</p>'}</div>`
  );
};

/* ============================================================
 * AÇÕES DA OPERAÇÃO
 * ============================================================ */

/** Cancelar pedido pelo painel (só o administrador vê o botão). */
A.cancelo = A.cancel;

/** Rejeitar pagamento: cancela o pedido e devolve o estoque. */
A.rej = (el) =>
  conf('Rejeitar pagamento?', 'O pedido será cancelado e os itens voltam ao estoque.', () =>
    cancel(ord(el.dataset.id)),
  );

/** Avança o pedido para a etapa informada. */
A.mv = (el) => {
  const o = ord(el.dataset.id);
  o.st = el.dataset.to;
  save();
  render();
};

/** Confirma o pagamento via Pix (comprovante recebido pelo WhatsApp). */
A.pix = (el) => {
  const o = ord(el.dataset.id);
  o.pixOk = true;
  o.st = 'Em Preparo';
  save();
  render();
  toast('Pagamento confirmado. Pedido enviado ao preparo.');
};

/** Abre a escolha de entregador: só aparecem entregadores ativos. */
A.assign = (el) => {
  const o = ord(el.dataset.id),
    cs = sb(
      S.users.filter((u) => u.perfil == 'entregador' && u.ativo),
      (u) => u.nome,
    );
  modal(
    mh(
      `Enviar para entrega — #${o.id}`,
      `<form data-f="assign" data-id="${o.id}"><div>${
        cs
          .map((c) => {
            const busy = S.orders.some((x) => x.ent == c.id && x.st == 'Em Rota');
            return `<label class="opt"><input type="radio" name="ent" value="${c.id}" required ${c.disp ? '' : 'disabled'}><span class="thumb">${ic('moto')}</span><span class="info"><strong>${esc(c.nome)}</strong><br><small>${!c.disp ? 'Indisponível' : busy ? 'Em rota agora' : 'Disponível'}</small></span></label>`;
          })
          .join('') || '<p class="vazio">Nenhum entregador ativo.</p>'
      }</div><div class="acoes"><button class="btn btn--amarelo">Confirmar envio</button></div></form>`,
    ),
  );
};

/** Vincula o pedido ao entregador escolhido. */
F.assign = (d, f) => {
  const o = ord(f.dataset.id);
  o.ent = +d.ent;
  o.st = 'Pronto';
  save();
  A.x();
  toast('Pedido enviado para entrega.');
};

/** Entregador retirou o pedido: passa para "Em Rota". */
A.pick = (el) => {
  ord(el.dataset.id).st = 'Em Rota';
  save();
  render();
};

/** Abre a confirmação de entrega (com conferência de troco quando é em dinheiro). */
A.entregar = (el) => {
  const o = ord(el.dataset.id),
    din = o.pg == 'Dinheiro';
  modal(
    mh(
      `Confirmar entrega — #${o.id}`,
      `<form data-f="entregue" data-id="${o.id}"><div class="resumo"><div><span>Cliente</span><b>${esc(nome(o.uid))}</b></div><div><span>Total do pedido</span><b>${R(tot(o))}</b></div><div><span>Pagamento</span><b>${o.pg}</b></div>${din && o.troco ? `<div><span>Cliente paga com</span><b>${R(o.troco)}</b></div><div><span>Troco a devolver</span><b>${R(o.troco - tot(o))}</b></div>` : ''}</div>${din ? `<label class="troca2"><input type="checkbox" required> Recebi o valor e entreguei o troco corretamente.</label>` : '<p class="nota">Pagamento já confirmado — basta concluir a entrega.</p>'}<button class="btn btn--verde w big">Concluir entrega</button></form>`,
    ),
  );
};

/** Conclui a entrega. */
F.entregue = (d, f) => {
  ord(f.dataset.id).st = 'Entregue';
  save();
  A.x();
  toast('Entrega concluída.');
};

/** Estoque: soma ou subtrai uma unidade pelos botões − e +. */
A.adj = (el) => {
  const p = prod(el.dataset.id),
    d = +el.dataset.d;
  if (p.est + d < 0) return;
  p.est += d;
  S.mov.unshift({
    t: Date.now(),
    txt: `Ajuste manual por ${me().nome.split(' ')[0]} (${p.n})`,
    v: d,
  });
  save();
  render();
};

/** Abre o registro de entrada de estoque. */
A.ent = () =>
  modal(
    mh(
      'Registrar entrada',
      `<form data-f="entrada"><label class="f"><span>Produto</span><select name="pid">${sb(
        S.prods.filter((p) => cat(p.c).est),
        (p) => p.n,
      )
        .map((p) => `<option value="${p.id}">${esc(p.n)}</option>`)
        .join(
          '',
        )}</select></label><label class="f"><span>Quantidade recebida</span><input name="q" type="number" min="1" required placeholder="Ex.: 24"></label><label class="f"><span>Motivo (opcional)</span><input name="m" placeholder="Ex.: Reposição de fornecedor"></label><button class="btn btn--amarelo w big">Confirmar entrada</button></form>`,
    ),
  );

/** Registra a entrada de produtos no estoque. */
F.entrada = (d) => {
  const p = prod(d.pid);
  if (!p) return;
  p.est += +d.q;
  S.mov.unshift({
    t: Date.now(),
    txt: `Entrada por ${me().nome.split(' ')[0]} — ${d.m || 'reposição'} (${p.n})`,
    v: +d.q,
  });
  save();
  A.x();
  toast('Entrada registrada.');
};

/** Estoque: grava a quantidade digitada diretamente no campo. */
C.estq = (t) => {
  const p = prod(t.dataset.id),
    v = Math.floor(+t.value);
  if (t.value === '' || !(v >= 0)) return render();
  const d = v - p.est;
  if (d) {
    p.est = v;
    S.mov.unshift({
      t: Date.now(),
      txt: `Ajuste manual por ${me().nome.split(' ')[0]} (${p.n})`,
      v: d,
    });
    save();
  }
  render();
  if (d) toast(`${p.n}: ${v} unidades em estoque.`);
};

/** Entregador liga/desliga a própria disponibilidade. */
C.udisp = (t) => {
  me().disp = t.checked;
  save();
  render();
};
