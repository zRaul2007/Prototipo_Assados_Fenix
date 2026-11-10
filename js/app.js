/**
 * APP — eventos globais e inicialização
 */
'use strict';

/* ============================================================
 * EVENTOS E INICIALIZAÇÃO
 * ============================================================ */

/** Cliques em elementos com data-a chamam a ação correspondente (A). */
document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-a]');
  if (el && A[el.dataset.a]) A[el.dataset.a](el, e);
});

/** Mudanças em campos com data-c chamam o tratador correspondente (C). */
document.addEventListener('change', (e) => {
  const c = e.target.dataset.c;
  if (c && C[c]) C[c](e.target);
});

/** Enter em campos de edição rápida confirma o valor. */
document.addEventListener('keydown', (e) => {
  if (e.key == 'Enter' && e.target.matches('.ci,.qtd')) e.target.blur();
});

/** Digitação na busca atualiza só a lista, sem perder o foco. */
document.addEventListener('input', (e) => {
  if (e.target.dataset.i == 'q') {
    ui.q = e.target.value;
    const l = $('#lista');
    if (l && LST[ui.r]) l.innerHTML = LST[ui.r]();
  }
});

/** Envio de formulários com data-f chama o tratador correspondente (F). */
document.addEventListener('submit', (e) => {
  e.preventDefault();
  const f = e.target;
  F[f.dataset.f]?.(Object.fromEntries(new FormData(f)), f);
});

/** Ao trocar de tela, limpa filtros, busca e seleções. */
addEventListener('hashchange', () => {
  ui.f = ui.q = ui.pf = ui.hf = '';
  ui.sel.clear();
  ui.cart = false;
  render();
});

/** Mantém várias abas sincronizadas quando os dados mudam em outra aba. */
addEventListener('storage', (e) => {
  if (
    e.key == K &&
    e.newValue &&
    !$('#mod').classList.contains('open') &&
    !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)
  ) {
    S = JSON.parse(e.newValue);
    render();
  }
});

/** Primeiro desenho da tela. */
render();
