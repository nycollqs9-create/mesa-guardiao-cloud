import React, { useState } from 'react';
import { useVTT } from '../context/VTTContext';
import {
  Shield,
  Heart,
  Sparkles,
  Award,
  Dice5,
  BookOpen,
  FileText,
  Users,
  Eye,
  X,
  Plus,
  Minus,
  Check,
  Save,
} from 'lucide-react';
import { RatingName } from '../types/motw';
import { calculateLevel, calculateExpProgress } from '../utils/dice';

interface PlayerDeskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerRoll: (rating: RatingName, moveName: string) => void;
}

export const PlayerDeskModal: React.FC<PlayerDeskModalProps> = ({
  isOpen,
  onClose,
  onTriggerRoll,
}) => {
  const { currentCampaign, activeHunter, saveHunterCharacter, updateHarm } = useVTT();

  const [personalNotes, setPersonalNotes] = useState(activeHunter?.personalNotes || '');
  const [isSavedNotes, setIsSavedNotes] = useState(false);
  const [activeTab, setActiveTab] = useState<'resumo' | 'investigacao' | 'grupo'>('resumo');

  if (!isOpen || !currentCampaign || !activeHunter) return null;

  const level = calculateLevel(activeHunter.levelUpsTaken);
  const expProgress = calculateExpProgress(activeHunter.experience);
  const clues = currentCampaign.clues || [];
  const revealedClues = clues.filter((c) => c.status === 'revelada' || c.status === 'descoberta');
  const otherHunters = Object.values(currentCampaign.characters || {}).filter(
    (c) => c.id !== activeHunter.id
  );

  const handleSaveNotes = async () => {
    await saveHunterCharacter({
      ...activeHunter,
      personalNotes,
    });
    setIsSavedNotes(true);
    setTimeout(() => setIsSavedNotes(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-3 select-none">
      <div className="w-full sm:max-w-3xl h-[95dvh] sm:h-auto sm:max-h-[90vh] bg-zinc-950 border-t sm:border border-amber-600/60 rounded-t-2xl sm:rounded-xl shadow-2xl flex flex-col overflow-hidden text-xs pb-safe">
        {/* Header */}
        <div className="p-3 sm:p-4 bg-gradient-to-r from-red-950/80 via-amber-950/40 to-zinc-950 border-b border-zinc-800 flex items-center justify-between shrink-0 gap-2">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            {activeHunter.portraitUrl ? (
              <img
                src={activeHunter.portraitUrl}
                alt={activeHunter.name}
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-lg object-cover border border-amber-500/50 shadow shrink-0"
              />
            ) : (
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-amber-500 shrink-0">
                <Shield className="w-6 h-6" />
              </div>
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-zinc-100 text-sm truncate">{activeHunter.name}</h3>
                <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-600/40 text-emerald-400 font-mono font-bold text-[10px]">
                  NÍVEL {level}
                </span>
              </div>
              <p className="text-zinc-400 text-xs truncate">
                {activeHunter.playbookName} &bull; {activeHunter.look}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-200 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg hover:bg-zinc-900 active:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab navigation */}
        <div className="flex border-b border-zinc-800 bg-zinc-900/60 text-xs font-bold shrink-0 overflow-x-auto no-scrollbar touch-pan-x">
          <button
            onClick={() => setActiveTab('resumo')}
            className={`py-3 px-3.5 min-h-[44px] whitespace-nowrap text-center transition flex items-center justify-center ${
              activeTab === 'resumo'
                ? 'border-b-2 border-amber-500 text-amber-300 bg-zinc-900'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Meu Caçador & Dados
          </button>
          <button
            onClick={() => setActiveTab('investigacao')}
            className={`py-3 px-3.5 min-h-[44px] whitespace-nowrap text-center transition flex items-center justify-center gap-1.5 ${
              activeTab === 'investigacao'
                ? 'border-b-2 border-amber-500 text-amber-300 bg-zinc-900'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quadro de Pistas ({revealedClues.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('grupo')}
            className={`py-3 px-3.5 min-h-[44px] whitespace-nowrap text-center transition flex items-center justify-center gap-1.5 ${
              activeTab === 'grupo'
                ? 'border-b-2 border-amber-500 text-amber-300 bg-zinc-900'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Grupo ({otherHunters.length})</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-3 sm:p-4 overflow-y-auto flex-1 space-y-4 pb-12 sm:pb-4">
          {activeTab === 'resumo' && (
            <div className="space-y-4">
              {/* Ratings */}
              <div className="grid grid-cols-5 gap-2 font-mono">
                {(['Braveza', 'Esperteza', 'Estranheza', 'Firmeza', 'Sutileza'] as RatingName[]).map(
                  (r) => (
                    <button
                      key={r}
                      onClick={() => onTriggerRoll(r, `Teste de ${r}`)}
                      className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-amber-500/50 text-center transition active:scale-95"
                    >
                      <div className="text-[9px] text-zinc-400 uppercase">{r}</div>
                      <div className="text-base font-bold text-amber-400">
                        {activeHunter.ratings[r] >= 0
                          ? `+${activeHunter.ratings[r]}`
                          : activeHunter.ratings[r]}
                      </div>
                    </button>
                  )
                )}
              </div>

              {/* Status indicators */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-zinc-200 text-xs flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5 text-red-500" /> Dano:
                    </span>
                    <span className="font-mono text-zinc-300 font-bold">
                      {activeHunter.harm} / 7
                    </span>
                  </div>
                  <div className="flex gap-1 pt-1">
                    <button
                      onClick={() => updateHarm(activeHunter.id, 1, activeHunter.armour, false)}
                      className="flex-1 py-1 bg-red-950 text-red-200 border border-red-800 rounded font-bold"
                    >
                      +1 Dano
                    </button>
                    <button
                      onClick={() => updateHarm(activeHunter.id, -1, 0, true)}
                      className="flex-1 py-1 bg-zinc-800 text-zinc-200 border border-zinc-700 rounded font-bold"
                    >
                      Curar 1
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-zinc-200 text-xs flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Sorte:
                    </span>
                    <span className="font-mono text-amber-400 font-bold">
                      {activeHunter.luckMax - activeHunter.luckCurrent} restante(s)
                    </span>
                  </div>
                  <div className="text-[10px] text-zinc-400 pt-1">
                    Gasto: {activeHunter.luckCurrent}/{activeHunter.luckMax}
                  </div>
                </div>
              </div>

              {/* Personal Notes (Notebook) */}
              <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-zinc-200 text-xs flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-amber-400" />
                    <span>Caderno Pessoal de Anotações</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleSaveNotes}
                    className="px-2.5 py-1 bg-amber-600 hover:bg-amber-500 text-zinc-950 font-bold rounded-lg text-[11px] flex items-center gap-1 shadow"
                  >
                    {isSavedNotes ? <Check className="w-3 h-3" /> : <Save className="w-3 h-3" />}
                    <span>{isSavedNotes ? 'Salvo!' : 'Salvar Notas'}</span>
                  </button>
                </div>
                <textarea
                  rows={4}
                  value={personalNotes}
                  onChange={(e) => setPersonalNotes(e.target.value)}
                  placeholder="Escreva aqui suas teorias sobre o monstro, suspeitos, pistas e números de telefone..."
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2.5 text-xs text-zinc-200 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          )}

          {activeTab === 'investigacao' && (
            <div className="space-y-3">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                Pistas Reveladas pelo Guardião ({revealedClues.length})
              </span>
              {revealedClues.length === 0 ? (
                <div className="p-8 text-center text-zinc-500 space-y-1">
                  <p>Nenhuma pista foi revelada pelo Guardião até o momento.</p>
                  <p className="text-[11px]">
                    Utilize o movimento <strong>Investigar um Mistério</strong> para obter respostas!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {revealedClues.map((c) => (
                    <div
                      key={c.id}
                      className="p-3 bg-zinc-900 rounded-xl border border-zinc-800 space-y-2 shadow flex flex-col justify-between"
                    >
                      {c.imageUrl && (
                        <div className="w-full h-32 rounded-lg overflow-hidden border border-zinc-700 bg-zinc-950">
                          <img
                            src={c.imageUrl}
                            alt={c.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                          <h4 className="font-bold text-zinc-100 text-xs">{c.title}</h4>
                        </div>
                        <p className="text-[11px] text-zinc-300 leading-relaxed">{c.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'grupo' && (
            <div className="space-y-3">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                Aliados na Investigação
              </span>
              {otherHunters.length === 0 ? (
                <p className="text-zinc-500 italic">Você é o único caçador na mesa no momento.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {otherHunters.map((hunter) => (
                    <div
                      key={hunter.id}
                      className="p-3 bg-zinc-900 rounded-xl border border-zinc-800 space-y-2 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5">
                        {hunter.portraitUrl ? (
                          <img
                            src={hunter.portraitUrl}
                            alt={hunter.name}
                            className="w-10 h-10 rounded-lg object-cover border border-zinc-700"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400 font-bold">
                            {hunter.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-zinc-200 text-xs">{hunter.name}</div>
                          <div className="text-[10px] text-amber-400">{hunter.playbookName}</div>
                        </div>
                      </div>
                      <div className="text-right font-mono text-[11px]">
                        <div className="text-red-400 font-bold">Dano: {hunter.harm}/7</div>
                        <div className="text-zinc-500">Nível {calculateLevel(hunter.levelUpsTaken)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
