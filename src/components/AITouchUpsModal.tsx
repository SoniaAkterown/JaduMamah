import React, { useState } from 'react';
import { X, Wand2, Sparkles, RefreshCw, CheckCircle2, MessageSquare, Zap, Smile, BookOpen, Briefcase } from 'lucide-react';

interface AITouchUpsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentContent: string;
  onApplyRefinedContent: (refined: string) => void;
  language: 'en' | 'bn';
}

export const AITouchUpsModal: React.FC<AITouchUpsModalProps> = ({
  isOpen,
  onClose,
  currentContent,
  onApplyRefinedContent,
  language,
}) => {
  const [selectedType, setSelectedType] = useState('punchier');
  const [customInstruction, setCustomInstruction] = useState('');
  const [loading, setLoading] = useState(false);
  const [previewContent, setPreviewContent] = useState<string | null>(null);

  if (!isOpen) return null;

  const OPTIONS = [
    {
      id: 'punchier',
      icon: <Zap className="w-4 h-4 text-amber-500" />,
      title: 'Make Punchier & Crisp',
      desc: 'Shorter sentences, strong rhythmic line breaks, remove filler words',
    },
    {
      id: 'emojis',
      icon: <Smile className="w-4 h-4 text-purple-500" />,
      title: 'Add Tasteful Emojis',
      desc: 'Inject 3-5 visual bullets and milestone markers to improve readability',
    },
    {
      id: 'questions',
      icon: <MessageSquare className="w-4 h-4 text-blue-500" />,
      title: 'Add Conversation Hook & Question',
      desc: 'Add high-converting call-to-actions to spark 10x more comments',
    },
    {
      id: 'executive',
      icon: <Briefcase className="w-4 h-4 text-emerald-500" />,
      title: 'Executive C-Suite Tone',
      desc: 'Authoritative, data-backed perspective for senior decision-makers',
    },
    {
      id: 'story',
      icon: <BookOpen className="w-4 h-4 text-indigo-500" />,
      title: 'Storytelling Hook Transformation',
      desc: 'Restructure beginning into a captivating personal narrative arc',
    },
  ];

  const handleRunTouchUp = async () => {
    if (!currentContent.trim() || loading) return;

    setLoading(true);
    try {
      const res = await fetch('/api/posts/refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentContent,
          refinementType: selectedType,
          customInstruction,
          language,
        }),
      });

      const data = await res.json();
      if (res.ok && data.refinedContent) {
        setPreviewContent(data.refinedContent);
      }
    } catch (err) {
      console.error('Touch-up error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (previewContent) {
      onApplyRefinedContent(previewContent);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-purple-100 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh] transition-colors">
        {/* Header */}
        <div className="p-4 sm:px-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-purple-50/40 dark:bg-slate-800/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-xs">
              <Wand2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">AI Touch-Ups & Enhancer</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Fine-tune tone, formatting, and engagement in seconds</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {OPTIONS.map((opt) => {
              const isSelected = selectedType === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setSelectedType(opt.id)}
                  className={`p-3 rounded-xl border text-left transition-all flex items-start gap-2.5 ${
                    isSelected
                      ? 'border-purple-600 bg-purple-50/70 dark:bg-purple-950/60 ring-1 ring-purple-600'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800'
                  }`}
                >
                  <div className="p-1.5 rounded-lg bg-white dark:bg-slate-700 border border-slate-100 dark:border-slate-600 shadow-2xs">
                    {opt.icon}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">{opt.title}</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">{opt.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Optional custom instructions */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-200">Specific custom instructions (Optional)</label>
            <input
              type="text"
              value={customInstruction}
              onChange={(e) => setCustomInstruction(e.target.value)}
              placeholder="e.g. Keep under 4 paragraphs and end with a question about remote work..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-purple-600 outline-none"
            />
          </div>

          {/* Preview Area if generated */}
          {previewContent && (
            <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center justify-between">
                <span className="flex items-center gap-1 text-purple-700 dark:text-purple-300">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  AI Refined Output
                </span>
              </label>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 leading-relaxed font-sans max-h-48 overflow-y-auto whitespace-pre-line">
                {previewContent}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={handleRunTouchUp}
              disabled={loading}
              className="px-4 py-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 dark:hover:bg-purple-900/60 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
              <span>{loading ? 'Polishing Post...' : 'Generate Touch-Up'}</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleApply}
                disabled={!previewContent}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all ${
                  previewContent
                    ? 'bg-[#7C3AED] hover:bg-[#6D28D9] text-white cursor-pointer'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                }`}
              >
                <span>Apply to Editor</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
