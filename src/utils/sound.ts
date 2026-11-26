export type SpeechMode =
  | 'static-webm'
  | 'studio-uz'
  | 'studio-en'
  | 'native-uz'
  | 'phonetic-uz'
  | 'native-en'
  | 'retro-blip'
  | 'audio-buffer'
  | 'silent';

export interface SpeechState {
  sessionId: number;
  isSpeaking: boolean;
  fullText: string;
  visibleLength: number;
  mode: SpeechMode;
}

export interface PlayAudioBufferOptions {
  /** Optional subtitle text to reveal synchronously while the audio plays */
  subtitleText?: string;
  /** Optional raw 16-bit PCM metadata (e.g. Gemini TTS audio/pcm;rate=24000) */
  pcmConfig?: {
    sampleRate?: number;
    numChannels?: number;
  };
  /** Gain multiplier (default 1.0) */
  volume?: number;
}

export interface SpeakUzbekOptions {
  /** Playback rate for Uzbek speech (default 0.96 for crisp clarity) */
  rate?: number;
  /** Pitch for Uzbek speech (default 1.0 to avoid robotic formant distortion) */
  pitch?: number;
  /** Milliseconds per character for retro typewriter/blip cadence (default 38) */
  charDelayMs?: number;
  /** Optional authentic Uzbek subtitle text to display while speaking a phonetic string */
  subtitleText?: string;
  /** Optional pronunciation style hint ('letter' for single Uzbek letters/digraphs) */
  styleHint?: 'default' | 'letter';
}

