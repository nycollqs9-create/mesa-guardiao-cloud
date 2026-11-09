import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { Response } from 'express';
import {
  Campaign,
  HunterCharacter,
  ChatMessage,
  DiceRoll,
  Mystery,
  Scene,
  DiaryEntry,
  VisibilityMode,
  RatingName,
} from '../src/types/motw.ts';
import { evaluateRoll, calculateHarm, healHarm, calculateExpAddition, spendLuckPoint } from '../src/utils/dice.ts';
import { STARTER_MYSTERY } from '../src/data/keeperReference.ts';
import { MOTW_PLAYBOOKS } from '../src/data/motwPlaybooks.ts';

const DATA_DIR = path.resolve(process.cwd(), 'server', 'data');
const CAMPAIGNS_FILE = path.join(DATA_DIR, 'campaigns.json');
const CHAT_FILE = path.join(DATA_DIR, 'chat.json');

// Memory caches
let campaigns: Record<string, Campaign> = {};
let chatMessages: Record<string, ChatMessage[]> = {};

// SSE connections by campaignId
const sseSubscribers: Map<string, Set<Response>> = new Map();

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function loadData() {
  ensureDataDir();
  try {
    if (fs.existsSync(CAMPAIGNS_FILE)) {
      const data = fs.readFileSync(CAMPAIGNS_FILE, 'utf-8');
      campaigns = JSON.parse(data);
    } else {
      // A instalação começa vazia: campanhas de demonstração nunca são criadas como dados reais.
      campaigns = {};
      persistData();
    }
  } catch (err) {
    console.error('Error loading campaigns.json, creating initial state:', err);
    seedDefaultCampaign();
  }

  try {
    if (fs.existsSync(CHAT_FILE)) {
      const data = fs.readFileSync(CHAT_FILE, 'utf-8');
      chatMessages = JSON.parse(data);
    } else {
      chatMessages = {};
    }
  } catch (err) {
    console.error('Error loading chat.json:', err);
    chatMessages = {};
  }
}

