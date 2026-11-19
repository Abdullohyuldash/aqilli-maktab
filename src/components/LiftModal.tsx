import React from 'react';
import { ArrowRight, Building2, CheckCircle2, X } from 'lucide-react';
import { FloorNumber, SubjectId } from '../types';
import { FLOOR_META, SUBJECT_META } from '../data/curriculum';
import { AutoFitModal } from './AutoFitModal';

interface LiftModalProps {
  currentFloor: FloorNumber;
  activeSubject: SubjectId;
  onSelectFloor: (floor: FloorNumber) => void;
  onClose: () => void;
}

const FLOORS: FloorNumber[] = [1, 2, 3];

export const LiftModal: React.FC<LiftModalProps> = ({
  currentFloor,
  activeSubject,
  onSelectFloor,
  onClose,
}) => {
  const activeMeta = SUBJECT_META[activeSubject];
  const activeLessonFloor = activeMeta.floor;

  return (
    <AutoFitModal overlayClassName="bg-slate-900/65 z-50">
      <div className="w-[640px] max-w-[94vw] bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Elevator Metallic-Sky Header */}
        <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-sky-800 px-6 py-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-white/15 border border-white/25 flex items-center justify-center text-2xl shrink-0">
              <span aria-hidden="true">🛗</span>
            </div>
            <div className="min-w-0">
              <h2 className="font-display font-extrabold text-xl sm:text-2xl text-white leading-tight">
                Maktab Lifti
              </h2>
              <p className="text-sky-100 text-xs sm:text-sm font-medium mt-0.5">
                Hozirgi qavat: <strong className="text-white">{currentFloor}-qavat</strong> · Qaysi qavatga boramiz?
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

        {/* 3 Large Kid-Friendly Floor Selection Buttons */}
        <div className="p-5 sm:p-6 bg-slate-50/80 space-y-3">
          {FLOORS.map((floorNum) => {
            const meta = FLOOR_META[floorNum];
            const isCurrent = floorNum === currentFloor;
            const hasActiveLesson = floorNum === activeLessonFloor;

            return (
              <button
                key={floorNum}
                type="button"
                onClick={() => onSelectFloor(floorNum)}
                className={`w-full text-left rounded-2xl border-2 p-4 sm:p-5 transition-all cursor-pointer flex items-center gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                  hasActiveLesson
                    ? 'bg-amber-50/90 border-amber-400 hover:border-amber-500 shadow-md'
                    : isCurrent
                    ? 'bg-slate-100 border-slate-300 hover:bg-slate-200/70'
                    : 'bg-white border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 shadow-sm'
                }`}
              >
                {/* Big Floor Number Plate */}
                <div
                  className="w-16 h-16 rounded-2xl flex flex-col items-center justify-center text-white shrink-0 shadow-sm"
                  style={{ backgroundColor: meta.accentColor }}
                >
                  <span className="font-display font-extrabold text-2xl leading-none font-mono-num">
                    {floorNum}
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-wide opacity-90 mt-0.5">
                    qavat
                  </span>
                </div>

                {/* Floor Title & Rooms Description */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-display font-extrabold text-lg sm:text-xl text-slate-900">
                      {meta.title}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      · {meta.subtitle}
                    </span>
                  </div>
                  <div className="text-sm font-medium text-slate-600 mt-1">
                    {meta.roomsSummary}
                  </div>

                  {/* Active Lesson Indicator Badge */}
                  {hasActiveLesson && (
                    <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500 text-white text-xs sm:text-sm font-bold shadow-sm">
                      <span>🔔 Hozirgi dars shu yerda ({activeMeta.name})</span>
                    </div>
                  )}
                </div>

                {/* Right Action / Status Indicator */}
                <div className="shrink-0 flex flex-col items-end gap-1">
                  {isCurrent ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-xs whitespace-nowrap">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      Shu yerdasiz
                    </span>
                  ) : (
                    <span
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-white font-display font-bold text-sm shadow-sm whitespace-nowrap"
                      style={{ backgroundColor: meta.accentColor }}
                    >
                      Borish
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-white border-t border-slate-200 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 font-medium">
            <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
            <span>
              Keyingi dars: <strong className="text-slate-800">{activeMeta.name}</strong> ({activeLessonFloor}-qavat)
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-display font-bold text-sm transition-colors cursor-pointer"
          >
            Yopish
          </button>
        </div>
      </div>
    </AutoFitModal>
  );
};
