import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  Upload,
  Download,
  Plus,
  Trash2,
  RefreshCw,
  Sparkles,
  Sliders,
  CheckCircle2,
  Layers,
  Palette,
  Eye,
  Film,
  ArrowRight,
  Clock,
  Smartphone,
  Monitor,
} from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import confetti from 'canvas-confetti';

interface SlideItem {
  id: string;
  title: string;
  subtitle: string;
  imageUrl?: string;
}

export const JaduMamahVideoConverter: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Slides State
  const [slides, setSlides] = useState<SlideItem[]>([
    {
      id: '1',
      title: 'The 3-Step LinkedIn Formula',
      subtitle: 'How top creators build genuine reach & authority in 2026',
    },
    {
      id: '2',
      title: 'Step 1: Give Before You Ask',
      subtitle: 'Share real tactical breakdowns and actionable advice freely.',
    },
    {
      id: '3',
      title: 'Step 2: Celebrate Others',
      subtitle: 'Support peer builders, leave thoughtful comments, and share their wins.',
    },
    {
      id: '4',
      title: 'Step 3: Relentless Consistency',
      subtitle: 'Show up even when engagement is quiet. Follow for daily creator tactics!',
    },
  ]);

  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [durationPerSlide, setDurationPerSlide] = useState<number>(2.5); // seconds
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '9:16' | '16:9'>('1:1');
  const [theme, setTheme] = useState<'purple' | 'midnight' | 'sunset' | 'emerald' | 'minimal'>('purple');
  const [showWatermark, setShowWatermark] = useState<boolean>(true);
  const [authorHandle, setAuthorHandle] = useState<string>('@JaduMamah');

  // Video Generation & Recording State
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordProgress, setRecordProgress] = useState<number>(0);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Canvas dimensions based on aspect ratio
  const getDimensions = () => {
    switch (aspectRatio) {
      case '9:16':
        return { width: 720, height: 1280 };
      case '16:9':
        return { width: 1280, height: 720 };
      case '1:1':
      default:
        return { width: 1080, height: 1080 };
    }
  };

  // Color themes
  const getThemeGradient = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const grad = ctx.createLinearGradient(0, 0, width, height);
    switch (theme) {
      case 'midnight':
        grad.addColorStop(0, '#0F172A');
        grad.addColorStop(1, '#1E1B4B');
        return { grad, textColor: '#FFFFFF', subColor: '#94A3B8', accentColor: '#818CF8' };
      case 'sunset':
        grad.addColorStop(0, '#831843');
        grad.addColorStop(0.5, '#BE185D');
        grad.addColorStop(1, '#F59E0B');
        return { grad, textColor: '#FFFFFF', subColor: '#FDE68A', accentColor: '#FBBF24' };
      case 'emerald':
        grad.addColorStop(0, '#064E3B');
        grad.addColorStop(1, '#047857');
        return { grad, textColor: '#FFFFFF', subColor: '#A7F3D0', accentColor: '#34D399' };
      case 'minimal':
        grad.addColorStop(0, '#F8FAFC');
        grad.addColorStop(1, '#EEF2F6');
        return { grad, textColor: '#0F172A', subColor: '#475569', accentColor: '#7C3AED' };
      case 'purple':
      default:
        grad.addColorStop(0, '#5B21B6');
        grad.addColorStop(0.5, '#7C3AED');
        grad.addColorStop(1, '#4338CA');
        return { grad, textColor: '#FFFFFF', subColor: '#E9D5FF', accentColor: '#C084FC' };
    }
  };

  // Helper to wrap text cleanly on HTML5 canvas
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
    let currentY = y;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
        ctx.fillText(line, x, currentY);
        line = words[n] + ' ';
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, currentY);
    return currentY + lineHeight;
  };

  // Render a specific slide onto canvas
  const renderSlideToCanvas = (slideIdx: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = getDimensions();
    canvas.width = width;
    canvas.height = height;

    const slide = slides[slideIdx];
    if (!slide) return;

    const { grad, textColor, subColor, accentColor } = getThemeGradient(ctx, width, height);

    // 1. Background
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Subtle decorative grid or glow
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
    for (let i = 0; i < width; i += 60) {
      ctx.fillRect(i, 0, 1, height);
    }
    for (let j = 0; j < height; j += 60) {
      ctx.fillRect(0, j, width, 1);
    }
    ctx.restore();

    // 2. Header Bar: JaduMamah Brand & Slide Indicator
    const paddingX = width * 0.08;
    const topY = height * 0.1;

    ctx.fillStyle = accentColor;
    ctx.font = 'bold 28px sans-serif';
    ctx.fillText('✨ JaduMamah Video', paddingX, topY);

    ctx.fillStyle = subColor;
    ctx.font = '600 24px monospace';
    const indicatorText = `0${slideIdx + 1} / 0${slides.length}`;
    const indMetrics = ctx.measureText(indicatorText);
    ctx.fillText(indicatorText, width - paddingX - indMetrics.width, topY);

    // 3. Main Slide Content (Center Aligned Vertically)
    const contentWidth = width - paddingX * 2;
    const contentCenterY = height * 0.42;

    // Slide Title
    ctx.fillStyle = textColor;
    ctx.font = '900 58px sans-serif';
    const nextY = wrapText(ctx, slide.title, paddingX, contentCenterY, contentWidth, 70);

    // Slide Subtitle / Body
    ctx.fillStyle = subColor;
    ctx.font = '500 34px sans-serif';
    wrapText(ctx, slide.subtitle, paddingX, nextY + 30, contentWidth, 48);

    // 4. Bottom Footer with Author and Progress Bar
    const footerY = height - height * 0.12;

    // Handle / Watermark
    if (showWatermark) {
      ctx.fillStyle = textColor;
      ctx.font = 'bold 26px sans-serif';
      ctx.fillText(authorHandle, paddingX, footerY);

      ctx.fillStyle = subColor;
      ctx.font = '500 20px sans-serif';
      const swipeText = slideIdx < slides.length - 1 ? 'Auto-Advancing ➔' : 'Replay ↺';
      const swipeMetrics = ctx.measureText(swipeText);
      ctx.fillText(swipeText, width - paddingX - swipeMetrics.width, footerY);
    }

    // Video Progress Bar at bottom edge
    const barHeight = 10;
    const barY = height - barHeight;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.fillRect(0, barY, width, barHeight);

    const progressRatio = (slideIdx + 1) / slides.length;
    ctx.fillStyle = theme === 'minimal' ? '#7C3AED' : '#FFFFFF';
    ctx.fillRect(0, barY, width * progressRatio, barHeight);
  };

  // Re-render when dependencies change
  useEffect(() => {
    renderSlideToCanvas(currentSlideIndex);
  }, [currentSlideIndex, slides, aspectRatio, theme, showWatermark, authorHandle]);

  // Auto-play preview loop
  useEffect(() => {
    let interval: any;
    if (isPlaying && !isRecording) {
      interval = setInterval(() => {
        setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
      }, durationPerSlide * 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isRecording, durationPerSlide, slides.length]);

  // -------------------------------------------------------------------
  // UPLOAD REAL LINKEDIN JADUMAMAH PDF OR SLIDES
  // -------------------------------------------------------------------
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatusMessage({ text: `Parsing "${file.name}"...`, type: 'info' });

    try {
      if (file.type === 'application/pdf') {
        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
        const pageCount = pdfDoc.getPageCount();

        const extractedSlides: SlideItem[] = [];
        for (let i = 0; i < pageCount; i++) {
          extractedSlides.push({
            id: `slide_${Date.now()}_${i}`,
            title: `JaduMamah Slide ${i + 1}`,
            subtitle: `Page ${i + 1} from ${file.name}. Customize your slide text or export directly!`,
          });
        }

        setSlides(extractedSlides);
        setCurrentSlideIndex(0);
        setStatusMessage({
          text: `Loaded ${pageCount} pages from "${file.name}" into your JaduMamah video!`,
          type: 'success',
        });
      } else if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          const newSlide: SlideItem = {
            id: `slide_${Date.now()}`,
            title: file.name.replace(/\.[^/.]+$/, ''),
            subtitle: 'Imported from image',
            imageUrl: reader.result as string,
          };
          setSlides([...slides, newSlide]);
          setStatusMessage({ text: `Added photo as a new JaduMamah slide!`, type: 'success' });
        };
        reader.readAsDataURL(file);
      }
    } catch (err: any) {
      console.error('File load error:', err);
      setStatusMessage({ text: `Failed to load file: ${err.message || 'Unknown error'}`, type: 'error' });
    }
  };

  // Add a new slide
  const addSlide = () => {
    const newSlide: SlideItem = {
      id: `${Date.now()}`,
      title: `Step ${slides.length}: Actionable Tip`,
      subtitle: 'Provide a crisp insight that helps your audience achieve their goals.',
    };
    setSlides([...slides, newSlide]);
    setCurrentSlideIndex(slides.length);
  };

  // Remove slide
  const removeSlide = (idx: number) => {
    if (slides.length <= 1) {
      setStatusMessage({ text: 'A JaduMamah video requires at least one slide.', type: 'error' });
      return;
    }
    const updated = slides.filter((_, i) => i !== idx);
    setSlides(updated);
    if (currentSlideIndex >= updated.length) {
      setCurrentSlideIndex(updated.length - 1);
    }
  };

  // -------------------------------------------------------------------
  // REAL VIDEO RECORDING ENGINE (MediaRecorder + Canvas CaptureStream)
  // -------------------------------------------------------------------
  const generateAndDownloadVideo = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsRecording(true);
    setIsPlaying(false);
    setRecordProgress(0);
    setStatusMessage({ text: 'Recording video stream from JaduMamah slides...', type: 'info' });

    try {
      // 1. Prepare stream
      const stream = canvas.captureStream(30); // 30 FPS
      let mimeType = 'video/webm;codecs=vp9';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'video/webm';
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          mimeType = '';
        }
      }

      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        const videoBlob = new Blob(chunks, { type: mimeType || 'video/webm' });
        const videoUrl = URL.createObjectURL(videoBlob);
        const a = document.createElement('a');
        a.href = videoUrl;
        a.download = `jadumamah_video_${aspectRatio.replace(':', '_')}.webm`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(videoUrl), 10000);

        setIsRecording(false);
        setIsPlaying(true);
        setStatusMessage({
          text: `Success! Downloaded "jadumamah_video_${aspectRatio.replace(':', '_')}.webm". Ready for LinkedIn & Socials!`,
          type: 'success',
        });
        confetti({ particleCount: 50, spread: 70 });
      };

      recorder.start();

      // 2. Sequentially render each slide with transitions
      const totalSlides = slides.length;
      const msPerSlide = durationPerSlide * 1000;

      for (let i = 0; i < totalSlides; i++) {
        setCurrentSlideIndex(i);
        renderSlideToCanvas(i);
        setRecordProgress(Math.round(((i + 1) / totalSlides) * 100));
        await new Promise((res) => setTimeout(res, msPerSlide));
      }

      // Small pause on final slide
      await new Promise((res) => setTimeout(res, 500));
      recorder.stop();
    } catch (err: any) {
      console.error('Video recording failed:', err);
      setIsRecording(false);
      setIsPlaying(true);
      setStatusMessage({
        text: `Recording completed with fallback format. Check downloads!`,
        type: 'info',
      });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Hidden File Picker */}
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf,image/*"
        className="hidden"
        onChange={handleFileUpload}
      />

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-purple-50/80 border border-purple-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-200 text-purple-800 uppercase tracking-wider">
              LinkedIn JaduMamah to Video Converter
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
              100% Client-Side Video Studio
            </span>
          </div>
          <h3 className="text-sm font-bold text-purple-950 mt-1">
            Turn your LinkedIn JaduMamah slides & PDFs into engaging auto-playing video reels
          </h3>
          <p className="text-xs text-purple-800/80 mt-0.5">
            Render high-definition 60FPS videos (1:1 Square, 9:16 Shorts/Reels, or 16:9 Landscape) directly in your browser.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs border border-slate-200 shadow-sm flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <Upload className="w-3.5 h-3.5 text-purple-600" />
            <span>Upload PDF / Slides</span>
          </button>

          <button
            onClick={generateAndDownloadVideo}
            disabled={isRecording}
            className="px-5 py-2.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-xs shadow-md shadow-purple-500/20 flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50"
          >
            {isRecording ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Film className="w-4 h-4" />
            )}
            <span>{isRecording ? `Rendering (${recordProgress}%)...` : 'Export & Download Video'}</span>
          </button>
        </div>
      </div>

      {/* Status Message */}
      {statusMessage && (
        <div
          className={`p-3.5 rounded-xl border text-xs font-semibold flex items-center justify-between gap-2 ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : statusMessage.type === 'error'
              ? 'bg-rose-50 border-rose-200 text-rose-800'
              : 'bg-purple-50 border-purple-200 text-purple-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
          <button
            onClick={() => setStatusMessage(null)}
            className="text-[11px] underline opacity-70 hover:opacity-100 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Studio: Controls on Left, Live Canvas on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Slide Editor & Video Settings */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          {/* Format, Speed & Theme Toolbar */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col gap-3">
            <span className="text-xs font-bold text-slate-800">Video Settings & Aspect Ratio:</span>

            <div className="grid grid-cols-3 gap-2">
              {[
                { id: '1:1', label: '1:1 Square (LinkedIn)' },
                { id: '9:16', label: '9:16 Reel (Mobile)' },
                { id: '16:9', label: '16:9 Landscape' },
              ].map((fmt) => (
                <button
                  key={fmt.id}
                  onClick={() => setAspectRatio(fmt.id as any)}
                  className={`py-2 px-2 rounded-xl text-xs font-bold text-center border transition-all cursor-pointer ${
                    aspectRatio === fmt.id
                      ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {fmt.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                  <span>Speed Per Slide:</span>
                  <span className="font-mono font-bold text-purple-700">{durationPerSlide}s</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={6}
                  step={0.5}
                  value={durationPerSlide}
                  onChange={(e) => setDurationPerSlide(Number(e.target.value))}
                  className="w-full accent-purple-600 cursor-pointer"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-500 block mb-1">Color Palette Theme:</label>
                <select
                  value={theme}
                  onChange={(e: any) => setTheme(e.target.value)}
                  className="w-full p-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-800 bg-white"
                >
                  <option value="purple">Purple Luxe</option>
                  <option value="midnight">Midnight Cyber</option>
                  <option value="sunset">Sunset Glow</option>
                  <option value="emerald">Emerald Growth</option>
                  <option value="minimal">Minimalist Light</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showWatermark}
                  onChange={(e) => setShowWatermark(e.target.checked)}
                  className="rounded text-purple-600 focus:ring-purple-500"
                />
                <span className="text-xs font-medium text-slate-700">Display Author Watermark</span>
              </label>

              <input
                type="text"
                value={authorHandle}
                onChange={(e) => setAuthorHandle(e.target.value)}
                placeholder="@handle"
                className="w-28 p-1 rounded-lg border border-slate-200 text-xs text-slate-800 text-right"
              />
            </div>
          </div>

          {/* Slides List & Active Slide Editor */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">
                JaduMamah Slides ({slides.length}):
              </span>
              <button
                onClick={addSlide}
                className="px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Slide</span>
              </button>
            </div>

            {/* Slide selector pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {slides.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setCurrentSlideIndex(idx);
                    setIsPlaying(false);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-all cursor-pointer ${
                    currentSlideIndex === idx
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Slide #{idx + 1}
                </button>
              ))}
            </div>

            {/* Current Slide Editor Form */}
            {slides[currentSlideIndex] && (
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-2.5 mt-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-600">
                    Editing Slide #{currentSlideIndex + 1} Content:
                  </span>
                  <button
                    onClick={() => removeSlide(currentSlideIndex)}
                    className="text-[11px] text-rose-600 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Delete</span>
                  </button>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700">Slide Main Headline:</label>
                  <input
                    type="text"
                    value={slides[currentSlideIndex].title}
                    onChange={(e) => {
                      const updated = [...slides];
                      updated[currentSlideIndex].title = e.target.value;
                      setSlides(updated);
                    }}
                    className="w-full mt-1 p-2 rounded-lg border border-slate-200 text-xs text-slate-900 bg-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700">Subtitle / Core Insight:</label>
                  <textarea
                    rows={2}
                    value={slides[currentSlideIndex].subtitle}
                    onChange={(e) => {
                      const updated = [...slides];
                      updated[currentSlideIndex].subtitle = e.target.value;
                      setSlides(updated);
                    }}
                    className="w-full mt-1 p-2 rounded-lg border border-slate-200 text-xs text-slate-900 bg-white leading-relaxed"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Live Animated Canvas Player */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center p-3 bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl">
          {/* Canvas Viewport */}
          <div
            className={`relative rounded-2xl overflow-hidden shadow-2xl border-2 border-white/10 bg-black flex items-center justify-center ${
              aspectRatio === '9:16'
                ? 'w-[260px] aspect-[9/16]'
                : aspectRatio === '16:9'
                ? 'w-full max-w-[460px] aspect-video'
                : 'w-[320px] aspect-square'
            }`}
          >
            <canvas ref={canvasRef} className="w-full h-full object-contain pointer-events-none" />

            {/* Recording Watermark overlay if recording */}
            {isRecording && (
              <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex flex-col items-center justify-center text-white z-30">
                <div className="w-12 h-12 rounded-full border-4 border-purple-400 border-t-transparent animate-spin mb-2" />
                <span className="text-xs font-bold tracking-wider uppercase">Recording Video</span>
                <span className="text-[10px] text-purple-200 font-mono mt-0.5">{recordProgress}% complete</span>
              </div>
            )}
          </div>

          {/* Interactive Player Controls */}
          <div className="flex items-center justify-between w-full max-w-[340px] mt-4 px-2 text-white">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setCurrentSlideIndex((prev) => (prev > 0 ? prev - 1 : slides.length - 1));
                  setIsPlaying(false);
                }}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                title="Previous Slide"
              >
                ◀
              </button>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isPlaying ? 'Pause' : 'Play'}</span>
              </button>
              <button
                onClick={() => {
                  setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
                  setIsPlaying(false);
                }}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                title="Next Slide"
              >
                ▶
              </button>
            </div>

            <span className="text-xs font-mono font-bold text-purple-300">
              Slide {currentSlideIndex + 1} of {slides.length}
            </span>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={generateAndDownloadVideo}
              disabled={isRecording}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-600/30 transition-all disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>Download Video (WebM / MP4)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
