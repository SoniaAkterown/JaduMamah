import React, { useState } from 'react';
import {
  Sparkles,
  Sliders,
  Type,
  Smile,
  Hash,
  Users,
  FileText,
  X,
  Zap,
  Check,
  RefreshCw,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Flame,
  CheckCircle2,
} from 'lucide-react';
import { GeneratePostRequest, PostTone, PostLength, Template } from '../types.ts';

interface GeneratorFormProps {
  formData: GeneratePostRequest;
  onChange: (data: Partial<GeneratePostRequest>) => void;
  onSubmit: () => void;
  isGenerating: boolean;
  selectedTemplate: Template | null;
  onClearTemplate: () => void;
  language: 'en' | 'bn';
}

const TONES: Array<{ id: PostTone; labelEn: string; labelBn: string; desc: string; icon: string }> = [
  { id: 'Thought Leadership', labelEn: 'Thought Leadership', labelBn: 'থট লিডারশিপ', desc: 'Insightful, high authority', icon: '💡' },
  { id: 'Storytelling', labelEn: 'Storytelling', labelBn: 'গল্পের ছলে', desc: 'Emotional, authentic hook', icon: '📖' },
  { id: 'Professional', labelEn: 'Professional', labelBn: 'পেশাদার', desc: 'Clean, corporate, structured', icon: '👔' },
  { id: 'Achievement', labelEn: 'Milestone / Win', labelBn: 'সাফল্য / অর্জন', desc: 'Celebratory, metrics-led', icon: '🏆' },
  { id: 'Educational', labelEn: 'How-To / Guide', labelBn: 'শিক্ষণীয় গাইড', desc: 'Frameworks, action steps', icon: '🎓' },
  { id: 'Motivational', labelEn: 'Motivational', labelBn: 'অনুপ্রেরণামূলক', desc: 'Inspiring, punchy hooks', icon: '🔥' },
  { id: 'Casual', labelEn: 'Relatable & Casual', labelBn: 'সহজ-সরল', desc: 'Conversational, peer-to-peer', icon: '☕' },
  { id: 'Hiring & Career', labelEn: 'Hiring & Talent', labelBn: 'নিয়োগ ও ক্যারিয়ার', desc: 'Job roles, team growth', icon: '💼' },
];

const SUGGESTED_TOPICS = [
  { tag: 'AI & Tech', en: 'Why practical AI adoption beats generic hype in 2026', bn: 'বর্তমান টেক ও কন্টেন্ট ইন্ডাস্ট্রিতে বাস্তবমুখী AI ব্যবহারের গুরুত্ব' },
  { tag: 'Leadership', en: 'The single leadership habit that halved our team burnout', bn: 'টিমের কাজের গতি বাড়াতে ও মানসিক চাপ কমাতে ৩টি কার্যকর নিয়ম' },
  { tag: 'Growth', en: '3 brutal marketing lessons learned from scaling to $1M ARR', bn: 'স্টার্টআপ থেকে প্রথম ১ লক্ষ ব্যবহারকারী অর্জনের ৩টি বাস্তব শিক্ষা' },
  { tag: 'Hiring', en: 'What I look for in top performers beyond a polished resume', bn: 'সিভি ছাড়াও প্রফেশনালদের মধ্যে যে ৩টি গুণ সবচেয়ে গুরুত্বপূর্ণ' },
];

