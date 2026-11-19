import React, { useMemo, useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Gamepad2,
  Play,
  Search,
  Volume2,
  X,
} from 'lucide-react';
import { SubjectId } from '../types';
import {
  getAllLessonsBySubject,
  LessonPlan,
  SUBJECT_META,
} from '../data/curriculum';
import { ALL_SUBJECTS } from '../utils/storage';
import { speakUzbek } from '../utils/sound';
import { LessonModal } from './LessonModal';

interface CurriculumInspectorModalProps {
  onClose: () => void;
}

type LevelFilter = 'all' | 'grade1' | 'elementary' | 'middle' | 'high';

function getLessonLevelLabel(lesson: LessonPlan): string {
  if (lesson.grade !== undefined) return `${lesson.grade}-sinf`;
  if (lesson.tier === 'elementary') return "2–4-sinf (Boshlang'ich)";
  if (lesson.tier === 'middle') return "5–8-sinf (O'rta)";
  return '9–11-sinf (Yuqori)';
}

function getLessonGameTypeLabel(subject: SubjectId): string {
  switch (subject) {
    case 'alifbe':
      return "Ovozli Alifbe: Harf topish, So'z yig'ish, Rasm juftlash";
    case 'math':
      return 'Harakatlanuvchi javob bloklari + Taymer';
    case 'english':
      return "So'zlarni juftlash va Bo'sh joyni to'ldirish";
    case 'cs':
      return 'Algoritm bloklarini tartiblash va Mantiq';
    case 'science':
      return "To'g'ri / Noto'g'ri va Tezkor viktorina";
  }
}

function getLessonRoundCount(lesson: LessonPlan): number {
  return (
    lesson.alifbeRounds?.length ||
    lesson.mathRounds?.length ||
    lesson.englishRounds?.length ||
    lesson.csRounds?.length ||
    lesson.scienceRounds?.length ||
    0
  );
}

function getTestGradeForLesson(lesson: LessonPlan): number {
  if (lesson.grade !== undefined) return lesson.grade;
  if (lesson.tier === 'elementary') return 3;
  if (lesson.tier === 'middle') return 6;
  return 10;
}

