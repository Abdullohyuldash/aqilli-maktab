import 'dotenv/config';
import express, { type Request, type Response } from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const IS_PROD = process.env.NODE_ENV === 'production';

// =========================================================================
// SERVER-SIDE GEMINI 3.8 FLASH LITE TTS ENGINE (UZBEK & ENGLISH)
// =========================================================================

const TTS_MODEL = 'gemini-3.8-flash-lite-tts';
const MAX_TEXT_LENGTH = 700;
const MAX_CACHE_ENTRIES = 260;
const MAX_CACHE_BYTES = 36 * 1024 * 1024; // 36 MB bounded LRU cache

const EMOJI_AND_DECOR_RE =
  /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0E}\u{FE0F}\u{200D}➔→↔•·|[\]]+/gu;

let cachedAiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) return null;
  if (!cachedAiClient) {
    cachedAiClient = new GoogleGenAI({
      apiKey,
      apiVersion: 'v1beta',
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return cachedAiClient;
}

interface TtsCacheEntry {
  buffer: Buffer;
  bytes: number;
}

const ttsCache = new Map<string, TtsCacheEntry>();
let ttsCacheTotalBytes = 0;
const inFlightTts = new Map<string, Promise<Buffer>>();
const COOLDOWN_FILE = '/tmp/bilimlar_tts_cooldown.json';

function loadPersistedCooldown(): number {
  try {
    if (!fs.existsSync(COOLDOWN_FILE)) return 0;
    const raw = JSON.parse(fs.readFileSync(COOLDOWN_FILE, 'utf8')) as { until?: unknown };
    const until = typeof raw?.until === 'number' ? raw.until : 0;
    return Number.isFinite(until) && until > Date.now() ? until : 0;
  } catch {
    return 0;
  }
}

function savePersistedCooldown(until: number): void {
  try {
    fs.writeFileSync(COOLDOWN_FILE, JSON.stringify({ until }), 'utf8');
  } catch {
    // Non-fatal in read-only filesystems
  }
}

let geminiQuotaCooldownUntil = loadPersistedCooldown();

function parseRetryAfterSeconds(err: unknown): number {
  const msg = err instanceof Error ? err.message : String(err ?? '');
  const retryFieldMatch = msg.match(/"retryDelay"\s*:\s*"(\d+)s"/i);
  if (retryFieldMatch) {
    return Math.max(30, Math.min(3600, Number(retryFieldMatch[1])));
  }
  const humanHourMatch = msg.match(/Please retry in\s+(\d+)h/i);
  if (humanHourMatch) {
    return Math.min(3600, Number(humanHourMatch[1]) * 3600);
  }
  const humanSecMatch = msg.match(/Please retry in\s+(\d+(?:\.\d+)?)s/i);
  if (humanSecMatch) {
    return Math.max(30, Math.min(3600, Math.ceil(Number(humanSecMatch[1]))));
  }
  // Daily quota exhaustion -> back off 30 minutes; per-minute exhaustion -> 65 seconds
  if (/per\s*day|GenerateRequestsPerDay/i.test(msg)) {
    return 1800;
  }
  return 65;
}

function getCachedAudio(key: string): Buffer | null {
  const entry = ttsCache.get(key);
  if (!entry) return null;
  // Refresh LRU order
  ttsCache.delete(key);
  ttsCache.set(key, entry);
  return entry.buffer;
}

function setCachedAudio(key: string, buffer: Buffer): void {
  const existing = ttsCache.get(key);
  if (existing) {
    ttsCacheTotalBytes -= existing.bytes;
    ttsCache.delete(key);
  }
  const bytes = buffer.byteLength;
  if (bytes > MAX_CACHE_BYTES / 4) return;

  ttsCache.set(key, { buffer, bytes });
  ttsCacheTotalBytes += bytes;

  while (ttsCache.size > MAX_CACHE_ENTRIES || ttsCacheTotalBytes > MAX_CACHE_BYTES) {
    const oldestKey = ttsCache.keys().next().value;
    if (oldestKey === undefined) break;
    const oldest = ttsCache.get(oldestKey);
    if (oldest) {
      ttsCacheTotalBytes -= oldest.bytes;
    }
    ttsCache.delete(oldestKey);
  }
}

function sanitizeTtsText(raw: string, lang: 'uz' | 'en'): string {
  let cleaned = raw
    .replace(EMOJI_AND_DECOR_RE, ' ')
    .replace(/[—–]/g, ', ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!cleaned) return '';

  if (lang === 'uz') {
    cleaned = cleaned
      // Preserve paired single-quoted phrases (e.g. 'Hello!', 'Goodbye!', 'I don't like...')
      // as double quotes BEFORE normalizing Uzbek o'/g' so words like 'Hello!' are never altered.
      .replace(
        /(^|[\s(])'((?:[^']|(?<=[A-Za-z])'(?=[A-Za-z]))+)'(?=$|[\s).,!?:;])/g,
        '$1"$2"'
      )
      // Standardize Uzbek O' and G' apostrophes to proper Unicode modifier letter
      .replace(/([OoGg])['‘’`ʻ]/g, '$1ʻ')
      // Lowercase ALL-CAPS words (len >= 2) so TTS reads words smoothly rather than spelling letters
      .replace(/\b[A-Z]{2,}(?:ʻ[A-Z]+)*\b/g, (word) => word.toLowerCase())
      .replace(/\s+/g, ' ')
      .trim();
  } else {
    cleaned = cleaned
      // Lowercase ALL-CAPS English words (like "RED", "ONE", "BOOK") while keeping pronoun "I"
      .replace(/\b([A-Z]{2,})\b/g, (word) => word.toLowerCase())
      .replace(/\s+([,!?.])/g, '$1')
      .replace(/\s+/g, ' ')
      .trim();
  }

  return cleaned.slice(0, MAX_TEXT_LENGTH);
}

function buildSpeechConfig(lang: 'uz' | 'en', styleHint: 'default' | 'letter') {
  if (lang === 'uz') {
    const style =
      styleHint === 'letter'
        ? "Warm, cheerful, crystal-clear native Uzbek Grade 1 primary school teacher pronouncing an Uzbek alphabet letter, syllable, or example word slowly and accurately in standard literary Uzbek (O'zbek adabiy tili) for a 6-year-old child. Read EVERY word completely without skipping anything. Always use authentic Uzbek pronunciation for Uzbek letters, never English letter names."
        : "Warm, cheerful, crystal-clear native Uzbek Grade 1 primary school teacher speaking standard literary Uzbek (O'zbek adabiy tili) clearly, naturally, and expressively at a gentle pace for a 6-year-old child. CRITICAL RULE: Read EVERY SINGLE WORD in the text completely from start to finish — NEVER skip, omit, or drop any word, translation in parentheses, or quoted phrase. Whenever English words or phrases appear inside quotes or alongside Uzbek (for example \"Hello!\", \"Goodbye!\", \"My name is...\", \"Book\", \"Red\"), pronounce those English words seamlessly with crisp, natural native English pronunciation inside the warm Uzbek sentence.";
    return { voiceName: 'Kore', style };
  }

  return {
    voiceName: 'Zephyr',
    style:
      'Warm, friendly, crystal-clear native American English primary school teacher pronouncing EVERY English word and short sentence completely, naturally, clearly, and cheerfully at a gentle pace for a 6-year-old beginner. Never skip any word.',
  };
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function synthesizeWithGemini(
  ai: GoogleGenAI,
  text: string,
  lang: 'uz' | 'en',
  styleHint: 'default' | 'letter'
): Promise<Buffer> {
  const { voiceName, style } = buildSpeechConfig(lang, styleHint);

  let lastError: unknown = null;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: TTS_MODEL,
        contents: [
          {
            role: 'user',
            parts: [
              {
                text,
                speechMetadata: {
                  style,
                },
              },
            ],
          },
        ],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName },
            },
          },
        },
      });

      const base64Audio =
        response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

      if (!base64Audio) {
        throw new Error('Empty audio payload from Gemini TTS');
      }

      // Unary Gemini 3.8 TTS returns a complete 24kHz mono 16-bit WAV file (with RIFF header)
      return Buffer.from(base64Audio, 'base64');
    } catch (err) {
      lastError = err;
      const status =
        typeof err === 'object' && err !== null && 'status' in err
          ? Number((err as { status?: unknown }).status)
          : 0;
      // Only retry transient 5xx server errors; NEVER retry 429 quota limits
      if (attempt === 0 && (status >= 500 || status === 0)) {
        await sleep(450);
        continue;
      }
      break;
    }
  }

  throw lastError instanceof Error ? lastError : new Error('Gemini TTS synthesis failed');
}

