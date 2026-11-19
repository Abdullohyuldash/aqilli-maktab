import React, { useState } from 'react';
import { ArrowRight, BookOpen, Check, Coins, GraduationCap, Trophy } from 'lucide-react';
import { EquippedAccessories, PlayerGender, PlayerProfile } from '../types';
import { filterEquippedForGender, getTierLabel, SHIRT_COLORS } from '../utils/storage';
import { AvatarPreview3D } from './AvatarPreview3D';
import { AutoFitModal } from './AutoFitModal';

interface StartScreenProps {
  initialProfile: PlayerProfile;
  isReturning: boolean;
  onStart: (name: string, gender: PlayerGender, grade: number, shirtColor: string) => void;
  onOpenInspector: () => void;
}

const GRADES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

export const StartScreen: React.FC<StartScreenProps> = ({
  initialProfile,
  isReturning,
  onStart,
  onOpenInspector,
}) => {
  const [name, setName] = useState(initialProfile.name || '');
  const [gender, setGender] = useState<PlayerGender>(initialProfile.gender || 'boy');
  const [grade, setGrade] = useState(initialProfile.grade || 5);
  const [shirtColor, setShirtColor] = useState(initialProfile.shirtColor || SHIRT_COLORS[0].hex);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = name.trim() || "O'quvchi";
    setError('');
    onStart(cleaned, gender, grade, shirtColor);
  };

  const previewEquipped: EquippedAccessories = filterEquippedForGender(
    initialProfile.equipped || {},
    gender
  );

  return (
    <AutoFitModal variant="screen" overlayClassName="bg-slate-100">
      <div className="w-[min(1024px,94vw)] bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-stretch">
        {/* Left Column: Live 3D Roblox Character Preview */}
        <div className="lg:col-span-5 bg-gradient-to-b from-sky-100 via-sky-50 to-slate-100 p-6 sm:p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-200">
          <div>
            <div className="text-xs font-semibold tracking-wide text-blue-700 mb-2">
              Interaktiv 3D Ta&apos;limiy O&apos;yin
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight text-balance">
              3D Bilimlar Maktabi
            </h1>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Maktab bo&apos;ylab yuring, dars xonalariga kiring, mini-o&apos;yinlarda ball yig&apos;ing va 3D do&apos;kondan aksessuarlar oling.
            </p>
          </div>

          <div className="my-4 h-64 sm:h-72 lg:h-80 w-full relative">
            <AvatarPreview3D gender={gender} shirtColor={shirtColor} equipped={previewEquipped} />
          </div>

          <div className="pt-4 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-600">
            <span className="font-semibold text-slate-900 truncate max-w-[160px]">
              {name.trim() || "O'quvchi"} · {grade}-sinf
            </span>
            {isReturning ? (
              <span className="flex items-center gap-3 font-mono-num text-slate-700">
                <span className="inline-flex items-center gap-1 font-semibold text-amber-700">
                  <Coins className="w-3.5 h-3.5 text-amber-500" />
                  {initialProfile.coins}
                </span>
                <span className="inline-flex items-center gap-1 font-semibold text-blue-700">
                  <Trophy className="w-3.5 h-3.5 text-blue-600" />
                  {initialProfile.completedLessons} dars
                </span>
              </span>
            ) : (
              <span className="text-slate-500">5 ta fan · 3D do&apos;kon</span>
            )}
          </div>
        </div>

        {/* Right Column: Setup Form */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between gap-6"
        >
          <div className="space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Personajingizni yarating
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Dars savollari tanlangan sinfingizga qarab avtomatik moslashadi.
              </p>
            </div>

            {/* 1. Name input + Boy/Girl Gender Selector side-by-side */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 items-end">
              <div className="sm:col-span-6">
                <label htmlFor="student-name" className="block text-sm font-semibold text-slate-800 mb-1.5">
                  O&apos;quvchi ismi
                </label>
                <input
                  id="student-name"
                  type="text"
                  maxLength={24}
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="Masalan: Ali, Madina, Jasur..."
                  className="w-full h-12 px-4 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 focus:bg-white transition-colors"
                  autoFocus
                />
                {error && <p className="mt-1 text-xs font-medium text-rose-600">{error}</p>}
              </div>

              <div className="sm:col-span-6">
                <span className="block text-sm font-semibold text-slate-800 mb-1.5">
                  Personaj turi
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setGender('boy')}
                    className={`h-12 px-3 rounded-xl border-2 font-display font-bold text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                      gender === 'boy'
                        ? 'border-blue-600 bg-blue-50 text-blue-900 shadow-sm'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <span aria-hidden="true" className="text-lg">
                      👦
                    </span>
                    <span className="whitespace-nowrap">O&apos;g&apos;il bola</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setGender('girl')}
                    className={`h-12 px-3 rounded-xl border-2 font-display font-bold text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 ${
                      gender === 'girl'
                        ? 'border-pink-500 bg-pink-50 text-pink-900 shadow-sm'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <span aria-hidden="true" className="text-lg">
                      👧
                    </span>
                    <span className="whitespace-nowrap">Qiz bola</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 2. Grade selector (1-11) */}
            <div>
              <div className="flex items-baseline justify-between gap-2 mb-2">
                <label className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-blue-600" />
                  Sinfingizni tanlang
                </label>
                <span className="text-xs font-medium text-slate-500">{getTierLabel(grade)}</span>
              </div>
              <div className="grid grid-cols-6 sm:grid-cols-11 gap-1.5">
                {GRADES.map((g) => {
                  const selected = g === grade;
                  return (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGrade(g)}
                      className={`h-10 rounded-xl font-mono-num text-sm font-bold transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                        selected
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {g}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Shirt color picker */}
            <div>
              <span className="block text-sm font-semibold text-slate-800 mb-2.5">
                Personaj kiyimi rangi
              </span>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                {SHIRT_COLORS.map((c) => {
                  const selected = shirtColor.toLowerCase() === c.hex.toLowerCase();
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setShirtColor(c.hex)}
                      className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl border transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                        selected
                          ? 'border-slate-900 bg-slate-50 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <span
                        className="w-8 h-8 rounded-lg flex items-center justify-center shadow-inner"
                        style={{ backgroundColor: c.hex }}
                      >
                        {selected && <Check className="w-4 h-4 text-white stroke-[3]" />}
                      </span>
                      <span className="text-xs font-semibold text-slate-700 whitespace-nowrap">
                        {c.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 4. Enter School CTA + Curriculum Inspector */}
          <div className="pt-2 space-y-2.5">
            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-display font-bold text-base sm:text-lg shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600"
            >
              <span>Maktabga kirish</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={onOpenInspector}
              className="w-full py-2.5 px-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span>Barcha darslar va o&apos;yinlarni ko&apos;rish / tekshirish</span>
            </button>
          </div>
        </form>
      </div>
    </AutoFitModal>
  );
};
