/**
 * DADOS — configurações, dados iniciais de demonstração e armazenamento (localStorage)
 */
'use strict';

/* ============================================================
 * CONFIGURAÇÕES, PERFIS E ARMAZENAMENTO
 * ============================================================ */

/** Nomes de exibição de cada perfil de acesso. */
const PN = {
  cliente: 'Cliente',
  atendente: 'Atendente',
  entregador: 'Entregador',
  administrador: 'Administrador',
};

/** Menu de cada perfil: [rota, rótulo, ícone]. A primeira rota de cada perfil é a sua tela inicial. */
const NAV = {
  cliente: [
    ['cardapio', 'Cardápio', 'livro'],
    ['pedido', 'Meu Pedido', 'relogio'],
    ['historico', 'Histórico', 'historico'],
  ],
  atendente: [
    ['fila', 'Fila de Pedidos', 'fila'],
    ['estoque', 'Estoque', 'garrafa'],
  ],
  entregador: [['entregas', 'Minhas Entregas', 'moto']],
  administrador: [
    ['dashboard', 'Dashboard', 'grafico'],
    ['fila', 'Fila de Pedidos', 'fila'],
    ['estoque', 'Estoque', 'garrafa'],
    ['catalogo', 'Catálogo', 'livro'],
    ['perfis', 'Perfis de Acesso', 'perfis'],
  ],
};

/** Subtítulo exibido no cabeçalho de cada perfil. */
const SUB = {
  cliente: 'Delivery e retirada · Santa Branca/SP',
  atendente: 'Painel Operacional',
  entregador: 'Painel do Entregador',
  administrador: 'Painel de Gestão',
};

/** Ícone de cada forma de pagamento. */
const PG = { Pix: 'check', Cartão: 'cartao', Dinheiro: 'dinheiro' };

/** Endereço do restaurante, usado nos pedidos para retirada. */
const BALCAO = 'Retirada no balcão — Rua Principal, 45, Santa Branca/SP';

/** Constantes: milissegundos em um dia, chave do localStorage e cópia em memória (reserva). */
const DAY = 864e5,
  K = 'fenix-site-v2',
  mem = {};

/** Armazenamento: usa o localStorage e, se o navegador o bloquear, guarda os dados só em memória. */
const ls = (() => {
  try {
    localStorage.setItem('_t', '1');
    return localStorage;
  } catch (e) {
    return {
      getItem: (k) => mem[k] || null,
      setItem: (k, v) => {
        mem[k] = v;
      },
    };
  }
})();

/* ============================================================
 * DADOS DE DEMONSTRAÇÃO
 * ============================================================ */

/** Produtos iniciais do cardápio: [nome, categoria, subcategoria, preço, descrição, disponível, estoque]. */
const P0 = [
  [
    'Frango Assado Inteiro',
    'Assados',
    'Frango',
    62.9,
    'Frango caipira assado na brasa, temperado com ervas e alho.',
    1,
    null,
  ],
  [
    'Meio Frango Assado',
    'Assados',
    'Frango',
    34.9,
    'Metade do frango caipira assado na brasa, com tempero especial.',
    1,
    null,
  ],
  [
    'Coxa e Sobrecoxa (2un)',
    'Assados',
    'Frango',
    22.9,
    'Duas unidades de coxa e sobrecoxa temperadas e grelhadas.',
    1,
    null,
  ],
  [
    'Costela Bovina na Brasa',
    'Assados',
    'Bovina',
    79.9,
    'Costela bovina assada lentamente na brasa por 6 horas.',
    0,
    null,
  ],
  [
    'Picanha Grelhada',
    'Assados',
    'Bovina',
    89.9,
    'Picanha fatiada, grelhada no ponto e finalizada com flor de sal.',
    1,
    null,
  ],
  [
    'Costelinha Suína Defumada',
    'Assados',
    'Suína',
    54.9,
    'Costelinha suína defumada lentamente, com molho barbecue da casa.',
    1,
    null,
  ],
  [
    'Linguiça Toscana Artesanal',
    'Assados',
    'Suína',
    24.9,
    'Linguiça toscana artesanal grelhada na brasa, porção com 4 unidades.',
    1,
    null,
  ],
  [
    'Batata Frita Grande',
    'Guarnições',
    'Guarnição',
    18.9,
    'Porção grande de batata frita crocante e bem temperada.',
    1,
    null,
  ],
  [
    'Farofa Especial da Casa',
    'Guarnições',
    'Guarnição',
    12.9,
    'Farofa com bacon, ovos e temperos selecionados.',
    1,
    null,
  ],
  [
    'Arroz e Feijão Tropeiro',
    'Guarnições',
    'Guarnição',
    10.9,
    'Porção de arroz branco soltinho com feijão tropeiro da casa.',
    1,
    null,
  ],
  [
    'Vinagrete Fresco',
    'Guarnições',
    'Guarnição',
    8.9,
    'Vinagrete fresco de tomate, cebola e pimentão.',
    1,
    null,
  ],
  [
    'Maionese Especial',
    'Guarnições',
    'Guarnição',
    14.9,
    'Maionese cremosa da casa com batata palha.',
    1,
    null,
  ],
  [
    'Refrigerante Lata 350ml',
    'Bebidas',
    'Refrigerante',
    6.9,
    'Lata gelada, sabores cola, guaraná ou laranja.',
    1,
    42,
  ],
  [
    'Refrigerante 2L',
    'Bebidas',
    'Refrigerante',
    14.9,
    'Garrafa de 2 litros, ideal para compartilhar.',
    1,
    18,
  ],
  [
    'Energético 473ml',
    'Bebidas',
    'Energético',
    11.9,
    'Lata gelada, dá aquele gás para o resto do dia.',
    1,
    6,
  ],
  ['Água Mineral 500ml', 'Bebidas', 'Água', 4.9, 'Água mineral sem gás, gelada.', 1, 35],
  [
    'Suco Natural 500ml',
    'Bebidas',
    'Água / Suco',
    9.9,
    'Suco natural da fruta do dia, sem adição de açúcar.',
    1,
    12,
  ],
  [
    'Cerveja Long Neck 355ml',
    'Bebidas',
    'Alcoólica',
    9.9,
    'Cerveja pilsen gelada, garrafa long neck.',
    1,
    0,
  ],
];

