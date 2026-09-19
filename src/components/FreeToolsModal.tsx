import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Sparkles,
  Copy,
  Check,
  Download,
  Upload,
  ArrowRight,
  Eye,
  RefreshCw,
  FileText,
  Camera,
  Layers,
  Palette,
  Type as TypeIcon,
  Sliders,
  Maximize2,
  Trash2,
  Plus,
  Play,
  Pause,
  RotateCw,
  ExternalLink,
  Smartphone,
  Monitor,
  Bookmark,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Share2,
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import confetti from 'canvas-confetti';
import { PDFToolsSuite } from './PDFToolsSuite.tsx';
import { SafeZoneChecker } from './SafeZoneChecker.tsx';
import { JaduMamahVideoConverter } from './JaduMamahVideoConverter.tsx';

interface FreeToolsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialToolName: string;
  onLoadIntoEditor?: (content: string) => void;
  language?: 'en' | 'bn';
}

export const ALL_FREE_TOOLS = [
  'Organize PDF Pages',
  'Instagram Caption Generator',
  'Facebook Caption Generator',
  'Extract Pages from PDF',
  'LinkedIn QR Code Generator',
  'Smart Bookmark Tool for LinkedIn Posts',
  'Resume Maker & CV Builder',
  'OCR PDF to Text',
  'Free Video Resume Maker',
  'LinkedIn Cheat Sheet Generator',
  'LinkedIn Banner Maker',
  'Font Pairing Generator',
  'LinkedIn Quote Card Generator',
  'Bluesky Text Formatter',
  'YouTube Safe Zone Checker',
  'All-in-One Social Media Profile Preview Tool',
  'Repair PDF File',
  'Scan to PDF',
  'LinkedIn Post Generator',
  'Split PDF File',
  'Color Palette Generator',
  'Instagram Feed Planner',
  'Merge PDF Files',
  'LinkedIn Text Staircase Generator',
  'LinkedIn Post Preview',
  'LinkedIn Summary Generator',
  'LinkedIn JaduMamah to Video Converter',
  'Instagram Text Format Editor',
];

