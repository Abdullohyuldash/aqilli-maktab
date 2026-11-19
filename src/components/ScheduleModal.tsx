import React from 'react';
import { CalendarDays, X } from 'lucide-react';
import { PlayerProfile, SubjectId } from '../types';
import { getSubjectOrderForGrade } from '../utils/storage';
import { getLessonForPlayer, SUBJECT_META } from '../data/curriculum';
import { AutoFitModal } from './AutoFitModal';

interface ScheduleModalProps {
  profile: PlayerProfile;
  onClose: () => void;
}

const SUBJECT_EMOJI: Record<SubjectId, string> = {
  alifbe: '🔤',
  math: '🔢',
  english: '🌍',
  cs: '💻',
  science: '🌿',
};

const ROOM_COLOR_LABEL: Record<SubjectId, string> = {
  alifbe: 'Marjon xona',
  math: "Ko'k xona",
  english: 'Yashil xona',
  cs: 'Binafsha xona',
  science: "To'q sariq xona",
};

export const ScheduleModal: React.FC<ScheduleModalProps> = ({ profile, onClose }) => {
  const subjectOrder = getSubjectOrderForGrade(profile.grade);
  const activeIdx = profile.activeSubjectIndex % subjectOrder.length;

  return (
    <AutoFitModal overlayClassName="bg-slate-900/60 z-50">
      <div className="w-[780px] max-w-[94vw] bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 via-emerald-600 to-sky-600 px-6 py-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center text-white shrink-0">
              <CalendarDays className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <h2 className="font-display font-extrabold text-xl sm:text-2xl text-white leading-tight truncate">
                📅 Mening dars jadvalim ({profile.grade}-sinf)
              </h2>
              <p className="text-emerald-50 text-xs sm:text-sm font-medium mt-0.5">
                {profile.name} · Bugungi ketma-ketlikda {subjectOrder.length} ta dars bor
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-label="Yopish"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Schedule Rows (Zero Scroll — AutoFitModal handles all viewports cleanly) */}
        <div className="p-5 sm:p-6 bg-slate-50/70 space-y-2.5">
          {subjectOrder.map((subjectId, idx) => {
            const meta = SUBJECT_META[subjectId];
            const completions = profile.subjectCompletions[subjectId] || 0;
            const currentLesson = getLessonForPlayer(subjectId, profile.grade, completions);

            const isCurrent = idx === activeIdx;
            const isCompleted = idx < activeIdx;

            const hasLessonPrefix = /^\d+-dars/i.test(currentLesson.topicTitle.trim());
            const topicDisplay = hasLessonPrefix
              ? `${meta.name} — ${currentLesson.topicTitle}`
              : `${meta.name} — ${completions + 1}-dars: ${currentLesson.topicTitle}`;

            return (
              <div
                key={subjectId}
                className={`rounded-2xl border-2 px-4 py-3.5 transition-colors flex items-center gap-3.5 ${
                  isCurrent
                    ? 'bg-amber-50/90 border-amber-400 shadow-md'
                    : isCompleted
                    ? 'bg-emerald-50/70 border-emerald-200'
                    : 'bg-white border-slate-200'
                }`}
              >
                {/* Period / Lesson Order Badge */}
                <div
                  className={`w-16 h-12 rounded-xl flex flex-col items-center justify-center shrink-0 font-display font-extrabold leading-none ${
                    isCurrent
                      ? 'bg-amber-500 text-white shadow-sm'
                      : isCompleted
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}
                >
                  <span className="text-base">{idx + 1}-soat</span>
                  <span className="text-[10px] font-semibold opacity-90 mt-0.5">{idx + 1}-dars</span>
                </div>

                {/* Room Color Accent Bar + Subject Icon */}
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl shrink-0 border"
                  style={{
                    backgroundColor: meta.bgTint,
                    borderColor: meta.borderTint,
                  }}
                >
                  <span aria-hidden="true">{SUBJECT_EMOJI[subjectId]}</span>
                </div>

                {/* Subject Info, Floor, Room Color & Current Topic */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-display font-extrabold text-base text-slate-900">
                      {meta.name}
                    </span>
                    <span className="text-xs font-bold text-teal-700 font-mono-num">
                      · {meta.floor}-qavat
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                      <span aria-hidden="true">·</span>
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: meta.color }}
                      />
                      {ROOM_COLOR_LABEL[subjectId]}
                    </span>
                  </div>
                  <div className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5 truncate">
                    {topicDisplay}
                  </div>
                </div>

                {/* Status Badge */}
                <div className="shrink-0">
                  {isCurrent ? (
                    <span className="inline-flex items-center px-3.5 py-1.5 rounded-xl bg-amber-500 text-white font-bold text-xs sm:text-sm shadow-sm whitespace-nowrap">
                      🔔 Hozirgi dars
                    </span>
                  ) : isCompleted ? (
                    <span className="inline-flex items-center px-3.5 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-xs sm:text-sm whitespace-nowrap">
                      ✅ Bajarildi
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3.5 py-1.5 rounded-xl bg-slate-100 text-slate-500 border border-slate-200 font-semibold text-xs sm:text-sm whitespace-nowrap">
                      ⏳ Navbatda
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer with single clean Close button */}
        <div className="px-6 py-4 bg-white border-t border-slate-200 flex items-center justify-between gap-4">
          <div className="text-xs sm:text-sm text-slate-500 font-medium">
            Jami tugatilgan darslar:{' '}
            <strong className="text-slate-900 font-mono-num">{profile.completedLessons}</strong> ta
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-7 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-display font-bold text-sm sm:text-base shadow-sm transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
          >
            Yopish
          </button>
        </div>
      </div>
    </AutoFitModal>
  );
};