// Cozy pentatonic teacher-voice frequencies (Hz) for Animal Crossing / Zelda style blips
const RETRO_VOICE_SCALE = [329.63, 369.99, 415.3, 493.88, 554.37, 659.25];
const UZ_VOWEL_CHARS = /[aeiouo'o‘oʻ]/i;

class SoundEngine {
  private ctx: AudioContext | null = null;
  private muted = false;
  private unlockBound = false;

  constructor() {
    this.bindUserGestureUnlock();
  }

  /**
   * Automatically unlocks Web Audio API AudioContext on the very first user gesture
   * (pointerdown, keydown, or touchstart) to satisfy browser autoplay policies.
   */
  private bindUserGestureUnlock(): void {
    if (typeof window === 'undefined' || this.unlockBound) return;
    this.unlockBound = true;

    const unlock = () => {
      this.unlockAudio();
      if (this.ctx && this.ctx.state === 'running') {
        window.removeEventListener('pointerdown', unlock, true);
        window.removeEventListener('keydown', unlock, true);
        window.removeEventListener('touchstart', unlock, true);
      }
    };

    window.addEventListener('pointerdown', unlock, { capture: true, passive: true });
    window.addEventListener('keydown', unlock, { capture: true, passive: true });
    window.addEventListener('touchstart', unlock, { capture: true, passive: true });
  }

  public unlockAudio(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return null;
      try {
        this.ctx = new AudioCtx();
      } catch {
        return null;
      }
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public getAudioContext(): AudioContext | null {
    if (this.muted) return null;
    return this.unlockAudio();
  }

  private ensureContext(): AudioContext | null {
    return this.getAudioContext();
  }

  public setMuted(mute: boolean): void {
    this.muted = mute;
    if (mute) {
      stopSpeaking();
    }
  }

  public isMuted(): boolean {
    return this.muted;
  }

  /**
   * Soft, warm procedural retro game dialogue chime (Animal Crossing / Zelda inspired)
   * keyed deterministically by character so Uzbek words sound melodic and friendly.
   */
  public playSpeechBlip(charCode: number, isVowel: boolean, risingInflection = false): void {
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const scaleIdx = Math.abs(charCode) % RETRO_VOICE_SCALE.length;
    const baseFreq = RETRO_VOICE_SCALE[scaleIdx] * (isVowel ? 1.08 : 0.94);
    const endFreq = risingInflection ? baseFreq * 1.18 : baseFreq * (isVowel ? 1.03 : 0.97);

    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = isVowel ? 'triangle' : 'sine';
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(Math.max(120, endFreq), now + 0.055);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(isVowel ? 1550 : 1200, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(isVowel ? 0.055 : 0.04, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.068);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.075);
  }

  public playJump(superBoost = false): void {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = superBoost ? 'triangle' : 'sine';
    osc.frequency.setValueAtTime(superBoost ? 280 : 210, now);
    osc.frequency.exponentialRampToValueAtTime(superBoost ? 680 : 480, now + 0.16);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.14, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.23);

    if (superBoost) {
      const chime = ctx.createOscillator();
      const chimeGain = ctx.createGain();
      chime.type = 'sine';
      chime.frequency.setValueAtTime(740, now + 0.06);
      chime.frequency.exponentialRampToValueAtTime(1046, now + 0.22);
      chimeGain.gain.setValueAtTime(0.001, now + 0.06);
      chimeGain.gain.linearRampToValueAtTime(0.08, now + 0.09);
      chimeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      chime.connect(chimeGain);
      chimeGain.connect(ctx.destination);
      chime.start(now + 0.06);
      chime.stop(now + 0.26);
    }
  }

  public playStep(): void {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(115 + Math.random() * 25, now);
    osc.frequency.exponentialRampToValueAtTime(55, now + 0.045);

    gain.gain.setValueAtTime(0.035, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.055);
  }

  public playCoin(): void {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const notes = [987.77, 1318.51]; // B5 -> E6

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const t = now + idx * 0.075;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.14, t + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.24);
    });
  }

  public playCorrect(): void {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99]; // C5 E5 G5
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const t = now + i * 0.065;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.13, t + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.22);
    });
  }

  public playWrong(): void {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(210, now);
    osc.frequency.linearRampToValueAtTime(145, now + 0.24);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.09, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.26);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.28);
  }

  public playPurchase(): void {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const notes = [587.33, 739.99, 880, 1174.66]; // D5 F#5 A5 D6
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const t = now + i * 0.06;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.14, t + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.24);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.26);
    });
  }

  public playEquip(): void {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(660, now + 0.09);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.11, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.13);
  }

  public playLessonComplete(): void {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const t = now + i * 0.085;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.15, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.38);
    });
  }

  public playGreetingReward(): void {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    // Warm polite greeting chime followed by bright coin sparkle
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const t = now + i * 0.07;
      osc.type = i === 3 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(i === 3 ? 0.14 : 0.12, t + 0.018);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.31);
    });
  }

  public playGreetingWarning(): void {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    // Gentle two-note descending reminder tone
    const notes = [349.23, 261.63]; // F4 -> C4
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const t = now + i * 0.14;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);
      osc.frequency.linearRampToValueAtTime(freq * 0.94, t + 0.14);
      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.11, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.22);
    });
  }

  public playTrashCollect(): void {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    // Crisp, sparkling cleanliness chime (E5 -> G#5 -> B5 -> E6)
    const notes = [659.25, 830.61, 987.77, 1318.51];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const t = now + i * 0.055;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.12, t + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.24);
    });
  }

  public playAwardUnlocked(): void {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    // Grand triumphant medal ceremony fanfare (C5 -> E5 -> G5 -> C6 -> G5 -> C6 + warm chord)
    const melody = [
      { freq: 523.25, offset: 0.0, dur: 0.18 },
      { freq: 659.25, offset: 0.11, dur: 0.18 },
      { freq: 783.99, offset: 0.22, dur: 0.2 },
      { freq: 1046.5, offset: 0.34, dur: 0.28 },
      { freq: 1318.51, offset: 0.48, dur: 0.42 },
      { freq: 1567.98, offset: 0.58, dur: 0.52 },
    ];
    melody.forEach(({ freq, offset, dur }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const t = now + offset;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.15, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + dur + 0.04);
    });
  }

  public playEmote(emote: string): void {
    if (emote === 'quvonch') {
      this.playLessonComplete();
      return;
    }

    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    if (emote === 'salom') {
      // Gentle, warm welcoming two-note greeting chime
      const notes = [440, 554.37, 659.25];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const t = now + idx * 0.09;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.001, t);
        gain.gain.linearRampToValueAtTime(0.09, t + 0.025);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.32);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.35);
      });
      return;
    }

    if (emote === 'qarsak') {
      // Polite, soft rhythmic applause pulses (bandpass filtered gentle clicks)
      const clapTimes = [0.05, 0.28, 0.51, 0.74, 0.97];
      clapTimes.forEach((offset) => {
        const t = now + offset;
        const osc = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(620 + Math.random() * 80, t);
        osc.frequency.exponentialRampToValueAtTime(240, t + 0.055);
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1100, t);
        filter.Q.setValueAtTime(1.4, t);
        gain.gain.setValueAtTime(0.001, t);
        gain.gain.linearRampToValueAtTime(0.09, t + 0.008);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.065);
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.075);
      });
      return;
    }

    // 'milliy_raqs': cheerful, dignified Uzbek-flavored melodic motif + light doira tap
    const melody = [
      { freq: 587.33, t: 0.0 },   // D5
      { freq: 659.25, t: 0.14 },  // E5
      { freq: 739.99, t: 0.28 },  // F#5
      { freq: 880.0, t: 0.42 },   // A5
      { freq: 739.99, t: 0.58 },  // F#5
      { freq: 880.0, t: 0.74 },   // A5
      { freq: 987.77, t: 0.92 },  // B5
      { freq: 880.0, t: 1.1 },    // A5
    ];
    melody.forEach(({ freq, t: offset }) => {
      const t = now + offset;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.085, t + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.16);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.18);
    });
  }

  public playElevatorDing(): void {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Warm two-tone school elevator bell chime ("Ding-Dong!")
    const tones = [
      { freq: 1046.5, overtone: 2093.0, delay: 0, dur: 0.42, amp: 0.14 },
      { freq: 1318.51, overtone: 2637.02, delay: 0.16, dur: 0.65, amp: 0.16 },
    ];

    tones.forEach(({ freq, overtone, delay, dur, amp }) => {
      const t = now + delay;

      const fund = ctx.createOscillator();
      const fundGain = ctx.createGain();
      fund.type = 'sine';
      fund.frequency.setValueAtTime(freq, t);
      fundGain.gain.setValueAtTime(0.001, t);
      fundGain.gain.linearRampToValueAtTime(amp, t + 0.012);
      fundGain.gain.exponentialRampToValueAtTime(0.001, t + dur);
      fund.connect(fundGain);
      fundGain.connect(ctx.destination);
      fund.start(t);
      fund.stop(t + dur + 0.02);

      const harm = ctx.createOscillator();
      const harmGain = ctx.createGain();
      harm.type = 'sine';
      harm.frequency.setValueAtTime(overtone, t);
      harmGain.gain.setValueAtTime(0.001, t);
      harmGain.gain.linearRampToValueAtTime(amp * 0.25, t + 0.01);
      harmGain.gain.exponentialRampToValueAtTime(0.001, t + dur * 0.55);
      harm.connect(harmGain);
      harmGain.connect(ctx.destination);
      harm.start(t);
      harm.stop(t + dur * 0.6);
    });
  }

  public playCrocChomp(): void {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // 1. Crisp cartoon "QARS!" crunch burst (bandpass white noise + wooden snap)
    const bufferSize = Math.floor(ctx.sampleRate * 0.14);
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      const env = Math.pow(1 - i / bufferSize, 1.8);
      data[i] = (Math.random() * 2 - 1) * env;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1450, now);
    filter.frequency.exponentialRampToValueAtTime(420, now + 0.13);
    filter.Q.setValueAtTime(1.6, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.24, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noise.start(now);

    // 2. Jaw snap thump
    const snap = ctx.createOscillator();
    const snapGain = ctx.createGain();
    snap.type = 'triangle';
    snap.frequency.setValueAtTime(310, now);
    snap.frequency.exponentialRampToValueAtTime(88, now + 0.09);
    snapGain.gain.setValueAtTime(0.2, now);
    snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
    snap.connect(snapGain);
    snapGain.connect(ctx.destination);
    snap.start(now);
    snap.stop(now + 0.11);

    // 3. Cheerful star sparkle chime right after the bite
    const notes = [659.25, 880, 1174.66];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const t = now + 0.13 + idx * 0.065;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.12, t + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.24);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.26);
    });
  }

  public playScaleBalance(): void {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Warm golden bell chime chord when balance scale aligns horizontally
    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const overtone = ctx.createOscillator();
      const gain = ctx.createGain();
      const t = now + i * 0.075;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);
      overtone.type = 'triangle';
      overtone.frequency.setValueAtTime(freq * 2, t);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.11, t + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.42);

      const overGain = ctx.createGain();
      overGain.gain.setValueAtTime(0.22, t);

      osc.connect(gain);
      overtone.connect(overGain);
      overGain.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      overtone.start(t);
      osc.stop(t + 0.45);
      overtone.stop(t + 0.45);
    });
  }

  public playFruitPluck(count: number): void {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Cheerful ascending C-major marimba/pop scale as each fruit drops into the basket
    const scale = [
      523.25, // 1: C5
      587.33, // 2: D5
      659.25, // 3: E5
      698.46, // 4: F5
      783.99, // 5: G5
      880.0,  // 6: A5
      987.77, // 7: B5
      1046.5, // 8: C6
      1174.66, // 9: D6
      1318.51, // 10: E6
      1396.91, // 11: F6
      1567.98, // 12: G6
    ];
    const freq = scale[Math.max(0, (count - 1) % scale.length)];

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq * 0.84, now);
    osc.frequency.exponentialRampToValueAtTime(freq, now + 0.045);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.15, now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.19);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.21);
  }

  public playWindWhoosh(): void {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Playful bird chirp + light breeze flutter when fruits fly off the tree
    const chirps = [
      { start: 0, f1: 1180, f2: 1640 },
      { start: 0.13, f1: 1320, f2: 1820 },
    ];
    chirps.forEach(({ start, f1, f2 }) => {
      const t = now + start;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f1, t);
      osc.frequency.exponentialRampToValueAtTime(f2, t + 0.06);
      osc.frequency.exponentialRampToValueAtTime(f1 * 0.9, t + 0.11);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.08, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.13);
    });
  }

  public playWaterSplash(): void {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Bubbly water drop arpeggio for plant watering, handwashing, and water states lab
    const drops = [
      { delay: 0, f1: 380, f2: 720 },
      { delay: 0.06, f1: 480, f2: 890 },
      { delay: 0.13, f1: 560, f2: 1040 },
    ];
    drops.forEach(({ delay, f1, f2 }) => {
      const t = now + delay;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f1, t);
      osc.frequency.exponentialRampToValueAtTime(f2, t + 0.08);
      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.095, t + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.11);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.12);
    });
  }

  public playPhoneTone(digit: number): void {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Gentle friendly keypad tone mapped to digit 0..9
    const freqs = [523.25, 587.33, 659.25, 698.46, 783.99, 880.0, 987.77, 1046.5, 1174.66, 1318.51];
    const freq = freqs[Math.abs(digit) % freqs.length];
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.11, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.11);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.12);
  }

  public playCameraShutter(): void {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Crisp mechanical shutter click (short filtered noise burst)
    const bufferSize = Math.floor(ctx.sampleRate * 0.06);
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      const env = Math.pow(1 - i / bufferSize, 2.2);
      data[i] = (Math.random() * 2 - 1) * env;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(1800, now);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.22, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start(now);

    // Bright focus chime right after shutter click
    const osc = ctx.createOscillator();
    const chimeGain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1174.66, now + 0.05);
    osc.frequency.exponentialRampToValueAtTime(1567.98, now + 0.14);
    chimeGain.gain.setValueAtTime(0.001, now + 0.05);
    chimeGain.gain.linearRampToValueAtTime(0.11, now + 0.065);
    chimeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
    osc.connect(chimeGain);
    chimeGain.connect(ctx.destination);
    osc.start(now + 0.05);
    osc.stop(now + 0.24);
  }

  public playAnimalSound(
    animal: 'elephant' | 'lion' | 'cat' | 'dog' | 'bird' | 'fish'
  ): void {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    if (animal === 'elephant') {
      // Friendly playful elephant trumpet sweep
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, now);
      osc.frequency.setValueAtTime(240, now);
      osc.frequency.exponentialRampToValueAtTime(620, now + 0.16);
      osc.frequency.exponentialRampToValueAtTime(480, now + 0.36);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.11, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.4);
      return;
    }

    if (animal === 'lion') {
      // Friendly cartoon lion roar (low warm vibrating sawtooth)
      const osc = ctx.createOscillator();
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(165, now);
      osc.frequency.linearRampToValueAtTime(115, now + 0.36);
      lfo.frequency.setValueAtTime(28, now);
      lfoGain.gain.setValueAtTime(16, now);
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(650, now);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.13, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      lfo.start(now);
      osc.stop(now + 0.42);
      lfo.stop(now + 0.42);
      return;
    }

    if (animal === 'cat') {
      // Cute rising-falling "meow"
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(840, now + 0.12);
      osc.frequency.exponentialRampToValueAtTime(480, now + 0.32);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.34);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.36);
      return;
    }

    if (animal === 'dog') {
      // Two cheerful cartoon barks ("Woof! Woof!")
      [0, 0.16].forEach((offset) => {
        const t = now + offset;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(340, t);
        osc.frequency.exponentialRampToValueAtTime(175, t + 0.09);
        gain.gain.setValueAtTime(0.001, t);
        gain.gain.linearRampToValueAtTime(0.14, t + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.11);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.12);
      });
      return;
    }

    if (animal === 'bird') {
      this.playWindWhoosh();
      return;
    }

    // 'fish': bubbly pops
    this.playWaterSplash();
  }

  public playBalloonPop(): void {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Crisp cartoon "PAQ!" pop noise burst
    const bufferSize = Math.floor(ctx.sampleRate * 0.08);
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      const env = Math.pow(1 - i / bufferSize, 2.4);
      data[i] = (Math.random() * 2 - 1) * env;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1200, now);
    filter.Q.setValueAtTime(1.2, now);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.28, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start(now);

    // Cheerful bouncy pop pitch drop + sparkle chime
    const pop = ctx.createOscillator();
    const popGain = ctx.createGain();
    pop.type = 'sine';
    pop.frequency.setValueAtTime(620, now);
    pop.frequency.exponentialRampToValueAtTime(180, now + 0.07);
    popGain.gain.setValueAtTime(0.18, now);
    popGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
    pop.connect(popGain);
    popGain.connect(ctx.destination);
    pop.start(now);
    pop.stop(now + 0.09);

    const chime = ctx.createOscillator();
    const chimeGain = ctx.createGain();
    chime.type = 'triangle';
    chime.frequency.setValueAtTime(880, now + 0.06);
    chime.frequency.exponentialRampToValueAtTime(1318.51, now + 0.19);
    chimeGain.gain.setValueAtTime(0.001, now + 0.06);
    chimeGain.gain.linearRampToValueAtTime(0.11, now + 0.08);
    chimeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);
    chime.connect(chimeGain);
    chimeGain.connect(ctx.destination);
    chime.start(now + 0.06);
    chime.stop(now + 0.26);
  }

  public playTrainWhistle(): void {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Cheerful two-blast cartoon steam train whistle ("Tu-tuuu!")
    const blasts = [
      { delay: 0, dur: 0.16 },
      { delay: 0.22, dur: 0.34 },
    ];
    blasts.forEach(({ delay, dur }) => {
      [587.33, 739.99].forEach((freq, idx) => {
        const t = now + delay;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t);
        osc.frequency.linearRampToValueAtTime(freq * 1.02, t + dur * 0.6);
        gain.gain.setValueAtTime(0.001, t);
        gain.gain.linearRampToValueAtTime(idx === 0 ? 0.11 : 0.08, t + 0.025);
        gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + dur + 0.02);
      });
    });
  }

  public playMagicMerge(): void {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Sparkling upward harp arpeggio for letter fusion & wheel merge
    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51];
    notes.forEach((freq, idx) => {
      const t = now + idx * 0.045;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.11, t + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.26);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.28);
    });
  }
}

