class SoundEngine {
  private ctx: AudioContext | null = null;
  private muted = false;

  private ensureContext(): AudioContext | null {
    if (this.muted) return null;
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return null;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setMuted(mute: boolean): void {
    this.muted = mute;
  }

  public isMuted(): boolean {
    return this.muted;
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
}

export const soundEngine = new SoundEngine();

export function stopSpeaking(): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
  } catch {
    // Ignore speech synthesis errors on restricted environments
  }
}

export function speakUzbek(text: string): void {
  if (soundEngine.isMuted()) return;
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  const cleaned = text.trim();
  if (!cleaned) return;

  try {
    const synth = window.speechSynthesis;
    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(cleaned);
    utterance.lang = 'uz-UZ';
    utterance.rate = 0.85;
    utterance.pitch = 1.05;

    const voices = synth.getVoices();
    const uzVoice =
      voices.find((v) => /^uz/i.test(v.lang)) ||
      voices.find((v) => /uzbek/i.test(v.name));
    if (uzVoice) {
      utterance.voice = uzVoice;
    }

    synth.speak(utterance);
  } catch {
    // Gracefully ignore if browser blocks synthesis
  }
}

