import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Campaign,
  HunterCharacter,
  ChatMessage,
  DiceRoll,
  Mystery,
  Scene,
  DiaryEntry,
  UserProfile,
  UserRole,
  VisibilityMode,
  RatingName,
} from '../types/motw';

interface VTTContextType {
  user: UserProfile;
  updateUser: (profile: Partial<UserProfile>) => void;
  campaignsList: Campaign[];
  refreshCampaignsList: () => Promise<void>;
  currentCampaign: Campaign | null;
  currentRole: UserRole | null;
  activeHunter: HunterCharacter | null;
  chatMessages: ChatMessage[];
  latestRoll: DiceRoll | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  createCampaign: (name: string, description: string, coverImage?: string) => Promise<Campaign>;
  joinCampaign: (inviteCodeOrId: string) => Promise<Campaign>;
  deleteCampaign: (campaignId: string, confirmationName: string) => Promise<void>;
  leaveCampaign: (campaignId: string) => Promise<void>;
  toggleArchiveCampaign: (campaignId: string) => Promise<void>;
  updateCampaignDetails: (updates: Partial<Campaign>) => Promise<void>;
  updateCampaignById: (campaignId: string, updates: Partial<Campaign>) => Promise<void>;
  leaveCurrentCampaign: () => void;
  selectActiveHunter: (hunterId: string) => void;
  saveHunterCharacter: (character: HunterCharacter) => Promise<void>;
  deleteHunterCharacter: (characterId: string) => Promise<void>;
  rollDice: (params: {
    moveName: string;
    ratingUsed?: RatingName;
    ratingModifier?: number;
    situationalModifier?: number;
    hasAdvanced?: boolean;
    visibility?: VisibilityMode;
    actionDescription?: string;
  }) => Promise<DiceRoll>;
  sendChatMessage: (content: string, type?: ChatMessage['type'], visibility?: VisibilityMode) => Promise<void>;
  updateHarm: (charId: string, harmDelta: number, armour?: number, isHeal?: boolean) => Promise<void>;
  spendLuck: (charId: string) => Promise<void>;
  spendLuckAdvanced: (params: { charId: string; option: 'roll_to_12' | 'cancel_harm'; rollId?: string }) => Promise<void>;
  updateExp: (charId: string, delta: number) => Promise<void>;
  manageExperience: (params: { hunterId?: string; allHunters?: boolean; delta: number; reason: string }) => Promise<void>;
  applyLevelUp: (charId: string, improvement: string, ratingToBoost?: RatingName) => Promise<void>;
  advanceCountdown: () => Promise<void>;
  revertCountdown: () => Promise<void>;
  updateMystery: (mystery: Mystery) => Promise<void>;
  updateScenes: (scenes: Scene[]) => Promise<void>;
  setActiveScene: (sceneId: string) => Promise<void>;
  updateDiary: (diary: DiaryEntry[]) => Promise<void>;
  awardEndOfSession: (yesCount: number) => Promise<void>;
  updateArcs: (arcs: any[]) => Promise<void>;
  updateClues: (clues: any[]) => Promise<void>;
  updateMysteryLibrary: (mysteries: Mystery[]) => Promise<void>;
  startMystery: (mysteryId: string) => Promise<void>;
  updateThreatBank: (threats: any[]) => Promise<void>;
  updateSessions: (sessions: any[]) => Promise<void>;
}

const VTTContext = createContext<VTTContextType | null>(null);

const STORAGE_USER_KEY = 'motw_vtt_user';
const STORAGE_CAMPAIGN_KEY = 'motw_vtt_current_campaign_id';

