import React from 'react';
import { Sparkles, Check, TrendingUp, Clock, FileText } from 'lucide-react';
import { PostVariation } from '../types.ts';

interface VariationsCarouselProps {
  variations: PostVariation[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  language: 'en' | 'bn';
}

export const VariationsCarousel: React.FC<VariationsCarouselProps> = ({
  variations,
  selectedIndex,
  onSelect,
  language,
}) => {
  const isBn = language === 'bn';

  if (variations.length <= 1) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-3.5 sm:p-4 shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-col gap-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[#0A66C2]" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
            {isBn ? `পোস্ট ভ্যারিয়েশন (${variations.length}টি তৈরি হয়েছে)` : `Generated Variations (${variations.length})`}
          </h4>
        </div>
        <span className="text-[11px] text-slate-400 font-medium">
          {isBn ? 'প্রিভিউ করতে ক্লিক করুন' : 'Select to preview & refine'}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {variations.map((item, idx) => {
          const isSelected = selectedIndex === idx;
          return (
            <button
              key={item.id || idx}
              onClick={() => onSelect(idx)}
              className={`p-3 rounded-xl text-left border transition-all relative flex flex-col justify-between cursor-pointer ${
                isSelected
                  ? 'border-[#0A66C2] bg-blue-50/40 ring-2 ring-[#0A66C2]/20 shadow-2xs'
                  : 'border-slate-200/80 hover:border-slate-300 bg-white hover:bg-slate-50/80'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-700">
                      {idx + 1}
                    </span>
                    <span>{isBn ? `অপশন ${idx + 1}` : `Angle ${String.fromCharCode(65 + idx)}`}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#0A66C2]" />}
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-0.5">
                    <TrendingUp className="w-2.5 h-2.5" />
                    {item.engagementScore}%
                  </span>
                </div>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-sans">
                  "{item.hook}"
                </p>
              </div>

              <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-medium">
                <span className="flex items-center gap-1">
                  <FileText className="w-3 h-3 text-slate-400" />
                  {item.wordCount} words
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {item.estimatedReadTime}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