export const soundEngine = new SoundEngine();

// =========================================================================
// HIGH-CLARITY UZBEK & ENGLISH WEB SPEECH ENGINE (ZERO ASSET BLOAT)
// =========================================================================

let cachedUzbekVoice: SpeechSynthesisVoice | null = null;
let cachedPhoneticUzVoice: SpeechSynthesisVoice | null = null;
let cachedEnglishVoice: SpeechSynthesisVoice | null = null;
let voicesListenerBound = false;
let speechSessionId = 0;
let activeTimers: number[] = [];
let activeAudioSource: AudioBufferSourceNode | null = null;
let activeStaticAudio: HTMLAudioElement | null = null;
let activeTtsAbortController: AbortController | null = null;
// Retained reference prevents Chromium from garbage-collecting active utterances mid-sentence
let activeUtteranceRef: SpeechSynthesisUtterance | null = null;

// Static .webm (Opus) offline audio cache (0ms repeat playback, 0 API requests)
const staticWebmUrlCache = new Map<string, string>();
const staticWebmMissing = new Set<string>();

// Client-side LRU cache for decoded studio WAV AudioBuffers (instant replay, zero asset bloat)
const CLIENT_TTS_CACHE_MAX = 160;
const clientTtsCache = new Map<string, AudioBuffer>();
const TTS_BACKOFF_STORAGE_KEY = 'bilimlar_maktabi_tts_backoff_until';
let ttsConsecutiveFailures = 0;
let ttsBackoffUntil = (() => {
  if (typeof window === 'undefined') return 0;
  try {
    const raw = window.sessionStorage.getItem(TTS_BACKOFF_STORAGE_KEY);
    const parsed = raw ? Number(raw) : 0;
    return Number.isFinite(parsed) && parsed > Date.now() ? parsed : 0;
  } catch {
    return 0;
  }
})();

function setTtsBackoff(ms: number): void {
  const until = Date.now() + Math.max(10_000, ms);
  ttsBackoffUntil = Math.max(ttsBackoffUntil, until);
  if (typeof window !== 'undefined') {
    try {
      window.sessionStorage.setItem(TTS_BACKOFF_STORAGE_KEY, String(ttsBackoffUntil));
    } catch {
      // Ignore storage restrictions
    }
  }
}

let currentSpeechState: SpeechState = {
  sessionId: 0,
  isSpeaking: false,
  fullText: '',
  visibleLength: 0,
  mode: 'static-webm',
};

const speechListeners = new Set<(state: SpeechState) => void>();

// Exclude robotic / novelty voices that distort children's pronunciation
const NOVELTY_OR_ROBOTIC_VOICE_RE =
  /espeak|albert|bad news|bahh|bells|boing|bubbles|cellos|eddy|flo|fred|good news|grandma|grandpa|jester|junior|kathy|organ|ralph|reed|rocko|sandy|shelley|superstar|trinoids|whisper|wobble|zarvox/i;

const EMOJI_AND_DECOR_RE =
  /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0E}\u{FE0F}\u{200D}➔→↔•·|[\]]+/gu;

// Crisp Uzbek phonetic readings for standalone letters/digraphs (never spelled in English!)
const UZ_SINGLE_LETTER_NATIVE: Record<string, string> = {
  A: 'aa',
  O: 'oo',
  I: 'ii',
  U: 'uu',
  E: 'ee',
  "O'": 'oʻ',
  N: 'en',
  M: 'em',
  L: 'el',
  T: 'te',
  B: 'be',
  S: 'se',
  K: 'ka',
  Q: 'qa',
  R: 'er',
  D: 'de',
  P: 'pe',
  Y: 'ye',
  G: 'ge',
  "G'": 'gʻe',
  V: 've',
  H: 'ha',
  X: 'xa',
  Z: 'ze',
  C: 'se',
  SH: 'sha',
  CH: 'cha',
  NG: 'eng',
};

const UZ_SINGLE_LETTER_PHONETIC: Record<string, string> = {
  A: 'a',
  O: 'o',
  I: 'i',
  U: 'u',
  E: 'e',
  "O'": 'o',
  N: 'nı',
  M: 'mı',
  L: 'lı',
  T: 'te',
  B: 'be',
  S: 'se',
  K: 'ke',
  Q: 'ka',
  R: 're',
  D: 'de',
  P: 'pe',
  Y: 'ye',
  G: 'ge',
  "G'": 'ga',
  V: 've',
  H: 'ha',
  X: 'ha',
  Z: 'ze',
  C: 'se',
  SH: 'şa',
  CH: 'ça',
  NG: 'ng',
};

function emitSpeechState(next: SpeechState): void {
  currentSpeechState = next;
  speechListeners.forEach((listener) => {
    try {
      listener(next);
    } catch {
      // Isolate listener errors
    }
  });
}

function clearSpeechTimers(): void {
  for (let i = 0; i < activeTimers.length; i++) {
    window.clearTimeout(activeTimers[i]);
  }
  activeTimers = [];
}

function scheduleSpeechTimer(fn: () => void, ms: number): void {
  if (typeof window === 'undefined') return;
  const id = window.setTimeout(fn, ms);
  activeTimers.push(id);
}

function scoreUzbekVoice(v: SpeechSynthesisVoice): number {
  const lang = v.lang.trim().toLowerCase();
  const name = v.name.toLowerCase();
  if (NOVELTY_OR_ROBOTIC_VOICE_RE.test(name)) return -100;

  let score = 0;
  if (/^uz([-_]|$)/.test(lang)) score += 100;
  else if (/\buzbek\b|o['‘’ʻ]?zbek/.test(name)) score += 90;
  else return -1;

  if (/natural|neural|online|enhanced|premium/.test(name)) score += 35;
  if (/google|microsoft|madina|sardor/.test(name)) score += 20;
  if (!v.localService) score += 8;
  return score;
}

function scorePhoneticTurkicVoice(v: SpeechSynthesisVoice): number {
  const lang = v.lang.trim().toLowerCase();
  const name = v.name.toLowerCase();
  if (NOVELTY_OR_ROBOTIC_VOICE_RE.test(name)) return -100;

  let score = 0;
  // Turkish & Azerbaijani share virtually identical vowel/consonant inventory with Uzbek
  if (/^tr([-_]|$)/.test(lang)) score += 80;
  else if (/^az([-_]|$)/.test(lang)) score += 75;
  else return -1;

  if (/natural|neural|online|enhanced|premium/.test(name)) score += 35;
  if (/google|emel|yelda|cem|tolga|microsoft/.test(name)) score += 22;
  if (!v.localService) score += 8;
  return score;
}

function scoreEnglishVoice(v: SpeechSynthesisVoice): number {
  const lang = v.lang.trim().toLowerCase();
  const name = v.name.toLowerCase();
  if (!/^en([-_]|$)/.test(lang)) return -1;
  if (NOVELTY_OR_ROBOTIC_VOICE_RE.test(name)) return -100;

  let score = 0;
  if (/^en[-_]us$/.test(lang)) score += 45;
  else if (/^en[-_]gb$/.test(lang)) score += 35;
  else score += 20;

  // Strongly prefer crisp Neural / Natural / Enhanced / Google voices
  if (/natural|neural|online|premium|enhanced/.test(name)) score += 50;
  if (/google us english/.test(name)) score += 55;
  if (/google uk english female/.test(name)) score += 45;
  if (/\b(aria|jenny|ana|ava|michelle|samantha|zoe|nicky|allison|karen|daniel)\b/.test(name)) {
    score += 32;
  }
  // Legacy robotic SAPI voices get low priority
  if (/\b(zira|david|mark|hazel|george|susan)\b/.test(name) && !/online|natural/.test(name)) {
    score -= 22;
  }
  if (/compact/.test(name)) score -= 18;
  return score;
}

function pickBestVoice(
  voices: SpeechSynthesisVoice[],
  scorer: (v: SpeechSynthesisVoice) => number
): SpeechSynthesisVoice | null {
  let best: SpeechSynthesisVoice | null = null;
  let bestScore = 0;
  for (let i = 0; i < voices.length; i++) {
    const s = scorer(voices[i]);
    if (s > bestScore) {
      bestScore = s;
      best = voices[i];
    }
  }
  return best;
}

function refreshAvailableVoices(): {
  uzbek: SpeechSynthesisVoice | null;
  phoneticUz: SpeechSynthesisVoice | null;
  english: SpeechSynthesisVoice | null;
} {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    cachedUzbekVoice = null;
    cachedPhoneticUzVoice = null;
    cachedEnglishVoice = null;
    return { uzbek: null, phoneticUz: null, english: null };
  }
  try {
    const voices = window.speechSynthesis.getVoices();
    cachedUzbekVoice = pickBestVoice(voices, scoreUzbekVoice);
    cachedPhoneticUzVoice = pickBestVoice(voices, scorePhoneticTurkicVoice);
    cachedEnglishVoice = pickBestVoice(voices, scoreEnglishVoice);
  } catch {
    cachedUzbekVoice = null;
    cachedPhoneticUzVoice = null;
    cachedEnglishVoice = null;
  }
  return {
    uzbek: cachedUzbekVoice,
    phoneticUz: cachedPhoneticUzVoice,
    english: cachedEnglishVoice,
  };
}

function initVoicesListener(): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window) || voicesListenerBound) {
    return;
  }
  voicesListenerBound = true;
  refreshAvailableVoices();

  try {
    const synth = window.speechSynthesis;
    if (typeof synth.addEventListener === 'function') {
      synth.addEventListener('voiceschanged', refreshAvailableVoices);
    } else {
      synth.onvoiceschanged = refreshAvailableVoices;
    }
  } catch {
    // Ignore restricted environments
  }
}