function persistData() {
  ensureDataDir();
  try {
    fs.writeFileSync(CAMPAIGNS_FILE, JSON.stringify(campaigns, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save campaigns:', err);
  }
  try {
    fs.writeFileSync(CHAT_FILE, JSON.stringify(chatMessages, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save chat messages:', err);
  }
}

function seedDefaultCampaign() {
  const seedId = 'camp-serra-da-neblina';
  const seedInvite = 'MOTW-NEBLINA';

  const defaultScenes: Scene[] = [
    {
      id: 'cena-canteiro-obras',
      name: 'Canteiro de Obras na Estrada da Serra',
      description: 'Chuva fina caindo sobre as retroescavadeiras abandonadas. O solo de terra vermelha está revirado e uma árvore secular derrubada parece sangrar seiva escura sob a névoa.',
      imageUrl: 'https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=1200&q=80',
      clues: [
        'Pegadas descalças enormes com raízes entre os dedos levando para a ravina.',
        'O capacete do engenheiro amassado com espinhos de espinheiro-bravo cravados.',
        'Um diário de campo alertando sobre ruídos subterrâneos na noite anterior.',
      ],
      gmNotes: 'O Leshy da Serra está camuflado a 40 metros de distância observando o grupo.',
      isActive: true,
    },
    {
      id: 'cena-delegacia-local',
      name: 'Delegacia de Vila das Águas',
      description: 'Paredes descascadas de cor verde-oliva, cheiro de café requentado e ventilador de teto rangendo. O xerife Cézar olha com desconfiança para qualquer forasteiro.',
      imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
      clues: [
        'Relatório de autópsia preliminar apontando asfixia mecânica por invasão traqueal de folhas.',
        'Mapa das colinas com três propriedades rurais marcadas com cruzes vermelhas.',
      ],
      gmNotes: 'O xerife aceita suborno ou uma boa conversa com Sutileza.',
      isActive: false,
    },
    {
      id: 'cena-cabana-eremita',
      name: 'Cabana do Eremita na Mata Fechada',
      description: 'Uma cabana de madeira com centenas de ramos de ervas secas pendurados nos beirais e garrafas de vidro enterradas no perímetro do terreiro.',
      imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80',
      clues: [
        'Um caldeirão com resíduos de resina de carvalho e água benta.',
        'Avisos gravados na madeira avisando que o espírito da serra acordou faminto.',
      ],
      gmNotes: 'Aqui os caçadores podem descobrir a fraqueza do monstro.',
      isActive: false,
    },
  ];

  const defaultDiary: DiaryEntry[] = [
    {
      id: 'diario-pista-1',
      title: 'A primeira vítima da Serra',
      content: 'Engenheiro Marcelo Dantas encontrado suspenso a 15 metros no pinheiro. Folhas secas brotando das cavidades oculares e peito.',
      category: 'pista',
      isSharedWithPlayers: true,
      createdAt: Date.now() - 3600000 * 4,
    },
    {
      id: 'diario-segredo-guardiao',
      title: 'Fraqueza Oculta do Leshy',
      content: 'Apenas chamas puras de galhos de carvalho consagrados podem anular a regeneração da criatura.',
      category: 'segredo',
      isSharedWithPlayers: false,
      createdAt: Date.now() - 3600000 * 3,
    },
  ];

  // Pre-seed an archetype Hunter for immediate preview/play
  const seedHunter: HunterCharacter = {
    id: 'char-lucas-escolhido',
    userId: 'user-lucas-cacador',
    playerName: 'Lucas (Demonstração)',
    name: 'Lucas "Faísca" Andrade',
    playbookId: 'escolhido',
    playbookName: 'O Escolhido',
    pronouns: 'Ele/Dele',
    look: 'Olhar determinado, cicatriz na sobrancelha, jaqueta de couro e jeans surrado.',
    description: 'Um jovem que descobriu ser o guardião de uma lâmina sagrada após um massacre em sua cidade natal.',
    portraitUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    ratings: {
      Braveza: 2,
      Esperteza: 0,
      Estranheza: 1,
      Firmeza: 1,
      Sutileza: -1,
    },
    harm: 2,
    isUnstable: false,
    armour: 0,
    luckCurrent: 1,
    luckMax: 7,
    experience: 2,
    levelUpsTaken: 0,
    improvementsChosen: [],
    advancedMovesUnlocked: [],
    selectedMoves: ['destinado_a_vencer', 'eu_sou_a_lei'],
    specialFeatures: {
      sina: {
        arma: 'Lâmina do Destino (3-dano, perto, sagrado, mágico)',
        heroismo: 'Salvar um inocente das garras da besta',
        perdicao: 'Traição de alguém de quem depende',
      },
    },
    weapons: [
      { id: 'w-lamina', name: 'Lâmina do Destino', harm: 3, tags: ['corpo-a-corpo', 'sagrado', 'mágico'] },
      { id: 'w-adaga', name: 'Adaga de Prata', harm: 1, tags: ['íntimo', 'prata'] },
    ],
    gearNotes: 'Mochila com fita isolante, lanterna tática de led, isqueiro zippo de prata.',
    historyNotes: 'O Guardião o ajudou a escapar quando o primeiro monstro atacou seu colégio.',
    bonds: [],
    createdAt: Date.now() - 3600000 * 5,
    updatedAt: Date.now(),
  };

  const seedCampaign: Campaign = {
    id: seedId,
    name: 'O Mistério da Serra da Neblina',
    description: 'Um horror botânico ancestral despertou nas montanhas isoladas da Serra da Neblina. Os caçadores foram chamados para conter a anomalia antes da Meia-noite.',
    coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    inviteCode: seedInvite,
    keeperId: 'user-guardiao-master',
    keeperName: 'Mestre da Semana',
    settings: {
      allowDuplicatePlaybooks: false,
      customRulesNotes: 'Regras da Edição Revisada brasileira. Dano letal em 8.',
    },
    participants: [
      {
        userId: 'user-guardiao-master',
        userName: 'Mestre da Semana',
        avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
        role: 'guardiao',
        joinedAt: Date.now() - 3600000 * 10,
        lastActiveAt: Date.now(),
      },
      {
        userId: 'user-lucas-cacador',
        userName: 'Lucas (Demonstração)',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        role: 'cacador',
        joinedAt: Date.now() - 3600000 * 5,
        lastActiveAt: Date.now(),
      },
    ],
    characters: {
      [seedHunter.id]: seedHunter,
    },
    activeMystery: STARTER_MYSTERY,
    archivedMysteries: [],
    scenes: defaultScenes,
    diary: defaultDiary,
    sessionsCount: 1,
    createdAt: Date.now() - 3600000 * 10,
    updatedAt: Date.now(),
  };

  campaigns[seedId] = seedCampaign;

  // Starter chat
  chatMessages[seedId] = [
    {
      id: 'msg-start-1',
      campaignId: seedId,
      userId: 'user-guardiao-master',
      userName: 'Mestre da Semana',
      type: 'keeper_announcement',
      content: 'Bem-vindos a Mesa do Guardião! A contagem regressiva começou no estágio DIA. Vocês estão no canteiro de obras da rodovia.',
      visibility: 'publica',
      timestamp: Date.now() - 3600000 * 2,
    },
  ];

  persistData();
}

// Initialize on boot
loadData();

// Helper to broadcast SSE
export function broadcastSSE(campaignId: string, eventType: string, data: any) {
  const subscribers = sseSubscribers.get(campaignId);
  if (!subscribers || subscribers.size === 0) return;

  const payload = `event: ${eventType}\ndata: ${JSON.stringify(data)}\n\n`;
  subscribers.forEach((client) => {
    try {
      client.write(payload);
    } catch (err) {
      console.warn('Failed to send SSE to client:', err);
    }
  });
}

export function registerSSESubscriber(campaignId: string, res: Response) {
  if (!sseSubscribers.has(campaignId)) {
    sseSubscribers.set(campaignId, new Set());
  }
  const set = sseSubscribers.get(campaignId)!;
  set.add(res);

  res.on('close', () => {
    set.delete(res);
  });
}

// Database query & mutation methods
export const db = {
  getCampaigns(): Campaign[] {
    return Object.values(campaigns).sort((a, b) => b.updatedAt - a.updatedAt);
  },

  getCampaign(id: string): Campaign | undefined {
    return campaigns[id];
  },

  getCampaignByInviteCode(code: string): Campaign | undefined {
    const clean = code.trim().toUpperCase();
    return Object.values(campaigns).find((c) => c.inviteCode.toUpperCase() === clean);
  },

  createCampaign(params: {
    name: string;
    description: string;
    coverImage?: string;
    keeperId: string;
    keeperName: string;
  }): Campaign {
    const id = `camp-${crypto.randomBytes(4).toString('hex')}`;
    const inviteCode = `MOTW-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

    const starterScenes: Scene[] = [
      {
        id: `scene-${crypto.randomBytes(3).toString('hex')}`,
        name: 'Local Inicial da Investigação',
        description: 'Um beco escuro ou cena de crime ainda isolada pela polícia. O vento frio traz um cheiro estranho de ozônio.',
        imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
        clues: ['Pista estranha deixada no asfalto', 'Testemunha assustada escondida na lixeira'],
        isActive: true,
      },
    ];

    const newCamp: Campaign = {
      id,
      name: params.name,
      description: params.description,
      coverImage: params.coverImage || 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
      inviteCode,
      keeperId: params.keeperId,
      keeperName: params.keeperName,
      settings: {
        allowDuplicatePlaybooks: false,
      },
      participants: [
        {
          userId: params.keeperId,
          userName: params.keeperName,
          role: 'guardiao',
          joinedAt: Date.now(),
          lastActiveAt: Date.now(),
        },
      ],
      characters: {},
      activeMystery: {
        ...STARTER_MYSTERY,
        id: `myst-${crypto.randomBytes(3).toString('hex')}`,
      },
      archivedMysteries: [],
      scenes: starterScenes,
      diary: [],
      sessionsCount: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    campaigns[id] = newCamp;
    chatMessages[id] = [
      {
        id: `msg-${crypto.randomBytes(4).toString('hex')}`,
        campaignId: id,
        userId: params.keeperId,
        userName: params.keeperName,
        type: 'keeper_announcement',
        content: `Campanha "${params.name}" iniciada pelo Guardião ${params.keeperName}. Código de convite: ${inviteCode}`,
        visibility: 'publica',
        timestamp: Date.now(),
      },
    ];

    persistData();
    return newCamp;
  },

  joinCampaign(campaignId: string, participant: { userId: string; userName: string; avatarUrl?: string }): { campaign: Campaign; role: 'guardiao' | 'cacador' } {
    const campaign = campaigns[campaignId];
    if (!campaign) throw new Error('Campanha não encontrada');

    const isKeeper = campaign.keeperId === participant.userId;
    const role = isKeeper ? 'guardiao' : 'cacador';

    const existingIndex = campaign.participants.findIndex((p) => p.userId === participant.userId);
    if (existingIndex >= 0) {
      campaign.participants[existingIndex].lastActiveAt = Date.now();
      campaign.participants[existingIndex].userName = participant.userName;
      if (participant.avatarUrl) campaign.participants[existingIndex].avatarUrl = participant.avatarUrl;
    } else {
      // Limite de 6 pessoas no total, incluindo o Guardião.
      if (campaign.participants.length >= 6) {
        throw new Error('Esta campanha já atingiu o limite de 6 participantes (1 Guardião + até 5 Caçadores).');
      }
      campaign.participants.push({
        userId: participant.userId,
        userName: participant.userName,
        avatarUrl: participant.avatarUrl,
        role,
        joinedAt: Date.now(),
        lastActiveAt: Date.now(),
      });

      this.addChatMessage(campaignId, {
        userId: participant.userId,
        userName: participant.userName,
        type: 'system',
        content: `${participant.userName} entrou na campanha como ${role === 'guardiao' ? 'Guardião' : 'Caçador'}.`,
        visibility: 'publica',
      });
    }

    campaign.updatedAt = Date.now();
    persistData();
    broadcastSSE(campaignId, 'campaign_updated', campaign);

    return { campaign, role };
  },

  saveCharacter(campaignId: string, character: HunterCharacter): HunterCharacter {
    const campaign = campaigns[campaignId];
    if (!campaign) throw new Error('Campanha não encontrada');

    const isNew = !campaign.characters[character.id];
    campaign.characters[character.id] = {
      ...character,
      updatedAt: Date.now(),
    };
    campaign.updatedAt = Date.now();

    persistData();

    this.addChatMessage(campaignId, {
      userId: character.userId,
      userName: character.playerName,
      characterName: character.name,
      type: 'system',
      content: isNew
        ? `Novo caçador criado: ${character.name} (${character.playbookName})!`
        : `Ficha de ${character.name} atualizada.`,
      visibility: 'publica',
    });

    broadcastSSE(campaignId, 'campaign_updated', campaign);
    return campaign.characters[character.id];
  },

  deleteCharacter(campaignId: string, characterId: string) {
    const campaign = campaigns[campaignId];
    if (!campaign) throw new Error('Campanha não encontrada');
    const char = campaign.characters[characterId];
    if (char) {
      delete campaign.characters[characterId];
      campaign.updatedAt = Date.now();
      persistData();
      broadcastSSE(campaignId, 'campaign_updated', campaign);
    }
  },

  executeRoll(params: {
    campaignId: string;
    userId: string;
    userName: string;
    hunterId?: string;
    hunterName?: string;
    moveName: string;
    ratingUsed?: RatingName;
    ratingModifier: number;
    situationalModifier: number;
    hasAdvanced?: boolean;
    visibility?: VisibilityMode;
    actionDescription?: string;
  }): { roll: DiceRoll; updatedCharacter?: HunterCharacter } {
    const campaign = campaigns[params.campaignId];
    if (!campaign) throw new Error('Campanha não encontrada');

    // Cryptographic 2d6 generator
    const d1 = crypto.randomInt(1, 7);
    const d2 = crypto.randomInt(1, 7);

    const evaluation = evaluateRoll(
      d1,
      d2,
      params.ratingModifier,
      params.situationalModifier,
      params.hasAdvanced ?? false
    );

    let outcomeText = '';
    if (evaluation.outcome === 'falha') {
      outcomeText = 'Falha! O Guardião realiza um movimento duro ou suave contra você. Você ganha 1 Ponto de Experiência!';
    } else if (evaluation.outcome === 'parcial') {
      outcomeText = 'Sucesso Parcial! Você atinge seu objetivo, mas com um custo, complicação ou escolha difícil.';
    } else if (evaluation.outcome === 'sucesso') {
      outcomeText = 'Sucesso Total! Ação executada com maestria sem complicações diretas.';
    } else {
      outcomeText = 'Sucesso Avançado (12+)! Desfecho espetacular com efeitos aprimorados da Edição Revisada.';
    }

    const roll: DiceRoll = {
      id: `roll-${crypto.randomBytes(4).toString('hex')}`,
      campaignId: params.campaignId,
      userId: params.userId,
      userName: params.userName,
      hunterId: params.hunterId,
      hunterName: params.hunterName,
      moveName: params.moveName,
      ratingUsed: params.ratingUsed,
      ratingModifier: params.ratingModifier,
      situationalModifier: params.situationalModifier,
      dice: evaluation.dice,
      total: evaluation.total,
      outcome: evaluation.outcome,
      outcomeLabel: evaluation.outcomeLabel,
      outcomeText,
      actionDescription: params.actionDescription,
      visibility: params.visibility || 'publica',
      timestamp: Date.now(),
    };

    let updatedCharacter: HunterCharacter | undefined;

    // Automatic XP award on roll <= 6
    if (evaluation.awardsXp && params.hunterId && campaign.characters[params.hunterId]) {
      const char = campaign.characters[params.hunterId];
      const xpCalc = calculateExpAddition(char.experience, 1);
      char.experience = xpCalc.newExp;
      if (xpCalc.levelUpsGained > 0) {
        char.levelUpsTaken += xpCalc.levelUpsGained;
      }
      char.updatedAt = Date.now();
      updatedCharacter = char;
    }

    campaign.updatedAt = Date.now();
    persistData();

    // Create chat message with roll payload
    this.addChatMessage(params.campaignId, {
      userId: params.userId,
      userName: params.userName,
      characterName: params.hunterName,
      type: 'roll',
      content: `${params.hunterName || params.userName} rolou para ${params.moveName}: ${evaluation.total} (${evaluation.outcomeLabel})`,
      visibility: params.visibility || 'publica',
      roll,
    });

    broadcastSSE(params.campaignId, 'roll_executed', { roll, updatedCharacter });
    return { roll, updatedCharacter };
  },

  addChatMessage(campaignId: string, msg: Omit<ChatMessage, 'id' | 'campaignId' | 'timestamp'>): ChatMessage {
    if (!chatMessages[campaignId]) {
      chatMessages[campaignId] = [];
    }

    const fullMessage: ChatMessage = {
      ...msg,
      id: `msg-${crypto.randomBytes(4).toString('hex')}`,
      campaignId,
      timestamp: Date.now(),
    };

    chatMessages[campaignId].push(fullMessage);
    // Keep max 200 messages in memory/history
    if (chatMessages[campaignId].length > 200) {
      chatMessages[campaignId].shift();
    }

    persistData();
    broadcastSSE(campaignId, 'chat_message', fullMessage);
    return fullMessage;
  },

  getChatMessages(campaignId: string): ChatMessage[] {
    return chatMessages[campaignId] || [];
  },

  updateHarm(campaignId: string, charId: string, harmDelta: number, armour = 0, isHeal = false): HunterCharacter {
    const campaign = campaigns[campaignId];
    if (!campaign || !campaign.characters[charId]) throw new Error('Caçador não encontrado');

    const char = campaign.characters[charId];
    if (isHeal) {
      const healed = healHarm(char.harm, Math.abs(harmDelta), char.isUnstable);
      char.harm = healed.newHarm;
      char.isUnstable = healed.isUnstable;
    } else {
      const harmed = calculateHarm(char.harm, harmDelta, armour);
      char.harm = harmed.newHarm;
      char.isUnstable = harmed.isUnstable;
    }

    char.updatedAt = Date.now();
    campaign.updatedAt = Date.now();
    persistData();

    this.addChatMessage(campaignId, {
      userId: char.userId,
      userName: char.playerName,
      characterName: char.name,
      type: 'system',
      content: isHeal
        ? `${char.name} recuperou dano. Marcador de Dano agora em ${char.harm}/7.`
        : `${char.name} sofreu dano! Marcador de Dano agora em ${char.harm}/7 ${char.isUnstable ? '(FERIMENTO GRAVE / INSTÁVEL)' : ''}.`,
      visibility: 'publica',
    });

    broadcastSSE(campaignId, 'campaign_updated', campaign);
    return char;
  },

  spendLuck(campaignId: string, charId: string): HunterCharacter {
    const campaign = campaigns[campaignId];
    if (!campaign || !campaign.characters[charId]) throw new Error('Caçador não encontrado');

    const char = campaign.characters[charId];
    const luckResult = spendLuckPoint(char.luckCurrent, char.luckMax);
    if (!luckResult.canSpend) throw new Error('Sem pontos de Sorte disponíveis!');

    char.luckCurrent = luckResult.newLuck;
    char.updatedAt = Date.now();
    campaign.updatedAt = Date.now();
    persistData();

    this.addChatMessage(campaignId, {
      userId: char.userId,
      userName: char.playerName,
      characterName: char.name,
      type: 'system',
      content: luckResult.isDoomed
        ? `ATENÇÃO: ${char.name} gastou seu ÚLTIMO ponto de Sorte! O Caçador agora está CONDENADO!`
        : `${char.name} queimou 1 ponto de Sorte! (${char.luckCurrent}/${char.luckMax} gastos). A rolagem se torna 12 ou o perigo é evitado!`,
      visibility: 'publica',
    });

    broadcastSSE(campaignId, 'campaign_updated', campaign);
    return char;
  },

  updateExperience(campaignId: string, charId: string, delta: number): HunterCharacter {
    const campaign = campaigns[campaignId];
    if (!campaign || !campaign.characters[charId]) throw new Error('Caçador não encontrado');

    const char = campaign.characters[charId];
    const expResult = calculateExpAddition(char.experience, delta);
    char.experience = expResult.newExp;
    char.levelUpsTaken += expResult.levelUpsGained;
    char.updatedAt = Date.now();
    campaign.updatedAt = Date.now();
    persistData();

    if (expResult.levelUpsGained > 0) {
      this.addChatMessage(campaignId, {
        userId: char.userId,
        userName: char.playerName,
        characterName: char.name,
        type: 'system',
        content: `EVOLUÇÃO! ${char.name} preencheu o 5º marcador de Experiência e subiu de nível! Escolha uma melhoria na ficha.`,
        visibility: 'publica',
      });
    }

    broadcastSSE(campaignId, 'campaign_updated', campaign);
    return char;
  },

  updateActiveMystery(campaignId: string, mystery: Mystery): Mystery {
    const campaign = campaigns[campaignId];
    if (!campaign) throw new Error('Campanha não encontrada');

    campaign.activeMystery = mystery;
    campaign.updatedAt = Date.now();
    persistData();
    broadcastSSE(campaignId, 'campaign_updated', campaign);
    return mystery;
  },

  advanceCountdown(campaignId: string): Mystery {
    const campaign = campaigns[campaignId];
    if (!campaign || !campaign.activeMystery) throw new Error('Mistério não encontrado');

    const stages: Array<'dia' | 'sombras' | 'entardecer' | 'poente' | 'anoitecer' | 'meia_noite'> = [
      'dia',
      'sombras',
      'entardecer',
      'poente',
      'anoitecer',
      'meia_noite',
    ];
    const currentIndex = stages.indexOf(campaign.activeMystery.currentStage);
    if (currentIndex < stages.length - 1) {
      const nextStage = stages[currentIndex + 1];
      campaign.activeMystery.currentStage = nextStage;
      const stageObj = campaign.activeMystery.countdown.find((s) => s.stage === nextStage);
      if (stageObj) stageObj.isTriggered = true;

      this.addChatMessage(campaignId, {
        userId: campaign.keeperId,
        userName: campaign.keeperName,
        type: 'keeper_announcement',
        content: `A CONTAGEM REGRESSIVA AVANÇOU PARA: ${nextStage.toUpperCase()}!\n"${stageObj?.description || ''}"`,
        visibility: 'publica',
      });
    }

    campaign.updatedAt = Date.now();
    persistData();
    broadcastSSE(campaignId, 'campaign_updated', campaign);
    return campaign.activeMystery;
  },

  updateScenes(campaignId: string, scenes: Scene[]): Scene[] {
    const campaign = campaigns[campaignId];
    if (!campaign) throw new Error('Campanha não encontrada');

    campaign.scenes = scenes;
    campaign.updatedAt = Date.now();
    persistData();

    const activeScene = scenes.find((s) => s.isActive);
    if (activeScene) {
      this.addChatMessage(campaignId, {
        userId: campaign.keeperId,
        userName: campaign.keeperName,
        type: 'narrative',
        content: `O Guardião mudou a cena ativa para: **${activeScene.name}**\n${activeScene.description}`,
        visibility: 'publica',
      });
    }

    broadcastSSE(campaignId, 'campaign_updated', campaign);
    return scenes;
  },

  updateDiary(campaignId: string, diary: DiaryEntry[]): DiaryEntry[] {
    const campaign = campaigns[campaignId];
    if (!campaign) throw new Error('Campanha não encontrada');

    campaign.diary = diary;
    campaign.updatedAt = Date.now();
    persistData();
    broadcastSSE(campaignId, 'campaign_updated', campaign);
    return diary;
  },

  awardEndOfSessionXp(campaignId: string, questionsAnsweredYesCount: number) {
    const campaign = campaigns[campaignId];
    if (!campaign) throw new Error('Campanha não encontrada');

    const xpGained = Math.max(0, questionsAnsweredYesCount);
    if (xpGained === 0) return;

    Object.values(campaign.characters).forEach((char) => {
      const expRes = calculateExpAddition(char.experience, xpGained);
      char.experience = expRes.newExp;
      if (expRes.levelUpsGained > 0) {
        char.levelUpsTaken = (char.levelUpsTaken || 0) + expRes.levelUpsGained;
        char.pendingLevelUps = (char.pendingLevelUps || 0) + expRes.levelUpsGained;
      }
      char.updatedAt = Date.now();
    });

    campaign.sessionsCount = (campaign.sessionsCount || 1) + 1;
    campaign.updatedAt = Date.now();
    persistData();

    this.addChatMessage(campaignId, {
      userId: campaign.keeperId,
      userName: campaign.keeperName,
      type: 'keeper_announcement',
      content: `FIM DE SESSÃO: ${xpGained} perguntas respondidas com SIM! Todos os Caçadores receberam +${xpGained} de Experiência.`,
      visibility: 'publica',
    });

    broadcastSSE(campaignId, 'campaign_updated', campaign);
  },

  deleteCampaign(campaignId: string, keeperId: string, confirmationName: string): boolean {
    const campaign = campaigns[campaignId];
    if (!campaign) throw new Error('Campanha não encontrada');
    if (campaign.keeperId !== keeperId) {
      throw new Error('Apenas o Guardião pode excluir esta campanha');
    }
    const cleanProvided = confirmationName.trim().toLowerCase();
    const cleanActual = campaign.name.trim().toLowerCase();
    if (cleanProvided !== cleanActual) {
      throw new Error(`Nome incorreto para confirmação. Digite exatamente "${campaign.name}"`);
    }

    delete campaigns[campaignId];
    delete chatMessages[campaignId];
    persistData();

    broadcastSSE(campaignId, 'campaign_deleted', { campaignId });
    return true;
  },

  leaveCampaign(campaignId: string, userId: string): Campaign {
    const campaign = campaigns[campaignId];
    if (!campaign) throw new Error('Campanha não encontrada');
    if (campaign.keeperId === userId) {
      throw new Error('O Guardião não pode sair da campanha sem transferir a liderança ou excluí-la');
    }

    const participant = campaign.participants.find((p) => p.userId === userId);
    campaign.participants = campaign.participants.filter((p) => p.userId !== userId);
    campaign.updatedAt = Date.now();
    persistData();

    if (participant) {
      this.addChatMessage(campaignId, {
        userId,
        userName: participant.userName,
        type: 'system',
        content: `${participant.userName} saiu da campanha.`,
        visibility: 'publica',
      });
    }

    broadcastSSE(campaignId, 'campaign_updated', campaign);
    return campaign;
  },

  toggleArchiveCampaign(campaignId: string, keeperId: string): Campaign {
    const campaign = campaigns[campaignId];
    if (!campaign) throw new Error('Campanha não encontrada');
    if (campaign.keeperId !== keeperId) {
      throw new Error('Apenas o Guardião pode arquivar ou reativar a campanha');
    }

    campaign.status = campaign.status === 'arquivada' ? 'ativa' : 'arquivada';
    campaign.updatedAt = Date.now();
    persistData();

    this.addChatMessage(campaignId, {
      userId: keeperId,
      userName: campaign.keeperName,
      type: 'system',
      content: campaign.status === 'arquivada'
        ? 'A campanha foi arquivada pelo Guardião.'
        : 'A campanha foi reativada pelo Guardião.',
      visibility: 'publica',
    });

    broadcastSSE(campaignId, 'campaign_updated', campaign);
    return campaign;
  },

  updateCampaignDetails(campaignId: string, updates: Partial<Campaign>, keeperId: string): Campaign {
    const campaign = campaigns[campaignId];
    if (!campaign) throw new Error('Campanha não encontrada');
    if (campaign.keeperId !== keeperId) {
      throw new Error('Apenas o Guardião pode editar os detalhes da campanha');
    }

    if (updates.name) campaign.name = updates.name.trim();
    if (updates.description !== undefined) campaign.description = updates.description.trim();
    if (updates.coverImage !== undefined) campaign.coverImage = updates.coverImage;
    if (updates.settings) campaign.settings = { ...campaign.settings, ...updates.settings };

    campaign.updatedAt = Date.now();
    persistData();
    broadcastSSE(campaignId, 'campaign_updated', campaign);
    return campaign;
  },

  manageExperience(campaignId: string, params: {
    hunterId?: string;
    allHunters?: boolean;
    delta: number;
    reason: string;
    keeperId: string;
    keeperName: string;
  }): { updatedCount: number; message: string } {
    const campaign = campaigns[campaignId];
    if (!campaign) throw new Error('Campanha não encontrada');
    if (campaign.keeperId !== params.keeperId) {
      throw new Error('Apenas o Guardião pode gerenciar a experiência dos caçadores');
    }

    const delta = params.delta;
    const reason = params.reason.trim() || 'Ação em jogo ou progressão narrativa';
    const targets = params.allHunters
      ? Object.values(campaign.characters)
      : params.hunterId && campaign.characters[params.hunterId]
      ? [campaign.characters[params.hunterId]]
      : [];

    if (targets.length === 0) {
      throw new Error('Nenhum caçador selecionado para alteração de experiência');
    }

    targets.forEach((char) => {
      const expRes = calculateExpAddition(char.experience, delta);
      char.experience = expRes.newExp;
      if (expRes.levelUpsGained > 0) {
        char.levelUpsTaken = (char.levelUpsTaken || 0) + expRes.levelUpsGained;
        char.pendingLevelUps = (char.pendingLevelUps || 0) + expRes.levelUpsGained;
      }
      if (!char.xpHistory) char.xpHistory = [];
      char.xpHistory.unshift({
        id: `xp-${crypto.randomBytes(3).toString('hex')}`,
        date: Date.now(),
        amount: delta,
        reason,
        grantedBy: params.keeperName,
      });
      char.updatedAt = Date.now();
    });

    campaign.updatedAt = Date.now();
    persistData();

    const sign = delta >= 0 ? `+${delta}` : `${delta}`;
    const targetNames = params.allHunters ? 'Todos os Caçadores' : targets.map((t) => t.name).join(', ');
    const announcement = `EXPERIÊNCIA CONCEDIDA: ${targetNames} receberam ${sign} XP!\nMotivo: "${reason}"`;

    this.addChatMessage(campaignId, {
      userId: params.keeperId,
      userName: params.keeperName,
      type: 'keeper_announcement',
      content: announcement,
      visibility: 'publica',
    });

    broadcastSSE(campaignId, 'xp_awarded', {
      hunterIds: targets.map((t) => t.id),
      delta,
      reason,
      announcement,
    });
    broadcastSSE(campaignId, 'campaign_updated', campaign);

    return { updatedCount: targets.length, message: announcement };
  },

  spendLuckAdvanced(campaignId: string, params: {
    charId: string;
    option: 'roll_to_12' | 'cancel_harm';
    rollId?: string;
  }): HunterCharacter {
    const campaign = campaigns[campaignId];
    if (!campaign || !campaign.characters[params.charId]) throw new Error('Caçador não encontrado');

    const char = campaign.characters[params.charId];
    const luckResult = spendLuckPoint(char.luckCurrent, char.luckMax);
    if (!luckResult.canSpend) throw new Error('Sem pontos de Sorte disponíveis!');

    char.luckCurrent = luckResult.newLuck;
    char.updatedAt = Date.now();

    let details = '';
    if (params.option === 'roll_to_12') {
      details = 'Transformou a rolagem recente em um 12 (Sucesso Total/Avançado)!';
      // Find latest roll or specific rollId in chat
      if (chatMessages[campaignId]) {
        for (let i = chatMessages[campaignId].length - 1; i >= 0; i--) {
          const m = chatMessages[campaignId][i];
          if (m.roll && (!params.rollId || m.roll.id === params.rollId)) {
            m.roll.total = 12;
            m.roll.outcome = 'sucesso';
            m.roll.outcomeLabel = 'Sucesso Total (12) [Sorte Queimada]';
            m.roll.luckApplied = true;
            m.roll.luckOptionUsed = 'roll_to_12';
            m.content = `${char.name} queimou SORTE! Rolagem alterada para 12!`;
            break;
          }
        }
      }
    } else {
      details = 'Evitou completamente o perigo e reduziu todo o dano do ataque a 0!';
    }

    campaign.updatedAt = Date.now();
    persistData();

    this.addChatMessage(campaignId, {
      userId: char.userId,
      userName: char.playerName,
      characterName: char.name,
      type: 'system',
      content: luckResult.isDoomed
        ? `ATENÇÃO: ${char.name} queimou seu ÚLTIMO ponto de Sorte! O Caçador agora está CONDENADO!\nEfeito: ${details}`
        : `${char.name} queimou 1 ponto de Sorte! (${char.luckCurrent}/${char.luckMax} gastos).\nEfeito: ${details}`,
      visibility: 'publica',
    });

    broadcastSSE(campaignId, 'campaign_updated', campaign);
    return char;
  },

  applyLevelUpImprovement(campaignId: string, charId: string, improvement: string, ratingToBoost?: RatingName): HunterCharacter {
    const campaign = campaigns[campaignId];
    if (!campaign || !campaign.characters[charId]) throw new Error('Caçador não encontrado');

    const char = campaign.characters[charId];
    if ((char.pendingLevelUps || 0) <= 0) {
      throw new Error('Não há melhorias de nível pendentes para este caçador');
    }

    char.pendingLevelUps = Math.max(0, (char.pendingLevelUps || 1) - 1);
    if (!char.improvementsChosen) char.improvementsChosen = [];
    char.improvementsChosen.push(improvement);

    if (ratingToBoost && char.ratings[ratingToBoost] !== undefined) {
      if (char.ratings[ratingToBoost] < 3) {
        char.ratings[ratingToBoost] += 1;
      }
    }

    char.updatedAt = Date.now();
    campaign.updatedAt = Date.now();
    persistData();

    this.addChatMessage(campaignId, {
      userId: char.userId,
      userName: char.playerName,
      characterName: char.name,
      type: 'system',
      content: `${char.name} escolheu uma melhoria de nível: "${improvement}"${ratingToBoost ? ` (+1 em ${ratingToBoost})` : ''}!`,
      visibility: 'publica',
    });

    broadcastSSE(campaignId, 'campaign_updated', campaign);
    return char;
  },

  revertCountdown(campaignId: string): Mystery {
    const campaign = campaigns[campaignId];
    if (!campaign || !campaign.activeMystery) throw new Error('Mistério não encontrado');

    const stages: Array<'dia' | 'sombras' | 'entardecer' | 'poente' | 'anoitecer' | 'meia_noite'> = [
      'dia',
      'sombras',
      'entardecer',
      'poente',
      'anoitecer',
      'meia_noite',
    ];
    const currentIndex = stages.indexOf(campaign.activeMystery.currentStage);
    if (currentIndex > 0) {
      const prevStage = stages[currentIndex - 1];
      campaign.activeMystery.currentStage = prevStage;
      // Untrigger current stage
      const currentStageObj = campaign.activeMystery.countdown.find((s) => s.stage === stages[currentIndex]);
      if (currentStageObj) currentStageObj.isTriggered = false;

      this.addChatMessage(campaignId, {
        userId: campaign.keeperId,
        userName: campaign.keeperName,
        type: 'keeper_announcement',
        content: `O Guardião retrocedeu a Contagem Regressiva para: ${prevStage.toUpperCase()}.`,
        visibility: 'publica',
      });
    }

    campaign.updatedAt = Date.now();
    persistData();
    broadcastSSE(campaignId, 'campaign_updated', campaign);
    return campaign.activeMystery;
  },

  updateArcs(campaignId: string, arcs: any[]): any[] {
    const campaign = campaigns[campaignId];
    if (!campaign) throw new Error('Campanha não encontrada');
    campaign.arcs = arcs;
    campaign.updatedAt = Date.now();
    persistData();
    broadcastSSE(campaignId, 'campaign_updated', campaign);
    return arcs;
  },

  updateClues(campaignId: string, clues: any[]): any[] {
    const campaign = campaigns[campaignId];
    if (!campaign) throw new Error('Campanha não encontrada');
    campaign.clues = clues;
    campaign.updatedAt = Date.now();
    persistData();
    broadcastSSE(campaignId, 'campaign_updated', campaign);
    return clues;
  },

  updateMysteryLibrary(campaignId: string, mysteryLibrary: Mystery[]): Mystery[] {
    const campaign = campaigns[campaignId];
    if (!campaign) throw new Error('Campanha não encontrada');
    campaign.mysteryLibrary = mysteryLibrary;
    campaign.updatedAt = Date.now();
    persistData();
    broadcastSSE(campaignId, 'campaign_updated', campaign);
    return mysteryLibrary;
  },

  startMystery(campaignId: string, mysteryId: string): Mystery {
    const campaign = campaigns[campaignId];
    if (!campaign) throw new Error('Campanha não encontrada');
    if (!campaign.mysteryLibrary) campaign.mysteryLibrary = [];

    const found = campaign.mysteryLibrary.find((m) => m.id === mysteryId);
    if (!found) throw new Error('Mistério não encontrado na biblioteca');

    // Archive current active mystery if exists
    if (campaign.activeMystery) {
      if (!campaign.archivedMysteries) campaign.archivedMysteries = [];
      campaign.archivedMysteries.push(campaign.activeMystery);
    }

    found.status = 'em_andamento';
    campaign.activeMystery = found;
    campaign.updatedAt = Date.now();
    persistData();

    this.addChatMessage(campaignId, {
      userId: campaign.keeperId,
      userName: campaign.keeperName,
      type: 'keeper_announcement',
      content: `NOVO MISTÉRIO INICIADO NA MESA: "${found.title}"!\nGancho: ${found.hook}`,
      visibility: 'publica',
    });

    broadcastSSE(campaignId, 'campaign_updated', campaign);
    return found;
  },

  updateThreatBank(campaignId: string, threats: any[]): any[] {
    const campaign = campaigns[campaignId];
    if (!campaign) throw new Error('Campanha não encontrada');
    campaign.threatBank = threats;
    campaign.updatedAt = Date.now();
    persistData();
    broadcastSSE(campaignId, 'campaign_updated', campaign);
    return threats;
  },

  updateSessions(campaignId: string, sessions: any[]): any[] {
    const campaign = campaigns[campaignId];
    if (!campaign) throw new Error('Campanha não encontrada');
    campaign.sessions = sessions;
    campaign.updatedAt = Date.now();
    persistData();
    broadcastSSE(campaignId, 'campaign_updated', campaign);
    return sessions;
  },
};
