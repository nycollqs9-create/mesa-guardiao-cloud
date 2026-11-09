import React, { useState, useEffect } from 'react';
import { useVTT } from '../context/VTTContext';
import { Dice5, Sparkles, X, Shield, Eye, HelpCircle, CheckSquare } from 'lucide-react';
import { RatingName, VisibilityMode } from '../types/motw';
import { MOTW_BASIC_MOVES } from '../data/motwBasicMoves';

interface RollModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMoveId?: string;
  initialRating?: RatingName;
}

export const RollModal: React.FC<RollModalProps> = ({
  isOpen,
  onClose,
  initialMoveId,
  initialRating,
}) => {
  const { activeHunter, rollDice, user } = useVTT();

  const [selectedMoveId, setSelectedMoveId] = useState<string>(initialMoveId || 'investigar_um_misterio');
  const [selectedRating, setSelectedRating] = useState<RatingName | undefined>(initialRating);
  const [situationalMod, setSituationalMod] = useState<number>(0);
  const [visibility, setVisibility] = useState<VisibilityMode>('publica');
  const [actionDesc, setActionDesc] = useState('');
  const [isRolling, setIsRolling] = useState(false);

  // Sync state whenever props change or modal re-opens
  useEffect(() => {
    if (isOpen) {
      if (initialMoveId) {
        setSelectedMoveId(initialMoveId);
      }
      setSelectedRating(initialRating);
      setSituationalMod(0);
      setActionDesc('');
    }
  }, [isOpen, initialMoveId, initialRating]);

  if (!isOpen) return null;

  const matchedMove = MOTW_BASIC_MOVES.find((m) => m.id === selectedMoveId);
  const ratingName: RatingName = selectedRating || matchedMove?.rating || 'Braveza';
  const ratingValue = activeHunter?.ratings ? activeHunter.ratings[ratingName] ?? 0 : 0;
  const totalMod = ratingValue + situationalMod;
  const hasAdvanced = activeHunter?.advancedMovesUnlocked?.includes(matchedMove?.name || '') || false;

  const handleRoll = async () => {
    setIsRolling(true);
    try {
      await rollDice({
        moveName: matchedMove?.name || 'Ação 2d6',
        ratingUsed: ratingName,
        ratingModifier: ratingValue,
        situationalModifier: situationalMod,
        hasAdvanced,
        visibility,
        actionDescription: actionDesc.trim() || undefined,
      });
      setTimeout(() => {
        setIsRolling(false);
        onClose();
      }, 400);
    } catch (err) {
      setIsRolling(false);
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-3 select-none">
      <div className="w-full sm:max-w-lg bg-zinc-950 border-t sm:border border-amber-600/50 rounded-t-2xl sm:rounded-xl shadow-2xl overflow-hidden flex flex-col text-xs max-h-[95dvh] sm:max-h-[92vh] pb-safe">
        {/* Header */}
        <div className="p-3 sm:p-3.5 bg-gradient-to-r from-red-950/80 via-amber-950/40 to-zinc-950 border-b border-zinc-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded bg-amber-600/20 border border-amber-600/50 text-amber-400">
              <Dice5 className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-amber-500 uppercase font-bold tracking-wider">
                Mesa de Rolagem 2d6
              </span>
              <h3 className="font-bold text-zinc-100 text-sm">
                {matchedMove ? matchedMove.name : 'Rolar Dados'}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-200 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg hover:bg-zinc-900 active:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body (Scrollable if needed) */}
        <div className="p-4 space-y-3.5 overflow-y-auto flex-1">
          {/* Select Move */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
              Movimento Selecionado
            </label>
            <select
              value={selectedMoveId}
              onChange={(e) => {
                const newId = e.target.value;
                setSelectedMoveId(newId);
                const found = MOTW_BASIC_MOVES.find((m) => m.id === newId);
                if (found) {
                  setSelectedRating(found.rating);
                }
              }}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 font-semibold focus:outline-none focus:border-amber-500"
            >
              {MOTW_BASIC_MOVES.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} (+{m.rating})
                </option>
              ))}
            </select>
          </div>

          {/* Move Description & Reference Rules */}
          {matchedMove && (
            <div className="p-2.5 rounded-lg bg-zinc-900/80 border border-zinc-800 space-y-2">
              <div className="text-[11px] text-zinc-300 leading-relaxed">
                <span className="text-amber-400 font-semibold">{matchedMove.trigger}</span>{' '}
                {matchedMove.description}
              </div>

              {matchedMove.questions && (
                <div className="pt-2 border-t border-zinc-800">
                  <span className="text-[10px] font-bold text-amber-400 uppercase flex items-center gap-1">
                    <HelpCircle className="w-3 h-3" /> Perguntas Disponíveis:
                  </span>
                  <ul className="mt-1 space-y-0.5 text-[11px] text-zinc-400 pl-4 list-disc">
                    {matchedMove.questions.map((q, idx) => (
                      <li key={idx}>{q}</li>
                    ))}
                  </ul>
                </div>
              )}

              {matchedMove.options && (
                <div className="pt-2 border-t border-zinc-800">
                  <span className="text-[10px] font-bold text-amber-400 uppercase flex items-center gap-1">
                    <CheckSquare className="w-3 h-3" /> Opções Extras de Desfecho:
                  </span>
                  <ul className="mt-1 space-y-0.5 text-[11px] text-zinc-400 pl-4 list-disc">
                    {matchedMove.options.map((opt, idx) => (
                      <li key={idx}>{opt}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Rating & Modifier Breakdown */}
          <div className="p-3 bg-zinc-900/90 rounded-lg border border-zinc-800 space-y-2.5">
            <div className="flex items-center justify-between font-mono">
              <div className="flex items-center gap-1.5">
                <span className="text-zinc-300">Atributo:</span>
                <span className="px-2 py-0.5 rounded bg-zinc-800 text-amber-400 font-bold border border-zinc-700">
                  {ratingName} {ratingValue >= 0 ? `+${ratingValue}` : ratingValue}
                </span>
              </div>
              <span className="text-zinc-400 text-[11px]">
                {activeHunter ? activeHunter.name : user.name}
              </span>
            </div>

            {/* Situational Modifier Buttons */}
            <div className="space-y-1">
              <label className="text-[10px] text-zinc-400 uppercase font-semibold">
                Modificador Circunstancial (+1 contínuo, apoio, ferimento):
              </label>
              <div className="flex items-center gap-1.5">
                {[-2, -1, 0, 1, 2].map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setSituationalMod(v)}
                    className={`flex-1 min-h-[44px] py-2 rounded-lg font-mono font-bold text-sm transition-colors flex items-center justify-center ${
                      situationalMod === v
                        ? 'bg-amber-600 text-zinc-950 shadow-md font-extrabold'
                        : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-700 active:bg-zinc-750'
                    }`}
                  >
                    {v >= 0 ? `+${v}` : v}
                  </button>
                ))}
              </div>
            </div>

            {/* Total modifier display */}
            <div className="pt-2 border-t border-zinc-800 flex items-center justify-between font-bold text-xs">
              <span className="text-zinc-300">Fórmula de Rolagem:</span>
              <span className="font-mono text-amber-300 text-sm px-2.5 py-1 bg-black/40 rounded border border-amber-600/30">
                2d6 {totalMod >= 0 ? `+ ${totalMod}` : `- ${Math.abs(totalMod)}`}
              </span>
            </div>
          </div>

          {/* Action description / narrative roleplay input */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
              O que seu Caçador está fazendo? (Narrativa)
            </label>
            <input
              type="text"
              placeholder="Ex: Pulo por cima do balcão mirando a lanterna no teto..."
              value={actionDesc}
              onChange={(e) => setActionDesc(e.target.value)}
              className="w-full min-h-[44px] bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm sm:text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Visibility selector */}
          <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-1">
            <span className="flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-zinc-400" /> Visibilidade:
            </span>
            <select
              value={visibility}
              onChange={(e) => setVisibility(e.target.value as VisibilityMode)}
              className="min-h-[44px] bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-zinc-300"
            >
              <option value="publica">Pública (Todos na mesa veem)</option>
              <option value="privada">Oculta do Guardião</option>
            </select>
          </div>
        </div>

        {/* Footer Roll Button */}
        <div className="p-3 bg-zinc-950 border-t border-zinc-800 flex gap-2 shrink-0">
          <button
            onClick={onClose}
            className="px-4 min-h-[48px] bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-750 text-zinc-300 rounded-lg font-semibold text-xs transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleRoll}
            disabled={isRolling}
            className={`flex-1 min-h-[48px] rounded-lg font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg ${
              isRolling
                ? 'bg-amber-800 text-zinc-300 cursor-wait'
                : 'bg-gradient-to-r from-red-700 to-amber-600 hover:from-red-600 hover:to-amber-500 text-white active:scale-95'
            }`}
          >
            <Dice5 className={`w-4 h-4 ${isRolling ? 'animate-spin' : ''}`} />
            <span>{isRolling ? 'Rolando 2d6...' : 'Rolar Dados Agora!'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
