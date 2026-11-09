import React, { useState, useRef, useEffect } from 'react';
import { useVTT } from '../context/VTTContext';
import {
  Send,
  Dice5,
  Sparkles,
  Award,
  ChevronDown,
  Filter,
  Shield,
  User,
  AlertTriangle,
  Flame,
  MessageSquare,
  HelpCircle,
} from 'lucide-react';
import { ChatMessage, DiceRoll, VisibilityMode, RatingName } from '../types/motw';
import { MOTW_BASIC_MOVES } from '../data/motwBasicMoves';

interface SidebarRightProps {
  onOpenDiceRoller: () => void;
  onCloseMobile?: () => void;
}

export const SidebarRight: React.FC<SidebarRightProps> = ({ onOpenDiceRoller, onCloseMobile }) => {
  const {
    currentCampaign,
    currentRole,
    activeHunter,
    chatMessages,
    sendChatMessage,
    rollDice,
    spendLuck,
  } = useVTT();

  const [messageText, setMessageText] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'rolls' | 'chat'>('all');
  const [fastModifier, setFastModifier] = useState<number>(0);
  const [rollVisibility, setRollVisibility] = useState<VisibilityMode>('publica');
  const [showManualRoller, setShowManualRoller] = useState(false);

  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  if (!currentCampaign) return null;

  const isKeeper = currentRole === 'guardiao';

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    const type = isKeeper && messageText.startsWith('/mestre ') ? 'keeper_announcement' : 'chat';
    const text = messageText.startsWith('/mestre ') ? messageText.replace('/mestre ', '') : messageText;
    sendChatMessage(text, type);
    setMessageText('');
  };

  const handleFastRoll = async () => {
    await rollDice({
      moveName: 'Rolagem Geral 2d6',
      ratingModifier: fastModifier,
      situationalModifier: 0,
      visibility: rollVisibility,
    });
    setShowManualRoller(false);
  };

  const filteredMessages = chatMessages.filter((msg) => {
    // Visibility checks
    if (msg.visibility === 'privada' && !isKeeper && msg.userId !== currentCampaign.keeperId) {
      return false;
    }
    if (filterType === 'rolls') return msg.type === 'roll';
    if (filterType === 'chat') return msg.type === 'chat' || msg.type === 'keeper_announcement';
    return true;
  });

  return (
    <aside className="w-full md:w-96 h-full bg-zinc-950 border-l border-zinc-800 flex flex-col z-10 select-none pb-0 md:pb-0">
      {/* Header & Filter Tabs */}
      <div className="p-2.5 sm:p-3 border-b border-zinc-800 bg-zinc-900/60 flex items-center justify-between text-xs gap-2">
        <div className="flex items-center gap-1.5 font-bold text-zinc-300">
          <MessageSquare className="w-4 h-4 text-amber-500 shrink-0" />
          <span className="truncate">Histórico & Chat</span>
        </div>

        <div className="flex items-center gap-1.5">
          {onCloseMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              className="md:hidden px-2 py-1 text-[11px] text-amber-300 bg-amber-950/70 border border-amber-600/40 rounded font-semibold active:bg-amber-900"
            >
              Ver Cena
            </button>
          )}

          {/* Filter buttons */}
          <div className="flex items-center bg-zinc-950 rounded p-0.5 border border-zinc-800 text-[10px]">
            <button
              onClick={() => setFilterType('all')}
              className={`px-2 py-1 rounded transition-colors ${
                filterType === 'all' ? 'bg-amber-600 text-zinc-950 font-bold' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setFilterType('rolls')}
              className={`px-2 py-1 rounded transition-colors ${
                filterType === 'rolls' ? 'bg-amber-600 text-zinc-950 font-bold' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Dados
            </button>
            <button
              onClick={() => setFilterType('chat')}
              className={`px-2 py-1 rounded transition-colors ${
                filterType === 'chat' ? 'bg-amber-600 text-zinc-950 font-bold' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Chat
            </button>
          </div>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
        {filteredMessages.map((msg) => {
          if (msg.type === 'roll' && msg.roll) {
            return (
              <RollMessageCard
                key={msg.id}
                msg={msg}
                roll={msg.roll}
                activeHunter={activeHunter}
                onSpendLuck={() => activeHunter && spendLuck(activeHunter.id)}
              />
            );
          }

          if (msg.type === 'keeper_announcement') {
            return (
              <div
                key={msg.id}
                className="p-3 bg-gradient-to-r from-red-950/60 via-amber-950/40 to-red-950/60 border border-amber-600/50 rounded-lg text-xs space-y-1 shadow-md"
              >
                <div className="flex items-center justify-between text-amber-400 font-bold text-[10px] uppercase tracking-wider">
                  <span className="flex items-center gap-1">
                    <Shield className="w-3 h-3 text-amber-500" /> Aviso do Guardião
                  </span>
                  <span className="text-zinc-500 font-mono text-[9px]">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-amber-100 font-serif leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              </div>
            );
          }

          if (msg.type === 'system' || msg.type === 'narrative') {
            return (
              <div
                key={msg.id}
                className="p-2 bg-zinc-900/60 border border-zinc-800 rounded text-xs text-zinc-400 italic space-y-0.5"
              >
                <p className="leading-snug">{msg.content}</p>
                <span className="text-[9px] text-zinc-600 block text-right">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            );
          }

          // Regular chat message
          return (
            <div key={msg.id} className="p-2.5 bg-zinc-900/80 rounded border border-zinc-800 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-zinc-200">
                  {msg.characterName ? `${msg.characterName} (${msg.userName})` : msg.userName}
                </span>
                <span className="text-[9px] text-zinc-500 font-mono">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="text-zinc-300 leading-normal select-text">{msg.content}</p>
            </div>
          );
        })}
        <div ref={chatBottomRef} />
      </div>

      {/* Manual Quick Roller Tray (Collapsible) */}
      {showManualRoller && (
        <div className="p-3 bg-zinc-900 border-t border-zinc-800 space-y-2 text-xs">
          <div className="flex items-center justify-between text-zinc-300 font-bold">
            <span>Rápido 2d6 com Modificador</span>
            <button onClick={() => setShowManualRoller(false)} className="text-zinc-500 hover:text-zinc-300">
              ✕
            </button>
          </div>
          <div className="flex items-center gap-1.5">
            {[-2, -1, 0, 1, 2, 3].map((val) => (
              <button
                key={val}
                onClick={() => setFastModifier(val)}
                className={`flex-1 py-1 rounded font-mono font-bold text-xs ${
                  fastModifier === val
                    ? 'bg-amber-600 text-zinc-950'
                    : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                }`}
              >
                {val >= 0 ? `+${val}` : val}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <select
              value={rollVisibility}
              onChange={(e) => setRollVisibility(e.target.value as VisibilityMode)}
              className="bg-zinc-950 border border-zinc-700 rounded px-2 py-1 text-xs text-zinc-300"
            >
              <option value="publica">Pública</option>
              <option value="privada">Oculta do Guardião</option>
            </select>
            <button
              onClick={handleFastRoll}
              className="flex-1 py-1 bg-gradient-to-r from-red-700 to-amber-600 hover:from-red-600 hover:to-amber-500 text-white font-bold rounded shadow"
            >
              Rolar Agora!
            </button>
          </div>
        </div>
      )}

      {/* Chat & Roller Input Bar */}
      <div className="p-2 sm:p-2.5 bg-zinc-900/95 border-t border-zinc-800 shrink-0 space-y-2">
        <form onSubmit={handleSendMessage} className="flex gap-2 items-center">
          <button
            type="button"
            onClick={() => setShowManualRoller(!showManualRoller)}
            title="Abrir rolador rápido de 2d6"
            className="w-11 h-11 shrink-0 bg-zinc-800 active:bg-zinc-700 text-amber-400 rounded-lg border border-zinc-700 flex items-center justify-center transition-colors shadow-sm"
          >
            <Dice5 className="w-5 h-5" />
          </button>
          <input
            type="text"
            placeholder={isKeeper ? 'Escreva ou /mestre...' : 'Falar na campanha...'}
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            className="flex-1 h-11 bg-zinc-950 border border-zinc-700 rounded-lg px-3 text-sm sm:text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500"
          />
          <button
            type="submit"
            className="w-11 h-11 shrink-0 bg-amber-600 active:bg-amber-500 text-zinc-950 rounded-lg font-bold flex items-center justify-center transition-colors shadow-sm"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </aside>
  );
};

// Rich Dice Roll Card Subcomponent
const RollMessageCard: React.FC<{
  msg: ChatMessage;
  roll: DiceRoll;
  activeHunter: any;
  onSpendLuck: () => void;
}> = ({ msg, roll, activeHunter, onSpendLuck }) => {
  const isFail = roll.outcome === 'falha';
  const isPartial = roll.outcome === 'parcial';
  const isSuccess = roll.outcome === 'sucesso';
  const isAdvanced = roll.outcome === 'avancado';

  const matchedMove = MOTW_BASIC_MOVES.find(
    (m) => m.name.toLowerCase() === roll.moveName.toLowerCase()
  );

  return (
    <div
      className={`p-3 rounded-lg border text-xs shadow-md space-y-2 transition-all ${
        isAdvanced
          ? 'bg-amber-950/40 border-amber-500 ring-1 ring-amber-500/50'
          : isSuccess
          ? 'bg-emerald-950/40 border-emerald-600'
          : isPartial
          ? 'bg-amber-950/30 border-amber-700'
          : 'bg-red-950/50 border-red-700'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-1.5">
        <div>
          <span className="font-bold text-zinc-100">{roll.hunterName || roll.userName}</span>
          <span className="text-zinc-400 text-[10px] block font-mono">rolou para: {roll.moveName}</span>
        </div>
        <span className="text-[9px] text-zinc-500 font-mono">
          {new Date(roll.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>

      {/* 2d6 Dice Visual Display */}
      <div className="flex items-center justify-between bg-zinc-950/80 p-2 rounded border border-zinc-800/80">
        <div className="flex items-center gap-2">
          {/* Die 1 */}
          <div className="w-8 h-8 rounded bg-zinc-900 border border-zinc-700 flex items-center justify-center font-black text-sm text-zinc-100 shadow-inner">
            {roll.dice[0]}
          </div>
          <span className="text-zinc-500 font-bold">+</span>
          {/* Die 2 */}
          <div className="w-8 h-8 rounded bg-zinc-900 border border-zinc-700 flex items-center justify-center font-black text-sm text-zinc-100 shadow-inner">
            {roll.dice[1]}
          </div>

          {/* Modifier Breakdown */}
          {(roll.ratingModifier !== 0 || roll.situationalModifier !== 0) && (
            <div className="text-[11px] font-mono text-zinc-400 pl-1">
              {roll.ratingUsed && `+${roll.ratingUsed.substring(0, 3)}: `}
              <span className="text-amber-400">
                {roll.ratingModifier + roll.situationalModifier >= 0
                  ? `+${roll.ratingModifier + roll.situationalModifier}`
                  : `${roll.ratingModifier + roll.situationalModifier}`}
              </span>
            </div>
          )}
        </div>

        {/* Total Badge */}
        <div className="text-right">
          <div className="text-2xl font-black font-mono leading-none tracking-tight text-zinc-100">
            {roll.total}
          </div>
        </div>
      </div>

      {/* Outcome Banner */}
      <div
        className={`px-2 py-1 rounded font-bold text-center uppercase tracking-wider text-[11px] ${
          isAdvanced
            ? 'bg-amber-500 text-zinc-950'
            : isSuccess
            ? 'bg-emerald-600 text-zinc-950'
            : isPartial
            ? 'bg-amber-600 text-zinc-950'
            : 'bg-red-700 text-white'
        }`}
      >
        {roll.outcomeLabel}
      </div>

      {/* Narrative Explanation */}
      <p className="text-zinc-300 text-[11px] leading-relaxed select-text">{roll.outcomeText}</p>

      {/* Move questions prompt (e.g. Investigar um Mistério / Ler Situação) */}
      {matchedMove?.questions && (isSuccess || isPartial || isAdvanced) && (
        <div className="p-2 bg-zinc-950/70 rounded border border-zinc-800 space-y-1">
          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
            <HelpCircle className="w-3 h-3" /> Perguntas Disponíveis:
          </span>
          <ul className="list-disc list-inside text-[10px] text-zinc-400 space-y-0.5">
            {matchedMove.questions.map((q, i) => (
              <li key={i}>{q}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Quick Luck Spend Action (If Falha or Parcial) */}
      {(isFail || isPartial) && activeHunter && roll.hunterId === activeHunter.id && (
        <div className="pt-1 border-t border-zinc-800">
          <button
            onClick={onSpendLuck}
            className="w-full py-1 bg-amber-950/70 hover:bg-amber-900/80 text-amber-300 border border-amber-600/50 rounded text-[10px] font-bold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            Queimar 1 Ponto de Sorte (Torna o resultado 12!)
          </button>
        </div>
      )}
    </div>
  );
};