/** Cria os dados iniciais: usuários, categorias, produtos e histórico de pedidos. O sorteio usa semente fixa, então os dados são sempre os mesmos. */
function seed() {
  let r = 7;
  const rnd = () => (r = (r * 16807) % 2147483647) / 2147483647,
    now = Date.now();
  const end = [
    { r: 'Casa', t: 'Rua das Palmeiras, 120 – Centro, Santa Branca/SP', x: 8 },
    { r: 'Trabalho', t: 'Av. Central, 500 – Santa Branca/SP', x: 10 },
  ];
  const users = [
    [1, 'Ana Beatriz Souza', 'cliente@fenix.com', '(11) 91234-5678', 'cliente'],
    [2, 'Juliana Costa', 'juliana.costa@email.com', '(11) 98877-6655', 'cliente'],
    [3, 'Marina Silva', 'atendente@fenix.com', '(11) 97766-5544', 'atendente'],
    [4, 'Rafael Torres', 'admin@fenix.com', '(11) 96655-4433', 'administrador'],
    [5, 'Carlos Mendes', 'entregador@fenix.com', '(11) 95544-3322', 'entregador'],
    [6, 'Bruno Teixeira', 'bruno.teixeira@fenix.com', '(11) 94433-2211', 'entregador'],
    [7, 'Diego Ferreira', 'diego.ferreira@fenix.com', '(11) 93322-1100', 'entregador'],
    [8, 'Paulo Vitor', 'paulo.vitor@fenix.com', '(11) 92211-0099', 'entregador'],
    [9, 'Camila Rocha', 'camila.rocha@email.com', '(11) 97111-2201', 'cliente'],
    [10, 'Pedro Henrique Lima', 'pedro.lima@email.com', '(11) 97111-2202', 'cliente'],
    [11, 'Fernanda Alves', 'fernanda.alves@email.com', '(11) 97111-2203', 'cliente'],
    [12, 'Marcos Paulo Dias', 'marcos.dias@email.com', '(11) 97111-2204', 'cliente'],
    [13, 'Roberto Lima', 'roberto.lima@email.com', '(11) 97111-2205', 'cliente'],
    [14, 'Patrícia Nunes', 'patricia.nunes@email.com', '(11) 97111-2206', 'cliente'],
    [15, 'Diego Santos', 'diego.santos@email.com', '(11) 97111-2207', 'cliente'],
    [16, 'Luciana Prado', 'luciana.prado@email.com', '(11) 97111-2208', 'cliente'],
  ].map(([id, nome, email, tel, perfil]) => ({
    id,
    nome,
    email,
    tel,
    perfil,
    senha: '123456',
    ativo: id != 8,
    disp: true,
    end: perfil == 'cliente' ? end : [],
    cartoes: perfil == 'cliente' ? ['Mastercard crédito •••• 4482', 'Visa débito •••• 1129'] : [],
  }));
  const cats = [
    { n: 'Assados', subs: ['Bovina', 'Frango', 'Suína'] },
    { n: 'Bebidas', subs: ['Água', 'Alcoólica', 'Energético', 'Refrigerante', 'Suco'], est: true },
    { n: 'Guarnições', subs: ['Guarnição'] },
  ];
  const prods = P0.map((p, i) => ({
    id: i + 1,
    n: p[0],
    c: p[1],
    s: p[2] == 'Água / Suco' ? 'Suco' : p[2],
    p: p[3],
    d: p[4],
    disp: !!p[5],
    ...(p[6] != null ? { est: p[6] } : {}),
  }));
  const O = [];
  for (let i = 0; i < 150; i++) {
    const it = Array.from({ length: 1 + ((rnd() * 3) | 0) }, () => {
      const p = prods[(rnd() * prods.length) | 0];
      return { pid: p.id, n: p.n, q: 1 + ((rnd() * 2) | 0), p: p.p };
    });
    const tipo = rnd() < 0.68 ? 'Delivery' : 'Retirada';
    O.push({
      uid: i < 5 ? 1 : [2, 9, 10, 11, 12, 13, 14, 15, 16][(rnd() * 9) | 0],
      itens: it,
      tipo,
      end: tipo == 'Delivery' ? end[0].t : BALCAO,
      pg: ['Pix', 'Pix', 'Cartão', 'Cartão', 'Dinheiro'][(rnd() * 5) | 0],
      troco: 0,
      pixOk: true,
      taxa: tipo == 'Delivery' ? 8 : 0,
      st: i % 41 == 7 ? 'Cancelado' : 'Entregue',
      t:
        now -
        (i < 5 ? (i + 1) * 2.5 * DAY : i < 12 ? rnd() * 20 * 36e5 : rnd() * rnd() * 365 * DAY),
    });
  }
  O.sort((a, b) => a.t - b.t).forEach((o, i) => (o.id = 2700 + i));
  let id = 2700 + O.length;
  const mk = (uid, its, tipo, pg, st, ex) =>
    O.push({
      id: id++,
      uid,
      itens: its.map(([q, n]) => {
        const p = prods[q - 1];
        return { pid: q, n: p.n, q: n, p: p.p };
      }),
      tipo,
      end: tipo == 'Delivery' ? end[0].t : BALCAO,
      pg,
      troco: 0,
      pixOk: pg != 'Pix',
      taxa: tipo == 'Delivery' ? 8 : 0,
      st,
      t: now - ex.m * 6e4,
      ...ex,
    });
  mk(
    1,
    [
      [1, 1],
      [9, 1],
    ],
    'Retirada',
    'Pix',
    'Recebido',
    { m: 2, pixOk: false },
  );
  mk(2, [[6, 1]], 'Delivery', 'Dinheiro', 'Em Preparo', { m: 9, troco: 60 });
  mk(
    2,
    [
      [5, 1],
      [17, 1],
    ],
    'Delivery',
    'Cartão',
    'Em Rota',
    { m: 14, ent: 5 },
  );
  mk(1, [[7, 2]], 'Retirada', 'Cartão', 'Pronto', { m: 10 });
  mk(
    2,
    [
      [2, 1],
      [8, 1],
    ],
    'Retirada',
    'Pix',
    'Em Preparo',
    { m: 6, pixOk: true },
  );
  return {
    users,
    cats,
    prods,
    orders: O,
    carts: {},
    sess: 0,
    mov: [
      { t: now - 3 * 6e4, txt: 'Baixa automática — Pedido #2851 (Refrigerante 2L)', v: -1 },
      { t: now - DAY, txt: 'Estorno automático — Pedido #2788 (Refrigerante Lata 350ml)', v: 2 },
      {
        t: now - 1.2 * DAY,
        txt: 'Ajuste manual por Marina — reposição de fornecedor (Refrigerante Lata 350ml)',
        v: 24,
      },
    ],
  };
}

/* ============================================================
 * ESTADO GLOBAL DA APLICAÇÃO
 * ============================================================ */

/** Estado completo do sistema (usuários, categorias, produtos, pedidos, carrinhos e estoque). */
let S;

/** Carrega o estado salvo; se não houver (ou estiver corrompido), começa com os dados iniciais. */
try {
  S = JSON.parse(ls.getItem(K));
} catch (e) {}

S = S || seed();

/** Grava o estado no armazenamento. Chamada após toda alteração de dados. */
const save = () => ls.setItem(K, JSON.stringify(S));
