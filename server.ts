import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { db, registerSSESubscriber } from './server/db.ts';

dotenv.config();

function getPort(): number {
  const portArgIndex = process.argv.indexOf('--port');
  if (portArgIndex !== -1 && process.argv[portArgIndex + 1]) {
    return parseInt(process.argv[portArgIndex + 1], 10);
  }
  if (process.env.NODE_ENV === 'production' && process.env.PORT) {
    return parseInt(process.env.PORT, 10);
  }
  return 3000;
}

const PORT = getPort();
const isProduction = process.env.NODE_ENV === 'production';
const app = express();

app.use(express.json({ limit: '10mb' }));

// REST API
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: Date.now() });
});

// Campaign listings
app.get('/api/campaigns', (req, res) => {
  try {
    const list = db.getCampaigns();
    res.json(list);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Create campaign
app.post('/api/campaigns', (req, res) => {
  try {
    const { name, description, coverImage, keeperId, keeperName } = req.body;
    if (!name || !keeperId || !keeperName) {
      return res.status(400).json({ error: 'Nome da campanha e identificação do Guardião são obrigatórios' });
    }
    const camp = db.createCampaign({ name, description, coverImage, keeperId, keeperName });
    res.status(201).json(camp);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Get campaign by ID
app.get('/api/campaigns/:id', (req, res) => {
  const camp = db.getCampaign(req.params.id);
  if (!camp) return res.status(404).json({ error: 'Campanha não encontrada' });
  res.json(camp);
});

// Join campaign by invite code or ID
app.post('/api/campaigns/join', (req, res) => {
  try {
    const { inviteCode, campaignId, userId, userName, avatarUrl } = req.body;
    if (!userId || !userName) {
      return res.status(400).json({ error: 'Identificação de usuário necessária' });
    }

    let targetCamp = campaignId ? db.getCampaign(campaignId) : undefined;
    if (!targetCamp && inviteCode) {
      targetCamp = db.getCampaignByInviteCode(inviteCode);
    }

    if (!targetCamp) {
      return res.status(404).json({ error: 'Código de convite ou campanha inválidos' });
    }

    const result = db.joinCampaign(targetCamp.id, { userId, userName, avatarUrl });
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// SSE real-time stream for campaign
app.get('/api/campaigns/:id/events', (req, res) => {
  const campaign = db.getCampaign(req.params.id);
  if (!campaign) {
    return res.status(404).send('Campanha não encontrada');
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  // Send initial ping
  res.write(`event: connected\ndata: ${JSON.stringify({ campaignId: campaign.id, time: Date.now() })}\n\n`);

  registerSSESubscriber(campaign.id, res);
});

// Save / update character
app.post('/api/campaigns/:id/characters', (req, res) => {
  try {
    const char = db.saveCharacter(req.params.id, req.body);
    res.json(char);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Delete character
app.delete('/api/campaigns/:id/characters/:charId', (req, res) => {
  try {
    db.deleteCharacter(req.params.id, req.params.charId);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Server-authoritative dice roll
app.post('/api/campaigns/:id/rolls', (req, res) => {
  try {
    const result = db.executeRoll({
      campaignId: req.params.id,
      ...req.body,
    });
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Chat messages
app.get('/api/campaigns/:id/chat', (req, res) => {
  try {
    const list = db.getChatMessages(req.params.id);
    res.json(list);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/campaigns/:id/chat', (req, res) => {
  try {
    const msg = db.addChatMessage(req.params.id, req.body);
    res.json(msg);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Harm update
app.patch('/api/campaigns/:id/harm', (req, res) => {
  try {
    const { charId, harmDelta, armour, isHeal } = req.body;
    const char = db.updateHarm(req.params.id, charId, harmDelta, armour, isHeal);
    res.json(char);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Spend luck
app.patch('/api/campaigns/:id/luck', (req, res) => {
  try {
    const { charId } = req.body;
    const char = db.spendLuck(req.params.id, charId);
    res.json(char);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Update experience
app.patch('/api/campaigns/:id/experience', (req, res) => {
  try {
    const { charId, delta } = req.body;
    const char = db.updateExperience(req.params.id, charId, delta);
    res.json(char);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Mystery update
app.patch('/api/campaigns/:id/mystery', (req, res) => {
  try {
    const mystery = db.updateActiveMystery(req.params.id, req.body);
    res.json(mystery);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Advance countdown
app.post('/api/campaigns/:id/countdown/advance', (req, res) => {
  try {
    const mystery = db.advanceCountdown(req.params.id);
    res.json(mystery);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Scenes update
app.patch('/api/campaigns/:id/scenes', (req, res) => {
  try {
    const scenes = db.updateScenes(req.params.id, req.body);
    res.json(scenes);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Diary update
app.patch('/api/campaigns/:id/diary', (req, res) => {
  try {
    const diary = db.updateDiary(req.params.id, req.body);
    res.json(diary);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Serve uploads directory
const UPLOADS_DIR = path.resolve(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}
app.use('/uploads', express.static(UPLOADS_DIR));

// Native image upload route (supports base64 image data from mobile camera/file input)
app.post('/api/upload', (req, res) => {
  try {
    const { dataUrl, filename } = req.body;
    if (!dataUrl || !dataUrl.startsWith('data:image/')) {
      return res.status(400).json({ error: 'Payload de imagem inválido' });
    }

    const matches = dataUrl.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).json({ error: 'Formato base64 de imagem inválido' });
    }

    const ext = matches[1] === 'jpeg' ? 'jpg' : matches[1];
    const buffer = Buffer.from(matches[2], 'base64');
    const safeName = `img_${Date.now()}_${crypto.randomBytes(4).toString('hex')}.${ext}`;
    const filePath = path.join(UPLOADS_DIR, safeName);

    fs.writeFileSync(filePath, buffer);
    const publicUrl = `/uploads/${safeName}`;

    res.json({ url: publicUrl, filename: safeName });
  } catch (err: any) {
    console.error('Error in /api/upload:', err);
    res.status(500).json({ error: 'Falha ao salvar imagem' });
  }
});

// Update campaign general details
app.patch('/api/campaigns/:id', (req, res) => {
  try {
    const { keeperId, ...updates } = req.body;
    if (!keeperId) return res.status(400).json({ error: 'Identificação de Guardião obrigatória' });
    const camp = db.updateCampaignDetails(req.params.id, updates, keeperId);
    res.json(camp);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Delete campaign (with keeper confirmation)
app.delete('/api/campaigns/:id', (req, res) => {
  try {
    const { keeperId, confirmationName } = req.body;
    if (!keeperId || !confirmationName) {
      return res.status(400).json({ error: 'Confirmação do nome da campanha e ID do Guardião são obrigatórios' });
    }
    db.deleteCampaign(req.params.id, keeperId, confirmationName);
    res.json({ success: true, message: 'Campanha excluída com sucesso' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Leave campaign (player action)
app.post('/api/campaigns/:id/leave', (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: 'Identificação de usuário necessária' });
    const camp = db.leaveCampaign(req.params.id, userId);
    res.json(camp);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Archive / Unarchive campaign
app.post('/api/campaigns/:id/archive', (req, res) => {
  try {
    const { keeperId } = req.body;
    if (!keeperId) return res.status(400).json({ error: 'Apenas o Guardião pode arquivar a campanha' });
    const camp = db.toggleArchiveCampaign(req.params.id, keeperId);
    res.json(camp);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Keeper Experience Management
app.post('/api/campaigns/:id/experience/manage', (req, res) => {
  try {
    const { hunterId, allHunters, delta, reason, keeperId, keeperName } = req.body;
    if (!keeperId || !keeperName || delta === undefined) {
      return res.status(400).json({ error: 'Parâmetros de concessão de XP incompletos' });
    }
    const result = db.manageExperience(req.params.id, {
      hunterId,
      allHunters,
      delta: parseInt(delta, 10),
      reason: reason || 'Concessão do Guardião',
      keeperId,
      keeperName,
    });
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Advanced Luck Spending (Roll to 12 OR Cancel Harm)
app.post('/api/campaigns/:id/luck/advanced', (req, res) => {
  try {
    const { charId, option, rollId } = req.body;
    if (!charId || !option) {
      return res.status(400).json({ error: 'Identificação do caçador e opção de sorte necessárias' });
    }
    const char = db.spendLuckAdvanced(req.params.id, { charId, option, rollId });
    res.json(char);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Hunter Level Up Improvement Selection
app.post('/api/campaigns/:id/characters/:charId/levelup', (req, res) => {
  try {
    const { improvement, ratingToBoost } = req.body;
    if (!improvement) {
      return res.status(400).json({ error: 'Melhoria não especificada' });
    }
    const char = db.applyLevelUpImprovement(req.params.id, req.params.charId, improvement, ratingToBoost);
    res.json(char);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Revert countdown stage
app.post('/api/campaigns/:id/countdown/revert', (req, res) => {
  try {
    const mystery = db.revertCountdown(req.params.id);
    res.json(mystery);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Arcs update
app.patch('/api/campaigns/:id/arcs', (req, res) => {
  try {
    const arcs = db.updateArcs(req.params.id, req.body);
    res.json(arcs);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Clues update
app.patch('/api/campaigns/:id/clues', (req, res) => {
  try {
    const clues = db.updateClues(req.params.id, req.body);
    res.json(clues);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Mystery Library update
app.patch('/api/campaigns/:id/mysteries/library', (req, res) => {
  try {
    const lib = db.updateMysteryLibrary(req.params.id, req.body);
    res.json(lib);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Start a mystery from library
app.post('/api/campaigns/:id/mysteries/start', (req, res) => {
  try {
    const { mysteryId } = req.body;
    if (!mysteryId) return res.status(400).json({ error: 'ID do mistério obrigatório' });
    const started = db.startMystery(req.params.id, mysteryId);
    res.json(started);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Threat bank update
app.patch('/api/campaigns/:id/threats/bank', (req, res) => {
  try {
    const bank = db.updateThreatBank(req.params.id, req.body);
    res.json(bank);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Sessions history update
app.patch('/api/campaigns/:id/sessions', (req, res) => {
  try {
    const sessions = db.updateSessions(req.params.id, req.body);
    res.json(sessions);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// End of session XP
app.post('/api/campaigns/:id/end-session', (req, res) => {
  try {
    const { count } = req.body;
    db.awardEndOfSessionXp(req.params.id, count || 0);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: false },
      appType: 'custom',
    });
    app.use(vite.middlewares);

    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      try {
        let template = fs.readFileSync(path.resolve(process.cwd(), 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e: any) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n  ➜  Local:   http://localhost:${PORT}/`);
    console.log(`  ➜  Network: http://0.0.0.0:${PORT}/`);
    console.log(`Server listening on http://0.0.0.0:${PORT}\n`);
  });
}

process.on('uncaughtException', (err) => {
  console.error('Uncaught exception in server:', err);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection in server:', reason);
});

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
