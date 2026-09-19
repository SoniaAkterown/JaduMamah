import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { translations } from '../translations.ts';

interface FooterHeroSectionProps {
  onOpenCreate: () => void;
  onSelectTool?: (toolName: string) => void;
  language?: 'en' | 'bn';
  onLanguageChange?: (lang: 'en' | 'bn') => void;
}

export const FooterHeroSection: React.FC<FooterHeroSectionProps> = ({
  onOpenCreate,
  onSelectTool,
  language = 'en',
  onLanguageChange,
}) => {
  const t = translations[language].footer;
  const moreTools = translations[language].moreTools;

  return (
    <div className="w-full flex flex-col mt-16">
      {/* 1. Purple-accented Call To Action Hero */}
      <div className="relative overflow-hidden py-16 sm:py-20 px-4 sm:px-6 flex flex-col items-center justify-center text-center border-t border-purple-100/80 dark:border-slate-800 bg-gradient-to-b from-purple-50/60 via-white to-purple-50/40 dark:from-purple-950/20 dark:via-slate-900 dark:to-purple-950/20">
        {/* Subtle Ambient Background Orbs */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[280px] bg-gradient-to-r from-purple-300/20 to-indigo-300/20 rounded-full blur-3xl pointer-events-none" />

        {/* Main Headline with JaduMamah branding */}
        <h2 className="relative text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight max-w-3xl leading-tight">
          {t.heroHeadline}
        </h2>

        {/* Action Button & Terms Notice */}
        <div className="relative flex flex-col items-center gap-3.5 mt-8">
          <button
            onClick={onOpenCreate}
            className="group px-8 py-4 rounded-2xl bg-gradient-to-r from-[#7C3AED] via-[#6D28D9] to-[#5B21B6] hover:from-[#6D28D9] hover:to-[#4C1D95] text-white text-sm sm:text-base font-bold flex items-center gap-2.5 shadow-xl shadow-purple-500/25 hover:shadow-purple-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-purple-200 group-hover:rotate-12 transition-transform" />
            <span>{t.createBtn}</span>
            <ArrowRight className="w-4 h-4 text-purple-200 group-hover:translate-x-1 transition-transform" />
          </button>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xs px-4 py-1.5 rounded-full border border-slate-200/80 dark:border-slate-700 shadow-2xs">
            <span className="text-purple-600 dark:text-purple-400 font-bold">ⓘ</span>
            <span>
              {t.agreeText}{' '}
              <a href="#terms" className="text-purple-700 dark:text-purple-400 font-semibold hover:underline">
                {t.terms}
              </a>{' '}
              &amp;{' '}
              <a href="#privacy" className="text-purple-700 dark:text-purple-400 font-semibold hover:underline">
                {t.privacy}
              </a>
            </span>
          </div>
        </div>
      </div>

      {/* 2. Soft Tinted Multi-Column SaaS Footer */}
      <footer className="w-full bg-[#f3eefc] dark:bg-slate-900 border-t border-purple-100/80 dark:border-slate-800 py-14 px-4 sm:px-6 lg:px-8 transition-colors">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-10 text-xs text-slate-700 dark:text-slate-300">
          {/* Column 1: Pages & Language */}
          <div className="flex flex-col gap-6">
            <div>
              <h5 className="font-bold text-slate-900 dark:text-white text-sm mb-3">{t.pages}</h5>
              <ul className="flex flex-col gap-2">
                <li><a href="#" className="hover:text-purple-700 dark:hover:text-purple-400 transition-colors">{t.home}</a></li>
                <li><a href="#" className="hover:text-purple-700 dark:hover:text-purple-400 transition-colors">{t.about}</a></li>
                <li><a href="#terms" className="hover:text-purple-700 dark:hover:text-purple-400 transition-colors">{t.termsPrivacy}</a></li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold text-slate-900 dark:text-white text-sm mb-3">{t.language}</h5>
              <ul className="flex flex-col gap-2">
                <li>
                  <button
                    onClick={() => onLanguageChange?.('en')}
                    className={`flex items-center gap-2 transition-colors cursor-pointer text-xs ${
                      language === 'en'
                        ? 'text-purple-800 dark:text-purple-300 font-bold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-purple-700 dark:hover:text-purple-300'
                    }`}
                  >
                    <span>English</span>
                    {language === 'en' && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-semibold">
                        Active
                      </span>
                    )}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onLanguageChange?.('bn')}
                    className={`flex items-center gap-2 transition-colors cursor-pointer text-xs ${
                      language === 'bn'
                        ? 'text-purple-800 dark:text-purple-300 font-bold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-purple-700 dark:hover:text-purple-300'
                    }`}
                  >
                    <span>বাংলা (Bangla)</span>
                    {language === 'bn' && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-semibold">
                        Active
                      </span>
                    )}
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Columns 2-4: Free Tools */}
          <div className="lg:col-span-3 flex flex-col">
            <h5 className="font-bold text-slate-900 dark:text-white text-sm mb-3">{t.freeTools}</h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2.5">
              {moreTools.tools.map((tool, idx) => {
                const toolTitle = language === 'bn' ? tool.bnName : tool.name;
                return (
                  <button
                    key={idx}
                    onClick={() => onSelectTool?.(tool.name)}
                    className="text-left text-xs text-slate-600 dark:text-slate-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors cursor-pointer hover:underline truncate"
                    title={toolTitle}
                  >
                    {toolTitle}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-purple-200/60 dark:border-slate-800 flex flex-wrap items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <span>{t.copyright}</span>
          <div className="flex items-center gap-4">
            <a href="#privacy" className="hover:underline">{t.privacy}</a>
            <a href="#terms" className="hover:underline">{t.termsOfService}</a>
            <a href="#" className="hover:underline">{t.support}</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
