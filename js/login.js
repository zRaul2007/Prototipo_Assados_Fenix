/**
 * LOGIN — entrar, criar conta e recuperar senha
 */
'use strict';

/* ============================================================
 * TELA DE LOGIN
 * ============================================================ */

/** HTML da tela de login: entrar, criar conta e recuperar senha (três etapas). */
function login() {
  const v = ui.v,
    tab = `<div class="abas"><button class="${v == 'in' ? 'on' : ''}" data-a="v" data-v="in">Entrar</button><button class="${v == 'up' ? 'on' : ''}" data-a="v" data-v="up">Criar conta</button></div>`,
    fld = (l, n, t = 'text', ex = '') =>
      `<label class="f"><span>${l}</span><input name="${n}" type="${t}" required ${ex}></label>`;
  const body = {
    in: `${tab}<h2>Bem-vindo de volta</h2><p class="sub">Entre para fazer pedidos ou acessar o seu painel.</p><form data-f="login">${fld('E-mail', 'email', 'email', 'autocomplete="username" placeholder="seuemail@exemplo.com"')}${fld('Senha', 'senha', 'password', 'autocomplete="current-password"')}<button type="button" class="link" data-a="v" data-v="rec">Esqueci minha senha</button><div class="erro" id="erro" role="alert"></div><button class="btn btn--amarelo w big">Entrar</button></form>`,
    up: `${tab}<h2>Criar minha conta</h2><p class="sub">Leva menos de um minuto.</p><form data-f="up">${fld('Nome completo', 'nome')}${fld('E-mail', 'email', 'email')}${fld('Telefone / WhatsApp', 'tel', 'tel', 'pattern="\\(?\\d{2}\\)?\\s?9?\\d{4}-?\\d{4}" placeholder="(11) 91234-5678"')}${fld('Crie uma senha', 'senha', 'password', 'minlength="8" placeholder="Mínimo de 8 caracteres"')}${fld('Rua e número', 'rua', 'text', 'placeholder="Rua das Palmeiras, 120"')}${fld('CEP', 'cep', 'text', 'pattern="\\d{5}-?\\d{3}" placeholder="12345-678"')}<div class="erro" id="erro" role="alert"></div><button class="btn btn--amarelo w big">Criar conta</button></form>`,
    rec: `<h2>Recuperar senha</h2><p class="sub">Enviaremos um link de redefinição para o seu e-mail cadastrado.</p><form data-f="rec">${fld('E-mail cadastrado', 'email', 'email')}<button class="btn btn--amarelo w big">Enviar link de recuperação</button></form><button class="link c" data-a="v" data-v="in">← Voltar para o login</button>`,
    'rec-ok': `<h2>Verifique seu e-mail</h2><p class="sub">Se o e-mail informado estiver cadastrado, enviamos um link de redefinição.</p>${ui.rec ? `<button class="btn btn--sec w" data-a="v" data-v="rec2">Abrir link de redefinição</button>` : ''}<button class="link c" data-a="v" data-v="in">← Voltar para o login</button>`,
    rec2: `<h2>Nova senha</h2><p class="sub">Defina uma nova senha para a sua conta.</p><form data-f="rec2">${fld('Nova senha', 's1', 'password', 'minlength="8"')}${fld('Confirmar nova senha', 's2', 'password', 'minlength="8"')}<div class="erro" id="erro" role="alert"></div><button class="btn btn--amarelo w big">Salvar nova senha</button></form>`,
  }[v];
  return `<div class="login"><div class="card-login"><div class="marca"><span class="marca__selo">F</span><div class="marca__texto"><h1>Fênix Casa dos Assados</h1><p>Assados na brasa · Santa Branca/SP</p></div></div>${body}</div></div>`;
}

/** Mostra uma mensagem de erro no formulário de login (ou uma mensagem rápida). */
const err = (m) => {
  const e = $('#erro');
  e ? (e.textContent = m) : toast(m);
};

/** Entrar: confere e-mail e senha, bloqueia usuários inativos e abre a tela inicial do perfil. */
F.login = (d) => {
  const u = S.users.find(
    (x) => x.email.toLowerCase() == d.email.trim().toLowerCase() && x.senha == d.senha,
  );
  if (!u) return err('E-mail ou senha incorretos.');
  if (!u.ativo) return err('Usuário inativo. Procure um administrador.');
  S.sess = u.id;
  save();
  setHash(NAV[u.perfil][0][0]);
  render();
};

/** Criar conta: valida e-mail/telefone únicos e cria um usuário com perfil Cliente. */
F.up = (d) => {
  const em = d.email.trim().toLowerCase();
  if (S.users.some((x) => x.email.toLowerCase() == em || x.tel == d.tel))
    return err('E-mail ou telefone já cadastrado.');
  const u = {
    id: Math.max(...S.users.map((x) => x.id)) + 1,
    nome: d.nome.trim(),
    email: em,
    tel: d.tel,
    senha: d.senha,
    perfil: 'cliente',
    ativo: true,
    disp: true,
    end: [{ r: 'Casa', t: `${d.rua.trim()} – CEP ${d.cep}, Santa Branca/SP`, x: 8 }],
    cartoes: [],
  };
  S.users.push(u);
  S.sess = u.id;
  save();
  setHash('cardapio');
  render();
  toast('Conta criada! Bom apetite.');
};

/** Recuperar senha, etapa 1: pede o e-mail cadastrado. */
F.rec = (d) => {
  const u = S.users.find((x) => x.email.toLowerCase() == d.email.trim().toLowerCase());
  ui.rec = u ? u.id : 0;
  ui.v = 'rec-ok';
  render();
};

/** Recuperar senha, etapa 2: grava a nova senha. */
F.rec2 = (d) => {
  if (d.s1 != d.s2) return err('As senhas não coincidem.');
  S.users.find((x) => x.id == ui.rec).senha = d.s1;
  save();
  ui.v = 'in';
  render();
  toast('Senha redefinida. Faça login com a nova senha.');
};

/** Alterna entre as telas do login (entrar, criar conta, recuperar). */
A.v = (el) => {
  ui.v = el.dataset.v;
  render();
};

/** Encerra a sessão. */
A.sair = () => {
  S.sess = 0;
  ui.v = 'in';
  ui.cart = false;
  save();
  setHash('');
  render();
};
