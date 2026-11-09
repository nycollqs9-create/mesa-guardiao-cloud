import { PlaybookId, Ratings, WeaponOption, PlaybookMove } from '../types/motw';

export interface PlaybookDefinition {
  id: PlaybookId;
  name: string;
  subtitle: string;
  quote: string;
  description: string;
  ratingsOptions: Array<{ label: string; ratings: Ratings }>;
  looks: {
    eyes: string[];
    faces: string[];
    clothes: string[];
    body?: string[];
  };
  startingMovesCount: number;
  availableMoves: PlaybookMove[];
  specialFeature: {
    key: string;
    title: string;
    description: string;
    optionsTemplate: Record<string, any>;
  };
  defaultWeapons: WeaponOption[];
  improvements: string[];
}

export const MOTW_PLAYBOOKS: Record<PlaybookId, PlaybookDefinition> = {
  arcano: {
    id: 'arcano',
    name: 'O Arcano',
    subtitle: 'Mago de Combate / Feiticeiro Treinado',
    quote: 'Lutar contra monstros com armas normais é para amadores. Eu prefiro fogo elemental.',
    description: 'Um conjurador que usa magia como arma destrutiva, dominando forças místicas voláteis.',
    ratingsOptions: [
      { label: 'Destrutivo', ratings: { Braveza: 2, Esperteza: 0, Estranheza: 2, Firmeza: -1, Sutileza: 0 } },
      { label: 'Estrategista', ratings: { Braveza: 1, Esperteza: 1, Estranheza: 2, Firmeza: 0, Sutileza: -1 } },
      { label: 'Focado', ratings: { Braveza: 0, Esperteza: 0, Estranheza: 2, Firmeza: 1, Sutileza: 0 } },
      { label: 'Intempestivo', ratings: { Braveza: 2, Esperteza: -1, Estranheza: 2, Firmeza: 0, Sutileza: 0 } },
    ],
    looks: {
      eyes: ['Olhar penetrante', 'Olhos faiscantes', 'Olhos cansados', 'Olhos misteriosos'],
      faces: ['Rosto jovem e confiante', 'Rosto marcado por rituais', 'Feições aristocráticas', 'Rosto impassível'],
      clothes: ['Sobretudo com bolsos secretos', 'Roupas escuras modernas', 'Traje com símbolos ocultos', 'Estilo boêmio'],
    },
    startingMovesCount: 3,
    availableMoves: [
      {
        id: 'magia_avancada',
        name: 'Magia de Combate Aprimorada',
        rating: 'Estranheza',
        isDefault: true,
        requiresRoll: false,
        description: 'Você pode conjurar ataques mágicos elementais diretos como se fossem armas devastadoras.',
      },
      {
        id: 'ferramentas_e_tecnicas',
        name: 'Ferramentas e Técnicas',
        rating: 'Estranheza',
        requiresRoll: false,
        description: 'Ao usar varinhas, grimórios ou amuletos, você ganha +1 contínuo ao Usar Magia.',
      },
      {
        id: 'terceiro_olho',
        name: 'Terceiro Olho',
        rating: 'Estranheza',
        requiresRoll: true,
        description: 'Role +Estranheza para enxergar através de ilusões mágicas e presenças invisíveis.',
      },
      {
        id: 'escudo_arcano',
        name: 'Escudo Arcano',
        rating: 'Estranheza',
        requiresRoll: false,
        description: 'Você tem armadura mágica 1 contra ataques mundanos e sobrenaturais.',
      },
      {
        id: 'encantador',
        name: 'Encantador de Objetos',
        rating: 'Estranheza',
        requiresRoll: true,
        description: 'Você pode imbuir uma arma com dano elemental por uma cena.',
      },
    ],
    specialFeature: {
      key: 'magia_combativa',
      title: 'Magia Combativa',
      description: 'Escolha suas bases e efeitos de magia de combate (ex: Explosão de Fogo, Raio Congelante, Telecinese Destrutiva).',
      optionsTemplate: {
        bases: ['Raio concentrado (2-dano perto barulhento)', 'Explosão em área (1-dano perto área)', 'Toque elétrico (3-dano íntimo)'],
        efeitos: ['Fogo elemental (+1 de dano)', 'Força de impacto (empurra alvos)', 'Gelo congelante (imobiliza)'],
      },
    },
    defaultWeapons: [
      { id: 'adaga_ritual', name: 'Adaga Ritual', harm: 1, tags: ['íntimo', 'mágico'] },
      { id: 'foco_arcano', name: 'Foco Arcano (Varinha/Amuleto)', harm: 2, tags: ['perto', 'mágico', 'barulhento'] },
    ],
    improvements: [
      'Aumente Estranheza em +1 (máx +3)',
      'Aumente Braveza em +1 (máx +2)',
      'Aumente Firmeza em +1 (máx +2)',
      'Escolha outro movimento de Arcano',
      'Escolha um movimento de outra cartilha',
      'Obtenha um Refúgio arcano',
    ],
  },
  delinquente: {
    id: 'delinquente',
    name: 'O Delinquente',
    subtitle: 'Trapaceiro / Especialista do Submundo',
    quote: 'Eu conheço as ruas, as celas e os becos escuros. Monstros não me assustam tanto quanto meus credores.',
    description: 'Um caçador com conexões criminosas que sabe se safar de enrascadas e explorar fraquezas.',
    ratingsOptions: [
      { label: 'Malandro', ratings: { Braveza: 1, Esperteza: 0, Estranheza: -1, Firmeza: 1, Sutileza: 2 } },
      { label: 'Brutamontes', ratings: { Braveza: 2, Esperteza: -1, Estranheza: 0, Firmeza: 1, Sutileza: 1 } },
      { label: 'Furtivo', ratings: { Braveza: 0, Esperteza: 1, Estranheza: -1, Firmeza: 1, Sutileza: 2 } },
      { label: 'Ousado', ratings: { Braveza: 1, Esperteza: 1, Estranheza: 0, Firmeza: 0, Sutileza: 2 } },
    ],
    looks: {
      eyes: ['Olhar desconfiado', 'Olhos calculistas', 'Olhar debochado', 'Olhos sonolentos'],
      faces: ['Cicatriz na sobrancelha', 'Sorriso cínico', 'Rosto esguio', 'Tatuagem no pescoço'],
      clothes: ['Jaqueta de couro surrada', 'Capuz preto', 'Roupas urbanas folgadas', 'Terno barato'],
    },
    startingMovesCount: 3,
    availableMoves: [
      {
        id: 'arma_escondida',
        name: 'Sempre Armado',
        rating: 'Sutileza',
        requiresRoll: false,
        description: 'Você sempre tem uma arma pequena ou gazua escondida, mesmo após ser revistado.',
      },
      {
        id: 'amigos_no_submundo',
        name: 'Amigos no Submundo',
        rating: 'Sutileza',
        requiresRoll: true,
        description: 'Role +Sutileza para contatar criminosos e obter favores, pistas ou esconderijo seguro.',
      },
      {
        id: 'golpe_baixo',
        name: 'Golpe Baixo',
        rating: 'Braveza',
        requiresRoll: false,
        description: 'Em combate corpo a corpo desarmado ou com armas improvisadas, cause +1 de dano.',
      },
      {
        id: 'fuga_espetacular',
        name: 'Fuga Espetacular',
        rating: 'Firmeza',
        requiresRoll: true,
        description: 'Ao Agir sob Pressão para fugir ou despistar perseguidores, role com vantagem (+1).',
      },
    ],
    specialFeature: {
      key: 'antecedentes_perseguicao',
      title: 'Antecedentes e Perseguição',
      description: 'Qual foi o seu passado no crime e quem ainda está no seu encalço?',
      optionsTemplate: {
        passado: ['Assalto a mão armada', 'Falsificação e contrabando', 'Golpista de alto padrão', 'Membro de gangue de rua'],
        perseguidores: ['Polícia federal e detetives', 'Antigo chefe de máfia que traí', 'Um monstro que ajudei sem saber'],
      },
    },
    defaultWeapons: [
      { id: 'revolver_delinquente', name: 'Revólver .38 raspado', harm: 2, tags: ['perto', 'barulhento', 'recarregar'] },
      { id: 'canivete_borboleta', name: 'Canivete Borboleta', harm: 1, tags: ['íntimo', 'discreto'] },
    ],
    improvements: [
      'Aumente Sutileza em +1 (máx +3)',
      'Aumente Braveza em +1 (máx +2)',
      'Aumente Firmeza em +1 (máx +2)',
      'Escolha outro movimento de Delinquente',
      'Apague seus rastros criminais com um contato influente',
    ],
  },
  divino: {
    id: 'divino',
    name: 'O Divino',
    subtitle: 'Enviado Celestial / Guardião Sagrado',
    quote: 'Fui enviado do alto com um propósito: expurgar as trevas deste mundo.',
    description: 'Um ser celestial ou avatar enviado por poderes superiores para combater o mal.',
    ratingsOptions: [
      { label: 'Guerreiro Sagrado', ratings: { Braveza: 2, Esperteza: -1, Estranheza: 1, Firmeza: 2, Sutileza: -1 } },
      { label: 'Protetor Benevolente', ratings: { Braveza: 1, Esperteza: 0, Estranheza: 2, Firmeza: 1, Sutileza: -1 } },
      { label: 'Juiz Celestial', ratings: { Braveza: 2, Esperteza: 1, Estranheza: 1, Firmeza: 0, Sutileza: -1 } },
    ],
    looks: {
      eyes: ['Olhar sobrenatural límpido', 'Olhos dourados', 'Olhar julgador', 'Olhos compassivos'],
      faces: ['Beleza simétrica angelical', 'Feições serenas', 'Rosto esculpido em mármore', 'Aparência solene'],
      clothes: ['Terno impecável e alvo', 'Vestes simples monásticas', 'Jaqueta militar desgastada', 'Roupas vintage'],
    },
    startingMovesCount: 3,
    availableMoves: [
      {
        id: 'aura_de_cura',
        name: 'Toque Reparador',
        rating: 'Estranheza',
        requiresRoll: true,
        description: 'Role +Estranheza ao tocar uma pessoa ferida para curar 2 de dano ou estabilizar ferimentos.',
      },
      {
        id: 'furia_divina',
        name: 'Fúria Sagrada',
        rating: 'Braveza',
        requiresRoll: false,
        description: 'Seus ataques recebem as propriedades Sagrado e Mágico.',
      },
      {
        id: 'armadura_divina',
        name: 'Graça Protetora',
        rating: 'Firmeza',
        requiresRoll: false,
        description: 'Você possui Armadura 1 naturalmente contra todos os ataques.',
      },
      {
        id: 'voz_da_autoridade',
        name: 'Voz da Autoridade Divina',
        rating: 'Firmeza',
        requiresRoll: true,
        description: 'Role +Firmeza para exigir que monstros ou testemunhas parem e prestem atenção em você.',
      },
    ],
    specialFeature: {
      key: 'missao',
      title: 'Missão Divina',
      description: 'Qual comando supremo você recebeu de seus superiores celestes?',
      optionsTemplate: {
        missao: ['Proteger a humanidade de uma catástrofe profetizada', 'Destruir um lorde demônio ancestral', 'Resgatar almas perdidas'],
      },
    },
    defaultWeapons: [
      { id: 'espada_flamejante', name: 'Lâmina Consagrada', harm: 3, tags: ['corpo-a-corpo', 'sagrado', 'mágico'] },
      { id: 'martelo_da_fe', name: 'Martelo da Fé', harm: 2, tags: ['corpo-a-corpo', 'pesado', 'sagrado'] },
    ],
    improvements: [
      'Aumente Firmeza em +1 (máx +3)',
      'Aumente Braveza em +1 (máx +2)',
      'Aumente Estranheza em +1 (máx +2)',
      'Escolha outro movimento de Divino',
    ],
  },
  escolhido: {
    id: 'escolhido',
    name: 'O Escolhido',
    subtitle: 'O Herói do Destino',
    quote: 'Eu não pedi por isso, mas se o destino me escolheu, vou chutar a bunda de cada um desses monstros.',
    description: 'Destinado a salvar o mundo ou morrer tentando. Empunha uma arma lendária predestinada.',
    ratingsOptions: [
      { label: 'Destemido', ratings: { Braveza: 2, Esperteza: -1, Estranheza: 1, Firmeza: 2, Sutileza: -1 } },
      { label: 'Relutante', ratings: { Braveza: 2, Esperteza: 1, Estranheza: 1, Firmeza: 0, Sutileza: -1 } },
      { label: 'Equilibrado', ratings: { Braveza: 2, Esperteza: 0, Estranheza: 1, Firmeza: 1, Sutileza: -1 } },
    ],
    looks: {
      eyes: ['Olhar determinado', 'Olhos assustados', 'Olhar de quem viu demais', 'Olhos brilhantes'],
      faces: ['Rosto jovem e cansado', 'Cicatriz lendária', 'Feições corajosas', 'Expressão rebelde'],
      clothes: ['Jaqueta com rebites', 'Uniforme escolar amassado', 'Jeans e botas de combate', 'Roupas práticas'],
    },
    startingMovesCount: 3,
    availableMoves: [
      {
        id: 'destinado_a_vencer',
        name: 'Destinado à Vitória',
        rating: 'Braveza',
        requiresRoll: false,
        description: 'Quando seu dano estiver em 4 ou mais (ferimento grave), cause +1 de dano adicional em todos os ataques.',
      },
      {
        id: 'eu_sou_a_lei',
        name: 'Eu Sou Quem Protege',
        rating: 'Firmeza',
        requiresRoll: true,
        description: 'Ao Proteger Alguém, com 10+ você não sofre dano e ainda desfere um contra-ataque imediato.',
      },
      {
        id: 'visao_do_destino',
        name: 'Premonições do Destino',
        rating: 'Estranheza',
        requiresRoll: true,
        description: 'No início de cada mistério, o Guardião revela um vislumbre ou profecia do perigo iminente.',
      },
    ],
    specialFeature: {
      key: 'sina',
      title: 'Sina e Arma do Destino',
      description: 'Sua Sina dita momentos de Glória e Perdição. Sua arma é forjada ou abençoada para cumprir a profecia.',
      optionsTemplate: {
        arma: 'Lâmina Sagrada Ancestral (3-dano, perto, mágico, sagrado)',
        heroismo: ['Salvar um amigo do sacrifício', 'Enfrentar o monstro sozinho'],
        perdicao: ['Traição de um aliado próximo', 'Perda de um ente querido'],
      },
    },
    defaultWeapons: [
      { id: 'arma_do_destino', name: 'Arma do Destino', harm: 3, tags: ['corpo-a-corpo', 'mágico', 'sagrado'] },
      { id: 'adaga_reserva', name: 'Adaga de Prata', harm: 1, tags: ['íntimo', 'prata'] },
    ],
    improvements: [
      'Aumente Braveza em +1 (máx +3)',
      'Aumente Firmeza em +1 (máx +2)',
      'Aumente Esperteza em +1 (máx +2)',
      'Escolha outro movimento de Escolhido',
    ],
  },
  especialista: {
    id: 'especialista',
    name: 'O Especialista',
    subtitle: 'Pesquisador / Mestre do Oculto',
    quote: 'Eu li sobre isso em um manuscrito babilônico do século XIV. Temos 15 minutos antes do portal se abrir.',
    description: 'Um sábio ou erudito com um refúgio secreto, biblioteca lendária e laboratório de alquimia.',
    ratingsOptions: [
      { label: 'Pesquisador de Campo', ratings: { Braveza: 1, Esperteza: 2, Estranheza: 1, Firmeza: 0, Sutileza: -1 } },
      { label: 'Erudito Recluso', ratings: { Braveza: -1, Esperteza: 2, Estranheza: 2, Firmeza: 0, Sutileza: 0 } },
      { label: 'Sobrevivente Cauteloso', ratings: { Braveza: 0, Esperteza: 2, Estranheza: 0, Firmeza: 2, Sutileza: -1 } },
    ],
    looks: {
      eyes: ['Óculos de armação grossa', 'Olhar perspicaz', 'Olhos cansados de leitura', 'Olhar compenetrado'],
      faces: ['Barba por fazer', 'Expressão séria', 'Rosto intelectual', 'Feições calmas'],
      clothes: ['Colete com muitos bolsos', 'Tweed clássico britânico', 'Roupas confortáveis de biblioteca', 'Sobretudo acadêmico'],
    },
    startingMovesCount: 3,
    availableMoves: [
      {
        id: 'eu_li_sobre_isso',
        name: 'Eu Li Sobre Isso em Algum Lugar',
        rating: 'Esperteza',
        requiresRoll: true,
        description: 'Ao encontrar um monstro ou fenômeno sobrenatural, role +Esperteza para descobrir sua fraqueza ou poderes.',
      },
      {
        id: 'muito_preparado',
        name: 'Mochila Sempre Preparada',
        rating: 'Esperteza',
        requiresRoll: false,
        description: 'Você sempre carrega substâncias químicas, sal grosso, giz ritualístico ou água benta.',
      },
      {
        id: 'analise_forense',
        name: 'Análise Forense Oculta',
        rating: 'Esperteza',
        requiresRoll: true,
        description: 'Ao Investigar um Mistério através de amostras e autópsias no seu laboratório, ganhe +1 na rolagem.',
      },
    ],
    specialFeature: {
      key: 'refugio',
      title: 'Refúgio e Laboratório',
      description: 'Seu esconderijo fortificado, biblioteca oculta ou oficina com defesas e recursos especiais.',
      optionsTemplate: {
        instalacoes: ['Biblioteca vasta de tomos ocultos', 'Oficina de alquimia e armas', 'Celas e proteções mágicas anti-monstros'],
      },
    },
    defaultWeapons: [
      { id: 'espingarda_caca', name: 'Espingarda de Caça calibre 12', harm: 3, tags: ['perto', 'barulhento', 'recarregar'] },
      { id: 'martelo_estacas', name: 'Estacas de Madeira e Martelo', harm: 1, tags: ['íntimo', 'madeira'] },
    ],
    improvements: [
      'Aumente Esperteza em +1 (máx +3)',
      'Adicione mais 2 instalações ao seu Refúgio',
      'Aumente Estranheza em +1 (máx +2)',
      'Escolha outro movimento de Especialista',
    ],
  },
  iniciado: {
    id: 'iniciado',
    name: 'O Iniciado',
    subtitle: 'Membro de uma Ordem Secreta',
    quote: 'A Ordem dos Guardiões protege o véu há três mil anos. Suas ordens são absolutas.',
    description: 'Ligado a uma seita ou culto ancestral com hierarquia, rituais milenares e recursos.',
    ratingsOptions: [
      { label: 'Guerreiro de Templo', ratings: { Braveza: 2, Esperteza: 0, Estranheza: 1, Firmeza: 1, Sutileza: -1 } },
      { label: 'Diplomata da Seita', ratings: { Braveza: 0, Esperteza: 1, Estranheza: 1, Firmeza: 1, Sutileza: 1 } },
      { label: 'Monge Disciplinado', ratings: { Braveza: 1, Esperteza: 0, Estranheza: 2, Firmeza: 1, Sutileza: -1 } },
    ],
    looks: {
      eyes: ['Olhar devoto', 'Olhos frios de disciplina', 'Olhar fervoroso', 'Olhar vigilante'],
      faces: ['Tatuagem ritualística oculta', 'Cabelo cortado à risca', 'Feições nobres', 'Expressão austera'],
      clothes: ['Traje moderno com broche da Seita', 'Terno escuro cerimonioso', 'Roupas discretas de operativo', 'Capuz discreto'],
    },
    startingMovesCount: 3,
    availableMoves: [
      {
        id: 'apoio_da_seita',
        name: 'Apoio da Seita',
        rating: 'Firmeza',
        requiresRoll: true,
        description: 'Role +Firmeza para requisitar armas raras, arquivos secretos ou reforços da sua organização.',
      },
      {
        id: 'luta_ancestral',
        name: 'Artes Marciais Ancestrais',
        rating: 'Braveza',
        requiresRoll: false,
        description: 'Seus ataques corpo-a-corpo desarmados causam 2 de dano íntimo/perto com precisão mortal.',
      },
      {
        id: 'interrogatorio_sagrado',
        name: 'Interrogatório Mental',
        rating: 'Estranheza',
        requiresRoll: true,
        description: 'Role +Estranheza ao interrogar um cultista ou monstro para forçá-lo a falar a verdade.',
      },
    ],
    specialFeature: {
      key: 'seita',
      title: 'A Seita e Tradições',
      description: 'A ordem secreta à qual você jurou lealdade, seus preceitos e exigências severas.',
      optionsTemplate: {
        nome: 'Ordem da Espada Escarlate',
        vantagens: ['Arsenal antigo com relíquias de prata', 'Rede de informantes em tribunais e hospitais'],
        obrigacoes: ['Juramento inquebrável de sigilo', 'Cumprir missões punitivas dadas pelo Grande Mestre'],
      },
    },
    defaultWeapons: [
      { id: 'espada_cerimonial', name: 'Espada Cerimonial de Prata', harm: 2, tags: ['corpo-a-corpo', 'prata', 'sagrado'] },
      { id: 'pistola_tatica', name: 'Pistola 9mm da Ordem', harm: 2, tags: ['perto', 'barulhento'] },
    ],
    improvements: [
      'Aumente Firmeza em +1 (máx +3)',
      'Aumente Braveza em +1 (máx +2)',
      'Melhore o status na Seita e ganhe novos recursos',
      'Escolha outro movimento de Iniciado',
    ],
  },
  injusticado: {
    id: 'injusticado',
    name: 'O Injustiçado',
    subtitle: 'Vingador Implacável',
    quote: 'Eles arrancaram minha família de mim. Não vou descansar enquanto o último deles não queimar.',
    description: 'Um caçador cuja vida foi destruída por monstros e que agora só vive para vingança.',
    ratingsOptions: [
      { label: 'Fúria Pura', ratings: { Braveza: 2, Esperteza: -1, Estranheza: -1, Firmeza: 2, Sutileza: 1 } },
      { label: 'Rastreador Vingativo', ratings: { Braveza: 2, Esperteza: 1, Estranheza: 0, Firmeza: 1, Sutileza: -1 } },
      { label: 'Implacável', ratings: { Braveza: 1, Esperteza: 0, Estranheza: 1, Firmeza: 2, Sutileza: -1 } },
    ],
    looks: {
      eyes: ['Olhar de ódio obsessivo', 'Olhos vermelhos de insônia', 'Olhar assombrado', 'Olhar gelado'],
      faces: ['Cicatriz de garras no rosto', 'Rosto queimado de sol', 'Feições endurecidas pela dor', 'Mandíbula tensa'],
      clothes: ['Sobretudo pesado e gasto', 'Jaqueta militar surrada', 'Botas pesadas de trilha', 'Camiseta desbotada'],
    },
    startingMovesCount: 3,
    availableMoves: [
      {
        id: 'minha_presa',
        name: 'Minha Presa Específica',
        rating: 'Braveza',
        requiresRoll: false,
        description: 'Ao lutar contra o tipo de monstro que destruiu sua vida, você causa +1 de dano e tem Armadura +1.',
      },
      {
        id: 'dor_e_furia',
        name: 'Alimentado pela Dor',
        rating: 'Firmeza',
        requiresRoll: false,
        description: 'Você ignora as penalidades de ferimento grave e não cai inconsciente enquanto estiver em fúria.',
      },
      {
        id: 'rastro_de_sangue',
        name: 'Rastreador Implacável',
        rating: 'Esperteza',
        requiresRoll: true,
        description: 'Role +Esperteza para rastrear o monstro em qualquer terreno urbano ou selvagem.',
      },
    ],
    specialFeature: {
      key: 'quem_perdeu',
      title: 'Quem Você Perdeu e o Monstro Alvo',
      description: 'Quem foi tirado de você e qual a natureza da criatura que cometeu o massacre.',
      optionsTemplate: {
        perda: 'Minha esposa e filho em uma noite de lua cheia',
        criatura: 'Um bando de lobisomens ou culto de metamorfos',
      },
    },
    defaultWeapons: [
      { id: 'espingarda_serrada', name: 'Espingarda de Cano Serrado', harm: 3, tags: ['perto', 'barulhento', 'devastador'] },
      { id: 'faca_militar', name: 'Faca Ka-Bar Tática', harm: 2, tags: ['íntimo'] },
    ],
    improvements: [
      'Aumente Braveza em +1 (máx +3)',
      'Aumente Firmeza em +1 (máx +2)',
      'Consiga uma pista crucial sobre o assassino dos seus entes',
      'Escolha outro movimento de Injustiçado',
    ],
  },
  lunatico: {
    id: 'lunatico',
    name: 'O Lunático',
    subtitle: 'Teórico da Conspiração',
    quote: 'Governos mentem. A mídia mente. Mas os padrões nas transmissões de rádio e os aliens... esses não mentem.',
    description: 'Um paranoico brilhante que conecta pontos invisíveis e descobre a verdade oculta por trás das mentiras.',
    ratingsOptions: [
      { label: 'Paranoico Crônico', ratings: { Braveza: -1, Esperteza: 2, Estranheza: 1, Firmeza: 1, Sutileza: 1 } },
      { label: 'Investigador Cético', ratings: { Braveza: 0, Esperteza: 2, Estranheza: 0, Firmeza: 1, Sutileza: 1 } },
      { label: 'Caçador de OVNIs', ratings: { Braveza: 1, Esperteza: 2, Estranheza: 1, Firmeza: 0, Sutileza: -1 } },
    ],
    looks: {
      eyes: ['Olhar desconfiado e arregalado', 'Olhos vermelhos de tela', 'Olhar conspiratório', 'Olhos brilhando de paranoia'],
      faces: ['Expressão agitada', 'Rosto cansado e pálido', 'Feições ansiosas', 'Sorriso nervoso'],
      clothes: ['Moletom grande com capuz', 'Colete utilitário', 'Roupas descombinadas confortáveis', 'Casaco camuflado'],
    },
    startingMovesCount: 3,
    availableMoves: [
      {
        id: 'conectar_os_pontos',
        name: 'Conectar os Pontos',
        rating: 'Esperteza',
        requiresRoll: true,
        description: 'Ao Investigar um Mistério usando fóruns conspiratórios ou mapas mentais com fios vermelhos, role com +1.',
      },
      {
        id: 'eu_sabia',
        name: 'Eu Sabia que Isso Ia Acontecer!',
        rating: 'Esperteza',
        requiresRoll: false,
        description: 'Uma vez por sessão, declare que previu exatamente o ataque ou armadilha do monstro e ganhe vantagem.',
      },
      {
        id: 'rede_de_contatos_anonimos',
        name: 'Amigos na Net',
        rating: 'Sutileza',
        requiresRoll: true,
        description: 'Role +Sutileza para mobilizar hackers, blogueiros ou vigilantes para invadir câmeras ou vazar arquivos.',
      },
    ],
    specialFeature: {
      key: 'conspiracao',
      title: 'A Grande Conspiração',
      description: 'Qual verdade terrível sobre o governo, alienígenas ou corporações você descobriu?',
      optionsTemplate: {
        teoria: 'O prefeito e a cúpula de segurança são híbridos répteis controlados pela lua negra.',
      },
    },
    defaultWeapons: [
      { id: 'pistola_lunatico', name: 'Pistola compacta não registrada', harm: 2, tags: ['perto', 'barulhento'] },
      { id: 'taser_lunatico', name: 'Taser de Choque de Alta Voltagem', harm: 1, tags: ['íntimo', 'atordoante'] },
    ],
    improvements: [
      'Aumente Esperteza em +1 (máx +3)',
      'Aumente Estranheza em +1 (máx +2)',
      'Aumente Firmeza em +1 (máx +2)',
      'Escolha outro movimento de Lunático',
    ],
  },
  monstruoso: {
    id: 'monstruoso',
    name: 'O Monstruoso',
    subtitle: 'Criatura da Noite Lutando pela Humanidade',
    quote: 'Eu sou o monstro que combate monstros. Só espero não me tornar o pesadelo que caço.',
    description: 'Vampiro, lobisomem, demônio, fantasma ou criatura que escolheu defender os mortais em vez de devorá-los.',
    ratingsOptions: [
      { label: 'Predador Feroz', ratings: { Braveza: 2, Esperteza: -1, Estranheza: 2, Firmeza: 0, Sutileza: 0 } },
      { label: 'Espírito Noturno', ratings: { Braveza: 1, Esperteza: 1, Estranheza: 2, Firmeza: -1, Sutileza: 1 } },
      { label: 'Besta Controlada', ratings: { Braveza: 2, Esperteza: 0, Estranheza: 1, Firmeza: 1, Sutileza: -1 } },
    ],
    looks: {
      eyes: ['Olhos que brilham no escuro', 'Olhar predatório', 'Olhos sem pupila', 'Olhar hipnótico'],
      faces: ['Presas afiadas discretas', 'Pele excessivamente pálida', 'Garras retráteis', 'Expressão feral'],
      clothes: ['Sobretudo escuro vintage', 'Roupas rasgadas e confortáveis', 'Terno elegante antigo', 'Capuz sombrio'],
    },
    startingMovesCount: 3,
    availableMoves: [
      {
        id: 'imortalidade_sobrenatural',
        name: 'Regeneração Sobrenatural',
        rating: 'Estranheza',
        requiresRoll: false,
        description: 'Você cura 1 de dano a cada poucas horas, exceto se o dano vier de sua fraqueza monstruosa.',
      },
      {
        id: 'garras_e_presas',
        name: 'Ataques Naturais Devastadores',
        rating: 'Braveza',
        requiresRoll: false,
        description: 'Suas garras, chifres ou presas causam 2 de dano íntimo/perto com perfuração de armadura.',
      },
      {
        id: 'sentidos_de_predador',
        name: 'Sentidos da Fera',
        rating: 'Esperteza',
        requiresRoll: true,
        description: 'Role +Esperteza para farejar sangue, sentir pulsações cardíacas ou enxergar na escuridão absoluta.',
      },
    ],
    specialFeature: {
      key: 'raca_maldicao',
      title: 'Herança Sobrenatural e Maldição',
      description: 'Sua espécie (vampiro, licantropo, fada sombria) e sua fraqueza pura (prata, luz solar, fogo, etc.).',
      optionsTemplate: {
        especie: 'Vampiro Antigo com sede de sangue humano',
        fraqueza: 'Fogo purificador e estacas de freixo no coração',
      },
    },
    defaultWeapons: [
      { id: 'presas_garras', name: 'Presas e Garras Naturais', harm: 2, tags: ['íntimo', 'mágico', 'perfurante'] },
      { id: 'faca_pesada', name: 'Faca Tática de Sobrevivência', harm: 1, tags: ['íntimo'] },
    ],
    improvements: [
      'Aumente Braveza em +1 (máx +3)',
      'Aumente Estranheza em +1 (máx +3)',
      'Aumente Firmeza em +1 (máx +2)',
      'Escolha outro movimento de Monstruoso',
    ],
  },
  mundano: {
    id: 'mundano',
    name: 'O Mundano',
    subtitle: 'O Humano Comum em um Mundo Bizarro',
    quote: 'Eu só queria terminar a faculdade... como foi que fui parar em um cemitério com um bastão de beisebol?!',
    description: 'Sem magia nem superpoderes, mas com bom senso, sorte inacreditável e conexões com pessoas comuns.',
    ratingsOptions: [
      { label: 'Gente Boa', ratings: { Braveza: 0, Esperteza: 1, Estranheza: -1, Firmeza: 1, Sutileza: 2 } },
      { label: 'Esportista', ratings: { Braveza: 2, Esperteza: 0, Estranheza: -1, Firmeza: 1, Sutileza: 1 } },
      { label: 'Carismático', ratings: { Braveza: 1, Esperteza: 1, Estranheza: -1, Firmeza: 0, Sutileza: 2 } },
    ],
    looks: {
      eyes: ['Olhos expressivos e sinceros', 'Olhos arregalados de susto', 'Olhar amigável', 'Olhos vívidos'],
      faces: ['Sorriso acolhedor', 'Rosto jovial comum', 'Feições simpáticas de vizinho', 'Expressão confusa'],
      clothes: ['Camiseta de banda e jeans', 'Jaqueta jeans com patches', 'Moletom casual', 'Tênis de corrida'],
    },
    startingMovesCount: 3,
    availableMoves: [
      {
        id: 'sempre_aqui_para_ajudar',
        name: 'Sempre Aqui Para Ajudar',
        rating: 'Firmeza',
        requiresRoll: false,
        description: 'Ao Ajudar Outro Caçador, você concede +2 de bônus em vez do +1 normal.',
      },
      {
        id: 'sorte_do_azarado',
        name: 'Sorte do Tolo',
        rating: 'Sutileza',
        requiresRoll: false,
        description: 'Ao gastar um ponto de Sorte, você tem direito a recuperar 1 ponto de dano ou encontrar algo crucial por puro acaso.',
      },
      {
        id: 'vamos_nos_separar',
        name: 'Vamos nos Separar!',
        rating: 'Esperteza',
        requiresRoll: true,
        description: 'Quando sugerir que o grupo se divida para cobrir mais terreno, role +Esperteza para achar uma pista vital.',
      },
    ],
    specialFeature: {
      key: 'meio_transporte',
      title: 'O Carro do Grupo e Conexões',
      description: 'O veículo icônico que transporta os caçadores para as investigações (ex: perua velha, van misteriosa, picape).',
      optionsTemplate: {
        veiculo: 'Uma perua Station Wagon 1998 com porta-malas espaçoso e cheiro de salgadinho',
      },
    },
    defaultWeapons: [
      { id: 'bastao_beisebol', name: 'Taco de Beisebol de Alumínio', harm: 2, tags: ['corpo-a-corpo', 'atordoante'] },
      { id: 'spray_pimenta', name: 'Spray de Pimenta e Lanterna Pesada', harm: 1, tags: ['íntimo', 'cegante'] },
    ],
    improvements: [
      'Aumente Sutileza em +1 (máx +3)',
      'Aumente Braveza em +1 (máx +2)',
      'Aumente Firmeza em +1 (máx +2)',
      'Escolha outro movimento de Mundano',
    ],
  },
  profissional: {
    id: 'profissional',
    name: 'O Profissional',
    subtitle: 'Agente Governamental ou Militar',
    quote: 'Procedimento padrão, agente. Isolar o perímetro, conter a anomalia e classificar o relatório.',
    description: 'Trabalha para uma agência ultrassecreta governamental ou militar com armamento pesado e protocolo.',
    ratingsOptions: [
      { label: 'Agente Tático', ratings: { Braveza: 2, Esperteza: 0, Estranheza: -1, Firmeza: 2, Sutileza: 0 } },
      { label: 'Diretor de Campo', ratings: { Braveza: 1, Esperteza: 1, Estranheza: -1, Firmeza: 2, Sutileza: 0 } },
      { label: 'Operativo Especial', ratings: { Braveza: 1, Esperteza: 2, Estranheza: -1, Firmeza: 1, Sutileza: 0 } },
    ],
    looks: {
      eyes: ['Olhar disciplinado e gelado', 'Olhos atentos a saídas', 'Olhar focado', 'Olhar militar'],
      faces: ['Corte de cabelo militar milimétrico', 'Rosto sério e rígido', 'Feições de veterano', 'Expressão impassível'],
      clothes: ['Terno preto sob medida com fone no ouvido', 'Farda tática preta sem insígnia', 'Jaqueta à prova de vento escura'],
    },
    startingMovesCount: 3,
    availableMoves: [
      {
        id: 'procedimento_padrao',
        name: 'Protocolo de Resposta Imediata',
        rating: 'Firmeza',
        requiresRoll: false,
        description: 'Você possui Armadura 1 naturalmente graças ao seu colete balístico profissional.',
      },
      {
        id: 'requisicao_da_agencia',
        name: 'Requisição Governamental',
        rating: 'Firmeza',
        requiresRoll: true,
        description: 'Role +Firmeza para fechar um quarteirão, invadir satélites ou requisitar armas pesadas da Agência.',
      },
      {
        id: 'treinamento_de_combate',
        name: 'Treinamento Tático de Choque',
        rating: 'Braveza',
        requiresRoll: false,
        description: 'Ao Partir pra Porrada com armas de fogo táticas, cause +1 de dano.',
      },
    ],
    specialFeature: {
      key: 'agencia',
      title: 'A Agência e Burocracia',
      description: 'Estrutura da agência (ex: FBI divisão X, empresa de segurança privada, exército secreto) e sua burocracia.',
      optionsTemplate: {
        tipo: 'Divisão secreta de inteligência com autorização máxima',
        recursos: ['Veículo tático blindado', 'Laboratório forense portátil', 'Helicóptero de extração'],
        problemas: ['Burocracia sufocante que exige relatórios semanais', 'Superiores que escondem a verdade'],
      },
    },
    defaultWeapons: [
      { id: 'fuzil_assalto', name: 'Fuzil de Assalto Tático com Mira', harm: 3, tags: ['perto', 'longe', 'barulhento', 'recarregar'] },
      { id: 'pistola_servico', name: 'Glock 9mm com silenciador', harm: 2, tags: ['perto', 'discreto'] },
    ],
    improvements: [
      'Aumente Firmeza em +1 (máx +3)',
      'Aumente Braveza em +1 (máx +2)',
      'Aumente Esperteza em +1 (máx +2)',
      'Promova-se na hierarquia da Agência',
    ],
  },
  sinistro: {
    id: 'sinistro',
    name: 'O Sinistro',
    subtitle: 'Vidente / Conjurador Sombrio',
    quote: 'As vozes sussurram segredos terríveis na minha mente. Às vezes elas têm razão.',
    description: 'Possui dons psíquicos assustadores e poderes misteriosos que atraem o Lado Sombrio.',
    ratingsOptions: [
      { label: 'Psíquico Atormentado', ratings: { Braveza: -1, Esperteza: 1, Estranheza: 2, Firmeza: 0, Sutileza: 1 } },
      { label: 'Clarividente Focado', ratings: { Braveza: 0, Esperteza: 0, Estranheza: 2, Firmeza: 1, Sutileza: 0 } },
      { label: 'Volátil', ratings: { Braveza: 1, Esperteza: -1, Estranheza: 2, Firmeza: 0, Sutileza: 1 } },
    ],
    looks: {
      eyes: ['Olhar distante e assombrado', 'Olhos que mudam de cor com a luz', 'Olhar magnético', 'Olhos profundos'],
      faces: ['Feições pálidas e delicadas', 'Expressão triste', 'Rosto enigmático', 'Sorriso misterioso'],
      clothes: ['Roupas escuras góticas', 'Xale ou echarpe comprida', 'Casaco felpudo vintage', 'Roupas boêmias'],
    },
    startingMovesCount: 3,
    availableMoves: [
      {
        id: 'telecinese',
        name: 'Telecinese Pura',
        rating: 'Estranheza',
        requiresRoll: true,
        description: 'Role +Estranheza para arremessar objetos ou afastar pessoas com a mente (2 de dano perto).',
      },
      {
        id: 'clarividencia',
        name: 'Clarividência Espontânea',
        rating: 'Estranheza',
        requiresRoll: true,
        description: 'Role +Estranheza para ter visões do passado de um local ou objeto amaldiçoado.',
      },
      {
        id: 'pressagio_do_mal',
        name: 'Pressentir o Perigo',
        rating: 'Estranheza',
        requiresRoll: false,
        description: 'Você nunca pode ser pego desprevenido por emboscadas sobrenaturais.',
      },
    ],
    specialFeature: {
      key: 'lado_sombrio',
      title: 'O Lado Sombrio',
      description: 'As entidades e compulsões sombrias que concedem seu poder mas cobram um preço amargo.',
      optionsTemplate: {
        natureza: 'Um demônio ancestral que sussurra atrás dos meus olhos',
        marcas: ['Pesadelos vívidos e alucinações', 'Sede de vingança desenfreada', 'Dores de cabeça insuportáveis'],
      },
    },
    defaultWeapons: [
      { id: 'faca_antiga', name: 'Faca Antiga com Cabo de Osso', harm: 1, tags: ['íntimo', 'mágico'] },
      { id: 'revolver_pequeno', name: 'Revólver .32 de Bolso', harm: 2, tags: ['perto', 'barulhento'] },
    ],
    improvements: [
      'Aumente Estranheza em +1 (máx +3)',
      'Aumente Firmeza em +1 (máx +2)',
      'Aumente Esperteza em +1 (máx +2)',
      'Escolha outro movimento de Sinistro',
    ],
  },
  viajante: {
    id: 'viajante',
    name: 'O Viajante',
    subtitle: 'Viajante Temporal ou Espacial',
    quote: 'No meu século de origem, nós já havíamos erradicado essas coisas. Deixem-me recalibrar este dispositivo.',
    description: 'Vindo de outro tempo ou dimensão, traz tecnologia avançada e uma visão externa do perigo.',
    ratingsOptions: [
      { label: 'Futurista Calculista', ratings: { Braveza: 0, Esperteza: 2, Estranheza: 1, Firmeza: 1, Sutileza: -1 } },
      { label: 'Explorador Perdido', ratings: { Braveza: 1, Esperteza: 1, Estranheza: 1, Firmeza: 1, Sutileza: -1 } },
      { label: 'Cientista Temporal', ratings: { Braveza: -1, Esperteza: 2, Estranheza: 2, Firmeza: 0, Sutileza: 0 } },
    ],
    looks: {
      eyes: ['Olhar maravilhado e curioso', 'Olhos tecnológicos cibernéticos', 'Olhar perdido no tempo', 'Olhos analíticos'],
      faces: ['Feições exóticas', 'Micro-implantes na têmpora', 'Expressão deslumbrada', 'Rosto sereno'],
      clothes: ['Traje sintético sob sobretudo', 'Roupas de época anacrônicas', 'Casaco prateado térmico', 'Macacão de piloto temporal'],
    },
    startingMovesCount: 3,
    availableMoves: [
      {
        id: 'gadget_do_futuro',
        name: 'Dispositivo Avançado',
        rating: 'Esperteza',
        requiresRoll: true,
        description: 'Role +Esperteza para usar um scanner ou ferramenta temporal para desativar travas ou neutralizar energias.',
      },
      {
        id: 'ja_vi_isso_na_historia',
        name: 'Registro Histórico',
        rating: 'Esperteza',
        requiresRoll: false,
        description: 'Ao encontrar um monstro lendário, você pode declarar como ele foi derrotado na história do futuro.',
      },
      {
        id: 'deslocamento_temporal',
        name: 'Salto Temporal Curto',
        rating: 'Estranheza',
        requiresRoll: true,
        description: 'Role +Estranheza ao sofrer um ataque para sumir e reaparecer 3 segundos no futuro sem sofrer dano.',
      },
    ],
    specialFeature: {
      key: 'meio_transporte',
      title: 'Máquina do Tempo / Cápsula Espacial',
      description: 'Seu veículo ou portal temporal e as condições para voltar para sua era original.',
      optionsTemplate: {
        origem: 'Ano 2480 após a grande guerra de biovírus',
        veiculo: 'Cápsula de salto temporal danificada esperando peças de fusão',
      },
    },
    defaultWeapons: [
      { id: 'pistola_laser', name: 'Pistola de Energia Concentrada', harm: 3, tags: ['perto', 'energia', 'recarregar'] },
      { id: 'bastonete_choque', name: 'Bastão Retrátil de Choque', harm: 2, tags: ['íntimo', 'atordoante'] },
    ],
    improvements: [
      'Aumente Esperteza em +1 (máx +3)',
      'Aumente Estranheza em +1 (máx +2)',
      'Repare uma peça da sua máquina do tempo',
      'Escolha outro movimento de Viajante',
    ],
  },
};