export const GeneratorForm: React.FC<GeneratorFormProps> = ({
  formData,
  onChange,
  onSubmit,
  isGenerating,
  selectedTemplate,
  onClearTemplate,
  language,
}) => {
  const isBn = language === 'bn';
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Keyboard shortcut Ctrl/Cmd + Enter to trigger generate
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      if (formData.topic.trim() && !isGenerating) {
        onSubmit();
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex flex-col gap-5">
      {/* Active Template Banner */}
      {selectedTemplate && (
        <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50/70 border border-blue-200/80 text-xs">
          <div className="flex items-center gap-2 text-[#0A66C2]">
            <FileText className="w-4 h-4 shrink-0" />
            <span className="font-bold">
              {isBn ? 'সক্রিয় টেমপ্লেট:' : 'Template:'} {selectedTemplate.name}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-semibold">
              {selectedTemplate.category}
            </span>
          </div>
          <button
            onClick={onClearTemplate}
            className="p-1 rounded-md text-blue-600 hover:bg-blue-200/60 transition-colors"
            title={isBn ? 'টেমপ্লেট সরান' : 'Remove template'}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 1. TOPIC & PROMPT INPUT */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label htmlFor="topic-input" className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#0A66C2]" />
            <span>{isBn ? 'পোস্টের বিষয় বা মূল ভাবনা *' : 'Post Topic or Core Insight *'}</span>
          </label>
          <span className="text-[11px] text-slate-400 font-medium">
            {formData.topic.length > 0 && `${formData.topic.length} chars`}
          </span>
        </div>

        <div className="relative">
          <textarea
            id="topic-input"
            value={formData.topic}
            onChange={(e) => onChange({ topic: e.target.value })}
            onKeyDown={handleKeyDown}
            rows={3}
            placeholder={
              isBn
                ? 'যেমন: রিমোট কাজের সেরা টেকনিক, স্টার্টআপ জার্নি, দল পরিচালনায় সবচেয়ে বড় শিক্ষা...'
                : 'e.g., Why 4-day workweeks improved our sprint velocity, 3 unwritten rules of remote leadership, lessons from my first client fail...'
            }
            className="w-full px-3.5 py-3 rounded-xl border border-slate-200 focus:border-[#0A66C2] focus:ring-3 focus:ring-blue-100/70 outline-none text-slate-900 placeholder:text-slate-400 text-sm leading-relaxed transition-all resize-none shadow-2xs font-sans"
          />
        </div>

        {/* Quick Inspiration Pills */}
        <div className="flex flex-col gap-1.5 pt-1">
          <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            <span>{isBn ? 'জনপ্রিয় টপিক আইডিয়া:' : 'Instant Sparks:'}</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {SUGGESTED_TOPICS.map((item, idx) => {
              const text = isBn ? item.bn : item.en;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onChange({ topic: text })}
                  className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-blue-50 hover:text-[#0A66C2] text-slate-600 border border-slate-200/80 transition-all text-left truncate max-w-[280px]"
                >
                  <span className="font-semibold text-slate-400 mr-1">[{item.tag}]</span>
                  {text}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. TONE SELECTOR */}
      <div className="flex flex-col gap-2 pt-1 border-t border-slate-100">
        <label className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-[#0A66C2]" />
            <span>{isBn ? 'পোস্টের টোন ও ভাষাভঙ্গী' : 'Tone & Perspective'}</span>
          </div>
          <span className="text-[11px] font-normal text-[#0A66C2] capitalize font-semibold">
            {formData.tone}
          </span>
        </label>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {TONES.map((t) => {
            const isSelected = formData.tone === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => onChange({ tone: t.id })}
                className={`flex flex-col p-2.5 rounded-xl text-left border transition-all relative ${
                  isSelected
                    ? 'border-[#0A66C2] bg-blue-50/50 text-[#0A66C2] shadow-2xs ring-1 ring-[#0A66C2]'
                    : 'border-slate-200/80 hover:border-slate-300 text-slate-700 bg-white hover:bg-slate-50/80'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="text-base">{t.icon}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#0A66C2]" />}
                </div>
                <span className="text-xs font-bold text-slate-900 truncate">
                  {isBn ? t.labelBn : t.labelEn}
                </span>
                <span className="text-[10px] text-slate-500 line-clamp-1 mt-0.5 font-normal">
                  {t.desc}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. FORMATTING CONTROLS (Length, Variations, Emojis) */}
      <div className="grid grid-cols-3 gap-2.5 pt-2 border-t border-slate-100">
        {/* Length Control */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
            <Type className="w-3 h-3 text-slate-400" />
            <span>{isBn ? 'দৈর্ঘ্য' : 'Length'}</span>
          </span>
          <div className="grid grid-cols-3 gap-1 bg-slate-100/90 p-0.5 rounded-lg border border-slate-200/60">
            {(['short', 'medium', 'long'] as PostLength[]).map((len) => (
              <button
                key={len}
                type="button"
                onClick={() => onChange({ length: len })}
                className={`py-1 text-[11px] font-semibold rounded capitalize transition-all ${
                  formData.length === len
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {len === 'short' ? (isBn ? 'ছোট' : 'Short') : len === 'medium' ? (isBn ? 'মাঝারি' : 'Mid') : isBn ? 'বড়' : 'Deep'}
              </button>
            ))}
          </div>
        </div>

        {/* Variations Count */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
            <Zap className="w-3 h-3 text-slate-400" />
            <span>{isBn ? 'ভার্সন' : 'Variations'}</span>
          </span>
          <div className="grid grid-cols-3 gap-1 bg-slate-100/90 p-0.5 rounded-lg border border-slate-200/60">
            {[1, 2, 3].map((count) => (
              <button
                key={count}
                type="button"
                onClick={() => onChange({ variationsCount: count })}
                className={`py-1 text-[11px] font-semibold rounded transition-all ${
                  formData.variationsCount === count
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {count}x
              </button>
            ))}
          </div>
        </div>

        {/* Emojis Toggle */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
            <Smile className="w-3 h-3 text-slate-400" />
            <span>{isBn ? 'ইমোজি' : 'Emojis'}</span>
          </span>
          <button
            type="button"
            onClick={() => onChange({ includeEmojis: !formData.includeEmojis })}
            className={`py-1 px-2 rounded-lg border text-[11px] font-bold transition-all text-center ${
              formData.includeEmojis
                ? 'bg-amber-50/80 border-amber-200 text-amber-900'
                : 'bg-slate-100/90 border-slate-200/80 text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            {formData.includeEmojis ? '✨ Active' : 'Off'}
          </button>
        </div>
      </div>

      {/* 4. OPTIONAL AUDIENCE & ACCORDION */}
      <div className="border-t border-slate-100 pt-2">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center justify-between w-full text-xs font-semibold text-slate-600 hover:text-slate-900 py-1"
        >
          <span className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <span>{isBn ? 'অডিয়েন্স ও কী-পয়েন্টস (ঐচ্ছিক)' : 'Target Audience & Custom Notes (Optional)'}</span>
          </span>
          {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {showAdvanced && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 animate-in fade-in-50 duration-200">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                {isBn ? 'টার্গেট অডিয়েন্স' : 'Target Audience'}
              </label>
              <input
                type="text"
                value={formData.targetAudience || ''}
                onChange={(e) => onChange({ targetAudience: e.target.value })}
                placeholder={isBn ? 'যেমন: সফটওয়্যার ইঞ্জিনিয়ার, সিইও' : 'e.g. Founders, Marketers, Engineers'}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:border-[#0A66C2] outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                {isBn ? 'বিশেষ কোনো টেক-অ্যাওয়ে' : 'Specific Takeaways'}
              </label>
              <input
                type="text"
                value={formData.customNotes || ''}
                onChange={(e) => onChange({ customNotes: e.target.value })}
                placeholder={isBn ? 'যেমন: ৩টি স্টেপ উল্লেখ করতে হবে' : 'e.g. Include 3 bullet points, strong CTA'}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:border-[#0A66C2] outline-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* 5. PRIMARY GENERATE BUTTON */}
      <button
        id="generate-post-submit-btn"
        type="button"
        disabled={isGenerating || !formData.topic.trim()}
        onClick={onSubmit}
        className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
          isGenerating || !formData.topic.trim()
            ? 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300/60'
            : 'bg-[#0A66C2] hover:bg-[#004182] active:bg-[#084d94] text-white shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30'
        }`}
      >
        {isGenerating ? (
          <>
            <RefreshCw className="w-4 h-4 animate-spin text-white" />
            <span>{isBn ? 'Gemini AI দিয়ে পোস্ট তৈরি হচ্ছে...' : 'Crafting LinkedIn Post...'}</span>
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 text-white" />
            <span>{isBn ? 'LinkedIn পোস্ট জেনারেট করুন' : 'Generate LinkedIn Post'}</span>
            <span className="hidden sm:inline text-[10px] uppercase font-bold py-0.5 px-1.5 rounded bg-white/20 text-white/90 ml-1">
              ⌘ ↵
            </span>
          </>
        )}
      </button>
    </div>
  );
};
