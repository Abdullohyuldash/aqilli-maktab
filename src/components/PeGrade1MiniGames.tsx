import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Check, RotateCcw } from 'lucide-react';
import type { PeGameType, PeRound } from '../data/curriculum';
import { soundEngine } from '../utils/sound';

export const PE_GAME_TITLES: Record<PeGameType, string> = {
  line_formation: 'Safga turish va komandalar',
  number_reaction: 'Raqamga tezkor reaksiya',
  train_route: 'Poyezd va tunnellardan o‘tish',
  warmup_rhythm: 'Badantarbiya ritmi',
  day_night_freeze: 'Kun va tun harakatli o‘yini',
  tag_chase: 'Quvlashmachoq va chaqqonlik',
  relay_race: 'Estafeta va tezkor yugurish',
  gymnastics_balance: 'Gimnastika va muvozanat',
  jump_power: 'Sakrash kuchi va arg‘amchi',
  ball_throw: 'To‘pni nishonga uloqtirish',
  checkers_intro: 'Shashka taxtasi va yurishlar',
};

export interface PeGrade1StageProps {
  round: PeRound;
  solved: boolean;
  onSolve: () => void;
  onStepSuccess?: (message?: string) => void;
  onStepMistake?: (teacherHint: string) => void;
}

// Helper deterministic shuffle based on ids
function deterministicShuffle<T extends { id: string }>(items: T[]): T[] {
  if (items.length <= 1) return items;
  if (items.length === 2) return [items[1], items[0]];
  if (items.length === 3) return [items[2], items[0], items[1]];
  return [items[2], items[0], items[3], items[1], ...items.slice(4)];
}

