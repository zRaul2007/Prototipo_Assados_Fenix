/**
 * CATÁLOGO — produtos, categorias e subcategorias (administrador)
 */
'use strict';

/* ============================================================
 * CATÁLOGO (ADMINISTRADOR)
 * ============================================================ */

/** Linha de um produto na lista do catálogo. */
const prow = (p) => {
  const c = cat(p.c);
  return `<div class="row"><input type="checkbox" class="chk" data-a="sel" data-id="${p.id}" ${ui.sel.has(p.id) ? 'checked' : ''} aria-label="Selecionar ${esc(p.n)}"><span class="thumb ${kc(p.c)}">${ic(cIc(c))}</span><div class="info"><strong>${esc(p.n)}</strong><small>${esc(p.c)} · ${esc(p.s)}</small></div><span class="preco">${R(p.p)}</span>${c.est ? `<span class="badge ${p.est == 0 ? 'b-zero' : 'b-on'}">${p.est == 0 ? 'Esgotado' : p.est + ' em estoque'}</span>` : sw('pdisp', p.id, p.disp, 'Disponível', 'Indisponível')}<button class="btn btn--sec sm" data-a="pedit" data-id="${p.id}">${ic('lapis')}Editar</button><button class="btn btn--perigo sm" data-a="pdel" data-id="${p.id}" aria-label="Excluir ${esc(p.n)}">${ic('lixeira')}</button></div>`;
};

/** Lista do catálogo: filtra pela busca e ordena por nome. */
LST.catalogo = () => {
  const q = norm(ui.q),
    ps = sb(
      S.prods.filter(
        (p) => (!ui.f || p.c == ui.f) && norm(`${p.n} ${p.c} ${p.s} ${p.d}`).includes(q),
      ),
      (p) => p.n,
    );
  return ps.map(prow).join('') || '<p class="vazio">Nenhum produto encontrado.</p>';
};

/** Barra de alteração de preço em lote. */
const bar = () =>
  `<span class="lote__txt">${ic('etiqueta')}${ui.sel.size} selecionado(s) — alterar preço</span><label class="lote__campo">R$ <input id="lotev" inputmode="decimal" placeholder="Novo preço" aria-label="Novo preço"></label><button class="btn btn--amarelo" data-a="lote">Aplicar a todos</button>`;

/** Tela Gerenciar Catálogo: busca, filtros por categoria, lista de produtos e barra de lote. */
V.catalogo = () => {
  const cs = sb(S.cats, (c) => c.n);
  return (
    titulo(
      'Gerenciar Catálogo',
      'Cadastre, edite e remova produtos, categorias e subcategorias',
      `<div class="acoes-topo"><button class="btn btn--sec" data-a="cats">${ic('livro')}Categorias</button><button class="botao-novo" data-a="pnew">${ic('mais')}Novo produto</button></div>`,
    ) +
    `<div class="barra">${search('Buscar produto, categoria ou subcategoria')}</div>${chips([['', 'Todos'], ...cs.map((c) => [c.n, c.n])], ui.f, 'f', (v) => S.prods.filter((p) => !v || p.c == v).length)}<div class="lista" id="lista">${LST.catalogo()}</div><div class="lote ${ui.sel.size ? 'open' : ''}" id="lote">${bar()}</div>`
  );
};

/** Formulário de produto (cadastro e edição). */
const pform = (p) => {
  p = p || {};
  const cs = sb(S.cats, (c) => c.n),
    c0 = cat(p.c || cs[0].n);
  return `<form data-f="prod" data-id="${p.id || ''}"><div class="grade"><label class="f"><span>Nome do produto</span><input name="n" required value="${esc(p.n || '')}" placeholder="Ex.: Frango Assado Inteiro"></label><label class="f"><span>Preço (R$)</span><input name="p" required inputmode="decimal" value="${p.p ? String(p.p.toFixed(2)).replace('.', ',') : ''}" placeholder="0,00"></label><label class="f"><span>Categoria</span><select name="c" data-c="pcat">${opts(
    S.cats.map((c) => c.n),
    c0.n,
  )}</select></label><label class="f"><span>Subcategoria</span><select name="s">${opts(c0.subs, p.s)}</select></label><label class="f f--full"><span>Descrição</span><textarea name="d" rows="2">${esc(p.d || '')}</textarea></label></div><label class="troca dispw" ${c0.est ? 'hidden' : ''}><input type="checkbox" name="disp" ${p.id && !p.disp ? '' : 'checked'}><span class="trilho"><span class="bola"></span></span><span>Disponível no cardápio do cliente</span></label><div class="acoes"><button type="button" class="btn btn--sec" data-a="x">Cancelar</button><button class="btn btn--amarelo">${p.id ? 'Salvar alterações' : 'Cadastrar produto'}</button></div></form>`;
};

