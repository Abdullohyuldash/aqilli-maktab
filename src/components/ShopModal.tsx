import React, { useState } from 'react';
import { Check, Coins, ShoppingBag, X } from 'lucide-react';
import { PlayerProfile, ShopCategory, ShopItem, ShopItemId } from '../types';
import { SHOP_ITEMS } from '../utils/storage';
import { AutoFitModal } from './AutoFitModal';

interface ShopModalProps {
  profile: PlayerProfile;
  onBuy: (item: ShopItem) => void;
  onToggleEquip: (item: ShopItem) => void;
  onClose: () => void;
}

const ShopItemIllustration: React.FC<{ id: ShopItemId }> = ({ id }) => {
  switch (id) {
    case 'white_shirt_tie':
      return (
        <svg viewBox="0 0 80 80" className="w-16 h-16" aria-hidden="true">
          <path d="M22 18 L32 14 L40 22 L48 14 L58 18 L68 30 L58 38 L55 34 L55 66 L25 66 L25 34 L22 38 L12 30 Z" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="2.2" />
          <polygon points="32,14 40,24 30,27" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="1.5" />
          <polygon points="48,14 40,24 50,27" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="1.5" />
          <polygon points="36,22 44,22 42,29 38,29" fill="#1E3A8A" />
          <polygon points="38,29 42,29 44,54 40,60 36,54" fill="#1E3A8A" />
          <rect x="37" y="38" width="6" height="3.5" fill="#DC2626" />
          <rect x="46" y="36" width="7" height="7" rx="1.5" fill="#E2E8F0" />
        </svg>
      );
    case 'school_vest':
      return (
        <svg viewBox="0 0 80 80" className="w-16 h-16" aria-hidden="true">
          <path d="M22 18 L32 14 L40 22 L48 14 L58 18 L68 30 L58 38 L55 34 L55 66 L25 66 L25 34 L22 38 L12 30 Z" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="2" />
          <path d="M25 20 L33 16 L40 36 L47 16 L55 20 L55 65 L25 65 Z" fill="#1E3A8A" />
          <polygon points="37,22 43,22 42,35 38,35" fill="#DC2626" />
          <rect x="25" y="60" width="30" height="4" fill="#E2E8F0" />
          <circle cx="48" cy="39" r="3.5" fill="#F59E0B" />
        </svg>
      );
    case 'formal_blazer':
      return (
        <svg viewBox="0 0 80 80" className="w-16 h-16" aria-hidden="true">
          <path d="M20 18 L31 14 L40 28 L49 14 L60 18 L70 34 L60 40 L57 35 L57 67 L23 67 L23 35 L20 40 L10 34 Z" fill="#172554" />
          <polygon points="33,15 47,15 40,38" fill="#F8FAFC" />
          <polygon points="37,19 43,19 42,35 40,39 38,35" fill="#DC2626" />
          <polygon points="31,15 40,38 28,36" fill="#1E3A8A" />
          <polygon points="49,15 40,38 52,36" fill="#1E3A8A" />
          <circle cx="35" cy="48" r="2.6" fill="#F59E0B" />
          <circle cx="45" cy="48" r="2.6" fill="#F59E0B" />
          <circle cx="35" cy="57" r="2.6" fill="#F59E0B" />
          <circle cx="45" cy="57" r="2.6" fill="#F59E0B" />
          <rect x="46" y="34" width="7" height="3" rx="1" fill="#FFFFFF" />
        </svg>
      );
    case 'girl_blouse_skirt':
      return (
        <svg viewBox="0 0 80 80" className="w-16 h-16" aria-hidden="true">
          <path d="M24 14 L33 12 L40 18 L47 12 L56 14 L64 26 L56 32 L53 28 L53 44 L27 44 L27 28 L24 32 L16 26 Z" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="2" />
          <polygon points="34,19 40,22 34,26" fill="#1E3A8A" />
          <polygon points="46,19 40,22 46,26" fill="#1E3A8A" />
          <circle cx="40" cy="22.5" r="2.4" fill="#1E3A8A" />
          <path d="M27 44 L53 44 L61 68 L19 68 Z" fill="#1E3A8A" />
          <line x1="34" y1="45" x2="31" y2="67" stroke="#172554" strokeWidth="2" />
          <line x1="46" y1="45" x2="49" y2="67" stroke="#172554" strokeWidth="2" />
        </svg>
      );
    case 'girl_vest_skirt':
      return (
        <svg viewBox="0 0 80 80" className="w-16 h-16" aria-hidden="true">
          <path d="M24 14 L33 12 L40 18 L47 12 L56 14 L64 26 L56 32 L53 28 L53 44 L27 44 L27 28 L24 32 L16 26 Z" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="2" />
          <path d="M27 16 L34 14 L40 28 L46 14 L53 16 L53 44 L27 44 Z" fill="#1E3A8A" />
          <circle cx="47" cy="31" r="3" fill="#F59E0B" />
          <path d="M27 44 L53 44 L61 68 L19 68 Z" fill="#1E3A8A" />
          <rect x="27" y="42" width="26" height="3.5" fill="#E2E8F0" />
        </svg>
      );
    case 'girl_apron_uniform':
      return (
        <svg viewBox="0 0 80 80" className="w-16 h-16" aria-hidden="true">
          <path d="M24 14 L33 12 L40 18 L47 12 L56 14 L64 26 L56 32 L53 28 L53 44 L27 44 L27 28 L24 32 L16 26 Z" fill="#172554" />
          <path d="M27 44 L53 44 L62 68 L18 68 Z" fill="#172554" />
          <rect x="29" y="15" width="5" height="28" rx="2" fill="#FFFFFF" />
          <rect x="46" y="15" width="5" height="28" rx="2" fill="#FFFFFF" />
          <rect x="31" y="23" width="18" height="20" rx="2" fill="#FFFFFF" />
          <rect x="25" y="42" width="30" height="5" rx="2" fill="#FFFFFF" />
          <path d="M28 47 L52 47 L56 65 L24 65 Z" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
        </svg>
      );
    case 'sport_uniform':
      return (
        <svg viewBox="0 0 80 80" className="w-16 h-16" aria-hidden="true">
          <path d="M22 18 L32 13 L48 13 L58 18 L68 32 L58 38 L55 33 L55 66 L25 66 L25 33 L22 38 L12 32 Z" fill="#0284C7" />
          <rect x="25" y="45" width="30" height="21" fill="#0F172A" />
          <rect x="25" y="40" width="30" height="5" fill="#F8FAFC" />
          <rect x="32" y="11" width="16" height="6" rx="2" fill="#0F172A" />
          <rect x="32" y="11" width="16" height="2" fill="#F8FAFC" />
          <rect x="38.5" y="17" width="3" height="49" fill="#F8FAFC" />
          <line x1="15" y1="30" x2="23" y2="20" stroke="#F8FAFC" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="65" y1="30" x2="57" y2="20" stroke="#F8FAFC" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="48" cy="29" r="3.6" fill="#F59E0B" />
        </svg>
      );
    case 'ceremonial_uniform':
      return (
        <svg viewBox="0 0 80 80" className="w-16 h-16" aria-hidden="true">
          <path d="M21 18 L32 13 L48 13 L59 18 L69 33 L59 39 L56 34 L56 67 L24 67 L24 34 L21 39 L11 33 Z" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="2" />
          <rect x="32" y="11" width="16" height="6" rx="1.5" fill="#1E3A8A" />
          <rect x="32" y="11" width="16" height="2" fill="#F59E0B" />
          <rect x="21" y="15" width="10" height="4.5" rx="1.5" fill="#F59E0B" />
          <rect x="49" y="15" width="10" height="4.5" rx="1.5" fill="#F59E0B" />
          <polygon points="48,17 55,21 31,64 24,60" fill="#0EA5E9" />
          <polygon points="50.5,18.5 53.5,20.5 29.5,63 26.5,61" fill="#FFFFFF" />
          <polygon points="52.5,20 56,22 32,65 28.5,63" fill="#10B981" />
          <line x1="50" y1="18" x2="26" y2="61" stroke="#DC2626" strokeWidth="1.2" />
          <circle cx="28" cy="61" r="4" fill="#F59E0B" />
          <circle cx="46" cy="37" r="2.2" fill="#F59E0B" />
          <circle cx="46" cy="48" r="2.2" fill="#F59E0B" />
          <rect x="24" y="63" width="32" height="3.5" fill="#F59E0B" />
        </svg>
      );
    case 'chust_doppi':
      return (
        <svg viewBox="0 0 80 80" className="w-16 h-16" aria-hidden="true">
          <path d="M16 44 L26 24 L54 24 L64 44 Z" fill="#111827" />
          <rect x="15" y="42" width="50" height="15" rx="4" fill="#1E293B" />
          <rect x="15" y="54" width="50" height="3" rx="1.5" fill="#F8FAFC" />
          <path d="M34 38 C34 30, 44 28, 45 35 C46 39, 40 41, 38 38" fill="none" stroke="#FFFFFF" strokeWidth="2.8" strokeLinecap="round" />
          <circle cx="26" cy="49" r="2.5" fill="#FFFFFF" />
          <circle cx="40" cy="49" r="2.5" fill="#FFFFFF" />
          <circle cx="54" cy="49" r="2.5" fill="#FFFFFF" />
        </svg>
      );
    case 'girl_white_bows':
      return (
        <svg viewBox="0 0 80 80" className="w-16 h-16" aria-hidden="true">
          <g transform="translate(22,40)">
            <ellipse cx="-8" cy="-5" rx="9" ry="7" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
            <ellipse cx="8" cy="-5" rx="9" ry="7" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
            <path d="M-4 0 L-9 16 L-1 13 Z" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1.5" />
            <path d="M4 0 L9 16 L1 13 Z" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1.5" />
            <circle cx="0" cy="-4" r="4.5" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="1.8" />
          </g>
          <g transform="translate(58,40)">
            <ellipse cx="-8" cy="-5" rx="9" ry="7" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
            <ellipse cx="8" cy="-5" rx="9" ry="7" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
            <path d="M-4 0 L-9 16 L-1 13 Z" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1.5" />
            <path d="M4 0 L9 16 L1 13 Z" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1.5" />
            <circle cx="0" cy="-4" r="4.5" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="1.8" />
          </g>
        </svg>
      );
    case 'iroqi_doppi':
      return (
        <svg viewBox="0 0 80 80" className="w-16 h-16" aria-hidden="true">
          <path d="M16 44 L26 23 L54 23 L64 44 Z" fill="#06B6D4" />
          <rect x="15" y="42" width="50" height="15" rx="4" fill="#1D4ED8" />
          <rect x="15" y="53" width="50" height="4.5" rx="2" fill="#F59E0B" />
          <polygon points="40,28 46,35 40,42 34,35" fill="#F43F5E" />
          <polygon points="27,45 31,49 27,53 23,49" fill="#10B981" />
          <polygon points="40,45 44,49 40,53 36,49" fill="#F59E0B" />
          <polygon points="53,45 57,49 53,53 49,49" fill="#10B981" />
          <circle cx="40" cy="22" r="4" fill="#F59E0B" />
        </svg>
      );
    case 'scholar_cap':
      return (
        <svg viewBox="0 0 80 80" className="w-16 h-16" aria-hidden="true">
          <polygon points="40,16 70,30 40,44 10,30" fill="#1E1B4B" />
          <path d="M23 37 L23 51 C23 56, 57 56, 57 51 L57 37 L40 45 Z" fill="#312E81" />
          <circle cx="40" cy="30" r="3.5" fill="#F59E0B" />
          <path d="M40 30 L61 36 L61 54" fill="none" stroke="#F59E0B" strokeWidth="2.8" strokeLinecap="round" />
          <polygon points="58,53 64,53 66,64 56,64" fill="#F59E0B" />
        </svg>
      );
    case 'basic_backpack':
      return (
        <svg viewBox="0 0 80 80" className="w-16 h-16" aria-hidden="true">
          <rect x="28" y="10" width="24" height="10" rx="4" fill="#1E293B" />
          <rect x="18" y="18" width="44" height="50" rx="8" fill="#2563EB" />
          <rect x="24" y="40" width="32" height="22" rx="5" fill="#EF4444" />
          <rect x="27" y="45" width="26" height="3.5" rx="1.5" fill="#E2E8F0" />
        </svg>
      );
    case 'classic_satchel':
      return (
        <svg viewBox="0 0 80 80" className="w-16 h-16" aria-hidden="true">
          <path d="M31 22 C31 14, 49 14, 49 22" fill="none" stroke="#78350F" strokeWidth="4.5" strokeLinecap="round" />
          <rect x="14" y="22" width="52" height="44" rx="7" fill="#92400E" />
          <rect x="14" y="22" width="52" height="22" rx="6" fill="#78350F" />
          <rect x="14" y="40" width="52" height="4" fill="#1E3A8A" />
          <rect x="24" y="22" width="6" height="34" rx="2" fill="#451A03" />
          <rect x="50" y="22" width="6" height="34" rx="2" fill="#451A03" />
          <rect x="23" y="42" width="8" height="7" rx="1.5" fill="#F59E0B" />
          <rect x="49" y="42" width="8" height="7" rx="1.5" fill="#F59E0B" />
        </svg>
      );
    case 'gold_backpack':
      return (
        <svg viewBox="0 0 80 80" className="w-16 h-16" aria-hidden="true">
          <rect x="12" y="30" width="8" height="28" rx="3" fill="#B45309" />
          <rect x="60" y="30" width="8" height="28" rx="3" fill="#B45309" />
          <rect x="18" y="14" width="44" height="54" rx="8" fill="#F59E0B" />
          <rect x="18" y="28" width="44" height="7" fill="#38BDF8" />
          <polygon points="40,40 48,50 40,60 32,50" fill="#38BDF8" />
        </svg>
      );
    case 'school_watch':
      return (
        <svg viewBox="0 0 80 80" className="w-16 h-16" aria-hidden="true">
          <rect x="31" y="10" width="18" height="60" rx="5" fill="#0F766E" />
          <circle cx="40" cy="40" r="17" fill="#CBD5E1" stroke="#475569" strokeWidth="2.5" />
          <circle cx="40" cy="40" r="13" fill="#FFFFFF" />
          <line x1="40" y1="40" x2="40" y2="31" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="40" y1="40" x2="48" y2="40" stroke="#DC2626" strokeWidth="2.2" strokeLinecap="round" />
          <circle cx="40" cy="40" r="2.2" fill="#0F172A" />
        </svg>
      );
    case 'honor_medal':
      return (
        <svg viewBox="0 0 80 80" className="w-16 h-16" aria-hidden="true">
          <polygon points="24,12 36,12 42,36 32,36" fill="#DC2626" />
          <polygon points="56,12 44,12 38,36 48,36" fill="#1D4ED8" />
          <circle cx="40" cy="49" r="18" fill="#F59E0B" stroke="#B45309" strokeWidth="3" />
          <circle cx="40" cy="49" r="13" fill="#FDE047" />
          <polygon points="40,39 43,46 50,46 44,51 46,58 40,54 34,58 36,51 30,46 37,46" fill="#FFFFFF" />
        </svg>
      );
    case 'scholar_book':
      return (
        <svg viewBox="0 0 80 80" className="w-16 h-16" aria-hidden="true">
          <rect x="18" y="14" width="44" height="54" rx="5" fill="#059669" />
          <rect x="22" y="14" width="7" height="54" fill="#047857" />
          <rect x="57" y="18" width="5" height="46" rx="1.5" fill="#FEFCE8" />
          <rect x="22" y="23" width="38" height="4.5" fill="#F59E0B" />
          <rect x="35" y="34" width="14" height="14" rx="2.5" fill="#F59E0B" />
          <rect x="38" y="37" width="8" height="8" rx="1.5" fill="#059669" />
        </svg>
      );
  }
};