// =========================================================================
// 1. LINE FORMATION (Safga turish va komandalar)
// =========================================================================
export const LineFormationStage: React.FC<PeGrade1StageProps> = ({
  round,
  solved,
  onSolve,
  onStepSuccess,
  onStepMistake,
}) => {
  const data = round.lineData ?? { mode: 'command_pick', choices: [] };
  const [placed, setPlaced] = useState<string[]>([]);
  const [wrongId, setWrongId] = useState<string | null>(null);
  const [pickedChoice, setPickedChoice] = useState<string | null>(null);

  const steps = data.steps ?? [];
  const shuffledSteps = useMemo(() => deterministicShuffle(steps), [steps]);

  if (data.mode === 'order_steps') {
    const nextExpected = steps[placed.length];
    const handlePick = (id: string) => {
      if (solved || placed.includes(id)) return;
      if (nextExpected && id === nextExpected.id) {
        const next = [...placed, id];
        setPlaced(next);
        setWrongId(null);
        soundEngine.playFruitPluck(next.length);
        if (next.length === steps.length) {
          onSolve();
        } else {
          onStepSuccess?.(`To‘g‘ri! ${next.length}-qadam joyiga tushdi!`);
        }
      } else {
        setWrongId(id);
        soundEngine.playWrong();
        onStepMistake?.(
          nextExpected
            ? `Hozir ${placed.length + 1}-bo‘lib «${nextExpected.label}»ni tanlash kerak!`
            : round.teacherHint || 'Qadamlarni boshidan oxirigacha tartib bilan tanla!'
        );
        window.setTimeout(() => setWrongId(null), 500);
      }
    };

    return (
      <div className="space-y-3">
        <div className="rounded-2xl bg-gradient-to-b from-sky-50 to-white border-2 border-sky-200 p-3.5">
          <div className="flex items-center justify-between text-xs font-bold text-sky-900 mb-2">
            <span>📏 Saf tartibi ({placed.length} / {steps.length})</span>
            <span>{solved ? 'Saf tayyor!' : `Keyingi: ${placed.length + 1}-o‘rin`}</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {steps.map((step, idx) => {
              const done = placed.includes(step.id) || solved;
              return (
                <div
                  key={step.id}
                  className={`rounded-xl border-2 px-2.5 py-2.5 text-center transition-all ${
                    done
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
                      : 'bg-white/80 border-dashed border-sky-300 text-slate-400'
                  }`}
                >
                  <div className="text-[11px] font-mono-num font-bold mb-0.5">{idx + 1}-qadam</div>
                  <div className="text-2xl leading-none">{done ? step.emoji : '❓'}</div>
                  <div className="text-xs font-bold mt-1 leading-tight">
                    {done ? step.label : 'Tanlang...'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {shuffledSteps.map((step) => {
            const used = placed.includes(step.id) || solved;
            const isWrong = wrongId === step.id;
            return (
              <button
                key={step.id}
                type="button"
                disabled={used}
                onClick={() => handlePick(step.id)}
                className={`rounded-xl border-2 px-3 py-3 text-center transition-all cursor-pointer ${
                  used
                    ? 'bg-slate-100 border-slate-200 text-slate-400 opacity-60 cursor-default'
                    : isWrong
                    ? 'bg-rose-50 border-rose-500 text-rose-900'
                    : 'bg-white border-slate-200 hover:border-sky-500 hover:bg-sky-50 text-slate-900 shadow-xs'
                }`}
              >
                <div className="text-2xl mb-1">{step.emoji}</div>
                <div className="text-xs sm:text-sm font-bold leading-snug">{step.label}</div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  const choices = data.choices ?? [];
  const handleChoice = (id: string, isCorrect: boolean) => {
    if (solved) return;
    setPickedChoice(id);
    if (isCorrect) {
      onSolve();
    } else {
      soundEngine.playWrong();
      onStepMistake?.(round.teacherHint || 'Komandani diqqat bilan o‘qib to‘g‘risini tanla!');
    }
  };

  return (
    <div className="space-y-3">
      <div className="rounded-2xl bg-gradient-to-r from-sky-600 to-blue-600 text-white px-4 py-3.5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <span className="text-3xl" aria-hidden="true">👨‍🏫</span>
          <div>
            <div className="text-[11px] uppercase tracking-wide text-sky-100 font-bold">
              Ustoz Rustam komandasi:
            </div>
            <div className="font-display font-extrabold text-lg sm:text-xl">
              {data.commandBadge ?? 'Safga turing!'}
            </div>
          </div>
        </div>
        <span className="text-2xl">📢</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {choices.map((ch) => {
          const picked = pickedChoice === ch.id;
          let cls = 'bg-white border-slate-200 hover:border-sky-500 hover:bg-sky-50 text-slate-900';
          if (solved && ch.isCorrect) {
            cls = 'bg-emerald-50 border-emerald-500 text-emerald-950 shadow-sm';
          } else if (picked && !ch.isCorrect) {
            cls = 'bg-rose-50 border-rose-500 text-rose-900';
          }
          return (
            <button
              key={ch.id}
              type="button"
              disabled={solved}
              onClick={() => handleChoice(ch.id, ch.isCorrect)}
              className={`rounded-2xl border-2 p-3.5 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${cls}`}
            >
              <span className="text-3xl leading-none">{ch.emoji}</span>
              <span className="text-xs sm:text-sm font-bold leading-snug">{ch.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// =========================================================================
// 2. NUMBER REACTION (Raqam va signalga tezkor reaksiya)
// =========================================================================
export const NumberReactionStage: React.FC<PeGrade1StageProps> = ({
  round,
  solved,
  onSolve,
  onStepSuccess,
  onStepMistake,
}) => {
  const data = round.reactionData ?? { cues: [], buttons: [] };
  const [stepIdx, setStepIdx] = useState(0);
  const [wrongBtn, setWrongBtn] = useState<number | null>(null);

  const cues = data.cues;
  const activeCue = cues[stepIdx];

  const handlePress = (num: number) => {
    if (solved || !activeCue) return;
    if (num === activeCue.targetNumber) {
      const next = stepIdx + 1;
      setWrongBtn(null);
      soundEngine.playFruitPluck(next);
      if (next >= cues.length) {
        setStepIdx(next);
        onSolve();
      } else {
        setStepIdx(next);
        onStepSuccess?.(`Tezkor javob! Endi ${cues[next].targetNumber}-signalni bos!`);
      }
    } else {
      setWrongBtn(num);
      soundEngine.playWrong();
      onStepMistake?.(
        `Diqqat! Hozir ${activeCue.targetNumber}-raqam («${activeCue.label}») ni bosish kerak!`
      );
      window.setTimeout(() => setWrongBtn(null), 450);
    }
  };

  return (
    <div className="space-y-3">
      {/* Live Scoreboard */}
      <div className="rounded-2xl bg-slate-900 text-white px-4 py-4 flex items-center justify-between gap-3 border-2 border-sky-400">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-sky-500 flex items-center justify-center font-mono-num font-extrabold text-3xl shadow-md">
            {solved ? '✓' : activeCue?.targetNumber ?? '1'}
          </div>
          <div>
            <div className="text-xs text-sky-300 font-bold">
              {solved ? 'Barcha signallar bajarildi!' : `${activeCue?.actionText ?? ''} (${stepIdx + 1}/${cues.length})`}
            </div>
            <div className="font-display font-extrabold text-lg sm:text-xl">
              {solved ? 'A’lo reaksiya! 🏅' : `${activeCue?.emoji ?? ''} ${activeCue?.label ?? ''}`}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {cues.map((c, idx) => (
            <span
              key={idx}
              className={`w-7 h-7 rounded-lg font-mono-num text-xs font-extrabold flex items-center justify-center ${
                idx < stepIdx || solved
                  ? 'bg-emerald-500 text-white'
                  : idx === stepIdx
                  ? 'bg-amber-400 text-slate-950 animate-pulse'
                  : 'bg-slate-700 text-slate-400'
              }`}
            >
              {c.targetNumber}
            </span>
          ))}
        </div>
      </div>

      {/* Reaction Buttons */}
      <div className={`grid gap-2.5 ${data.buttons.length === 4 ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-3'}`}>
        {data.buttons.map((btn) => {
          const isWrong = wrongBtn === btn.number;
          return (
            <button
              key={btn.number}
              type="button"
              disabled={solved}
              onClick={() => handlePress(btn.number)}
              className={`rounded-2xl border-2 p-3 text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                solved
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                  : isWrong
                  ? 'bg-rose-100 border-rose-500 text-rose-900 scale-95'
                  : 'bg-white border-slate-200 hover:border-sky-500 hover:bg-sky-50 active:scale-95 text-slate-900 shadow-xs'
              }`}
            >
              <span className="font-mono-num text-xs font-extrabold px-2 py-0.5 rounded-md bg-sky-100 text-sky-800">
                {btn.number}
              </span>
              <span className="text-2xl leading-none mt-0.5">{btn.emoji}</span>
              <span className="text-xs sm:text-sm font-bold">{btn.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// =========================================================================
// 3. TRAIN ROUTE (Poyezd va tunnellardan o'tish)
// =========================================================================
export const TrainRouteStage: React.FC<PeGrade1StageProps> = ({
  round,
  solved,
  onSolve,
  onStepSuccess,
  onStepMistake,
}) => {
  const data = round.trainData ?? { mode: 'build_route', stations: [] };
  const [reachedCount, setReachedCount] = useState(0);
  const [wrongId, setWrongId] = useState<string | null>(null);
  const [pickedChoice, setPickedChoice] = useState<string | null>(null);

  const stations = data.stations;
  const shuffledStations = useMemo(() => deterministicShuffle(stations), [stations]);

  if (data.mode === 'steer_obstacle') {
    const choices = data.choices ?? [];
    const handlePick = (id: string, isCorrect: boolean) => {
      if (solved) return;
      setPickedChoice(id);
      if (isCorrect) {
        onSolve();
      } else {
        soundEngine.playWrong();
        onStepMistake?.(round.teacherHint || 'Poyezd xavfsiz o‘tishi uchun to‘g‘ri usulni tanla!');
      }
    };

    return (
      <div className="space-y-3">
        <div className="rounded-2xl bg-gradient-to-r from-amber-50 via-sky-50 to-emerald-50 border-2 border-sky-200 p-4 flex items-center justify-around">
          <motion.div
            animate={solved ? { x: [0, 80, 120] } : { x: [0, 8, 0] }}
            transition={{ duration: solved ? 0.9 : 1.8, repeat: solved ? 0 : Infinity }}
            className="text-4xl"
          >
            🚂🚃🚃
          </motion.div>
          <div className="text-center">
            <div className="text-3xl">{stations[1]?.emoji ?? '🚇'}</div>
            <div className="text-xs font-bold text-slate-700 mt-1">{stations[1]?.label ?? 'To‘siq'}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {choices.map((ch) => {
            const isPicked = pickedChoice === ch.id;
            let cls = 'bg-white border-slate-200 hover:border-sky-500 hover:bg-sky-50 text-slate-900';
            if (solved && ch.isCorrect) cls = 'bg-emerald-50 border-emerald-500 text-emerald-950';
            else if (isPicked && !ch.isCorrect) cls = 'bg-rose-50 border-rose-500 text-rose-900';
            return (
              <button
                key={ch.id}
                type="button"
                disabled={solved}
                onClick={() => handlePick(ch.id, ch.isCorrect)}
                className={`rounded-2xl border-2 p-3.5 text-center cursor-pointer transition-all flex flex-col items-center gap-1.5 ${cls}`}
              >
                <span className="text-3xl leading-none">{ch.emoji}</span>
                <span className="text-xs sm:text-sm font-bold leading-snug">{ch.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  const nextStation = stations[reachedCount];
  const handleStationPick = (id: string) => {
    if (solved || !nextStation) return;
    if (id === nextStation.id) {
      const next = reachedCount + 1;
      setReachedCount(next);
      setWrongId(null);
      soundEngine.playFruitPluck(next);
      if (next >= stations.length) {
        onSolve();
      } else {
        onStepSuccess?.(`Poyezd «${nextStation.label}»dan o‘tdi!`);
      }
    } else {
      setWrongId(id);
      soundEngine.playWrong();
      onStepMistake?.(`Keyingi bekat — «${nextStation.label}»!`);
      window.setTimeout(() => setWrongId(null), 450);
    }
  };

  return (
    <div className="space-y-3">
      {/* Track Visual */}
      <div className="rounded-2xl bg-sky-50 border-2 border-sky-200 p-3.5">
        <div className="flex items-center justify-between text-xs font-bold text-sky-900 mb-2">
          <span>🚂 Poyezd yo‘li ({reachedCount} / {stations.length})</span>
          <span>{solved ? 'Marraga yetdi!' : `Navbat: ${nextStation?.label ?? ''}`}</span>
        </div>
        <div className="grid grid-cols-4 gap-2 relative">
          {stations.map((st, idx) => {
            const done = idx < reachedCount || solved;
            return (
              <div
                key={st.id}
                className={`rounded-xl border-2 p-2 text-center transition-all ${
                  done
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
                    : idx === reachedCount
                    ? 'bg-amber-50 border-amber-400 text-amber-950'
                    : 'bg-white border-dashed border-slate-300 text-slate-400'
                }`}
              >
                <div className="text-xl leading-none">{done ? st.emoji : idx === reachedCount ? '🚂' : '⬜'}</div>
                <div className="text-[11px] font-bold mt-1 leading-tight truncate">{st.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {shuffledStations.map((st) => {
          const stIndex = stations.findIndex((s) => s.id === st.id);
          const done = stIndex < reachedCount || solved;
          const isWrong = wrongId === st.id;
          return (
            <button
              key={st.id}
              type="button"
              disabled={done}
              onClick={() => handleStationPick(st.id)}
              className={`rounded-xl border-2 p-2.5 text-center transition-all cursor-pointer ${
                done
                  ? 'bg-slate-100 border-slate-200 text-slate-400 opacity-60 cursor-default'
                  : isWrong
                  ? 'bg-rose-50 border-rose-500 text-rose-900'
                  : 'bg-white border-slate-200 hover:border-sky-500 hover:bg-sky-50 text-slate-900'
              }`}
            >
              <div className="text-2xl leading-none">{st.emoji}</div>
              <div className="text-xs font-bold mt-1 leading-tight">{st.label}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// =========================================================================
// 4. WARMUP RHYTHM (Ertalabki badantarbiya va ritm)
// =========================================================================
export const WarmupRhythmStage: React.FC<PeGrade1StageProps> = ({
  round,
  solved,
  onSolve,
  onStepSuccess,
  onStepMistake,
}) => {
  const data = round.warmupData ?? { mode: 'sequence', poses: [] };
  const [doneIdx, setDoneIdx] = useState(0);
  const [wrongId, setWrongId] = useState<string | null>(null);

  const poses = data.poses;
  const shuffledPoses = useMemo(() => deterministicShuffle(poses), [poses]);

  if (data.mode === 'rhythm_tap') {
    const targetTaps = data.targetTaps ?? poses.length;
    const activePose = poses[Math.min(doneIdx, poses.length - 1)];

    const handleBeatTap = () => {
      if (solved) return;
      const next = doneIdx + 1;
      setDoneIdx(next);
      soundEngine.playFruitPluck(next);
      if (next >= targetTaps) {
        onSolve();
      } else {
        onStepSuccess?.(`${poses[next - 1]?.countCue ?? next} — Zo‘r ritm!`);
      }
    };

    return (
      <div className="space-y-3">
        <div className="rounded-2xl bg-gradient-to-b from-sky-50 to-emerald-50 border-2 border-sky-200 p-4 flex items-center justify-between gap-4">
          <motion.div
            key={doneIdx}
            initial={{ scale: 0.85, y: 4 }}
            animate={{ scale: 1, y: 0 }}
            className="w-20 h-20 rounded-2xl bg-white border-2 border-sky-300 shadow-sm flex items-center justify-center text-5xl shrink-0"
          >
            {activePose?.emoji ?? '🤸'}
          </motion.div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-sky-800">
              Sanoq: {doneIdx} / {targetTaps}
            </div>
            <div className="font-display font-extrabold text-lg text-slate-900 truncate">
              {solved ? 'Mashq a’lo bajarildi! 💪' : activePose?.label ?? 'Mashq'}
            </div>
            <div className="mt-2 flex items-center gap-1.5">
              {Array.from({ length: targetTaps }).map((_, i) => (
                <div
                  key={i}
                  className={`h-2.5 flex-1 rounded-full transition-colors ${
                    i < doneIdx || solved ? 'bg-emerald-500' : 'bg-slate-200'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <button
          type="button"
          disabled={solved}
          onClick={handleBeatTap}
          className={`w-full py-3.5 px-6 rounded-2xl font-display font-extrabold text-base shadow-md transition-all cursor-pointer ${
            solved
              ? 'bg-emerald-600 text-white cursor-default'
              : 'bg-sky-600 hover:bg-sky-700 active:scale-[0.98] text-white'
          }`}
        >
          {solved
            ? 'Bajarildi! ✓'
            : `🎵 Mashqni bajar! (${activePose?.countCue ?? `${doneIdx + 1}`})`}
        </button>
      </div>
    );
  }

  const nextExpected = poses[doneIdx];
  const handleSeqPick = (id: string) => {
    if (solved || !nextExpected) return;
    if (id === nextExpected.id) {
      const next = doneIdx + 1;
      setDoneIdx(next);
      setWrongId(null);
      soundEngine.playFruitPluck(next);
      if (next >= poses.length) {
        onSolve();
      } else {
        onStepSuccess?.(`Barakalla! Endi «${poses[next].label}» mashqini tanla!`);
      }
    } else {
      setWrongId(id);
      soundEngine.playWrong();
      onStepMistake?.(`Avval «${nextExpected.label}»ni bajarish kerak!`);
      window.setTimeout(() => setWrongId(null), 450);
    }
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        {poses.map((p, idx) => {
          const done = idx < doneIdx || solved;
          return (
            <div
              key={p.id}
              className={`rounded-xl border-2 p-2.5 text-center transition-all ${
                done
                  ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
                  : idx === doneIdx
                  ? 'bg-amber-50 border-amber-400 text-amber-950'
                  : 'bg-slate-50 border-dashed border-slate-300 text-slate-400'
              }`}
            >
              <div className="text-[11px] font-mono-num font-bold">{p.countCue}</div>
              <div className="text-2xl my-0.5">{done ? p.emoji : '🏃'}</div>
              <div className="text-xs font-bold leading-tight">{done ? p.label : 'Kutmoqda...'}</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {shuffledPoses.map((p) => {
          const idx = poses.findIndex((x) => x.id === p.id);
          const done = idx < doneIdx || solved;
          const isWrong = wrongId === p.id;
          return (
            <button
              key={p.id}
              type="button"
              disabled={done}
              onClick={() => handleSeqPick(p.id)}
              className={`rounded-xl border-2 p-3 text-center transition-all cursor-pointer ${
                done
                  ? 'bg-slate-100 border-slate-200 text-slate-400 opacity-60 cursor-default'
                  : isWrong
                  ? 'bg-rose-50 border-rose-500 text-rose-900'
                  : 'bg-white border-slate-200 hover:border-sky-500 hover:bg-sky-50 text-slate-900'
              }`}
            >
              <div className="text-2xl">{p.emoji}</div>
              <div className="text-xs sm:text-sm font-bold mt-1">{p.label}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// =========================================================================
// 5. DAY NIGHT FREEZE ("Kun va tun" harakatli o'yini)
// =========================================================================
export const DayNightFreezeStage: React.FC<PeGrade1StageProps> = ({
  round,
  solved,
  onSolve,
  onStepSuccess,
  onStepMistake,
}) => {
  const data = round.dayNightData ?? {
    requiredCycles: 2,
    dayCommand: '☀️ KUN — Yugur!',
    nightCommand: '🌙 TUN — Qotib tur!',
  };
  const [phase, setPhase] = useState<'day' | 'night'>('day');
  const [cyclesDone, setCyclesDone] = useState(0);
  const [runnerX, setRunnerX] = useState(10);

  const handleAction = (picked: 'run' | 'freeze') => {
    if (solved) return;
    if (phase === 'day') {
      if (picked === 'run') {
        soundEngine.playFruitPluck(cyclesDone + 1);
        setRunnerX((x) => Math.min(88, x + 20));
        setPhase('night');
        onStepSuccess?.('Zo‘r! Endi TUN bo‘ldi — darhol «Qotib tur!»ni bos!');
      } else {
        soundEngine.playWrong();
        onStepMistake?.('Hozir KUN ☀️! Kunduzi «Yugur!» tugmasini bosish kerak!');
      }
    } else {
      if (picked === 'freeze') {
        const nextCycles = cyclesDone + 1;
        setCyclesDone(nextCycles);
        soundEngine.playFruitPluck(nextCycles + 2);
        if (nextCycles >= data.requiredCycles) {
          setRunnerX(90);
          onSolve();
        } else {
          setPhase('day');
          onStepSuccess?.('Barakalla, haykaldek qotding! Yana KUN bo‘ldi!');
        }
      } else {
        soundEngine.playWrong();
        onStepMistake?.('TUN 🌙 paytida yugurish mumkin emas! Darhol «Qotib tur!»ni bos!');
      }
    }
  };

  return (
    <div className="space-y-3">
      <div
        className={`rounded-2xl border-2 p-4 transition-colors duration-300 ${
          phase === 'day'
            ? 'bg-gradient-to-b from-amber-100 via-sky-100 to-emerald-100 border-amber-300 text-slate-900'
            : 'bg-gradient-to-b from-indigo-950 via-slate-900 to-indigo-900 border-indigo-500 text-white'
        }`}
      >
        <div className="flex items-center justify-between text-xs font-bold mb-2">
          <span>{phase === 'day' ? data.dayCommand : data.nightCommand}</span>
          <span>
            Bosqich: {cyclesDone} / {data.requiredCycles}
          </span>
        </div>

        <div className="relative h-20 rounded-xl bg-black/10 overflow-hidden flex items-center px-3">
          <div className="absolute right-3 top-2 text-2xl">{phase === 'day' ? '☀️' : '🌙'}</div>
          <motion.div
            animate={{ left: `${runnerX}%` }}
            transition={{ type: 'spring', stiffness: 180, damping: 18 }}
            className="absolute bottom-2 -translate-x-1/2 text-4xl"
          >
            {phase === 'night' ? '🧍' : '🏃'}
          </motion.div>
          <div className="absolute right-3 bottom-2 text-2xl">🏁</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          disabled={solved}
          onClick={() => handleAction('run')}
          className="py-3.5 px-4 rounded-2xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-display font-extrabold text-base shadow-sm cursor-pointer disabled:opacity-50"
        >
          🏃 Yugur! (Kun)
        </button>
        <button
          type="button"
          disabled={solved}
          onClick={() => handleAction('freeze')}
          className="py-3.5 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-display font-extrabold text-base shadow-sm cursor-pointer disabled:opacity-50"
        >
          🧊 Qotib tur! (Tun)
        </button>
      </div>
    </div>
  );
};

// =========================================================================
// 6. TAG CHASE (Quvlashmachoq va "To'pga tegma")
// =========================================================================
export const TagChaseStage: React.FC<PeGrade1StageProps> = ({
  round,
  solved,
  onSolve,
  onStepSuccess,
  onStepMistake,
}) => {
  const data = round.tagData ?? {
    mode: 'escape_grid',
    targetSteps: 4,
    chaserEmoji: '🦊',
    chaserLabel: 'Tutuvchi',
    goalEmoji: '🏠',
    goalLabel: 'Xavfsiz uy',
  };

  const cols = data.targetSteps;
  const rows = 3;
  // Deterministic danger row per column
  const dangerRows = useMemo(
    () => Array.from({ length: cols }, (_, c) => (c * 2 + 1) % rows),
    [cols]
  );

  const [currentCol, setCurrentCol] = useState(0);
  const [playerRow, setPlayerRow] = useState(1);
  const [wrongCell, setWrongCell] = useState<string | null>(null);

  const handleCellClick = (r: number, c: number) => {
    if (solved || c !== currentCol) return;
    if (r === dangerRows[c]) {
      setWrongCell(`${r}-${c}`);
      soundEngine.playWrong();
      onStepMistake?.(
        data.mode === 'dodge_ball'
          ? 'Ehtiyot bo‘l! Bu qatordan to‘p uchib kelyapti — boshqa bo‘sh yashil katakni tanla!'
          : `Voy! ${data.chaserLabel} shu katakda turibdi! Boshqa xavfsiz yo‘lakni tanla!`
      );
      window.setTimeout(() => setWrongCell(null), 500);
      return;
    }

    setPlayerRow(r);
    const nextCol = currentCol + 1;
    setCurrentCol(nextCol);
    soundEngine.playFruitPluck(nextCol);
    if (nextCol >= cols) {
      onSolve();
    } else {
      onStepSuccess?.(`Chaqqon! Endi ${nextCol + 1}-qadamda xavfsiz yo‘lakni tanla!`);
    }
  };

  return (
    <div className="space-y-3">
      <div className="rounded-2xl bg-emerald-50/70 border-2 border-emerald-200 p-3">
        <div className="flex items-center justify-between text-xs font-bold text-emerald-900 mb-2">
          <span>🏃 Qadam: {currentCol} / {cols}</span>
          <span>
            {data.goalEmoji} {data.goalLabel}
          </span>
        </div>

        <div
          className="grid gap-1.5"
          style={{ gridTemplateColumns: `repeat(${cols + 1}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: rows }).map((_, r) => (
            <React.Fragment key={r}>
              {Array.from({ length: cols }).map((__, c) => {
                const isDanger = r === dangerRows[c];
                const isNextCol = c === currentCol && !solved;
                const isVisited = c < currentCol && r === playerRow;
                const isWrong = wrongCell === `${r}-${c}`;
                return (
                  <button
                    key={`${r}-${c}`}
                    type="button"
                    disabled={!isNextCol}
                    onClick={() => handleCellClick(r, c)}
                    className={`h-12 rounded-xl border-2 flex items-center justify-center text-xl transition-all ${
                      isWrong
                        ? 'bg-rose-500 border-rose-700 text-white'
                        : isDanger
                        ? 'bg-rose-100 border-rose-300 text-rose-800'
                        : isVisited
                        ? 'bg-sky-100 border-sky-400'
                        : isNextCol
                        ? 'bg-emerald-100 border-emerald-500 hover:bg-emerald-200 cursor-pointer shadow-xs'
                        : 'bg-white border-slate-200 opacity-65'
                    }`}
                  >
                    {isDanger
                      ? data.chaserEmoji
                      : c === currentCol - 1 && r === playerRow
                      ? '🏃'
                      : isNextCol
                      ? '🟢'
                      : ''}
                  </button>
                );
              })}
              {/* Final Goal Column */}
              <div
                className={`h-12 rounded-xl border-2 flex items-center justify-center text-xl ${
                  solved && r === playerRow
                    ? 'bg-amber-300 border-amber-500'
                    : 'bg-amber-50 border-amber-300'
                }`}
              >
                {r === 1 ? data.goalEmoji : '✨'}
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// 7. RELAY RACE (Estafeta va to'siqlar osha yugurish)
// =========================================================================
export const RelayRaceStage: React.FC<PeGrade1StageProps> = ({
  round,
  solved,
  onSolve,
  onStepSuccess,
  onStepMistake,
}) => {
  const data = round.relayData ?? {
    mode: 'baton_pass',
    runnerEmoji: '🏃',
    itemEmoji: '🥢',
    itemLabel: 'Estafeta',
    targetSteps: 6,
  };

  const [stepsDone, setStepsDone] = useState(0);
  const [lastFoot, setLastFoot] = useState<'left' | 'right' | null>(null);
  const hurdleSteps = useMemo(
    () => (data.mode === 'hurdle_run' ? new Set([2, 4]) : new Set<number>()),
    [data.mode]
  );

  const needsJump = hurdleSteps.has(stepsDone) && !solved;
  const pct = solved ? 100 : Math.round((stepsDone / data.targetSteps) * 100);

  const advance = (foot: 'left' | 'right' | 'jump') => {
    if (solved) return;
    if (needsJump && foot !== 'jump') {
      soundEngine.playWrong();
      onStepMistake?.('Oldinda to‘siq bor! «🦘 Sakra!» tugmasini bosib oshib o‘t!');
      return;
    }
    if (!needsJump && foot === 'jump') {
      soundEngine.playWrong();
      onStepMistake?.('To‘siq yo‘q — chap va o‘ng oyoq bilan tez yugur!');
      return;
    }
    if (foot !== 'jump' && lastFoot === foot) {
      soundEngine.playWrong();
      onStepMistake?.(
        foot === 'left'
          ? 'Endi O‘NG oyoq tugmasini bos!'
          : 'Endi CHAP oyoq tugmasini bos!'
      );
      return;
    }

    if (foot !== 'jump') setLastFoot(foot);
    const next = stepsDone + 1;
    setStepsDone(next);
    soundEngine.playFruitPluck(next);
    if (next >= data.targetSteps) {
      onSolve();
    } else if (hurdleSteps.has(next)) {
      onStepSuccess?.('Diqqat, oldinda to‘siq! Endi «Sakra!» tugmasini bos!');
    }
  };

  return (
    <div className="space-y-3">
      {/* Running Lane */}
      <div className="rounded-2xl bg-gradient-to-b from-sky-50 to-orange-50 border-2 border-orange-200 p-4">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
          <span>
            {data.itemEmoji} {data.itemLabel} ({stepsDone} / {data.targetSteps})
          </span>
          <span>{solved ? 'Marraga yetding! 🏁' : needsJump ? '🚧 TO‘SIQ!' : '🏃 Tez yugur!'}</span>
        </div>

        <div className="relative h-16 rounded-xl bg-orange-200/70 border border-orange-300 overflow-hidden px-4 flex items-center">
          {/* Lane stripes */}
          <div className="absolute inset-x-0 top-1/2 border-t-2 border-dashed border-white/70" />
          {/* Hurdles */}
          {Array.from(hurdleSteps).map((hs) => (
            <div
              key={hs}
              style={{ left: `${Math.round(((hs + 0.5) / data.targetSteps) * 86) + 4}%` }}
              className="absolute bottom-1 text-2xl -translate-x-1/2"
            >
              🚧
            </div>
          ))}
          <motion.div
            animate={{ left: `${Math.min(90, 6 + pct * 0.84)}%` }}
            transition={{ type: 'spring', stiffness: 220, damping: 20 }}
            className="absolute bottom-2 -translate-x-1/2 text-3xl z-10"
          >
            {data.runnerEmoji}
          </motion.div>
          <div className="absolute right-2.5 bottom-2 text-2xl">🏁</div>
        </div>
      </div>

      {/* Controls */}
      <div className={`grid gap-2.5 ${data.mode === 'hurdle_run' ? 'grid-cols-3' : 'grid-cols-2'}`}>
        <button
          type="button"
          disabled={solved}
          onClick={() => advance('left')}
          className={`py-3.5 px-3 rounded-2xl border-2 font-display font-extrabold text-sm sm:text-base transition-all cursor-pointer ${
            lastFoot === 'right' || lastFoot === null
              ? 'bg-sky-600 border-sky-700 text-white hover:bg-sky-700'
              : 'bg-slate-100 border-slate-200 text-slate-600'
          }`}
        >
          🦶 Chap oyoq
        </button>

        {data.mode === 'hurdle_run' && (
          <button
            type="button"
            disabled={solved}
            onClick={() => advance('jump')}
            className={`py-3.5 px-3 rounded-2xl border-2 font-display font-extrabold text-sm sm:text-base transition-all cursor-pointer ${
              needsJump
                ? 'bg-amber-500 border-amber-600 text-white animate-pulse'
                : 'bg-amber-50 border-amber-200 text-amber-800'
            }`}
          >
            🦘 Sakra!
          </button>
        )}

        <button
          type="button"
          disabled={solved}
          onClick={() => advance('right')}
          className={`py-3.5 px-3 rounded-2xl border-2 font-display font-extrabold text-sm sm:text-base transition-all cursor-pointer ${
            lastFoot === 'left'
              ? 'bg-sky-600 border-sky-700 text-white hover:bg-sky-700'
              : 'bg-slate-100 border-slate-200 text-slate-600'
          }`}
        >
          O‘ng oyoq 🦶
        </button>
      </div>
    </div>
  );
};

// =========================================================================
// 8. GYMNASTICS BALANCE (Gimnastika va muvozanat)
// =========================================================================
export const GymnasticsBalanceStage: React.FC<PeGrade1StageProps> = ({
  round,
  solved,
  onSolve,
  onStepSuccess,
  onStepMistake,
}) => {
  const data = round.gymData ?? { mode: 'beam_hold', targetBalanceTicks: 6 };
  const [placed, setPlaced] = useState<string[]>([]);
  const [wrongId, setWrongId] = useState<string | null>(null);
  const [pickedChoice, setPickedChoice] = useState<string | null>(null);

  // Beam balance state (-50..+50, safe zone -22..+22)
  const [tilt, setTilt] = useState(14);
  const [holdTicks, setHoldTicks] = useState(0);
  const targetTicks = data.targetBalanceTicks ?? 6;
  const tiltRef = useRef(tilt);
  tiltRef.current = tilt;
  const onSolveRef = useRef(onSolve);
  onSolveRef.current = onSolve;

  useEffect(() => {
    if (data.mode === 'beam_hold' && !solved && holdTicks >= targetTicks) {
      onSolveRef.current();
    }
  }, [data.mode, solved, holdTicks, targetTicks]);

  useEffect(() => {
    if (data.mode !== 'beam_hold' || solved) return;
    const id = window.setInterval(() => {
      setTilt((prev) => {
        const drift = prev >= 0 ? 4.5 : -4.5;
        const jitter = (Math.random() - 0.5) * 3;
        return Math.max(-46, Math.min(46, prev + drift + jitter));
      });
      if (Math.abs(tiltRef.current) <= 24) {
        setHoldTicks((t) => Math.min(targetTicks, t + 1));
      }
    }, 500);
    return () => window.clearInterval(id);
  }, [data.mode, solved, targetTicks]);

  if (data.mode === 'beam_hold') {
    const inGreen = Math.abs(tilt) <= 24;
    return (
      <div className="space-y-3">
        <div className="rounded-2xl bg-sky-50 border-2 border-sky-200 p-4 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-sky-900">
            <span>⚖️ {data.poseLabel ?? 'Muvozanat'}</span>
            <span>
              {solved ? 'Muvozanat a’lo!' : `Saqlash: ${Math.min(holdTicks, targetTicks)} / ${targetTicks}`}
            </span>
          </div>

          <div className="flex justify-center">
            <motion.div
              animate={{ rotate: solved ? 0 : tilt * 0.45 }}
              transition={{ type: 'spring', stiffness: 200, damping: 16 }}
              className="text-5xl origin-bottom"
            >
              🤸
            </motion.div>
          </div>

          {/* Balance Meter */}
          <div className="relative h-7 rounded-full bg-rose-100 border border-rose-300 overflow-hidden">
            <div className="absolute inset-y-0 left-[26%] right-[26%] bg-emerald-300/80 border-x-2 border-emerald-500" />
            <div
              style={{ left: `${50 + tilt}%` }}
              className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 rounded-full border-2 border-white shadow-md transition-all ${
                inGreen || solved ? 'bg-emerald-600' : 'bg-rose-600'
              }`}
            />
          </div>

          {/* Progress */}
          <div className="w-full h-2.5 rounded-full bg-slate-200 overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all duration-300"
              style={{ width: `${solved ? 100 : Math.min(100, (holdTicks / targetTicks) * 100)}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            disabled={solved}
            onClick={() => setTilt((t) => Math.max(-45, t - 14))}
            className="py-3 px-4 rounded-2xl bg-sky-600 hover:bg-sky-700 active:scale-95 text-white font-display font-extrabold text-base cursor-pointer"
          >
            ⬅️ Chapga og‘dir
          </button>
          <button
            type="button"
            disabled={solved}
            onClick={() => setTilt((t) => Math.min(45, t + 14))}
            className="py-3 px-4 rounded-2xl bg-sky-600 hover:bg-sky-700 active:scale-95 text-white font-display font-extrabold text-base cursor-pointer"
          >
            O‘ngga og‘dir ➡️
          </button>
        </div>
      </div>
    );
  }

  if (data.mode === 'mat_sequence') {
    const steps = data.steps ?? [];
    const shuffled = deterministicShuffle(steps);
    const nextStep = steps[placed.length];
    const handlePick = (id: string) => {
      if (solved || placed.includes(id)) return;
      if (nextStep && id === nextStep.id) {
        const next = [...placed, id];
        setPlaced(next);
        setWrongId(null);
        soundEngine.playFruitPluck(next.length);
        if (next.length === steps.length) onSolve();
        else onStepSuccess?.(`To‘g‘ri! Endi ${next.length + 1}-qadamni tanla!`);
      } else {
        setWrongId(id);
        soundEngine.playWrong();
        onStepMistake?.(`Avval «${nextStep?.label ?? ''}»ni tanlash kerak!`);
        window.setTimeout(() => setWrongId(null), 450);
      }
    };

    return (
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-2">
          {steps.map((s, idx) => {
            const done = placed.includes(s.id) || solved;
            return (
              <div
                key={s.id}
                className={`rounded-xl border-2 p-2.5 text-center ${
                  done
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
                    : 'bg-sky-50/70 border-dashed border-sky-300 text-slate-400'
                }`}
              >
                <div className="text-[11px] font-bold">{idx + 1}-bosqich</div>
                <div className="text-2xl my-0.5">{done ? s.emoji : '🟦'}</div>
                <div className="text-xs font-bold leading-tight">{done ? s.label : '...'}</div>
              </div>
            );
          })}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {shuffled.map((s) => {
            const used = placed.includes(s.id) || solved;
            const isWrong = wrongId === s.id;
            return (
              <button
                key={s.id}
                type="button"
                disabled={used}
                onClick={() => handlePick(s.id)}
                className={`rounded-xl border-2 p-3 text-center cursor-pointer transition-all ${
                  used
                    ? 'bg-slate-100 border-slate-200 text-slate-400 opacity-60'
                    : isWrong
                    ? 'bg-rose-50 border-rose-500 text-rose-900'
                    : 'bg-white border-slate-200 hover:border-sky-500 hover:bg-sky-50 text-slate-900'
                }`}
              >
                <div className="text-2xl">{s.emoji}</div>
                <div className="text-xs sm:text-sm font-bold mt-1">{s.label}</div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  const choices = data.choices ?? [];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
      {choices.map((ch) => {
        const picked = pickedChoice === ch.id;
        let cls = 'bg-white border-slate-200 hover:border-sky-500 hover:bg-sky-50 text-slate-900';
        if (solved && ch.isCorrect) cls = 'bg-emerald-50 border-emerald-500 text-emerald-950';
        else if (picked && !ch.isCorrect) cls = 'bg-rose-50 border-rose-500 text-rose-900';
        return (
          <button
            key={ch.id}
            type="button"
            disabled={solved}
            onClick={() => {
              setPickedChoice(ch.id);
              if (ch.isCorrect) onSolve();
              else {
                soundEngine.playWrong();
                onStepMistake?.(round.teacherHint || 'Qomat va xavfsizlik qoidasiga e’tibor ber!');
              }
            }}
            className={`rounded-2xl border-2 p-4 text-center cursor-pointer transition-all flex flex-col items-center gap-2 ${cls}`}
          >
            <span className="text-4xl leading-none">{ch.emoji}</span>
            <span className="text-xs sm:text-sm font-bold leading-snug">{ch.label}</span>
          </button>
        );
      })}
    </div>
  );
};

// =========================================================================
// 9. JUMP POWER (Sakrash kuchi va arg'amchi ritmi)
// =========================================================================
export const JumpPowerStage: React.FC<PeGrade1StageProps> = ({
  round,
  solved,
  onSolve,
  onStepSuccess,
  onStepMistake,
}) => {
  const data = round.jumpData ?? {
    mode: 'power_meter',
    sweetMin: 40,
    sweetMax: 78,
    goalLabel: 'Marraga sakrash',
    athleteEmoji: '🦘',
  };

  const [pos, setPos] = useState(15);
  const [jumpsDone, setJumpsDone] = useState(0);
  const dirRef = useRef(1);
  const posRef = useRef(15);

  useEffect(() => {
    if (solved) return;
    const speed = data.mode === 'rope_timing' ? 4.2 : 3.4;
    const id = window.setInterval(() => {
      let next = posRef.current + dirRef.current * speed;
      if (next >= 96) {
        next = 96;
        dirRef.current = -1;
      } else if (next <= 4) {
        next = 4;
        dirRef.current = 1;
      }
      posRef.current = next;
      setPos(next);
    }, 35);
    return () => window.clearInterval(id);
  }, [solved, data.mode]);

  const sweetMin = data.sweetMin ?? 36;
  const sweetMax = data.sweetMax ?? 76;
  const targetJumps = data.targetJumps ?? 3;

  const handleJump = () => {
    if (solved) return;
    const val = posRef.current;
    if (val >= sweetMin && val <= sweetMax) {
      if (data.mode === 'rope_timing') {
        const next = jumpsDone + 1;
        setJumpsDone(next);
        soundEngine.playFruitPluck(next);
        if (next >= targetJumps) {
          onSolve();
        } else {
          onStepSuccess?.(`Zo‘r sakrash (${next}/${targetJumps})! Davom et!`);
        }
      } else {
        onSolve();
      }
    } else {
      soundEngine.playWrong();
      onStepMistake?.('Biroz erta yoki kech! Indikator yashil markazga kelganda bos!');
    }
  };

  return (
    <div className="space-y-3">
      <div className="rounded-2xl bg-gradient-to-b from-sky-50 to-emerald-50 border-2 border-sky-200 p-4 space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-sky-900">
          <span>{data.athleteEmoji} {data.goalLabel}</span>
          <span>
            {data.mode === 'rope_timing'
              ? `Sakrashlar: ${solved ? targetJumps : jumpsDone} / ${targetJumps}`
              : solved
              ? 'Aniq sakrash!'
              : 'Yashil zonani tut!'}
          </span>
        </div>

        <div className="h-16 flex items-center justify-center">
          <motion.div
            animate={solved ? { y: [0, -24, 0], scale: [1, 1.15, 1] } : { y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-5xl"
          >
            {data.athleteEmoji}
          </motion.div>
        </div>

        <div className="relative h-8 rounded-full bg-slate-200 border border-slate-300 overflow-hidden">
          <div
            style={{ left: `${sweetMin}%`, width: `${sweetMax - sweetMin}%` }}
            className="absolute inset-y-0 bg-emerald-400/85 border-x-2 border-emerald-600"
          />
          <div
            style={{ left: `${pos}%` }}
            className="absolute top-0.5 bottom-0.5 w-3 -translate-x-1/2 rounded-full bg-amber-500 border-2 border-white shadow"
          />
        </div>
      </div>

      <button
        type="button"
        disabled={solved}
        onClick={handleJump}
        className={`w-full py-3.5 px-6 rounded-2xl font-display font-extrabold text-base shadow-md transition-all cursor-pointer ${
          solved
            ? 'bg-emerald-600 text-white'
            : 'bg-sky-600 hover:bg-sky-700 active:scale-[0.98] text-white'
        }`}
      >
        {solved ? 'Barakalla! ✓' : '🦘 SAKRA!'}
      </button>
    </div>
  );
};

// =========================================================================
// 10. BALL THROW (To'pni nishonga uloqtirish va savatga tashlash)
// =========================================================================
export const BallThrowStage: React.FC<PeGrade1StageProps> = ({
  round,
  solved,
  onSolve,
  onStepMistake,
}) => {
  const data = round.throwData ?? {
    mode: 'aim_timing',
    targetLabel: 'Nishon',
    targetEmoji: '🎯',
    ballEmoji: '🎾',
  };

  const [aimX, setAimX] = useState(20);
  const [pickedChoice, setPickedChoice] = useState<string | null>(null);
  const dirRef = useRef(1);
  const aimRef = useRef(20);

  useEffect(() => {
    if (data.mode !== 'aim_timing' || solved) return;
    const id = window.setInterval(() => {
      let next = aimRef.current + dirRef.current * 3.5;
      if (next >= 94) {
        next = 94;
        dirRef.current = -1;
      } else if (next <= 6) {
        next = 6;
        dirRef.current = 1;
      }
      aimRef.current = next;
      setAimX(next);
    }, 35);
    return () => window.clearInterval(id);
  }, [data.mode, solved]);

  if (data.mode === 'angle_pick') {
    const choices = data.choices ?? [];
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {choices.map((ch) => {
          const picked = pickedChoice === ch.id;
          let cls = 'bg-white border-slate-200 hover:border-sky-500 hover:bg-sky-50 text-slate-900';
          if (solved && ch.isCorrect) cls = 'bg-emerald-50 border-emerald-500 text-emerald-950';
          else if (picked && !ch.isCorrect) cls = 'bg-rose-50 border-rose-500 text-rose-900';
          return (
            <button
              key={ch.id}
              type="button"
              disabled={solved}
              onClick={() => {
                setPickedChoice(ch.id);
                if (ch.isCorrect) onSolve();
                else {
                  soundEngine.playWrong();
                  onStepMistake?.(round.teacherHint || 'To‘g‘ri yo‘nalishni tanla!');
                }
              }}
              className={`rounded-2xl border-2 p-4 text-center cursor-pointer transition-all flex flex-col items-center gap-2 ${cls}`}
            >
              <span className="text-3xl leading-none">{ch.emoji}</span>
              <span className="text-xs sm:text-sm font-bold leading-snug">{ch.label}</span>
            </button>
          );
        })}
      </div>
    );
  }

  const handleThrow = () => {
    if (solved) return;
    if (aimRef.current >= 34 && aimRef.current <= 66) {
      onSolve();
    } else {
      soundEngine.playWrong();
      onStepMistake?.('Mo‘ljal markazga (yashil nishon ustiga) kelganda «OTISH!» tugmasini bos!');
    }
  };

  return (
    <div className="space-y-3">
      <div className="rounded-2xl bg-gradient-to-b from-sky-50 to-amber-50 border-2 border-sky-200 p-4 space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700">
          <span>{data.targetEmoji} {data.targetLabel}</span>
          <span>{solved ? 'Aniq tegdi!' : 'Yashil markazda ot!'}</span>
        </div>

        <div className="relative h-20 flex items-center justify-center">
          <div className="text-5xl">{data.targetEmoji}</div>
          <motion.div
            animate={solved ? { scale: [1.5, 0.9], y: [30, 0] } : { left: `${aimX}%` }}
            transition={{ duration: 0.35 }}
            className={`absolute text-3xl ${solved ? '' : '-translate-x-1/2 bottom-1'}`}
          >
            {solved ? '💥' : data.ballEmoji}
          </motion.div>
        </div>

        <div className="relative h-7 rounded-full bg-slate-200 border border-slate-300 overflow-hidden">
          <div className="absolute inset-y-0 left-[34%] right-[34%] bg-emerald-400/85 border-x-2 border-emerald-600" />
          <div
            style={{ left: `${aimX}%` }}
            className="absolute top-0.5 bottom-0.5 w-3 -translate-x-1/2 rounded-full bg-rose-500 border-2 border-white shadow"
          />
        </div>
      </div>

      <button
        type="button"
        disabled={solved}
        onClick={handleThrow}
        className={`w-full py-3.5 px-6 rounded-2xl font-display font-extrabold text-base shadow-md transition-all cursor-pointer ${
          solved
            ? 'bg-emerald-600 text-white'
            : 'bg-sky-600 hover:bg-sky-700 active:scale-[0.98] text-white'
        }`}
      >
        {solved ? 'Nishonga tegdi! ✓' : `${data.ballEmoji} OTISH!`}
      </button>
    </div>
  );
};

// =========================================================================
// 11. CHECKERS INTRO (Shashka taxtasi, yurish va urib olish)
// =========================================================================
export const CheckersIntroStage: React.FC<PeGrade1StageProps> = ({
  round,
  solved,
  onSolve,
  onStepMistake,
}) => {
  const data = round.checkersData ?? { mode: 'rule_pick' };
  const [pickedChoice, setPickedChoice] = useState<string | null>(null);
  const [movedTo, setMovedTo] = useState<{ row: number; col: number } | null>(null);

  if (data.mode === 'rule_pick') {
    const choices = data.choices ?? [];
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {choices.map((ch) => {
          const picked = pickedChoice === ch.id;
          let cls = 'bg-white border-slate-200 hover:border-sky-500 hover:bg-sky-50 text-slate-900';
          if (solved && ch.isCorrect) cls = 'bg-emerald-50 border-emerald-500 text-emerald-950';
          else if (picked && !ch.isCorrect) cls = 'bg-rose-50 border-rose-500 text-rose-900';
          return (
            <button
              key={ch.id}
              type="button"
              disabled={solved}
              onClick={() => {
                setPickedChoice(ch.id);
                if (ch.isCorrect) onSolve();
                else {
                  soundEngine.playWrong();
                  onStepMistake?.('Shashka donasi faqat qora katakda diagonal oldinga yuradi!');
                }
              }}
              className={`rounded-2xl border-2 p-4 text-center cursor-pointer transition-all flex flex-col items-center gap-2 ${cls}`}
            >
              <span className="text-3xl leading-none">{ch.emoji}</span>
              <span className="text-xs sm:text-sm font-bold leading-snug">{ch.label}</span>
            </button>
          );
        })}
      </div>
    );
  }

  const pPos = solved && movedTo ? movedTo : data.playerPos ?? { row: 2, col: 1 };
  const enemy = solved ? null : data.enemyPos ?? null;
  const targets = data.targetSquares ?? [];

  const handleSquareClick = (r: number, c: number) => {
    if (solved) return;
    const isTarget = targets.some((t) => t.row === r && t.col === c);
    if (isTarget) {
      setMovedTo({ row: r, col: c });
      onSolve();
    } else {
      soundEngine.playWrong();
      const isDark = (r + c) % 2 === 1;
      onStepMistake?.(
        !isDark
          ? 'Oq katakka yurish mumkin emas! Faqat qora kataklarga diagonal oldinga yur!'
          : data.mode === 'capture_jump'
          ? 'Qora dona ustidan sakrab, uning ortidagi bo‘sh qora katakni bos!'
          : 'Oq donadan bir qator yuqoridagi qo‘shni qora katakni bos!'
      );
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="grid grid-cols-4 gap-1 p-2 rounded-2xl bg-amber-900 border-4 border-amber-950 shadow-md">
        {Array.from({ length: 4 }).map((_, r) =>
          Array.from({ length: 4 }).map((__, c) => {
            const isDark = (r + c) % 2 === 1;
            const isPlayer = pPos.row === r && pPos.col === c;
            const isEnemy = enemy && enemy.row === r && enemy.col === c;
            const isTarget = targets.some((t) => t.row === r && t.col === c);
            return (
              <button
                key={`${r}-${c}`}
                type="button"
                disabled={solved}
                onClick={() => handleSquareClick(r, c)}
                className={`w-12 h-12 sm:w-14 sm:h-14 rounded-lg flex items-center justify-center text-2xl transition-all cursor-pointer ${
                  isDark
                    ? isTarget && !solved
                      ? 'bg-emerald-900/90 ring-2 ring-emerald-400 hover:bg-emerald-800'
                      : 'bg-slate-800 hover:bg-slate-700'
                    : 'bg-amber-100'
                }`}
              >
                {isPlayer ? '⚪' : isEnemy ? '⚫' : isTarget && !solved ? '✨' : ''}
              </button>
            );
          })
        )}
      </div>
      <div className="text-xs font-semibold text-slate-600 flex items-center gap-2">
        <Check className="w-4 h-4 text-emerald-600" />
        <span>
          {data.mode === 'capture_jump'
            ? 'Qora dona ustidan sakrab bo‘sh katakni bosing'
            : 'Oq donani diagonal oldingi qora katakka bosing'}
        </span>
      </div>
    </div>
  );
};

// Suppress unused import warning on RotateCcw cleanly if unused
void RotateCcw;
