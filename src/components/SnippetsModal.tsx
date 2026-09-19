import React from 'react';
import { X, Copy, Plus, Bookmark, Sparkles } from 'lucide-react';

interface SnippetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertSnippet: (text: string) => void;
}

const SNIPPET_CATEGORIES = [
  {
    category: 'Viral Opening Hooks',
    items: [
      "99% of people get this wrong about [Topic]:",
      "I spent 100+ hours analyzing [Topic]. Here are 5 things you need to know:",
      "Unpopular opinion: Stop doing [Common Habit]. Do this instead:",
      "The hardest lesson I learned in my career wasn't about skills. It was this:",
      "3 brutal truths about [Industry] no one talks about:",
    ],
  },
  {
    category: 'List & Comparison Formats',
    items: [
      "- They focus on vanity metrics ❌\n- They optimize for authentic trust ✅",
      "Before:\n• Stressful sprints\n• High turnover\n\nAfter:\n• Clear quarterly goals\n• 4-day focus culture",
      "💡 Step 1: Clarify the problem\n💡 Step 2: Test with 5 real users\n💡 Step 3: Iterate and scale",
    ],
  },
  {
    category: 'High-Converting Calls to Action (CTAs)',
    items: [
      "What is your #1 rule of thumb on this? Let's discuss in the comments below! 👇",
      "If you found this helpful:\n1. Follow me for more insights\n2. Repost to share with your network ♻️",
      "Agree or disagree? Would love to hear how your team approaches this.",
    ],
  },
];

export const SnippetsModal: React.FC<SnippetsModalProps> = ({
  isOpen,
  onClose,
  onInsertSnippet,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-purple-100 dark:border-slate-800 overflow-hidden flex flex-col max-h-[85vh] transition-colors">
        {/* Header */}
        <div className="p-4 sm:px-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-purple-50/40 dark:bg-slate-800/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 flex items-center justify-center">
              <Bookmark className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">Reusable LinkedIn Snippets</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Insert proven viral hooks, frameworks, and CTAs in 1 click</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Snippet List */}
        <div className="p-4 sm:p-6 overflow-y-auto flex flex-col gap-5">
          {SNIPPET_CATEGORIES.map((cat, idx) => (
            <div key={idx} className="flex flex-col gap-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-purple-900 dark:text-purple-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                <span>{cat.category}</span>
              </h4>
              <div className="flex flex-col gap-1.5">
                {cat.items.map((item, sIdx) => (
                  <div
                    key={sIdx}
                    className="p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-700 bg-white dark:bg-slate-800/80 hover:border-purple-300 dark:hover:border-purple-600 hover:bg-purple-50/40 dark:hover:bg-purple-950/30 flex items-center justify-between gap-3 group transition-all"
                  >
                    <p className="text-xs text-slate-700 dark:text-slate-200 font-sans whitespace-pre-line line-clamp-2">
                      {item}
                    </p>
                    <button
                      onClick={() => {
                        onInsertSnippet(item);
                        onClose();
                      }}
                      className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-[11px] font-bold shrink-0 flex items-center gap-1 shadow-2xs cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Insert</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