async function startServer() {
  const app = express();
  app.disable('x-powered-by');
  app.use(express.json({ limit: '16kb' }));

  app.get('/api/tts/health', (_req: Request, res: Response) => {
    const cooldownRemainingSec = Math.max(
      0,
      Math.ceil((geminiQuotaCooldownUntil - Date.now()) / 1000)
    );
    res.json({
      ok: Boolean(process.env.GEMINI_API_KEY?.trim()) && cooldownRemainingSec === 0,
      model: TTS_MODEL,
      cachedClips: ttsCache.size,
      cooldownRemainingSec,
    });
  });

  app.post('/api/tts', async (req: Request, res: Response) => {
    const ai = getGeminiClient();
    if (!ai) {
      res.status(503).json({ error: 'TTS API key is not configured on the server.' });
      return;
    }

    const body = req.body as Record<string, unknown> | null;
    const rawText = typeof body?.text === 'string' ? body.text : '';
    const lang: 'uz' | 'en' = body?.lang === 'en' ? 'en' : 'uz';
    const styleHint: 'default' | 'letter' = body?.styleHint === 'letter' ? 'letter' : 'default';

    const cleanedText = sanitizeTtsText(rawText, lang);
    if (!cleanedText) {
      res.status(400).json({ error: 'Valid text is required for TTS synthesis.' });
      return;
    }

    const cacheKey = `${lang}:${styleHint}:${cleanedText}`;
    const cached = getCachedAudio(cacheKey);
    if (cached) {
      res.setHeader('Content-Type', 'audio/wav');
      res.setHeader('Cache-Control', 'public, max-age=86400');
      res.setHeader('X-TTS-Cache', 'HIT');
      res.send(cached);
      return;
    }

    // Short-circuit cleanly during active Gemini quota cooldown (0 upstream calls, 0 error logs)
    const now = Date.now();
    if (now < geminiQuotaCooldownUntil) {
      const retryAfterSec = Math.max(15, Math.ceil((geminiQuotaCooldownUntil - now) / 1000));
      res.setHeader('X-TTS-Fallback', 'client');
      res.setHeader('X-TTS-Retry-After', String(retryAfterSec));
      res.status(204).end();
      return;
    }

    try {
      let pending = inFlightTts.get(cacheKey);
      if (!pending) {
        pending = synthesizeWithGemini(ai, cleanedText, lang, styleHint)
          .then((wavBuffer) => {
            setCachedAudio(cacheKey, wavBuffer);
            return wavBuffer;
          })
          .finally(() => {
            inFlightTts.delete(cacheKey);
          });
        inFlightTts.set(cacheKey, pending);
      }

      const wavBuffer = await pending;
      res.setHeader('Content-Type', 'audio/wav');
      res.setHeader('Cache-Control', 'public, max-age=86400');
      res.setHeader('X-TTS-Cache', 'MISS');
      res.send(wavBuffer);
    } catch (err) {
      const status =
        typeof err === 'object' && err !== null && 'status' in err
          ? Number((err as { status?: unknown }).status)
          : 502;
      const message = err instanceof Error ? err.message : 'TTS generation error';
      const isQuotaError =
        status === 429 || /RESOURCE_EXHAUSTED|quota|429/i.test(message);

      if (isQuotaError) {
        const retryAfterSec = parseRetryAfterSeconds(err);
        geminiQuotaCooldownUntil = Date.now() + retryAfterSec * 1000;
        savePersistedCooldown(geminiQuotaCooldownUntil);
        res.setHeader('X-TTS-Fallback', 'client');
        res.setHeader('X-TTS-Retry-After', String(retryAfterSec));
        res.status(204).end();
        return;
      }

      const httpStatus = status === 400 || status === 403 ? status : 502;
      res.setHeader('X-TTS-Fallback', 'client');
      res.status(httpStatus).json({ error: message });
    }
  });

  // Serve compact static Opus .webm lesson audio from public/audio/ with strict 404 on miss
  // (prevents SPA HTML fallback from masquerading as an audio file).
  const staticAudioDir = IS_PROD
    ? path.resolve(__dirname, 'dist', 'audio')
    : path.resolve(__dirname, 'public', 'audio');
  app.use(
    '/audio',
    express.static(staticAudioDir, {
      maxAge: '30d',
      immutable: true,
      fallthrough: true,
    })
  );
  app.use('/audio', (_req: Request, res: Response) => {
    res.status(404).end();
  });

  if (IS_PROD) {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir, { index: false }));
    app.get('*', (_req: Request, res: Response) => {
      const indexFile = path.join(distDir, 'index.html');
      if (fs.existsSync(indexFile)) {
        res.sendFile(indexFile);
      } else {
        res.status(404).send('Build output not found.');
      }
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`3D Bilimlar Maktabi server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