initVoicesListener();

/**
 * Normalizes Uzbek & bilingual Uzbek+English text for TTS without EVER dropping
 * quoted English words/phrases (e.g. 'Hello!', 'Goodbye!', 'My name is...').
 * - Strips only decorative emojis/arrows (preserves all Latin letters & quotes)
 * - Protects paired single-quoted phrases (including contractions like 'I don't like...')
 *   as double quotes BEFORE normalizing Uzbek O'/G' to oʻ/gʻ
 * - Lowercases ALL-CAPS words (len >= 2) so TTS reads smoothly rather than spelling letters
 */
function normalizeUzbekForNativeTts(raw: string): string {
  const stripped = raw
    .replace(EMOJI_AND_DECOR_RE, ' ')
    .replace(/[—–]/g, ', ')
    .replace(/\s+/g, ' ')
    .trim();
  if (!stripped) return '';

  // Single standalone Uzbek letter/digraph lookup (e.g. "SH", "O'", "N")
  const normSingle = stripped.toUpperCase().replace(/[‘’`ʻ]/g, "'");
  if (UZ_SINGLE_LETTER_NATIVE[normSingle]) {
    return UZ_SINGLE_LETTER_NATIVE[normSingle];
  }

  return stripped
    // Smooth stretched phonics (Aaaa! -> Aa!, Shshsh! -> Sh!, Chchch! -> Ch!)
    .replace(/([A-Za-z])\1{2,}/g, '$1$1')
    .replace(/\bshsh+\b/gi, 'Sh')
    .replace(/\bchch+\b/gi, 'Ch')
    // Protect paired single-quoted phrases (e.g. 'Hello!', 'Goodbye!', 'I don't like...')
    // as double quotes BEFORE converting Uzbek o'/g' so English words ending in o/g stay intact
    .replace(
      /(^|[\s(])'((?:[^']|(?<=[A-Za-z])'(?=[A-Za-z]))+)'(?=$|[\s).,!?:;])/g,
      '$1"$2"'
    )
    // Standardize Uzbek O' and G' apostrophes
    .replace(/([OoGg])['‘’`ʻ]/g, '$1ʻ')
    // Convert ALL-CAPS words (len >= 2) to lowercase so TTS doesn't spell "A-N-O-R"
    .replace(/\b[A-Z]{2,}(?:ʻ[A-Z]+)*\b/g, (word) => word.toLowerCase())
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Lightweight Uzbek-to-Phonetic transliterator for high-clarity Turkic (tr-TR / az-AZ) voices
 * when the user's device lacks a native uz-UZ voice pack.
 * Maps Uzbek digraphs/consonants (sh->ş, ch->ç, g'->ğ, q->k, x->h, j->c) with zero audio bloat.
 */
function transliterateUzbekToPhonetic(raw: string): string {
  const stripped = raw
    .replace(EMOJI_AND_DECOR_RE, ' ')
    .replace(/[—–]/g, ', ')
    .replace(/\s+/g, ' ')
    .trim();
  if (!stripped) return '';

  const normSingle = stripped.toUpperCase().replace(/[‘’`ʻ]/g, "'");
  if (UZ_SINGLE_LETTER_PHONETIC[normSingle]) {
    return UZ_SINGLE_LETTER_PHONETIC[normSingle];
  }

  let out = stripped
    .replace(/([A-Za-z])\1{2,}/g, '$1$1')
    .replace(/\bshsh+\b/gi, 'Şa')
    .replace(/\bchch+\b/gi, 'Ça')
    .replace(/[‘’`ʻ]/g, "'")
    // Convert ALL-CAPS words so voice never spells acronyms
    .replace(/\b[A-Z]{2,}(?:'[A-Z]+)*\b/g, (word) => word.toLowerCase())
    // Replace isolated quoted letter names cleanly
    .replace(/["“”']([A-Za-z]{1,2}'?)["“”']/g, (_, l: string) => {
      const key = l.toUpperCase();
      return UZ_SINGLE_LETTER_PHONETIC[key] ?? l.toLowerCase();
    });

  // Phonetic mapping: Uzbek Latin -> clear Turkic pronunciation
  out = out
    .replace(/Sh/g, 'Ş')
    .replace(/sh/g, 'ş')
    .replace(/Ch/g, 'Ç')
    .replace(/ch/g, 'ç')
    .replace(/G'/g, 'G')
    .replace(/g'/g, 'ğ')
    .replace(/O'/g, 'O')
    .replace(/o'/g, 'o')
    .replace(/Q/g, 'K')
    .replace(/q/g, 'k')
    .replace(/X/g, 'H')
    .replace(/x/g, 'h')
    .replace(/J/g, 'C')
    .replace(/j/g, 'c')
    // Tutuq belgisi (glottal stop) -> subtle smooth break
    .replace(/'/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  return out;
}

/**
 * Cleans English phrases for crisp en-US Web Speech output:
 * - Removes emojis & decorative icons so voices never read "waving hand"
 * - Normalizes ALL-CAPS words (like "RED", "BOOK") except pronoun "I"
 */
function sanitizeEnglishForTts(raw: string): string {
  return raw
    .replace(EMOJI_AND_DECOR_RE, ' ')
    .replace(/[—–]/g, ', ')
    .replace(/\b([A-Z]{2,})\b/g, (word) => word.toLowerCase())
    .replace(/\s+([,!?.])/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Safely invokes speechSynthesis.speak() with Chromium's cancel-race protection
 * (prevents clipped first syllables) and GC protection (prevents mid-sentence cutoff).
 */
function speakUtteranceSafely(
  utterance: SpeechSynthesisUtterance,
  session: number,
  wasBusy: boolean
): void {
  const trigger = () => {
    if (session !== speechSessionId) return;
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      activeUtteranceRef = utterance;
      window.speechSynthesis.speak(utterance);
    } catch {
      // Ignore restricted environments
    }
  };

  if (wasBusy) {
    scheduleSpeechTimer(trigger, 35);
  } else {
    trigger();
  }
}

export function hasUzbekVoice(): boolean {
  initVoicesListener();
  const { uzbek, phoneticUz } = refreshAvailableVoices();
  return uzbek !== null || phoneticUz !== null;
}

export function getSpeechState(): SpeechState {
  return currentSpeechState;
}

export function subscribeSpeechState(listener: (state: SpeechState) => void): () => void {
  speechListeners.add(listener);
  listener(currentSpeechState);
  return () => {
    speechListeners.delete(listener);
  };
}

export function unlockAudioContext(): void {
  soundEngine.unlockAudio();
}

/**
 * Immediately halts all active browser TTS, procedural retro speech timers,
 * and AudioBuffer playback, and marks speaking as stopped.
 */
export function stopSpeaking(): void {
  speechSessionId += 1;
  clearSpeechTimers();
  activeUtteranceRef = null;

  if (activeTtsAbortController) {
    try {
      activeTtsAbortController.abort();
    } catch {
      // Already aborted
    }
    activeTtsAbortController = null;
  }

  if (activeStaticAudio) {
    try {
      activeStaticAudio.onended = null;
      activeStaticAudio.onerror = null;
      activeStaticAudio.onloadedmetadata = null;
      activeStaticAudio.pause();
      activeStaticAudio.currentTime = 0;
    } catch {
      // Already stopped
    }
    activeStaticAudio = null;
  }

  if (activeAudioSource) {
    try {
      activeAudioSource.onended = null;
      activeAudioSource.stop();
      activeAudioSource.disconnect();
    } catch {
      // Already stopped
    }
    activeAudioSource = null;
  }

  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // Ignore speech synthesis errors on restricted environments
    }
  }

  if (currentSpeechState.isSpeaking) {
    emitSpeechState({
      ...currentSpeechState,
      sessionId: speechSessionId,
      isSpeaking: false,
      visibleLength: currentSpeechState.fullText.length,
    });
  }
}

/**
 * Runs a synchronized character-by-character typewriter progression with
 * warm procedural retro speech chimes. Used as a graceful fallback only when
 * no Uzbek or Turkic phonetic TTS voice exists on the device.
 */
function runRetroSpeechTypewriter(
  text: string,
  session: number,
  charDelayMs: number,
  withAudioBlips: boolean
): void {
  const total = text.length;
  const mode: SpeechMode = withAudioBlips ? 'retro-blip' : 'silent';

  emitSpeechState({
    sessionId: session,
    isSpeaking: true,
    fullText: text,
    visibleLength: 0,
    mode,
  });

  let index = 0;
  let lettersSinceBlip = 0;

  const step = () => {
    if (session !== speechSessionId) return;

    index += 1;
    const ch = text[index - 1] ?? '';

    if (withAudioBlips && !soundEngine.isMuted()) {
      const isLetter = /[A-Za-z0-9'‘’ʻ]/.test(ch);
      if (isLetter) {
        lettersSinceBlip += 1;
        const isVowel = UZ_VOWEL_CHARS.test(ch);
        if (lettersSinceBlip >= 2 || (isVowel && lettersSinceBlip >= 1)) {
          const nearQuestion =
            text.slice(index, index + 6).includes('?') || ch === '?';
          soundEngine.playSpeechBlip(ch.charCodeAt(0) + index, isVowel, nearQuestion);
          lettersSinceBlip = 0;
        }
      } else if (ch === ' ') {
        lettersSinceBlip = 1;
      }
    }

    const done = index >= total;
    emitSpeechState({
      sessionId: session,
      isSpeaking: !done,
      fullText: text,
      visibleLength: index,
      mode,
    });

    if (done) return;

    let nextDelay = charDelayMs;
    if (ch === '.' || ch === '!' || ch === '?') {
      nextDelay = charDelayMs * 5.2;
    } else if (ch === ',' || ch === ';' || ch === ':') {
      nextDelay = charDelayMs * 3.0;
    } else if (ch === ' ') {
      nextDelay = charDelayMs * 0.7;
    }

    scheduleSpeechTimer(step, nextDelay);
  };

  scheduleSpeechTimer(step, 20);
}

function getClientCachedTts(key: string): AudioBuffer | null {
  const cached = clientTtsCache.get(key);
  if (!cached) return null;
  clientTtsCache.delete(key);
  clientTtsCache.set(key, cached);
  return cached;
}

function setClientCachedTts(key: string, buffer: AudioBuffer): void {
  if (clientTtsCache.has(key)) {
    clientTtsCache.delete(key);
  }
  clientTtsCache.set(key, buffer);
  while (clientTtsCache.size > CLIENT_TTS_CACHE_MAX) {
    const oldestKey = clientTtsCache.keys().next().value;
    if (oldestKey === undefined) break;
    clientTtsCache.delete(oldestKey);
  }
}

async function fetchStudioTtsBuffer(
  text: string,
  lang: 'uz' | 'en',
  styleHint: 'default' | 'letter',
  ctx: AudioContext,
  signal: AbortSignal
): Promise<AudioBuffer | null> {
  if (Date.now() < ttsBackoffUntil) {
    return null;
  }

  const cacheKey = `${lang}:${styleHint}:${text}`;
  const cached = getClientCachedTts(cacheKey);
  if (cached) {
    return cached;
  }

  const timeoutId = window.setTimeout(() => {
    try {
      if (!signal.aborted && activeTtsAbortController?.signal === signal) {
        activeTtsAbortController.abort();
      }
    } catch {
      // Ignore
    }
  }, 9500);

  try {
    const response = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, lang, styleHint }),
      signal,
    });

    if (response.status === 204) {
      const retryHeader = Number(response.headers.get('x-tts-retry-after') || '0');
      const retrySec = Number.isFinite(retryHeader) && retryHeader > 0 ? retryHeader : 600;
      setTtsBackoff(retrySec * 1000);
      ttsConsecutiveFailures = 0;
      return null;
    }

    if (!response.ok) {
      if (response.status === 429) {
        const retryHeader = Number(response.headers.get('retry-after') || '0');
        let retrySec = Number.isFinite(retryHeader) && retryHeader > 0 ? retryHeader : 0;
        if (!retrySec) {
          try {
            const payload = (await response.json()) as { retryAfterSec?: number };
            if (payload && typeof payload.retryAfterSec === 'number' && payload.retryAfterSec > 0) {
              retrySec = payload.retryAfterSec;
            }
          } catch {
            // Ignore JSON parse errors
          }
        }
        // Immediately honor server Retry-After (default 10 min) so zero repeated 429s fire
        setTtsBackoff((retrySec > 0 ? retrySec : 600) * 1000);
        ttsConsecutiveFailures = 0;
      } else if (response.status === 503) {
        setTtsBackoff(60_000);
      } else {
        ttsConsecutiveFailures += 1;
        if (ttsConsecutiveFailures >= 3) {
          setTtsBackoff(30_000);
          ttsConsecutiveFailures = 0;
        }
      }
      return null;
    }

    const arrayBuffer = await response.arrayBuffer();
    if (signal.aborted || arrayBuffer.byteLength < 64) {
      return null;
    }

    const decoded = await ctx.decodeAudioData(arrayBuffer.slice(0));
    ttsConsecutiveFailures = 0;
    setClientCachedTts(cacheKey, decoded);
    return decoded;
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      return null;
    }
    ttsConsecutiveFailures += 1;
    if (ttsConsecutiveFailures >= 3) {
      setTtsBackoff(30_000);
      ttsConsecutiveFailures = 0;
    }
    return null;
  } finally {
    window.clearTimeout(timeoutId);
  }
}

function playDecodedStudioSpeech(
  ctx: AudioContext,
  decodedBuffer: AudioBuffer,
  session: number,
  mode: SpeechMode,
  subtitleText: string,
  playbackRate = 1.0
): void {
  if (session !== speechSessionId || soundEngine.isMuted()) return;

  if (ctx.state === 'suspended') {
    ctx.resume().catch(() => {});
  }

  const bufferSource = ctx.createBufferSource();
  const gainNode = ctx.createGain();
  bufferSource.buffer = decodedBuffer;
  bufferSource.playbackRate.value = Math.min(1.25, Math.max(0.8, playbackRate));
  gainNode.gain.setValueAtTime(1.0, ctx.currentTime);

  bufferSource.connect(gainNode);
  gainNode.connect(ctx.destination);
  activeAudioSource = bufferSource;

  clearSpeechTimers();

  if (subtitleText) {
    const totalChars = subtitleText.length;
    const durationMs = Math.max(
      280,
      (decodedBuffer.duration / bufferSource.playbackRate.value) * 1000
    );
    const stepMs = Math.max(16, Math.floor(durationMs / Math.max(1, totalChars)));
    let revealed = 0;

    emitSpeechState({
      sessionId: session,
      isSpeaking: true,
      fullText: subtitleText,
      visibleLength: 0,
      mode,
    });

    const advance = () => {
      if (session !== speechSessionId) return;
      revealed = Math.min(totalChars, revealed + 1);
      emitSpeechState({
        sessionId: session,
        isSpeaking: revealed < totalChars,
        fullText: subtitleText,
        visibleLength: revealed,
        mode,
      });
      if (revealed < totalChars) {
        scheduleSpeechTimer(advance, stepMs);
      }
    };
    scheduleSpeechTimer(advance, stepMs);
  } else {
    emitSpeechState({
      sessionId: session,
      isSpeaking: true,
      fullText: currentSpeechState.fullText,
      visibleLength: currentSpeechState.fullText.length,
      mode,
    });
  }

  bufferSource.onended = () => {
    if (activeAudioSource === bufferSource) {
      activeAudioSource = null;
    }
    if (session !== speechSessionId) return;
    clearSpeechTimers();
    emitSpeechState({
      sessionId: session,
      isSpeaking: false,
      fullText: subtitleText || currentSpeechState.fullText,
      visibleLength: (subtitleText || currentSpeechState.fullText).length,
      mode,
    });
  };

  bufferSource.start(0);
}

interface BilingualSegment {
  text: string;
  isEnglish: boolean;
}

/**
 * Splits a bilingual Uzbek+English explanation (e.g. `... "Hello!" (Salom!) ...`)
 * into ordered Uzbek and quoted English segments so fallback Web Speech pronounces
 * English words with the native English voice instead of skipping or mangling them.
 */
function splitBilingualSegments(normalizedText: string): BilingualSegment[] {
  const segments: BilingualSegment[] = [];
  const quoteRe = /"([^"]+)"/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = quoteRe.exec(normalizedText)) !== null) {
    const before = normalizedText.slice(lastIndex, match.index).trim();
    if (before) {
      segments.push({ text: before, isEnglish: false });
    }
    const quoted = match[1].trim();
    if (quoted) {
      // Treat quoted phrase as English if it doesn't contain Uzbek-specific oʻ/gʻ letters
      const hasUzSpecific = /[ʻ]|o'|g'/i.test(quoted);
      segments.push({ text: quoted, isEnglish: !hasUzSpecific });
    }
    lastIndex = match.index + match[0].length;
  }

  const tail = normalizedText.slice(lastIndex).trim();
  if (tail) {
    segments.push({ text: tail, isEnglish: false });
  }

  return segments.length > 0 ? segments : [{ text: normalizedText, isEnglish: false }];
}

/**
 * Fallback Uzbek (and bilingual Uzbek+English) browser Web Speech / retro typewriter
 * when static .webm is missing and server TTS is cooling down or offline.
 */
function speakUzbekWebSpeechFallback(
  cleaned: string,
  subtitleText: string,
  session: number,
  options: SpeakUzbekOptions
): void {
  if (session !== speechSessionId) return;
  const charDelayMs = options.charDelayMs ?? 38;
  const synthBusy =
    typeof window !== 'undefined' &&
    'speechSynthesis' in window &&
    (window.speechSynthesis.speaking || window.speechSynthesis.pending);

  const { uzbek, phoneticUz, english } = refreshAvailableVoices();
  const activeVoice = uzbek ?? phoneticUz;
  const mode: SpeechMode = uzbek ? 'native-uz' : 'phonetic-uz';

  if (activeVoice && typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      const normalized = normalizeUzbekForNativeTts(cleaned);
      if (!normalized) {
        runRetroSpeechTypewriter(subtitleText, session, charDelayMs, true);
        return;
      }

      const rawSegments = splitBilingualSegments(normalized);
      const hasBilingualEnglish = english !== null && rawSegments.some((s) => s.isEnglish);
      const segments = hasBilingualEnglish
        ? rawSegments
        : [{ text: normalized, isEnglish: false }];

      emitSpeechState({
        sessionId: session,
        isSpeaking: true,
        fullText: subtitleText,
        visibleLength: 0,
        mode,
      });

      let revealed = 0;
      const rate = options.rate ?? 0.92;
      const estimatedMsPerChar = Math.max(34, Math.round(50 / (rate || 0.92)));
      const tickSubtitle = () => {
        if (session !== speechSessionId) return;
        if (revealed < subtitleText.length) {
          revealed = Math.min(subtitleText.length, revealed + 1);
          emitSpeechState({
            sessionId: session,
            isSpeaking: true,
            fullText: subtitleText,
            visibleLength: revealed,
            mode,
          });
          scheduleSpeechTimer(tickSubtitle, estimatedMsPerChar);
        }
      };
      scheduleSpeechTimer(tickSubtitle, 45);

      const speakSegmentAt = (idx: number, firstBusy: boolean) => {
        if (session !== speechSessionId) return;
        if (idx >= segments.length) {
          clearSpeechTimers();
          emitSpeechState({
            sessionId: session,
            isSpeaking: false,
            fullText: subtitleText,
            visibleLength: subtitleText.length,
            mode,
          });
          return;
        }

        const seg = segments[idx];
        const spokenText = seg.isEnglish
          ? sanitizeEnglishForTts(seg.text)
          : uzbek
          ? seg.text
          : transliterateUzbekToPhonetic(seg.text);

        if (!spokenText) {
          speakSegmentAt(idx + 1, false);
          return;
        }

        const utterance = new SpeechSynthesisUtterance(spokenText);
        if (seg.isEnglish && english) {
          utterance.voice = english;
          utterance.lang = english.lang || 'en-US';
        } else {
          utterance.voice = activeVoice;
          utterance.lang = activeVoice.lang || (uzbek ? 'uz-UZ' : 'tr-TR');
        }
        utterance.rate = rate;
        utterance.pitch = options.pitch ?? 1.0;

        utterance.onend = () => {
          if (activeUtteranceRef === utterance) activeUtteranceRef = null;
          if (session !== speechSessionId) return;
          speakSegmentAt(idx + 1, false);
        };

        utterance.onerror = () => {
          if (activeUtteranceRef === utterance) activeUtteranceRef = null;
          if (session !== speechSessionId) return;
          if (idx + 1 < segments.length) {
            speakSegmentAt(idx + 1, false);
          } else {
            clearSpeechTimers();
            runRetroSpeechTypewriter(subtitleText, session, charDelayMs, true);
          }
        };

        speakUtteranceSafely(utterance, session, firstBusy);
      };

      speakSegmentAt(0, synthBusy);
      return;
    } catch {
      // Fall through cleanly to retro procedural dialogue
    }
  }

  runRetroSpeechTypewriter(subtitleText, session, charDelayMs, true);
}

