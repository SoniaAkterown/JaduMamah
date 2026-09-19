import React, { useState, useEffect } from 'react';
import { X, BarChart3, Cpu, Sparkles, Hash, Activity, Clock } from 'lucide-react';
import { AnalyticsSummary } from '../types.ts';

interface AnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'en' | 'bn';
}

export const AnalyticsModal: React.FC<AnalyticsModalProps> = ({ isOpen, onClose, language }) => {
  const isBn = language === 'bn';
  const [data, setData] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchAnalytics();
    }
  }, [isOpen]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/analytics');
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error('Analytics error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[88vh] transition-colors">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-850">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950 text-[#0A66C2] dark:text-blue-400 flex items-center justify-center font-bold">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {isBn ? 'AI অ্যানালিটিক্স ও টোকেন ট্র্যাকিং' : 'AI Analytics & Token Telemetry'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isBn ? 'Gemini AI মডেল ও পোস্ট তৈরির সামগ্রিক পরিসংখ্যান' : 'Live consumption metrics and distribution analytics'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto flex flex-col gap-5 bg-white dark:bg-slate-900">
          {/* Key Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-blue-50/50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50">
              <div className="flex items-center gap-1.5 text-[#0A66C2] dark:text-blue-400 text-xs font-semibold mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isBn ? 'মোট পোস্ট' : 'Total Posts'}</span>
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{data?.totalPostsGenerated ?? '—'}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-purple-50/50 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/50">
              <div className="flex items-center gap-1.5 text-purple-700 dark:text-purple-300 text-xs font-semibold mb-1">
                <Cpu className="w-3.5 h-3.5" />
                <span>{isBn ? 'টোকেন ব্যয়' : 'Tokens Used'}</span>
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{data?.totalTokensUsed ?? '—'}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50">
              <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300 text-xs font-semibold mb-1">
                <Activity className="w-3.5 h-3.5" />
                <span>{isBn ? 'গড় দৈর্ঘ্য' : 'Avg Length'}</span>
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white">
                {data?.averageLength ?? 0} <span className="text-xs font-normal text-slate-500 dark:text-slate-400">chars</span>
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-50/50 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/50">
              <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-300 text-xs font-semibold mb-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{isBn ? 'রেসপন্স টাইম' : 'Latency'}</span>
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white">&lt; 2.4s</p>
            </div>
          </div>

          {/* Tone Breakdown */}
          {data?.popularTones && data.popularTones.length > 0 && (
            <div className="bg-white dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-800 p-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 mb-3">
                {isBn ? 'টোন ব্যবহারের অনুপাত' : 'Tone Distribution'}
              </h4>
              <div className="space-y-2">
                {data.popularTones.map((item) => {
                  const percentage = Math.round((item.count / (data.totalPostsGenerated || 1)) * 100);
                  return (
                    <div key={item.tone} className="space-y-1">
                      <div className="flex items-center justify-between text-xs text-slate-700 dark:text-slate-300">
                        <span className="font-semibold">{item.tone}</span>
                        <span>
                          {item.count} {isBn ? 'টি পোস্ট' : 'posts'} ({percentage}%)
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                        <div
                          className="h-full bg-[#0A66C2] dark:bg-blue-500 rounded-full transition-all duration-500"
                          style={{ width: `${Math.max(percentage, 5)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* AI Requests Log (AI_REQUESTS Table) */}
          <div className="bg-white dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-800 p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 mb-2">
              {isBn ? 'সর্বশেষ AI রিকোয়েস্ট লগ (AI_REQUESTS টেবিল)' : 'Recent AI Request Telemetry (AI_REQUESTS Table)'}
            </h4>
            <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-48 overflow-y-auto">
              {data?.recentRequests && data.recentRequests.length > 0 ? (
                data.recentRequests.map((req) => (
                  <div key={req.id} className="py-2 flex items-center justify-between text-xs">
                    <div className="max-w-[320px] truncate">
                      <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">{req.promptText}</p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500">
                        Model: <span className="font-mono text-purple-600 dark:text-purple-400">{req.modelName}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-[10px] font-mono font-bold border border-transparent dark:border-purple-900/50">
                        {req.tokensUsed} tokens
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 dark:text-slate-500 py-3 text-center">No AI logs yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
