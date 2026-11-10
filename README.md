# 🔥 Assados Fênix Delivery

> Plataforma web para gerenciamento e automação do processo de pedidos e entregas do restaurante **Fênix Casa dos Assados**.

![Status](https://img.shields.io/badge/status-em%20desenvolvimento-orange)
![Tipo](https://img.shields.io/badge/tipo-aplica%C3%A7%C3%A3o%20web%20responsiva-blue)
![Back-end](https://img.shields.io/badge/back--end-PHP-777BB4)
![Front-end](https://img.shields.io/badge/front--end-HTML5%20%7C%20CSS3%20%7C%20JS-E34F26)
![Banco](https://img.shields.io/badge/banco-Oracle%20%7C%20MariaDB-red)

Projeto desenvolvido na disciplina **Projeto Integrador I** do curso Superior de Tecnologia em **Análise e Desenvolvimento de Sistemas** da **Faculdade de Tecnologia de Mogi das Cruzes (FATEC)**, em parceria com um negócio real da comunidade externa.

---

## 📑 Sumário

- [Sobre o projeto](#-sobre-o-projeto)
- [O problema](#-o-problema)
- [A solução](#-a-solução)
- [Funcionalidades](#-funcionalidades)
- [Perfis de usuário](#-perfis-de-usuário)
- [Tecnologias](#-tecnologias)
- [Engenharia de requisitos](#-engenharia-de-requisitos)
- [Modelagem](#-modelagem)
- [Estrutura do repositório](#-estrutura-do-repositório)
- [Como executar](#-como-executar)
- [Equipe](#-equipe)
- [Licença](#-licença)

---

## 📖 Sobre o projeto

O **Assados Fênix Delivery** centraliza todo o ciclo de atendimento do restaurante Fênix Casa dos Assados, localizado na divisa entre **Guararema** e **Santa Branca (SP)**: da consulta ao cardápio até a entrega final do pedido, passando por carrinho, pagamento, acompanhamento de status, estoque de bebidas e indicadores gerenciais.

## ❗ O problema

Hoje, a gestão de pedidos e entregas do restaurante é feita de forma descentralizada, via **Instagram, WhatsApp e telefone**. Com o aumento da demanda, esse modelo gera desorganização operacional. Por outro lado, marketplaces como o iFood cobram comissões elevadas, o que se tornou inviável para o momento financeiro da empresa.

## 💡 A solução

Uma **plataforma web responsiva**, de marca própria, que:

- substitui o fluxo manual por WhatsApp/Instagram;
- elimina a dependência de marketplaces de terceiros e de suas comissões;
- é acessada direto pelo navegador, **sem necessidade de instalar aplicativo nativo**;
- é composta por dois módulos principais:
  - **Portal do cliente:** cardápio, carrinho, escolha entre entrega e retirada, pagamento e acompanhamento do pedido;
  - **Painel administrativo:** gestão de catálogo, pedidos, clientes, usuários, estoque e dashboards.

## ✨ Funcionalidades

- 🔐 Cadastro, login e redirecionamento automático por perfil
- 🍗 Catálogo com fotos, descrições, preços e filtro por categoria (Assados, Bebidas, Guarnições)
- 🛒 Carrinho de compras (preservado por pelo menos 2 horas em caso de falha ou fechamento acidental)
- 🛵 Delivery com **taxa calculada pela distância** (integração com API do Google Maps) ou retirada no balcão
- 💳 Pagamento via **PIX** (com envio de comprovante), **Cartão** (crédito/débito) ou **Dinheiro** (com cálculo de troco)
- 📡 Acompanhamento do status do pedido em tempo real: *Em Preparo → Em Rota → Entregue*
- 🧾 Histórico de compras do cliente (e histórico geral para o administrador)
- 📋 Painel de pedidos com validação de comprovantes PIX e atribuição de entregadores
- 🚚 Fila de entregas dedicada ao entregador, com endereço, rota e necessidade de troco/maquininha
- 🥤 Controle de estoque de bebidas, com baixa automática a cada pedido e estorno em caso de cancelamento
- 📊 Dashboards com filtros diário, semanal, mensal e anual, e exportação de relatórios
- 👥 Gerenciamento de perfis de acesso e inativação de usuários

## 👥 Perfis de usuário

| Perfil | Responsabilidades |
| --- | --- |
| **Cliente** | Realiza pedidos, acompanha entregas e gerencia sua conta. |
| **Administrador** | Gerencia catálogo, estoque, pedidos, usuários e perfis; acessa os dashboards. |
| **Atendente** | Atendimento no balcão, retirada de pedidos, validação de comprovantes, atualização de status e apoio ao estoque de bebidas. |
| **Entregador** | Consulta a fila de entregas e atualiza os status *Em Rota* e *Entregue*. |
| **Sistema de Pagamento** *(ator externo)* | Processa pagamentos via cartão/PIX. |

Após o login, cada perfil é direcionado à sua interface: **Cliente → Catálogo**, **Entregador → Fila de Entregas**, **Atendente → Painel de Pedidos**, **Administrador → Painel de Gestão e Dashboards**.

## 🛠️ Tecnologias

| Camada | Tecnologia |
| --- | --- |
| Front-end | HTML5, CSS3 e JavaScript (layout responsivo via CSS) |
| Back-end | PHP |
| Banco de dados (desenvolvimento) | Oracle Database |
| Banco de dados (produção) | MariaDB (compatível com hospedagem compartilhada) |
| Integração externa | API do Google Maps (distância e taxa de entrega) |
| Prototipação | Figma |
| Hospedagem prevista | Hospedagem compartilhada (ex.: HostGator ou similar) |

## 📐 Engenharia de requisitos

Os requisitos foram levantados em entrevistas com o proprietário do estabelecimento.

### Requisitos funcionais

| ID | Requisito | Obrigatório |
| --- | --- | :---: |
| RF001 | Manter Usuário | ✅ |
| RF002 | Realizar Login | ✅ |
| RF003 | Gerenciar Catálogo | ✅ |
| RF004 | Visualizar Catálogo | ✅ |
| RF005 | Manter Carrinho de Compras | ✅ |
| RF006 | Realizar Pedido | ✅ |
| RF007 | Realizar Pagamento | ✅ |
| RF008 | Visualizar Status do Pedido | ✅ |
| RF009 | Gerenciar Pedidos | ✅ |
| RF010 | Visualizar Histórico de Compras | ❌ |
| RF011 | Gerenciar Estoque de Bebidas | ❌ |
| RF012 | Coletar Dados de Compras dos Clientes (dashboards) | ❌ |
| RF013 | Gerenciar Perfis de Acesso | ✅ |
| RF014 | Visualizar e Gerenciar Fila de Entregas | ✅ |

### Requisitos não funcionais (ISO/IEC 25010)

| Categoria | Destaques |
| --- | --- |
| **Confiabilidade** | Disponibilidade contínua do cardápio (RNF01); carrinho preservado por ≥ 2 h (RNF02); rotinas de backup (RNF03). |
| **Usabilidade** | Ações principais em destaque (RNF04); terminologia padrão de apps de delivery (RNF05); validação de campos como CEP, e-mail e telefone (RNF06). |
| **Desempenho** | Tempo de carregamento inferior a 3 segundos por tela, mesmo em picos de acesso (RNF07). |
| **Segurança** | Conformidade com a LGPD (RNF08); controle de alterações por perfil (RNF09); senhas com hash irreversível (RNF10). |
| **Compatibilidade** | Integração via API com serviços externos como Google Maps (RNF11). |
| **Portabilidade** | Interface totalmente responsiva (RNF12); acesso direto pelo navegador, sem app nativo (RNF13). |

### Principais regras de negócio

| ID | Regra |
| --- | --- |
| RN01 | Entregas apenas dentro da área de cobertura pré-definida da loja, em Santa Branca. |
| RN02 | Frete calculado dinamicamente pela quilometragem entre o restaurante e o destino. |
| RN03 | Cancelamento pelo cliente somente antes do status *Em Preparo*. |
| RN04 | Dashboard (RF012) e gestão de perfis (RF013) restritos ao Administrador; painel de pedidos e estoque compartilhados com o Atendente. |
| RN05 | E-mail e telefone únicos no cadastro. |
| RN06 | Produtos esgotados aparecem no catálogo, porém com o botão de compra desabilitado. |
| RN07 | Novos pedidos apenas dentro do horário de funcionamento configurado. |
| RN08 | Retirada presencial ignora a área de cobertura e zera a taxa de entrega. |
| RN09 | Pedidos via PIX só avançam para *Em Preparo* após conferência do comprovante. |
| RN10 | Cadastro público gera sempre o perfil Cliente; demais perfis só são criados no painel administrativo. |
| RN11 | Redirecionamento exclusivo para a interface do perfil após o login. |
| RN12 | Dashboards com dados agregados e anonimizados (LGPD). |
| RN13 | Indicadores consideram apenas pedidos efetivados e finalizados. |
| RN14 | Entregador altera apenas *Aguardando Retirada → Em Rota* e *Em Rota → Entregue*. |
| RN15 | Um pedido delivery é vinculado a um único entregador por vez. |
| RN16 | Entregador confirma no app o recebimento de pagamentos presenciais. |
| RN17 | Apenas entregadores com cadastro *Ativo* veem a fila de entregas. |
| RN18 | Baixa automática de estoque ao confirmar o pedido e estorno em caso de cancelamento. |

## 🧩 Modelagem

A documentação completa de modelagem está em [`docs/`](./docs) e contempla:

- **Diagrama de Casos de Uso** — 14 casos de uso documentados (UC001 a UC014, incluindo os subfluxos `<<extend>>` de cálculo de taxa de entrega e de pagamento por PIX, Cartão e Dinheiro);
- **Diagrama de Classes** — `Usuario` (abstrata) e especializações `Cliente`, `Atendente` e `Entregador`, além de `Produto`, `Carrinho`, `Pedido`, `Pagamento` e `ItemPedido`;
- **Diagrama de Atividades** — fluxo operacional do pedido, do carrinho à entrega;
- **Diagrama BPMN** — raias de Cliente, Atendente, Cozinheiro e Entregador, além do Sistema de Pagamento.

<!-- Adicione as imagens dos diagramas em docs/images/ e descomente as linhas abaixo -->
<!--
![Casos de Uso](docs/images/casos-de-uso.png)
![Diagrama de Classes](docs/images/diagrama-de-classes.png)
![Diagrama de Atividades](docs/images/diagrama-de-atividades.png)
![BPMN](docs/images/bpmn.png)
-->

### Ciclo de vida do pedido

```text
Carrinho → Finalizar pedido → Pagamento confirmado → Em Preparo → (Em Rota) → Entregue
                                     │
                                     └─ PIX: aguarda conferência do comprovante (RN09)
```

## 📁 Estrutura do repositório

> Sugestão de organização — ajuste conforme a evolução do projeto.

```text
assados-fenix-delivery/
├── docs/                 # Documentação do projeto (requisitos, diagramas, relatório)
│   └── images/           # Imagens dos diagramas e telas
├── src/                  # Código-fonte (PHP, HTML, CSS, JS)
├── database/             # Scripts SQL (Oracle e MariaDB)
└── README.md
```

## 🚀 Como executar

> ⚠️ O projeto está em desenvolvimento. As instruções abaixo serão atualizadas conforme o código for publicado.

**Pré-requisitos (previstos)**

- PHP 8.x
- MariaDB (ou Oracle Database, no ambiente acadêmico)
- Servidor web local (Apache/XAMPP ou similar)
- Chave de API do Google Maps

**Passos**

```bash
# 1. Clone o repositório
git clone https://github.com/<seu-usuario>/assados-fenix-delivery.git
cd assados-fenix-delivery

# 2. Crie o banco de dados e importe os scripts de /database

# 3. Configure as credenciais do banco e a chave da API do Google Maps

# 4. Sirva a pasta /src pelo servidor web e acesse no navegador
```

## 👨‍💻 Equipe

| Integrante |
| --- |
| Davi Cortez Morais |
| Davi Lucas Nogueira Rabelo Andrade |
| Leonardo Mallet de Oliveira Campos |
| Pedro Henrique Lopes de Oliveira |
| Raul Pedrogan de Moura |
| Raul Velasco Candido Roberto |

**Orientador:** Prof. Gilberto Jose da Cunha
**Coorientadora:** Prof.ª Ana Rosa Coiahy Tonão

**Instituição:** Faculdade de Tecnologia de Mogi das Cruzes — Curso de Tecnologia em Análise e Desenvolvimento de Sistemas · Mogi das Cruzes, SP · 2026

## 📄 Licença

Projeto acadêmico desenvolvido para fins educacionais. Defina aqui a licença desejada (por exemplo, MIT) ou mantenha todos os direitos reservados aos autores e ao estabelecimento parceiro.
