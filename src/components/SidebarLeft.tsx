import React, { useState } from 'react';
import { useVTT } from '../context/VTTContext';
import {
  Film,
  Users,
  Compass,
  Skull,
  BookOpen,
  HelpCircle,
  Award,
  ChevronLeft,
  ChevronRight,
  Plus,
  Eye,
  EyeOff,
  Flame,
  CheckCircle2,
  Clock,
  Sparkles,
  Heart,
  Shield,
} from 'lucide-react';
import { MOTW_BASIC_MOVES } from '../data/motwBasicMoves';
import {
  KEEPER_AGENDA,
  KEEPER_PRINCIPLES,
  KEEPER_BASIC_MOVES,
  THREAT_CATEGORIES_INFO,
  END_OF_SESSION_QUESTIONS,
  COUNTDOWN_STAGE_LABELS,
} from '../data/keeperReference';
import { Scene, Threat, DiaryEntry, CountdownStageKey } from '../types/motw';
import { ImageUploadInput } from './ImageUploadInput';

interface SidebarLeftProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenCharacterSheetFor: (hunterId: string) => void;
  onOpenCharacterCreator: () => void;
  onSelectMoveToRoll: (moveId: string) => void;
  onCloseMobile?: () => void;
}

export const SidebarLeft: React.FC<SidebarLeftProps> = ({
  activeTab,
  setActiveTab,
  onOpenCharacterSheetFor,
  onOpenCharacterCreator,
  onSelectMoveToRoll,
  onCloseMobile,
}) => {
  const {
    currentCampaign,
    currentRole,
    activeHunter,
    setActiveScene,
    updateScenes,
    advanceCountdown,
    updateMystery,
    updateDiary,
    awardEndOfSession,
  } = useVTT();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const isKeeper = currentRole === 'guardiao';

  // New Scene Form State
  const [showNewSceneModal, setShowNewSceneModal] = useState(false);
  const [newSceneName, setNewSceneName] = useState('');
  const [newSceneDesc, setNewSceneDesc] = useState('');
  const [newSceneImg, setNewSceneImg] = useState('');

  // New Threat Form State
  const [showNewThreatModal, setShowNewThreatModal] = useState(false);
  const [newThreatName, setNewThreatName] = useState('');
  const [newThreatType, setNewThreatType] = useState<Threat['type']>('monstro');
  const [newThreatMotivation, setNewThreatMotivation] = useState('');
  const [newThreatDesc, setNewThreatDesc] = useState('');

  // New Diary Entry Form State
  const [showNewDiaryModal, setShowNewDiaryModal] = useState(false);
  const [newDiaryTitle, setNewDiaryTitle] = useState('');
  const [newDiaryContent, setNewDiaryContent] = useState('');
  const [newDiaryCategory, setNewDiaryCategory] = useState<DiaryEntry['category']>('pista');
  const [newDiaryShared, setNewDiaryShared] = useState(true);

  // End of Session Checklist
  const [sessionChecklist, setSessionChecklist] = useState<Record<string, boolean>>({
    concluiram_misterio: false,
    salvaram_alguem: false,
    aprenderam_sobre_monstros: false,
    aprofundaram_lacos: false,
  });

  if (!currentCampaign) return null;

  const charactersList = Object.values(currentCampaign.characters);
  const mystery = currentCampaign.activeMystery;

  const handleAddScene = () => {
    if (!newSceneName.trim()) return;
    const newScene: Scene = {
      id: `scene-${Date.now()}`,
      name: newSceneName,
      description: newSceneDesc || 'Nova cena em investigação.',
      imageUrl: newSceneImg || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
      clues: [],
      isActive: false,
    };
    updateScenes([...currentCampaign.scenes, newScene]);
    setNewSceneName('');
    setNewSceneDesc('');
    setNewSceneImg('');
    setShowNewSceneModal(false);
  };

  const handleAddThreat = () => {
    if (!newThreatName.trim() || !mystery) return;
    const newThreat: Threat = {
      id: `threat-${Date.now()}`,
      name: newThreatName,
      type: newThreatType,
      motivation: newThreatMotivation || 'Motivação padrão da ameaça',
      appearance: 'Aparência misteriosa',
      description: newThreatDesc,
      armour: newThreatType === 'monstro' ? 1 : 0,
      harmMax: newThreatType === 'monstro' ? 8 : 4,
      harmCurrent: 0,
      isRevealedToHunters: false,
    };
    updateMystery({
      ...mystery,
      threats: [...mystery.threats, newThreat],
    });
    setNewThreatName('');
    setNewThreatDesc('');
    setShowNewThreatModal(false);
  };

  const handleAddDiary = () => {
    if (!newDiaryTitle.trim()) return;
    const entry: DiaryEntry = {
      id: `diary-${Date.now()}`,
      title: newDiaryTitle,
      content: newDiaryContent,
      category: newDiaryCategory,
      isSharedWithPlayers: newDiaryShared,
      createdAt: Date.now(),
    };
    updateDiary([...currentCampaign.diary, entry]);
    setNewDiaryTitle('');
    setNewDiaryContent('');
    setShowNewDiaryModal(false);
  };

  const navItems = [
    { id: 'cenas', label: 'Cenas', icon: Film },
    { id: 'cacadores', label: 'Caçadores', icon: Users, badge: charactersList.length },
    { id: 'misterio', label: 'Mistério', icon: Compass },
    { id: 'ameacas', label: 'Ameaças', icon: Skull, badge: mystery?.threats.length },
    { id: 'diario', label: 'Diário & Pistas', icon: BookOpen, badge: currentCampaign.diary.length },
    { id: 'regras', label: 'Regras', icon: HelpCircle },
    ...(isKeeper ? [{ id: 'fim_sessao', label: 'Fim de Sessão', icon: Award }] : []),
  ];

  return (
    <div className="flex w-full h-full bg-zinc-950 border-r border-zinc-800 select-none z-10">
      {/* Icon Bar (Foundry VTT sidebar spine) */}
      <div className="w-14 md:w-12 bg-zinc-950 border-r border-zinc-850 flex flex-col items-center py-2.5 gap-2 shrink-0">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id && !isCollapsed;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsCollapsed(false);
              }}
              title={item.label}
              className={`relative w-11 h-11 md:w-9 md:h-9 min-h-[44px] min-w-[44px] md:min-h-0 md:min-w-0 rounded-lg flex items-center justify-center transition-all ${
                isActive
                  ? 'bg-amber-600 text-zinc-950 shadow-md scale-105'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 active:bg-zinc-800'
              }`}
            >
              <Icon className="w-5 h-5 md:w-4 md:h-4" />
              {item.badge !== undefined && item.badge > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[9px] font-bold px-1 rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        <div className="mt-auto hidden md:block">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? 'Expandir painel' : 'Recolher painel'}
            className="w-9 h-9 rounded flex items-center justify-center text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900 transition-colors"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Slide-out Content Panel */}
      {!isCollapsed && (
        <aside className="flex-1 min-w-0 md:w-80 h-full bg-zinc-900/95 flex flex-col border-r border-zinc-800 overflow-hidden text-xs pb-0 md:pb-0">
          {/* Panel Header */}
          <div className="p-3 border-b border-zinc-800 bg-zinc-950/50 flex items-center justify-between">
            <span className="font-bold text-zinc-200 uppercase tracking-wider text-[11px] flex items-center gap-1.5 truncate">
              {navItems.find((n) => n.id === activeTab)?.label}
            </span>
            <div className="flex items-center gap-1">
              {onCloseMobile && (
                <button
                  type="button"
                  onClick={onCloseMobile}
                  className="md:hidden px-2 py-1 text-[11px] text-amber-300 bg-amber-950/70 border border-amber-600/40 rounded font-semibold active:bg-amber-900"
                >
                  Ver Cena
                </button>
              )}
              <button
                onClick={() => setIsCollapsed(true)}
                className="hidden md:flex text-zinc-500 hover:text-zinc-300 p-0.5 rounded"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Panel Body */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
            {/* TAB: CENAS */}
            {activeTab === 'cenas' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 font-medium">Locais da Sessão</span>
                  {isKeeper && (
                    <button
                      onClick={() => setShowNewSceneModal(true)}
                      className="flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300 bg-amber-950/60 hover:bg-amber-900/60 px-2 py-0.5 rounded border border-amber-600/40"
                    >
                      <Plus className="w-3 h-3" /> Nova Cena
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  {currentCampaign.scenes.map((scene) => (
                    <div
                      key={scene.id}
                      className={`group rounded border overflow-hidden transition-all ${
                        scene.isActive
                          ? 'border-amber-500/80 bg-zinc-850 shadow-md ring-1 ring-amber-500/50'
                          : 'border-zinc-800 bg-zinc-900/80 hover:border-zinc-700'
                      }`}
                    >
                      <div className="h-20 w-full relative overflow-hidden bg-zinc-950">
                        {scene.imageUrl && (
                          <img
                            src={scene.imageUrl}
                            alt={scene.name}
                            className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
                        <div className="absolute bottom-1.5 left-2 right-2 flex items-center justify-between">
                          <span className="font-semibold text-zinc-100 truncate text-[11px] drop-shadow">
                            {scene.name}
                          </span>
                          {scene.isActive && (
                            <span className="bg-amber-600 text-zinc-950 text-[9px] font-black uppercase px-1.5 py-0.5 rounded shadow">
                              Ativa
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="p-2 space-y-1.5">
                        <p className="text-zinc-400 text-[11px] line-clamp-2">{scene.description}</p>
                        {isKeeper && !scene.isActive && (
                          <button
                            onClick={() => setActiveScene(scene.id)}
                            className="w-full py-1 bg-amber-950/70 hover:bg-amber-900/80 text-amber-200 border border-amber-600/40 rounded text-[10px] font-semibold transition-colors"
                          >
                            Tornar Cena Ativa na Mesa
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Modal Add Scene */}
                {showNewSceneModal && (
                  <div className="p-3 bg-zinc-950 rounded border border-amber-600/40 space-y-2">
                    <span className="font-bold text-amber-300 text-xs">Criar Nova Cena</span>
                    <input
                      type="text"
                      placeholder="Nome do Local..."
                      value={newSceneName}
                      onChange={(e) => setNewSceneName(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-xs text-zinc-100"
                    />
                    <textarea
                      placeholder="Descrição atmosférica..."
                      value={newSceneDesc}
                      onChange={(e) => setNewSceneDesc(e.target.value)}
                      rows={2}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-xs text-zinc-100"
                    />
                    <ImageUploadInput
                      label="Foto do Local / Cena (Galeria, Câmera ou Link)"
                      value={newSceneImg}
                      onChange={setNewSceneImg}
                      placeholder="https://..."
                      aspectRatio="landscape"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleAddScene}
                        className="flex-1 py-1 bg-amber-600 hover:bg-amber-500 text-zinc-950 font-bold rounded"
                      >
                        Salvar Cena
                      </button>
                      <button
                        onClick={() => setShowNewSceneModal(false)}
                        className="px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB: CAÇADORES */}
            {activeTab === 'cacadores' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 font-medium">Equipe de Caçadores</span>
                  <button
                    onClick={onOpenCharacterCreator}
                    className="flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/60 px-2 py-0.5 rounded border border-emerald-600/40"
                  >
                    <Plus className="w-3 h-3" /> Criar Caçador
                  </button>
                </div>

                <div className="space-y-2">
                  {charactersList.length === 0 ? (
                    <div className="p-4 text-center text-zinc-500 bg-zinc-950/50 rounded border border-dashed border-zinc-800">
                      Nenhum caçador criado ainda nesta campanha.
                    </div>
                  ) : (
                    charactersList.map((char) => (
                      <div
                        key={char.id}
                        onClick={() => onOpenCharacterSheetFor(char.id)}
                        className="p-2.5 bg-zinc-950/60 hover:bg-zinc-850 rounded border border-zinc-800 hover:border-zinc-700 cursor-pointer transition-all space-y-2"
                      >
                        <div className="flex items-center gap-2">
                          {char.portraitUrl ? (
                            <img
                              src={char.portraitUrl}
                              alt={char.name}
                              className="w-9 h-9 rounded object-cover border border-zinc-700 shrink-0"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400 shrink-0">
                              <Users className="w-4 h-4" />
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <div className="font-bold text-zinc-100 truncate text-xs">{char.name}</div>
                            <div className="text-[10px] text-amber-400/90 truncate">{char.playbookName}</div>
                          </div>
                          {char.harm >= 4 && (
                            <span className="px-1.5 py-0.5 rounded bg-red-950 border border-red-700 text-red-300 font-bold text-[9px]">
                              Instável
                            </span>
                          )}
                        </div>

                        {/* Progress Indicators */}
                        <div className="space-y-1 font-mono text-[10px]">
                          {/* Harm Bar */}
                          <div className="flex items-center justify-between text-zinc-400">
                            <span className="flex items-center gap-1">
                              <Heart className="w-2.5 h-2.5 text-red-500" /> Dano:
                            </span>
                            <span className={char.harm >= 4 ? 'text-red-400 font-bold' : 'text-zinc-300'}>
                              {char.harm} / 7
                            </span>
                          </div>
                          <div className="w-full bg-zinc-800 h-1.5 rounded overflow-hidden flex">
                            <div
                              className={`h-full ${char.harm >= 4 ? 'bg-red-600' : 'bg-amber-600'}`}
                              style={{ width: `${(char.harm / 7) * 100}%` }}
                            />
                          </div>

                          {/* Luck Bar */}
                          <div className="flex items-center justify-between text-zinc-400">
                            <span className="flex items-center gap-1">
                              <Sparkles className="w-2.5 h-2.5 text-amber-500" /> Sorte:
                            </span>
                            <span>{char.luckMax - char.luckCurrent} restante</span>
                          </div>

                          {/* Exp Bar */}
                          <div className="flex items-center justify-between text-zinc-400">
                            <span className="flex items-center gap-1">
                              <Award className="w-2.5 h-2.5 text-emerald-500" /> XP:
                            </span>
                            <span>{char.experience} / 5</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB: MISTÉRIO & CONTAGEM */}
            {activeTab === 'misterio' && (
              <div className="space-y-3">
                {mystery ? (
                  <>
                    <div className="p-2.5 bg-zinc-950 rounded border border-zinc-800 space-y-1">
                      <div className="text-[10px] uppercase font-bold text-amber-500">Mistério Atual</div>
                      <div className="font-bold text-zinc-100 text-sm">{mystery.title}</div>
                      <p className="text-zinc-400 text-[11px]">{mystery.hook}</p>
                    </div>

                    {/* Countdown Clock (Relógio de 6 estágios) */}
                    <div className="p-2.5 bg-zinc-950 rounded border border-zinc-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold text-red-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Contagem Regressiva
                        </span>
                        {isKeeper && mystery.currentStage !== 'meia_noite' && (
                          <button
                            onClick={advanceCountdown}
                            className="px-2 py-0.5 bg-red-950 hover:bg-red-900 border border-red-700 text-red-200 rounded text-[10px] font-bold"
                          >
                            Avançar Relógio
                          </button>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        {mystery.countdown.map((stage) => {
                          const isCurrent = mystery.currentStage === stage.stage;
                          return (
                            <div
                              key={stage.stage}
                              className={`p-1.5 rounded border text-[11px] transition-colors ${
                                isCurrent
                                  ? 'bg-red-950/70 border-red-600 text-red-100'
                                  : stage.isTriggered
                                  ? 'bg-zinc-900 border-zinc-700 text-zinc-300'
                                  : 'bg-zinc-900/40 border-zinc-850 text-zinc-500'
                              }`}
                            >
                              <div className="flex items-center justify-between font-bold">
                                <span>{stage.label}</span>
                                {stage.isTriggered && (
                                  <span className="text-[9px] uppercase px-1 rounded bg-zinc-800 text-zinc-400">
                                    Acontecendo
                                  </span>
                                )}
                              </div>
                              {(isKeeper || stage.isTriggered) && (
                                <p className="text-[10px] mt-0.5 leading-snug">{stage.description}</p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Keeper Notes */}
                    {isKeeper && mystery.notes && (
                      <div className="p-2.5 bg-amber-950/20 border border-amber-700/40 rounded space-y-1">
                        <span className="font-bold text-amber-300 text-[10px] uppercase">
                          Notas Secretas do Guardião
                        </span>
                        <p className="text-zinc-300 text-[11px] whitespace-pre-wrap">{mystery.notes}</p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="p-4 text-center text-zinc-500">Nenhum mistério ativo.</div>
                )}
              </div>
            )}

            {/* TAB: AMEAÇAS */}
            {activeTab === 'ameacas' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 font-medium">Ameaças do Mistério</span>
                  {isKeeper && (
                    <button
                      onClick={() => setShowNewThreatModal(true)}
                      className="flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300 bg-amber-950/60 hover:bg-amber-900/60 px-2 py-0.5 rounded border border-amber-600/40"
                    >
                      <Plus className="w-3 h-3" /> Nova Ameaça
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  {mystery?.threats
                    .filter((t) => isKeeper || t.isRevealedToHunters)
                    .map((threat) => (
                      <div
                        key={threat.id}
                        className="p-2.5 bg-zinc-950 rounded border border-zinc-800 space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-zinc-100">{threat.name}</span>
                          <span className="px-1.5 py-0.2 rounded uppercase text-[9px] font-bold bg-zinc-800 text-zinc-300 border border-zinc-700">
                            {threat.type}
                          </span>
                        </div>
                        <div className="text-[10px] text-amber-400/90 font-mono">
                          Motivação: {threat.motivation}
                        </div>
                        <p className="text-zinc-400 text-[11px]">{threat.description}</p>
                        {threat.attacks && (
                          <div className="text-[10px] text-red-300 font-mono bg-red-950/30 p-1 rounded border border-red-900/40">
                            Ataques: {threat.attacks}
                          </div>
                        )}
                        {threat.weaknesses && (isKeeper || threat.isRevealedToHunters) && (
                          <div className="text-[10px] text-emerald-300 font-mono bg-emerald-950/30 p-1 rounded border border-emerald-900/40">
                            Fraqueza: {threat.weaknesses}
                          </div>
                        )}
                        {isKeeper && (
                          <div className="pt-1 flex items-center justify-between border-t border-zinc-800/80">
                            <span className="text-[10px] text-zinc-500">
                              {threat.isRevealedToHunters ? 'Revelado aos caçadores' : 'Oculto'}
                            </span>
                            <button
                              onClick={() => {
                                const updated = mystery.threats.map((t) =>
                                  t.id === threat.id ? { ...t, isRevealedToHunters: !t.isRevealedToHunters } : t
                                );
                                updateMystery({ ...mystery, threats: updated });
                              }}
                              className="text-zinc-400 hover:text-zinc-200"
                            >
                              {threat.isRevealedToHunters ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                </div>

                {/* Modal Add Threat */}
                {showNewThreatModal && (
                  <div className="p-3 bg-zinc-950 rounded border border-amber-600/40 space-y-2">
                    <span className="font-bold text-amber-300 text-xs">Adicionar Ameaça</span>
                    <input
                      type="text"
                      placeholder="Nome da criatura / lacaio / local..."
                      value={newThreatName}
                      onChange={(e) => setNewThreatName(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-xs text-zinc-100"
                    />
                    <select
                      value={newThreatType}
                      onChange={(e) => setNewThreatType(e.target.value as Threat['type'])}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-xs text-zinc-100"
                    >
                      <option value="monstro">Monstro (Ameaça Principal)</option>
                      <option value="lacaio">Lacaio (Serviçal ou guarda)</option>
                      <option value="espectador">Espectador (Testemunha ou vítima)</option>
                      <option value="local">Local (Covil ou encruzilhada)</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Motivação (ex: Fera: destruir presas)..."
                      value={newThreatMotivation}
                      onChange={(e) => setNewThreatMotivation(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-xs text-zinc-100"
                    />
                    <textarea
                      placeholder="Descrição e poderes..."
                      value={newThreatDesc}
                      onChange={(e) => setNewThreatDesc(e.target.value)}
                      rows={2}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-xs text-zinc-100"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleAddThreat}
                        className="flex-1 py-1 bg-amber-600 hover:bg-amber-500 text-zinc-950 font-bold rounded"
                      >
                        Salvar Ameaça
                      </button>
                      <button
                        onClick={() => setShowNewThreatModal(false)}
                        className="px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB: DIÁRIO */}
            {activeTab === 'diario' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 font-medium">Diário de Pistas & Segredos</span>
                  <button
                    onClick={() => setShowNewDiaryModal(true)}
                    className="flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300 bg-amber-950/60 hover:bg-amber-900/60 px-2 py-0.5 rounded border border-amber-600/40"
                  >
                    <Plus className="w-3 h-3" /> Nova Nota
                  </button>
                </div>

                <div className="space-y-2">
                  {currentCampaign.diary
                    .filter((d) => isKeeper || d.isSharedWithPlayers)
                    .map((item) => (
                      <div
                        key={item.id}
                        className={`p-2.5 rounded border space-y-1 ${
                          item.category === 'segredo'
                            ? 'bg-amber-950/20 border-amber-700/40'
                            : 'bg-zinc-950 border-zinc-800'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-zinc-100">{item.title}</span>
                          <span className="text-[9px] uppercase font-mono px-1 rounded bg-zinc-800 text-zinc-400">
                            {item.category}
                          </span>
                        </div>
                        <p className="text-zinc-300 text-[11px] whitespace-pre-wrap">{item.content}</p>
                        {isKeeper && (
                          <div className="text-[9px] text-zinc-500 pt-1">
                            {item.isSharedWithPlayers ? 'Visível aos jogadores' : 'Segredo do Guardião'}
                          </div>
                        )}
                      </div>
                    ))}
                </div>

                {/* Modal Add Diary */}
                {showNewDiaryModal && (
                  <div className="p-3 bg-zinc-950 rounded border border-amber-600/40 space-y-2">
                    <span className="font-bold text-amber-300 text-xs">Adicionar Entrada no Diário</span>
                    <input
                      type="text"
                      placeholder="Título da nota ou pista..."
                      value={newDiaryTitle}
                      onChange={(e) => setNewDiaryTitle(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-xs text-zinc-100"
                    />
                    <textarea
                      placeholder="Conteúdo..."
                      value={newDiaryContent}
                      onChange={(e) => setNewDiaryContent(e.target.value)}
                      rows={3}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-xs text-zinc-100"
                    />
                    <div className="flex items-center justify-between">
                      <select
                        value={newDiaryCategory}
                        onChange={(e) => setNewDiaryCategory(e.target.value as DiaryEntry['category'])}
                        className="bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-xs text-zinc-100"
                      >
                        <option value="pista">Pista</option>
                        <option value="segredo">Segredo do Mestre</option>
                        <option value="monstro">Registro de Monstro</option>
                        <option value="espectador">Informação de NPC</option>
                      </select>
                      {isKeeper && (
                        <label className="flex items-center gap-1.5 text-zinc-300 text-[11px]">
                          <input
                            type="checkbox"
                            checked={newDiaryShared}
                            onChange={(e) => setNewDiaryShared(e.target.checked)}
                          />
                          Compartilhar
                        </label>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleAddDiary}
                        className="flex-1 py-1 bg-amber-600 hover:bg-amber-500 text-zinc-950 font-bold rounded"
                      >
                        Salvar Nota
                      </button>
                      <button
                        onClick={() => setShowNewDiaryModal(false)}
                        className="px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB: REGRAS */}
            {activeTab === 'regras' && (
              <div className="space-y-3">
                <div className="text-zinc-400 font-medium">Movimentos Básicos do Caçador</div>
                <div className="space-y-2">
                  {MOTW_BASIC_MOVES.map((move) => (
                    <div
                      key={move.id}
                      className="p-2.5 bg-zinc-950 rounded border border-zinc-800 space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-zinc-100">{move.name}</span>
                        <span className="font-mono text-[10px] text-amber-400 bg-amber-950/40 px-1 rounded border border-amber-600/30">
                          +{move.rating}
                        </span>
                      </div>
                      <p className="text-zinc-400 text-[10px] leading-relaxed">{move.description}</p>
                      <button
                        onClick={() => onSelectMoveToRoll(move.id)}
                        className="w-full py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded text-[10px] font-semibold transition-colors"
                      >
                        Rolar Este Movimento
                      </button>
                    </div>
                  ))}
                </div>

                {isKeeper && (
                  <div className="pt-3 border-t border-zinc-800 space-y-2">
                    <span className="text-amber-400 font-bold uppercase text-[10px]">
                      Movimentos do Guardião
                    </span>
                    <div className="space-y-1">
                      {KEEPER_BASIC_MOVES.map((kMove) => (
                        <div key={kMove.id} className="p-2 bg-zinc-950 rounded border border-zinc-800">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-zinc-200">{kMove.name}</span>
                            <span
                              className={`text-[9px] uppercase px-1 rounded ${
                                kMove.category === 'duro' ? 'text-red-400 bg-red-950' : 'text-amber-400 bg-amber-950'
                              }`}
                            >
                              {kMove.category}
                            </span>
                          </div>
                          <p className="text-zinc-400 text-[10px] mt-0.5">{kMove.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB: FIM DE SESSÃO */}
            {activeTab === 'fim_sessao' && isKeeper && (
              <div className="space-y-3">
                <div className="p-2.5 bg-amber-950/30 rounded border border-amber-600/50 space-y-1">
                  <span className="font-bold text-amber-300 text-xs">Fim de Sessão — Concessão de XP</span>
                  <p className="text-zinc-400 text-[11px]">
                    No final de cada sessão, faça as quatro perguntas ao grupo. Para cada resposta SIM, cada caçador marca 1 ponto de experiência!
                  </p>
                </div>

                <div className="space-y-2">
                  {END_OF_SESSION_QUESTIONS.map((q) => {
                    const checked = sessionChecklist[q.id] || false;
                    return (
                      <div
                        key={q.id}
                        onClick={() =>
                          setSessionChecklist((prev) => ({
                            ...prev,
                            [q.id]: !checked,
                          }))
                        }
                        className={`p-2.5 rounded border cursor-pointer transition-colors space-y-1 ${
                          checked
                            ? 'bg-emerald-950/40 border-emerald-600/70 text-emerald-200'
                            : 'bg-zinc-950 border-zinc-800 text-zinc-400'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => {}}
                            className="mt-0.5"
                          />
                          <div>
                            <div className="font-semibold text-zinc-200 text-[11px]">{q.question}</div>
                            <div className="text-[10px] text-zinc-500">{q.description}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Award XP button */}
                <div className="pt-2">
                  {(() => {
                    const yesCount = Object.values(sessionChecklist).filter(Boolean).length;
                    return (
                      <button
                        onClick={() => {
                          awardEndOfSession(yesCount);
                          setSessionChecklist({
                            concluiram_misterio: false,
                            salvaram_alguem: false,
                            aprenderam_sobre_monstros: false,
                            aprofundaram_lacos: false,
                          });
                        }}
                        disabled={yesCount === 0}
                        className={`w-full py-2 rounded font-bold text-xs shadow transition-all ${
                          yesCount > 0
                            ? 'bg-emerald-600 hover:bg-emerald-500 text-zinc-950'
                            : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                        }`}
                      >
                        Conceder +{yesCount} XP para Todos os Caçadores
                      </button>
                    );
                  })()}
                </div>
              </div>
            )}
          </div>
        </aside>
      )}
    </div>
  );
};