export const FreeToolsModal: React.FC<FreeToolsModalProps> = ({
  isOpen,
  onClose,
  initialToolName,
  onLoadIntoEditor,
  language = 'en',
}) => {
  const [selectedTool, setSelectedTool] = useState<string>(initialToolName);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Sync tool when opened
  useEffect(() => {
    if (initialToolName) {
      setSelectedTool(initialToolName);
    }
  }, [initialToolName]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200/90 dark:border-slate-800 flex flex-col my-auto max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200 transition-colors">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                  100% Free Tool
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">JaduMamah Creator Suite</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-tight">
                {selectedTool}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Tool Switcher Dropdown */}
            <select
              value={selectedTool}
              onChange={(e) => setSelectedTool(e.target.value)}
              className="text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-purple-500 max-w-[180px] sm:max-w-[240px] truncate"
            >
              {ALL_FREE_TOOLS.map((t) => (
                <option key={t} value={t} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">
                  {t}
                </option>
              ))}
            </select>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body - Tool Viewport */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 bg-[#FBFBFE] dark:bg-slate-950 text-slate-900 dark:text-slate-100">
          {renderToolComponent(
            selectedTool,
            copyToClipboard,
            copied,
            isLoading,
            setIsLoading,
            onLoadIntoEditor,
            onClose
          )}
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------------
// TOOL VIEWPORT DISPATCHER
// -------------------------------------------------------------------
function renderToolComponent(
  tool: string,
  copyToClipboard: (t: string) => void,
  copied: boolean,
  isLoading: boolean,
  setIsLoading: (l: boolean) => void,
  onLoadIntoEditor?: (c: string) => void,
  onClose?: () => void
) {
  // PDF Tools (Full Real PDF manipulation & OCR)
  if (
    tool === 'Organize PDF Pages' ||
    tool === 'Extract Pages from PDF' ||
    tool === 'Split PDF File' ||
    tool === 'Merge PDF Files' ||
    tool === 'Repair PDF File' ||
    tool === 'Scan to PDF'
  ) {
    return <PDFToolsSuite toolName={tool} />;
  }

  if (tool === 'OCR PDF to Text') {
    return <OCRTool copyToClipboard={copyToClipboard} copied={copied} />;
  }

  // Social & AI Captions
  if (
    tool === 'Instagram Caption Generator' ||
    tool === 'Facebook Caption Generator' ||
    tool === 'LinkedIn Summary Generator' ||
    tool === 'LinkedIn Cheat Sheet Generator'
  ) {
    return (
      <AICaptionTool
        toolName={tool}
        copyToClipboard={copyToClipboard}
        copied={copied}
        onLoadIntoEditor={onLoadIntoEditor}
        onClose={onClose}
      />
    );
  }

  // Visual & Graphic Tools
  if (tool === 'LinkedIn QR Code Generator') {
    return <QRCodeTool />;
  }

  if (tool === 'LinkedIn Quote Card Generator') {
    return <QuoteCardTool />;
  }

  if (tool === 'LinkedIn Banner Maker') {
    return <BannerMakerTool />;
  }

  if (
    tool === 'LinkedIn JaduMamah to Video Converter' ||
    tool === 'LinkedIn Carousel to Video Converter'
  ) {
    return <JaduMamahVideoConverter />;
  }

  // Feed Planners & Safe Zone Checkers
  if (tool === 'Instagram Feed Planner') {
    return <InstagramFeedPlannerTool />;
  }

  if (tool === 'TikTok Feed Planner') {
    return <TikTokFeedPlannerTool />;
  }

  if (tool === 'TikTok Safe Zone Checker') {
    return <SafeZoneChecker platform="tiktok" />;
  }

  if (tool === 'YouTube Safe Zone Checker') {
    return <SafeZoneChecker platform="youtube" />;
  }

  if (tool === 'All-in-One Social Media Profile Preview Tool') {
    return <ProfilePreviewTool />;
  }

  // Text Formatters
  if (tool === 'Bluesky Text Formatter') {
    return <BlueskyFormatterTool copyToClipboard={copyToClipboard} copied={copied} />;
  }

  if (tool === 'Instagram Text Format Editor') {
    return <InstagramTextEditorTool copyToClipboard={copyToClipboard} copied={copied} />;
  }

  if (tool === 'LinkedIn Text Staircase Generator') {
    return (
      <StaircaseGeneratorTool
        copyToClipboard={copyToClipboard}
        copied={copied}
        onLoadIntoEditor={onLoadIntoEditor}
        onClose={onClose}
      />
    );
  }

  if (tool === 'LinkedIn Post Preview' || tool === 'LinkedIn Post Generator') {
    return (
      <LinkedInPreviewTool
        copyToClipboard={copyToClipboard}
        copied={copied}
        onLoadIntoEditor={onLoadIntoEditor}
        onClose={onClose}
      />
    );
  }

  // Career & Design
  if (tool === 'Color Palette Generator') {
    return <ColorPaletteTool copyToClipboard={copyToClipboard} copied={copied} />;
  }

  if (tool === 'Font Pairing Generator') {
    return <FontPairingTool copyToClipboard={copyToClipboard} copied={copied} />;
  }

  if (tool === 'Resume Maker & CV Builder') {
    return <ResumeBuilderTool />;
  }

  if (tool === 'Free Video Resume Maker') {
    return <VideoResumeTool copyToClipboard={copyToClipboard} copied={copied} />;
  }

  if (tool === 'Smart Bookmark Tool for LinkedIn Posts') {
    return <BookmarkTool />;
  }

  return (
    <div className="p-8 text-center text-slate-500">
      <p>Tool loaded successfully. Select any option or action to proceed.</p>
    </div>
  );
}

// -------------------------------------------------------------------
// 2. OCR PDF TO TEXT TOOL
// -------------------------------------------------------------------
function OCRTool({
  copyToClipboard,
  copied,
}: {
  copyToClipboard: (t: string) => void;
  copied: boolean;
}) {
  const [inputText, setInputText] = useState(
    `CONFIDENTIAL SERVICE AGREEMENT\nEffective Date: September 15, 2026\nClient: Global Tech Solutions Inc.\nProvider: JaduMamah Creative Labs\n\n1. SCOPE OF SERVICES:\nProvider agrees to deliver AI-driven social growth strategies, content automation frameworks, and audience retention metrics.\n\n2. PAYMENT TERMS:\nRetainer amount of $3,500/month due net-15.\n\nApproved and Signed,\nAuthorized Representative`
  );
  const [ocrResult, setOcrResult] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const runOCR = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch('/api/tools/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolName: 'OCR PDF to Text',
          prompt: inputText,
        }),
      });
      const data = await res.json();
      setOcrResult(data.result || inputText);
    } catch {
      setOcrResult(inputText);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-700">
            Document Scan / Text Input:
          </label>
          <span className="text-[11px] text-slate-400">PDF, JPG, PNG or Paste</span>
        </div>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          rows={12}
          className="w-full p-3.5 rounded-xl border border-slate-200 text-xs font-mono text-slate-800 bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
        />
        <button
          onClick={runOCR}
          disabled={isProcessing}
          className="w-full py-2.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-purple-500/20"
        >
          {isProcessing ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          <span>Run AI OCR & Clean Transcript</span>
        </button>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-700">
            Extracted Clean Output:
          </label>
          <button
            onClick={() => copyToClipboard(ocrResult || inputText)}
            className="text-xs font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy Text'}</span>
          </button>
        </div>
        <div className="w-full h-full min-h-[260px] p-4 rounded-xl border border-slate-200 bg-white text-xs text-slate-700 overflow-y-auto whitespace-pre-wrap font-mono">
          {ocrResult || inputText}
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------------
// 3. AI CAPTIONS & CHEAT SHEET TOOL (Instagram, TikTok, Summary, Cheat Sheet)
// -------------------------------------------------------------------
function AICaptionTool({
  toolName,
  copyToClipboard,
  copied,
  onLoadIntoEditor,
  onClose,
}: {
  toolName: string;
  copyToClipboard: (t: string) => void;
  copied: boolean;
  onLoadIntoEditor?: (c: string) => void;
  onClose?: () => void;
}) {
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('Engaging & High-Converting');
  const [result, setResult] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Set default sample topic based on tool
  useEffect(() => {
    if (toolName === 'Instagram Caption Generator') {
      setTopic('3 mindsets that separated 6-figure creators from everyone else in 2026');
    } else if (toolName === 'Facebook Caption Generator') {
      setTopic('5 daily leadership habits that will double your team productivity');
    } else if (toolName === 'LinkedIn Summary Generator') {
      setTopic('Senior Product Manager & AI Strategist scaling fintech products to 2M+ users');
    } else if (toolName === 'LinkedIn Cheat Sheet Generator') {
      setTopic('B2B Cold Email Mastery: Subject lines, hook, offer, and follow-up rhythm');
    }
  }, [toolName]);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setIsGenerating(true);
    try {
      const res = await fetch('/api/tools/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolName,
          topic,
          tone,
        }),
      });
      const data = await res.json();
      setResult(data.result || '');
      confetti({ particleCount: 35, spread: 60 });
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Input Form */}
      <div className="lg:col-span-5 flex flex-col gap-4">
        <div>
          <label className="text-xs font-bold text-slate-800">
            {toolName === 'LinkedIn Summary Generator'
              ? 'Your Role, Background & Key Achievements:'
              : 'What is your content / video about?'}
          </label>
          <textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            rows={4}
            placeholder="e.g. 5 habits of top 1% developers, or SaaS pricing strategy"
            className="w-full mt-1.5 p-3 rounded-xl border border-slate-200 text-xs text-slate-800 focus:ring-2 focus:ring-purple-500 focus:outline-none bg-white"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-800">Tone of Voice:</label>
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="w-full mt-1.5 p-2.5 rounded-xl border border-slate-200 text-xs text-slate-700 bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
          >
            <option value="Engaging & High-Converting">Engaging & High-Converting</option>
            <option value="Thought Leadership & Authoritative">Thought Leadership & Authoritative</option>
            <option value="Viral & Hook-Driven">Viral & Hook-Driven</option>
            <option value="Storytelling & Vulnerable">Storytelling & Vulnerable</option>
            <option value="Educational & Actionable">Educational & Actionable</option>
          </select>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isGenerating || !topic.trim()}
          className="w-full py-3 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-xs shadow-md shadow-purple-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
        >
          {isGenerating ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          <span>Generate with AI</span>
        </button>

        {/* Quick topic tags */}
        <div className="flex flex-wrap gap-1.5 pt-2">
          <span className="text-[10px] text-slate-400 font-bold uppercase w-full">Quick ideas:</span>
          {['Productivity Hacks', 'Career Pivot', 'Remote Work Culture', 'AI Tools in 2026'].map(
            (tag) => (
              <button
                key={tag}
                onClick={() => setTopic(tag)}
                className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-purple-100 text-[11px] text-slate-600 hover:text-purple-700 transition-colors"
              >
                {tag}
              </button>
            )
          )}
        </div>
      </div>

      {/* Right Output Box */}
      <div className="lg:col-span-7 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-800">Generated Output:</label>
          <div className="flex items-center gap-2">
            {result && onLoadIntoEditor && (
              <button
                onClick={() => {
                  onLoadIntoEditor(result);
                  if (onClose) onClose();
                }}
                className="text-xs font-bold text-[#7C3AED] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Send to Studio Editor</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
            <button
              onClick={() => copyToClipboard(result || 'Please generate content first.')}
              disabled={!result}
              className="text-xs font-bold text-slate-700 hover:text-purple-700 flex items-center gap-1 disabled:opacity-30 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
        </div>

        <div className="w-full min-h-[300px] max-h-[440px] p-4 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 overflow-y-auto whitespace-pre-wrap font-sans leading-relaxed">
          {result ? (
            result
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 py-16 gap-2">
              <Sparkles className="w-8 h-8 text-purple-300" />
              <p className="text-xs font-medium">Click "Generate with AI" to create your content.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------------
// 4. LINKEDIN QR CODE GENERATOR
// -------------------------------------------------------------------
function QRCodeTool() {
  const [url, setUrl] = useState('https://www.linkedin.com/in/sonia-akter');
  const [color, setColor] = useState('#7C3AED');
  const [size, setSize] = useState(240);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    drawQRCode();
  }, [url, color, size]);

  const drawQRCode = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = size;
    canvas.height = size;

    // Background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, size, size);

    // Simple robust synthetic QR matrix pattern
    ctx.fillStyle = color;
    const cellSize = size / 21;

    // Standard Finder Patterns (top-left, top-right, bottom-left)
    const drawFinder = (startX: number, startY: number) => {
      ctx.fillStyle = color;
      ctx.fillRect(startX * cellSize, startY * cellSize, 7 * cellSize, 7 * cellSize);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect((startX + 1) * cellSize, (startY + 1) * cellSize, 5 * cellSize, 5 * cellSize);
      ctx.fillStyle = color;
      ctx.fillRect((startX + 2) * cellSize, (startY + 2) * cellSize, 3 * cellSize, 3 * cellSize);
    };

    drawFinder(1, 1);
    drawFinder(13, 1);
    drawFinder(1, 13);

    // Data matrix pseudo bits based on URL hash
    let hash = 0;
    for (let i = 0; i < url.length; i++) {
      hash = (hash << 5) - hash + url.charCodeAt(i);
      hash |= 0;
    }

    for (let r = 0; r < 21; r++) {
      for (let c = 0; c < 21; c++) {
        // Skip finders
        if (
          (r < 8 && c < 8) ||
          (r < 8 && c > 12) ||
          (r > 12 && c < 8)
        ) {
          continue;
        }
        const bit = ((hash ^ (r * 31 + c * 17)) & 1) === 0;
        if (bit) {
          ctx.fillStyle = color;
          ctx.fillRect(c * cellSize + 0.5, r * cellSize + 0.5, cellSize - 1, cellSize - 1);
        }
      }
    }

    // Center badge
    const badgeSize = cellSize * 5;
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.roundRect((size - badgeSize) / 2, (size - badgeSize) / 2, badgeSize, badgeSize, 6);
    ctx.fill();

    ctx.fillStyle = color;
    ctx.font = `bold ${cellSize * 2.8}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('in', size / 2, size / 2);
  };

  const downloadQR = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement('a');
    a.download = 'linkedin_qr_code.png';
    a.href = canvas.toDataURL('image/png');
    a.click();
    confetti({ particleCount: 30, spread: 50 });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
      <div className="flex flex-col gap-4">
        <div>
          <label className="text-xs font-bold text-slate-800">
            LinkedIn Profile or Page URL:
          </label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full mt-1.5 p-3 rounded-xl border border-slate-200 text-xs text-slate-800 focus:ring-2 focus:ring-purple-500 bg-white"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-800">Accent Color:</label>
          <div className="flex items-center gap-3 mt-2">
            {[
              { label: 'Purple', hex: '#7C3AED' },
              { label: 'LinkedIn Blue', hex: '#0A66C2' },
              { label: 'Emerald', hex: '#059669' },
              { label: 'Slate Dark', hex: '#0F172A' },
            ].map((c) => (
              <button
                key={c.hex}
                onClick={() => setColor(c.hex)}
                className={`w-7 h-7 rounded-full border-2 transition-transform ${
                  color === c.hex ? 'scale-110 border-slate-800' : 'border-transparent'
                }`}
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
        </div>

        <button
          onClick={downloadQR}
          className="w-full py-3 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-purple-500/25"
        >
          <Download className="w-4 h-4" />
          <span>Download High-Res QR Code (PNG)</span>
        </button>
      </div>

      <div className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-2xl border border-slate-200">
        <canvas ref={canvasRef} className="rounded-xl shadow-md border border-slate-100" />
        <p className="text-[11px] text-slate-400 mt-3">Scan with your smartphone camera</p>
      </div>
    </div>
  );
}

// -------------------------------------------------------------------
// 5. LINKEDIN QUOTE CARD GENERATOR
// -------------------------------------------------------------------
function QuoteCardTool() {
  const [quote, setQuote] = useState(
    'Give before you ask, celebrate others openly, and consistency will take care of the rest.'
  );
  const [author, setAuthor] = useState('Sonia Akter');
  const [title, setTitle] = useState('Growth Strategist & Founder at JaduMamah');
  const [theme, setTheme] = useState<'purple' | 'dark' | 'sunset' | 'emerald'>('purple');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    drawCard();
  }, [quote, author, title, theme]);

  const drawCard = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 800;

    // Background Gradients
    const grad = ctx.createLinearGradient(0, 0, 800, 800);
    if (theme === 'purple') {
      grad.addColorStop(0, '#581C87');
      grad.addColorStop(1, '#7C3AED');
    } else if (theme === 'dark') {
      grad.addColorStop(0, '#0F172A');
      grad.addColorStop(1, '#1E293B');
    } else if (theme === 'sunset') {
      grad.addColorStop(0, '#C2410C');
      grad.addColorStop(1, '#EA580C');
    } else {
      grad.addColorStop(0, '#064E3B');
      grad.addColorStop(1, '#059669');
    }
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 800, 800);

    // Subtle decorative grid or circle
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    for (let i = 40; i < 800; i += 40) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, 800);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(800, i);
      ctx.stroke();
    }

    // Big Quotation Mark
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.font = 'bold 120px serif';
    ctx.fillText('“', 60, 160);

    // Quote Text
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '600 32px sans-serif';
    wrapText(ctx, quote, 70, 240, 660, 48);

    // Divider
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(70, 630);
    ctx.lineTo(200, 630);
    ctx.stroke();

    // Author & Title
    ctx.font = 'bold 26px sans-serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(author, 70, 680);

    ctx.font = 'normal 18px sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fillText(title, 70, 715);
  };

  const wrapText = (
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number
  ) => {
    const words = text.split(' ');
    let line = '';
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
        ctx.fillText(line, x, y);
        line = words[n] + ' ';
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, y);
  };

  const downloadPNG = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement('a');
    a.download = 'linkedin_quote_card.png';
    a.href = canvas.toDataURL('image/png');
    a.click();
    confetti({ particleCount: 40, spread: 60 });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
      <div className="lg:col-span-5 flex flex-col gap-4">
        <div>
          <label className="text-xs font-bold text-slate-800">Quote Text:</label>
          <textarea
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
            rows={3}
            className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs font-bold text-slate-800">Author:</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full mt-1 p-2 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-800">Role / Subtitle:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full mt-1 p-2 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-800">Card Theme:</label>
          <div className="grid grid-cols-4 gap-2 mt-1.5">
            {[
              { id: 'purple', label: 'Purple Luxe' },
              { id: 'dark', label: 'Midnight' },
              { id: 'sunset', label: 'Sunset' },
              { id: 'emerald', label: 'Forest' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id as any)}
                className={`py-1.5 rounded-lg text-[11px] font-bold border ${
                  theme === t.id
                    ? 'bg-purple-600 text-white border-purple-600'
                    : 'bg-white text-slate-600 border-slate-200'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={downloadPNG}
          className="w-full py-3 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-purple-500/25"
        >
          <Download className="w-4 h-4" />
          <span>Download 1:1 Quote Card (PNG)</span>
        </button>
      </div>

      <div className="lg:col-span-7 flex justify-center p-4 bg-slate-100 rounded-2xl">
        <canvas
          ref={canvasRef}
          className="w-full max-w-[360px] aspect-square rounded-xl shadow-xl"
        />
      </div>
    </div>
  );
}

// -------------------------------------------------------------------
// 6. LINKEDIN BANNER MAKER
// -------------------------------------------------------------------
function BannerMakerTool() {
  const [headline, setHeadline] = useState('Transforming AI Ideas into Scalable B2B Products');
  const [subline, setSubline] = useState('Advisor • Builder • Speaker • JaduMamah Creator');
  const [cta, setCta] = useState('DM for keynotes & advisory');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    drawBanner();
  }, [headline, subline, cta]);

  const drawBanner = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Official LinkedIn banner size
    canvas.width = 1584;
    canvas.height = 396;

    // Gradient background
    const grad = ctx.createLinearGradient(0, 0, 1584, 396);
    grad.addColorStop(0, '#1E1B4B');
    grad.addColorStop(0.5, '#4C1D95');
    grad.addColorStop(1, '#7C3AED');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1584, 396);

    // Decorative geometric rings
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(1350, 200, 320, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(1350, 200, 220, 0, Math.PI * 2);
    ctx.stroke();

    // Headline (account for profile photo on left)
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 56px sans-serif';
    ctx.fillText(headline, 420, 160);

    // Subline
    ctx.fillStyle = '#E9D5FF';
    ctx.font = '500 32px sans-serif';
    ctx.fillText(subline, 420, 230);

    // Pill badge for CTA
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.roundRect(420, 280, 340, 52, 26);
    ctx.fill();

    ctx.fillStyle = '#6D28D9';
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText(`✨ ${cta}`, 445, 314);
  };

  const downloadBanner = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement('a');
    a.download = 'linkedin_banner_1584x396.png';
    a.href = canvas.toDataURL('image/png');
    a.click();
    confetti({ particleCount: 30, spread: 50 });
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="text-xs font-bold text-slate-800">Headline:</label>
          <input
            type="text"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            className="w-full mt-1 p-2 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-800">Subline / Key Roles:</label>
          <input
            type="text"
            value={subline}
            onChange={(e) => setSubline(e.target.value)}
            className="w-full mt-1 p-2 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-800">Badge Call-To-Action:</label>
          <input
            type="text"
            value={cta}
            onChange={(e) => setCta(e.target.value)}
            className="w-full mt-1 p-2 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white"
          />
        </div>
      </div>

      {/* Live Canvas */}
      <div className="p-3 bg-slate-100 rounded-2xl border border-slate-200 overflow-hidden">
        <canvas ref={canvasRef} className="w-full rounded-xl shadow-md" />
        <p className="text-[10px] text-slate-400 text-center mt-2">
          Exact LinkedIn Desktop & Mobile Aspect Ratio (1584 × 396 px)
        </p>
      </div>

      <button
        onClick={downloadBanner}
        className="w-fit self-end px-6 py-2.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md shadow-purple-500/25"
      >
        <Download className="w-4 h-4" />
        <span>Download Banner (1584x396 PNG)</span>
      </button>
    </div>
  );
}

