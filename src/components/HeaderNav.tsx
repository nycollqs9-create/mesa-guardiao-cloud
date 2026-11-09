import React, { useState } from 'react';
import { useVTT } from '../context/VTTContext';
import {
  Dice5,
  User,
  Shield,
  Copy,
  Check,
  LogOut,
  Clock,
  PlusCircle,
  HelpCircle,
  Award,
  Film,
  BookOpen,
  Camera,
  X,
} from 'lucide-react';
import { COUNTDOWN_STAGE_LABELS } from '../data/keeperReference';
import { ImageUploadInput } from './ImageUploadInput';

interface HeaderNavProps {
  onOpenDiceRoller: () => void;
  onOpenCharacterSheet: () => void;
  onOpenCharacterCreator: () => void;
  onOpenKeeperCentral: () => void;
  onOpenPlayerDesk: () => void;
  activeLeftTab: string;
  setActiveLeftTab: (tab: string) => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  onOpenDiceRoller,
  onOpenCharacterSheet,
  onOpenCharacterCreator,
  onOpenKeeperCentral,
  onOpenPlayerDesk,
  activeLeftTab,
  setActiveLeftTab,
}) => {
  const {
    currentCampaign,
    currentRole,
    activeHunter,
    user,
    updateUser,
    leaveCurrentCampaign,
  } = useVTT();

  const [copiedCode, setCopiedCode] = useState(false);
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);

  if (!currentCampaign) return null;

  const handleCopyInvite = () => {
    navigator.clipboard.writeText(currentCampaign.inviteCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const currentStage = currentCampaign.activeMystery?.currentStage || 'dia';

  return (
    <header className="h-14 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between px-3 md:px-5 select-none shrink-0 z-20 shadow-md">
      {/* Brand & Campaign Info */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-amber-700 to-red-950 border border-amber-600/50 flex items-center justify-center shadow-inner">
            <span className="text-amber-200 font-serif font-black text-sm tracking-wider">M</span>
          </div>
          <div>
            <h1 className="text-sm font-bold text-zinc-100 truncate max-w-[140px] md:max-w-[240px] tracking-tight">
              {currentCampaign.name}
            </h1>
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <span className="hidden sm:inline font-mono text-[10px] text-zinc-500">MOTW</span>
              <button
                onClick={handleCopyInvite}
                title="Clique para copiar o código de convite"
                className="flex items-center gap-1 font-mono text-[11px] text-amber-400/90 hover:text-amber-300 hover:bg-zinc-900 px-1.5 py-0.5 rounded border border-amber-500/30 transition-colors"
              >
                <span>{currentCampaign.inviteCode}</span>
                {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          </div>
        </div>

        {/* Countdown Stage indicator */}
        {currentCampaign.activeMystery && (
          <div
            onClick={() => setActiveLeftTab('misterio')}
            className={`cursor-pointer hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded text-xs border transition-all ${
              currentStage === 'meia_noite'
                ? 'bg-red-950/80 border-red-600 text-red-200 animate-pulse'
                : currentStage === 'anoitecer' || currentStage === 'poente'
                ? 'bg-amber-950/60 border-amber-700 text-amber-200'
                : 'bg-zinc-900 border-zinc-700 text-zinc-300'
            }`}
            title={COUNTDOWN_STAGE_LABELS[currentStage]}
          >
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <span className="font-semibold uppercase tracking-wider text-[11px]">
              Relógio: {currentStage.replace('_', ' ')}
            </span>
          </div>
        )}
      </div>

      {/* Middle: Fast Action Controls (Desktop only - mobile uses bottom bar) */}
      <div className="hidden md:flex items-center gap-2">
        {/* Dice Roller Button */}
        <button
          onClick={onOpenDiceRoller}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-red-950 to-amber-950 hover:from-red-900 hover:to-amber-900 text-amber-200 border border-amber-600/50 rounded shadow font-semibold text-xs transition-all active:scale-95"
        >
          <Dice5 className="w-4 h-4 text-amber-400" />
          <span>Rolar 2d6</span>
        </button>

        {/* Central do Guardião (Keeper) */}
        {currentRole === 'guardiao' && (
          <button
            onClick={onOpenKeeperCentral}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-zinc-950 font-bold rounded-lg shadow text-xs transition-all active:scale-95"
            title="Abrir Central do Guardião (Arcos, Mistérios, Cenas, Pistas, Relógio)"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Central do Guardião</span>
          </button>
        )}

        {/* Meu Caçador / Investigação (Player) */}
        {activeHunter && (
          <button
            onClick={onOpenPlayerDesk}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-zinc-900 hover:bg-zinc-850 text-amber-300 border border-amber-600/40 rounded-lg text-xs font-semibold transition"
            title="Abrir Área Meu Caçador & Quadro de Investigação"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Meu Caçador</span>
          </button>
        )}

        {/* Character Sheet / Creator (Desktop) */}
        {activeHunter ? (
          <button
            onClick={onOpenCharacterSheet}
            className="flex items-center gap-2 px-2.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 rounded-lg text-xs transition-colors"
          >
            {activeHunter.portraitUrl ? (
              <img
                src={activeHunter.portraitUrl}
                alt={activeHunter.name}
                className="w-5 h-5 rounded-full object-cover border border-zinc-600"
              />
            ) : (
              <User className="w-4 h-4 text-emerald-400" />
            )}
            <div className="text-left leading-tight">
              <div className="font-semibold text-zinc-200 truncate max-w-[100px]">{activeHunter.name}</div>
              <div className="text-[10px] text-zinc-400 font-mono">Dano: {activeHunter.harm}/7</div>
            </div>
          </button>
        ) : (
          <button
            onClick={onOpenCharacterCreator}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-950/80 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-700/60 rounded-lg text-xs transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Criar Caçador</span>
          </button>
        )}
      </div>

      {/* Right side: Mobile Sheet Trigger + Role + User + Leave */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Quick Hunter Sheet Trigger on Mobile */}
        {activeHunter ? (
          <button
            type="button"
            onClick={onOpenCharacterSheet}
            className="md:hidden flex items-center gap-1.5 px-2.5 py-1.5 min-h-[44px] min-w-[44px] bg-zinc-900 active:bg-zinc-800 text-zinc-200 border border-zinc-700 rounded-lg text-xs transition"
            title="Abrir Ficha do Caçador"
          >
            {activeHunter.portraitUrl ? (
              <img
                src={activeHunter.portraitUrl}
                alt={activeHunter.name}
                className="w-5 h-5 rounded-full object-cover border border-zinc-600"
              />
            ) : (
              <User className="w-4 h-4 text-emerald-400" />
            )}
            <span className="text-[11px] font-semibold">Ficha</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onOpenCharacterCreator}
            className="md:hidden flex items-center gap-1 px-2.5 py-1.5 min-h-[44px] bg-emerald-950 text-emerald-300 border border-emerald-700 rounded-lg text-xs font-semibold"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Ficha</span>
          </button>
        )}

        {/* Role badge */}
        <div
          className={`hidden sm:flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider border ${
            currentRole === 'guardiao'
              ? 'bg-amber-950/90 text-amber-300 border-amber-600/60'
              : 'bg-emerald-950/90 text-emerald-300 border-emerald-700/60'
          }`}
        >
          <Shield className="w-3 h-3" />
          <span>{currentRole === 'guardiao' ? 'Guardião' : 'Caçador'}</span>
        </div>

        {/* User Avatar */}
        <div className="relative group hidden sm:block">
          <button
            type="button"
            onClick={() => setIsEditingAvatar(true)}
            className="flex items-center gap-1.5 text-xs text-zinc-400 bg-zinc-900 hover:bg-zinc-850 px-2 py-1 rounded border border-zinc-800 hover:border-amber-500/50 transition cursor-pointer min-h-[36px]"
            title="Alterar sua foto de perfil"
          >
            <img
              src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
              alt={user.name}
              className="w-4 h-4 rounded-full object-cover"
            />
            <span className="hidden sm:inline max-w-[80px] truncate">{user.name}</span>
          </button>
        </div>

        {/* Leave Campaign */}
        <button
          onClick={leaveCurrentCampaign}
          title="Sair da campanha e voltar ao Lobby"
          className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2 text-zinc-400 hover:text-red-400 active:text-red-300 rounded transition-colors"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>

      {/* User Avatar Modal */}
      {isEditingAvatar && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-zinc-950 border border-amber-600/60 rounded-xl shadow-2xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <span className="font-bold text-zinc-100 text-sm">Foto de Perfil</span>
              <button
                type="button"
                onClick={() => setIsEditingAvatar(false)}
                className="text-zinc-400 hover:text-zinc-200 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <ImageUploadInput
              label="Escolha uma foto salva na sua Galeria ou use a Câmera"
              value={user.avatarUrl || ''}
              onChange={(newUrl) => {
                updateUser({ avatarUrl: newUrl });
                setIsEditingAvatar(false);
              }}
              aspectRatio="square"
            />

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setIsEditingAvatar(false)}
                className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs rounded-lg font-medium"
              >
                Concluir
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
