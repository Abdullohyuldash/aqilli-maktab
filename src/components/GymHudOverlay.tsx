import React, { useState, useEffect } from 'react';
import { SubjectId, PlayerProfile } from '../types';
import { PE_GRADE_1_LESSONS } from '../data/peGrade1';
import { soundEngine, speakUzbek, stopSpeaking } from '../utils/sound';

interface GymHudOverlayProps {
  profile: PlayerProfile;
  activePeLessonIndex: number; // 0 to 33 (Lessons 1 to 34)
  onSelectLesson: (index: number) => void;
  onExitGym: () => void;
  onCompleteLesson: (subject: SubjectId, earnedCoins: number) => void;
  onTriggerEmote: (emote: any, durationSec?: number, fanfare?: boolean) => void;
}

export const GymHudOverlay: React.FC<GymHudOverlayProps> = ({
  profile,
  activePeLessonIndex,
  onSelectLesson,
  onExitGym,
  onCompleteLesson,
  onTriggerEmote,
}) => {
  const [showSelector, setShowSelector] = useState(false);
  const [gameStep, setGameStep] = useState(0);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string>('');

  const lessonPlan = PE_GRADE_1_LESSONS[activePeLessonIndex] || PE_GRADE_1_LESSONS[0];
  const rounds = lessonPlan.peRounds || [];
  const currentRound = rounds[gameStep] || rounds[0];

  // Reset mini-game state when lesson changes
  useEffect(() => {
    setGameStep(0);
    setScore(0);
    setIsCompleted(false);
    setFeedbackMsg(lessonPlan.explanation);
    stopSpeaking();
  }, [activePeLessonIndex]);

  const handleSpeakTeacher = () => {
    soundEngine.playEquip();
    speakUzbek(`Ustoz Rustam: ${lessonPlan.ruleTitle}. ${currentRound.prompt}`);
  };

  const handleOptionClick = (isCorrect: boolean, roundIndex: number) => {
    if (isCompleted) return;
    if (isCorrect || roundIndex === 0) {
      soundEngine.playCorrect();
      const nextStep = gameStep + 1;
      if (nextStep >= rounds.length) {
        setIsCompleted(true);
        setFeedbackMsg('🎉 Barakalla! Dars muvaffaqiyatli yakunlandi!');
        soundEngine.playLessonComplete();
        onTriggerEmote('quvonch', 3.0, true);
        onCompleteLesson('pe', 25);
      } else {
        setGameStep(nextStep);
        setFeedbackMsg(`✨ To'g'ri! Keyingi bosqichga o'tdingiz.`);
      }
    } else {
      soundEngine.playWrong();
      setFeedbackMsg(`❌ Xato! Qayta urinib ko'ring: ${currentRound.teacherHint || lessonPlan.explanation}`);
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 z-30 select-none">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between bg-slate-900/85 backdrop-blur-md text-white px-5 py-3 rounded-2xl shadow-xl pointer-events-auto border border-sky-500/30">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">🏃‍♂️</span>
          <div>
            <div className="text-xs uppercase tracking-wider text-sky-400 font-bold">
              3D Sport Zali · 1-Sinf
            </div>
            <div className="text-sm font-extrabold text-white">
              {lessonPlan.topicTitle}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowSelector(!showSelector)}
            className="bg-sky-600 hover:bg-sky-500 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1 shadow-md"
          >
            <span>📚 Dars tanlash (1–34)</span>
          </button>

          <div className="bg-amber-500/20 text-amber-300 px-3 py-1 rounded-xl text-xs font-bold border border-amber-500/30 flex items-center space-x-1">
            <span>🪙 {profile.coins}</span>
          </div>

          <button
            onClick={onExitGym}
            className="bg-red-600/80 hover:bg-red-500 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-md flex items-center space-x-1"
          >
            <span>🚪 Zaldan chiqish</span>
          </button>
        </div>
      </div>

      {/* Lesson Selector Dropdown Modal */}
      {showSelector && (
        <div className="absolute top-20 left-4 right-4 max-w-2xl mx-auto bg-slate-900/95 backdrop-blur-lg border border-sky-500/40 rounded-2xl p-4 shadow-2xl pointer-events-auto max-h-[70vh] overflow-y-auto z-40">
          <div className="flex justify-between items-center mb-3 border-b border-slate-700 pb-2">
            <h3 className="text-white font-bold text-sm">Jismoniy tarbiya: Barcha 34 ta dars</h3>
            <button
              onClick={() => setShowSelector(false)}
              className="text-slate-400 hover:text-white text-xs font-bold px-2 py-1 bg-slate-800 rounded-lg"
            >
              ✕ Yopish
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {PE_GRADE_1_LESSONS.map((l, idx) => (
              <button
                key={idx}
                onClick={() => {
                  onSelectLesson(idx);
                  setShowSelector(false);
                }}
                className={`text-left p-2 rounded-xl text-xs transition border ${
                  activePeLessonIndex === idx
                    ? 'bg-sky-600 text-white border-sky-400 font-bold shadow-lg'
                    : 'bg-slate-800/80 text-slate-200 border-slate-700 hover:bg-slate-700'
                }`}
              >
                <div className="text-[10px] text-sky-300 font-bold">{idx + 1}-dars</div>
                <div className="truncate">{l.topicTitle.split(':')[1] || l.topicTitle}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Center / Bottom Interactive Game Panel */}
      <div className="self-center w-full max-w-xl bg-slate-900/90 backdrop-blur-md rounded-3xl p-5 shadow-2xl pointer-events-auto border border-sky-500/40 mb-2">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <span className="text-xl">👨‍🏫</span>
            <span className="text-xs font-bold text-sky-300">Ustoz Rustam (Sport murabbiyi)</span>
          </div>
          <button
            onClick={handleSpeakTeacher}
            className="bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 px-2.5 py-1 rounded-xl text-xs font-bold border border-sky-500/40 transition flex items-center space-x-1"
          >
            <span>🔊 Tinglash</span>
          </button>
        </div>

        <div className="bg-slate-950/80 rounded-2xl p-3.5 mb-3 border border-slate-800">
          <p className="text-sm font-semibold text-white mb-1">{currentRound.prompt}</p>
          <p className="text-xs text-sky-200/80 italic">{feedbackMsg || lessonPlan.explanation}</p>
        </div>

        {!isCompleted ? (
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-400 mb-1">
              Bosqich: {gameStep + 1} / {rounds.length}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {(currentRound.lineData?.choices || currentRound.options || ['Bajarish']).map((opt: any, idx: number) => {
                const label = typeof opt === 'string' ? opt : opt.label;
                const isCorr = typeof opt === 'string' ? true : opt.isCorrect;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      if (currentRound.kind === 'jump_power' || currentRound.kind === 'line_formation') {
                        handleOptionClick(isCorr ?? true, idx);
                        if (currentRound.jumpData?.mode === 'power_meter') {
                          onTriggerEmote('urm_warmup', 2.0);
                        } else if (currentRound.jumpData?.mode === 'rope_timing') {
                          onTriggerEmote('bar_hang', 2.0);
                        } else {
                          onTriggerEmote('throw_ball', 1.5);
                        }
                      } else {
                        handleOptionClick(true, idx);
                        onTriggerEmote('urm_warmup', 2.0);
                      }
                    }}
                    className="bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-bold py-3 px-4 rounded-xl text-xs shadow-lg transition transform active:scale-95 text-center border border-sky-400/40"
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-center py-3 bg-emerald-600/20 border border-emerald-500/40 rounded-2xl">
            <div className="text-xl font-black text-emerald-400 mb-1">🏆 Barakalla! 25 Coin olindi!</div>
            <p className="text-xs text-slate-300 mb-3">Keyingi darsga o'tish uchun yuqoridagi "Dars tanlash" tugmasini bosing.</p>
            <button
              onClick={() => {
                const nextIdx = (activePeLessonIndex + 1) % PE_GRADE_1_LESSONS.length;
                onSelectLesson(nextIdx);
              }}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-2 rounded-xl text-xs transition shadow-lg"
            >
              Keyingi darsga o'tish ➡️
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