// =========================================================================
// STATIC .WEBM (OPUS) OFFLINE AUDIO ENGINE (public/audio/{subject}/{id}.webm)
// =========================================================================

export interface PlayLessonAudioOptions {
  /** Fallback text to speak via Gemini TTS cache / Web Speech if static .webm is missing */
  fallbackText?: string;
  /** Authentic text shown in synchronized karaoke subtitles */
  subtitleText?: string;
  /** Language used when falling back to Gemini TTS ('uz' | 'en', default 'uz') */
  lang?: 'uz' | 'en';
  /** Optional style hint for Uzbek alphabet letter phonics fallback */
  styleHint?: 'default' | 'letter';
}

/**
 * Resolves a standardized static audio ID for any lesson (e.g. "lesson_1", "lesson_2").
 * Grade 1 lessons use "lesson_{n}"; Grade 2+ lessons use "grade_{g}_lesson_{n}".
 */
export function resolveLessonAudioId(topicTitle: string, grade = 1): string {
  const match = topicTitle.match(/^(\d+)\s*-?\s*dars\b/i);
  if (match) {
    const num = Number(match[1]);
    return grade <= 1 ? `lesson_${num}` : `grade_${grade}_lesson_${num}`;
  }
  const slug = topicTitle
    .toLowerCase()
    .replace(/[‘’`ʻ']/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 40);
  return grade <= 1 ? `lesson_${slug || '1'}` : `grade_${grade}_${slug || '1'}`;
}

/**
 * Resolves a standardized static audio ID for an Uzbek alphabet letter or digraph
 * (e.g. "A" -> "letter_a", "O'" -> "letter_o_apos", "SH" -> "letter_sh").
 */
export function resolveLetterAudioId(letter: string): string {
  const norm = letter.trim().toLowerCase().replace(/[‘’`ʻ]/g, "'");
  if (norm === "o'") return 'letter_o_apos';
  if (norm === "g'") return 'letter_g_apos';
  const clean = norm.replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
  return `letter_${clean || 'a'}`;
}

