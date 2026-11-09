import React, { useState } from 'react';
import { useVTT } from '../context/VTTContext';
import { Award, Sparkles, X, Check, Shield, ChevronRight, AlertCircle, ArrowUp } from 'lucide-react';
import { HunterCharacter, RatingName } from '../types/motw';
import { MOTW_PLAYBOOKS } from '../data/motwPlaybooks';
import { calculateLevel } from '../utils/dice';

interface LevelUpModalProps {
  hunter: HunterCharacter;
  isOpen: boolean;
  onClose: () => void;
}

export const LevelUpModal: React.FC<LevelUpModalProps> = ({ hunter, isOpen, onClose }) => {
  const { applyLevelUp } = useVTT();
  const [selectedImp, setSelectedImp] = useState<string>('');
  const [selectedRating, setSelectedRating] = useState<RatingName | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const playbookDef = MOTW_PLAYBOOKS[hunter.playbookId];
  const currentLevel = calculateLevel(hunter.levelUpsTaken);
  const improvementsChosenCount = hunter.improvementsChosen?.length || 0;
  const isAdvancedEligible = improvementsChosenCount >= 5;

  // Standard Advanced Improvements from Monstro da Semana Brazilian Edition
  const advancedImprovements = [
    'Aumente qualquer atributo em +1 (máx +3)',
    'Desbloqueie movimentos avançados (12+) para um movimento básico',
    'Apague 1 ponto do Marcador de Sorte (Recupere 1 Sorte)',
    'Mude de cartilha para uma nova cartilha mantendo movimentos essenciais',
    'Crie um segundo caçador e jogue com ambos',
    'Aposente este caçador em paz e segurança',
  ];

  const availablePlaybookImps = playbookDef?.improvements || [
    'Aumente um de seus atributos em +1 (máx +3)',
    'Escolha mais um movimento da sua cartilha',
    'Escolha um movimento de outra cartilha',
    'Adicione um aliado ou contato confiável',
  ];

  // Helper to detect if chosen option is a rating booster
  const getRatingFromImp = (imp: string): RatingName | null => {
    if (imp.includes('Braveza')) return 'Braveza';
    if (imp.includes('Esperteza')) return 'Esperteza';
    if (imp.includes('Estranheza')) return 'Estranheza';
    if (imp.includes('Firmeza')) return 'Firmeza';
    if (imp.includes('Sutileza')) return 'Sutileza';
    return null;
  };

  const handleSelectImp = (imp: string) => {
    setSelectedImp(imp);
    const rating = getRatingFromImp(imp);
    setSelectedRating(rating || undefined);
    setError(null);
  };

  const handleConfirm = async () => {
    if (!selectedImp) return;
    setIsSubmitting(true);
    setError(null);
    try {
      await applyLevelUp(hunter.id, selectedImp, selectedRating);
      setIsSubmitting(false);
      onClose();
    } catch (err: any) {
      setIsSubmitting(false);
      setError(err.message || 'Erro ao aplicar evolução');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 select-none">
      <div className="w-full max-w-lg bg-zinc-950 border border-emerald-600/60 rounded-xl shadow-2xl flex flex-col text-xs overflow-hidden max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-emerald-950/90 via-zinc-950 to-zinc-950 border-b border-zinc-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-600/20 border border-emerald-500/50 text-emerald-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-zinc-100 text-sm">Evolução do Caçador</h3>
                <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-600/40 text-emerald-400 font-mono font-bold text-[10px]">
                  NÍVEL {currentLevel}
                </span>
              </div>
              <p className="text-zinc-400 text-[11px]">
                {hunter.name} ({hunter.playbookName}) &bull; {hunter.pendingLevelUps || 1} melhoria(s) pendente(s)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-200 p-1.5 rounded hover:bg-zinc-900 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 space-y-4 overflow-y-auto flex-1">
          {error && (
            <div className="p-2.5 bg-red-950/70 border border-red-700 rounded-lg text-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1">
            <span className="font-bold text-zinc-300 uppercase tracking-wider text-[10px]">
              Escolha 1 Melhoria para seu Caçador:
            </span>
            <p className="text-[11px] text-zinc-400">
              Cada vez que você preenche o 5º ponto de Experiência, você ganha o direito de escolher uma melhoria definitiva.
            </p>
          </div>

          {/* Regular Improvements List */}
          <div className="space-y-1.5">
            <span className="font-bold text-emerald-400 uppercase tracking-wider text-[10px]">
              Melhorias da Cartilha ({hunter.playbookName})
            </span>
            <div className="space-y-1.5">
              {availablePlaybookImps.map((imp, idx) => {
                const isSelected = selectedImp === imp;
                const alreadyChosen = hunter.improvementsChosen?.includes(imp);
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectImp(imp)}
                    className={`w-full text-left p-2.5 rounded-lg border transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-emerald-950/70 border-emerald-500 text-emerald-200 shadow'
                        : alreadyChosen
                        ? 'bg-zinc-900/40 border-zinc-800/80 text-zinc-400 hover:border-zinc-700'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-200 hover:border-zinc-700 hover:bg-zinc-850'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'bg-emerald-500 border-emerald-400 text-zinc-950 font-bold'
                            : alreadyChosen
                            ? 'bg-zinc-800 border-zinc-700 text-zinc-500'
                            : 'border-zinc-700'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3" />}
                        {alreadyChosen && !isSelected && <span className="text-[9px]">✓</span>}
                      </div>
                      <span className="text-xs font-medium">{imp}</span>
                    </div>
                    {alreadyChosen && (
                      <span className="text-[10px] text-zinc-500 font-mono">Já escolhida</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Advanced Improvements Section */}
          <div className="pt-2 border-t border-zinc-800 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-400 uppercase tracking-wider text-[10px]">
                Melhorias Avançadas (Após 5 Melhorias)
              </span>
              <span className="text-[10px] font-mono text-zinc-400">
                {improvementsChosenCount}/5 adquiridas
              </span>
            </div>

            {isAdvancedEligible ? (
              <div className="space-y-1.5">
                {advancedImprovements.map((imp, idx) => {
                  const isSelected = selectedImp === imp;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectImp(imp)}
                      className={`w-full text-left p-2.5 rounded-lg border transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-amber-950/70 border-amber-500 text-amber-200 shadow'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-200 hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                            isSelected
                              ? 'bg-amber-500 border-amber-400 text-zinc-950 font-bold'
                              : 'border-zinc-700'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3" />}
                        </div>
                        <span className="text-xs font-medium">{imp}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="text-[11px] text-zinc-500 italic p-2 bg-zinc-900/50 rounded border border-zinc-800">
                Desbloqueia após este caçador acumular pelo menos 5 melhorias normais da cartilha.
              </p>
            )}
          </div>

          {/* If choosing to boost any rating */}
          {selectedImp.includes('atributo em +1') && (
            <div className="p-3 bg-zinc-900 rounded-lg border border-zinc-700 space-y-2">
              <span className="font-bold text-zinc-200 text-[11px]">
                Qual atributo deseja aumentar em +1?
              </span>
              <div className="grid grid-cols-5 gap-1.5 font-mono">
                {(['Braveza', 'Esperteza', 'Estranheza', 'Firmeza', 'Sutileza'] as RatingName[]).map(
                  (r) => {
                    const currentVal = hunter.ratings[r];
                    const isMax = currentVal >= 3;
                    return (
                      <button
                        key={r}
                        type="button"
                        disabled={isMax}
                        onClick={() => setSelectedRating(r)}
                        className={`p-1.5 rounded border text-center transition ${
                          selectedRating === r
                            ? 'bg-emerald-600 border-emerald-400 text-zinc-950 font-bold'
                            : isMax
                            ? 'bg-zinc-950 border-zinc-850 text-zinc-600 opacity-50 cursor-not-allowed'
                            : 'bg-zinc-800 border-zinc-750 text-zinc-200 hover:border-emerald-500'
                        }`}
                      >
                        <div className="text-[9px] uppercase">{r.slice(0, 4)}</div>
                        <div className="text-xs font-bold">
                          {currentVal >= 0 ? `+${currentVal}` : currentVal}
                          {isMax ? ' (MÁX)' : ` ➜ +${currentVal + 1}`}
                        </div>
                      </button>
                    );
                  }
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-zinc-950 border-t border-zinc-800 flex items-center justify-end gap-2 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg font-semibold"
          >
            Fechar
          </button>
          <button
            type="button"
            disabled={!selectedImp || isSubmitting}
            onClick={handleConfirm}
            className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-amber-600 hover:from-emerald-500 hover:to-amber-500 disabled:opacity-40 text-zinc-950 font-bold rounded-lg shadow flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isSubmitting ? 'Aplicando...' : 'Confirmar Melhoria de Nível'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
