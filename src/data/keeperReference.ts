import { Mystery, Threat, CountdownStageKey } from '../types/motw';

export interface KeeperMoveItem {
  id: string;
  name: string;
  category: 'suave' | 'duro';
  description: string;
}

export const KEEPER_AGENDA = [
  'Fazer o mundo parecer real e misterioso.',
  'Fazer a vida dos caçadores ser perigosa, imprevisível e emocionante.',
  'Jogar para descobrir o que acontece (sem planejar desfechos pré-determinados).',
];

export const KEEPER_PRINCIPLES = [
  'Coloque o horror na vida cotidiana.',
  'Trate todos como seres humanos reais com motivações próprias.',
  'Faça perguntas e construa a narrativa sobre as respostas dos caçadores.',
  'Às vezes dê a eles exatamente o que querem, com um custo surpreendente.',
  'Torne os monstros bizarros, aterrorizantes e genuinamente perigosos.',
  'Nunca mostre as engrenagens por trás do escudo do Guardião.',
  'Nomeie cada vítima, cada testemunha e cada canto sombrio da cidade.',
];

export const KEEPER_BASIC_MOVES: KeeperMoveItem[] = [
  {
    id: 'separar_o_grupo',
    name: 'Separar o Grupo',
    category: 'suave',
    description: 'Tranque portas, faça o chão desmoronar ou faça uma ligação urgente isolando um dos caçadores.',
  },
  {
    id: 'revelar_perigo_futuro',
    name: 'Revelar Perigo Futuro',
    category: 'suave',
    description: 'Mostre arranhões profundos na parede, fumaça saindo do bueiro ou o relógio avançando.',
  },
  {
    id: 'causar_dano_estabelecido',
    name: 'Causar Dano Conforme Estabelecido',
    category: 'duro',
    description: 'O monstro golpeia com suas garras, presas ou poderes sem necessidade de rolagem de ataque do mestre.',
  },
  {
    id: 'tirar_algo_deles',
    name: 'Tirar Coisas Deles',
    category: 'duro',
    description: 'A arma cai no esgoto escuro, o celular quebra na queda ou a bateria da lanterna se esgota.',
  },
  {
    id: 'avancar_contagem_regressiva',
    name: 'Avançar a Contagem Regressiva',
    category: 'duro',
    description: 'O relógio do mistério avança para o próximo estágio tenebroso (ex: de Sombras para Entardecer).',
  },
  {
    id: 'colocar_alguem_em_apuros',
    name: 'Colocar Alguém em Apuros',
    category: 'suave',
    description: 'Um espectador inocente, testemunha ou parceiro fica encurralado na mira do monstro.',
  },
  {
    id: 'fazer_algo_fora_de_cena',
    name: 'Fazer Algo Maligno Fora de Cena',
    category: 'suave',
    description: 'Um novo corpo é encontrado na represa ou as luzes da cidade inteira se apagam de repente.',
  },
  {
    id: 'virar_o_movimento_contra_eles',
    name: 'Virar o Movimento Contra Eles',
    category: 'duro',
    description: 'A magia atrai a criatura, a bala ricocheteia no cano de gás ou o blefe irrita a máfia local.',
  },
];

export const THREAT_CATEGORIES_INFO = {
  monstro: {
    label: 'Monstro',
    description: 'A ameaça principal do mistério que deve ser descoberta e destruída através de sua fraqueza.',
    motivations: [
      'Fera (destruir presas e dominar território)',
      'Devorador (consumir carne, almas ou memórias)',
      'Criador (reproduzir, contaminar e gerar prole)',
      'Parasita (controlar hospedeiros vivos)',
      'Colecionador (acumular vítimas ou artefatos)',
      'Traidor (infiltrar-se e destruir por dentro)',
      'Tentador (corromper pessoas inocentes)',
    ],
  },
  lacaio: {
    label: 'Lacaio',
    description: 'Serviçais, animais corrompidos ou cultistas que servem aos interesses do monstro.',
    motivations: [
      'Assassino (eliminar os caçadores diretamente)',
      'Guardião (proteger o covil ou a fraqueza)',
      'Olheiro (espionar e avisar o monstro)',
      'Distração (atrair os caçadores para armadilhas)',
      'Devoto (adoração fanática ao monstro)',
    ],
  },
  espectador: {
    label: 'Espectador',
    description: 'Pessoas normais apanhadas no fogo cruzado, testemunhas ou autoridades locais.',
    motivations: [
      'Cético (recusar-se a acreditar no sobrenatural)',
      'Vítima Oficial (polícia ou detetive intrometido)',
      'Fofoqueiro (espalhar boatos que atraem o perigo)',
      'Ajudante (quer genuinamente auxiliar os caçadores)',
      'Pânico (fugir e causar caos colateral)',
    ],
  },
  local: {
    label: 'Local',
    description: 'Ambientes assombrados, florestas densas, hospitais abandonados ou covis tenebrosos.',
    motivations: [
      'Covil (proteger o monstro e emboscar invasores)',
      'Prisão (impedir que qualquer um escape)',
      'Encruzilhada (conectar diferentes caminhos ou dimensões)',
      'Fortificação (difícil de penetrar ou invadir)',
      'Ermo (desorientar e desgastar os caçadores)',
    ],
  },
};

export const COUNTDOWN_STAGE_LABELS: Record<CountdownStageKey, string> = {
  dia: 'Dia (O primeiro vislumbre ou crime)',
  sombras: 'Sombras (O perigo começa a crescer)',
  entardecer: 'Entardecer (A ameaça se consolida)',
  poente: 'Poente (As primeiras baixas graves)',
  anoitecer: 'Anoitecer (O ponto sem retorno se aproxima)',
  meia_noite: 'Meia-noite (O ápice do terror e catástrofe)',
};

