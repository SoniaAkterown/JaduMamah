import React from 'react';
import { translations } from '../translations.ts';

interface FeaturesSectionProps {
  onOpenTemplates: () => void;
  onOpenPro: () => void;
  language?: 'en' | 'bn';
}

export const FeaturesSection: React.FC<FeaturesSectionProps> = ({
  language = 'en',
}) => {
  const t = translations[language].features;

  return (
    <div className="w-full flex flex-col gap-12 pt-6">
      {/* 1. Introducing Header & Pitch (Matches Image 2) */}
      <div className="border-t border-slate-200/80 dark:border-slate-800 pt-10 flex flex-col gap-3">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          {t.introTitle}
        </h2>
        <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed max-w-4xl">
          {t.introDesc}
        </p>
      </div>

      {/* 2. Feature Highlights Grid (Matches Image 6 & 7) */}
      <div className="flex flex-col gap-6">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            {t.featuresTitle}
          </h3>
          <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">
            {t.featuresSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-2">
          {t.items.map((feat, idx) => (
            <div key={idx} className="flex flex-col items-start gap-2.5">
              <span className="text-3xl p-1">{feat.icon}</span>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">{feat.title}</h4>
              <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                {feat.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 3. How to Use Section (Matches Image 3 & 4) */}
      <div className="border-t border-slate-200/80 dark:border-slate-800 pt-10 flex flex-col gap-6">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
          {t.howToTitle}
        </h3>

        <div className="flex flex-col gap-5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {t.howToSteps.map((step, idx) => (
            <div key={idx}>
              <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-600 inline-block" />
                {step.title}
              </h4>
              <p className="mt-1 pl-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
