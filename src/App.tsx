/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { AIPostEditorStudio } from './components/AIPostEditorStudio.tsx';
import { AIGenerateModal } from './components/AIGenerateModal.tsx';
import { AITouchUpsModal } from './components/AITouchUpsModal.tsx';
import { SnippetsModal } from './components/SnippetsModal.tsx';
import { FeaturesSection } from './components/FeaturesSection.tsx';
import { MoreFreeToolsSection } from './components/MoreFreeToolsSection.tsx';
import { FooterHeroSection } from './components/FooterHeroSection.tsx';
import { ProModal } from './components/ProModal.tsx';
import { HistoryDrawer } from './components/HistoryDrawer.tsx';
import { TemplateLibraryModal } from './components/TemplateLibraryModal.tsx';
import { DatabaseInspectorModal } from './components/DatabaseInspectorModal.tsx';
import { AnalyticsModal } from './components/AnalyticsModal.tsx';
import { AuthModal } from './components/AuthModal.tsx';
import { FreeToolsModal } from './components/FreeToolsModal.tsx';
import {
  GeneratePostRequest,
  PostVariation,
  Post,
  Template,
  User,
} from './types.ts';
import { translations } from './translations.ts';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

const INITIAL_POST_TEXT = `99% of LinkedIn users don't build real connections:

- They send thoughtful messages ✓
- They follow up politely ✓
- They support others' posts ✓

What makes the difference?

1. Give before you ask.
2. Celebrate others' wins openly.
3. Be consistently authentic.

When you treat connections like real humans instead of numbers, everything changes.

How do you build meaningful relationships on here?`;