export const CurriculumInspectorModal: React.FC<CurriculumInspectorModalProps> = ({
  onClose,
}) => {
  const [selectedSubject, setSelectedSubject] = useState<SubjectId>('alifbe');
  const [levelFilter, setLevelFilter] = useState<LevelFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [testingLesson, setTestingLesson] = useState<{
    lesson: LessonPlan;
    initialStage: 'explain' | 'game';
  } | null>(null);

  const allBySubject = useMemo(() => {
    return {
      alifbe: getAllLessonsBySubject('alifbe'),
      math: getAllLessonsBySubject('math'),
      english: getAllLessonsBySubject('english'),
      cs: getAllLessonsBySubject('cs'),
      science: getAllLessonsBySubject('science'),
    };
  }, []);

  const totalStats = useMemo(() => {
    const all = [
      ...allBySubject.alifbe,
      ...allBySubject.math,
      ...allBySubject.english,
      ...allBySubject.cs,
      ...allBySubject.science,
    ];
    const totalRounds = all.reduce((sum, l) => sum + getLessonRoundCount(l), 0);
    return { totalLessons: all.length, totalRounds };
  }, [allBySubject]);

  const filteredLessons = useMemo(() => {
    const base = allBySubject[selectedSubject];
    const q = searchQuery.trim().toLowerCase();

    return base.filter((lesson) => {
      if (levelFilter === 'grade1' && lesson.grade !== 1) return false;
      if (levelFilter === 'elementary' && (lesson.tier !== 'elementary' || lesson.grade === 1)) {
        return false;
      }
      if (levelFilter === 'middle' && lesson.tier !== 'middle') return false;
      if (levelFilter === 'high' && lesson.tier !== 'high') return false;

      if (!q) return true;
      const haystack = [
        lesson.topicTitle,
        lesson.ruleTitle,
        lesson.explanation,
        lesson.formulaOrRule,
        ...(lesson.alifbeRounds?.map((r) =>
          r.kind === 'letter_match'
            ? `${r.spokenPrompt} ${r.pairs.map((p) => `${p.letter} ${p.word}`).join(' ')}`
            : r.kind === 'first_letter'
            ? `${r.spokenPrompt} ${r.word} ${r.correctAnswer}`
            : `${r.spokenPrompt} ${r.word} ${r.parts.join(' ')}`
        ) || []),
        ...(lesson.mathRounds?.map((r) => `${r.prompt} ${r.correctAnswer}`) || []),
        ...(lesson.englishRounds?.map((r) =>
          r.kind === 'match'
            ? r.pairs.map((p) => `${p.uz} ${p.en}`).join(' ')
            : `${r.sentence} ${r.translation} ${r.correctAnswer}`
        ) || []),
        ...(lesson.csRounds?.map((r) =>
          r.kind === 'order'
            ? `${r.prompt} ${r.correctSteps.join(' ')}`
            : `${r.prompt} ${r.correctAnswer}`
        ) || []),
        ...(lesson.scienceRounds?.map((r) => `${r.statement} ${r.correctAnswer} ${r.fact}`) || []),
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [allBySubject, selectedSubject, levelFilter, searchQuery]);

  const activeLesson = filteredLessons[selectedIdx] || filteredLessons[0] || null;
  const activeMeta = SUBJECT_META[selectedSubject];

  return (
    <>
      <div className="fixed inset-0 z-40 bg-slate-900/70 flex items-center justify-center p-2 sm:p-4 lg:p-6">
        <div className="w-full max-w-6xl h-[92vh] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
          {/* Top Header */}
          <div className="px-5 sm:px-6 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h2 className="text-lg sm:text-xl font-display font-extrabold text-slate-900 truncate">
                  Barcha fanlar, savollar va o&apos;yinlarni tekshirish
                </h2>
                <div className="text-xs text-slate-600 font-mono-num">
                  Jami {totalStats.totalLessons} ta dars · {totalStats.totalRounds} ta interaktiv raund
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="h-10 px-3.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold text-sm flex items-center gap-1.5 cursor-pointer transition-colors shrink-0"
            >
              <X className="w-4 h-4" />
              <span>Yopish</span>
            </button>
          </div>

          {/* Subject Tabs + Level Filter + Search */}
          <div className="px-5 sm:px-6 py-3.5 border-b border-slate-200 bg-white flex flex-col gap-3">
            {/* Subject Switcher */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
              {ALL_SUBJECTS.map((subj) => {
                const meta = SUBJECT_META[subj];
                const count = allBySubject[subj].length;
                const active = selectedSubject === subj;
                return (
                  <button
                    key={subj}
                    type="button"
                    onClick={() => {
                      setSelectedSubject(subj);
                      setSelectedIdx(0);
                    }}
                    style={active ? { backgroundColor: meta.color, borderColor: meta.color } : undefined}
                    className={`px-3.5 py-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-2 ${
                      active
                        ? 'text-white shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
                    }`}
                  >
                    <span className="font-display font-bold text-sm truncate">{meta.name}</span>
                    <span
                      className={`font-mono-num text-xs font-bold shrink-0 ${
                        active ? 'text-white/90' : 'text-slate-500'
                      }`}
                    >
                      {count} dars
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Secondary Filter Bar: Grade/Tier + Search */}
            <div className="flex flex-wrap items-center justify-between gap-2.5">
              <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-xl">
                {(
                  [
                    { id: 'all', label: 'Barchasi' },
                    { id: 'grade1', label: '1-sinf' },
                    { id: 'elementary', label: '2–4-sinf' },
                    { id: 'middle', label: '5–8-sinf' },
                    { id: 'high', label: '9–11-sinf' },
                  ] as { id: LevelFilter; label: string }[]
                ).map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      setLevelFilter(tab.id);
                      setSelectedIdx(0);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                      levelFilter === tab.id
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="relative flex-1 min-w-[200px] max-w-xs">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSelectedIdx(0);
                  }}
                  placeholder="Mavzu yoki savol qidirish..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Main Split View: Lesson List (Left) + Lesson Details & Questions (Right) */}
          <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12">
            {/* Left Sidebar: Lessons List */}
            <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-slate-200 overflow-y-auto custom-scroll p-3 bg-slate-50/70 max-h-56 lg:max-h-none">
              {filteredLessons.length === 0 ? (
                <div className="p-6 text-center text-sm text-slate-500">
                  Tanlangan filtr bo&apos;yicha dars topilmadi.
                </div>
              ) : (
                <div className="space-y-1.5">
                  {filteredLessons.map((lesson, idx) => {
                    const isSelected = activeLesson === lesson;
                    return (
                      <button
                        key={`${lesson.subject}-${lesson.tier}-${lesson.grade ?? 'gen'}-${lesson.topicTitle}-${idx}`}
                        type="button"
                        onClick={() => setSelectedIdx(idx)}
                        className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-white border-slate-900 shadow-sm'
                            : 'bg-transparent border-transparent hover:bg-white hover:border-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 text-xs text-slate-500 mb-0.5">
                          <span className="font-semibold" style={{ color: activeMeta.color }}>
                            {getLessonLevelLabel(lesson)}
                          </span>
                          <span className="font-mono-num">{getLessonRoundCount(lesson)} raund</span>
                        </div>
                        <div className="text-sm font-bold text-slate-900 leading-snug">
                          {lesson.topicTitle}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right Content: Selected Lesson Full Details + Play-Test Actions */}
            <div className="lg:col-span-8 overflow-y-auto custom-scroll p-5 sm:p-6 bg-white">
              {!activeLesson ? (
                <div className="h-full flex items-center justify-center text-sm text-slate-500">
                  Ko&apos;rish uchun chap tarafdan darsni tanlang.
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Lesson Title & Play-Test Buttons */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-slate-200">
                    <div>
                      <div className="text-xs font-semibold text-slate-500">
                        {activeMeta.roomName} · {getLessonLevelLabel(activeLesson)} ·{' '}
                        {getLessonGameTypeLabel(activeLesson.subject)}
                      </div>
                      <h3 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900 mt-1">
                        {activeLesson.topicTitle}
                      </h3>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() =>
                          setTestingLesson({ lesson: activeLesson, initialStage: 'explain' })
                        }
                        className="px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer transition-colors whitespace-nowrap"
                      >
                        <Play className="w-4 h-4" />
                        Darsni sinash
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setTestingLesson({ lesson: activeLesson, initialStage: 'game' })
                        }
                        style={{ backgroundColor: activeMeta.color }}
                        className="px-4 py-2.5 rounded-xl text-white font-display font-bold text-xs sm:text-sm shadow-sm hover:opacity-95 flex items-center gap-1.5 cursor-pointer transition-opacity whitespace-nowrap"
                      >
                        <Gamepad2 className="w-4 h-4" />
                        O&apos;yinni boshlash
                      </button>
                    </div>
                  </div>

                  {/* Chalkboard Teaching Material Preview */}
                  <div className="rounded-2xl bg-[#1E4635] border-2 border-[#92400E] p-5 text-emerald-50 space-y-3">
                    <div className="text-xs font-semibold text-amber-200">
                      1-bosqich: Doskadagi tushuntirish — {activeLesson.ruleTitle}
                    </div>
                    <p className="text-sm text-white leading-relaxed">{activeLesson.explanation}</p>
                    <div className="bg-black/25 rounded-xl px-3.5 py-2.5 font-mono-num text-sm font-bold text-amber-300">
                      {activeLesson.formulaOrRule}
                    </div>
                    <div className="text-xs sm:text-sm text-emerald-100 pt-1">
                      <strong className="text-white">Misol:</strong> {activeLesson.exampleProblem}{' '}
                      <span className="text-amber-200">→ {activeLesson.exampleSolution}</span>
                    </div>
                  </div>

                  {/* All Rounds & Correct Answers */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-base font-display font-bold text-slate-900">
                        2-bosqich: Mini-o&apos;yin savollari va javoblari ({getLessonRoundCount(activeLesson)} ta raund)
                      </h4>
                    </div>

                    {/* ALIFBE ROUNDS */}
                    {activeLesson.alifbeRounds && (
                      <div className="space-y-3">
                        {activeLesson.alifbeRounds.map((round, i) => (
                          <div
                            key={i}
                            className="rounded-2xl border border-slate-200 p-4 space-y-2.5 bg-slate-50/50"
                          >
                            <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
                              <span className="font-bold text-slate-700">Raund {i + 1}</span>
                              <div className="flex items-center gap-2">
                                <span>
                                  {round.kind === 'first_letter'
                                    ? 'Birinchi harfni top'
                                    : round.kind === 'build_word'
                                    ? "So'z yig'ish"
                                    : 'Harf va rasm juftlash'}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => speakUzbek(round.spokenPrompt)}
                                  className="px-2 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 font-semibold inline-flex items-center gap-1 cursor-pointer"
                                  title="Ovozli eshitish"
                                >
                                  <Volume2 className="w-3.5 h-3.5" />
                                  Eshitish
                                </button>
                              </div>
                            </div>

                            <div className="text-sm sm:text-base font-bold text-slate-900">
                              {round.spokenPrompt}
                            </div>

                            {round.kind === 'first_letter' && (
                              <div className="space-y-2">
                                <div className="text-sm font-semibold text-slate-700">
                                  Rasm: <span className="text-2xl align-middle mr-1">{round.emoji}</span> ({round.word})
                                </div>
                                <div className="grid grid-cols-4 gap-2">
                                  {round.options.map((opt) => {
                                    const isRight = opt === round.correctAnswer;
                                    return (
                                      <div
                                        key={opt}
                                        className={`px-3 py-2 rounded-xl border text-sm font-display font-bold flex items-center justify-between gap-1 ${
                                          isRight
                                            ? 'bg-emerald-50 border-emerald-400 text-emerald-900'
                                            : 'bg-white border-slate-200 text-slate-700'
                                        }`}
                                      >
                                        <span>{opt}</span>
                                        {isRight && (
                                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            {round.kind === 'build_word' && (
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-2xl mr-1">{round.emoji}</span>
                                {round.parts.map((part, pIdx) => (
                                  <span
                                    key={pIdx}
                                    className="px-3 py-1.5 rounded-xl bg-white border border-rose-300 font-display font-bold text-sm text-rose-800"
                                  >
                                    {part}
                                  </span>
                                ))}
                                <span className="text-xs font-bold text-emerald-700 ml-1">
                                  = {round.word}
                                </span>
                              </div>
                            )}

                            {round.kind === 'letter_match' && (
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                {round.pairs.map((p) => (
                                  <div
                                    key={`${p.letter}-${p.word}`}
                                    className="px-3 py-2 rounded-xl bg-white border border-rose-200 text-sm flex items-center justify-between gap-2"
                                  >
                                    <span className="font-display font-black text-base text-rose-700">
                                      {p.letter}
                                    </span>
                                    <span className="text-slate-400">↔</span>
                                    <span className="font-semibold text-slate-800">
                                      {p.emoji} {p.word}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* MATH ROUNDS */}
                    {activeLesson.mathRounds && (
                      <div className="space-y-3">
                        {activeLesson.mathRounds.map((round, i) => (
                          <div
                            key={i}
                            className="rounded-2xl border border-slate-200 p-4 space-y-2.5 bg-slate-50/50"
                          >
                            <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
                              <span className="font-bold text-slate-700">Raund {i + 1}</span>
                              <span className="inline-flex items-center gap-1 font-mono-num">
                                <Clock className="w-3.5 h-3.5" />
                                {round.timeLimitSec} soniya
                              </span>
                            </div>
                            <div className="text-base font-bold text-slate-900">{round.prompt}</div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                              {round.options.map((opt) => {
                                const isRight = opt === round.correctAnswer;
                                return (
                                  <div
                                    key={opt}
                                    className={`px-3 py-2 rounded-xl border text-xs sm:text-sm font-semibold flex items-center justify-between gap-1.5 ${
                                      isRight
                                        ? 'bg-emerald-50 border-emerald-400 text-emerald-900'
                                        : 'bg-white border-slate-200 text-slate-700'
                                    }`}
                                  >
                                    <span className="truncate">{opt}</span>
                                    {isRight && (
                                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                            <div className="text-xs text-slate-600">
                              <strong>Yordam (hint):</strong> {round.hint}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* ENGLISH ROUNDS */}
                    {activeLesson.englishRounds && (
                      <div className="space-y-3">
                        {activeLesson.englishRounds.map((round, i) => (
                          <div
                            key={i}
                            className="rounded-2xl border border-slate-200 p-4 space-y-2.5 bg-slate-50/50"
                          >
                            <div className="flex items-center justify-between text-xs text-slate-500">
                              <span className="font-bold text-slate-700">Raund {i + 1}</span>
                              <span>
                                {round.kind === 'match'
                                  ? "So'zlarni juftlash"
                                  : "Bo'sh joyni to'ldirish"}
                              </span>
                            </div>
                            <div className="text-sm font-semibold text-slate-800">
                              {round.instruction}
                            </div>

                            {round.kind === 'match' ? (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {round.pairs.map((p) => (
                                  <div
                                    key={`${p.uz}-${p.en}`}
                                    className="px-3 py-2 rounded-xl bg-white border border-emerald-200 text-sm flex items-center justify-between gap-2"
                                  >
                                    <span className="font-medium text-slate-800">{p.uz}</span>
                                    <span className="text-slate-400">↔</span>
                                    <span className="font-bold text-emerald-800">{p.en}</span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="space-y-2">
                                <div className="text-base font-bold text-slate-900">
                                  {round.sentence}{' '}
                                  <span className="text-xs font-normal text-slate-500">
                                    ({round.translation})
                                  </span>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                  {round.options.map((opt) => {
                                    const isRight = opt === round.correctAnswer;
                                    return (
                                      <div
                                        key={opt}
                                        className={`px-3 py-2 rounded-xl border text-xs sm:text-sm font-semibold flex items-center justify-between gap-1.5 ${
                                          isRight
                                            ? 'bg-emerald-50 border-emerald-400 text-emerald-900'
                                            : 'bg-white border-slate-200 text-slate-700'
                                        }`}
                                      >
                                        <span>{opt}</span>
                                        {isRight && (
                                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* CS ROUNDS */}
                    {activeLesson.csRounds && (
                      <div className="space-y-3">
                        {activeLesson.csRounds.map((round, i) => (
                          <div
                            key={i}
                            className="rounded-2xl border border-slate-200 p-4 space-y-2.5 bg-slate-50/50"
                          >
                            <div className="flex items-center justify-between text-xs text-slate-500">
                              <span className="font-bold text-slate-700">Raund {i + 1}</span>
                              <span>
                                {round.kind === 'order'
                                  ? 'Ketma-ketlikni tartiblash'
                                  : 'Mantiqiy tanlov'}
                              </span>
                            </div>
                            <div className="text-sm sm:text-base font-bold text-slate-900">
                              {round.prompt}
                            </div>

                            {round.kind === 'order' ? (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {round.correctSteps.map((step, sIdx) => (
                                  <div
                                    key={step}
                                    className="px-3 py-2 rounded-xl bg-white border border-violet-200 text-xs sm:text-sm font-semibold text-slate-800 flex items-center gap-2"
                                  >
                                    <span className="w-5 h-5 rounded-md bg-violet-600 text-white font-mono-num text-xs flex items-center justify-center shrink-0">
                                      {sIdx + 1}
                                    </span>
                                    <span>{step}</span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="space-y-2">
                                {round.codeSnippet && (
                                  <pre className="bg-slate-900 text-violet-200 rounded-xl px-3.5 py-2.5 font-mono-num text-xs sm:text-sm overflow-x-auto">
                                    {round.codeSnippet}
                                  </pre>
                                )}
                                <div className="grid grid-cols-2 gap-2">
                                  {round.options.map((opt) => {
                                    const isRight = opt === round.correctAnswer;
                                    return (
                                      <div
                                        key={opt}
                                        className={`px-3 py-2 rounded-xl border text-xs sm:text-sm font-semibold flex items-center justify-between gap-1.5 ${
                                          isRight
                                            ? 'bg-emerald-50 border-emerald-400 text-emerald-900'
                                            : 'bg-white border-slate-200 text-slate-700'
                                        }`}
                                      >
                                        <span>{opt}</span>
                                        {isRight && (
                                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            <div className="text-xs text-slate-600">
                              <strong>Izoh:</strong> {round.explanation}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* SCIENCE ROUNDS */}
                    {activeLesson.scienceRounds && (
                      <div className="space-y-3">
                        {activeLesson.scienceRounds.map((round, i) => (
                          <div
                            key={i}
                            className="rounded-2xl border border-slate-200 p-4 space-y-2.5 bg-slate-50/50"
                          >
                            <div className="flex items-center justify-between text-xs text-slate-500">
                              <span className="font-bold text-slate-700">Raund {i + 1}</span>
                              <span>
                                {round.kind === 'true_false'
                                  ? "To'g'ri / Noto'g'ri"
                                  : 'Tezkor viktorina'}
                              </span>
                            </div>
                            <div className="text-sm sm:text-base font-bold text-slate-900">
                              {round.statement}
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              {round.options.map((opt) => {
                                const isRight = opt === round.correctAnswer;
                                return (
                                  <div
                                    key={opt}
                                    className={`px-3 py-2 rounded-xl border text-xs sm:text-sm font-semibold flex items-center justify-between gap-1.5 ${
                                      isRight
                                        ? 'bg-emerald-50 border-emerald-400 text-emerald-900'
                                        : 'bg-white border-slate-200 text-slate-700'
                                    }`}
                                  >
                                    <span>{opt}</span>
                                    {isRight && (
                                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                            <div className="text-xs text-slate-600">
                              <strong>Fakt:</strong> {round.fact}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Live Interactive Play-Test Overlay */}
      {testingLesson && (
        <LessonModal
          lesson={testingLesson.lesson}
          grade={getTestGradeForLesson(testingLesson.lesson)}
          initialStage={testingLesson.initialStage}
          testMode
          onComplete={() => setTestingLesson(null)}
          onClose={() => setTestingLesson(null)}
        />
      )}
    </>
  );
};
