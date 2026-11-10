/**
 * DASHBOARD — indicadores do administrador
 */
'use strict';

/* ============================================================
 * DASHBOARD (ADMINISTRADOR)
 * ============================================================ */

/** Monta o degradê cônico do gráfico de rosca a partir das porcentagens. */
const cg = (v, cols) => {
  let a = 0;
  return (
    'conic-gradient(' +
    (v.some((x) => x)
      ? v
          .map((x, i) => {
            const s = `${cols[i]} ${a}% ${a + x}%`;
            a += x;
            return s;
          })
          .join(',')
      : '#3a322a 0 100%') +
    ')'
  );
};

/** Tela Dashboard: indicadores, produtos mais vendidos, modalidade, pagamentos e volume por período. */
V.dashboard = () => {
  const PR = { dia: [1, 'Diário'], sem: [7, 'Semanal'], mes: [30, 'Mensal'], ano: [365, 'Anual'] },
    d = PR[ui.per][0] * DAY,
    now = Date.now(),
    del = S.orders.filter((o) => o.st == 'Entregue'),
    cur = del.filter((o) => o.t > now - d),
    prv = del.filter((o) => o.t <= now - d && o.t > now - 2 * d),
    can = S.orders.filter((o) => o.st == 'Cancelado' && o.t > now - d).length;
  const sum = (a) => a.reduce((s, o) => s + tot(o), 0),
    vol = sum(cur),
    pc = (a, b) => (b ? ((a - b) / b) * 100 : null),
    vr = (v) =>
      v == null
        ? ''
        : `<span class="var ${v >= 0 ? 'up' : 'dn'}">${v >= 0 ? '+' : ''}${v.toFixed(1).replace('.', ',')}%</span>`,
    tk = cur.length ? vol / cur.length : 0,
    tkp = prv.length ? sum(prv) / prv.length : 0;
  const top = {};
  cur.forEach((o) => o.itens.forEach((i) => (top[i.n] = (top[i.n] || 0) + i.q)));
  const tp = Object.entries(top)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5),
    mx = tp[0] ? tp[0][1] : 1;
  const pct = (k, vals) =>
      vals.map((v) =>
        cur.length ? Math.round((cur.filter((o) => o[k] == v).length / cur.length) * 100) : 0,
      ),
    mod = pct('tipo', ['Delivery', 'Retirada']),
    pag = pct('pg', ['Pix', 'Cartão', 'Dinheiro']);
  const w = d / 7,
    bk = Array(7).fill(0);
  cur.forEach((o) => (bk[Math.min(6, Math.floor((o.t - (now - d)) / w))] += tot(o)));
  const bm = Math.max(...bk, 1),
    lb = (k) => {
      const t = new Date(now - d + k * w);
      return ui.per == 'dia'
        ? t.getHours() + 'h'
        : ui.per == 'ano'
          ? t.toLocaleDateString('pt-BR', { month: 'short' })
          : t.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    };
  const kp = (v, l, x = '') => `<div class="kpi">${x}<b>${v}</b><small>${l}</small></div>`,
    leg = (l, v, c) =>
      l.map((n, i) => `<li><i style="background:${c[i]}"></i>${n}<b>${v[i]}%</b></li>`).join('');
  return (
    titulo(
      'Dashboard Administrativo',
      'Indicadores de vendas, produtos e operação',
      `<div class="acoes-topo"><div class="filtros" style="margin:0">${Object.entries(PR)
        .map(
          ([k, [, l]]) =>
            `<button class="chip ${ui.per == k ? 'on' : ''}" data-a="per" data-v="${k}">${l}</button>`,
        )
        .join(
          '',
        )}</div><button class="btn btn--sec" data-a="csv">${ic('mais')}Exportar CSV</button></div>`,
    ) +
    `<div class="kpis">${kp(R(vol), 'Volume financeiro no período', vr(pc(vol, sum(prv))))}${kp(cur.length, 'Pedidos finalizados', vr(pc(cur.length, prv.length)))}${kp(R(tk), 'Ticket médio', vr(pc(tk, tkp)))}${kp((can + cur.length ? (can / (can + cur.length)) * 100 : 0).toFixed(1).replace('.', ',') + '%', 'Taxa de cancelamento')}</div>
<div class="graf"><div class="gc"><h3>Produtos mais vendidos</h3><small>Unidades vendidas no período</small>${tp.map(([n, q]) => `<div class="hb"><div><span>${esc(n)}</span><b>${q}</b></div><i><b style="width:${(q / mx) * 100}%"></b></i></div>`).join('') || '<p class="vazio">Sem vendas no período.</p>'}</div>
<div class="gc"><h3>Modalidade de entrega</h3><small>Delivery vs. retirada no balcão</small><div class="donutw"><div class="donut" style="background:${cg(mod, ['#f2a93b', '#6ea8d8'])}"></div><ul class="leg">${leg(['Delivery', 'Retirada'], mod, ['#f2a93b', '#6ea8d8'])}</ul></div></div>
<div class="gc"><h3>Métodos de pagamento</h3><small>Distribuição das formas de pagamento</small><div class="donutw"><div class="donut" style="background:${cg(pag, ['#f2a93b', '#6ea8d8', '#a78bd6'])}"></div><ul class="leg">${leg(['Pix', 'Cartão', 'Dinheiro'], pag, ['#f2a93b', '#6ea8d8', '#a78bd6'])}</ul></div></div>
<div class="gc"><h3>Volume financeiro ao longo do período</h3><small>${PR[ui.per][1]}</small><div class="bv">${bk.map((v, k) => `<div title="${R(v)}"><i style="height:${(v / bm) * 100}%"></i>${lb(k)}</div>`).join('')}</div></div></div>`
  );
};

/** Exporta o relatório do período em CSV (dados agregados, sem identificar clientes). */
A.csv = () => {
  const d = { dia: 1, sem: 7, mes: 30, ano: 365 }[ui.per] * DAY,
    l = S.orders
      .filter((o) => o.st == 'Entregue' && o.t > Date.now() - d)
      .map((o) =>
        [
          o.id,
          new Date(o.t).toLocaleDateString('pt-BR'),
          o.tipo,
          o.pg,
          tot(o).toFixed(2).replace('.', ','),
        ].join(';'),
      ),
    a = document.createElement('a');
  a.href = URL.createObjectURL(
    new Blob(['\ufeff' + ['pedido;data;modalidade;pagamento;total', ...l].join('\n')], {
      type: 'text/csv',
    }),
  );
  a.download = `relatorio-fenix-${ui.per}.csv`;
  a.click();
};
