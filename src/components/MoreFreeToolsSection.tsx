import React from 'react';
import { ArrowRight } from 'lucide-react';
import { translations } from '../translations.ts';

interface MoreFreeToolsSectionProps {
  onSelectTool: (toolName: string) => void;
  language?: 'en' | 'bn';
}

export const MoreFreeToolsSection: React.FC<MoreFreeToolsSectionProps> = ({
  onSelectTool,
  language = 'en',
}) => {
  const t = translations[language].moreTools;

  return (
    <div className="w-full flex flex-col gap-6 pt-10 border-t border-slate-200/80 dark:border-slate-800">
      <div className="text-center">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">{t.sectionTitle}</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {t.tools.map((tool, idx) => {
          const toolTitle = language === 'bn' ? tool.bnName : tool.name;
          return (
            <div
              key={idx}
              className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:border-purple-300 dark:hover:border-purple-600 hover:shadow-sm transition-all flex flex-col justify-between gap-3"
            >
              <h4 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white">{toolTitle}</h4>
              <button
                onClick={() => onSelectTool(tool.name)}
                className="text-xs font-bold text-[#7C3AED] dark:text-purple-400 hover:text-[#6D28D9] dark:hover:text-purple-300 flex items-center gap-1 w-fit hover:underline cursor-pointer"
              >
                <span>{t.useForFree}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