export const ShopModal: React.FC<ShopModalProps> = ({
  profile,
  onBuy,
  onToggleEquip,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<ShopCategory>('outfit');
  const isGirl = profile.gender === 'girl';

  const shopTabs: { id: ShopCategory; emoji: string; label: string; hint: string }[] = [
    {
      id: 'outfit',
      emoji: isGirl ? '👗' : '👔',
      label: 'Kiyimlar',
      hint: isGirl
        ? "Qiz bolalar maktab formalari — bir vaqtda bitta kiyim kiyiladi."
        : "O'g'il bolalar maktab formalari — bir vaqtda bitta kiyim kiyiladi.",
    },
    {
      id: 'hat',
      emoji: isGirl ? '🎀' : '🧢',
      label: 'Bosh kiyim',
      hint: isGirl
        ? "Oq bantik, milliy Iroqi do'ppi va bilimdon qalpoqchasi — bir vaqtda bitta tanlanadi."
        : "Milliy Chust do'ppisi va bilimdon qalpoqchasi — bir vaqtda bitta tanlanadi.",
    },
    {
      id: 'bag',
      emoji: '🎒',
      label: 'Sumkalar',
      hint: "Maktab ryukzagi va portfellari — bir vaqtda bitta sumka taqiladi.",
    },
    {
      id: 'accessory',
      emoji: '🏅',
      label: 'Aksessuar',
      hint: "Soat, oltin medal va kitobni bir vaqtda birga taqish mumkin!",
    },
  ];

  // Strictly filter items by player gender ('both' or matching player.gender)
  const genderAllowedItems = SHOP_ITEMS.filter(
    (item) => item.genderRestriction === 'both' || item.genderRestriction === profile.gender
  );

  const isEquipped = (item: ShopItem): boolean => {
    return profile.equipped[item.slot] === item.id;
  };

  const tabItems = genderAllowedItems.filter((item) => item.category === activeTab);
  const currentTabInfo = shopTabs.find((t) => t.id === activeTab)!;

  const countEquippedInCategory = (cat: ShopCategory) =>
    genderAllowedItems.filter((item) => item.category === cat && isEquipped(item)).length;

  return (
    <AutoFitModal overlayClassName="z-40 bg-slate-900/60">
      <div className="w-[min(960px,94vw)] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between gap-4 bg-gradient-to-r from-amber-50 via-white to-sky-50">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-sm shrink-0">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900">
                  Maktab Do&apos;koni
                </h2>
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-lg border ${
                    isGirl
                      ? 'bg-pink-50 text-pink-700 border-pink-200'
                      : 'bg-blue-50 text-blue-700 border-blue-200'
                  }`}
                >
                  {isGirl ? '👧 Qiz bola' : "👦 O'g'il bola"}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600">
                Sotib olingan va kiyilgan buyumlar 3D personajingizda darhol ko&apos;rinadi.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="bg-white border border-amber-300 rounded-xl px-4 py-2 flex items-center gap-2 shadow-sm">
              <Coins className="w-5 h-5 text-amber-500" />
              <span className="font-mono-num font-bold text-base text-amber-950">
                {profile.coins} ball
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-10 h-10 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 flex items-center justify-center cursor-pointer transition-colors"
              aria-label="Do'konni yopish"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 4 Category Tabs */}
        <div className="px-6 pt-4 pb-3 bg-slate-50/80 border-b border-slate-200">
          <div className="grid grid-cols-4 gap-2.5">
            {shopTabs.map((tab) => {
              const active = activeTab === tab.id;
              const eqCount = countEquippedInCategory(tab.id);
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-2.5 rounded-2xl border-2 font-display font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    active
                      ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-blue-50/40'
                  }`}
                >
                  <span aria-hidden="true" className="text-base">
                    {tab.emoji}
                  </span>
                  <span className="truncate">{tab.label}</span>
                  {eqCount > 0 && (
                    <span
                      className={`text-[11px] font-mono-num font-extrabold px-1.5 py-0.5 rounded-md ${
                        active ? 'bg-white/25 text-white' : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {eqCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <p className="text-xs text-slate-500 font-medium mt-2.5 px-1">
            {currentTabInfo.hint}
          </p>
        </div>

        {/* Filtered Item Grid (2 or 3 columns, zero scroll!) */}
        <div className={tabItems.length > 3 ? 'p-4 sm:p-5 bg-white' : 'p-5 sm:p-6 bg-white'}>
          <div
            className={`grid ${
              tabItems.length === 2
                ? 'grid-cols-2 gap-4 max-w-[610px] mx-auto'
                : tabItems.length > 3
                ? 'grid-cols-3 gap-3.5'
                : 'grid-cols-3 gap-4'
            }`}
          >
            {tabItems.map((item) => {
              const owned = profile.ownedItems.includes(item.id);
              const equipped = isEquipped(item);
              const canAfford = profile.coins >= item.price;

              return (
                <div
                  key={item.id}
                  className={`rounded-2xl border-2 flex flex-col justify-between transition-colors ${
                    tabItems.length > 3 ? 'p-3.5 gap-3' : 'p-4 gap-4'
                  } ${
                    equipped
                      ? 'border-emerald-500 bg-emerald-50/40 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div>
                    <div
                      className={`relative rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center ${
                        tabItems.length > 3 ? 'h-24 mb-2.5' : 'h-28 mb-3.5'
                      }`}
                    >
                      <ShopItemIllustration id={item.id} />
                      {equipped && (
                        <span className="absolute top-2 right-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-600 text-white text-[11px] font-bold shadow-sm">
                          <Check className="w-3 h-3 stroke-[3]" />
                          Kiyilgan
                        </span>
                      )}
                    </div>

                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-display font-extrabold text-base text-slate-900 leading-snug">
                        {item.name}
                      </h3>
                      <span className="font-mono-num text-xs font-extrabold text-amber-800 bg-amber-100 border border-amber-200 px-2 py-0.5 rounded-lg whitespace-nowrap shrink-0">
                        {item.price} ball
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div>
                    {!owned ? (
                      <button
                        type="button"
                        disabled={!canAfford}
                        onClick={() => onBuy(item)}
                        className={`w-full py-2.5 px-4 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-1.5 ${
                          canAfford
                            ? 'bg-amber-500 hover:bg-amber-600 text-white cursor-pointer shadow-sm'
                            : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        {canAfford ? (
                          <>Sotib olish ({item.price} ball)</>
                        ) : (
                          <>Ball yetarli emas</>
                        )}
                      </button>
                    ) : equipped ? (
                      <button
                        type="button"
                        onClick={() => onToggleEquip(item)}
                        className="w-full py-2.5 px-4 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-bold text-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        Yechish
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onToggleEquip(item)}
                        className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-colors cursor-pointer shadow-sm"
                      >
                        {item.category === 'accessory' ? 'Taqish' : 'Kiyish'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-4 text-xs text-slate-500">
          <span>
            Darslarni bajarib ko&apos;proq ball to&apos;plang (+20 har bir javob, +30 dars bonusi).
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs cursor-pointer transition-colors whitespace-nowrap"
          >
            Koridorga qaytish
          </button>
        </div>
      </div>
    </AutoFitModal>
  );
};