/** Abre o cadastro de um novo produto. */
A.pnew = () => modal(mh('Novo produto', pform()));

/** Abre a edição de um produto. */
A.pedit = (el) => modal(mh('Editar produto', pform(prod(el.dataset.id))));

/** Exclui um produto, com confirmação. */
A.pdel = (el) => {
  const p = prod(el.dataset.id);
  conf(
    `Excluir “${esc(p.n)}”?`,
    'O produto some do cardápio. Pedidos antigos mantêm o preço pago. Se for só uma pausa, prefira marcá-lo como indisponível.',
    () => {
      S.prods = S.prods.filter((x) => x.id != p.id);
      Object.values(S.carts).forEach((c) => delete c[p.id]);
      ui.sel.delete(p.id);
      save();
      render();
      toast('Produto excluído.');
    },
  );
};

/** Salva um produto (novo ou editado). */
F.prod = (d, f) => {
  const pr = parseFloat(String(d.p).replace(',', '.'));
  if (!(pr > 0)) return toast('Informe um preço válido.');
  const id = f.dataset.id,
    c = cat(d.c);
  if (S.prods.some((x) => x.id != id && x.c == d.c && norm(x.n) == norm(d.n)))
    return toast('Já existe um produto com esse nome nessa categoria.');
  const o = { n: d.n.trim(), c: d.c, s: d.s, p: pr, d: (d.d || '').trim(), disp: !!d.disp };
  let p = id && prod(id);
  if (p) {
    Object.assign(p, o);
    if (c.est && p.est == null) p.est = 0;
  } else {
    p = { id: Math.max(0, ...S.prods.map((x) => x.id)) + 1, ...o };
    if (c.est) p.est = 0;
    S.prods.push(p);
  }
  save();
  A.x();
  toast(id ? 'Produto atualizado.' : 'Produto cadastrado.');
};

/** No formulário, troca a lista de subcategorias quando a categoria muda. */
C.pcat = (t) => {
  const c = cat(t.value),
    f = t.form;
  f.elements.s.innerHTML = opts(c.subs);
  $('.dispw', f).hidden = !!c.est;
};

/** Liga/desliga a disponibilidade de um produto. */
C.pdisp = (t) => {
  prod(t.dataset.id).disp = t.checked;
  save();
  render();
};

/** Marca/desmarca um produto para a alteração de preço em lote. */
A.sel = (el) => {
  const id = +el.dataset.id;
  el.checked ? ui.sel.add(id) : ui.sel.delete(id);
  $('#lote').innerHTML = bar();
  $('#lote').classList.toggle('open', ui.sel.size > 0);
};

/** Aplica o novo preço a todos os produtos selecionados. */
A.lote = () => {
  const v = parseFloat($('#lotev').value.replace(',', '.'));
  if (!(v > 0)) return toast('Informe o novo preço.');
  ui.sel.forEach((id) => (prod(id).p = v));
  toast(`Preço de ${ui.sel.size} produto(s) atualizado.`);
  ui.sel.clear();
  save();
  render();
};

/* ============================================================
 * CATEGORIAS E SUBCATEGORIAS
 * ============================================================ */

/** Consultas: categoria pelo nome (cOne) e quantidade de produtos de uma categoria/subcategoria (nProd). */
const cOne = (n) => S.cats.find((c) => c.n === n),
  nProd = (c, s) => S.prods.filter((p) => p.c == c && (s == null || p.s == s)).length;

/** Janela de gerenciamento: criar, renomear e excluir categorias e subcategorias. */
const cmgr = () =>
  mh(
    'Categorias e subcategorias',
    `<form data-f="cat" class="cadd"><input name="n" required placeholder="Nova categoria" aria-label="Nome da nova categoria"><input name="subs" placeholder="Subcategorias (opcional, separe por vírgula)" aria-label="Subcategorias"><button class="btn btn--amarelo">${ic('mais')}Adicionar</button></form><p class="nota">Clique em um nome para renomear. Os produtos acompanham as mudanças.</p><div class="cl">${sb(
      S.cats,
      (c) => c.n,
    )
      .map(
        (c) =>
          `<section class="cb"><div class="cb__h"><input class="ci" data-c="crn" data-cat="${esc(c.n)}" value="${esc(c.n)}" aria-label="Renomear categoria ${esc(c.n)}"><label class="troca2"><input type="checkbox" data-c="cest" data-cat="${esc(c.n)}" ${c.est ? 'checked' : ''}>Controla estoque</label><button class="rm" data-a="cdel" data-cat="${esc(c.n)}" aria-label="Excluir categoria ${esc(c.n)}">${ic('lixeira')}</button></div><div class="cb__s">${sb(
            c.subs,
            (x) => x,
          )
            .map(
              (x) =>
                `<span class="sc"><input class="ci" data-c="srn" data-cat="${esc(c.n)}" data-sub="${esc(x)}" value="${esc(x)}" size="${Math.max(5, x.length)}" aria-label="Renomear subcategoria ${esc(x)}"><button data-a="sdel" data-cat="${esc(c.n)}" data-sub="${esc(x)}" aria-label="Excluir subcategoria ${esc(x)}">${ic('x')}</button></span>`,
            )
            .join(
              '',
            )}<input class="ci add" data-c="sadd" data-cat="${esc(c.n)}" placeholder="+ subcategoria" aria-label="Nova subcategoria em ${esc(c.n)}"></div><small class="mut2">${nProd(c.n)} produto(s)</small></section>`,
      )
      .join('')}</div>`,
  );

