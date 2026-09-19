import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Image as ImageIcon,
  Eraser,
  Undo2,
  Redo2,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Indent,
  Wand2,
  Paperclip,
  Bookmark,
  Save,
  FolderOpen,
  Copy,
  Check,
  Send,
  Monitor,
  Smartphone,
  ThumbsUp,
  MessageSquare,
  Repeat2,
  Share2,
  Globe,
  Info,
  ArrowUp,
  RefreshCw,
  MoreHorizontal,
  X,
  Plus,
} from 'lucide-react';
import {
  toUnicodeBold,
  toUnicodeItalic,
  toUnicodeUnderline,
  toUnicodeStrikethrough,
  formatAsBulletList,
  formatAsNumberedList,
} from '../utils/textStyler.ts';
import confetti from 'canvas-confetti';
import { User } from '../types.ts';
import { translations } from '../translations.ts';

interface AIPostEditorStudioProps {
  content: string;
  onChangeContent: (text: string) => void;
  currentUser: User | null;
  onOpenAIGenerate: () => void;
  onOpenAITouchUps: () => void;
  onOpenSnippets: () => void;
  onSaveDraft: () => void;
  onOpenDrafts: () => void;
  language: 'en' | 'bn';
}

export const AIPostEditorStudio: React.FC<AIPostEditorStudioProps> = ({
  content,
  onChangeContent,
  currentUser,
  onOpenAIGenerate,
  onOpenAITouchUps,
  onOpenSnippets,
  onSaveDraft,
  onOpenDrafts,
  language,
}) => {
  const isBn = language === 'bn';
  const t = translations[language].editor;
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // History stack for Undo / Redo
  const [history, setHistory] = useState<string[]>([content]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  // AI Direct Command input state (e.g. "add 2 more points to the list")
  const [aiCommand, setAiCommand] = useState('');
  const [isAiEditing, setIsAiEditing] = useState(false);

  // Preview device view ('desktop' | 'mobile')
  const [deviceView, setDeviceView] = useState<'desktop' | 'mobile'>('desktop');

  // Copy feedback state
  const [copied, setCopied] = useState(false);

  // Optional attached image
  const [attachedImageUrl, setAttachedImageUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Social reaction simulation
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(64);

  // Update history when content changes from outside
  useEffect(() => {
    if (content !== history[historyIndex]) {
      const nextHistory = history.slice(0, historyIndex + 1);
      nextHistory.push(content);
      setHistory(nextHistory);
      setHistoryIndex(nextHistory.length - 1);
    }
  }, [content]);

  // Push new state to history
  const updateContentWithHistory = (newText: string) => {
    onChangeContent(newText);
    const nextHistory = history.slice(0, historyIndex + 1);
    nextHistory.push(newText);
    setHistory(nextHistory);
    setHistoryIndex(nextHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      onChangeContent(history[newIndex]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      onChangeContent(history[newIndex]);
    }
  };

  const handleClear = () => {
    if (confirm(isBn ? 'আপনি কি পোস্টের লেখা মুছে ফেলতে চান?' : 'Clear current post text?')) {
      updateContentWithHistory('');
    }
  };

  // Text selection transformations
  const applyTransform = (transformer: (selected: string) => string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);

    if (selectedText) {
      const transformed = transformer(selectedText);
      const newText = content.substring(0, start) + transformed + content.substring(end);
      updateContentWithHistory(newText);
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start, start + transformed.length);
      }, 50);
    } else {
      // If nothing selected, format entire text (for lists) or show subtle prompt
      const transformed = transformer(content);
      updateContentWithHistory(transformed);
    }
  };

  // Live Statistics
  const charCount = content.length;
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const sentenceCount = content.trim() ? (content.match(/[.!?]+(?:\s|$)/g) || []).length + 1 : 0;
  const readingTimeSec = Math.max(1, Math.ceil((wordCount / 220) * 60));

  // AI Direct Command Execution
  const handleRunAiCommand = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!aiCommand.trim() || isAiEditing) return;

    setIsAiEditing(true);
    try {
      const res = await fetch('/api/posts/refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentContent: content,
          refinementType: 'custom',
          customInstruction: aiCommand,
          language,
        }),
      });

      const data = await res.json();
      if (res.ok && data.refinedContent) {
        updateContentWithHistory(data.refinedContent);
        setAiCommand('');
        confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } });
      }
    } catch (err) {
      console.error('AI command error:', err);
    } finally {
      setIsAiEditing(false);
    }
  };

  // Copy to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    confetti({ particleCount: 45, spread: 65, origin: { y: 0.8 } });
    setTimeout(() => setCopied(false), 2400);
  };

  // Post to LinkedIn
  const handlePostToLinkedIn = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    const shareUrl = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(content)}`;
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };

  // Image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAttachedImageUrl(url);
    }
  };

  const handleGenerateSampleImage = () => {
    // Generate a sleek LinkedIn gradient quote card
    const quoteSeed = encodeURIComponent(content.slice(0, 40) || 'Leadership');
    setAttachedImageUrl(`https://picsum.photos/seed/${quoteSeed}/800/500`);
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Container Frame with Eyebrow Label */}
      <div className="relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-[0_2px_12px_rgba(0,0,0,0.04)] overflow-hidden transition-colors">
        {/* Top Eyebrow Tag */}
        <div className="px-5 py-2.5 bg-slate-50/70 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
          <span className="font-bold tracking-wider text-slate-700 dark:text-slate-200 uppercase flex items-center gap-1.5 text-[11px]">
            <Sparkles className="w-3.5 h-3.5 text-[#7C3AED] dark:text-purple-400" />
            <span>LinkedIn Post Formatter & Generator ✧</span>
          </span>
          <span className="text-[11px] text-slate-400 font-medium">Free Web App</span>
        </div>

        {/* PRIMARY RICH TOOLBAR (Matches Image 1 & 5) */}
        <div className="p-2 sm:px-4 border-b border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-wrap items-center justify-between gap-2">
          {/* Left Group: AI Generate, Image, Formatting */}
          <div className="flex items-center gap-1 flex-wrap">
            {/* Generate with AI button */}
            <button
              id="toolbar-generate-ai-btn"
              onClick={onOpenAIGenerate}
              className="px-3 py-1.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer mr-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.generateWithAI}</span>
            </button>

            {/* Generate Image button */}
            <button
              onClick={handleGenerateSampleImage}
              className="px-2.5 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 dark:hover:bg-purple-900/50 text-purple-700 dark:text-purple-300 text-xs font-semibold flex items-center gap-1 border border-purple-200/60 dark:border-purple-800/50 transition-colors cursor-pointer mr-1"
              title={t.generateImage}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.generateImage}</span>
            </button>

            {/* Clear / Eraser */}
            <button
              onClick={handleClear}
              className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={t.clearText}
            >
              <Eraser className="w-4 h-4" />
            </button>

            {/* Undo / Redo */}
            <button
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              className={`p-1.5 rounded-lg transition-colors ${
                historyIndex <= 0
                  ? 'text-slate-300 dark:text-slate-600'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title={t.undo}
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              className={`p-1.5 rounded-lg transition-colors ${
                historyIndex >= history.length - 1
                  ? 'text-slate-300 dark:text-slate-600'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title={t.redo}
            >
              <Redo2 className="w-4 h-4" />
            </button>

            <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-1" />

            {/* Unicode Formatting Tools */}
            <button
              onClick={() => applyTransform(toUnicodeBold)}
              className="p-1.5 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold transition-colors"
              title={t.bold}
            >
              <Bold className="w-4 h-4" />
            </button>

            <button
              onClick={() => applyTransform(toUnicodeItalic)}
              className="p-1.5 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 italic transition-colors"
              title={t.italic}
            >
              <Italic className="w-4 h-4" />
            </button>

            <button
              onClick={() => applyTransform(toUnicodeUnderline)}
              className="p-1.5 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={t.underline}
            >
              <Underline className="w-4 h-4" />
            </button>

            <button
              onClick={() => applyTransform(toUnicodeStrikethrough)}
              className="p-1.5 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={t.strikethrough}
            >
              <Strikethrough className="w-4 h-4" />
            </button>

            <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-1" />

            {/* List Formatters */}
            <button
              onClick={() => applyTransform(formatAsBulletList)}
              className="p-1.5 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={t.bulletList}
            >
              <List className="w-4 h-4" />
            </button>

            <button
              onClick={() => applyTransform(formatAsNumberedList)}
              className="p-1.5 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={t.numberedList}
            >
              <ListOrdered className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                const textarea = textareaRef.current;
                if (!textarea) return;
                const start = textarea.selectionStart;
                const newText = content.substring(0, start) + '\n\n' + content.substring(start);
                updateContentWithHistory(newText);
              }}
              className="p-1.5 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={t.addSpacing}
            >
              <Indent className="w-4 h-4" />
            </button>
          </div>

          {/* Right Group: AI Touch-Ups, Attach Image, Snippets, Save / Load */}
          <div className="flex items-center gap-1 flex-wrap">
            {/* AI Touch-Ups */}
            <button
              onClick={onOpenAITouchUps}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-purple-50 dark:hover:bg-purple-950/50 hover:text-purple-700 dark:hover:text-purple-300 hover:border-purple-200 dark:hover:border-purple-800 text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
              title={t.aiTouchUps}
            >
              <Wand2 className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <span className="hidden sm:inline">{t.aiTouchUps}</span>
            </button>

            {/* Attach Image */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
              title={t.attachImage}
            >
              <Paperclip className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span className="hidden sm:inline">{t.attachImage}</span>
            </button>

            {/* Snippets */}
            <button
              onClick={onOpenSnippets}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
              title={t.snippets}
            >
              <Bookmark className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span className="hidden sm:inline">{t.snippets}</span>
            </button>

            {/* Save Draft */}
            <button
              onClick={onSaveDraft}
              className="px-2.5 py-1.5 rounded-lg bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200/80 dark:border-purple-800/60 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/40 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
              title={t.saveDraft}
            >
              <Save className="w-3.5 h-3.5" />
              <span>{t.saveDraft}</span>
            </button>

            {/* Load Draft */}
            <button
              onClick={onOpenDrafts}
              className="px-2.5 py-1.5 rounded-lg bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200/80 dark:border-purple-800/60 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/40 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
              title={t.loadDrafts}
            >
              <FolderOpen className="w-3.5 h-3.5" />
              <span>{t.loadDrafts}</span>
            </button>
          </div>
        </div>

        {/* DUAL COLUMN WORKSPACE (Matches Image 5) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-200 dark:divide-slate-800">
          {/* LEFT COLUMN: EDITOR */}
          <div className="p-4 sm:p-5 flex flex-col justify-between gap-3 bg-white dark:bg-slate-900 transition-colors">
            {/* Textarea */}
            <div className="relative">
              <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => updateContentWithHistory(e.target.value)}
                placeholder={t.placeholder}
                rows={14}
                className="w-full text-slate-900 dark:text-slate-100 bg-transparent text-[14.5px] leading-relaxed font-sans border-0 focus:ring-0 outline-none resize-y placeholder:text-slate-400 dark:placeholder:text-slate-500 p-0"
              />
            </div>

            {/* Attached Image Preview if exists */}
            {attachedImageUrl && (
              <div className="relative rounded-xl overflow-hidden border border-slate-200 group">
                <img
                  src={attachedImageUrl}
                  alt="Post Attachment"
                  className="w-full max-h-48 object-cover"
                />
                <button
                  onClick={() => setAttachedImageUrl(null)}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/70 text-white hover:bg-slate-900 transition-colors"
                  title="Remove Image"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Statistics Bar */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 text-[11px] text-slate-400 dark:text-slate-400 font-medium">
              <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>
                {t.charLabel}: <strong className="text-slate-600 dark:text-slate-200 font-bold">{charCount}</strong>, {t.wordsLabel}:{' '}
                <strong className="text-slate-600 dark:text-slate-200 font-bold">{wordCount}</strong>, {t.sentencesLabel}:{' '}
                <strong className="text-slate-600 dark:text-slate-200 font-bold">{sentenceCount}</strong>, {t.readingTimeLabel}:{' '}
                <strong className="text-slate-600 dark:text-slate-200 font-bold">{readingTimeSec} {t.sec}</strong>
              </span>
            </div>

            {/* AI Direct Command Bar (Matches Image 5!) */}
            <form
              onSubmit={handleRunAiCommand}
              className="flex items-center gap-2 p-1.5 rounded-xl border border-slate-200/90 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 focus-within:border-purple-600 focus-within:bg-white dark:focus-within:bg-slate-800 focus-within:ring-2 focus-within:ring-purple-100 dark:focus-within:ring-purple-900/40 transition-all"
            >
              <input
                type="text"
                value={aiCommand}
                onChange={(e) => setAiCommand(e.target.value)}
                placeholder={t.aiCommandPlaceholder}
                className="flex-1 px-2.5 py-1 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 bg-transparent outline-none"
              />
              <button
                type="button"
                onClick={handleUndo}
                disabled={historyIndex <= 0}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 disabled:opacity-40"
                title={t.undo}
              >
                <Undo2 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleRedo}
                disabled={historyIndex >= history.length - 1}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 disabled:opacity-40"
                title={t.redo}
              >
                <Redo2 className="w-3.5 h-3.5" />
              </button>
              <button
                type="submit"
                disabled={!aiCommand.trim() || isAiEditing}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                  !aiCommand.trim() || isAiEditing
                    ? 'bg-purple-300 text-white cursor-not-allowed'
                    : 'bg-[#7C3AED] hover:bg-[#6D28D9] text-white shadow-xs cursor-pointer'
                }`}
              >
                {isAiEditing ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <>
                    <span>{t.editPostBtn}</span>
                    <ArrowUp className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>

            {/* Bottom Primary Buttons (Copy to Clipboard & Post on LinkedIn) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {/* Copy to Clipboard (Purple) */}
              <button
                onClick={handleCopy}
                className="w-full py-2.5 px-4 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] active:bg-[#5B21B6] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? t.copiedBtn : t.copyBtn}</span>
              </button>

              {/* Post On LinkedIn (LinkedIn Blue) */}
              <button
                onClick={handlePostToLinkedIn}
                className="w-full py-2.5 px-4 rounded-xl bg-[#0A66C2] hover:bg-[#004182] active:bg-[#084D94] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <span className="font-serif font-black text-sm">in</span>
                <span>{t.postLinkedInBtn}</span>
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: REALISTIC LINKEDIN POST PREVIEW */}
          <div className="p-4 sm:p-5 flex flex-col gap-3 bg-slate-50/50 dark:bg-slate-950/40 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] dark:bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] transition-colors">
            {/* Header: Title & Desktop / Mobile Switcher */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                {t.previewTitle}
              </span>
              <div className="flex items-center gap-1 bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-200/80 dark:border-slate-700 shadow-2xs">
                <button
                  onClick={() => setDeviceView('desktop')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    deviceView === 'desktop'
                      ? 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-bold border border-purple-200/80 dark:border-purple-800'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span>{t.desktop}</span>
                </button>
                <button
                  onClick={() => setDeviceView('mobile')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    deviceView === 'mobile'
                      ? 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-bold border border-purple-200/80 dark:border-purple-800'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>{t.mobile}</span>
                </button>
              </div>
            </div>

            {/* LinkedIn Card Frame */}
            <div
              className={`bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-all mx-auto ${
                deviceView === 'mobile' ? 'max-w-[340px]' : 'w-full'
              }`}
            >
              {/* Card Author Header */}
              <div className="p-3.5 sm:p-4 pb-2 flex items-start justify-between gap-2.5">
                <div className="flex items-center gap-2.5">
                  <img
                    src={currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'}
                    alt="Fernando"
                    className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800"
                  />
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-slate-900 dark:text-white text-xs hover:underline cursor-pointer">
                        {currentUser?.name || 'Fernando'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                      {currentUser?.headline || t.sampleBio}
                    </p>
                    <div className="flex items-center gap-1 text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                      <span>{t.timeAgo}</span>
                      <span>•</span>
                      <Globe className="w-2.5 h-2.5" />
                    </div>
                  </div>
                </div>

                <button className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 p-1">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>

              {/* Card Post Content */}
              <div className="px-3.5 sm:px-4 pb-3">
                <p className="text-slate-900 dark:text-slate-100 text-xs sm:text-[13px] leading-relaxed whitespace-pre-line font-sans select-text">
                  {content || t.placeholder}
                </p>
              </div>

              {/* Card Attached Image */}
              {attachedImageUrl && (
                <div className="w-full border-t border-b border-slate-100 dark:border-slate-800 bg-slate-100 dark:bg-slate-800">
                  <img
                    src={attachedImageUrl}
                    alt="Post media"
                    className="w-full max-h-64 object-cover"
                  />
                </div>
              )}

              {/* Engagement Stats Line */}
              <div className="px-3.5 sm:px-4 py-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1">
                  <span className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center text-[9px] text-white">
                    👍
                  </span>
                  <span className="font-semibold">{liked ? likeCount + 1 : likeCount}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>{t.commentsCount}</span>
                  <span>•</span>
                  <span>{t.repostsCount}</span>
                </div>
              </div>

              {/* Interactive Reaction Buttons */}
              <div className="px-2 py-1 border-t border-slate-100 dark:border-slate-800 grid grid-cols-4 gap-1 text-slate-600 dark:text-slate-300 text-xs font-semibold">
                <button
                  onClick={() => setLiked(!liked)}
                  className={`flex items-center justify-center gap-1 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer ${
                    liked ? 'text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <ThumbsUp className={`w-3.5 h-3.5 ${liked ? 'fill-blue-600 dark:fill-blue-400' : ''}`} />
                  <span>{t.likeBtn}</span>
                </button>
                <button className="flex items-center justify-center gap-1 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{t.commentBtn}</span>
                </button>
                <button className="flex items-center justify-center gap-1 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                  <Repeat2 className="w-3.5 h-3.5" />
                  <span>{t.shareBtn}</span>
                </button>
                <button className="flex items-center justify-center gap-1 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                  <Send className="w-3.5 h-3.5" />
                  <span>{t.sendBtn}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
