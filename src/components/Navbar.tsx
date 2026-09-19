import React from 'react';
import {
  Globe,
  LogIn,
  ArrowRight,
  Sun,
  Moon,
} from 'lucide-react';
import { User } from '../types.ts';
import { translations } from '../translations.ts';
import { LinkedInIcon, FacebookIcon, InstagramIcon, YouTubeIcon } from './SocialIcons.tsx';

interface NavbarProps {
  currentUser: User | null;
  historyCount?: number;
  templatesCount?: number;
  language: 'en' | 'bn';
  theme?: 'light' | 'dark';
  onThemeToggle?: () => void;
  onLanguageToggle: () => void;
  onOpenTemplates?: () => void;
  onOpenHistory?: () => void;
  onOpenDatabase?: () => void;
  onOpenAnalytics?: () => void;
  onOpenAuth: () => void;
  onNewPost: () => void;
  onOpenAIGenerate: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  language,
  theme = 'light',
  onThemeToggle,
  onLanguageToggle,
  onOpenAuth,
  onNewPost,
  onOpenAIGenerate,
}) => {
  const isBn = language === 'bn';
  const t = translations[language].navbar;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo (Matches Image 1 & 10) */}
        <div className="flex items-center gap-3 cursor-pointer select-none" onClick={onNewPost}>
          <div className="flex items-center gap-2">
            {/* Logo glyph: )★( */}
            <div className="w-8 h-8 rounded-xl bg-purple-100/90 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 flex items-center justify-center font-black text-sm tracking-tighter shadow-2xs border border-purple-200/70 dark:border-purple-800">
              )★(
            </div>
            <div className="flex items-baseline">
              <span className="font-extrabold text-slate-900 dark:text-white text-lg tracking-tight">JaduMamah</span>
            </div>
          </div>
        </div>

        {/* Center / Right Section */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Subtle CTA pitch link (Matches Image 1) */}
          <button
            onClick={onOpenAIGenerate}
            className="hidden xl:flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-purple-700 dark:hover:text-purple-400 transition-colors cursor-pointer"
          >
            <span>{t.tagline}</span>
            <span className="text-amber-500">👑</span>
          </button>

          {/* Theme Toggle Switch */}
          {onThemeToggle && (
            <button
              id="nav-theme-toggle-btn"
              onClick={onThemeToggle}
              className="relative inline-flex h-7 w-13 items-center rounded-full bg-slate-200 dark:bg-slate-700 p-0.5 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500/20 cursor-pointer"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle theme"
            >
              <span className="sr-only">Toggle theme</span>
              <Sun
                className={`w-3 h-3 text-amber-500 absolute left-1.5 transition-opacity duration-200 ${
                  theme === 'dark' ? 'opacity-25' : 'opacity-100'
                }`}
              />
              <Moon
                className={`w-3 h-3 text-purple-300 absolute right-1.5 transition-opacity duration-200 ${
                  theme === 'dark' ? 'opacity-100' : 'opacity-25'
                }`}
              />
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white dark:bg-slate-900 shadow-sm transition-transform duration-200 ease-in-out flex items-center justify-center ${
                  theme === 'dark' ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              >
                {theme === 'dark' ? (
                  <Moon className="w-3 h-3 text-purple-400" />
                ) : (
                  <Sun className="w-3 h-3 text-amber-500" />
                )}
              </span>
            </button>
          )}

          {/* Language Switcher */}
          <button
            id="nav-lang-toggle-btn"
            onClick={onLanguageToggle}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-purple-50 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700 transition-colors cursor-pointer"
            title={t.switchLang}
          >
            <Globe className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span className="font-bold text-[12px]">{isBn ? 'বাংলা' : 'EN'}</span>
          </button>

          {/* User Sign In / Profile */}
          {currentUser ? (
            <div
              onClick={onOpenAuth}
              className="relative flex items-center gap-2 pl-1 cursor-pointer group"
              title={`${currentUser.name} (${currentUser.platform || 'linkedin'})`}
            >
              <img
                src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80'}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full border border-purple-200 dark:border-purple-700 object-cover bg-slate-100 group-hover:ring-2 group-hover:ring-purple-400 transition-all"
              />
              <div
                className={`absolute -bottom-0.5 right-0 w-3.5 h-3.5 rounded-full flex items-center justify-center text-white text-[8px] shadow-xs border border-white dark:border-slate-900 ${
                  currentUser.platform === 'facebook'
                    ? 'bg-[#1877F2]'
                    : currentUser.platform === 'instagram'
                    ? 'bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF]'
                    : currentUser.platform === 'youtube'
                    ? 'bg-[#FF0000]'
                    : 'bg-[#0A66C2]'
                }`}
              >
                {currentUser.platform === 'facebook' ? (
                  <FacebookIcon className="w-2 h-2" />
                ) : currentUser.platform === 'instagram' ? (
                  <InstagramIcon className="w-2 h-2" />
                ) : currentUser.platform === 'youtube' ? (
                  <YouTubeIcon className="w-2 h-2" />
                ) : (
                  <LinkedInIcon className="w-2 h-2" />
                )}
              </div>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span>{t.signIn}</span>
            </button>
          )}

          {/* Prominent Purple Action Button (Matches Image 1) */}
          <button
            onClick={onOpenAIGenerate}
            className="px-4 py-2 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm hover:shadow-md transition-all cursor-pointer"
          >
            <span>{t.createPost}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