function isValidWebmOrOpusBytes(buf: ArrayBuffer): boolean {
  if (buf.byteLength < 64) return false;
  const bytes = new Uint8Array(buf, 0, 4);
  // WebM / Matroska EBML header: 0x1A 0x45 0xDF 0xA3
  const isWebm =
    bytes[0] === 0x1a && bytes[1] === 0x45 && bytes[2] === 0xdf && bytes[3] === 0xa3;
  // Ogg Opus header: "OggS"
  const isOgg =
    bytes[0] === 0x4f && bytes[1] === 0x67 && bytes[2] === 0x67 && bytes[3] === 0x53;
  return isWebm || isOgg;
}

async function resolveStaticWebmObjectUrl(
  urlPath: string,
  signal: AbortSignal
): Promise<string | null> {
  const cached = staticWebmUrlCache.get(urlPath);
  if (cached) return cached;
  if (staticWebmMissing.has(urlPath)) return null;

  try {
    const res = await fetch(urlPath, { method: 'GET', signal });
    const contentType = (res.headers.get('content-type') || '').toLowerCase();
    if (!res.ok || contentType.includes('text/html')) {
      if (res.status === 404 || contentType.includes('text/html')) {
        staticWebmMissing.add(urlPath);
      }
      return null;
    }

    const buf = await res.arrayBuffer();
    if (signal.aborted) return null;

    if (!isValidWebmOrOpusBytes(buf)) {
      staticWebmMissing.add(urlPath);
      return null;
    }

    const blob = new Blob([buf], { type: 'audio/webm; codecs=opus' });
    const objectUrl = URL.createObjectURL(blob);
    staticWebmUrlCache.set(urlPath, objectUrl);
    return objectUrl;
  } catch {
    return null;
  }
}

