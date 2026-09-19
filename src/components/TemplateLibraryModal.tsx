import React, { useState } from 'react';
import { X, BookOpen, Check, ArrowRight, Sparkles, Filter } from 'lucide-react';
import { Template } from '../types.ts';

interface TemplateLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  templates: Template[];
  onSelectTemplate: (template: Template) => void;
  language: 'en' | 'bn';
}

export const TemplateLibraryModal: React.FC<TemplateLibraryModalProps> = ({
  isOpen,
  onClose,
  templates,
  onSelectTemplate,
  language,
}) => {
  const isBn = language === 'bn';
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  if (!isOpen) return null;

  const categories = ['All', ...Array.from(new Set(templates.map((t) => t.category)))];

  const filteredTemplates = templates.filter(
    (t) => selectedCategory === 'All' || t.category === selectedCategory
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-3xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[88vh] transition-colors">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-850">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950 text-[#0A66C2] dark:text-blue-400 flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {isBn ? 'ভাইরাল LinkedIn টেমপ্লেট লাইব্রেরি' : 'Viral LinkedIn Template Library'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isBn ? 'প্রমাণিত কাঠামো যা পাঠকের এনগেজমেন্ট কয়েক গুণ বাড়িয়ে দেয়' : 'Proven copywriting frameworks engineered for high dwell-time & comments'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Filters */}
        <div className="px-5 py-2.5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto scrollbar-none bg-white dark:bg-slate-900">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0 mr-1" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#0A66C2] text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="p-5 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50/50 dark:bg-slate-950">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-[#0A66C2] dark:hover:border-blue-500 hover:shadow-md transition-all flex flex-col justify-between bg-white dark:bg-slate-900 group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#0A66C2] dark:text-blue-400 border border-blue-100 dark:border-blue-900/60">
                    {template.category}
                  </span>
                  <span className="text-[11px] text-slate-400 dark:text-slate-500">ID #{template.id}</span>
                </div>

                <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#0A66C2] dark:group-hover:text-blue-400 transition-colors mb-1">
                  {template.name}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 line-clamp-2">{template.description}</p>

                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-800 mb-3">
                  <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                    {isBn ? 'টেমপ্লেট স্ট্রাকচার:' : 'Structure Blueprint:'}
                  </p>
                  <pre className="text-[11px] text-slate-700 dark:text-slate-200 whitespace-pre-line font-mono line-clamp-4 leading-tight">
                    {template.structure}
                  </pre>
                </div>
              </div>

              <button
                onClick={() => {
                  onSelectTemplate(template);
                  onClose();
                }}
                className="w-full py-2 px-3 rounded-lg bg-slate-100 dark:bg-slate-800 group-hover:bg-[#0A66C2] text-slate-700 dark:text-slate-200 group-hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <span>{isBn ? 'এই টেমপ্লেট ব্যবহার করুন' : 'Use This Template'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
