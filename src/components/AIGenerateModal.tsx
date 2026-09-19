import React, { useState, useEffect } from 'react';
import { X, Sparkles, Wand2, RefreshCw, Check, Sliders, Type, Lightbulb, FileText } from 'lucide-react';
import { GeneratePostRequest, PostTone, PostLength, Template } from '../types.ts';

interface AIGenerateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (data: GeneratePostRequest) => Promise<void>;
  templates: Template[];
  isGenerating: boolean;
  appLanguage?: 'en' | 'bn';
}

const TONES: Array<{ id: PostTone; label: string; desc: string; icon: string }> = [
  { id: 'Thought Leadership', label: 'Thought Leadership', desc: 'Authoritative, counter-intuitive insights', icon: '💡' },
  { id: 'Storytelling', label: 'Personal Story', desc: 'Vulnerable hook with struggle & triumph arc', icon: '📖' },
  { id: 'Professional', label: 'Executive & Clean', desc: 'Structured, data-driven, C-suite tone', icon: '👔' },
  { id: 'Educational', label: 'Framework / How-To', desc: 'Step-by-step actionable guide', icon: '🎓' },
  { id: 'Achievement', label: 'Milestone / Win', desc: 'Celebratory, lesson-based win', icon: '🏆' },
  { id: 'Casual', label: 'Casual & Relatable', desc: 'Conversational, authentic and human', icon: '☕' },
];

const SUGGESTED_TOPICS = [
  'Why 4-day workweeks boost engineering productivity and employee retention',
  '99% of LinkedIn creators fail because they broadcast instead of converse',
  '3 brutal marketing lessons learned scaling our startup to $1M ARR',
  'The single leadership habit that halved our team burnout this quarter',
];

export const AIGenerateModal: React.FC<AIGenerateModalProps> = ({
  isOpen,
  onClose,
  onGenerate,
  templates,
  isGenerating,
  appLanguage = 'en',
}) => {
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState<PostTone>('Thought Leadership');
  const [length, setLength] = useState<PostLength>('medium');
  const [language, setLanguage] = useState<'en' | 'bn'>(appLanguage);
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | undefined>(undefined);
  const [includeEmojis, setIncludeEmojis] = useState(true);
  const [customNotes, setCustomNotes] = useState('');

  useEffect(() => {
    if (isOpen && appLanguage) {
      setLanguage(appLanguage);
    }
  }, [isOpen, appLanguage]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || isGenerating) return;

    await onGenerate({
      topic,
      tone,
      length,
      language,
      includeEmojis,
      variationsCount: 1,
      templateId: selectedTemplateId,
      customNotes,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-purple-100 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh] transition-colors">
        {/* Modal Header */}
        <div className="p-4 sm:px-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-purple-50/50 via-white to-purple-50/30 dark:from-purple-950/30 dark:via-slate-900 dark:to-purple-950/20">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                <span>Generate Post with AI</span>
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                  Gemini Flash
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Transform any thought, lesson, or link into a scroll-stopping LinkedIn post
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto flex flex-col gap-4">
          {/* Topic input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center justify-between">
              <span>What would you like to write about? *</span>
              <span className="text-[11px] font-normal text-slate-400 dark:text-slate-500">{topic.length} chars</span>
            </label>
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              rows={3}
              placeholder="e.g., 5 unwritten rules for junior developers entering the AI era, why we cut daily meetings..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:border-purple-600 focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900/40 outline-none resize-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 text-slate-800 dark:text-slate-100"
              autoFocus
            />

            {/* Quick Inspiration Sparks */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {SUGGESTED_TOPICS.map((suggested, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setTopic(suggested)}
                  className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-purple-50/70 dark:bg-purple-950/40 hover:bg-purple-100 dark:hover:bg-purple-900/50 text-purple-800 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800/60 transition-all text-left truncate max-w-[280px]"
                >
                  💡 {suggested}
                </button>
              ))}
            </div>
          </div>

          {/* Tone Selector */}
          <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
            <label className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Select Tone & Perspective
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {TONES.map((t) => {
                const isSelected = tone === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTone(t.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                      isSelected
                        ? 'border-purple-600 bg-purple-50/70 dark:bg-purple-950/60 text-purple-900 dark:text-purple-200 ring-1 ring-purple-600 shadow-2xs'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="text-base">{t.icon}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />}
                    </div>
                    <span className="text-xs font-bold truncate">{t.label}</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1">{t.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Length & Settings Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            {/* Post Length */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300">Length</label>
              <div className="grid grid-cols-3 gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
                {(['short', 'medium', 'long'] as PostLength[]).map((len) => (
                  <button
                    key={len}
                    type="button"
                    onClick={() => setLength(len)}
                    className={`py-1 text-xs font-semibold rounded capitalize transition-all ${
                      length === len
                        ? 'bg-white dark:bg-slate-700 text-purple-900 dark:text-purple-200 shadow-2xs'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    {len === 'short' ? 'Short' : len === 'medium' ? 'Mid' : 'Deep'}
                  </button>
                ))}
              </div>
            </div>

            {/* Language */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300">Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as 'en' | 'bn')}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-800 focus:border-purple-600 outline-none"
              >
                <option value="en">English (Global)</option>
                <option value="bn">বাংলা (Bengali)</option>
              </select>
            </div>

            {/* Emojis Toggle */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300">Smart Emojis</label>
              <button
                type="button"
                onClick={() => setIncludeEmojis(!includeEmojis)}
                className={`py-1.5 px-3 rounded-lg border text-xs font-bold transition-all text-center ${
                  includeEmojis
                    ? 'bg-purple-50 dark:bg-purple-950/60 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300'
                    : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400'
                }`}
              >
                {includeEmojis ? '✨ Active' : 'Off'}
              </button>
            </div>
          </div>

          {/* Optional Template selector */}
          {templates.length > 0 && (
            <div className="flex flex-col gap-1 pt-2 border-t border-slate-100 dark:border-slate-800">
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                <span>Apply Viral Format Structure (Optional)</span>
              </label>
              <select
                value={selectedTemplateId || ''}
                onChange={(e) => {
                  const val = e.target.value ? Number(e.target.value) : undefined;
                  setSelectedTemplateId(val);
                  const found = templates.find((t) => t.id === val);
                  if (found && !topic) {
                    setTopic(found.sampleTopic || found.name);
                  }
                }}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 focus:border-purple-600 outline-none"
              >
                <option value="">None (Custom Structure)</option>
                {templates.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.category})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Footer Submit */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isGenerating || !topic.trim()}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-md ${
                isGenerating || !topic.trim()
                  ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                  : 'bg-[#7C3AED] hover:bg-[#6D28D9] text-white shadow-purple-500/20'
              }`}
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Generating Post...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Generate Post</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