function playStaticHtmlAudio(
  objectUrl: string,
  session: number,
  subtitleText: string,
  onPlaybackError: () => void
): void {
  if (session !== speechSessionId || soundEngine.isMuted()) return;

  const audio = new Audio(objectUrl);
  audio.preload = 'auto';
  activeStaticAudio = audio;

  clearSpeechTimers();

  const startSubtitleTicker = (durationSec: number) => {
    if (session !== speechSessionId || !subtitleText) return;
    clearSpeechTimers();
    const totalChars = subtitleText.length;
    const safeMs = Number.isFinite(durationSec) && durationSec > 0.15 ? durationSec * 1000 : Math.max(1200, totalChars * 46);
    const stepMs = Math.max(16, Math.floor(safeMs / Math.max(1, totalChars)));
    let revealed = 0;

    emitSpeechState({
      sessionId: session,
      isSpeaking: true,
      fullText: subtitleText,
      visibleLength: 0,
      mode: 'static-webm',
    });

    const advance = () => {
      if (session !== speechSessionId) return;
      revealed = Math.min(totalChars, revealed + 1);
      emitSpeechState({
        sessionId: session,
        isSpeaking: revealed < totalChars,
        fullText: subtitleText,
        visibleLength: revealed,
        mode: 'static-webm',
      });
      if (revealed < totalChars) {
        scheduleSpeechTimer(advance, stepMs);
      }
    };
    scheduleSpeechTimer(advance, stepMs);
  };

  if (subtitleText) {
    emitSpeechState({
      sessionId: session,
      isSpeaking: true,
      fullText: subtitleText,
      visibleLength: 0,
      mode: 'static-webm',
    });
  } else {
    emitSpeechState({
      sessionId: session,
      isSpeaking: true,
      fullText: currentSpeechState.fullText,
      visibleLength: currentSpeechState.fullText.length,
      mode: 'static-webm',
    });
  }

  audio.onloadedmetadata = () => {
    if (session !== speechSessionId) return;
    startSubtitleTicker(audio.duration);
  };

  audio.onended = () => {
    if (activeStaticAudio === audio) {
      activeStaticAudio = null;
    }
    if (session !== speechSessionId) return;
    clearSpeechTimers();
    emitSpeechState({
      sessionId: session,
      isSpeaking: false,
      fullText: subtitleText || currentSpeechState.fullText,
      visibleLength: (subtitleText || currentSpeechState.fullText).length,
      mode: 'static-webm',
    });
  };

  audio.onerror = () => {
    if (activeStaticAudio === audio) {
      activeStaticAudio = null;
    }
    if (session !== speechSessionId) return;
    clearSpeechTimers();
    onPlaybackError();
  };

  const playPromise = audio.play();
  if (playPromise && typeof playPromise.then === 'function') {
    playPromise
      .then(() => {
        if (session === speechSessionId && subtitleText && activeTimers.length === 0) {
          startSubtitleTicker(audio.duration);
        }
      })
      .catch(() => {
        if (activeStaticAudio === audio) {
          activeStaticAudio = null;
        }
        if (session !== speechSessionId) return;
        clearSpeechTimers();
        onPlaybackError();
      });
  }
}

/**
 * Primary Offline-First Lesson & Letter Audio Player:
 * Step 1: Checks static Opus .webm file at `/audio/{subject}/{lessonId}.webm`
 *         and plays immediately from memory/file cache (0 ms repeat, 0 API requests).
 * Step 2: If static .webm does not exist yet, seamlessly falls back to cached
 *         Gemini TTS (`/api/tts`) or browser speech.
 * Always stops any previously playing audio (`audio.pause(); audio.currentTime = 0`)
 * before starting so voices never overlap.
 */
export function playLessonAudio(
  subject: string,
  lessonId: string,
  options: PlayLessonAudioOptions = {}
): void {
  const cleanSubject = subject.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');
  const cleanId = lessonId.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');
  const fallbackText = (options.fallbackText ?? options.subtitleText ?? '').trim();
  const subtitleText = (options.subtitleText ?? fallbackText).trim();
  const lang = options.lang ?? 'uz';

  // Immediately halt any active static HTMLAudioElement, Web Audio buffer, or TTS request
  stopSpeaking();

  const session = speechSessionId;

  if (soundEngine.isMuted()) {
    if (subtitleText) {
      runRetroSpeechTypewriter(subtitleText, session, 32, false);
    }
    return;
  }

  // Unlock Web Audio context synchronously in user gesture in case we fall back to Gemini TTS
  soundEngine.unlockAudio();

  const runFallback = () => {
    if (session !== speechSessionId) return;
    if (!fallbackText) return;
    if (lang === 'en') {
      speakEnglish(fallbackText);
    } else {
      speakUzbek(fallbackText, {
        subtitleText,
        styleHint: options.styleHint,
      });
    }
  };

  if (!cleanSubject || !cleanId || typeof window === 'undefined') {
    runFallback();
    return;
  }

  const urlPath = `/audio/${cleanSubject}/${cleanId}.webm`;

  // Fast path: static .webm already cached in memory -> 0 ms playback, 0 API calls
  const cachedObjectUrl = staticWebmUrlCache.get(urlPath);
  if (cachedObjectUrl) {
    playStaticHtmlAudio(cachedObjectUrl, session, subtitleText, runFallback);
    return;
  }

  // Known missing static file -> skip redundant network check and go straight to TTS cache
  if (staticWebmMissing.has(urlPath)) {
    runFallback();
    return;
  }

  const controller = new AbortController();
  activeTtsAbortController = controller;

  if (subtitleText) {
    emitSpeechState({
      sessionId: session,
      isSpeaking: true,
      fullText: subtitleText,
      visibleLength: 0,
      mode: 'static-webm',
    });
  }

  void resolveStaticWebmObjectUrl(urlPath, controller.signal).then((objectUrl) => {
    if (activeTtsAbortController === controller) {
      activeTtsAbortController = null;
    }
    if (session !== speechSessionId || controller.signal.aborted) return;

    if (objectUrl) {
      playStaticHtmlAudio(objectUrl, session, subtitleText, runFallback);
    } else {
      runFallback();
    }
  });
}

/**
 * Speaks a standalone Uzbek letter or digraph (e.g. "A", "O'", "SH", "Q") clearly:
 * - First checks static `/audio/alifbe/letter_{slug}.webm` (0 API calls)
 * - Falls back to Gemini TTS with authentic Uzbek letter phonics
 */
