/**
 * PERFIS DE ACESSO — usuários do sistema (administrador)
 */
'use strict';

/* ============================================================
 * PERFIS DE ACESSO (ADMINISTRADOR)
 * ============================================================ */

/** Lista de usuários: filtra pela busca e ordena por nome. */
LST.perfis = () => {
  const q = norm(ui.q),
    me0 = me(),
    us = sb(
      S.users.filter(
        (x) => (!ui.pf || x.perfil == ui.pf) && norm(`${x.nome} ${x.email} ${x.tel}`).includes(q),
      ),
      (x) => x.nome,
    );
  return (
    us
      .map((x) => {
        const s = x.id == me0.id;
        return `<div class="row"><span class="thumb">${ic(x.perfil == 'entregador' ? 'moto' : 'usuario')}</span><div class="info"><strong>${esc(x.nome)}${s ? ' (você)' : ''}</strong><small>${esc(x.email)} · ${esc(x.tel)}</small></div><select class="sel" data-c="uperfil" data-id="${x.id}" ${s ? 'disabled' : ''} aria-label="Perfil de ${esc(x.nome)}">${Object.entries(
          PN,
        )
          .map(([k, l]) => `<option value="${k}" ${k == x.perfil ? 'selected' : ''}>${l}</option>`)
          .join(
            '',
          )}</select>${sw('uativo', x.id, x.ativo, 'Ativo', 'Inativo', s ? 'disabled' : '')}</div>`;
      })
      .join('') || '<p class="vazio">Nenhum usuário encontrado.</p>'
  );
};

/** Tela Perfis de Acesso: busca, filtros por perfil e lista de usuários. */
V.perfis = () =>
  titulo(
    'Perfis de Acesso',
    'Crie, edite, ative ou inative os usuários do sistema',
    `<button class="botao-novo" data-a="unew">${ic('mais')}Novo usuário</button>`,
  ) +
  `<div class="barra">${search('Buscar por nome, e-mail ou telefone')}</div>${chips([['', 'Todos'], ...Object.entries(PN).map(([k, l]) => [k, l + 's'])], ui.pf, 'pf', (v) => S.users.filter((x) => !v || x.perfil == v).length)}<div class="lista" id="lista">${LST.perfis()}</div>`;

/** Abre o cadastro de um novo usuário. */
A.unew = () =>
  modal(
    mh(
      'Novo usuário',
      `<form data-f="user"><label class="f"><span>Nome completo</span><input name="nome" required></label><label class="f"><span>E-mail</span><input name="email" type="email" required></label><label class="f"><span>Telefone</span><input name="tel" type="tel" required pattern="\\(?\\d{2}\\)?\\s?9?\\d{4}-?\\d{4}" placeholder="(11) 91234-5678"></label><label class="f"><span>Perfil de acesso</span><select name="perfil">${Object.entries(
        PN,
      )
        .map(([k, l]) => `<option value="${k}">${l}</option>`)
        .join(
          '',
        )}</select></label><label class="f"><span>Senha provisória</span><input name="senha" type="password" required minlength="8"></label><div class="acoes"><button type="button" class="btn btn--sec" data-a="x">Cancelar</button><button class="btn btn--amarelo">Criar usuário</button></div></form>`,
    ),
  );

/** Cria um usuário (e-mail e telefone precisam ser únicos). */
F.user = (d) => {
  const em = d.email.trim().toLowerCase();
  if (S.users.some((x) => x.email.toLowerCase() == em || x.tel == d.tel))
    return toast('E-mail ou telefone já cadastrado.');
  S.users.push({
    id: Math.max(...S.users.map((x) => x.id)) + 1,
    nome: d.nome.trim(),
    email: em,
    tel: d.tel,
    senha: d.senha,
    perfil: d.perfil,
    ativo: true,
    disp: true,
    end: [],
    cartoes: [],
  });
  save();
  A.x();
  toast('Usuário criado.');
};

/** Altera o perfil de acesso de um usuário. */
C.uperfil = (t) => {
  const u = S.users.find((x) => x.id == t.dataset.id);
  u.perfil = t.value;
  save();
  render();
  toast(`${u.nome.split(' ')[0]} agora é ${PN[u.perfil]}.`);
};

/** Ativa ou inativa um usuário. */
C.uativo = (t) => {
  S.users.find((x) => x.id == t.dataset.id).ativo = t.checked;
  save();
  render();
};
