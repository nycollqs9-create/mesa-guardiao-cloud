import React, { useState } from 'react';
import { useVTT } from '../context/VTTContext';
import {
  MapPin,
  Sparkles,
  FileQuestion,
  Search,
  Swords,
  ShieldAlert,
  Flame,
  HelpCircle,
  Eye,
  Plus,
  Compass,
} from 'lucide-react';
import { MOTW_BASIC_MOVES } from '../data/motwBasicMoves';

interface CenterStageProps {
  onTriggerMove: (moveId: string) => void;
  onOpenMysteryTab: () => void;
}

export const CenterStage: React.FC<CenterStageProps> = ({
  onTriggerMove,
  onOpenMysteryTab,
}) => {
  const { currentCampaign, currentRole, updateScenes } = useVTT();
  const [newClueText, setNewClueText] = useState('');
  const [showAddClue, setShowAddClue] = useState(false);

  if (!currentCampaign) return null;

  const isKeeper = currentRole === 'guardiao';
  const activeScene = currentCampaign.scenes.find((s) => s.isActive) || currentCampaign.scenes[0];

  const handleAddClue = () => {
    if (!newClueText.trim() || !activeScene) return;
    const updatedScenes = currentCampaign.scenes.map((s) => {
      if (s.id === activeScene.id) {
        return {
          ...s,
          clues: [...(s.clues || []), newClueText.trim()],
        };
      }
      return s;
    });
    updateScenes(updatedScenes);
    setNewClueText('');
    setShowAddClue(false);
  };

  return (
    <main className="flex-1 h-full flex flex-col bg-zinc-950 relative overflow-hidden">
      {/* Background Atmosphere Image */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        {activeScene?.imageUrl && (
          <img
            src={activeScene.imageUrl}
            alt={activeScene.name}
            className="w-full h-full object-cover object-center opacity-25 filter blur-[1px] scale-105"
          />
        )}
        <div className="absolute inset-0 bg-radial from-transparent via-zinc-950/80 to-zinc-950" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 relative z-10 space-y-6 max-w-5xl mx-auto w-full custom-scrollbar">
        {/* Scene Header Card */}
        {activeScene ? (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800/80 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded bg-amber-950/80 border border-amber-600/50 text-amber-300">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-amber-500">
                    Cena Ativa
                  </span>
                  <h2 className="text-xl md:text-2xl font-serif font-black text-zinc-100 tracking-tight">
                    {activeScene.name}
                  </h2>
                </div>
              </div>

              {currentCampaign.activeMystery && (
                <button
                  onClick={onOpenMysteryTab}
                  className="flex items-center gap-1.5 px-3 py-1 bg-zinc-900/90 hover:bg-zinc-850 text-zinc-300 border border-zinc-700/80 rounded text-xs transition-colors shadow-sm"
                >
                  <Compass className="w-3.5 h-3.5 text-amber-500" />
                  <span className="font-semibold">{currentCampaign.activeMystery.title}</span>
                </button>
              )}
            </div>

            {/* Narrative description */}
            <div className="p-4 md:p-5 bg-zinc-900/80 backdrop-blur-md rounded-lg border border-zinc-800 shadow-xl space-y-3">
              <div className="text-zinc-200 text-sm md:text-base leading-relaxed font-serif italic text-shadow">
                "{activeScene.description}"
              </div>

              {/* GM Notes (Only visible to Keeper) */}
              {isKeeper && activeScene.gmNotes && (
                <div className="pt-3 border-t border-zinc-800 text-xs">
                  <span className="font-mono uppercase font-bold text-amber-400/90 text-[10px] block mb-1">
                    [Notas Privadas do Guardião]
                  </span>
                  <p className="text-zinc-300 bg-amber-950/30 p-2.5 rounded border border-amber-800/40">
                    {activeScene.gmNotes}
                  </p>
                </div>
              )}
            </div>

            {/* Clues Board for this scene */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-bold text-amber-400 tracking-wider flex items-center gap-1.5">
                  <Search className="w-3.5 h-3.5" /> Pistas e Evidências no Local
                </span>
                <button
                  onClick={() => setShowAddClue(!showAddClue)}
                  className="flex items-center gap-1 text-[11px] text-zinc-300 hover:text-amber-300 bg-zinc-900 hover:bg-zinc-850 px-2.5 py-1 rounded border border-zinc-700 transition-colors"
                >
                  <Plus className="w-3 h-3" /> Registrar Pista
                </button>
              </div>

              {showAddClue && (
                <div className="p-3 bg-zinc-900 rounded border border-amber-600/40 space-y-2">
                  <input
                    type="text"
                    placeholder="Descrição da pista encontrada pelos caçadores..."
                    value={newClueText}
                    onChange={(e) => setNewClueText(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded px-3 py-1.5 text-xs text-zinc-100"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleAddClue}
                      className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-zinc-950 font-bold rounded text-xs"
                    >
                      Adicionar
                    </button>
                    <button
                      onClick={() => setShowAddClue(false)}
                      className="px-3 py-1 bg-zinc-800 text-zinc-300 rounded text-xs"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                {activeScene.clues && activeScene.clues.length > 0 ? (
                  activeScene.clues.map((clue, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-zinc-900/90 backdrop-blur rounded border border-zinc-800/80 shadow-md space-y-1 hover:border-amber-500/40 transition-colors group"
                    >
                      <div className="flex items-center gap-1.5 text-[10px] text-amber-400/80 font-mono">
                        <FileQuestion className="w-3 h-3" />
                        <span>Evidência #{idx + 1}</span>
                      </div>
                      <p className="text-zinc-200 text-xs leading-snug">{clue}</p>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full p-4 text-center text-zinc-500 bg-zinc-900/40 rounded border border-dashed border-zinc-800 text-xs">
                    Nenhuma pista catalogada neste local ainda. Use "Investigar um Mistério" para descobrir fatos ocultos.
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center text-zinc-500">Nenhuma cena ativa configurada.</div>
        )}
      </div>

      {/* Quick Move Triggers Dock (Bottom Bar) */}
      <div className="bg-zinc-950/95 border-t border-zinc-800 p-2 sm:p-2.5 md:p-3 relative z-10 shrink-0 shadow-2xl backdrop-blur-md pb-3">
        <div className="max-w-5xl mx-auto flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-[11px] text-zinc-400 px-1">
            <span className="font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Movimentos Rápidos
            </span>
            <span className="text-zinc-500 text-[10px]">
              Arraste para o lado &bull; 2d6
            </span>
          </div>

          <div className="flex md:grid md:grid-cols-8 overflow-x-auto gap-2 pb-1 no-scrollbar touch-pan-x">
            {MOTW_BASIC_MOVES.map((move) => {
              const ratingColor =
                move.rating === 'Braveza'
                  ? 'border-red-900/60 hover:border-red-500 text-red-200'
                  : move.rating === 'Esperteza'
                  ? 'border-blue-900/60 hover:border-blue-500 text-blue-200'
                  : move.rating === 'Estranheza'
                  ? 'border-purple-900/60 hover:border-purple-500 text-purple-200'
                  : move.rating === 'Firmeza'
                  ? 'border-amber-900/60 hover:border-amber-500 text-amber-200'
                  : 'border-emerald-900/60 hover:border-emerald-500 text-emerald-200';

              return (
                <button
                  key={move.id}
                  onClick={() => onTriggerMove(move.id)}
                  title={`${move.name} (+${move.rating}): ${move.trigger}`}
                  className={`shrink-0 min-w-[125px] md:min-w-0 p-2 md:p-2 min-h-[44px] bg-zinc-900/90 active:bg-zinc-800 rounded-lg border text-left transition-all active:scale-95 group shadow-sm flex flex-col justify-center ${ratingColor}`}
                >
                  <div className="font-bold text-[11px] truncate leading-tight">{move.name}</div>
                  <div className="text-[10px] font-mono text-zinc-400 group-hover:text-zinc-200 mt-0.5">
                    +{move.rating}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
};