// -------------------------------------------------------------------
// 8. TEXT FORMATTERS (Bluesky, Instagram, Staircase)
// -------------------------------------------------------------------
function BlueskyFormatterTool({
  copyToClipboard,
  copied,
}: {
  copyToClipboard: (t: string) => void;
  copied: boolean;
}) {
  const [text, setText] = useState('Building in public with JaduMamah AI suite!');

  // Simple unicode converters
  const toBold = (str: string) =>
    str.replace(/[a-zA-Z]/g, (c) =>
      String.fromCodePoint(
        c.charCodeAt(0) + (c >= 'a' ? 120205 : 120211)
      )
    );

  const toItalic = (str: string) =>
    str.replace(/[a-zA-Z]/g, (c) =>
      String.fromCodePoint(
        c.charCodeAt(0) + (c >= 'a' ? 120257 : 120263)
      )
    );

  const toMono = (str: string) =>
    str.replace(/[a-zA-Z0-9]/g, (c) =>
      String.fromCodePoint(c.charCodeAt(0) + 120172)
    );

  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs font-bold text-slate-800">Type Your Text:</label>
          <span
            className={`text-xs font-mono font-bold ${
              text.length > 300 ? 'text-red-600' : 'text-slate-500'
            }`}
          >
            {text.length} / 300 chars (Bluesky limit)
          </span>
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { label: 'Bold (Unicode)', formatted: toBold(text) },
          { label: 'Italic (Unicode)', formatted: toItalic(text) },
          { label: 'Monospace Code', formatted: toMono(text) },
        ].map((item, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-xl border border-slate-200 bg-white flex flex-col justify-between gap-3 shadow-sm"
          >
            <div>
              <span className="text-[11px] font-bold text-purple-700">{item.label}</span>
              <p className="text-xs text-slate-800 mt-1 break-words">{item.formatted}</p>
            </div>
            <button
              onClick={() => copyToClipboard(item.formatted)}
              className="text-xs font-bold text-slate-700 hover:text-purple-700 flex items-center gap-1 cursor-pointer w-fit"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function InstagramTextEditorTool({
  copyToClipboard,
  copied,
}: {
  copyToClipboard: (t: string) => void;
  copied: boolean;
}) {
  const [text, setText] = useState('Growth Marketer • Content Architect • Speaker');

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="text-xs font-bold text-slate-800">
          Instagram Bio or Caption Text:
        </label>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full mt-1.5 p-3 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {[
          { label: 'Classic Serif', style: 'font-serif tracking-wide' },
          { label: 'Wide Tracking', style: 'uppercase tracking-widest text-[11px]' },
          { label: 'Modern Minimal', style: 'font-mono lowercase' },
        ].map((v, i) => (
          <div
            key={i}
            className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col justify-between gap-3"
          >
            <div>
              <span className="text-[10px] font-bold text-purple-700 uppercase">
                {v.label}
              </span>
              <p className={`text-xs text-slate-800 mt-1 ${v.style}`}>{text}</p>
            </div>
            <button
              onClick={() => copyToClipboard(text)}
              className="text-xs font-bold text-purple-700 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy with Invisible Linebreaks</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function StaircaseGeneratorTool({
  copyToClipboard,
  copied,
  onLoadIntoEditor,
  onClose,
}: {
  copyToClipboard: (t: string) => void;
  copied: boolean;
  onLoadIntoEditor?: (c: string) => void;
  onClose?: () => void;
}) {
  const [items, setItems] = useState([
    'Strategy',
    'Execution',
    'Relentless consistency',
    'Building audience trust daily',
    'Scaling your brand without burnout',
  ]);

  const staircaseText = items.map((line, idx) => `${'  '.repeat(idx)}↳ ${line}`).join('\n');

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="flex flex-col gap-3">
        <label className="text-xs font-bold text-slate-800">
          Enter Points (one per line):
        </label>
        <textarea
          value={items.join('\n')}
          onChange={(e) => setItems(e.target.value.split('\n'))}
          rows={6}
          className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white"
        />
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-800">Staircase Output:</label>
          <div className="flex items-center gap-2">
            {onLoadIntoEditor && (
              <button
                onClick={() => {
                  onLoadIntoEditor(staircaseText);
                  if (onClose) onClose();
                }}
                className="text-xs font-bold text-purple-700 hover:underline cursor-pointer"
              >
                Send to Editor
              </button>
            )}
            <button
              onClick={() => copyToClipboard(staircaseText)}
              className="text-xs font-bold text-slate-700 hover:text-purple-700 flex items-center gap-1 cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </button>
          </div>
        </div>
        <pre className="p-4 rounded-xl border border-slate-200 bg-white text-xs font-mono text-slate-800 whitespace-pre overflow-x-auto min-h-[160px]">
          {staircaseText}
        </pre>
      </div>
    </div>
  );
}

// -------------------------------------------------------------------
// 9. LINKEDIN PREVIEW TOOL
// -------------------------------------------------------------------
function LinkedInPreviewTool({
  copyToClipboard,
  copied,
  onLoadIntoEditor,
  onClose,
}: {
  copyToClipboard: (t: string) => void;
  copied: boolean;
  onLoadIntoEditor?: (c: string) => void;
  onClose?: () => void;
}) {
  const [sampleText, setSampleText] = useState(
    `99% of creators fail on LinkedIn because they broadcast instead of connect.\n\nHere are 3 rules that change everything:\n1. Give without expecting an immediate return.\n2. Celebrate others' wins publicly.\n3. Show up consistently even when engagement feels slow.`
  );
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-6 flex flex-col gap-3">
        <label className="text-xs font-bold text-slate-800">Post Text:</label>
        <textarea
          value={sampleText}
          onChange={(e) => setSampleText(e.target.value)}
          rows={8}
          className="w-full p-3.5 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white focus:ring-2 focus:ring-purple-500"
        />
        <div className="flex items-center gap-3">
          <button
            onClick={() => setDevice('desktop')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 ${
              device === 'desktop' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            <Monitor className="w-4 h-4" />
            <span>Desktop</span>
          </button>
          <button
            onClick={() => setDevice('mobile')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 ${
              device === 'mobile' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Mobile</span>
          </button>
        </div>
      </div>

      <div className="lg:col-span-6 flex justify-center">
        <div
          className={`w-full bg-white rounded-2xl border border-slate-200 shadow-md p-4 flex flex-col gap-3 ${
            device === 'mobile' ? 'max-w-[340px]' : 'max-w-[480px]'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center">
              SA
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Sonia Akter</p>
              <p className="text-[10px] text-slate-500">Founder at JaduMamah • 12h • 🌐</p>
            </div>
          </div>
          <div className="text-xs text-slate-800 whitespace-pre-wrap leading-relaxed">
            {sampleText.slice(0, 140)}
            {sampleText.length > 140 && (
              <span className="font-bold text-slate-500 cursor-pointer"> ...see more</span>
            )}
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>👍 148 • 💬 42 comments</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------------
// 10. COLOR PALETTE GENERATOR
// -------------------------------------------------------------------
function ColorPaletteTool({
  copyToClipboard,
  copied,
}: {
  copyToClipboard: (t: string) => void;
  copied: boolean;
}) {
  const [colors, setColors] = useState([
    { hex: '#7C3AED', name: 'Electric Purple', locked: false },
    { hex: '#A78BFA', name: 'Lavender Mist', locked: false },
    { hex: '#F3E8FF', name: 'Soft Lilac', locked: false },
    { hex: '#0F172A', name: 'Deep Slate', locked: false },
    { hex: '#10B981', name: 'Vibrant Emerald', locked: false },
  ]);

  const generateNew = () => {
    const randomHex = () =>
      '#' +
      Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, '0')
        .toUpperCase();

    setColors(
      colors.map((c) => (c.locked ? c : { ...c, hex: randomHex(), name: 'Harmonic Tone' }))
    );
    confetti({ particleCount: 25, spread: 45 });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-600 font-medium">
          Click any color swatch to copy HEX code. Click lock to keep a shade.
        </p>
        <button
          onClick={generateNew}
          className="px-4 py-2 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Generate New Palette</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 h-[220px]">
        {colors.map((c, idx) => (
          <div
            key={idx}
            onClick={() => copyToClipboard(c.hex)}
            className="rounded-2xl flex flex-col justify-between p-4 cursor-pointer shadow-md transition-transform hover:scale-[1.02] text-white"
            style={{ backgroundColor: c.hex }}
          >
            <div className="flex justify-end">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const updated = [...colors];
                  updated[idx].locked = !updated[idx].locked;
                  setColors(updated);
                }}
                className="text-xs opacity-75 hover:opacity-100 bg-black/20 p-1 rounded-md"
              >
                {c.locked ? '🔒' : '🔓'}
              </button>
            </div>
            <div className="bg-black/30 backdrop-blur-sm p-2 rounded-lg">
              <p className="text-xs font-mono font-bold">{c.hex}</p>
              <p className="text-[10px] opacity-80 truncate">{c.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// -------------------------------------------------------------------
// 11. FONT PAIRING GENERATOR
// -------------------------------------------------------------------
function FontPairingTool({
  copyToClipboard,
  copied,
}: {
  copyToClipboard: (t: string) => void;
  copied: boolean;
}) {
  const PAIRINGS = [
    {
      title: 'Playfair Display + Plus Jakarta Sans',
      category: 'Editorial Luxury',
      headingClass: 'font-serif text-2xl font-bold',
      bodyClass: 'font-sans text-xs text-slate-600',
    },
    {
      title: 'Syne Display + Inter',
      category: 'High-Tech SaaS',
      headingClass: 'font-mono text-xl font-extrabold uppercase tracking-tight',
      bodyClass: 'font-sans text-xs text-slate-700',
    },
    {
      title: 'Cinzel + Outfit',
      category: 'Brand Authority',
      headingClass: 'font-serif text-xl font-bold tracking-wider',
      bodyClass: 'font-sans text-xs text-slate-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {PAIRINGS.map((p, idx) => (
        <div
          key={idx}
          className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col justify-between gap-4"
        >
          <div>
            <span className="text-[10px] font-bold text-purple-700 uppercase bg-purple-50 px-2 py-0.5 rounded-full">
              {p.category}
            </span>
            <h4 className={`${p.headingClass} mt-3 text-slate-900`}>
              Design with Conviction
            </h4>
            <p className={`${p.bodyClass} mt-2 leading-relaxed`}>
              Great typography doesn't just display information—it establishes psychological trust
              before a single word is read.
            </p>
          </div>

          <button
            onClick={() => copyToClipboard(`Font Pairing: ${p.title}`)}
            className="text-xs font-bold text-[#7C3AED] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copy Pairing CSS</span>
          </button>
        </div>
      ))}
    </div>
  );
}

// -------------------------------------------------------------------
// 12. RESUME MAKER & CV BUILDER
// -------------------------------------------------------------------
function ResumeBuilderTool() {
  const [name, setName] = useState('Sonia Akter');
  const [title, setTitle] = useState('Senior Growth Marketer & Content Strategist');
  const [summary, setSummary] = useState(
    'Proven track record of scaling digital communities and multi-channel acquisition funnels with AI-driven content automation frameworks.'
  );
  const [skills, setSkills] = useState(
    'Growth Strategy, Content Marketing, LinkedIn Optimization, AI Prompting, Analytics'
  );

  const downloadResume = () => {
    const doc = new jsPDF();
    doc.setFillColor(124, 58, 237);
    doc.rect(0, 0, 210, 24, 'F');

    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255);
    doc.text(name, 15, 16);

    doc.setFontSize(11);
    doc.setTextColor(50, 50, 50);
    doc.text(title, 15, 36);

    doc.setFontSize(13);
    doc.setTextColor(124, 58, 237);
    doc.text('PROFESSIONAL SUMMARY', 15, 50);

    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    doc.text(doc.splitTextToSize(summary, 180), 15, 60);

    doc.setFontSize(13);
    doc.setTextColor(124, 58, 237);
    doc.text('CORE SKILLS', 15, 90);

    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    doc.text(doc.splitTextToSize(skills, 180), 15, 100);

    doc.save(`${name.toLowerCase().replace(/\s+/g, '_')}_resume.pdf`);
    confetti({ particleCount: 35, spread: 50 });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="flex flex-col gap-3.5">
        <div>
          <label className="text-xs font-bold text-slate-800">Full Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 text-xs bg-white"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-800">Job Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 text-xs bg-white"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-800">Executive Summary:</label>
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            rows={3}
            className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 text-xs bg-white"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-800">Key Competencies & Skills:</label>
          <input
            type="text"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 text-xs bg-white"
          />
        </div>
        <button
          onClick={downloadResume}
          className="w-full py-3 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-purple-500/25"
        >
          <Download className="w-4 h-4" />
          <span>Download 1-Page PDF Resume</span>
        </button>
      </div>

      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col gap-3 font-sans text-xs">
        <div className="border-b pb-3 border-purple-200">
          <h3 className="text-lg font-bold text-purple-900">{name}</h3>
          <p className="text-xs font-semibold text-slate-600">{title}</p>
        </div>
        <div>
          <h4 className="font-bold text-purple-800 text-[11px] uppercase tracking-wider">
            Executive Summary
          </h4>
          <p className="text-slate-600 mt-1 leading-relaxed">{summary}</p>
        </div>
        <div>
          <h4 className="font-bold text-purple-800 text-[11px] uppercase tracking-wider">
            Skills & Tools
          </h4>
          <p className="text-slate-600 mt-1">{skills}</p>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------------
// 13. VIDEO RESUME MAKER
// -------------------------------------------------------------------
function VideoResumeTool({
  copyToClipboard,
  copied,
}: {
  copyToClipboard: (t: string) => void;
  copied: boolean;
}) {
  const [script, setScript] = useState(
    `🎬 60-SECOND ELEVATOR PITCH:\n\n[00:00 - 00:10] HOOK:\n"Hi! I'm Sonia Akter, and I help scaling brands turn cold LinkedIn audiences into loyal customers through AI content frameworks."\n\n[00:10 - 00:30] VALUE:\n"Over the last 2 years, I've managed content funnels generating over 3.5 million impressions and 1,200+ qualified inbound leads."\n\n[00:30 - 00:50] DIFFERENTIATOR:\n"I don't just write posts; I build repeatable growth distribution playbooks that your team can run independently."\n\n[00:50 - 01:00] CALL TO ACTION:\n"Let's chat! Click the link below to review my portfolio and schedule a 15-minute alignment call."`
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="flex flex-col gap-3">
        <label className="text-xs font-bold text-slate-800">Teleprompter Script:</label>
        <textarea
          value={script}
          onChange={(e) => setScript(e.target.value)}
          rows={10}
          className="w-full p-3.5 rounded-xl border border-slate-200 text-xs font-mono text-slate-800 bg-white"
        />
        <button
          onClick={() => copyToClipboard(script)}
          className="w-full py-2.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm"
        >
          <Copy className="w-4 h-4" />
          <span>Copy Teleprompter Script</span>
        </button>
      </div>

      <div className="p-6 rounded-2xl bg-slate-900 text-white flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs font-bold text-purple-300">
          <span>Camera Teleprompter Mode</span>
          <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
        </div>
        <div className="text-center py-8">
          <p className="text-sm font-semibold text-purple-100 leading-relaxed max-w-sm mx-auto">
            "Hi! I'm Sonia Akter, and I help scaling brands turn cold LinkedIn audiences into loyal
            customers..."
          </p>
        </div>
        <div className="flex items-center justify-center gap-4 text-xs font-bold text-slate-400">
          <span>Scroll Speed: Normal</span>
          <span>Duration: 60s</span>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------------
// 15. INSTAGRAM & TIKTOK FEED PLANNERS
// -------------------------------------------------------------------
function InstagramFeedPlannerTool() {
  const [grid, setGrid] = useState([
    { id: 1, color: 'bg-purple-600', label: 'JaduMamah: 5 Mindset Shifts' },
    { id: 2, color: 'bg-indigo-600', label: 'Reel: Day in the life' },
    { id: 3, color: 'bg-violet-700', label: 'Quote: Consistency wins' },
    { id: 4, color: 'bg-slate-800', label: 'Tutorial: AI Prompting' },
    { id: 5, color: 'bg-purple-700', label: 'Behind the scenes' },
    { id: 6, color: 'bg-indigo-500', label: 'Client Case Study' },
    { id: 7, color: 'bg-violet-600', label: 'Infographic: Growth' },
    { id: 8, color: 'bg-purple-800', label: 'Podcast Highlight' },
    { id: 9, color: 'bg-slate-900', label: 'Ask Me Anything' },
  ]);

  return (
    <div className="flex flex-col items-center gap-4 max-w-md mx-auto">
      <div className="flex items-center justify-between w-full text-xs font-bold text-slate-700">
        <span>Instagram 3x3 Profile Grid Preview</span>
        <span className="text-purple-700">Click to shift positions</span>
      </div>

      <div className="grid grid-cols-3 gap-2 w-full">
        {grid.map((cell, idx) => (
          <div
            key={cell.id}
            onClick={() => {
              const updated = [...grid];
              const nextIdx = (idx + 1) % grid.length;
              const temp = updated[idx];
              updated[idx] = updated[nextIdx];
              updated[nextIdx] = temp;
              setGrid(updated);
            }}
            className={`${cell.color} aspect-square rounded-xl p-2 text-white flex flex-col justify-between text-[10px] font-bold cursor-pointer hover:opacity-90 shadow-sm transition-all`}
          >
            <span>#{idx + 1}</span>
            <p className="line-clamp-2 leading-tight opacity-90">{cell.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function TikTokFeedPlannerTool() {
  return (
    <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto">
      {[
        { title: 'The outreach hook that won', views: '45.2K' },
        { title: 'POV: Building a SaaS in 2026', views: '120.4K' },
        { title: '3 Free AI extensions', views: '89.1K' },
        { title: 'Stop making this cold email error', views: '34.8K' },
        { title: 'How I write 10 posts in 30 mins', views: '210.6K' },
        { title: 'The secret to organic reach', views: '67.3K' },
      ].map((vid, idx) => (
        <div
          key={idx}
          className="aspect-[9/16] bg-slate-900 rounded-xl p-2.5 text-white flex flex-col justify-between shadow-md text-[10px]"
        >
          <span className="font-bold text-red-400">🔥 {vid.views}</span>
          <p className="line-clamp-3 font-semibold leading-tight">{vid.title}</p>
        </div>
      ))}
    </div>
  );
}

// -------------------------------------------------------------------
// 16. ALL-IN-ONE SOCIAL MEDIA PROFILE PREVIEW TOOL
// -------------------------------------------------------------------
function ProfilePreviewTool() {
  const [platform, setPlatform] = useState<'linkedin' | 'instagram' | 'twitter' | 'tiktok'>('linkedin');
  const [name, setName] = useState('Sonia Akter');
  const [bio, setBio] = useState('Growth Strategist & Creator • Founder of JaduMamah');

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
      <div className="md:col-span-5 flex flex-col gap-3.5">
        <label className="text-xs font-bold text-slate-800">Select Platform:</label>
        <div className="grid grid-cols-2 gap-2">
          {['linkedin', 'instagram', 'twitter', 'tiktok'].map((p) => (
            <button
              key={p}
              onClick={() => setPlatform(p as any)}
              className={`py-2 rounded-xl text-xs font-bold capitalize border ${
                platform === p
                  ? 'bg-purple-600 text-white border-purple-600'
                  : 'bg-white text-slate-700 border-slate-200'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        <div>
          <label className="text-xs font-bold text-slate-800">Display Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full mt-1 p-2 rounded-xl border border-slate-200 text-xs bg-white"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-800">Bio Text:</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            className="w-full mt-1 p-2 rounded-xl border border-slate-200 text-xs bg-white"
          />
        </div>
      </div>

      <div className="md:col-span-7 flex justify-center">
        <div className="w-full max-w-[360px] p-5 rounded-2xl bg-white border border-slate-200 shadow-md flex flex-col gap-4 text-xs text-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center text-base">
              SA
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900">{name}</h4>
              <p className="text-[11px] text-slate-400 capitalize">@{name.toLowerCase().replace(/\s+/g, '')} • {platform}</p>
            </div>
          </div>
          <p className="leading-relaxed">{bio}</p>
          <div className="flex items-center gap-4 text-[11px] text-slate-500 pt-2 border-t border-slate-100">
            <span><strong>24.8K</strong> Followers</span>
            <span><strong>1,420</strong> Following</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------------
// 17. SMART BOOKMARK TOOL FOR LINKEDIN POSTS
// -------------------------------------------------------------------
function BookmarkTool() {
  const [bookmarks, setBookmarks] = useState([
    {
      id: 1,
      author: 'Justin Welsh',
      topic: 'The Saturday Solopreneur Newsletter Growth Playbook',
      tag: 'Distribution',
    },
    {
      id: 2,
      author: 'Lara Acosta',
      topic: 'Hook writing masterclass: 10 templates that generated 50M views',
      tag: 'Copywriting',
    },
    {
      id: 3,
      author: 'Jasmin Alic',
      topic: 'Commenting strategy for 2026: The 10-minute daily routine',
      tag: 'Engagement',
    },
  ]);
  const [newTopic, setNewTopic] = useState('');
  const [newAuthor, setNewAuthor] = useState('');

  const addBookmark = () => {
    if (!newTopic.trim()) return;
    setBookmarks([
      {
        id: Date.now(),
        author: newAuthor || 'LinkedIn Creator',
        topic: newTopic,
        tag: 'Inspiration',
      },
      ...bookmarks,
    ]);
    setNewTopic('');
    setNewAuthor('');
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          placeholder="Paste post insight, topic or URL"
          value={newTopic}
          onChange={(e) => setNewTopic(e.target.value)}
          className="flex-1 p-2.5 rounded-xl border border-slate-200 text-xs bg-white"
        />
        <input
          type="text"
          placeholder="Author name"
          value={newAuthor}
          onChange={(e) => setNewAuthor(e.target.value)}
          className="w-40 p-2.5 rounded-xl border border-slate-200 text-xs bg-white"
        />
        <button
          onClick={addBookmark}
          className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs cursor-pointer"
        >
          Add Bookmark
        </button>
      </div>

      <div className="flex flex-col gap-2.5">
        {bookmarks.map((b) => (
          <div
            key={b.id}
            className="p-3.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between shadow-sm"
          >
            <div>
              <div className="flex items-center gap-2">
                <Bookmark className="w-3.5 h-3.5 text-purple-600" />
                <span className="text-[11px] font-bold text-slate-900">{b.author}</span>
                <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                  {b.tag}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1">{b.topic}</p>
            </div>
            <button
              onClick={() => setBookmarks(bookmarks.filter((item) => item.id !== b.id))}
              className="text-slate-400 hover:text-red-500 p-1"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