export function speakUzbekLetter(letter: string, exampleWord?: string): void {
  const cleanLetter = letter.trim();
  if (!cleanLetter) return;
  const display = exampleWord ? `${cleanLetter}, ${exampleWord}` : cleanLetter;
  const key = cleanLetter.toUpperCase().replace(/[‘’`ʻ]/g, "'");
  const spokenLetter = UZ_SINGLE_LETTER_NATIVE[key] ?? cleanLetter.toLowerCase();
  const spoken = exampleWord ? `${spokenLetter}, ${exampleWord.toLowerCase()}` : spokenLetter;

  if (!exampleWord) {
    playLessonAudio('alifbe', resolveLetterAudioId(cleanLetter), {
      fallbackText: spoken,
      subtitleText: display,
      lang: 'uz',
      styleHint: 'letter',
    });
    return;
  }

  speakUzbek(spoken, { subtitleText: display, rate: 0.94, styleHint: 'letter' });
}

/**
 * High-Clarity Uzbek Speech Engine:
 * 1. Studio-grade native Uzbek voice via server-side Gemini 3.8 Flash Lite TTS (/api/tts)
 *    with instant client-side AudioBuffer LRU caching & synchronized karaoke subtitles.
 * 2. Automatic graceful fallback to browser Web Speech (uz-UZ / tr-TR) or cozy retro chimes
 *    if the network is offline or the TTS endpoint is temporarily unavailable.
 */
export function speakUzbek(text: string, options: SpeakUzbekOptions = {}): void {
  const cleaned = text.trim();
  if (!cleaned) return;
  const subtitleText = (options.subtitleText ?? cleaned).trim();

  initVoicesListener();
  // Unlock AudioContext synchronously during user gesture before any async fetch
  const ctx = soundEngine.unlockAudio();

  stopSpeaking();

  const session = speechSessionId;
  const muted = soundEngine.isMuted();
  const charDelayMs = options.charDelayMs ?? 38;

  // Even when muted, animate the visual subtitle smoothly so students can follow along
  if (muted) {
    runRetroSpeechTypewriter(subtitleText, session, Math.max(24, charDelayMs - 6), false);
    return;
  }

  const normalizedForStudio = normalizeUzbekForNativeTts(cleaned);
  const styleHint = options.styleHint ?? 'default';

  if (ctx && normalizedForStudio && typeof fetch === 'function') {
    const cacheKey = `uz:${styleHint}:${normalizedForStudio}`;
    const cachedBuffer = getClientCachedTts(cacheKey);
    if (cachedBuffer) {
      playDecodedStudioSpeech(ctx, cachedBuffer, session, 'studio-uz', subtitleText, 1.0);
      return;
    }

    const controller = new AbortController();
    activeTtsAbortController = controller;

    // Immediately show active speaking indicator while audio streams in
    emitSpeechState({
      sessionId: session,
      isSpeaking: true,
      fullText: subtitleText,
      visibleLength: 0,
      mode: 'studio-uz',
    });

    void fetchStudioTtsBuffer(normalizedForStudio, 'uz', styleHint, ctx, controller.signal).then(
      (decoded) => {
        if (activeTtsAbortController === controller) {
          activeTtsAbortController = null;
        }
        if (session !== speechSessionId || controller.signal.aborted) return;

        if (decoded) {
          playDecodedStudioSpeech(ctx, decoded, session, 'studio-uz', subtitleText, 1.0);
        } else {
          speakUzbekWebSpeechFallback(cleaned, subtitleText, session, options);
        }
      }
    );
    return;
  }

  speakUzbekWebSpeechFallback(cleaned, subtitleText, session, options);
}

// =========================================================================
// STUDIO-GRADE ENGLISH (en-US) PRONUNCIATION FOR INTERACTIVE MINI-GAMES
// =========================================================================

export interface SpeakEnglishOptions {
  /** Playback rate (default 0.96 for natural, clear kid-friendly pronunciation) */
  rate?: number;
  /** Pitch (default 1.0 to keep natural human formants without metallic artifacts) */
  pitch?: number;
}

function speakEnglishWebSpeechFallback(
  cleaned: string,
  session: number,
  options: SpeakEnglishOptions
): void {
  if (session !== speechSessionId || soundEngine.isMuted()) return;
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

  const synthBusy = window.speechSynthesis.speaking || window.speechSynthesis.pending;
  try {
    const { english } = refreshAvailableVoices();
    const utterance = new SpeechSynthesisUtterance(cleaned);
    if (english) {
      utterance.voice = english;
      utterance.lang = english.lang || 'en-US';
    } else {
      utterance.lang = 'en-US';
    }
    utterance.rate = options.rate ?? 0.92;
    utterance.pitch = options.pitch ?? 1.0;

    emitSpeechState({
      sessionId: session,
      isSpeaking: true,
      fullText: currentSpeechState.fullText,
      visibleLength: currentSpeechState.fullText.length,
      mode: 'native-en',
    });

    utterance.onend = () => {
      if (activeUtteranceRef === utterance) activeUtteranceRef = null;
      if (session !== speechSessionId) return;
      emitSpeechState({
        sessionId: session,
        isSpeaking: false,
        fullText: currentSpeechState.fullText,
        visibleLength: currentSpeechState.fullText.length,
        mode: 'native-en',
      });
    };
    utterance.onerror = () => {
      if (activeUtteranceRef === utterance) activeUtteranceRef = null;
      if (session !== speechSessionId) return;
      emitSpeechState({
        sessionId: session,
        isSpeaking: false,
        fullText: currentSpeechState.fullText,
        visibleLength: currentSpeechState.fullText.length,
        mode: 'native-en',
      });
    };

    speakUtteranceSafely(utterance, session, synthBusy);
  } catch {
    // Gracefully ignore restricted speech synthesis environments
  }
}

/**
 * Pronounces an English word or kid-friendly sentence with natural, studio-grade clarity:
 * 1. Primary: Server-side Gemini 3.8 Flash Lite TTS ('Zephyr' native en-US teacher voice)
 *    with instant client-side AudioBuffer LRU caching.
 * 2. Fallback: Highest-ranked en-US/en-GB browser Web Speech voice if offline.
 */
export function speakEnglish(text: string, options: SpeakEnglishOptions = {}): void {
  const cleaned = sanitizeEnglishForTts(text);
  if (!cleaned || soundEngine.isMuted()) return;

  initVoicesListener();
  // Unlock AudioContext synchronously inside the user gesture
  const ctx = soundEngine.unlockAudio();

  // Stop any overlapping speech cleanly before speaking English
  stopSpeaking();
  const session = speechSessionId;

  if (ctx && typeof fetch === 'function') {
    const cacheKey = `en:default:${cleaned}`;
    const cachedBuffer = getClientCachedTts(cacheKey);
    if (cachedBuffer) {
      playDecodedStudioSpeech(ctx, cachedBuffer, session, 'studio-en', '', 1.0);
      return;
    }

    const controller = new AbortController();
    activeTtsAbortController = controller;

    emitSpeechState({
      sessionId: session,
      isSpeaking: true,
      fullText: currentSpeechState.fullText,
      visibleLength: currentSpeechState.fullText.length,
      mode: 'studio-en',
    });

    void fetchStudioTtsBuffer(cleaned, 'en', 'default', ctx, controller.signal).then((decoded) => {
      if (activeTtsAbortController === controller) {
        activeTtsAbortController = null;
      }
      if (session !== speechSessionId || controller.signal.aborted) return;

      if (decoded) {
        playDecodedStudioSpeech(ctx, decoded, session, 'studio-en', '', 1.0);
      } else {
        speakEnglishWebSpeechFallback(cleaned, session, options);
      }
    });
    return;
  }

  speakEnglishWebSpeechFallback(cleaned, session, options);
}

// =========================================================================
// GEMINI / SERVER-SIDE AUDIO STREAM PLAYER (Ready for future Gemini TTS API)
// =========================================================================

function base64ToArrayBuffer(base64Input: string): ArrayBuffer {
  // Strip optional data URI header (e.g. "data:audio/wav;base64,...")
  const cleanBase64 = base64Input.includes(',') ? base64Input.split(',')[1] : base64Input;
  const binaryString = window.atob(cleanBase64.trim());
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

function decodePcm16ToAudioBuffer(
  ctx: AudioContext,
  arrayBuffer: ArrayBuffer,
  sampleRate = 24000,
  numChannels = 1
): AudioBuffer {
  const int16 = new Int16Array(arrayBuffer);
  const frameCount = Math.floor(int16.length / numChannels);
  const audioBuffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let ch = 0; ch < numChannels; ch++) {
    const channelData = audioBuffer.getChannelData(ch);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = int16[i * numChannels + ch] / 32768;
    }
  }
  return audioBuffer;
}

/**
 * Decodes and plays an AudioBuffer, ArrayBuffer (WAV/MP3/OGG or raw PCM16),
 * or Base64 audio string (such as responses from Gemini Audio / TTS APIs).
 * Automatically syncs with stopSpeaking() and optional subtitle typewriter reveal.
 */
export async function playAudioBuffer(
  source: AudioBuffer | ArrayBuffer | string,
  options: PlayAudioBufferOptions = {}
): Promise<void> {
  stopSpeaking();

  const session = speechSessionId;
  const subtitle = options.subtitleText?.trim() ?? '';

  if (soundEngine.isMuted()) {
    if (subtitle) {
      runRetroSpeechTypewriter(subtitle, session, 34, false);
    }
    return;
  }

  const ctx = soundEngine.getAudioContext();
  if (!ctx) {
    if (subtitle) {
      runRetroSpeechTypewriter(subtitle, session, 36, false);
    }
    return;
  }

  let decodedBuffer: AudioBuffer;
  if (typeof source === 'string' || source instanceof ArrayBuffer) {
    const rawArrayBuffer =
      typeof source === 'string' ? base64ToArrayBuffer(source) : source.slice(0);

    if (options.pcmConfig) {
      decodedBuffer = decodePcm16ToAudioBuffer(
        ctx,
        rawArrayBuffer,
        options.pcmConfig.sampleRate ?? 24000,
        options.pcmConfig.numChannels ?? 1
      );
    } else {
      decodedBuffer = await ctx.decodeAudioData(rawArrayBuffer);
    }
  } else {
    decodedBuffer = source;
  }

  // Abort cleanly if stopSpeaking() was called while decoding
  if (session !== speechSessionId) return;

  return new Promise<void>((resolve) => {
    const bufferSource = ctx.createBufferSource();
    const gainNode = ctx.createGain();
    bufferSource.buffer = decodedBuffer;
    gainNode.gain.setValueAtTime(options.volume ?? 1.0, ctx.currentTime);

    bufferSource.connect(gainNode);
    gainNode.connect(ctx.destination);
    activeAudioSource = bufferSource;

    // Optional synchronized typewriter subtitle matched to exact audio duration
    if (subtitle) {
      const totalChars = subtitle.length;
      const durationMs = Math.max(300, decodedBuffer.duration * 1000);
      const stepMs = Math.max(18, Math.floor(durationMs / Math.max(1, totalChars)));
      let revealed = 0;

      emitSpeechState({
        sessionId: session,
        isSpeaking: true,
        fullText: subtitle,
        visibleLength: 0,
        mode: 'audio-buffer',
      });

      const advance = () => {
        if (session !== speechSessionId) return;
        revealed = Math.min(totalChars, revealed + 1);
        emitSpeechState({
          sessionId: session,
          isSpeaking: revealed < totalChars,
          fullText: subtitle,
          visibleLength: revealed,
          mode: 'audio-buffer',
        });
        if (revealed < totalChars) {
          scheduleSpeechTimer(advance, stepMs);
        }
      };
      scheduleSpeechTimer(advance, stepMs);
    }

    bufferSource.onended = () => {
      if (activeAudioSource === bufferSource) {
        activeAudioSource = null;
      }
      if (session === speechSessionId) {
        clearSpeechTimers();
        if (subtitle) {
          emitSpeechState({
            sessionId: session,
            isSpeaking: false,
            fullText: subtitle,
            visibleLength: subtitle.length,
            mode: 'audio-buffer',
          });
        }
      }
      resolve();
    };

    bufferSource.start(0);
  });
}
