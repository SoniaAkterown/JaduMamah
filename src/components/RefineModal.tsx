import React, { useState } from 'react';
import { X, Sparkles, RefreshCw, Wand2, Zap, MessageSquareQuote, Check } from 'lucide-react';

interface RefineModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentContent: string;
  onApplyRefinement: (refinedContent: string) => void;
  language: 'en' | 'bn';
}

export const RefineModal: React.FC<RefineModalProps> = ({
  isOpen,
  onClose,
  currentContent,
  onApplyRefinement,
  language,
}) => {
  const isBn = language === 'bn';
  const [refinementType, setRefinementType] = useState<string>('punchier');
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [isRefining, setIsRefining] = useState<boolean>(false);
  const [previewResult, setPreviewResult] = useState<string>('');
  const [refineError, setRefineError] = useState<string | null>(null);

  if (!isOpen) return null;

  const REFINE_PRESETS = [
    {
      id: 'punchier',
      label: isBn ? 'আরও আকর্ষণীয় ও সংক্ষেপ' : 'Make Punchier & Scroll-Stopping',
      desc: isBn ? 'ছোট প্যারাগ্রাফ, স্ট্রং হুক ও স্পিড রিডিং' : 'Short sentences, stronger hooks, maximum scannability',
      icon: '⚡',
    },
    {
      id: 'storytelling',
      label: isBn ? 'গল্পের মতো সাজান' : 'Turn into Personal Story',
      desc: isBn ? 'ব্যক্তিগত অভিজ্ঞতা ও সংগ্রামের আলোকে' : 'Adds personal vulnerability and struggle-to-triumph arc',
      icon: '📖',
    },
    {
      id: 'concise',
      label: isBn ? 'সংক্ষিপ্ত করুন (< ৫০০ অক্ষর)' : 'Make Concise & Direct',
      desc: isBn ? 'অপ্রয়োজনীয় শব্দ বাদ দিয়ে মূল বার্তায় জোর' : 'Cuts fluff, gets straight to the point in <100 words',
      icon: '✂️',
    },
    {
      id: 'questions',
      label: isBn ? 'এনগেজিং প্রশ্ন যোগ করুন' : 'Add Viral Discussion Hooks',
      desc: isBn ? 'কমেন্ট সেকশনে আলোচনা বাড়ানোর জন্য' : 'Ends with polarizing questions to spark 10x comments',
      icon: '💬',
    },
    {
      id: 'emojis',
      label: isBn ? 'পেশাদার ইমোজি যোগ করুন' : 'Enhance with Tasteful Emojis',
      desc: isBn ? 'ভিজ্যুয়াল স্পেসিং ও রিডাবিলিটি বাড়াতে' : 'Bullet point icons, reaction emojis, clean formatting',
      icon: '✨',
    },
    {
      id: 'professional',
      label: isBn ? 'কর্পোরেট ও এক্সিকিউটিভ টোন' : 'Executive & Corporate Tone',
      desc: isBn ? 'সি-লেভেল অডিয়েন্সের জন্য মার্জিত ভাষা' : 'Data-driven, polished C-suite register with zero slang',
      icon: '👔',
    },
  ];

  const handleRefine = async () => {
    setIsRefining(true);
    setRefineError(null);
    try {
      const res = await fetch('/api/posts/refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentContent,
          refinementType,
          customInstruction: customPrompt,
          language,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to refine post');
      }
      if (data.refinedContent) {
        setPreviewResult(data.refinedContent);
      }
    } catch (err: any) {
      console.error('Refine failed:', err);
      setRefineError(err.message || (isBn ? 'রিফাইন প্রক্রিয়ায় সমস্যা হয়েছে' : 'Failed to refine post'));
    } finally {
      setIsRefining(false);
    }
  };

  const handleApply = () => {
    if (previewResult) {
      onApplyRefinement(previewResult);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
              <Wand2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {isBn ? 'AI পোস্ট রিফাইন ও রি-রাইট' : 'AI Post Refiner & Optimizer'}
              </h3>
              <p className="text-xs text-slate-500">
                {isBn ? 'Gemini AI দিয়ে পোস্টের টোন, স্পেসিং বা হুক পরিবর্তন করুন' : 'Fine-tune tone, pacing, or conversational hooks with AI'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 overflow-y-auto flex flex-col gap-4">
          {/* Preset Buttons */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              {isBn ? 'রিফাইন মোড বেছে নিন' : 'Choose Refinement Mode'}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {REFINE_PRESETS.map((preset) => {
                const isSelected = refinementType === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => setRefinementType(preset.id)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-purple-600 bg-purple-50/60 ring-1 ring-purple-500 text-purple-900'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-semibold text-xs mb-0.5">
                      <span>{preset.icon}</span>
                      <span>{preset.label}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-1">{preset.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Instruction Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {isBn ? 'কাস্টম নির্দেশনা (ঐচ্ছিক)' : 'Custom AI Prompt / Instructions (Optional)'}
            </label>
            <input
              type="text"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder={
                isBn
                  ? 'যেমন: শেষ লাইনে একটি চ্যালেঞ্জিং উক্তি দিন'
                  : 'e.g., Focus more on early career struggle, or add 3 bullet points about Python'
              }
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:border-purple-600 outline-none"
            />
          </div>

          {/* Refine Trigger Button */}
          <button
            onClick={handleRefine}
            disabled={isRefining}
            className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              isRefining
                ? 'bg-purple-200 text-purple-700 cursor-not-allowed'
                : 'bg-purple-600 hover:bg-purple-700 text-white shadow-xs'
            }`}
          >
            {isRefining ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>{isBn ? 'রিফাইন করা হচ্ছে...' : 'Refining Post with Gemini...'}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isBn ? 'রিফাইন শুরু করুন' : 'Run AI Refinement'}</span>
              </>
            )}
          </button>

          {/* Error Alert */}
          {refineError && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <span className="font-bold">⚠️</span>
              <span>{refineError}</span>
            </div>
          )}

          {/* Preview of Refined Version */}
          {previewResult && (
            <div className="mt-2 p-3.5 rounded-xl bg-purple-50/50 border border-purple-200 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs font-bold text-purple-900">
                <span>{isBn ? 'রিফাইন করা পোস্ট প্রিভিউ' : 'Refined Post Output'}</span>
                <span className="text-[10px] bg-purple-200 text-purple-800 px-2 py-0.5 rounded-full">
                  {previewResult.length} chars
                </span>
              </div>
              <div className="text-xs text-slate-800 whitespace-pre-line max-h-48 overflow-y-auto p-2.5 bg-white rounded-lg border border-purple-100">
                {previewResult}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-end gap-2 bg-slate-50/50">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition-colors"
          >
            {isBn ? 'বাতিল' : 'Cancel'}
          </button>
          {previewResult && (
            <button
              onClick={handleApply}
              className="px-4 py-2 rounded-xl bg-[#0A66C2] hover:bg-[#004182] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{isBn ? 'এই ভার্সনটি ব্যবহার করুন' : 'Apply to Post'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