/** Salva, redesenha a tela e reabre a janela de categorias atualizada. */
const reopen = () => {
  save();
  render();
  modal(cmgr(), 'min(680px,calc(100% - 32px))');
};

/** Abre o gerenciador de categorias. */
A.cats = reopen;

/** Cria uma categoria (com subcategorias opcionais). */
F.cat = (d) => {
  const n = d.n.trim();
  if (S.cats.some((c) => norm(c.n) == norm(n))) return toast('Essa categoria já existe.');
  const subs = [
    ...new Set(
      (d.subs || '')
        .split(',')
        .map((x) => x.trim())
        .filter(Boolean),
    ),
  ];
  S.cats.push({ n, subs: subs.length ? subs : ['Geral'] });
  reopen();
  toast('Categoria criada.');
};

/** Renomeia uma categoria (os produtos acompanham). */
C.crn = (t) => {
  const c = cOne(t.dataset.cat),
    v = t.value.trim();
  if (!v || v == c.n) return reopen();
  if (S.cats.some((x) => x !== c && norm(x.n) == norm(v))) {
    toast('Já existe uma categoria com esse nome.');
    return reopen();
  }
  S.prods.forEach((p) => {
    if (p.c == c.n) p.c = v;
  });
  if (ui.f == c.n) ui.f = v;
  c.n = v;
  reopen();
};

/** Renomeia uma subcategoria (os produtos acompanham). */
C.srn = (t) => {
  const c = cOne(t.dataset.cat),
    o = t.dataset.sub,
    v = t.value.trim();
  if (!v || v == o) return reopen();
  if (c.subs.some((x) => x != o && norm(x) == norm(v))) {
    toast('Essa subcategoria já existe.');
    return reopen();
  }
  c.subs = c.subs.map((x) => (x == o ? v : x));
  S.prods.forEach((p) => {
    if (p.c == c.n && p.s == o) p.s = v;
  });
  reopen();
};

/** Cria uma subcategoria. */
C.sadd = (t) => {
  const c = cOne(t.dataset.cat),
    v = t.value.trim();
  if (!v) return;
  if (c.subs.some((x) => norm(x) == norm(v))) {
    toast('Essa subcategoria já existe.');
    return reopen();
  }
  c.subs.push(v);
  reopen();
};

/** Liga/desliga o controle de estoque de uma categoria. */
C.cest = (t) => {
  const c = cOne(t.dataset.cat);
  if (t.checked) {
    c.est = true;
    S.prods.forEach((p) => {
      if (p.c == c.n && p.est == null) p.est = 0;
    });
  } else delete c.est;
  reopen();
};

/** Exclui uma categoria (só se não tiver produtos). */
A.cdel = (el) => {
  const c = cOne(el.dataset.cat),
    n = nProd(c.n);
  if (n) return toast(`Mova ou exclua os ${n} produto(s) dessa categoria antes de excluí-la.`);
  if (S.cats.length < 2) return toast('É preciso manter ao menos uma categoria.');
  S.cats = S.cats.filter((x) => x !== c);
  if (ui.f == c.n) ui.f = '';
  reopen();
};

/** Exclui uma subcategoria (só se não tiver produtos e se não for a última). */
A.sdel = (el) => {
  const c = cOne(el.dataset.cat),
    x = el.dataset.sub,
    n = nProd(c.n, x);
  if (n) return toast(`Mova ou exclua os ${n} produto(s) dessa subcategoria antes de excluí-la.`);
  if (c.subs.length < 2) return toast('A categoria precisa ter ao menos uma subcategoria.');
  c.subs = c.subs.filter((y) => y != x);
  reopen();
};
