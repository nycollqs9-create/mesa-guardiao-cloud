import React, { useState } from 'react';
import { useVTT } from '../context/VTTContext';
import {
  X,
  Heart,
  Sparkles,
  Award,
  Shield,
  Dice5,
  Trash2,
  AlertTriangle,
  Plus,
  Minus,
  Check,
  Flame,
  ArrowUpCircle,
  History,
  ShieldAlert,
  Zap,
  Camera,
} from 'lucide-react';
import { RatingName } from '../types/motw';
import { MOTW_PLAYBOOKS } from '../data/motwPlaybooks';
import { calculateLevel, calculateExpProgress } from '../utils/dice';
import { LevelUpModal } from './LevelUpModal';
import { ExperienceManagerModal } from './ExperienceManagerModal';
import { ImageUploadInput } from './ImageUploadInput';

interface CharacterSheetModalProps {
  hunterId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onTriggerRoll: (rating: RatingName, moveName: string) => void;
}

export const CharacterSheetModal: React.FC<CharacterSheetModalProps> = ({
  hunterId,
  isOpen,
  onClose,
  onTriggerRoll,
}) => {
  const {
    currentCampaign,
    currentRole,
    user,
    saveHunterCharacter,
    updateHarm,
    spendLuckAdvanced,
    updateExp,
    deleteHunterCharacter,
  } = useVTT();

  const [activeTab, setActiveTab] = useState<'status' | 'movimentos' | 'equipamento' | 'historico_xp' | 'especial'>('status');
  const [isLevelUpOpen, setIsLevelUpOpen] = useState(false);
  const [isXpManagerOpen, setIsXpManagerOpen] = useState(false);
  const [showLuckBurnModal, setShowLuckBurnModal] = useState(false);
  const [isEditingPortrait, setIsEditingPortrait] = useState(false);

  if (!isOpen || !currentCampaign || !hunterId) return null;

  const character = currentCampaign.characters[hunterId];
  if (!character) return null;

  const playbookDef = MOTW_PLAYBOOKS[character.playbookId];
  const isKeeper = currentRole === 'guardiao';
  const level = calculateLevel(character.levelUpsTaken);
  const expProgress = calculateExpProgress(character.experience);
  const hasPendingLevelUp = (character.pendingLevelUps && character.pendingLevelUps > 0) || character.experience >= 5;

  const handleApplyHarm = (delta: number) => {
    updateHarm(character.id, delta, character.armour || 0, delta < 0);
  };

  const handleSpendLuckOption = async (option: 'roll_to_12' | 'cancel_harm') => {
    try {
      await spendLuckAdvanced({ charId: character.id, option });
      setShowLuckBurnModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  const isDoomed = character.luckCurrent >= character.luckMax;
  const isUnstable = character.harm >= 4;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-3 select-none">
        <div className="w-full sm:max-w-2xl h-[95dvh] sm:h-auto sm:max-h-[92vh] bg-zinc-950 border-t sm:border border-amber-600/60 rounded-t-2xl sm:rounded-xl shadow-2xl flex flex-col overflow-hidden text-xs pb-safe">
          {/* Header with Portrait & Identity */}
          <div className="p-3 sm:p-4 bg-gradient-to-r from-red-950/80 via-amber-950/40 to-zinc-950 border-b border-zinc-800 flex items-center justify-between shrink-0 gap-2">
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <div
                onClick={() => (character.userId === user.id || isKeeper) && setIsEditingPortrait(!isEditingPortrait)}
                className={`relative group rounded-lg overflow-hidden border border-amber-500/50 shadow shrink-0 ${
                  character.userId === user.id || isKeeper ? 'cursor-pointer' : ''
                }`}
                title={character.userId === user.id || isKeeper ? 'Clique para trocar a foto deste caçador' : undefined}
              >
                {character.portraitUrl ? (
                  <img
                    src={character.portraitUrl}
                    alt={character.name}
                    className="w-11 h-11 sm:w-12 sm:h-12 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400">
                    <Shield className="w-6 h-6 text-amber-500" />
                  </div>
                )}
                {(character.userId === user.id || isKeeper) && (
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-amber-300">
                    <Camera className="w-4 h-4" />
                  </div>
                )}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h2 className="text-sm sm:text-base font-bold text-zinc-100 truncate">{character.name}</h2>
                  <span className="px-1.5 py-0.5 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-400 font-mono font-bold text-[10px]">
                    NÍVEL {level}
                  </span>
                  {(character.userId === user.id || isKeeper) && (
                    <button
                      type="button"
                      onClick={() => setIsEditingPortrait(!isEditingPortrait)}
                      className="text-[10px] text-amber-400 hover:text-amber-300 underline"
                    >
                      {isEditingPortrait ? 'Fechar' : 'Foto'}
                    </button>
                  )}
                </div>
                <div className="text-[11px] sm:text-xs font-semibold text-amber-400 truncate">
                  {character.playbookName} &bull;{' '}
                  <span className="text-zinc-400 font-normal">{character.playerName}</span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-zinc-400 italic truncate">{character.look}</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {isKeeper && (
                <button
                  type="button"
                  onClick={() => setIsXpManagerOpen(true)}
                  className="px-2 py-1.5 min-h-[44px] bg-emerald-950 hover:bg-emerald-900 border border-emerald-700 text-emerald-300 rounded-lg font-semibold text-[10px] flex items-center gap-1 transition"
                  title="Conceder ou alterar XP deste caçador"
                >
                  <Award className="w-4 h-4 text-emerald-400" />
                  <span className="hidden sm:inline">Gerenciar XP</span>
                </button>
              )}
              <button
                onClick={onClose}
                className="text-zinc-400 hover:text-zinc-200 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg hover:bg-zinc-900 active:bg-zinc-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Edit Portrait Subpanel */}
          {isEditingPortrait && (
            <div className="p-3 bg-zinc-900 border-b border-zinc-800 space-y-2 shrink-0">
              <div className="flex items-center justify-between text-zinc-300">
                <span className="font-bold text-xs">Alterar Foto do Caçador</span>
                <button
                  type="button"
                  onClick={() => setIsEditingPortrait(false)}
                  className="text-zinc-500 hover:text-zinc-300 text-[11px]"
                >
                  Fechar
                </button>
              </div>
              <ImageUploadInput
                label="Selecione da Galeria do Celular ou Tire Foto na Câmera"
                value={character.portraitUrl || ''}
                onChange={(newUrl) => {
                  saveHunterCharacter({
                    ...character,
                    portraitUrl: newUrl,
                    updatedAt: Date.now(),
                  });
                }}
                aspectRatio="square"
              />
            </div>
          )}

          {/* Level Up Banner Alert if 5 XP reached or pending */}
          {hasPendingLevelUp && (
            <div className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 via-amber-600 to-emerald-600 text-zinc-950 font-bold flex items-center justify-between shadow-inner animate-pulse shrink-0">
              <div className="flex items-center gap-2 text-xs">
                <ArrowUpCircle className="w-4 h-4 text-zinc-950" />
                <span>SEU CAÇADOR SUBIU DE NÍVEL! ({character.pendingLevelUps || 1} melhoria pendente)</span>
              </div>
              <button
                type="button"
                onClick={() => setIsLevelUpOpen(true)}
                className="px-3 py-1 bg-zinc-950 hover:bg-zinc-900 text-emerald-300 font-black rounded-lg text-xs tracking-wider shadow transition"
              >
                ESCOLHER MELHORIA &rarr;
              </button>
            </div>
          )}

          {/* 5 Ratings Bar (Click to roll) */}
          <div className="grid grid-cols-5 gap-1.5 sm:gap-2 p-2 sm:p-3 bg-zinc-900/90 border-b border-zinc-800 shrink-0 font-mono">
            {(['Braveza', 'Esperteza', 'Estranheza', 'Firmeza', 'Sutileza'] as RatingName[]).map((rating) => {
              const val = character.ratings[rating];
              return (
                <button
                  key={rating}
                  onClick={() => onTriggerRoll(rating, `Teste de ${rating}`)}
                  title={`Clique para rolar 2d6 com +${rating}`}
                  className="p-1 sm:p-2 min-h-[44px] bg-zinc-950 hover:bg-zinc-850 rounded-lg border border-zinc-800 hover:border-amber-500/50 transition-all text-center group active:scale-95 flex flex-col justify-center items-center"
                >
                  <div className="text-[9px] uppercase tracking-wider text-zinc-400 group-hover:text-amber-400 truncate max-w-full">
                    {rating}
                  </div>
                  <div
                    className={`text-sm sm:text-base font-black ${
                      val > 0 ? 'text-amber-400' : val < 0 ? 'text-red-400' : 'text-zinc-300'
                    }`}
                  >
                    {val >= 0 ? `+${val}` : val}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-zinc-800 bg-zinc-900/50 text-[11px] font-bold shrink-0 overflow-x-auto no-scrollbar touch-pan-x">
            {[
              { id: 'status', label: 'Condição & Marcadores' },
              { id: 'movimentos', label: 'Movimentos' },
              { id: 'equipamento', label: 'Armas & Equipamento' },
              { id: 'historico_xp', label: 'Histórico & Evolução' },
              { id: 'especial', label: 'Especial da Cartilha' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-none sm:flex-1 min-h-[44px] py-2.5 px-3 whitespace-nowrap text-center transition-colors border-b-2 flex items-center justify-center ${
                  activeTab === tab.id
                    ? 'border-amber-500 text-amber-300 bg-zinc-850/50'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* TAB: STATUS */}
            {activeTab === 'status' && (
              <div className="space-y-4">
                {/* Visual Progression Panel */}
                <div className="p-3.5 bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-xl border border-zinc-800 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-emerald-400" />
                      <span className="font-bold text-zinc-200 uppercase tracking-wider text-[11px]">
                        Progresso de Nível: NÍVEL {level}
                      </span>
                    </div>
                    <span className="font-mono text-xs font-bold text-emerald-400">
                      XP: {expProgress.current} / 5
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-zinc-950 h-3 rounded-full overflow-hidden border border-zinc-800 p-0.5">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-600 to-amber-500 rounded-full transition-all duration-500 shadow-sm"
                      style={{ width: `${Math.min(100, (expProgress.current / 5) * 100)}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-1">
                    <span>
                      PRÓXIMA EVOLUÇÃO:{' '}
                      <strong className="text-emerald-300">
                        {expProgress.remainingToLevelUp} XP restantes
                      </strong>
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => updateExp(character.id, 1)}
                        className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[10px] font-mono font-bold"
                      >
                        +1 XP
                      </button>
                      <button
                        onClick={() => updateExp(character.id, -1)}
                        className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-400 text-[10px] font-mono"
                      >
                        -1 XP
                      </button>
                      {hasPendingLevelUp && (
                        <button
                          onClick={() => setIsLevelUpOpen(true)}
                          className="px-2.5 py-0.5 bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-bold rounded text-[10px]"
                        >
                          Evoluir!
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Harm Track (Marcador de Dano: 0-7) */}
                <div className="p-3.5 bg-zinc-900 rounded-xl border border-zinc-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-zinc-200 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                      <Heart className="w-4 h-4 text-red-500" /> Marcador de Dano
                    </span>
                    <div className="flex items-center gap-2">
                      {isUnstable && (
                        <span className="px-2 py-0.5 rounded bg-red-950 border border-red-700 text-red-300 font-bold text-[10px] animate-pulse">
                          FERIMENTO GRAVE (Instável)
                        </span>
                      )}
                      <span className="font-mono text-xs font-bold text-zinc-300">
                        {character.harm} / 7
                      </span>
                    </div>
                  </div>

                  {/* 7 Harm Boxes */}
                  <div className="grid grid-cols-7 gap-1.5 pt-1">
                    {[1, 2, 3, 4, 5, 6, 7].map((box) => {
                      const isFilled = character.harm >= box;
                      const isSevere = box >= 4;
                      return (
                        <div
                          key={box}
                          className={`h-9 rounded-lg flex flex-col items-center justify-center border font-mono font-bold text-xs transition-all ${
                            isFilled
                              ? isSevere
                                ? 'bg-red-700 border-red-500 text-white shadow-md'
                                : 'bg-amber-600 border-amber-400 text-zinc-950 shadow-md'
                              : isSevere
                              ? 'bg-red-950/30 border-red-900/60 text-red-700'
                              : 'bg-zinc-950 border-zinc-800 text-zinc-600'
                          }`}
                        >
                          <span>{box}</span>
                          {box === 4 && <span className="text-[7px] uppercase font-sans">Grave</span>}
                        </div>
                      );
                    })}
                  </div>

                  {/* Harm Modification Controls */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApplyHarm(1)}
                        className="px-3 py-2 min-h-[44px] bg-red-950 hover:bg-red-900 border border-red-700 text-red-200 rounded-lg font-semibold text-xs flex items-center gap-1.5 active:scale-95 transition"
                      >
                        <Plus className="w-4 h-4" /> +1 Dano
                      </button>
                      <button
                        onClick={() => handleApplyHarm(-1)}
                        className="px-3 py-2 min-h-[44px] bg-zinc-800 hover:bg-zinc-750 border border-zinc-700 text-zinc-200 rounded-lg font-semibold text-xs flex items-center gap-1.5 active:scale-95 transition"
                      >
                        <Minus className="w-4 h-4" /> Curar 1
                      </button>
                    </div>
                    <span className="text-[10px] text-zinc-400 font-mono">
                      Armadura: {character.armour || 0}
                    </span>
                  </div>
                </div>

                {/* Luck Track (Marcador de Sorte: 7 boxes) */}
                <div className="p-3.5 bg-zinc-900 rounded-xl border border-zinc-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-zinc-200 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-500" /> Marcador de Sorte
                    </span>
                    {isDoomed ? (
                      <span className="px-2 py-0.5 rounded bg-red-950 border border-red-700 text-red-400 font-bold text-[10px]">
                        CONDENADO (Sem Sorte)
                      </span>
                    ) : (
                      <span className="text-zinc-400 text-xs font-mono">
                        {character.luckMax - character.luckCurrent} restante(s)
                      </span>
                    )}
                  </div>

                  {/* Luck Boxes */}
                  <div className="grid grid-cols-7 gap-1.5 pt-1">
                    {[1, 2, 3, 4, 5, 6, 7].map((box) => {
                      const isSpent = character.luckCurrent >= box;
                      return (
                        <div
                          key={box}
                          className={`h-9 rounded-lg flex items-center justify-center border font-mono font-bold text-xs ${
                            isSpent
                              ? 'bg-amber-600 border-amber-400 text-zinc-950'
                              : 'bg-zinc-950 border-zinc-800 text-zinc-500'
                          }`}
                        >
                          {isSpent ? '✕' : box}
                        </div>
                      );
                    })}
                  </div>

                  {!isDoomed && (
                    <button
                      type="button"
                      onClick={() => setShowLuckBurnModal(true)}
                      className="w-full mt-2 py-2.5 min-h-[44px] bg-gradient-to-r from-amber-950 via-zinc-900 to-amber-950 hover:bg-amber-900 border border-amber-600/50 text-amber-300 rounded-lg font-bold text-xs transition-colors shadow flex items-center justify-center gap-1.5 active:scale-95"
                    >
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>Queimar Ponto de Sorte (Escolher Efeito)</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* TAB: MOVIMENTOS */}
            {activeTab === 'movimentos' && (
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                  Movimentos Escolhidos da Cartilha
                </span>
                <div className="space-y-2">
                  {playbookDef?.availableMoves
                    .filter((m) => character.selectedMoves?.includes(m.id))
                    .map((m) => (
                      <div
                        key={m.id}
                        className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-zinc-200 text-xs">{m.name}</h4>
                          {m.rating && (
                            <button
                              onClick={() => onTriggerRoll(m.rating!, m.name)}
                              className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-amber-400 font-mono font-bold text-[10px] flex items-center gap-1 border border-zinc-700"
                            >
                              <Dice5 className="w-3 h-3" />
                              <span>+{m.rating}</span>
                            </button>
                          )}
                        </div>
                        <p className="text-[11px] text-zinc-400 leading-relaxed">{m.description}</p>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* TAB: EQUIPAMENTO */}
            {activeTab === 'equipamento' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                    Armas do Caçador
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {character.weapons?.map((w) => (
                      <div
                        key={w.id}
                        className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-zinc-200 text-xs">{w.name}</span>
                          <span className="font-mono text-amber-400 font-bold">{w.harm}-dano</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {w.tags.map((tag, i) => (
                            <span
                              key={i}
                              className="px-1.5 py-0.2 bg-zinc-800 text-zinc-400 rounded text-[9px] font-mono"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                    Outros Equipamentos & Itens
                  </span>
                  <p className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800 text-[11px] text-zinc-300 whitespace-pre-wrap">
                    {character.gearNotes || 'Nenhum equipamento especial listado.'}
                  </p>
                </div>
              </div>
            )}

            {/* TAB: HISTÓRICO & EVOLUÇÃO */}
            {activeTab === 'historico_xp' && (
              <div className="space-y-4">
                {/* Improvements Chosen List */}
                <div className="p-3 bg-zinc-900 rounded-lg border border-zinc-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-zinc-300">
                      Melhorias de Nível Adquiridas:
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400">
                      Total: {character.improvementsChosen?.length || 0}
                    </span>
                  </div>
                  {character.improvementsChosen && character.improvementsChosen.length > 0 ? (
                    <ul className="list-disc list-inside text-zinc-300 text-[11px] space-y-1">
                      {character.improvementsChosen.map((imp, i) => (
                        <li key={i}>{imp}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-[11px] text-zinc-500 italic">
                      Nenhuma melhoria escolhida ainda. Alcance 5 XP para evoluir seu caçador.
                    </p>
                  )}
                </div>

                {/* XP History Grants */}
                <div className="p-3 bg-zinc-900 rounded-lg border border-zinc-800 space-y-2">
                  <span className="text-[10px] uppercase font-bold text-zinc-300 flex items-center gap-1.5">
                    <History className="w-3.5 h-3.5 text-zinc-400" /> Histórico de Concessão de XP
                  </span>
                  {character.xpHistory && character.xpHistory.length > 0 ? (
                    <div className="space-y-1.5">
                      {character.xpHistory.map((log) => (
                        <div
                          key={log.id}
                          className="p-2 rounded bg-zinc-950 border border-zinc-850 flex items-center justify-between text-[11px]"
                        >
                          <div>
                            <span className="text-emerald-400 font-bold font-mono">
                              {log.amount >= 0 ? `+${log.amount}` : log.amount} XP
                            </span>{' '}
                            &bull; <span className="text-zinc-300">{log.reason}</span>
                          </div>
                          <span className="text-[10px] text-zinc-500">
                            Por: {log.grantedBy}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[11px] text-zinc-500 italic">Nenhum registro no histórico de XP.</p>
                  )}
                </div>
              </div>
            )}

            {/* TAB: ESPECIAL DA CARTILHA */}
            {activeTab === 'especial' && (
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                  {playbookDef?.specialFeature.title || 'Recurso Especial'}
                </span>
                <div className="p-3 bg-zinc-900 rounded-lg border border-zinc-800 text-[11px] text-zinc-300 whitespace-pre-wrap leading-relaxed">
                  {JSON.stringify(character.specialFeatures, null, 2)}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Level Up Picker Modal */}
      {isLevelUpOpen && (
        <LevelUpModal
          hunter={character}
          isOpen={isLevelUpOpen}
          onClose={() => setIsLevelUpOpen(false)}
        />
      )}

      {/* Keeper Experience Manager Modal */}
      {isXpManagerOpen && (
        <ExperienceManagerModal
          isOpen={isXpManagerOpen}
          onClose={() => setIsXpManagerOpen(false)}
          preselectedHunterId={character.id}
        />
      )}

      {/* Luck Burn Choice Modal (Requirement 6) */}
      {showLuckBurnModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-amber-600 rounded-xl max-w-md w-full p-5 space-y-4 shadow-2xl text-xs">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>Queimar Ponto de Sorte</span>
            </div>

            <p className="text-zinc-300 leading-relaxed">
              Você está gastando 1 ponto do Marcador de Sorte ({character.luckCurrent + 1}/{character.luckMax} gastos). Escolha qual benefício imediato deseja invocar:
            </p>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleSpendLuckOption('roll_to_12')}
                className="w-full p-3 rounded-lg bg-zinc-900 hover:bg-zinc-850 border border-zinc-750 hover:border-amber-500 text-left transition flex items-start gap-2.5"
              >
                <Zap className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                <div>
                  <div className="font-bold text-zinc-100 text-xs">
                    Transformar a rolagem recente em um 12 (Sucesso Total)
                  </div>
                  <div className="text-[11px] text-zinc-400">
                    Garante um resultado extraordinário mesmo se os dados tiraram falha.
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleSpendLuckOption('cancel_harm')}
                className="w-full p-3 rounded-lg bg-zinc-900 hover:bg-zinc-850 border border-zinc-750 hover:border-amber-500 text-left transition flex items-start gap-2.5"
              >
                <ShieldAlert className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <div className="font-bold text-zinc-100 text-xs">
                    Anular todo o dano recebido de um ataque recente (Dano = 0)
                  </div>
                  <div className="text-[11px] text-zinc-400">
                    Você escapa por um triz ou o perigo é completamente desviado sem ferimento.
                  </div>
                </div>
              </button>
            </div>

            <div className="flex justify-end pt-2 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setShowLuckBurnModal(false)}
                className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg font-semibold"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
