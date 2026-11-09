import React, { useState } from 'react';
import { VTTProvider, useVTT } from './context/VTTContext';
import { LobbyView } from './components/LobbyView';
import { HeaderNav } from './components/HeaderNav';
import { SidebarLeft } from './components/SidebarLeft';
import { CenterStage } from './components/CenterStage';
import { SidebarRight } from './components/SidebarRight';
import { RollModal } from './components/RollModal';
import { CharacterCreatorModal } from './components/CharacterCreatorModal';
import { CharacterSheetModal } from './components/CharacterSheetModal';
import { KeeperCentralModal } from './components/KeeperCentralModal';
import { PlayerDeskModal } from './components/PlayerDeskModal';
import { RatingName } from './types/motw';
import { MOTW_BASIC_MOVES } from './data/motwBasicMoves';
import { Film, Compass, Dice5, MessageSquare, Shield, BookOpen } from 'lucide-react';

function VTTWorkspace() {
  const { currentCampaign, activeHunter, currentRole } = useVTT();

  // Navigation & Modal states
  const [activeLeftTab, setActiveLeftTab] = useState<string>('cenas');
  const [mobileTab, setMobileTab] = useState<'cena' | 'painel' | 'chat'>('cena');

  const [isRollModalOpen, setIsRollModalOpen] = useState(false);
  const [selectedRollMoveId, setSelectedRollMoveId] = useState<string>('investigar_um_misterio');
  const [selectedRollRating, setSelectedRollRating] = useState<RatingName | undefined>(undefined);

  const [isCreatorOpen, setIsCreatorOpen] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [sheetHunterId, setSheetHunterId] = useState<string | null>(null);

  const [isKeeperCentralOpen, setIsKeeperCentralOpen] = useState(false);
  const [isPlayerDeskOpen, setIsPlayerDeskOpen] = useState(false);

  if (!currentCampaign) {
    return <LobbyView />;
  }

  const isKeeper = currentRole === 'guardiao';

  const handleOpenDiceRoller = () => {
    setSelectedRollMoveId('investigar_um_misterio');
    setSelectedRollRating(undefined);
    setIsRollModalOpen(true);
  };

  const handleTriggerMoveFromCenter = (moveId: string) => {
    setSelectedRollMoveId(moveId);
    setSelectedRollRating(undefined);
    setIsRollModalOpen(true);
  };

  const handleOpenSheetForHunter = (hunterId: string) => {
    setSheetHunterId(hunterId);
    setIsSheetOpen(true);
  };

  const handleOpenMySheet = () => {
    if (activeHunter) {
      setSheetHunterId(activeHunter.id);
      setIsSheetOpen(true);
    } else {
      setIsCreatorOpen(true);
    }
  };

  const handleRollFromSheet = (rating: RatingName, moveName: string) => {
    const normalizedMoveName = moveName.replace(/^Teste de\s+/i, '').trim().toLocaleLowerCase('pt-BR');
    const matchingMove = MOTW_BASIC_MOVES.find(
      (move) => move.name.toLocaleLowerCase('pt-BR') === normalizedMoveName
    );

    // Never leave a previous move selected when the roll starts from a character sheet.
    setSelectedRollMoveId(matchingMove?.id || 'investigar_um_misterio');
    setSelectedRollRating(rating);
    setIsRollModalOpen(true);
  };

  return (
    <div className="flex flex-col h-[100dvh] w-full overflow-x-hidden overflow-y-hidden bg-zinc-950 font-sans text-zinc-100 pb-[calc(4rem+env(safe-area-inset-bottom,0px))] md:pb-0">
      {/* Top Header Toolbar */}
      <HeaderNav
        onOpenDiceRoller={handleOpenDiceRoller}
        onOpenCharacterSheet={handleOpenMySheet}
        onOpenCharacterCreator={() => setIsCreatorOpen(true)}
        onOpenKeeperCentral={() => setIsKeeperCentralOpen(true)}
        onOpenPlayerDesk={() => setIsPlayerDeskOpen(true)}
        activeLeftTab={activeLeftTab}
        setActiveLeftTab={setActiveLeftTab}
      />

      {/* Main VTT Area (Responsive: 3 columns on desktop, single column on mobile) */}
      <div className="flex flex-1 min-h-0 overflow-hidden relative w-full">
        {/* Left Drawer (Scenes, Hunters, Mystery, Threats, Diary, Rules) */}
        <div
          className={`h-full ${
            mobileTab === 'painel' ? 'flex w-full absolute inset-0 z-10 bg-zinc-950' : 'hidden md:flex'
          }`}
        >
          <SidebarLeft
            activeTab={activeLeftTab}
            setActiveTab={setActiveLeftTab}
            onOpenCharacterSheetFor={handleOpenSheetForHunter}
            onOpenCharacterCreator={() => setIsCreatorOpen(true)}
            onSelectMoveToRoll={(moveId) => {
              setSelectedRollMoveId(moveId);
              setIsRollModalOpen(true);
            }}
            onCloseMobile={() => setMobileTab('cena')}
          />
        </div>

        {/* Center Narrative Stage */}
        <div
          className={`h-full flex-1 flex flex-col ${
            mobileTab === 'cena' ? 'flex w-full' : 'hidden md:flex'
          }`}
        >
          <CenterStage
            onTriggerMove={handleTriggerMoveFromCenter}
            onOpenMysteryTab={() => {
              setActiveLeftTab('misterio');
              setMobileTab('painel');
            }}
          />
        </div>

        {/* Right Dock (Live Chat & Server 2d6 Dice Results) */}
        <div
          className={`h-full ${
            mobileTab === 'chat' ? 'flex w-full absolute inset-0 z-10 bg-zinc-950' : 'hidden md:flex'
          }`}
        >
          <SidebarRight
            onOpenDiceRoller={handleOpenDiceRoller}
            onCloseMobile={() => setMobileTab('cena')}
          />
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar (Phones & Small Tablets) */}
      <nav
        aria-label="Navegação Principal Mobile"
        className="fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/98 backdrop-blur-md border-t border-zinc-800 md:hidden flex justify-around items-center h-[calc(4rem+env(safe-area-inset-bottom,0px))] px-1 pb-[env(safe-area-inset-bottom,0px)] shadow-2xl"
      >
        <button
          type="button"
          onClick={() => setMobileTab('cena')}
          className={`flex flex-col items-center justify-center flex-1 py-1 min-h-[44px] transition ${
            mobileTab === 'cena' ? 'text-amber-400 font-bold' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Film className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Cena</span>
        </button>

        <button
          type="button"
          onClick={() => setMobileTab('painel')}
          className={`flex flex-col items-center justify-center flex-1 py-1 min-h-[44px] transition ${
            mobileTab === 'painel' ? 'text-amber-400 font-bold' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Painel</span>
        </button>

        {/* Center Floating Action Button: Dice Roller */}
        <button
          type="button"
          onClick={handleOpenDiceRoller}
          className="flex flex-col items-center justify-center -mt-6 w-13 h-13 min-w-[48px] min-h-[48px] rounded-full bg-gradient-to-br from-red-600 to-amber-600 text-white shadow-xl border-2 border-zinc-900 active:scale-95 transition"
          title="Rolar Dados 2d6"
        >
          <Dice5 className="w-6 h-6" />
        </button>

        <button
          type="button"
          onClick={() => setMobileTab('chat')}
          className={`flex flex-col items-center justify-center flex-1 py-1 min-h-[44px] transition ${
            mobileTab === 'chat' ? 'text-amber-400 font-bold' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <MessageSquare className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Chat</span>
        </button>

        {isKeeper ? (
          <button
            type="button"
            onClick={() => setIsKeeperCentralOpen(true)}
            className="flex flex-col items-center justify-center flex-1 py-1 min-h-[44px] text-amber-500 font-semibold"
          >
            <Shield className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Central</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setIsPlayerDeskOpen(true)}
            className="flex flex-col items-center justify-center flex-1 py-1 min-h-[44px] text-amber-400 font-semibold"
          >
            <BookOpen className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Caçador</span>
          </button>
        )}
      </nav>

      {/* Modals */}
      <RollModal
        isOpen={isRollModalOpen}
        onClose={() => setIsRollModalOpen(false)}
        initialMoveId={selectedRollMoveId}
        initialRating={selectedRollRating}
      />

      <CharacterCreatorModal
        isOpen={isCreatorOpen}
        onClose={() => setIsCreatorOpen(false)}
      />

      <CharacterSheetModal
        hunterId={sheetHunterId || activeHunter?.id || null}
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        onTriggerRoll={handleRollFromSheet}
      />

      <KeeperCentralModal
        isOpen={isKeeperCentralOpen}
        onClose={() => setIsKeeperCentralOpen(false)}
      />

      <PlayerDeskModal
        isOpen={isPlayerDeskOpen}
        onClose={() => setIsPlayerDeskOpen(false)}
        onTriggerRoll={handleRollFromSheet}
      />
    </div>
  );
}

export default function App() {
  return (
    <VTTProvider>
      <VTTWorkspace />
    </VTTProvider>
  );
}
