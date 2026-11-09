import React, { useState } from 'react';
import { useVTT } from '../context/VTTContext';
import {
  Shield,
  X,
  Compass,
  BookOpen,
  Eye,
  EyeOff,
  Skull,
  MapPin,
  Clock,
  Plus,
  Play,
  RotateCcw,
  Copy,
  Check,
  Award,
  Layers,
  FileText,
  AlertTriangle,
  ChevronRight,
  FolderPlus,
  CheckCircle2,
  Trash2,
} from 'lucide-react';
import {
  Arc,
  Mystery,
  Scene,
  Threat,
  InvestigationClue,
  GameSession,
  CountdownStageKey,
} from '../types/motw';
import { ImageUploadInput } from './ImageUploadInput';
import { ExperienceManagerModal } from './ExperienceManagerModal';

interface KeeperCentralModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeeperCentralModal: React.FC<KeeperCentralModalProps> = ({ isOpen, onClose }) => {
  const {
    currentCampaign,
    currentRole,
    advanceCountdown,
    revertCountdown,
    updateMystery,
    updateScenes,
    updateArcs,
    updateClues,
    updateMysteryLibrary,
    startMystery,
    updateThreatBank,
    updateSessions,
  } = useVTT();

  const [activeTab, setActiveTab] = useState<
    'arcos' | 'misterios' | 'cenas' | 'ameacas' | 'pistas' | 'relogio' | 'sessoes'
  >('misterios');

