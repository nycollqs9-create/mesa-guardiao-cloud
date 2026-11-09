import React, { useState } from 'react';
import { useVTT } from '../context/VTTContext';
import { X, Check, ChevronRight, ChevronLeft, Sparkles, Shield, User, Wand2, Swords } from 'lucide-react';
import { PlaybookId, Ratings, HunterCharacter, WeaponOption } from '../types/motw';
import { MOTW_PLAYBOOKS, PlaybookDefinition } from '../data/motwPlaybooks';
import { ImageUploadInput } from './ImageUploadInput';

interface CharacterCreatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CharacterCreatorModal: React.FC<CharacterCreatorModalProps> = ({ isOpen, onClose }) => {
  const { currentCampaign, user, saveHunterCharacter } = useVTT();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedPlaybookId, setSelectedPlaybookId] = useState<PlaybookId>('escolhido');
  const [selectedRatingIndex, setSelectedRatingIndex] = useState<number>(0);
  const [name, setName] = useState('');
  const [pronouns, setPronouns] = useState('Ele/Dele');
  const [selectedEye, setSelectedEye] = useState('');
  const [selectedFace, setSelectedFace] = useState('');
  const [selectedClothes, setSelectedClothes] = useState('');
  const [customLook, setCustomLook] = useState('');
  const [portraitUrl, setPortraitUrl] = useState('');
  const [selectedMoveIds, setSelectedMoveIds] = useState<string[]>([]);
  const [specialData, setSpecialData] = useState<Record<string, any>>({});
  const [selectedWeapons, setSelectedWeapons] = useState<WeaponOption[]>([]);
  const [gearNotes, setGearNotes] = useState('');
  const [historyNotes, setHistoryNotes] = useState('');

  if (!isOpen || !currentCampaign) return null;

  const playbookDef: PlaybookDefinition = MOTW_PLAYBOOKS[selectedPlaybookId];

  // Handle Playbook Selection & Initialize options
  const handleSelectPlaybook = (id: PlaybookId) => {
    setSelectedPlaybookId(id);
    setSelectedRatingIndex(0);
    const pb = MOTW_PLAYBOOKS[id];
    setSelectedEye(pb.looks.eyes[0] || '');
    setSelectedFace(pb.looks.faces[0] || '');
    setSelectedClothes(pb.looks.clothes[0] || '');
    // Select default moves
    const defaultMoves = pb.availableMoves.filter((m) => m.isDefault).map((m) => m.id);
    setSelectedMoveIds(defaultMoves);
    setSelectedWeapons(pb.defaultWeapons || []);
    setSpecialData({});
  };

  const toggleMove = (moveId: string) => {
    if (selectedMoveIds.includes(moveId)) {
      setSelectedMoveIds(selectedMoveIds.filter((id) => id !== moveId));
    } else {
      if (selectedMoveIds.length < (playbookDef.startingMovesCount || 3)) {
        setSelectedMoveIds([...selectedMoveIds, moveId]);
      }
    }
  };

  const handleFinish = async () => {
    if (!name.trim()) return;

    const chosenRatings = playbookDef.ratingsOptions[selectedRatingIndex].ratings;
    const finalLook = customLook.trim()
      ? customLook.trim()
      : `${selectedEye}, ${selectedFace}, ${selectedClothes}`;

    const newChar: HunterCharacter = {
      id: `char-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      userId: user.id,
      playerName: user.name,
      name: name.trim(),
      playbookId: selectedPlaybookId,
      playbookName: playbookDef.name,
      pronouns,
      look: finalLook,
      description: historyNotes,
      portraitUrl:
        portraitUrl.trim() ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      ratings: chosenRatings,
      harm: 0,
      isUnstable: false,
      armour: 0,
      luckCurrent: 0,
      luckMax: 7,
      experience: 0,
      levelUpsTaken: 0,
      improvementsChosen: [],
      advancedMovesUnlocked: [],
      selectedMoves: selectedMoveIds,
      specialFeatures: specialData,
      weapons: selectedWeapons,
      gearNotes,
      historyNotes,
      bonds: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await saveHunterCharacter(newChar);
    onClose();
  };

  const steps = [
    { num: 1, title: 'Cartilha' },
    { num: 2, title: 'Atributos' },
    { num: 3, title: 'Identidade' },
    { num: 4, title: 'Movimentos' },
    { num: 5, title: 'Especial' },
    { num: 6, title: 'Equipamento' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-3 select-none">
      <div className="w-full sm:max-w-3xl bg-zinc-950 border-t sm:border border-amber-600/60 rounded-t-2xl sm:rounded-xl shadow-2xl flex flex-col h-[95dvh] sm:h-auto sm:max-h-[90vh] overflow-hidden text-xs pb-safe">
        {/* Wizard Header */}
        <div className="p-3 sm:p-3.5 bg-gradient-to-r from-red-950/90 via-amber-950/50 to-zinc-950 border-b border-zinc-800 flex items-center justify-between shrink-0">
          <div>
            <span className="text-[10px] font-mono uppercase text-amber-500 font-bold tracking-wider">
              Criação de Caçador (Etapa {currentStep} de 6)
            </span>
            <h2 className="text-sm sm:text-base font-serif font-black text-zinc-100">
              {steps[currentStep - 1].title} — {playbookDef.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-200 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg hover:bg-zinc-900 active:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator Bar */}
        <div className="flex border-b border-zinc-850 bg-zinc-900/60 px-2 sm:px-3 py-2 gap-1 overflow-x-auto no-scrollbar touch-pan-x shrink-0">
          {steps.map((st) => (
            <div
              key={st.num}
              onClick={() => st.num < currentStep && setCurrentStep(st.num)}
              className={`flex-none sm:flex-1 min-w-[76px] sm:min-w-[70px] min-h-[38px] flex items-center justify-center text-center px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                st.num < currentStep ? 'cursor-pointer' : ''
              } ${
                st.num === currentStep
                  ? 'bg-amber-600 text-zinc-950'
                  : st.num < currentStep
                  ? 'bg-zinc-800 text-emerald-400 hover:bg-zinc-750'
                  : 'bg-zinc-950/60 text-zinc-500'
              }`}
            >
              {st.num}. {st.title}
            </div>
          ))}
        </div>

        {/* Step Content Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {/* STEP 1: ESCOLHA DA CARTILHA */}
          {currentStep === 1 && (
            <div className="space-y-3">
              <p className="text-zinc-300 text-xs">
                Escolha o arquétipo do seu Caçador entre as 13 cartilhas da Edição Revisada brasileira:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                {Object.values(MOTW_PLAYBOOKS).map((pb) => {
                  const isSelected = selectedPlaybookId === pb.id;
                  return (
                    <div
                      key={pb.id}
                      onClick={() => handleSelectPlaybook(pb.id)}
                      className={`p-3 rounded-lg border text-left cursor-pointer transition-all space-y-1.5 ${
                        isSelected
                          ? 'bg-amber-950/70 border-amber-500 shadow-lg ring-1 ring-amber-500/50'
                          : 'bg-zinc-900/70 border-zinc-800 hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-zinc-100 text-xs">{pb.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
                      </div>
                      <div className="text-[10px] font-medium text-amber-400/90 leading-tight">
                        {pb.subtitle}
                      </div>
                      <p className="text-zinc-400 text-[10px] line-clamp-2">{pb.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: CLASSIFICAÇÕES / ATRIBUTOS */}
          {currentStep === 2 && (
            <div className="space-y-3">
              <p className="text-zinc-300 text-xs">
                Selecione uma das combinações de Classificações para <strong>{playbookDef.name}</strong>:
              </p>
              <div className="space-y-2">
                {playbookDef.ratingsOptions.map((opt, idx) => {
                  const isSelected = selectedRatingIndex === idx;
                  return (
                    <div
                      key={idx}
                      onClick={() => setSelectedRatingIndex(idx)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-amber-950/60 border-amber-500 ring-1 ring-amber-500/50 shadow-md'
                          : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-zinc-200">{opt.label}</span>
                        {isSelected && <Check className="w-4 h-4 text-amber-400" />}
                      </div>
                      <div className="grid grid-cols-5 gap-2 font-mono text-center text-xs">
                        {Object.entries(opt.ratings).map(([stat, val]) => (
                          <div key={stat} className="bg-zinc-950/80 p-1.5 rounded border border-zinc-800">
                            <div className="text-[9px] text-zinc-400">{stat}</div>
                            <div
                              className={`font-black ${
                                (val as number) > 0
                                  ? 'text-amber-400'
                                  : (val as number) < 0
                                  ? 'text-red-400'
                                  : 'text-zinc-300'
                              }`}
                            >
                              {(val as number) >= 0 ? `+${val}` : val}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: IDENTIDADE & APARÊNCIA */}
          {currentStep === 3 && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-zinc-300">Nome do Caçador *</label>
                  <input
                    type="text"
                    placeholder="Ex: Sam Winchester, Buffy, John..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-1.5 text-zinc-100"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-zinc-300">Pronomes</label>
                  <input
                    type="text"
                    value={pronouns}
                    onChange={(e) => setPronouns(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-1.5 text-zinc-100"
                  />
                </div>
              </div>

              {/* Looks selections */}
              <div className="space-y-2 pt-2 border-t border-zinc-850">
                <label className="font-bold text-amber-400 uppercase text-[10px]">
                  Aparência Típica da Cartilha
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="space-y-1">
                    <span className="text-zinc-400 text-[10px]">Olhos:</span>
                    <select
                      value={selectedEye}
                      onChange={(e) => setSelectedEye(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded p-1.5 text-zinc-200"
                    >
                      {playbookDef.looks.eyes.map((ey) => (
                        <option key={ey} value={ey}>
                          {ey}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <span className="text-zinc-400 text-[10px]">Rosto:</span>
                    <select
                      value={selectedFace}
                      onChange={(e) => setSelectedFace(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded p-1.5 text-zinc-200"
                    >
                      {playbookDef.looks.faces.map((fc) => (
                        <option key={fc} value={fc}>
                          {fc}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <span className="text-zinc-400 text-[10px]">Roupas:</span>
                    <select
                      value={selectedClothes}
                      onChange={(e) => setSelectedClothes(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded p-1.5 text-zinc-200"
                    >
                      {playbookDef.looks.clothes.map((cl) => (
                        <option key={cl} value={cl}>
                          {cl}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1 pt-1">
                  <span className="text-zinc-400 text-[10px]">Ou descreva a aparência livremente:</span>
                  <input
                    type="text"
                    placeholder="Ex: Tatuagens no braço esquerdo, cicatriz no queixo, postura militar..."
                    value={customLook}
                    onChange={(e) => setCustomLook(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-1.5 text-zinc-100"
                  />
                </div>

                <div className="pt-2 border-t border-zinc-800">
                  <ImageUploadInput
                    label="Foto / Retrato do Caçador (Galeria, Câmera ou Link)"
                    value={portraitUrl}
                    onChange={setPortraitUrl}
                    placeholder="https://..."
                    aspectRatio="square"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: MOVIMENTOS DA CARTILHA */}
          {currentStep === 4 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-zinc-300 text-xs">
                  Escolha {playbookDef.startingMovesCount} movimentos da cartilha:
                </p>
                <span className="font-mono text-amber-400 font-bold">
                  {selectedMoveIds.length} / {playbookDef.startingMovesCount} escolhidos
                </span>
              </div>

              <div className="space-y-2">
                {playbookDef.availableMoves.map((m) => {
                  const isChecked = selectedMoveIds.includes(m.id);
                  return (
                    <div
                      key={m.id}
                      onClick={() => toggleMove(m.id)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all space-y-1 ${
                        isChecked
                          ? 'bg-amber-950/60 border-amber-500 ring-1 ring-amber-500/50 shadow-md'
                          : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-zinc-100">{m.name}</span>
                        {m.rating && (
                          <span className="font-mono text-[10px] text-amber-400 bg-amber-950/50 px-1 rounded border border-amber-600/30">
                            +{m.rating}
                          </span>
                        )}
                      </div>
                      <p className="text-zinc-400 text-[11px] leading-relaxed">{m.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 5: RECURSO ESPECIAL DA CARTILHA */}
          {currentStep === 5 && (
            <div className="space-y-3">
              <div className="p-3 bg-zinc-900 rounded-lg border border-amber-600/50 space-y-2">
                <span className="font-bold text-amber-400 uppercase text-[11px] flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> {playbookDef.specialFeature.title}
                </span>
                <p className="text-zinc-300 text-xs">{playbookDef.specialFeature.description}</p>
                <textarea
                  placeholder="Preencha os detalhes da sua Sina, Seita, Refúgio ou poderes especiais..."
                  rows={4}
                  value={specialData.notes || ''}
                  onChange={(e) => setSpecialData({ ...specialData, notes: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded p-2 text-zinc-100 text-xs"
                />
              </div>
            </div>
          )}

          {/* STEP 6: ARMAS & EQUIPAMENTOS */}
          {currentStep === 6 && (
            <div className="space-y-3">
              <div className="space-y-1">
                <span className="font-bold text-zinc-300 uppercase text-[10px]">Armas Iniciais Sugeridas:</span>
                <div className="space-y-1.5">
                  {selectedWeapons.map((w, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 bg-zinc-900 rounded border border-zinc-800 flex items-center justify-between"
                    >
                      <div>
                        <span className="font-bold text-zinc-200">{w.name}</span>
                        <div className="text-[10px] text-zinc-400 font-mono">
                          Tags: {w.tags.join(', ')}
                        </div>
                      </div>
                      <span className="font-mono font-bold text-red-400 bg-red-950/60 px-1.5 py-0.5 rounded border border-red-800/50">
                        {w.harm}-dano
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-1 pt-2">
                <label className="font-bold text-zinc-300">Outros Itens e Equipamentos</label>
                <textarea
                  placeholder="Ex: Lanterna, fita adesiva, sal grosso, garrafa de uísque, celular pré-pago..."
                  rows={3}
                  value={gearNotes}
                  onChange={(e) => setGearNotes(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded p-2 text-zinc-100"
                />
              </div>
            </div>
          )}
        </div>

        {/* Wizard Footer Controls */}
        <div className="p-3 bg-zinc-950 border-t border-zinc-800 flex items-center justify-between shrink-0 gap-2">
          {currentStep > 1 ? (
            <button
              onClick={() => setCurrentStep(currentStep - 1)}
              className="px-3.5 py-2 min-h-[44px] bg-zinc-850 hover:bg-zinc-800 text-zinc-300 rounded-lg font-semibold text-xs flex items-center gap-1 active:scale-95 transition"
            >
              <ChevronLeft className="w-4 h-4" /> Anterior
            </button>
          ) : (
            <div />
          )}

          {currentStep < 6 ? (
            <button
              onClick={() => setCurrentStep(currentStep + 1)}
              className="px-5 py-2 min-h-[44px] bg-amber-600 hover:bg-amber-500 text-zinc-950 rounded-lg font-bold text-xs flex items-center gap-1.5 shadow active:scale-95 transition"
            >
              Próximo <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              disabled={!name.trim()}
              className={`px-5 py-2.5 min-h-[48px] rounded-lg font-black text-xs shadow-lg uppercase tracking-wider flex items-center gap-2 transition ${
                name.trim()
                  ? 'bg-gradient-to-r from-emerald-600 to-amber-600 hover:from-emerald-500 hover:to-amber-500 text-zinc-950 active:scale-95'
                  : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
              }`}
            >
              <Check className="w-4 h-4" /> Concluir e Entrar na Mesa!
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
