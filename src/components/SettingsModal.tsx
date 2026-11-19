import React, { useState } from 'react';
import { Check, LogOut, Settings, X } from 'lucide-react';
import { PlayerGender, PlayerProfile } from '../types';
import { getTierLabel, SHIRT_COLORS } from '../utils/storage';
import { AutoFitModal } from './AutoFitModal';

interface SettingsModalProps {
  profile: PlayerProfile;
  onSave: (name: string, gender: PlayerGender, grade: number, shirtColor: string) => void;
  onBackToStart: () => void;
  onClose: () => void;
}

const GRADES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

export const SettingsModal: React.FC<SettingsModalProps> = ({
  profile,
  onSave,
  onBackToStart,
  onClose,
}) => {
  const [name, setName] = useState(profile.name);
  const [gender, setGender] = useState<PlayerGender>(profile.gender || 'boy');
  const [grade, setGrade] = useState(profile.grade);
  const [shirtColor, setShirtColor] = useState(profile.shirtColor);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = name.trim() || profile.name;
    onSave(cleaned, gender, grade, shirtColor);
    onClose();
  };

  return (
    <AutoFitModal overlayClassName="z-40 bg-slate-900/60">
      <form
        onSubmit={handleSubmit}
        className="w-[min(512px,94vw)] bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Settings className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-display font-bold text-slate-900">Sozlamalar</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl hover:bg-slate-100 text-slate-500 flex items-center justify-center cursor-pointer"
            aria-label="Yopish"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <label htmlFor="settings-name" className="block text-sm font-semibold text-slate-800 mb-1.5">
              O&apos;quvchi ismi
            </label>
            <input
              id="settings-name"
              type="text"
              maxLength={24}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
            />
          </div>

          <div>
            <span className="block text-sm font-semibold text-slate-800 mb-1.5">
              Personaj turi
            </span>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setGender('boy')}
                className={`h-11 px-3 rounded-xl border-2 font-display font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  gender === 'boy'
                    ? 'border-blue-600 bg-blue-50 text-blue-900 shadow-sm'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                <span aria-hidden="true" className="text-lg">
                  👦
                </span>
                <span>O&apos;g&apos;il bola</span>
              </button>

              <button
                type="button"
                onClick={() => setGender('girl')}
                className={`h-11 px-3 rounded-xl border-2 font-display font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  gender === 'girl'
                    ? 'border-pink-500 bg-pink-50 text-pink-900 shadow-sm'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                <span aria-hidden="true" className="text-lg">
                  👧
                </span>
                <span>Qiz bola</span>
              </button>
            </div>
            {gender !== profile.gender && (
              <p className="mt-1.5 text-xs text-amber-700 font-medium">
                Yangi jinsga mos kelmaydigan kiyilgan buyumlar avtomatik yechiladi (sotib olinganlar saqlanadi).
              </p>
            )}
          </div>

          <div>
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-sm font-semibold text-slate-800">Sinfni o&apos;zgartirish</span>
              <span className="text-xs text-slate-500">{getTierLabel(grade)}</span>
            </div>
            <div className="grid grid-cols-6 sm:grid-cols-11 gap-1.5">
              {GRADES.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGrade(g)}
                  className={`h-9 rounded-lg font-mono-num text-xs font-bold cursor-pointer transition-colors ${
                    grade === g
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="block text-sm font-semibold text-slate-800 mb-2">Kiyim rangi</span>
            <div className="flex flex-wrap gap-2.5">
              {SHIRT_COLORS.map((c) => {
                const selected = shirtColor.toLowerCase() === c.hex.toLowerCase();
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setShirtColor(c.hex)}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer transition-transform ${
                      selected ? 'ring-2 ring-offset-2 ring-slate-900 scale-105' : ''
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  >
                    {selected && <Check className="w-5 h-5 text-white stroke-[3]" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onBackToStart}
            className="px-3.5 py-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Kirish ekraniga qaytish
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-sm font-semibold cursor-pointer"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold cursor-pointer shadow-sm"
            >
              Saqlash
            </button>
          </div>
        </div>
      </form>
    </AutoFitModal>
  );
};
