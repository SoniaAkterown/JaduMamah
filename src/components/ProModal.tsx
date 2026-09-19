import React from 'react';
import { X, Sparkles, Check, ArrowRight, Zap, Crown } from 'lucide-react';

interface ProModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProModal: React.FC<ProModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const PRO_PERKS = [
    'Unlimited Gemini 2.5 AI LinkedIn Post Generations',
    'Full access to all 130+ Viral Post & Carousel Templates',
    'AI Carousel Generator: Convert posts into high-converting PDF slide carousels',
    'Custom Brand Voice & Default Instructions Presets',
    'Direct LinkedIn API 1-Click Publishing & Scheduling',
    'Export to High-Resolution PDF, PNG, and PowerPoint (.pptx)',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-purple-200 dark:border-purple-900/60 overflow-hidden flex flex-col transition-colors">
        {/* Header Banner */}
        <div className="p-6 bg-gradient-to-br from-purple-600 to-indigo-700 text-white relative flex flex-col gap-2">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-amber-300">
            <Crown className="w-6 h-6" />
          </div>

          <h3 className="text-xl font-bold tracking-tight">JaduMamah PRO ✧</h3>
          <p className="text-xs text-purple-100 leading-relaxed">
            Supercharge your personal brand and create viral LinkedIn posts & carousels 10x faster.
          </p>
        </div>

        {/* Feature List */}
        <div className="p-6 flex flex-col gap-4">
          <div className="flex flex-col gap-2.5">
            {PRO_PERKS.map((perk, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-200">
                <div className="w-4 h-4 rounded-full bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 flex items-center justify-center shrink-0 mt-0.5 border border-transparent dark:border-purple-800/60">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
                <span>{perk}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-purple-500/25 transition-all cursor-pointer"
            >
              <span>Get Started with PRO Free Trial</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-[11px] text-center text-slate-400 dark:text-slate-500">
              No credit card required for standard free generation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