export const END_OF_SESSION_QUESTIONS = [
  {
    id: 'concluiram_misterio',
    question: 'Eles concluíram ou solucionaram o mistério atual?',
    description: 'Se sim, cada caçador marca 1 ponto de experiência.',
  },
  {
    id: 'salvaram_alguem',
    question: 'Eles salvaram alguém de um destino terrível ou da morte?',
    description: 'Se sim, cada caçador marca 1 ponto de experiência.',
  },
  {
    id: 'aprenderam_sobre_monstros',
    question: 'Eles aprenderam algo novo sobre o mundo sobrenatural ou sobre as fraquezas dos monstros?',
    description: 'Se sim, cada caçador marca 1 ponto de experiência.',
  },
  {
    id: 'aprofundaram_lacos',
    question: 'Eles aprenderam algo novo sobre um dos caçadores ou aprofundaram seus laços pessoais?',
    description: 'Se sim, cada caçador marca 1 ponto de experiência.',
  },
];

export const STARTER_MYSTERY: Mystery = {
  id: 'misterio_esgotando_o_prazo',
  title: 'Esgotando o Prazo',
  concept: 'Um antigo espírito da floresta foi despertado pelo desmatamento nas colinas e exige vingança sangrenta contra a empreiteira local.',
  hook: 'O corpo de um engenheiro de obras foi encontrado suspenso a 15 metros de altura preso na copa de um pinheiro centenário, completamente desidratado e com galhos brotando de suas costelas.',
  notes: 'O espírito não pode ser ferido com armas comuns; sua fraqueza é o fogo de carvalho antigo colhido em solo consagrado.',
  currentStage: 'dia',
  isSolved: false,
  countdown: [
    {
      stage: 'dia',
      label: 'Dia',
      description: 'O corpo do engenheiro é descoberto; a polícia local suspeita de suicídio bizarro ou assassinato ritual.',
      isTriggered: true,
    },
    {
      stage: 'sombras',
      label: 'Sombras',
      description: 'Raízes começam a romper o asfalto da rodovia estadual que corta a serra, provocando acidentes inexplicáveis.',
      isTriggered: false,
    },
    {
      stage: 'entardecer',
      label: 'Entardecer',
      description: 'Três operários do canteiro de obras desaparecem no nevoeiro espesso que desce subitamente da mata.',
      isTriggered: false,
    },
    {
      stage: 'poente',
      label: 'Poente',
      description: 'A criatura ataca a subestação de energia da cidadezinha, mergulhando o hospital e as ruas em escuridão total.',
      isTriggered: false,
    },
    {
      stage: 'anoitecer',
      label: 'Anoitecer',
      description: 'O espírito vegetal invade a sede da empresa madeireira, prendendo o diretor executivo em um casulo de espinhos venenosos.',
      isTriggered: false,
    },
    {
      stage: 'meia_noite',
      label: 'Meia-noite',
      description: 'A vegetação ancestral engole a vila inteira, transformando os moradores em estátuas de madeira petrificada.',
      isTriggered: false,
    },
  ],
  threats: [
    {
      id: 'ameaca_espirito_raiz',
      name: 'O Guardião das Raízes (Leshy da Serra)',
      type: 'monstro',
      motivation: 'Fera (expulsar invasores e recuperar seu solo sagrado)',
      appearance: 'Um ser imponente de 3 metros feito de musgo, troncos retorcidos, olhos de seiva brilhante e galhos pontiagudos.',
      description: 'Espírito ancestral guardião dos bosques esquecidos.',
      powers: 'Camuflagem vegetal absoluta na mata, controle de raízes do solo, regeneração através da terra úmida.',
      weaknesses: 'Fogo purificador alimentado por carvalho antigo e água benta.',
      attacks: 'Garras de espinho (3-dano íntimo perfurante), Chicote de cipós (2-dano perto preensil).',
      armour: 2,
      harmMax: 10,
      harmCurrent: 0,
      customMoves: 'Emaranhar: Quando atingir um alvo, prende-o em raízes até que ele passe num teste de Agir sob Pressão.',
      isRevealedToHunters: false,
    },
    {
      id: 'ameaca_corvos_olheiros',
      name: 'Bando de Corvos Espiões',
      type: 'lacaio',
      motivation: 'Olheiro (vigiar os caçadores e alertar o guardião)',
      appearance: 'Revoada de dezenas de corvos com olhos leitosos fosforescentes.',
      description: 'Aves corrompidas pela seiva do espírito.',
      attacks: 'Bicadas em massa (1-dano íntimo cegante).',
      harmMax: 4,
      harmCurrent: 0,
      isRevealedToHunters: false,
    },
    {
      id: 'ameaca_xerife_cezar',
      name: 'Xerife Cézar Toledo',
      type: 'espectador',
      motivation: 'Cético (tentar abafar o caso para não afugentar os turistas da festa da maçã)',
      appearance: 'Homem na faixa dos 50 anos, bigode espesso, farda surrada e olhar desconfiado de forasteiros.',
      description: 'Autoridade policial local hostil a investigadores armados.',
      isRevealedToHunters: true,
    },
    {
      id: 'ameaca_canteiro_obras',
      name: 'Canteiro de Obras da Construtora Serra Alta',
      type: 'local',
      motivation: 'Covil (onde a profanação do solo começou)',
      appearance: 'Tratores cobertos de lama e folhas secas, barracões metálicos e uma clareira devastada cheia de tocos arrancados.',
      description: 'O epicentro da fúria do monstro.',
      isRevealedToHunters: true,
    },
  ],
};
