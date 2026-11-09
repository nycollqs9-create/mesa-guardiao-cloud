import React, { useState } from 'react';
import { useVTT } from '../context/VTTContext';
import {
  Shield,
  PlusCircle,
  KeyRound,
  Users,
  Compass,
  ArrowRight,
  Archive,
  Trash2,
  Copy,
  Check,
  Edit3,
  LogOut,
  AlertTriangle,
  FolderArchive,
  Sparkles,
  Calendar,
  Camera,
  X,
} from 'lucide-react';
import { ImageUploadInput } from './ImageUploadInput';
import { Campaign } from '../types/motw';

export const LobbyView: React.FC = () => {
  const {
    user,
    updateUser,
    campaignsList,
    createCampaign,
    joinCampaign,
    deleteCampaign,
    leaveCampaign,
    toggleArchiveCampaign,
    updateCampaignById,
    isLoading,
    error,
  } = useVTT();

  const [activeTab, setActiveTab] = useState<'list' | 'create' | 'join'>('list');
  const [filterCategory, setFilterCategory] = useState<'minhas' | 'participo' | 'arquivadas' | 'todas'>('todas');
  const [userNameInput, setUserNameInput] = useState(user.name);
  const [isEditingUserAvatar, setIsEditingUserAvatar] = useState(false);

  // Create Campaign Form
  const [campName, setCampName] = useState('');
  const [campDesc, setCampDesc] = useState('');
  const [campCover, setCampCover] = useState('');

  // Join Campaign Form
  const [inviteInput, setInviteInput] = useState('');

  // Modals
  const [deleteModalCamp, setDeleteModalCamp] = useState<Campaign | null>(null);
  const [editModalCamp, setEditModalCamp] = useState<Campaign | null>(null);
  const [editCampName, setEditCampName] = useState('');
  const [editCampDesc, setEditCampDesc] = useState('');
  const [editCampCover, setEditCampCover] = useState('');
  const [deleteConfirmationText, setDeleteConfirmationText] = useState('');
  const [leaveModalCamp, setLeaveModalCamp] = useState<Campaign | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleUpdateName = (e: React.FormEvent) => {
    e.preventDefault();
    if (userNameInput.trim()) {
      updateUser({ name: userNameInput.trim() });
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!campName.trim()) return;
    try {
      await createCampaign(campName.trim(), campDesc.trim(), campCover.trim() || undefined);
    } catch (err) {
      console.error(err);
    }
  };

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteInput.trim()) return;
    try {
      await joinCampaign(inviteInput.trim());
    } catch (err) {
      console.error(err);
    }
  };

  const openEditCampaign = (campaign: Campaign) => {
    setEditModalCamp(campaign);
    setEditCampName(campaign.name);
    setEditCampDesc(campaign.description || '');
    setEditCampCover(campaign.coverImage || '');
  };

  const handleSaveCampaignEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editModalCamp || !editCampName.trim()) return;
    try {
      await updateCampaignById(editModalCamp.id, {
        name: editCampName.trim(),
        description: editCampDesc.trim(),
        coverImage: editCampCover.trim() || undefined,
      });
      setEditModalCamp(null);
    } catch (err) {
      console.error(err);
    }
  };

  const copyInviteCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Filter campaigns
  const filteredCampaigns = campaignsList.filter((camp) => {
    const isKeeper = camp.keeperId === user.id;
    const isParticipant = camp.participants.some((p) => p.userId === user.id);
    const isArchived = camp.status === 'arquivada';

    if (filterCategory === 'minhas') {
      return isKeeper && !isArchived;
    }
    if (filterCategory === 'participo') {
      return !isKeeper && isParticipant && !isArchived;
    }
    if (filterCategory === 'arquivadas') {
      return isArchived;
    }
    return !isArchived; // 'todas' shows active campaigns
  });

  const myCount = campaignsList.filter((c) => c.keeperId === user.id && c.status !== 'arquivada').length;
  const joinedCount = campaignsList.filter((c) => c.keeperId !== user.id && c.participants.some((p) => p.userId === user.id) && c.status !== 'arquivada').length;
  const archivedCount = campaignsList.filter((c) => c.status === 'arquivada').length;

  return (
    <div className="min-h-[100dvh] w-full bg-zinc-950 text-zinc-100 flex flex-col relative overflow-x-hidden overflow-y-auto overscroll-y-contain">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <img
          src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=80"
          alt="Paranormal Forest"
          className="w-full h-full object-cover opacity-20 filter blur-sm scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/85 to-zinc-950/95" />
      </div>

      {/* Header */}
      <header className="relative z-10 max-w-6xl mx-auto w-full px-4 pt-6 pb-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-zinc-800">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-10 h-10 rounded bg-gradient-to-br from-amber-600 to-red-950 border border-amber-500/50 flex items-center justify-center shadow-lg shadow-amber-950/40 shrink-0">
            <span className="text-amber-200 font-serif font-black text-lg">M</span>
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-serif font-black tracking-tight text-zinc-100 flex items-center gap-2">
              Mesa do Guardião
              <span className="text-[10px] font-sans font-bold bg-amber-950/80 text-amber-400 px-2 py-0.5 rounded border border-amber-600/40 uppercase tracking-widest">
                Monstro da Semana
              </span>
            </h1>
            <p className="text-xs text-zinc-400">
              Virtual Tabletop dedicado ao RPG Monstro da Semana (Edição Revisada brasileira)
            </p>
          </div>
        </div>

        {/* User Profile Quick Form */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <div className="relative group">
            <button
              type="button"
              onClick={() => setIsEditingUserAvatar(true)}
              className="relative w-8 h-8 rounded-full overflow-hidden border border-amber-500/50 hover:border-amber-400 shadow cursor-pointer transition flex items-center justify-center bg-zinc-900"
              title="Clique para alterar sua foto de perfil usando fotos salvas na sua galeria ou câmera"
            >
              <img
                src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                alt={user.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-amber-300">
                <Camera className="w-3.5 h-3.5" />
              </div>
            </button>
          </div>

          <form onSubmit={handleUpdateName} className="flex items-center gap-1.5 text-xs">
            <span className="text-zinc-500">Seu Nome:</span>
            <input
              type="text"
              value={userNameInput}
              onChange={(e) => setUserNameInput(e.target.value)}
              onBlur={() => userNameInput.trim() && updateUser({ name: userNameInput.trim() })}
              className="bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-1 text-xs text-zinc-200 w-32 sm:w-40 focus:outline-none focus:border-amber-500"
            />
          </form>
        </div>

        {/* User Avatar Upload Modal */}
        {isEditingUserAvatar && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-zinc-950 border border-amber-600/60 rounded-xl shadow-2xl p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <span className="font-bold text-zinc-100 text-sm">Foto de Perfil do Jogador</span>
                <button
                  type="button"
                  onClick={() => setIsEditingUserAvatar(false)}
                  className="text-zinc-400 hover:text-zinc-200 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <ImageUploadInput
                label="Selecione uma foto da sua Galeria ou tire uma nova"
                value={user.avatarUrl || ''}
                onChange={(newUrl) => {
                  updateUser({ avatarUrl: newUrl });
                  setIsEditingUserAvatar(false);
                }}
                aspectRatio="square"
              />

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditingUserAvatar(false)}
                  className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs rounded-lg font-medium"
                >
                  Concluir
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Card */}
      <main className="relative z-10 max-w-5xl mx-auto w-full px-4 py-4 sm:py-6 flex-1 flex flex-col justify-start sm:justify-center">
        <div className="bg-zinc-900/90 backdrop-blur-md border border-zinc-800 rounded-xl shadow-2xl overflow-hidden">
          {/* Main Mode Tabs */}
          <div className="flex border-b border-zinc-800 bg-zinc-950/50 text-xs font-bold overflow-x-auto no-scrollbar touch-pan-x shrink-0">
            <button
              onClick={() => setActiveTab('list')}
              className={`flex-none sm:flex-1 min-h-[44px] py-3 px-4 whitespace-nowrap text-center transition-colors flex items-center justify-center gap-2 border-b-2 ${
                activeTab === 'list'
                  ? 'border-amber-500 text-amber-300 bg-zinc-900'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Campanhas ({campaignsList.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('create')}
              className={`flex-none sm:flex-1 min-h-[44px] py-3 px-4 whitespace-nowrap text-center transition-colors flex items-center justify-center gap-2 border-b-2 ${
                activeTab === 'create'
                  ? 'border-amber-500 text-amber-300 bg-zinc-900'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>Criar Nova Campanha (Guardião)</span>
            </button>
            <button
              onClick={() => setActiveTab('join')}
              className={`flex-none sm:flex-1 min-h-[44px] py-3 px-4 whitespace-nowrap text-center transition-colors flex items-center justify-center gap-2 border-b-2 ${
                activeTab === 'join'
                  ? 'border-amber-500 text-amber-300 bg-zinc-900'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <KeyRound className="w-4 h-4" />
              <span>Entrar com Código</span>
            </button>
          </div>

          {/* Body Area */}
          <div className="p-4 md:p-6 text-xs">
            {error && (
              <div className="mb-4 p-3 bg-red-950/60 border border-red-700 rounded-lg text-red-200 font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* TAB 1: LISTA DE CAMPANHAS COM FILTROS DE CATEGORIA */}
            {activeTab === 'list' && (
              <div className="space-y-4">
                {/* Sub-category pills */}
                <div className="flex items-center gap-2 border-b border-zinc-800 pb-3 overflow-x-auto no-scrollbar touch-pan-x">
                  <button
                    onClick={() => setFilterCategory('todas')}
                    className={`whitespace-nowrap min-h-[40px] px-3.5 py-2 rounded-lg font-semibold text-xs transition ${
                      filterCategory === 'todas'
                        ? 'bg-amber-600 text-zinc-950 shadow'
                        : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700'
                    }`}
                  >
                    Todas as Ativas ({campaignsList.filter((c) => c.status !== 'arquivada').length})
                  </button>
                  <button
                    onClick={() => setFilterCategory('minhas')}
                    className={`whitespace-nowrap min-h-[40px] px-3.5 py-2 rounded-lg font-semibold text-xs transition flex items-center gap-1.5 ${
                      filterCategory === 'minhas'
                        ? 'bg-amber-600 text-zinc-950 shadow'
                        : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700'
                    }`}
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>Minhas Campanhas ({myCount})</span>
                  </button>
                  <button
                    onClick={() => setFilterCategory('participo')}
                    className={`whitespace-nowrap min-h-[40px] px-3.5 py-2 rounded-lg font-semibold text-xs transition flex items-center gap-1.5 ${
                      filterCategory === 'participo'
                        ? 'bg-amber-600 text-zinc-950 shadow'
                        : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>Participando ({joinedCount})</span>
                  </button>
                  <button
                    onClick={() => setFilterCategory('arquivadas')}
                    className={`whitespace-nowrap min-h-[40px] px-3.5 py-2 rounded-lg font-semibold text-xs transition flex items-center gap-1.5 ${
                      filterCategory === 'arquivadas'
                        ? 'bg-amber-600 text-zinc-950 shadow'
                        : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700'
                    }`}
                  >
                    <FolderArchive className="w-3.5 h-3.5" />
                    <span>Arquivadas ({archivedCount})</span>
                  </button>
                </div>

                {filteredCampaigns.length === 0 ? (
                  <div className="py-12 text-center text-zinc-500 space-y-2">
                    <p className="text-sm">Nenhuma campanha encontrada nesta categoria.</p>
                    <button
                      onClick={() => setActiveTab('create')}
                      className="text-xs text-amber-400 hover:underline font-semibold"
                    >
                      Deseja criar uma nova mesa como Guardião?
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredCampaigns.map((camp) => {
                      const isKeeper = camp.keeperId === user.id;
                      const charCount = Object.keys(camp.characters || {}).length;
                      const partCount = (camp.participants || []).length;
                      const isArchived = camp.status === 'arquivada';

                      return (
                        <div
                          key={camp.id}
                          className="bg-zinc-950 rounded-xl border border-zinc-800 hover:border-amber-600/50 transition-all overflow-hidden flex flex-col justify-between shadow-lg group"
                        >
                          {/* Card Cover (if available) */}
                          {camp.coverImage && (
                            <div className="h-28 w-full overflow-hidden relative border-b border-zinc-800/80">
                              <img
                                src={camp.coverImage}
                                alt={camp.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                onError={(e) => {
                                  (e.target as HTMLElement).style.display = 'none';
                                }}
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
                              <div className="absolute top-2 left-2 flex items-center gap-1.5">
                                <span
                                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                    isArchived
                                      ? 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                                      : 'bg-emerald-950/80 text-emerald-400 border border-emerald-600/40'
                                  }`}
                                >
                                  {isArchived ? 'Arquivada' : 'Ativa'}
                                </span>
                                {isKeeper && (
                                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950/80 text-amber-400 border border-amber-600/40 uppercase">
                                    Seu Papel: Guardião
                                  </span>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Card Content */}
                          <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                            <div className="space-y-1.5">
                              <div className="flex items-start justify-between gap-2">
                                <h3 className="font-bold text-zinc-100 text-sm group-hover:text-amber-300 transition-colors">
                                  {camp.name}
                                </h3>
                                <button
                                  type="button"
                                  onClick={() => copyInviteCode(camp.inviteCode)}
                                  title="Clique para copiar código de convite"
                                  className="font-mono text-[10px] text-amber-400 bg-amber-950/60 hover:bg-amber-900/60 px-2 py-0.5 rounded border border-amber-600/30 flex items-center gap-1 transition"
                                >
                                  {copiedCode === camp.inviteCode ? (
                                    <>
                                      <Check className="w-3 h-3 text-emerald-400" />
                                      <span>Copiado!</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-3 h-3" />
                                      <span>{camp.inviteCode}</span>
                                    </>
                                  )}
                                </button>
                              </div>
                              <p className="text-zinc-400 text-xs line-clamp-2 leading-relaxed">
                                {camp.description || 'Sem descrição cadastrada.'}
                              </p>
                            </div>

                            {/* Metadata Badges */}
                            <div className="flex items-center gap-3 text-[11px] text-zinc-400 pt-2 border-t border-zinc-900">
                              <span className="flex items-center gap-1">
                                <Shield className="w-3.5 h-3.5 text-amber-500" />
                                <strong>{camp.keeperName}</strong>
                              </span>
                              <span>&bull;</span>
                              <span className="flex items-center gap-1">
                                <Users className="w-3.5 h-3.5 text-zinc-400" />
                                {partCount} jogadores
                              </span>
                              <span>&bull;</span>
                              <span>{charCount} caçadores</span>
                            </div>

                            {/* Actions Toolbar */}
                            <div className="pt-3 border-t border-zinc-900 flex items-center justify-between gap-2">
                              {/* Keeper options */}
                              {isKeeper ? (
                                <div className="flex items-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => openEditCampaign(camp)}
                                    title="Editar nome, descrição e capa da campanha"
                                    aria-label={`Editar campanha ${camp.name}`}
                                    className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg hover:bg-amber-950/60 active:bg-amber-900/60 text-zinc-400 hover:text-amber-300 transition"
                                  >
                                    <Edit3 className="w-4 h-4" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => toggleArchiveCampaign(camp.id)}
                                    title={isArchived ? 'Reativar Campanha' : 'Arquivar Campanha'}
                                    className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg hover:bg-zinc-850 active:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition"
                                  >
                                    <Archive className="w-4 h-4" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setDeleteModalCamp(camp);
                                      setDeleteConfirmationText('');
                                    }}
                                    title="Excluir Campanha Definitivamente"
                                    className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg hover:bg-red-950 active:bg-red-900 text-zinc-500 hover:text-red-400 transition"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => setLeaveModalCamp(camp)}
                                  className="text-xs text-zinc-400 hover:text-red-400 flex items-center gap-1.5 min-h-[44px] px-3 rounded-lg hover:bg-zinc-900 active:bg-zinc-850 transition"
                                >
                                  <LogOut className="w-3.5 h-3.5" />
                                  <span>Sair</span>
                                </button>
                              )}

                              {/* Enter table button */}
                              <button
                                type="button"
                                onClick={() => joinCampaign(camp.id)}
                                disabled={isLoading}
                                className="px-4 py-2 min-h-[44px] bg-gradient-to-r from-red-700 to-amber-600 hover:from-red-600 hover:to-amber-500 text-white font-bold rounded-lg shadow-md flex items-center gap-2 active:scale-95 transition-all ml-auto text-xs"
                              >
                                <span>Entrar na Mesa</span>
                                <ArrowRight className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: CRIAR CAMPANHA (GUARDIÃO) */}
            {activeTab === 'create' && (
              <form onSubmit={handleCreate} className="space-y-4 max-w-xl mx-auto">
                <div className="p-3 bg-amber-950/30 rounded-lg border border-amber-600/40 text-amber-200 space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-xs">
                    <Shield className="w-4 h-4 text-amber-400" /> Você será o GUARDIÃO desta mesa
                  </div>
                  <p className="text-zinc-400 text-[11px] leading-relaxed">
                    Você terá controle exclusivo da Central do Guardião, mistérios, contagem regressiva, ameaças, pistas e cenas secretas.
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-zinc-300 uppercase text-[10px] tracking-wider">
                    Nome da Campanha *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Arquivos Ocultos de Paranapiacaba"
                    value={campName}
                    onChange={(e) => setCampName(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-zinc-300 uppercase text-[10px] tracking-wider">
                    Descrição / Sinopse Narrativa
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Descreva o local da cidade, o clima, os boatos e a premissa da investigação inicial..."
                    value={campDesc}
                    onChange={(e) => setCampDesc(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Cover Image Upload (Camera or File or URL) */}
                <ImageUploadInput
                  label="Imagem de Capa da Campanha"
                  value={campCover}
                  onChange={setCampCover}
                  placeholder="https://images.unsplash.com/..."
                  aspectRatio="landscape"
                />

                <button
                  type="submit"
                  disabled={isLoading || !campName.trim()}
                  className="w-full py-3 bg-gradient-to-r from-red-700 to-amber-600 hover:from-red-600 hover:to-amber-500 text-white font-bold rounded-lg shadow-lg uppercase tracking-wider text-xs active:scale-95 transition-all"
                >
                  {isLoading ? 'Iniciando Campanha...' : 'Iniciar Mesa como Guardião'}
                </button>
              </form>
            )}

            {/* TAB 3: ENTRAR COM CÓDIGO */}
            {activeTab === 'join' && (
              <form onSubmit={handleJoin} className="space-y-4 max-w-md mx-auto py-2">
                <div className="text-center space-y-1">
                  <div className="font-bold text-sm text-zinc-100">Código de Convite da Mesa</div>
                  <p className="text-zinc-400 text-xs">
                    Insira o código fornecido pelo seu Guardião (ex: <code className="text-amber-400">MOTW-NEBLINA</code>) para entrar na mesa como Caçador.
                  </p>
                </div>

                <div className="space-y-2">
                  <input
                    type="text"
                    required
                    placeholder="Ex: MOTW-NEBLINA"
                    value={inviteInput}
                    onChange={(e) => setInviteInput(e.target.value.toUpperCase())}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2.5 text-center font-mono font-bold tracking-widest text-sm text-amber-400 uppercase focus:outline-none focus:border-amber-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !inviteInput.trim()}
                  className="w-full py-2.5 bg-gradient-to-r from-amber-600 to-red-700 hover:from-amber-500 hover:to-red-600 text-white font-bold rounded-lg shadow-lg uppercase tracking-wider text-xs active:scale-95 transition-all"
                >
                  {isLoading ? 'Conectando...' : 'Entrar na Mesa'}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      {/* Edit Campaign Modal (Keeper Only) */}
      {editModalCamp && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-end sm:items-center justify-center p-3 overflow-y-auto">
          <form
            onSubmit={handleSaveCampaignEdit}
            className="bg-zinc-950 border border-amber-600/60 rounded-xl max-w-lg w-full p-4 sm:p-5 space-y-4 shadow-2xl text-xs max-h-[92dvh] overflow-y-auto custom-scrollbar"
          >
            <div className="flex items-center justify-between gap-3 border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                <Edit3 className="w-4 h-4" />
                <span>Editar campanha</span>
              </div>
              <button
                type="button"
                onClick={() => setEditModalCamp(null)}
                aria-label="Fechar edição da campanha"
                className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="edit-campaign-name" className="font-bold text-zinc-300 uppercase text-[10px] tracking-wider">Nome da campanha *</label>
              <input
                id="edit-campaign-name"
                type="text"
                required
                maxLength={80}
                value={editCampName}
                onChange={(e) => setEditCampName(e.target.value)}
                className="w-full min-h-[44px] bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 text-sm focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="edit-campaign-description" className="font-bold text-zinc-300 uppercase text-[10px] tracking-wider">Descrição / sinopse</label>
              <textarea
                id="edit-campaign-description"
                rows={4}
                maxLength={1200}
                value={editCampDesc}
                onChange={(e) => setEditCampDesc(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 text-sm focus:outline-none focus:border-amber-500"
              />
            </div>

            <ImageUploadInput
              label="Imagem de capa da campanha"
              value={editCampCover}
              onChange={setEditCampCover}
              placeholder="https://..."
              aspectRatio="landscape"
            />

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-2 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setEditModalCamp(null)}
                className="min-h-[44px] px-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg font-semibold"
              >Cancelar</button>
              <button
                type="submit"
                disabled={isLoading || !editCampName.trim()}
                className="min-h-[44px] px-4 bg-gradient-to-r from-red-700 to-amber-600 hover:from-red-600 hover:to-amber-500 disabled:opacity-50 text-white rounded-lg font-bold"
              >{isLoading ? 'Salvando...' : 'Salvar alterações'}</button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Campaign Confirmation Modal (Keeper Only) */}
      {deleteModalCamp && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-red-700 rounded-xl max-w-md w-full p-5 space-y-4 shadow-2xl text-xs">
            <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <span>Excluir Campanha Definitivamente</span>
            </div>

            <p className="text-zinc-300 leading-relaxed">
              Você está prestes a excluir permanentemente a campanha{' '}
              <strong className="text-white">"{deleteModalCamp.name}"</strong>.
            </p>

            <div className="p-3 bg-red-950/40 border border-red-900 rounded-lg text-red-300 space-y-1">
              <p className="font-semibold">Esta ação é irreversível e excluirá:</p>
              <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-red-200">
                <li>Todas as fichas de Caçadores desta mesa</li>
                <li>Histórico de mensagens e rolagens</li>
                <li>Mistérios, contagens regressivas e pistas</li>
                <li>Cenas preparadas e anotações do Guardião</li>
              </ul>
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-400 font-medium block">
                Para confirmar, digite exatamente o nome da campanha:{' '}
                <span className="text-amber-400 font-mono font-bold select-all">
                  {deleteModalCamp.name}
                </span>
              </label>
              <input
                type="text"
                value={deleteConfirmationText}
                onChange={(e) => setDeleteConfirmationText(e.target.value)}
                placeholder={deleteModalCamp.name}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 text-xs focus:outline-none focus:border-red-500 font-mono"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setDeleteModalCamp(null)}
                className="px-3.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg font-semibold"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={
                  deleteConfirmationText.trim().toLowerCase() !==
                  deleteModalCamp.name.trim().toLowerCase()
                }
                onClick={async () => {
                  if (deleteModalCamp) {
                    await deleteCampaign(deleteModalCamp.id, deleteConfirmationText);
                    setDeleteModalCamp(null);
                  }
                }}
                className="px-3.5 py-1.5 bg-red-700 hover:bg-red-600 disabled:opacity-40 disabled:hover:bg-red-700 text-white rounded-lg font-bold flex items-center gap-1.5 shadow"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Confirmar Exclusão</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Leave Campaign Confirmation Modal (Player Only) */}
      {leaveModalCamp && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl max-w-sm w-full p-5 space-y-4 shadow-2xl text-xs">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <LogOut className="w-5 h-5 text-amber-500" />
              <span>Sair da Campanha</span>
            </div>

            <p className="text-zinc-300 leading-relaxed">
              Deseja sair da mesa <strong className="text-white">"{leaveModalCamp.name}"</strong>?
              Sua ficha de caçador permanecerá salva na campanha caso decida retornar usando o código de convite.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setLeaveModalCamp(null)}
                className="px-3.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg font-semibold"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={async () => {
                  if (leaveModalCamp) {
                    await leaveCampaign(leaveModalCamp.id);
                    setLeaveModalCamp(null);
                  }
                }}
                className="px-3.5 py-1.5 bg-red-700 hover:bg-red-600 text-white rounded-lg font-bold flex items-center gap-1.5 shadow"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sair da Mesa</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer reference notice */}
      <footer className="relative z-10 mt-auto text-center py-4 text-[11px] text-zinc-600 border-t border-zinc-800">
        Monstro da Semana &bull; Baseado na obra de Michael Sands &bull; Edição brasileira traduzida por Luiz Borges
      </footer>
    </div>
  );
};
