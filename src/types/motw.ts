/**
 * TypeScript definitions for Monstro da Semana (Monster of the Week)
 * Baseado na Edição Revisada brasileira (Michael Sands / tradução de Luiz Borges)
 */

export type RatingName = 'Braveza' | 'Esperteza' | 'Estranheza' | 'Firmeza' | 'Sutileza';

export interface Ratings {
  Braveza: number;
  Esperteza: number;
  Estranheza: number;
  Firmeza: number;
  Sutileza: number;
}

export type PlaybookId =
  | 'arcano'
  | 'delinquente'
  | 'divino'
  | 'escolhido'
  | 'especialista'
  | 'iniciado'
  | 'injusticado'
  | 'lunatico'
  | 'monstruoso'
  | 'mundano'
  | 'profissional'
  | 'sinistro'
  | 'viajante';

export type UserRole = 'guardiao' | 'cacador';

export type RollOutcome = 'falha' | 'parcial' | 'sucesso' | 'avancado';

export type VisibilityMode = 'publica' | 'privada' | 'cega' | 'individual';

export interface PlaybookMove {
  id: string;
  name: string;
  rating?: RatingName;
  isDefault?: boolean;
  requiresRoll?: boolean;
  description: string;
  details?: string[];
}

export interface PlaybookSpecialFeature {
  type:
    | 'magia_combativa'
    | 'antecedentes_perseguicao'
    | 'missao'
    | 'sina'
    | 'refugio'
    | 'seita'
    | 'quem_perdeu'
    | 'raca_maldicao'
    | 'agencia'
    | 'lado_sombrio'
    | 'meio_transporte'
    | 'custom';
  title: string;
  description: string;
  data: Record<string, any>;
}

export interface WeaponOption {
  id: string;
  name: string;
  harm: number;
  tags: string[]; // e.g. ['perto', 'barulhenta', 'recarga']
  category?: string;
  description?: string;
}

export interface HunterXpLog {
  id: string;
  date: number;
  amount: number;
  reason: string;
  grantedBy: string;
}

export interface HunterCharacter {
  id: string;
  userId: string;
  playerName: string;
  name: string;
  playbookId: PlaybookId;
  playbookName: string;
  pronouns?: string;
  look: string;
  description?: string;
  portraitUrl?: string;
  ratings: Ratings;
  
  // Status
  harm: number; // 0 to 7. 4+ is unstable. 8+ is dead/fatal.
  isUnstable: boolean;
  armour: number;
  
  // Luck (Marcador de Sorte)
  luckCurrent: number; // number of boxes marked. Total is maxLuck.
  luckMax: number; // usually 7
  
  // Experience & Level up
  experience: number; // 0 to 5
  levelUpsTaken: number; // How many times level up occurred
  pendingLevelUps?: number; // Level ups waiting for choice
  improvementsChosen: string[];
  advancedMovesUnlocked: string[]; // basic move names upgraded to 12+
  xpHistory?: HunterXpLog[];
  
  // Moves chosen
  selectedMoves: string[]; // move IDs
  
  // Special playbook features stored
  specialFeatures: Record<string, any>;
  
  // Gear
  weapons: WeaponOption[];
  gearNotes: string;
  
  // History & Bonds
  historyNotes: string;
  bonds: Array<{ otherHunterName: string; relationship: string }>;
  
  // Personal notes
  personalNotes?: string;
  
  createdAt: number;
  updatedAt: number;
}

export interface DiceRoll {
  id: string;
  campaignId: string;
  userId: string;
  userName: string;
  hunterId?: string;
  hunterName?: string;
  moveName: string;
  ratingUsed?: RatingName;
  ratingModifier: number;
  situationalModifier: number;
  dice: [number, number];
  total: number;
  outcome: RollOutcome;
  outcomeLabel: string;
  outcomeText: string;
  actionDescription?: string;
  visibility: VisibilityMode;
  luckApplied?: boolean;
  luckOptionUsed?: 'roll_to_12' | 'cancel_harm';
  timestamp: number;
}

export type ChatMessageType = 'chat' | 'roll' | 'narrative' | 'keeper_announcement' | 'system';