  const [isXpModalOpen, setIsXpModalOpen] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);

  // Forms states
  const [newArcTitle, setNewArcTitle] = useState('');
  const [newArcConcept, setNewArcConcept] = useState('');

  const [newMysteryTitle, setNewMysteryTitle] = useState('');
  const [newMysteryHook, setNewMysteryHook] = useState('');
  const [newMysteryConcept, setNewMysteryConcept] = useState('');

  const [newSceneName, setNewSceneName] = useState('');
  const [newSceneDesc, setNewSceneDesc] = useState('');
  const [newSceneImage, setNewSceneImage] = useState('');
  const [newSceneSecret, setNewSceneSecret] = useState(false);

  const [newClueTitle, setNewClueTitle] = useState('');
  const [newClueDesc, setNewClueDesc] = useState('');
  const [newClueImage, setNewClueImage] = useState('');

  const [newThreatName, setNewThreatName] = useState('');
  const [newThreatType, setNewThreatType] = useState<Threat['type']>('monstro');
  const [newThreatMotivation, setNewThreatMotivation] = useState('');
  const [newThreatPowers, setNewThreatPowers] = useState('');
  const [newThreatWeakness, setNewThreatWeakness] = useState('');
  const [newThreatImage, setNewThreatImage] = useState('');

  if (!isOpen || !currentCampaign) return null;

  const isKeeper = currentRole === 'guardiao';
  const activeMystery = currentCampaign.activeMystery;
  const mysteryLib = currentCampaign.mysteryLibrary || [];
  const arcs = currentCampaign.arcs || [];
  const clues = currentCampaign.clues || [];
  const threatBank = currentCampaign.threatBank || [];
  const sessions = currentCampaign.sessions || [];

  // Handlers
  const handleCreateArc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newArcTitle.trim()) return;
    const newArc: Arc = {
      id: `arc-${Date.now()}`,
      title: newArcTitle.trim(),
      concept: newArcConcept.trim(),
      status: 'ativo',
      linkedMysteryIds: [],
      notes: '',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    await updateArcs([...arcs, newArc]);
    setNewArcTitle('');
    setNewArcConcept('');
  };

  const handleCreateMysteryInLibrary = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMysteryTitle.trim()) return;
    const newM: Mystery = {
      id: `myst-${Date.now()}`,
      title: newMysteryTitle.trim(),
      hook: newMysteryHook.trim(),
      concept: newMysteryConcept.trim(),
      status: 'preparado',
      isSolved: false,
      notes: '',
      threats: [],
      countdown: [
        { stage: 'dia', label: 'Dia', description: 'Os primeiros boatos surgem.', isTriggered: true },
        { stage: 'sombras', label: 'Sombras', description: 'A primeira vítima é atacada.', isTriggered: false },
        { stage: 'entardecer', label: 'Entardecer', description: 'A criatura se alimenta ou consolida seu ninho.', isTriggered: false },
        { stage: 'poente', label: 'Poente', description: 'O perigo se espalha para testemunhas inocentes.', isTriggered: false },
        { stage: 'anoitecer', label: 'Anoitecer', description: 'O horror assume controle da região.', isTriggered: false },
        { stage: 'meia_noite', label: 'Meia-Noite', description: 'O plano final do mal é consumado.', isTriggered: false },
      ],
      currentStage: 'dia',
    };
    await updateMysteryLibrary([...mysteryLib, newM]);
    setNewMysteryTitle('');
    setNewMysteryHook('');
    setNewMysteryConcept('');
  };

  const handleCreateScene = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSceneName.trim()) return;
    const newSc: Scene = {
      id: `scene-${Date.now()}`,
      name: newSceneName.trim(),
      description: newSceneDesc.trim(),
      imageUrl: newSceneImage.trim() || undefined,
      clues: [],
      isActive: false,
      isSecret: newSceneSecret,
      status: 'preparada',
    };
    await updateScenes([...currentCampaign.scenes, newSc]);
    setNewSceneName('');
    setNewSceneDesc('');
    setNewSceneImage('');
    setNewSceneSecret(false);
  };

  const handleCreateClue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClueTitle.trim()) return;
    const newClue: InvestigationClue = {
      id: `clue-${Date.now()}`,
      title: newClueTitle.trim(),
      description: newClueDesc.trim(),
      imageUrl: newClueImage.trim() || undefined,
      status: 'oculta',
      revealedTo: 'todos',
      createdAt: Date.now(),
    };
    await updateClues([...clues, newClue]);
    setNewClueTitle('');
    setNewClueDesc('');
    setNewClueImage('');
  };

  const handleToggleClueReveal = async (clueId: string) => {
    const updated = clues.map((c) => {
      if (c.id === clueId) {
        const nextStatus = c.status === 'revelada' ? 'oculta' : 'revelada';
        return { ...c, status: nextStatus };
      }
      return c;
    });
    await updateClues(updated);
  };

  const handleCreateThreat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newThreatName.trim()) return;
    const newT: Threat = {
      id: `threat-${Date.now()}`,
      name: newThreatName.trim(),
      type: newThreatType,
      motivation: newThreatMotivation.trim(),
      appearance: '',
      description: '',
      imageUrl: newThreatImage.trim() || undefined,
      powers: newThreatPowers.trim(),
      weaknesses: newThreatWeakness.trim(),
      isRevealedToHunters: false,
    };
    await updateThreatBank([...threatBank, newT]);
    setNewThreatName('');
    setNewThreatMotivation('');
    setNewThreatPowers('');
    setNewThreatWeakness('');
    setNewThreatImage('');
  };

  const handleCopySummary = () => {
    const activeScene = currentCampaign.scenes.find((s) => s.isActive);
    const text = `=== RELATÓRIO DA SESSÃO: ${currentCampaign.name} ===
Data: ${new Date().toLocaleDateString('pt-BR')}
Mistério Ativo: ${activeMystery?.title || 'Nenhum'}
Estágio da Contagem: ${activeMystery?.currentStage.toUpperCase() || 'DIA'}
Cena Atual: ${activeScene?.name || 'Indefinida'}
Caçadores Presentes: ${Object.values(currentCampaign.characters).map((c) => `${c.name} (${c.playbookName})`).join(', ')}
`;
    navigator.clipboard.writeText(text);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-3 select-none">
        <div className="w-full sm:max-w-4xl h-[95dvh] sm:h-auto sm:max-h-[92vh] bg-zinc-950 border-t sm:border border-amber-600/70 rounded-t-2xl sm:rounded-xl shadow-2xl flex flex-col overflow-hidden text-xs pb-safe">
          {/* Header */}
          <div className="p-3 sm:p-4 bg-gradient-to-r from-red-950 via-zinc-950 to-zinc-950 border-b border-zinc-800 flex items-center justify-between shrink-0 gap-2">
            <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
              <div className="p-2 rounded-lg bg-amber-600/20 border border-amber-500/50 text-amber-400 shrink-0">
                <Shield className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h3 className="font-bold text-zinc-100 text-sm truncate">Central do Guardião</h3>
                  <span className="hidden sm:inline px-2 py-0.5 rounded bg-amber-950 border border-amber-600/40 text-amber-400 font-mono font-bold text-[10px] uppercase">
                    Modo Preparação & Mesa
                  </span>
                </div>
                <p className="text-zinc-400 text-[11px] truncate hidden sm:block">
                  Gestão estratégica de arcos narrativos, biblioteca de mistérios, cenas e relógio.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setIsXpModalOpen(true)}
                className="px-2 sm:px-2.5 py-1.5 min-h-[44px] bg-emerald-950 hover:bg-emerald-900 border border-emerald-600/60 text-emerald-300 rounded-lg font-bold text-xs flex items-center gap-1 transition"
                title="Gerenciar e conceder pontos de experiência aos caçadores"
              >
                <Award className="w-4 h-4 text-emerald-400" />
                <span className="hidden sm:inline">Gerenciar </span>
                <span>XP</span>
              </button>
              <button
                onClick={onClose}
                className="text-zinc-400 hover:text-zinc-200 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg hover:bg-zinc-900 active:bg-zinc-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation Bar */}
          <div className="flex border-b border-zinc-800 bg-zinc-900/60 text-[11px] font-bold shrink-0 overflow-x-auto no-scrollbar touch-pan-x">
            {[
              { id: 'misterios', label: 'Mistérios', icon: BookOpen },
              { id: 'arcos', label: 'Arcos', icon: Layers },
              { id: 'cenas', label: 'Cenas & Fila', icon: MapPin },
              { id: 'pistas', label: 'Pistas & Provas', icon: Eye },
              { id: 'ameacas', label: 'Ameaças', icon: Skull },
              { id: 'relogio', label: 'Relógio 6 Estágios', icon: Clock },
              { id: 'sessoes', label: 'Sessões & Diário', icon: FileText },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-3 px-3.5 whitespace-nowrap min-h-[44px] text-center transition-colors flex items-center justify-center gap-1.5 border-b-2 ${
                    activeTab === tab.id
                      ? 'border-amber-500 text-amber-300 bg-zinc-900'
                      : 'border-transparent text-zinc-400 hover:text-zinc-200 active:bg-zinc-850'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4 pb-12 sm:pb-4">
            {/* TAB: BIBLIOTECA DE MISTÉRIOS */}
            {activeTab === 'misterios' && (
              <div className="space-y-4">
                {/* Active Mystery Card */}
                {activeMystery && (
                  <div className="p-4 bg-gradient-to-br from-amber-950/40 via-zinc-900 to-zinc-950 rounded-xl border border-amber-600/50 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase font-bold text-amber-400 tracking-wider">
                        Mistério Ativo na Mesa
                      </span>
                      <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-600/40 text-emerald-400 font-bold text-[10px] uppercase">
                        Em Andamento
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-zinc-100">{activeMystery.title}</h4>
                    <p className="text-zinc-300 text-xs leading-relaxed">{activeMystery.hook}</p>
                    <div className="text-[11px] text-zinc-400">
                      <strong>Conceito:</strong> {activeMystery.concept}
                    </div>
                  </div>
                )}

                {/* Create New Mystery in Library */}
                <form
                  onSubmit={handleCreateMysteryInLibrary}
                  className="p-3.5 bg-zinc-900 rounded-xl border border-zinc-800 space-y-2.5"
                >
                  <div className="font-bold text-zinc-200 text-xs flex items-center gap-1.5">
                    <FolderPlus className="w-4 h-4 text-amber-400" />
                    <span>Preparar Novo Mistério na Biblioteca</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Título do Mistério (ex: O Ritual do Lago Vermelho)"
                      value={newMysteryTitle}
                      onChange={(e) => setNewMysteryTitle(e.target.value)}
                      required
                      className="bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-zinc-100"
                    />
                    <input
                      type="text"
                      placeholder="Gancho da Investigação (o que atrai os caçadores)"
                      value={newMysteryHook}
                      onChange={(e) => setNewMysteryHook(e.target.value)}
                      className="bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-zinc-100"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Conceito / Segredo oculto (ex: Um lacaio cultista está abrindo um portal no moinho)"
                    value={newMysteryConcept}
                    onChange={(e) => setNewMysteryConcept(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-zinc-100"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-zinc-950 font-bold rounded-lg text-xs"
                  >
                    Salvar na Biblioteca
                  </button>
                </form>

                {/* Mystery Library List */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                    Mistérios Preparados ({mysteryLib.length})
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {mysteryLib.map((m) => (
                      <div
                        key={m.id}
                        className="p-3 bg-zinc-900 rounded-xl border border-zinc-800 flex flex-col justify-between space-y-2"
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <h5 className="font-bold text-zinc-100 text-xs">{m.title}</h5>
                            <span className="text-[10px] text-zinc-400 font-mono capitalize">
                              {m.status || 'Preparado'}
                            </span>
                          </div>
                          <p className="text-[11px] text-zinc-400 line-clamp-2 mt-1">{m.hook}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => startMystery(m.id)}
                          className="w-full py-1.5 bg-gradient-to-r from-red-700 to-amber-600 hover:from-red-600 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5"
                        >
                          <Play className="w-3.5 h-3.5" />
                          <span>INICIAR MISTÉRIO NA MESA</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: PLANEJADOR DE ARCOS */}
            {activeTab === 'arcos' && (
              <div className="space-y-4">
                <form
                  onSubmit={handleCreateArc}
                  className="p-3.5 bg-zinc-900 rounded-xl border border-zinc-800 space-y-2.5"
                >
                  <div className="font-bold text-zinc-200 text-xs flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-amber-400" />
                    <span>Criar Novo Arco Narrativo de Longo Prazo</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Nome do Arco (ex: A Conspiração da Ordem da Rosa Negra)"
                      value={newArcTitle}
                      onChange={(e) => setNewArcTitle(e.target.value)}
                      required
                      className="bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-zinc-100"
                    />
                    <input
                      type="text"
                      placeholder="Conceito / Premissa maior"
                      value={newArcConcept}
                      onChange={(e) => setNewArcConcept(e.target.value)}
                      className="bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-zinc-100"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-zinc-950 font-bold rounded-lg text-xs"
                  >
                    Adicionar Arco
                  </button>
                </form>

                {/* Arcs list */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                    Arcos da Campanha ({arcs.length})
                  </span>
                  {arcs.length === 0 ? (
                    <p className="text-[11px] text-zinc-500 italic">Nenhum arco de longo prazo cadastrado.</p>
                  ) : (
                    <div className="space-y-2">
                      {arcs.map((arc) => (
                        <div
                          key={arc.id}
                          className="p-3 bg-zinc-900 rounded-xl border border-zinc-800 space-y-1.5"
                        >
                          <div className="flex items-center justify-between">
                            <h5 className="font-bold text-zinc-100 text-xs">{arc.title}</h5>
                            <span className="px-2 py-0.5 rounded bg-amber-950/80 text-amber-400 border border-amber-600/30 text-[10px] uppercase font-bold">
                              {arc.status}
                            </span>
                          </div>
                          <p className="text-[11px] text-zinc-300">{arc.concept}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB: CENAS & FILA */}
            {activeTab === 'cenas' && (
              <div className="space-y-4">
                {/* Scene Creator Form */}
                <form
                  onSubmit={handleCreateScene}
                  className="p-3.5 bg-zinc-900 rounded-xl border border-zinc-800 space-y-3"
                >
                  <div className="font-bold text-zinc-200 text-xs flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-amber-400" />
                    <span>Preparar Nova Cena</span>
                  </div>
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Nome do Local / Cena (ex: Sótão do Casarão Assombrado)"
                      value={newSceneName}
                      onChange={(e) => setNewSceneName(e.target.value)}
                      required
                      className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-zinc-100"
                    />
                    <textarea
                      rows={2}
                      placeholder="Descrição sensorial da cena (sons, cheiros, iluminação)..."
                      value={newSceneDesc}
                      onChange={(e) => setNewSceneDesc(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-zinc-100"
                    />
                    <ImageUploadInput
                      label="Foto do Local / Mapa (Upload ou Câmera)"
                      value={newSceneImage}
                      onChange={setNewSceneImage}
                      placeholder="URL ou envie imagem..."
                    />
                    <label className="flex items-center gap-2 text-zinc-300 text-xs cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newSceneSecret}
                        onChange={(e) => setNewSceneSecret(e.target.checked)}
                        className="rounded bg-zinc-900 border-zinc-700 text-amber-500"
                      />
                      <span>Cena Secreta (Visível apenas para o Guardião até ser ativada)</span>
                    </label>
                  </div>
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-zinc-950 font-bold rounded-lg text-xs"
                  >
                    Salvar Cena
                  </button>
                </form>

                {/* Scenes List */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                    Cenas da Campanha ({currentCampaign.scenes.length})
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {currentCampaign.scenes.map((sc) => (
                      <div
                        key={sc.id}
                        className={`p-3 rounded-xl border flex flex-col justify-between space-y-2 ${
                          sc.isActive
                            ? 'bg-amber-950/40 border-amber-500 shadow'
                            : 'bg-zinc-900 border-zinc-800'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <h5 className="font-bold text-zinc-100 text-xs flex items-center gap-1.5">
                              {sc.name}
                              {sc.isSecret && (
                                <span title="Cena Secreta">
                                  <EyeOff className="w-3.5 h-3.5 text-zinc-500" />
                                </span>
                              )}
                            </h5>
                            {sc.isActive && (
                              <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-600/40 text-emerald-400 font-bold text-[9px] uppercase">
                                Ativa na Mesa
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-zinc-400 line-clamp-2 mt-1">{sc.description}</p>
                        </div>

                        {!sc.isActive && (
                          <button
                            type="button"
                            onClick={async () => {
                              const updated = currentCampaign.scenes.map((s) => ({
                                ...s,
                                isActive: s.id === sc.id,
                              }));
                              await updateScenes(updated);
                            }}
                            className="w-full py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold rounded-lg text-[11px] transition"
                          >
                            Ativar na Mesa
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: CONTROLE DE PISTAS */}
            {activeTab === 'pistas' && (
              <div className="space-y-4">
                <form
                  onSubmit={handleCreateClue}
                  className="p-3.5 bg-zinc-900 rounded-xl border border-zinc-800 space-y-2.5"
                >
                  <div className="font-bold text-zinc-200 text-xs flex items-center gap-1.5">
                    <Eye className="w-4 h-4 text-amber-400" />
                    <span>Cadastrar Nova Pista da Investigação</span>
                  </div>
                  <input
                    type="text"
                    placeholder="Título da Pista (ex: O Livro de Contas Rasgado)"
                    value={newClueTitle}
                    onChange={(e) => setNewClueTitle(e.target.value)}
                    required
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-zinc-100"
                  />
                  <textarea
                    rows={2}
                    placeholder="Descrição da pista e o que ela revela aos caçadores..."
                    value={newClueDesc}
                    onChange={(e) => setNewClueDesc(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-zinc-100"
                  />
                  <ImageUploadInput
                    label="Foto / Evidência Visual da Pista (Galeria, Câmera ou Link)"
                    value={newClueImage}
                    onChange={setNewClueImage}
                    placeholder="URL ou envie foto da evidência..."
                    aspectRatio="landscape"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-zinc-950 font-bold rounded-lg text-xs"
                  >
                    Salvar Pista
                  </button>
                </form>

                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                    Pistas Cadastradas ({clues.length})
                  </span>
                  {clues.length === 0 ? (
                    <p className="text-[11px] text-zinc-500 italic">Nenhuma pista adicionada.</p>
                  ) : (
                    <div className="space-y-2">
                      {clues.map((c) => {
                        const isRevealed = c.status === 'revelada' || c.status === 'descoberta';
                        return (
                          <div
                            key={c.id}
                            className="p-3 bg-zinc-900 rounded-xl border border-zinc-800 flex items-start justify-between gap-3"
                          >
                            <div className="flex items-start gap-3 min-w-0 flex-1">
                              {c.imageUrl && (
                                <img
                                  src={c.imageUrl}
                                  alt={c.title}
                                  className="w-16 h-16 rounded-lg object-cover border border-zinc-700 shrink-0"
                                />
                              )}
                              <div className="space-y-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                  <h5 className="font-bold text-zinc-100 text-xs">{c.title}</h5>
                                  <span
                                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                      isRevealed
                                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-600/40'
                                        : 'bg-zinc-800 text-zinc-400'
                                    }`}
                                  >
                                    {isRevealed ? 'Revelada aos Caçadores' : 'Oculta (Apenas Guardião)'}
                                  </span>
                                </div>
                                <p className="text-[11px] text-zinc-400">{c.description}</p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleToggleClueReveal(c.id)}
                              className={`px-3 py-1.5 rounded-lg font-bold text-xs shrink-0 transition ${
                                isRevealed
                                  ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
                                  : 'bg-emerald-700 hover:bg-emerald-600 text-white shadow'
                              }`}
                            >
                              {isRevealed ? 'Ocultar Pista' : 'Revelar na Mesa'}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB: BANCO DE AMEAÇAS */}
            {activeTab === 'ameacas' && (
              <div className="space-y-4">
                <form
                  onSubmit={handleCreateThreat}
                  className="p-3.5 bg-zinc-900 rounded-xl border border-zinc-800 space-y-2.5"
                >
                  <div className="font-bold text-zinc-200 text-xs flex items-center gap-1.5">
                    <Skull className="w-4 h-4 text-red-500" />
                    <span>Cadastrar Ameaça (Monstro, Lacaio, Espectador ou Local)</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Nome da Ameaça (ex: O Cultista Mascarado)"
                      value={newThreatName}
                      onChange={(e) => setNewThreatName(e.target.value)}
                      required
                      className="bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-zinc-100"
                    />
                    <select
                      value={newThreatType}
                      onChange={(e) => setNewThreatType(e.target.value as any)}
                      className="bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-zinc-100"
                    >
                      <option value="monstro">Monstro (Perigo Principal)</option>
                      <option value="lacaio">Lacaio (Seguidor)</option>
                      <option value="espectador">Espectador (Inocente em Perigo)</option>
                      <option value="local">Local Perigoso</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      placeholder="Motivação (ex: Matar caçadores)"
                      value={newThreatMotivation}
                      onChange={(e) => setNewThreatMotivation(e.target.value)}
                      className="bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-zinc-100"
                    />
                    <input
                      type="text"
                      placeholder="Poderes / Ataques"
                      value={newThreatPowers}
                      onChange={(e) => setNewThreatPowers(e.target.value)}
                      className="bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-zinc-100"
                    />
                    <input
                      type="text"
                      placeholder="Fraqueza Oculta"
                      value={newThreatWeakness}
                      onChange={(e) => setNewThreatWeakness(e.target.value)}
                      className="bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-zinc-100"
                    />
                  </div>
                  <ImageUploadInput
                    label="Ilustração / Token da Ameaça (Galeria, Câmera ou Link)"
                    value={newThreatImage}
                    onChange={setNewThreatImage}
                    placeholder="URL ou envie imagem da criatura..."
                    aspectRatio="square"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 bg-red-700 hover:bg-red-600 text-white font-bold rounded-lg text-xs"
                  >
                    Salvar no Banco de Ameaças
                  </button>
                </form>

                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                    Ameaças no Banco ({threatBank.length})
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {threatBank.map((t) => (
                      <div
                        key={t.id}
                        className="p-3 bg-zinc-900 rounded-xl border border-zinc-800 flex items-start gap-3"
                      >
                        {t.imageUrl && (
                          <img
                            src={t.imageUrl}
                            alt={t.name}
                            className="w-14 h-14 rounded-lg object-cover border border-zinc-700 shrink-0"
                          />
                        )}
                        <div className="space-y-1 min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <h5 className="font-bold text-zinc-100 text-xs truncate">{t.name}</h5>
                            <span className="px-2 py-0.5 rounded bg-red-950 border border-red-700 text-red-300 text-[9px] uppercase font-bold shrink-0">
                              {t.type}
                            </span>
                          </div>
                          <p className="text-[11px] text-zinc-400">
                            <strong>Motivação:</strong> {t.motivation || 'N/A'}
                          </p>
                          {t.weaknesses && (
                            <p className="text-[11px] text-amber-300">
                              <strong>Fraqueza:</strong> {t.weaknesses}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: RELÓGIO DE 6 ESTÁGIOS */}
            {activeTab === 'relogio' && activeMystery && (
              <div className="space-y-4">
                <div className="p-4 bg-zinc-900 rounded-xl border border-zinc-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-zinc-100 text-xs">Contagem Regressiva do Mal</h4>
                      <p className="text-[11px] text-zinc-400">
                        O relógio avança conforme os caçadores falham ou perdem tempo.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => revertCountdown()}
                        className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-xs font-semibold flex items-center gap-1"
                        title="Retroceder 1 estágio"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Retroceder</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => advanceCountdown()}
                        className="px-3 py-1 bg-red-700 hover:bg-red-600 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow"
                      >
                        <span>Avançar Estágio &rarr;</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 pt-2">
                    {activeMystery.countdown.map((stage) => {
                      const isCurrent = activeMystery.currentStage === stage.stage;
                      return (
                        <div
                          key={stage.stage}
                          className={`p-2.5 rounded-xl border text-center transition ${
                            isCurrent
                              ? 'bg-red-950 border-red-500 text-red-200 shadow-md font-bold'
                              : stage.isTriggered
                              ? 'bg-zinc-900 border-zinc-700 text-zinc-400'
                              : 'bg-zinc-950 border-zinc-850 text-zinc-600'
                          }`}
                        >
                          <div className="text-[10px] font-mono uppercase tracking-wider">
                            {stage.label}
                          </div>
                          <div className="text-[10px] text-zinc-400 line-clamp-2 mt-1">
                            {stage.description}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: SESSÕES & DIÁRIO */}
            {activeTab === 'sessoes' && (
              <div className="space-y-4">
                <div className="p-4 bg-zinc-900 rounded-xl border border-zinc-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-zinc-100 text-xs">Resumo da Sessão Atual</h4>
                      <p className="text-[11px] text-zinc-400">
                        Copie as anotações e status geral para colar em diários ou compartilhar com o grupo.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopySummary}
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-zinc-950 font-bold rounded-lg text-xs flex items-center gap-1.5 shadow"
                    >
                      {copiedSummary ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedSummary ? 'Copiado!' : 'Copiar Resumo'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {isXpModalOpen && (
        <ExperienceManagerModal
          isOpen={isXpModalOpen}
          onClose={() => setIsXpModalOpen(false)}
        />
      )}
    </>
  );
};