export default function App() {
  const [language, setLanguage] = useState<'en' | 'bn'>(() => {
    return (localStorage.getItem('app_lang') as 'en' | 'bn') || 'en';
  });

  const isBn = language === 'bn';

  // User auth state
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(() => {
    return localStorage.getItem('auth_token');
  });

  // Current post content being edited
  const [editorContent, setEditorContent] = useState<string>(INITIAL_POST_TEXT);

  // App data state
  const [historyPosts, setHistoryPosts] = useState<Post[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);

  // Generation state
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Modals visibility
  const [isAIGenerateOpen, setIsAIGenerateOpen] = useState(false);
  const [isAITouchUpsOpen, setIsAITouchUpsOpen] = useState(false);
  const [isSnippetsOpen, setIsSnippetsOpen] = useState(false);
  const [isProOpen, setIsProOpen] = useState(false);
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isDatabaseOpen, setIsDatabaseOpen] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isFreeToolsOpen, setIsFreeToolsOpen] = useState(false);
  const [activeFreeTool, setActiveFreeTool] = useState<string>('Organize PDF Pages');

  // Toast notifications
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Theme state (Dark / Light) - Default to 'light' for optimal contrast
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('app_theme');
    return saved === 'dark' ? 'dark' : 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('app_theme', theme);
  }, [theme]);

  const handleThemeToggle = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Sync language preference
  useEffect(() => {
    localStorage.setItem('app_lang', language);
  }, [language]);

  // Initial load
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      // 1. Current user
      const userRes = await fetch('/api/auth/me', {
        headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
      });
      if (userRes.ok) {
        const userData = await userRes.json();
        setCurrentUser(userData.user);
      }

      // 2. Templates
      const templatesRes = await fetch('/api/templates');
      if (templatesRes.ok) {
        const templatesData = await templatesRes.json();
        setTemplates(templatesData);
      }

      // 3. Saved history
      const historyRes = await fetch('/api/posts/history');
      if (historyRes.ok) {
        const historyData = await historyRes.json();
        setHistoryPosts(historyData);
      }
    } catch (err) {
      console.error('Failed to load initial data:', err);
    }
  };

  // Generate Post via AI Modal
  const handleAIGenerate = async (req: GeneratePostRequest) => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/posts/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
        body: JSON.stringify({
          ...req,
          userId: currentUser?.id || 1,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Generation failed');
      }

      if (data.variations && data.variations.length > 0) {
        const primary = data.variations[0];
        setEditorContent(primary.content);
        confetti({ particleCount: 50, spread: 70, origin: { y: 0.5 } });
        showToast(
          isBn
            ? 'নতুন পোস্ট সফলভাবে তৈরি হয়েছে!'
            : 'AI post generated and loaded into editor!'
        );

        // Refresh saved posts
        const histRes = await fetch('/api/posts/history');
        if (histRes.ok) {
          const histData = await histRes.json();
          setHistoryPosts(histData);
        }
      }
    } catch (error: any) {
      console.error('Generation error:', error);
      showToast(error.message || 'Generation error', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  // Save current editor content as draft
  const handleSaveDraft = async () => {
    if (!editorContent.trim()) return;

    try {
      const firstLine = editorContent.split('\n')[0].replace(/[^a-zA-Z0-9\s]/g, '').trim() || 'LinkedIn Post Draft';
      await fetch('/api/posts/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: firstLine.slice(0, 50),
          tone: 'Thought Leadership',
          length: 'medium',
          language,
          customNotes: editorContent,
          userId: currentUser?.id || 1,
        }),
      });

      const histRes = await fetch('/api/posts/history');
      if (histRes.ok) {
        const histData = await histRes.json();
        setHistoryPosts(histData);
      }

      showToast(isBn ? 'ড্রাফট সফলভাবে সংরক্ষণ করা হয়েছে!' : 'Post draft saved!');
    } catch (err) {
      console.error('Save error:', err);
      showToast('Failed to save draft', 'error');
    }
  };

  // Insert snippet directly into editor
  const handleInsertSnippet = (snippet: string) => {
    setEditorContent((prev) => (prev ? `${prev}\n\n${snippet}` : snippet));
    showToast(isBn ? 'স্নিপেট যোগ করা হয়েছে' : 'Snippet inserted into editor');
  };

  // Select historical post into editor
  const handleSelectHistoryPost = (post: Post) => {
    setEditorContent(post.content);
    setIsHistoryOpen(false);
    showToast(isBn ? 'ড্রাফট লোড করা হয়েছে' : 'Loaded draft into editor');
  };

  // Delete post from history
  const handleDeletePost = async (postId: number) => {
    try {
      const res = await fetch(`/api/posts/${postId}`, { method: 'DELETE' });
      if (res.ok) {
        setHistoryPosts((prev) => prev.filter((p) => p.id !== postId));
        showToast(isBn ? 'পোস্ট ডিলিট করা হয়েছে' : 'Draft deleted');
      }
    } catch (err) {
      console.error('Failed to delete post:', err);
    }
  };

  // Select template to load into editor or generate
  const handleSelectTemplate = (tmpl: Template) => {
    if (tmpl.sampleTopic) {
      setIsAIGenerateOpen(true);
    }
  };

  // Select tool from "More Free Tools"
  const handleSelectTool = (toolName: string) => {
    setActiveFreeTool(toolName);
    setIsFreeToolsOpen(true);
  };

  // Auth handlers
  const handleAuthSuccess = (user: User, token: string) => {
    setCurrentUser(user);
    setAuthToken(token);
    localStorage.setItem('auth_token', token);
    showToast(isBn ? `স্বাগতম, ${user.name}!` : `Welcome, ${user.name}!`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setAuthToken(null);
    localStorage.removeItem('auth_token');
    showToast(isBn ? 'লগআউট সম্পন্ন হয়েছে' : 'Logged out');
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans antialiased selection:bg-purple-100 selection:text-purple-700 transition-colors duration-200 ${theme === 'dark' ? 'bg-[#0B0F19] text-slate-100' : 'bg-[#FBFBFE] text-slate-800'}`}>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 animate-in slide-in-from-bottom-5 duration-200">
          <div
            className={`px-4 py-3 rounded-xl shadow-lg border text-xs font-bold flex items-center gap-2 ${
              toastMessage.type === 'error'
                ? 'bg-red-50 dark:bg-red-950/80 border-red-200 dark:border-red-900 text-red-700 dark:text-red-300'
                : 'bg-purple-50 dark:bg-slate-850 border-purple-200 dark:border-purple-800/70 text-purple-900 dark:text-purple-200'
            }`}
          >
            {toastMessage.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            )}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Top Navbar (Matches Image 1 & 10) */}
      <Navbar
        currentUser={currentUser}
        historyCount={historyPosts.length}
        templatesCount={templates.length}
        language={language}
        theme={theme}
        onThemeToggle={handleThemeToggle}
        onLanguageToggle={() => setLanguage((prev) => (prev === 'en' ? 'bn' : 'en'))}
        onOpenTemplates={() => setIsTemplatesOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenDatabase={() => setIsDatabaseOpen(true)}
        onOpenAnalytics={() => setIsAnalyticsOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onNewPost={() => {
          setEditorContent('');
          setIsAIGenerateOpen(true);
        }}
        onOpenAIGenerate={() => setIsAIGenerateOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 flex flex-col gap-8">
        {/* HERO TITLE & BADGES (Matches Image 1) */}
        <div className="flex flex-col items-center text-center gap-3.5 max-w-3xl mx-auto">
          {/* Lavender Pill Badges (Matches Image 1) */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {translations[language].hero.badges.map(
              (badge, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 border border-transparent dark:border-purple-800/60 text-[11px] font-bold tracking-wide uppercase"
                >
                  {badge}
                </span>
              )
            )}
          </div>

          {/* Main Headline (Matches Image 1) */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {translations[language].hero.headlinePrefix} <span className="text-[#7C3AED]">{translations[language].hero.headlineHighlight}</span>
          </h1>
        </div>

        {/* PRIMARY CENTRAL POST EDITOR & PREVIEW STUDIO (Matches Image 1 & 5) */}
        <AIPostEditorStudio
          content={editorContent}
          onChangeContent={setEditorContent}
          currentUser={currentUser}
          onOpenAIGenerate={() => setIsAIGenerateOpen(true)}
          onOpenAITouchUps={() => setIsAITouchUpsOpen(true)}
          onOpenSnippets={() => setIsSnippetsOpen(true)}
          onSaveDraft={handleSaveDraft}
          onOpenDrafts={() => setIsHistoryOpen(true)}
          language={language}
        />

        {/* FEATURES, HIGHLIGHTS, & USAGE GUIDE (Matches Image 2, 3, 4, 6, 7) */}
        <FeaturesSection
          onOpenTemplates={() => setIsTemplatesOpen(true)}
          onOpenPro={() => setIsProOpen(true)}
          language={language}
        />

        {/* MORE FREE TOOLS GRID (Matches Image 7, 8, 9) */}
        <MoreFreeToolsSection onSelectTool={handleSelectTool} language={language} />
      </main>

      {/* FOOTER CALL TO ACTION & MULTI-COLUMN SAAS FOOTER (Matches Image 10) */}
      <FooterHeroSection
        onOpenCreate={() => setIsAIGenerateOpen(true)}
        onSelectTool={handleSelectTool}
        language={language}
        onLanguageChange={(newLang) => {
          setLanguage(newLang);
          localStorage.setItem('app_lang', newLang);
        }}
      />

      {/* MODALS */}
      {/* 1. Generate with AI Modal */}
      <AIGenerateModal
        isOpen={isAIGenerateOpen}
        onClose={() => setIsAIGenerateOpen(false)}
        onGenerate={handleAIGenerate}
        templates={templates}
        isGenerating={isGenerating}
        appLanguage={language}
      />

      {/* 2. AI Touch-Ups Modal */}
      <AITouchUpsModal
        isOpen={isAITouchUpsOpen}
        onClose={() => setIsAITouchUpsOpen(false)}
        currentContent={editorContent}
        onApplyRefinedContent={(refined) => {
          setEditorContent(refined);
          showToast(isBn ? 'পোস্ট রিফাইন সম্পন্ন হয়েছে' : 'Applied AI touch-up to editor!');
        }}
        language={language}
      />

      {/* 3. Reusable Snippets Modal */}
      <SnippetsModal
        isOpen={isSnippetsOpen}
        onClose={() => setIsSnippetsOpen(false)}
        onInsertSnippet={handleInsertSnippet}
      />

      {/* 4. PRO Plan Modal */}
      <ProModal isOpen={isProOpen} onClose={() => setIsProOpen(false)} />

      {/* 5. Templates Modal */}
      <TemplateLibraryModal
        isOpen={isTemplatesOpen}
        onClose={() => setIsTemplatesOpen(false)}
        templates={templates}
        onSelectTemplate={(tmpl) => {
          handleSelectTemplate(tmpl);
          setIsTemplatesOpen(false);
        }}
        language={language}
      />

      {/* 6. Saved Drafts / History Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        posts={historyPosts}
        onSelectPost={handleSelectHistoryPost}
        onDeletePost={handleDeletePost}
        language={language}
      />

      {/* 7. Oracle DB Schema Inspector */}
      <DatabaseInspectorModal
        isOpen={isDatabaseOpen}
        onClose={() => setIsDatabaseOpen(false)}
        language={language}
      />

      {/* 8. Analytics Modal */}
      <AnalyticsModal
        isOpen={isAnalyticsOpen}
        onClose={() => setIsAnalyticsOpen(false)}
        language={language}
      />

      {/* 9. Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentUser={currentUser}
        onSuccess={handleAuthSuccess}
        onLogout={handleLogout}
        language={language}
      />

      {/* 10. Free Tools Suite Modal (All 30 tools fully operational) */}
      <FreeToolsModal
        isOpen={isFreeToolsOpen}
        onClose={() => setIsFreeToolsOpen(false)}
        initialToolName={activeFreeTool}
        onLoadIntoEditor={(text) => {
          setEditorContent(text);
          showToast(isBn ? 'কনটেন্ট এডিটরে লোড করা হয়েছে' : 'Loaded content into main editor!');
        }}
        language={language}
      />
    </div>
  );
}
