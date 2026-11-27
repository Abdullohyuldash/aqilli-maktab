import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2, DoorOpen, Shirt, Sparkles } from 'lucide-react';
import { PlayerProfile } from '../types';
import { SHOP_ITEMS } from '../utils/storage';
import { AutoFitModal } from './AutoFitModal';

interface GymLockerModalProps {
  profile: PlayerProfile;
  onAttemptSchoolUniform: () => void;
  onEquipSportswear: () => void;
  onExitGym: () => void;
}

function getItemName(id: string | undefined, fallback: string): string {
  if (!id) return fallback;
  return SHOP_ITEMS.find((item) => item.id === id)?.name ?? fallback;
}

export const GymLockerModal: React.FC<GymLockerModalProps> = ({
  profile,
  onAttemptSchoolUniform,
  onEquipSportswear,
  onExitGym,
}) => {
  const [warningActive, setWarningActive] = useState(false);

  const currentOutfitName = getItemName(
    profile.equipped.outfit,
    profile.gender === 'girl' ? "Maktab ko'ylagi va yubkasi" : "Maktab ko'ylagi va shimi"
  );
  const currentBagName = getItemName(profile.equipped.bag, 'Sumka yechilgan');
  const hasBagOrBook = Boolean(profile.equipped.bag || profile.equipped.book);
  const currentHatName = profile.equipped.hat ? getItemName(profile.equipped.hat, '') : null;

  const handleUniformClick = () => {
    setWarningActive(true);
    onAttemptSchoolUniform();
  };

  return (
    <AutoFitModal overlayClassName="bg-slate-950/75 backdrop-blur-sm z-50">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Kiyinish xonasi — Sport zali qoidasi"
        className="w-[680px] max-w-[94vw] bg-white rounded-3xl shadow-2xl border-2 border-sky-300 overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-600 to-blue-700 px-6 py-4 text-white flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/15 border border-white/25 flex items-center justify-center text-2xl shrink-0">
              👟
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-sky-100">
                1-dars qoidasi · Xavfsizlik va tartib
              </div>
              <h2 className="font-display font-extrabold text-lg sm:text-xl leading-tight">
                Kiyinish xonasi — Sport zali qoidasi
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onExitGym}
            className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
          >
            <DoorOpen className="w-4 h-4" />
            <span>Zaldan chiqish</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          <p className="text-sm font-medium text-slate-700 leading-relaxed">
            Salom, <span className="font-bold text-slate-900">{profile.name}</span>! Sport zalida
            mashqlar paytida erkin harakatlanish va shikastlanmaslik uchun{' '}
            <span className="font-bold text-sky-700">sport formasi va krossovka</span> kiyish,
            sumka va kitoblarni esa kiyinish xonasi shkafiga qo&apos;yish kerak.
          </p>

          {/* Current Gear vs PE Sportswear comparison */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Current School Gear */}
            <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
                  Hozirgi holatingiz
                </span>
                <Shirt className="w-4 h-4 text-slate-400" />
              </div>
              <div className="font-display font-bold text-base text-slate-900">
                🎒 Maktab kiyimi
              </div>
              <ul className="text-xs text-slate-600 space-y-1.5">
                <li className="flex items-center gap-2">
                  <span className="text-slate-400">•</span>
                  <span>
                    Libos: <strong className="text-slate-800">{currentOutfitName}</strong>
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-slate-400">•</span>
                  <span>
                    Sumka:{' '}
                    <strong className={hasBagOrBook ? 'text-rose-700' : 'text-slate-800'}>
                      {currentBagName}
                      {profile.equipped.book ? ' + Kitob' : ''}
                    </strong>
                  </span>
                </li>
                {currentHatName && (
                  <li className="flex items-center gap-2">
                    <span className="text-slate-400">•</span>
                    <span>
                      Bosh kiyim: <strong className="text-slate-800">{currentHatName}</strong>
                    </span>
                  </li>
                )}
              </ul>
            </div>

            {/* Required PE Sportswear */}
            <div className="rounded-2xl border-2 border-emerald-400 bg-emerald-50/70 p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wide text-emerald-700">
                  Sport zali talabi
                </span>
                <Sparkles className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="font-display font-bold text-base text-emerald-950">
                🏃 Sport formasi va krossovka
              </div>
              <ul className="text-xs text-emerald-900 space-y-1.5">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Qulay ko&apos;k sportivka va chiziqli sport shim</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Sirpanmaydigan oq sport krossovkasi</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Sumka va kitob shkafda xavfsiz saqlanadi</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Inline Warning when attempting school uniform entry */}
          {warningActive && (
            <div
              role="alert"
              className="rounded-2xl bg-rose-50 border-2 border-rose-400 px-4 py-3 flex items-start gap-3 text-rose-950"
            >
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm font-semibold">
                <span className="font-extrabold text-rose-700">-5 🪙 </span>
                Sport zaliga maktab formasi va sumka bilan kirish mumkin emas! Iltimos, sport
                formasini kiying.
              </div>
            </div>
          )}

          {/* Two Choices */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <button
              type="button"
              onClick={handleUniformClick}
              className="px-4 py-3.5 rounded-2xl border-2 border-rose-200 bg-rose-50 hover:bg-rose-100 active:scale-[0.99] text-rose-900 font-display font-bold text-sm transition flex flex-col items-center justify-center gap-1 cursor-pointer text-center"
            >
              <span>🎒 Maktab formasi va sumka bilan kirish</span>
              <span className="text-[11px] font-semibold text-rose-600">
                Qoidaga zid (-5 🪙 jarima)
              </span>
            </button>

            <button
              type="button"
              onClick={onEquipSportswear}
              className="px-4 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-[0.99] text-white font-display font-bold text-sm shadow-lg shadow-emerald-600/25 transition flex flex-col items-center justify-center gap-1 cursor-pointer text-center border border-emerald-400"
            >
              <span>👟 Sport formasini va krossovkani kiyish</span>
              <span className="text-[11px] font-semibold text-emerald-100">
                To&apos;g&apos;ri tanlov (+10 ⭐ mukofot!)
              </span>
            </button>
          </div>
        </div>
      </div>
    </AutoFitModal>
  );
};
