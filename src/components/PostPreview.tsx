import React, { useState, useEffect } from 'react';
import {
  Copy,
  Check,
  Download,
  FileDown,
  Edit3,
  Sparkles,
  ThumbsUp,
  MessageSquare,
  Repeat2,
  Send,
  MoreHorizontal,
  Globe,
  Save,
  Bold,
  Italic,
  TrendingUp,
  Clock,
  FileText,
  BadgeCheck,
  Bookmark,
  Share2,
} from 'lucide-react';
import { PostVariation, User } from '../types.ts';
import { toUnicodeBold, toUnicodeItalic } from '../utils/textStyler.ts';
import jsPDF from 'jspdf';
import confetti from 'canvas-confetti';

interface PostPreviewProps {
  variation: PostVariation | null;
  currentUser: User | null;
  onRefineClick: () => void;
  onSaveToHistory: (updatedContent?: string) => void;
  language: 'en' | 'bn';
}

export const PostPreview: React.FC<PostPreviewProps> = ({
  variation,
  currentUser,
  onRefineClick,
  onSaveToHistory,
  language,
}) => {
  const isBn = language === 'bn';
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editableContent, setEditableContent] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [activeReaction, setActiveReaction] = useState<string | null>(null);
  const [reactionCount, setReactionCount] = useState<number>(84);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    if (variation) {
      setEditableContent(variation.content);
      setIsEditing(false);
      setExpanded(false);
      setReactionCount(variation.engagementScore * 3 + 12);
    }
  }, [variation]);

  if (!variation) {
    return (
      <div className="h-full min-h-[460px] bg-white rounded-2xl border-2 border-dashed border-slate-200/90 flex flex-col items-center justify-center p-8 text-center shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
        <div className="w-16 h-16 rounded-2xl bg-blue-50/80 border border-blue-100 flex items-center justify-center text-[#0A66C2] mb-3 shadow-sm">
          <Sparkles className="w-8 h-8 animate-pulse text-[#0A66C2]" />
        </div>
        <h3 className="text-base font-bold text-slate-900">
          {isBn ? 'আপনার LinkedIn পোস্ট প্রিভিউ এখানে প্রদর্শিত হবে' : 'LinkedIn Live Feed Simulator'}
        </h3>
        <p className="text-xs text-slate-500 max-w-sm mt-1.5 leading-relaxed">
          {isBn
            ? 'বামপাশের প্যানেলে টপিক লিখুন ও টোন নির্বাচন করে "Generate LinkedIn Post" বাটনে ক্লিক করুন।'
            : 'Select a topic and tone on the left, then click Generate to preview your high-converting post in real time.'}
        </p>
      </div>
    );
  }

  const currentText = isEditing ? editableContent : editableContent || variation.content;
  const charCount = currentText.length;
  const wordCount = currentText.split(/\s+/).filter(Boolean).length;
  const isOverLimit = charCount > 3000;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentText);
    setCopied(true);
    confetti({ particleCount: 50, spread: 70, origin: { y: 0.7 } });
    setTimeout(() => setCopied(false), 2400);
  };

  const handleDownloadTxt = () => {
    const element = document.createElement('a');
    const file = new Blob([currentText], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `linkedin-post-${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleDownloadPdf = () => {
    try {
      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text('LinkedIn Post Export', 20, 20);

      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Author: ${currentUser?.name || 'Sonia Akter'}`, 20, 28);
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 34);
      doc.text(`Tone: ${variation.tone} | Read time: ${variation.estimatedReadTime}`, 20, 40);

      doc.setDrawColor(220);
      doc.line(20, 45, 190, 45);

      doc.setFontSize(12);
      doc.setTextColor(30);
      const splitText = doc.splitTextToSize(currentText, 170);
      doc.text(splitText, 20, 55);

      doc.save(`linkedin-post-${Date.now()}.pdf`);
    } catch (err) {
      console.error('PDF export failed:', err);
    }
  };

  const handleApplyBold = () => {
    const selected = window.getSelection()?.toString();
    if (selected && selected.trim()) {
      const transformed = toUnicodeBold(selected);
      setEditableContent((prev) => prev.replace(selected, transformed));
    }
  };

  const handleApplyItalic = () => {
    const selected = window.getSelection()?.toString();
    if (selected && selected.trim()) {
      const transformed = toUnicodeItalic(selected);
      setEditableContent((prev) => prev.replace(selected, transformed));
    }
  };

  const handleSaveEdits = () => {
    setIsEditing(false);
    onSaveToHistory(editableContent);
  };

  const toggleReaction = () => {
    if (activeReaction === 'like') {
      setActiveReaction(null);
      setReactionCount((prev) => prev - 1);
    } else {
      setActiveReaction('like');
      setReactionCount((prev) => prev + 1);
    }
  };

  // Truncate preview simulation (LinkedIn cutoff around 220 chars)
  const shouldTruncate = !expanded && !isEditing && currentText.length > 240;
  const displayText = shouldTruncate ? currentText.substring(0, 240) + '...' : currentText;

  // Render text with clickable styled hashtags
  const renderFormattedText = (text: string) => {
    const parts = text.split(/(#[a-zA-Z0-9_\u0980-\u09FF]+)/g);
    return parts.map((part, i) => {
      if (part.startsWith('#')) {
        return (
          <span key={i} className="text-[#0A66C2] font-semibold hover:underline cursor-pointer">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* 1. TOP STUDIO CONTROL BAR */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-3 sm:px-4 shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-wrap items-center justify-between gap-3">
        {/* Left Actions: Copy & Refine & Edit */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Primary Copy Button */}
          <button
            id="post-copy-btn"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0A66C2] hover:bg-[#004182] active:bg-[#084d94] text-white text-xs font-bold shadow-sm shadow-blue-500/25 transition-all cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? (isBn ? 'কপি হয়েছে!' : 'Copied to Clipboard!') : isBn ? 'কপি করুন' : 'Copy Post'}</span>
          </button>

          {/* AI Refine Button */}
          <button
            id="post-refine-btn"
            onClick={onRefineClick}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-purple-200 bg-purple-50/80 text-purple-700 hover:bg-purple-100 text-xs font-bold transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>{isBn ? 'AI রিফাইন' : 'AI Polish & Refine'}</span>
          </button>

          {/* Edit / Done Toggle */}
          <button
            id="post-edit-btn"
            onClick={() => {
              if (isEditing) {
                handleSaveEdits();
              } else {
                setIsEditing(true);
              }
            }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
              isEditing
                ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                : 'border-slate-200 text-slate-700 hover:bg-slate-100/80'
            }`}
          >
            {isEditing ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Edit3 className="w-3.5 h-3.5 text-slate-500" />}
            <span>{isEditing ? (isBn ? 'সংরক্ষণ সম্পন্ন' : 'Done Editing') : isBn ? 'এডিট করুন' : 'Edit Post'}</span>
          </button>
        </div>

        {/* Right Actions: Character Counter & Export */}
        <div className="flex items-center gap-2">
          {/* Character Counter pill */}
          <div
            className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border flex items-center gap-1 ${
              isOverLimit
                ? 'bg-red-50 border-red-200 text-red-700'
                : charCount > 2400
                ? 'bg-amber-50 border-amber-200 text-amber-700'
                : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}
            title="LinkedIn post limit: 3,000 characters"
          >
            <span>{charCount.toLocaleString()}</span>
            <span className="text-slate-400 font-normal">/ 3,000</span>
          </div>

          {/* TXT Export */}
          <button
            onClick={handleDownloadTxt}
            title={isBn ? 'TXT হিসেবে ডাউনলোড' : 'Download as TXT file'}
            className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            <FileDown className="w-3.5 h-3.5" />
          </button>

          {/* PDF Export */}
          <button
            onClick={handleDownloadPdf}
            title={isBn ? 'PDF হিসেবে ডাউনলোড' : 'Download as PDF file'}
            className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          {/* Bookmark */}
          <button
            onClick={() => setIsBookmarked(!isBookmarked)}
            className={`p-2 rounded-lg border transition-colors ${
              isBookmarked
                ? 'border-blue-300 bg-blue-50 text-[#0A66C2]'
                : 'border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
            title="Save to drafts"
          >
            <Bookmark className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. AUTHENTIC LINKEDIN POST FEED CARD */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.05)] overflow-hidden transition-all">
        {/* Post Card Header */}
        <div className="p-4 sm:p-5 pb-3 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={currentUser?.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=creator'}
                alt={currentUser?.name || 'Sonia Akter'}
                className="w-12 h-12 rounded-full border border-slate-200 object-cover bg-slate-100 shadow-2xs"
              />
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-900 text-sm hover:text-[#0A66C2] hover:underline cursor-pointer flex items-center gap-1">
                  {currentUser?.name || 'Sonia Akter'}
                  <BadgeCheck className="w-4 h-4 text-[#0A66C2] inline" />
                </span>
                <span className="text-slate-400 text-xs">• 1st</span>
              </div>
              <p className="text-xs text-slate-600 line-clamp-1 mt-0.5 font-medium">
                {currentUser?.headline || 'Growth Strategist & AI Content Creator | Helping Brands Scale'}
              </p>
              <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5 font-medium">
                <span>Just now</span>
                <span>•</span>
                <Globe className="w-3 h-3 text-slate-400" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200/60">
              {variation.tone}
            </span>
            <button className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Post Card Content Body */}
        <div className="px-4 sm:px-5 pb-4">
          {isEditing ? (
            <div className="flex flex-col gap-2.5">
              {/* Text Styling Bar in Edit Mode */}
              <div className="flex items-center justify-between p-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                <div className="flex items-center gap-1">
                  <button
                    onClick={handleApplyBold}
                    className="px-2 py-1 rounded bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-100 shadow-2xs"
                    title="Select text and click to make Unicode Bold"
                  >
                    <Bold className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={handleApplyItalic}
                    className="px-2 py-1 rounded bg-white border border-slate-200 text-slate-700 italic hover:bg-slate-100 shadow-2xs"
                    title="Select text and click to make Unicode Italic"
                  >
                    <Italic className="w-3.5 h-3.5" />
                  </button>
                </div>
                <button
                  onClick={handleSaveEdits}
                  className="flex items-center gap-1 text-xs font-bold text-[#0A66C2] hover:underline"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isBn ? 'ড্রাফট সেভ করুন' : 'Save Draft'}</span>
                </button>
              </div>

              <textarea
                value={editableContent}
                onChange={(e) => setEditableContent(e.target.value)}
                rows={12}
                className="w-full p-3.5 rounded-xl border border-blue-300 focus:ring-2 focus:ring-blue-100 outline-none text-slate-900 text-sm leading-relaxed font-sans resize-y shadow-2xs"
              />
            </div>
          ) : (
            <div className="text-[#191919] text-[14.5px] sm:text-[15px] leading-[1.65] whitespace-pre-line font-sans select-text">
              {renderFormattedText(displayText)}
              {shouldTruncate && (
                <button
                  onClick={() => setExpanded(true)}
                  className="text-slate-500 font-bold hover:text-[#0A66C2] hover:underline ml-1 cursor-pointer"
                >
                  ...see more
                </button>
              )}
              {!shouldTruncate && currentText.length > 240 && expanded && (
                <button
                  onClick={() => setExpanded(false)}
                  className="block text-slate-400 font-semibold hover:text-[#0A66C2] text-xs mt-2 cursor-pointer"
                >
                  show less
                </button>
              )}
            </div>
          )}
        </div>

        {/* Social Metrics Bar */}
        <div className="px-4 sm:px-5 py-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <div className="flex -space-x-1 items-center">
              <span className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center text-[9px] text-white shadow-2xs">
                👍
              </span>
              <span className="w-4 h-4 rounded-full bg-emerald-600 flex items-center justify-center text-[9px] text-white shadow-2xs">
                👏
              </span>
              <span className="w-4 h-4 rounded-full bg-amber-500 flex items-center justify-center text-[9px] text-white shadow-2xs">
                💡
              </span>
            </div>
            <span className="font-semibold text-slate-600">{reactionCount}</span>
          </div>

          <div className="flex items-center gap-3 text-slate-500 font-medium">
            <span>{Math.round(variation.engagementScore / 2.5)} comments</span>
            <span>•</span>
            <span>{Math.round(variation.engagementScore / 3.8)} reposts</span>
          </div>
        </div>

        {/* LinkedIn Interaction Buttons Bar */}
        <div className="px-2 sm:px-4 py-1 border-t border-slate-100 grid grid-cols-4 gap-1 text-slate-600">
          <button
            onClick={toggleReaction}
            className={`flex items-center justify-center gap-1.5 py-2.5 rounded-lg hover:bg-slate-100 text-xs font-bold transition-colors cursor-pointer ${
              activeReaction === 'like' ? 'text-[#0A66C2]' : 'text-slate-600'
            }`}
          >
            <ThumbsUp className={`w-4 h-4 ${activeReaction === 'like' ? 'fill-[#0A66C2]' : ''}`} />
            <span>Like</span>
          </button>

          <button className="flex items-center justify-center gap-1.5 py-2.5 rounded-lg hover:bg-slate-100 text-xs font-bold text-slate-600 transition-colors cursor-pointer">
            <MessageSquare className="w-4 h-4" />
            <span>Comment</span>
          </button>

          <button className="flex items-center justify-center gap-1.5 py-2.5 rounded-lg hover:bg-slate-100 text-xs font-bold text-slate-600 transition-colors cursor-pointer">
            <Repeat2 className="w-4 h-4" />
            <span>Repost</span>
          </button>

          <button className="flex items-center justify-center gap-1.5 py-2.5 rounded-lg hover:bg-slate-100 text-xs font-bold text-slate-600 transition-colors cursor-pointer">
            <Send className="w-4 h-4" />
            <span>Send</span>
          </button>
        </div>
      </div>

      {/* 3. PERFORMANCE & QUALITY METRICS BAR */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
        <div className="p-3 rounded-xl bg-white border border-slate-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <p className="text-slate-400 text-[10px] uppercase font-bold flex items-center justify-center gap-1">
            <FileText className="w-3 h-3 text-slate-400" />
            {isBn ? 'শব্দ সংখ্যা' : 'Word Count'}
          </p>
          <p className="text-sm font-black text-slate-900 mt-1">{wordCount}</p>
        </div>

        <div className="p-3 rounded-xl bg-white border border-slate-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <p className="text-slate-400 text-[10px] uppercase font-bold flex items-center justify-center gap-1">
            <Clock className="w-3 h-3 text-slate-400" />
            {isBn ? 'পড়ার সময়' : 'Read Time'}
          </p>
          <p className="text-sm font-black text-slate-900 mt-1">{variation.estimatedReadTime}</p>
        </div>

        <div className="p-3 rounded-xl bg-white border border-slate-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <p className="text-slate-400 text-[10px] uppercase font-bold flex items-center justify-center gap-1">
            <TrendingUp className="w-3 h-3 text-emerald-500" />
            {isBn ? 'ইমপ্যাক্ট স্কোর' : 'Impact Score'}
          </p>
          <p className="text-sm font-black text-emerald-600 mt-1">{variation.engagementScore}%</p>
        </div>

        <div className="p-3 rounded-xl bg-white border border-slate-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <p className="text-slate-400 text-[10px] uppercase font-bold flex items-center justify-center gap-1">
            <span>#</span>
            {isBn ? 'হ্যাশট্যাগ' : 'Hashtags'}
          </p>
          <p className="text-sm font-black text-[#0A66C2] mt-1">{variation.hashtags.length} tags</p>
        </div>
      </div>
    </div>
  );
};
