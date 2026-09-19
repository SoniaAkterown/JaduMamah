import React, { useState } from 'react';
import { X, Search, Trash2, Copy, Check, ArrowRight, History, Calendar, SlidersHorizontal } from 'lucide-react';
import { Post } from '../types.ts';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  posts: Post[];
  onSelectPost: (post: Post) => void;
  onDeletePost: (postId: number) => void;
  language: 'en' | 'bn';
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  posts,
  onSelectPost,
  onDeletePost,
  language,
}) => {
  const isBn = language === 'bn';
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTone, setSelectedTone] = useState<string>('All');
  const [copiedId, setCopiedId] = useState<number | null>(null);

  if (!isOpen) return null;

  const tones = ['All', ...Array.from(new Set(posts.map((p) => p.tone).filter(Boolean)))];

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (post.hashtags && post.hashtags.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesTone = selectedTone === 'All' || post.tone === selectedTone;
    return matchesSearch && matchesTone;
  });

  const handleCopy = (post: Post, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(post.content);
    setCopiedId(post.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = (postId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(isBn ? 'আপনি কি এই পোস্টটি মুছে ফেলতে চান?' : 'Are you sure you want to delete this post?')) {
      onDeletePost(postId);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end animate-in fade-in">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 transition-colors">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-850">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950 text-[#0A66C2] dark:text-blue-400 flex items-center justify-center">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                {isBn ? 'পোস্ট হিস্ট্রি ও ড্রাফট' : 'Post History & Saved Drafts'}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {posts.length} {isBn ? 'টি পোস্ট সংরক্ষিত আছে' : 'posts stored in Oracle POSTS table'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filter */}
        <div className="p-3 border-b border-slate-100 dark:border-slate-800 flex flex-col gap-2 bg-white dark:bg-slate-900">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={isBn ? 'টপিক বা কীওয়ার্ড দিয়ে খুঁজুন...' : 'Search by topic, keyword, or hashtag...'}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:border-[#0A66C2] outline-none"
            />
          </div>

          {tones.length > 2 && (
            <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none text-[11px]">
              {tones.map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedTone(t)}
                  className={`px-2 py-0.5 rounded-full whitespace-nowrap border transition-colors cursor-pointer ${
                    selectedTone === t
                      ? 'bg-[#0A66C2] text-white border-[#0A66C2]'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Posts List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5 bg-[#FBFBFE] dark:bg-slate-950">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-12 text-slate-400 dark:text-slate-500 text-xs">
              <p>{isBn ? 'কোনো পোস্ট পাওয়া যায়নি' : 'No saved posts found.'}</p>
            </div>
          ) : (
            filteredPosts.map((post) => (
              <div
                key={post.id}
                onClick={() => {
                  onSelectPost(post);
                  onClose();
                }}
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-[#0A66C2] dark:hover:border-blue-500 hover:bg-blue-50/20 dark:hover:bg-blue-950/20 cursor-pointer transition-all flex flex-col justify-between group relative shadow-2xs"
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {post.tone}
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-1">
                      <Calendar className="w-2.5 h-2.5" />
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1 mb-1">{post.topic}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed font-sans">{post.content}</p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 dark:text-slate-500">{post.content.length} chars</span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => handleCopy(post, e)}
                      className="p-1 rounded-md text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                      title={isBn ? 'কপি করুন' : 'Copy'}
                    >
                      {copiedId === post.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      onClick={(e) => handleDelete(post.id, e)}
                      className="p-1 rounded-md text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer"
                      title={isBn ? 'ডিলিট করুন' : 'Delete'}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