export const VTTProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // User profile
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_USER_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    const randomId = 'usr_' + Math.random().toString(36).substring(2, 9);
    return {
      id: randomId,
      name: 'Caçador Solitário',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    };
  });

  const [campaignsList, setCampaignsList] = useState<Campaign[]>([]);
  const [currentCampaign, setCurrentCampaign] = useState<Campaign | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [latestRoll, setLatestRoll] = useState<DiceRoll | null>(null);
  const [activeHunterId, setActiveHunterId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Sync user to storage
  const updateUser = useCallback((profile: Partial<UserProfile>) => {
    setUser((prev) => {
      const next = { ...prev, ...profile };
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  // Fetch campaign listing
  const refreshCampaignsList = useCallback(async () => {
    try {
      const res = await fetch('/api/campaigns');
      if (res.ok) {
        const data = await res.json();
        setCampaignsList(data);
      }
    } catch (err) {
      console.error('Error fetching campaigns list:', err);
    }
  }, []);

  // Compute current role in current campaign
  const currentRole: UserRole | null = currentCampaign
    ? currentCampaign.keeperId === user.id
      ? 'guardiao'
      : (currentCampaign.participants.find((p) => p.userId === user.id)?.role || 'cacador')
    : null;

  // Compute active hunter
  const activeHunter: HunterCharacter | null = currentCampaign
    ? activeHunterId && currentCampaign.characters[activeHunterId]
      ? currentCampaign.characters[activeHunterId]
      : Object.values(currentCampaign.characters).find((c) => c.userId === user.id) || null
    : null;

  // Load chat messages when campaign changes
  const loadChat = useCallback(async (campaignId: string) => {
    try {
      const res = await fetch(`/api/campaigns/${campaignId}/chat`);
      if (res.ok) {
        const data = await res.json();
        setChatMessages(data);
      }
    } catch (err) {
      console.error('Error loading chat:', err);
    }
  }, []);

  // Set up SSE listener for real-time campaign synchronization
  useEffect(() => {
    if (!currentCampaign?.id) return;

    loadChat(currentCampaign.id);

    const sse = new EventSource(`/api/campaigns/${currentCampaign.id}/events`);

    sse.addEventListener('campaign_updated', (e) => {
      try {
        const updatedCamp: Campaign = JSON.parse(e.data);
        setCurrentCampaign(updatedCamp);
      } catch (err) {
        console.error('Error parsing SSE campaign_updated:', err);
      }
    });

    sse.addEventListener('chat_message', (e) => {
      try {
        const newMsg: ChatMessage = JSON.parse(e.data);
        setChatMessages((prev) => {
          if (prev.some((m) => m.id === newMsg.id)) return prev;
          return [...prev, newMsg];
        });
      } catch (err) {
        console.error('Error parsing SSE chat_message:', err);
      }
    });

    sse.addEventListener('roll_executed', (e) => {
      try {
        const payload: { roll: DiceRoll; updatedCharacter?: HunterCharacter } = JSON.parse(e.data);
        setLatestRoll(payload.roll);
      } catch (err) {
        console.error('Error parsing SSE roll_executed:', err);
      }
    });

    sse.addEventListener('campaign_deleted', () => {
      leaveCurrentCampaign();
      refreshCampaignsList();
    });

    return () => {
      sse.close();
    };
  }, [currentCampaign?.id, loadChat]);

  // Load last active campaign on mount
  useEffect(() => {
    refreshCampaignsList();
    const savedId = localStorage.getItem(STORAGE_CAMPAIGN_KEY);
    if (savedId) {
      fetch(`/api/campaigns/${savedId}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data) setCurrentCampaign(data);
        })
        .catch(() => {});
    }
  }, [refreshCampaignsList]);

  // Actions
  const createCampaign = async (name: string, description: string, coverImage?: string): Promise<Campaign> => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description,
          coverImage,
          keeperId: user.id,
          keeperName: user.name,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Erro ao criar campanha');
      }

      const newCamp: Campaign = await res.json();
      setCurrentCampaign(newCamp);
      localStorage.setItem(STORAGE_CAMPAIGN_KEY, newCamp.id);
      await refreshCampaignsList();
      return newCamp;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const joinCampaign = async (inviteCodeOrId: string): Promise<Campaign> => {
    setIsLoading(true);
    setError(null);
    try {
      const isId = inviteCodeOrId.startsWith('camp-');
      const res = await fetch('/api/campaigns/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inviteCode: !isId ? inviteCodeOrId : undefined,
          campaignId: isId ? inviteCodeOrId : undefined,
          userId: user.id,
          userName: user.name,
          avatarUrl: user.avatarUrl,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Erro ao entrar na campanha');
      }

      const data = await res.json();
      setCurrentCampaign(data.campaign);
      localStorage.setItem(STORAGE_CAMPAIGN_KEY, data.campaign.id);
      await refreshCampaignsList();
      return data.campaign;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCampaign = async (campaignId: string, confirmationName: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/campaigns/${campaignId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keeperId: user.id, confirmationName }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Erro ao excluir campanha');
      }
      if (currentCampaign?.id === campaignId) {
        leaveCurrentCampaign();
      }
      await refreshCampaignsList();
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const leaveCampaign = async (campaignId: string) => {
    try {
      const res = await fetch(`/api/campaigns/${campaignId}/leave`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Erro ao sair da campanha');
      }
      if (currentCampaign?.id === campaignId) {
        leaveCurrentCampaign();
      }
      await refreshCampaignsList();
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const toggleArchiveCampaign = async (campaignId: string) => {
    try {
      const res = await fetch(`/api/campaigns/${campaignId}/archive`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keeperId: user.id }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Erro ao alternar arquivo da campanha');
      }
      await refreshCampaignsList();
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const updateCampaignById = async (campaignId: string, updates: Partial<Campaign>) => {
    try {
      const res = await fetch(`/api/campaigns/${campaignId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keeperId: user.id, ...updates }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Erro ao atualizar dados da campanha');
      }
      const updated = await res.json();
      if (currentCampaign?.id === campaignId) {
        setCurrentCampaign(updated);
      }
      await refreshCampaignsList();
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const updateCampaignDetails = async (updates: Partial<Campaign>) => {
    if (!currentCampaign) return;
    await updateCampaignById(currentCampaign.id, updates);
  };

  const leaveCurrentCampaign = () => {
    setCurrentCampaign(null);
    localStorage.removeItem(STORAGE_CAMPAIGN_KEY);
    setActiveHunterId(null);
  };

  const selectActiveHunter = (hunterId: string) => {
    setActiveHunterId(hunterId);
  };

  const saveHunterCharacter = async (character: HunterCharacter) => {
    if (!currentCampaign) return;
    try {
      const res = await fetch(`/api/campaigns/${currentCampaign.id}/characters`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(character),
      });
      if (res.ok) {
        setActiveHunterId(character.id);
      }
    } catch (err) {
      console.error('Failed to save character:', err);
    }
  };

  const deleteHunterCharacter = async (characterId: string) => {
    if (!currentCampaign) return;
    try {
      await fetch(`/api/campaigns/${currentCampaign.id}/characters/${characterId}`, {
        method: 'DELETE',
      });
      if (activeHunterId === characterId) {
        setActiveHunterId(null);
      }
    } catch (err) {
      console.error('Failed to delete character:', err);
    }
  };

  const rollDice = async (params: {
    moveName: string;
    ratingUsed?: RatingName;
    ratingModifier?: number;
    situationalModifier?: number;
    hasAdvanced?: boolean;
    visibility?: VisibilityMode;
    actionDescription?: string;
  }): Promise<DiceRoll> => {
    if (!currentCampaign) throw new Error('Nenhuma campanha ativa');

    const body = {
      userId: user.id,
      userName: user.name,
      hunterId: activeHunter?.id,
      hunterName: activeHunter?.name,
      moveName: params.moveName,
      ratingUsed: params.ratingUsed,
      ratingModifier: params.ratingModifier ?? 0,
      situationalModifier: params.situationalModifier ?? 0,
      hasAdvanced: params.hasAdvanced ?? false,
      visibility: params.visibility ?? 'publica',
      actionDescription: params.actionDescription,
    };

    const res = await fetch(`/api/campaigns/${currentCampaign.id}/rolls`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Falha ao rolar dados');
    }

    const data = await res.json();
    return data.roll;
  };

  const sendChatMessage = async (
    content: string,
    type: ChatMessage['type'] = 'chat',
    visibility: VisibilityMode = 'publica'
  ) => {
    if (!currentCampaign) return;
    await fetch(`/api/campaigns/${currentCampaign.id}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user.id,
        userName: user.name,
        characterName: activeHunter?.name,
        type,
        content,
        visibility,
      }),
    });
  };

  const updateHarm = async (charId: string, harmDelta: number, armour = 0, isHeal = false) => {
    if (!currentCampaign) return;
    await fetch(`/api/campaigns/${currentCampaign.id}/harm`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ charId, harmDelta, armour, isHeal }),
    });
  };

  const spendLuck = async (charId: string) => {
    if (!currentCampaign) return;
    const res = await fetch(`/api/campaigns/${currentCampaign.id}/luck`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ charId }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Erro ao gastar Sorte');
    }
  };

  const updateExp = async (charId: string, delta: number) => {
    if (!currentCampaign) return;
    await fetch(`/api/campaigns/${currentCampaign.id}/experience`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ charId, delta }),
    });
  };

  const advanceCountdown = async () => {
    if (!currentCampaign) return;
    await fetch(`/api/campaigns/${currentCampaign.id}/countdown/advance`, {
      method: 'POST',
    });
  };

  const updateMystery = async (mystery: Mystery) => {
    if (!currentCampaign) return;
    await fetch(`/api/campaigns/${currentCampaign.id}/mystery`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mystery),
    });
  };

  const updateScenes = async (scenes: Scene[]) => {
    if (!currentCampaign) return;
    await fetch(`/api/campaigns/${currentCampaign.id}/scenes`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(scenes),
    });
  };

  const setActiveScene = async (sceneId: string) => {
    if (!currentCampaign) return;
    const updated = currentCampaign.scenes.map((s) => ({
      ...s,
      isActive: s.id === sceneId,
    }));
    await updateScenes(updated);
  };

  const updateDiary = async (diary: DiaryEntry[]) => {
    if (!currentCampaign) return;
    await fetch(`/api/campaigns/${currentCampaign.id}/diary`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(diary),
    });
  };

  const awardEndOfSession = async (yesCount: number) => {
    if (!currentCampaign) return;
    await fetch(`/api/campaigns/${currentCampaign.id}/end-session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ count: yesCount }),
    });
  };

  const spendLuckAdvanced = async (params: { charId: string; option: 'roll_to_12' | 'cancel_harm'; rollId?: string }) => {
    if (!currentCampaign) return;
    const res = await fetch(`/api/campaigns/${currentCampaign.id}/luck/advanced`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Erro ao queimar Sorte');
    }
  };

  const manageExperience = async (params: { hunterId?: string; allHunters?: boolean; delta: number; reason: string }) => {
    if (!currentCampaign) return;
    const res = await fetch(`/api/campaigns/${currentCampaign.id}/experience/manage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...params,
        keeperId: user.id,
        keeperName: user.name,
      }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Erro ao alterar experiência');
    }
  };

  const applyLevelUp = async (charId: string, improvement: string, ratingToBoost?: RatingName) => {
    if (!currentCampaign) return;
    const res = await fetch(`/api/campaigns/${currentCampaign.id}/characters/${charId}/levelup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ improvement, ratingToBoost }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Erro ao aplicar melhoria de nível');
    }
  };

  const revertCountdown = async () => {
    if (!currentCampaign) return;
    await fetch(`/api/campaigns/${currentCampaign.id}/countdown/revert`, {
      method: 'POST',
    });
  };

  const updateArcs = async (arcs: any[]) => {
    if (!currentCampaign) return;
    await fetch(`/api/campaigns/${currentCampaign.id}/arcs`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(arcs),
    });
  };

  const updateClues = async (clues: any[]) => {
    if (!currentCampaign) return;
    await fetch(`/api/campaigns/${currentCampaign.id}/clues`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(clues),
    });
  };

  const updateMysteryLibrary = async (mysteries: Mystery[]) => {
    if (!currentCampaign) return;
    await fetch(`/api/campaigns/${currentCampaign.id}/mysteries/library`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mysteries),
    });
  };

  const startMystery = async (mysteryId: string) => {
    if (!currentCampaign) return;
    await fetch(`/api/campaigns/${currentCampaign.id}/mysteries/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mysteryId }),
    });
  };

  const updateThreatBank = async (threats: any[]) => {
    if (!currentCampaign) return;
    await fetch(`/api/campaigns/${currentCampaign.id}/threats/bank`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(threats),
    });
  };

  const updateSessions = async (sessions: any[]) => {
    if (!currentCampaign) return;
    await fetch(`/api/campaigns/${currentCampaign.id}/sessions`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sessions),
    });
  };

  return (
    <VTTContext.Provider
      value={{
        user,
        updateUser,
        campaignsList,
        refreshCampaignsList,
        currentCampaign,
        currentRole,
        activeHunter,
        chatMessages,
        latestRoll,
        isLoading,
        error,
        createCampaign,
        joinCampaign,
        deleteCampaign,
        leaveCampaign,
        toggleArchiveCampaign,
        updateCampaignDetails,
        updateCampaignById,
        leaveCurrentCampaign,
        selectActiveHunter,
        saveHunterCharacter,
        deleteHunterCharacter,
        rollDice,
        sendChatMessage,
        updateHarm,
        spendLuck,
        spendLuckAdvanced,
        updateExp,
        manageExperience,
        applyLevelUp,
        advanceCountdown,
        revertCountdown,
        updateMystery,
        updateScenes,
        setActiveScene,
        updateDiary,
        awardEndOfSession,
        updateArcs,
        updateClues,
        updateMysteryLibrary,
        startMystery,
        updateThreatBank,
        updateSessions,
      }}
    >
      {children}
    </VTTContext.Provider>
  );
};

export const useVTT = () => {
  const context = useContext(VTTContext);
  if (!context) {
    throw new Error('useVTT must be used within a VTTProvider');
  }
  return context;
};
