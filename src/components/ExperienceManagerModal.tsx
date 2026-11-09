import React, { useState } from 'react';
import { useVTT } from '../context/VTTContext';
import { Award, Plus, Minus, X, Users, Check, AlertCircle, History } from 'lucide-react';
import { HunterCharacter } from '../types/motw';

interface ExperienceManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedHunterId?: string;
}

export const ExperienceManagerModal: React.FC<ExperienceManagerModalProps> = ({
  isOpen,
  onClose,
  preselectedHunterId,
}) => {
  const { currentCampaign, manageExperience } = useVTT();

  const [selectedHunterId, setSelectedHunterId] = useState<string>(
    preselectedHunterId || 'all'
  );
  const [xpDelta, setXpDelta] = useState<number>(1);
  const [reason, setReason] = useState<string>('Descoberta importante durante a investigação');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen || !currentCampaign) return null;

  const characters = Object.values(currentCampaign.characters || {});

  const handleGrant = async () => {
    setIsSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const isAll = selectedHunterId === 'all';
      await manageExperience({
        allHunters: isAll,
        hunterId: isAll ? undefined : selectedHunterId,
        delta: xpDelta,
        reason: reason.trim() || 'Ação em jogo do Guardião',
      });
      setSuccessMsg(`Experiência (${xpDelta > 0 ? `+${xpDelta}` : xpDelta} XP) concedida com sucesso!`);
      setTimeout(() => {
        setIsSubmitting(false);
        setSuccessMsg(null);
        onClose();
      }, 1000);
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMsg(err.message || 'Erro ao conceder experiência');
    }
  };

  const quickReasons = [
    'Falha em rolagem com aprendizado',
    'Investigou e descobriu a fraqueza do monstro',
    'Protegeu um inocente com risco à própria vida',
    'Fim de Sessão: Mistério resolvido ou avançado',
    'Interpretação excelente e trabalho em equipe',
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 select-none">
      <div className="w-full max-w-lg bg-zinc-950 border border-emerald-600/60 rounded-xl shadow-2xl flex flex-col text-xs overflow-hidden max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-emerald-950/80 via-zinc-950 to-zinc-950 border-b border-zinc-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-600/20 border border-emerald-500/50 text-emerald-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-emerald-500 uppercase font-bold tracking-wider">
                Ferramenta do Guardião
              </span>
              <h3 className="font-bold text-zinc-100 text-sm">Gerenciar Experiência (XP)</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-200 p-1.5 rounded hover:bg-zinc-900 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-4 overflow-y-auto flex-1">
          {successMsg && (
            <div className="p-3 bg-emerald-950/80 border border-emerald-600 rounded-lg text-emerald-200 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 bg-red-950/80 border border-red-600 rounded-lg text-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Target Hunter Selector */}
          <div className="space-y-1.5">
            <label className="font-bold text-zinc-300 uppercase text-[10px] tracking-wider">
              Destinatário da Experiência:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSelectedHunterId('all')}
                className={`p-2.5 rounded-lg border text-left transition flex items-center gap-2 ${
                  selectedHunterId === 'all'
                    ? 'bg-emerald-950/70 border-emerald-500 text-emerald-200 font-bold'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850'
                }`}
              >
                <Users className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <div className="text-xs">Todos os Caçadores</div>
                  <div className="text-[10px] font-normal text-zinc-500">
                    Bônus coletivo ({characters.length} caçadores)
                  </div>
                </div>
              </button>

              {characters.map((char) => (
                <button
                  key={char.id}
                  type="button"
                  onClick={() => setSelectedHunterId(char.id)}
                  className={`p-2.5 rounded-lg border text-left transition flex items-center gap-2 truncate ${
                    selectedHunterId === char.id
                      ? 'bg-emerald-950/70 border-emerald-500 text-emerald-200 font-bold'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850'
                  }`}
                >
                  <div className="w-3 h-3 rounded-full bg-emerald-500 shrink-0" />
                  <div className="truncate">
                    <div className="text-xs truncate">{char.name}</div>
                    <div className="text-[10px] font-mono text-zinc-500">
                      XP Atual: {char.experience}/5
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="space-y-1.5">
            <label className="font-bold text-zinc-300 uppercase text-[10px] tracking-wider">
              Quantidade de Experiência:
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setXpDelta(val)}
                  className={`flex-1 py-2 rounded-lg font-mono font-bold text-sm border transition ${
                    xpDelta === val
                      ? 'bg-emerald-600 border-emerald-400 text-zinc-950 shadow'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-850'
                  }`}
                >
                  +{val} XP
                </button>
              ))}
              <button
                type="button"
                onClick={() => setXpDelta(-1)}
                className={`px-3 py-2 rounded-lg font-mono font-bold text-sm border transition ${
                  xpDelta === -1
                    ? 'bg-red-800 border-red-500 text-white'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-red-300'
                }`}
                title="Remover 1 XP em caso de correção"
              >
                -1 XP
              </button>
            </div>
          </div>

          {/* Reason Input */}
          <div className="space-y-1.5">
            <label className="font-bold text-zinc-300 uppercase text-[10px] tracking-wider">
              Motivo ou Façanha Narrativa (Será anunciado aos jogadores):
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Ex: Investigou com sucesso o laboratório abandonado..."
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 text-xs focus:outline-none focus:border-emerald-500"
            />

            {/* Quick Reason suggestions */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {quickReasons.map((qr, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setReason(qr)}
                  className="px-2 py-1 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800 text-[10px] transition"
                >
                  {qr}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-zinc-950 border-t border-zinc-800 flex items-center justify-end gap-2 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg font-semibold"
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleGrant}
            className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-amber-600 hover:from-emerald-500 hover:to-amber-500 text-zinc-950 font-bold rounded-lg shadow flex items-center gap-1.5 transition active:scale-95"
          >
            <Award className="w-3.5 h-3.5" />
            <span>{isSubmitting ? 'Concedendo...' : 'Conceder Experiência'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