export interface ChatMessage {
  id: string;
  campaignId: string;
  userId: string;
  userName: string;
  characterName?: string;
  type: ChatMessageType;
  content: string;
  visibility: VisibilityMode;
  roll?: DiceRoll;
  timestamp: number;
}

export type CountdownStageKey = 'dia' | 'sombras' | 'entardecer' | 'poente' | 'anoitecer' | 'meia_noite';

export interface CountdownStage {
  stage: CountdownStageKey;
  label: string;
  description: string;
  isTriggered: boolean;
  keeperNotes?: string;
}

export type ThreatType = 'monstro' | 'lacaio' | 'espectador' | 'local';

export interface Threat {
  id: string;
  name: string;
  type: ThreatType;
  motivation: string;
  appearance: string;
  description: string;
  powers?: string;
  weaknesses?: string;
  attacks?: string;
  armour?: number;
  harmMax?: number;
  harmCurrent?: number;
  customMoves?: string;
  isRevealedToHunters: boolean;
  category?: string;
  imageUrl?: string;
}

export type ClueStatus = 'oculta' | 'disponivel' | 'revelada' | 'descoberta';

export interface InvestigationClue {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  status: ClueStatus;
  revealedTo: 'todos' | string[]; // 'todos' or array of hunter/user IDs
  sceneId?: string;
  mysteryId?: string;
  discoveredByHunterName?: string;
  createdAt: number;
}

export type MysteryStatus = 'ideia' | 'rascunho' | 'preparado' | 'em_andamento' | 'resolvido' | 'arquivado';

export interface Mystery {
  id: string;
  title: string;
  concept: string;
  hook: string;
  threats: Threat[];
  countdown: CountdownStage[];
  currentStage: CountdownStageKey;
  status?: MysteryStatus;
  isSolved: boolean;
  notes: string; // Keeper notes
  clues?: InvestigationClue[];
  arcId?: string;
}

export type ArcStatus = 'ideia' | 'em_planejamento' | 'ativo' | 'concluido' | 'arquivado';

export interface Arc {
  id: string;
  title: string;
  concept: string;
  status: ArcStatus;
  linkedMysteryIds: string[];
  notes: string;
  createdAt: number;
  updatedAt: number;
}

export type SceneStatus = 'rascunho' | 'preparada' | 'ativa' | 'arquivada';

export interface Scene {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  clues: string[];
  gmNotes?: string;
  status?: SceneStatus;
  isActive: boolean;
  isSecret?: boolean;
  order?: number;
}

export interface DiaryEntry {
  id: string;
  title: string;
  content: string;
  category: 'pista' | 'segredo' | 'monstro' | 'espectador' | 'arco';
  isSharedWithPlayers: boolean;
  createdAt: number;
}

export interface GameSession {
  id: string;
  sessionNumber: number;
  title: string;
  date: number;
  summary: string;
  notes?: string;
  xpAwarded: number;
}

export interface CampaignParticipant {
  userId: string;
  userName: string;
  avatarUrl?: string;
  role: UserRole;
  joinedAt: number;
  lastActiveAt: number;
}

export interface CampaignSettings {
  allowDuplicatePlaybooks: boolean;
  customRulesNotes?: string;
}

export type CampaignStatus = 'ativa' | 'arquivada';

export interface Campaign {
  id: string;
  name: string;
  description: string;
  coverImage?: string;
  inviteCode: string; // e.g. "MOTW-9X4K"
  keeperId: string;
  keeperName: string;
  status?: CampaignStatus;
  settings: CampaignSettings;
  participants: CampaignParticipant[];
  characters: Record<string, HunterCharacter>;
  activeMystery?: Mystery;
  mysteryLibrary?: Mystery[]; // Full library of mysteries (ideas, prepared, etc.)
  archivedMysteries?: Mystery[];
  arcs?: Arc[]; // Long-term story arcs
  scenes: Scene[];
  sceneQueue?: string[]; // IDs of upcoming scenes
  threatBank?: Threat[]; // Reusable bank of threats
  clues?: InvestigationClue[]; // Global investigation clues
  sessions?: GameSession[];
  diary: DiaryEntry[];
  sessionsCount: number;
  createdAt: number;
  updatedAt: number;
  deletedAt?: number;
}

export interface UserProfile {
  id: string;
  name: string;
  avatarUrl?: string;
  email?: string;
  currentCampaignId?: string;
}
