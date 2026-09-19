import React, { useState, useRef } from 'react';
import {
  Upload,
  Download,
  ShieldCheck,
  Eye,
  Sliders,
  Play,
  Pause,
  Volume2,
  VolumeX,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Smartphone,
  Monitor,
  Image as ImageIcon,
  Type,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface SafeZoneCheckerProps {
  platform: 'tiktok' | 'youtube';
}

export const SafeZoneChecker: React.FC<SafeZoneCheckerProps> = ({ platform: initialPlatform }) => {
  const [platform, setPlatform] = useState<'tiktok' | 'youtube'>(initialPlatform);
  const [format, setFormat] = useState<'9:16' | '16:9'>(initialPlatform === 'tiktok' ? '9:16' : '16:9');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Uploaded media state
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'video' | 'image'>('image');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);

  // Overlays state
  const [showNativeUI, setShowNativeUI] = useState<boolean>(true);
  const [showSafeZoneBox, setShowSafeZoneBox] = useState<boolean>(true);
  const [gridOpacity, setGridOpacity] = useState<number>(85);

  // User Custom Text / Hook overlay tester
  const [hookText, setHookText] = useState<string>('The #1 Secret Nobody Tells You About Content');
  const [hookYPosition, setHookYPosition] = useState<number>(35); // percentage from top (0 - 100)
  const [hookFontSize, setHookFontSize] = useState<number>(14);

  // Custom mock caption & creator
  const [creatorHandle, setCreatorHandle] = useState<string>('@creator_growth');
  const [captionText, setCaptionText] = useState<string>(
    'Stop making this hook mistake in your videos! Save this for later. #contentcreator #growthtips #viral'
  );

  // Check if current text position is safe
  const isTopDanger = hookYPosition < 15;
  const isBottomDanger = hookYPosition > 72;
  const isDangerZone = isTopDanger || isBottomDanger;

  // Media upload handler
  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setMediaUrl(url);

    if (file.type.startsWith('video/')) {
      setMediaType('video');
      setIsPlaying(true);
    } else {
      setMediaType('image');
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  // Preset sample backgrounds
  const loadPreset = (type: 'talking_head' | 'gradient_creative' | 'minimal') => {
    if (type === 'talking_head') {
      setMediaType('image');
      setMediaUrl(
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80'
      );
      setHookText('3 Mistakes Costing You 10,000 Views');
      setHookYPosition(32);
    } else if (type === 'gradient_creative') {
      setMediaType('image');
      setMediaUrl(
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80'
      );
      setHookText('Watch Until The End!');
      setHookYPosition(45);
    } else {
      setMediaUrl(null);
      setHookText('Your Bold Headline Goes Here');
      setHookYPosition(35);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        className="hidden"
        onChange={handleMediaUpload}
      />

      {/* Top Banner & Mode Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-purple-50/80 border border-purple-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-200 text-purple-800 uppercase tracking-wider">
              {platform === 'tiktok' ? 'TikTok 9:16' : 'YouTube Shorts / 16:9'}
            </span>
            <span className="text-xs font-bold text-slate-700">Safe Zone Simulator</span>
          </div>
          <h3 className="text-sm font-bold text-purple-950 mt-1">
            Ensure your text, hooks, and crucial visuals never get blocked by native UI buttons
          </h3>
          <p className="text-xs text-purple-800/80 mt-0.5">
            Test your video hooks, subtitles, and logos against official iOS & Android app interfaces.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center p-1 bg-white rounded-xl border border-slate-200 shadow-xs">
            <button
              onClick={() => {
                setPlatform('tiktok');
                setFormat('9:16');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                platform === 'tiktok'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              TikTok (9:16)
            </button>
            <button
              onClick={() => {
                setPlatform('youtube');
                setFormat('16:9');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                platform === 'youtube'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              YouTube (16:9)
            </button>
          </div>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-sm flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Media</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Controls on Left, Simulator on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Controls & Testers */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          {/* Status Indicator Pill */}
          <div
            className={`p-3.5 rounded-xl border text-xs font-semibold flex items-center gap-2.5 transition-all ${
              isDangerZone
                ? 'bg-rose-50 border-rose-200 text-rose-800'
                : 'bg-emerald-50 border-emerald-200 text-emerald-800'
            }`}
          >
            {isDangerZone ? (
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            )}
            <div>
              <p className="font-bold">
                {isDangerZone
                  ? isTopDanger
                    ? 'Danger: Text in Top 15% will be hidden by Search/Tabs!'
                    : 'Danger: Text in Bottom 28% will be blocked by Captions & Audio!'
                  : 'Safe Zone Validated! Text is 100% visible on all phones.'}
              </p>
              <p className="text-[11px] opacity-80 mt-0.5">
                {isDangerZone
                  ? 'Adjust your hook vertical position slider below to bring it into the green zone.'
                  : 'Your hooks and subtitles will not be obscured by like buttons or captions.'}
              </p>
            </div>
          </div>

          {/* Media Source & Presets */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">Media Underlay:</span>
              <span className="text-[11px] text-slate-400">
                {mediaUrl ? 'Custom media loaded' : 'Default canvas'}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Video or Image</span>
              </button>

              <button
                onClick={() => loadPreset('talking_head')}
                className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium cursor-pointer"
              >
                Portrait Sample
              </button>

              <button
                onClick={() => loadPreset('gradient_creative')}
                className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium cursor-pointer"
              >
                Abstract Sample
              </button>

              {mediaUrl && (
                <button
                  onClick={() => setMediaUrl(null)}
                  className="px-2.5 py-1.5 rounded-lg text-rose-600 hover:bg-rose-50 text-xs font-medium cursor-pointer"
                >
                  Clear Media
                </button>
              )}
            </div>
          </div>

          {/* Hook / Text Placement Tester */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Type className="w-3.5 h-3.5 text-purple-600" />
                <span>Interactive Hook Position Tester:</span>
              </span>
              <span className="font-mono text-xs text-purple-700 font-bold">
                {hookYPosition}% from top
              </span>
            </div>

            <div>
              <input
                type="text"
                value={hookText}
                onChange={(e) => setHookText(e.target.value)}
                placeholder="Type your video hook or title..."
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                <span>Vertical Position (Y-Axis):</span>
                <span className={isDangerZone ? 'text-rose-600 font-bold' : 'text-emerald-600 font-bold'}>
                  {isTopDanger ? 'Top Danger' : isBottomDanger ? 'Bottom Danger' : 'Safe Area'}
                </span>
              </div>
              <input
                type="range"
                min={5}
                max={90}
                value={hookYPosition}
                onChange={(e) => setHookYPosition(Number(e.target.value))}
                className="w-full accent-purple-600 cursor-pointer"
              />
            </div>

            <div className="flex items-center gap-3 pt-1">
              <span className="text-[11px] text-slate-500">Text Size:</span>
              <input
                type="range"
                min={10}
                max={22}
                value={hookFontSize}
                onChange={(e) => setHookFontSize(Number(e.target.value))}
                className="w-32 accent-purple-600 cursor-pointer"
              />
              <span className="font-mono text-[11px] text-slate-600">{hookFontSize}px</span>
            </div>
          </div>

          {/* Safe Zone & Overlay Toggles */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col gap-3">
            <span className="text-xs font-bold text-slate-800">Display Options & Overlays:</span>

            <div className="grid grid-cols-2 gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showNativeUI}
                  onChange={(e) => setShowNativeUI(e.target.checked)}
                  className="rounded text-purple-600 focus:ring-purple-500"
                />
                <span className="text-xs font-medium text-slate-700">Native App UI Elements</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showSafeZoneBox}
                  onChange={(e) => setShowSafeZoneBox(e.target.checked)}
                  className="rounded text-purple-600 focus:ring-purple-500"
                />
                <span className="text-xs font-medium text-slate-700">Green Safe Boundary</span>
              </label>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-4">
              <span className="text-[11px] text-slate-500">Overlay Opacity:</span>
              <div className="flex items-center gap-2 flex-1 max-w-[180px]">
                <input
                  type="range"
                  min={20}
                  max={100}
                  value={gridOpacity}
                  onChange={(e) => setGridOpacity(Number(e.target.value))}
                  className="w-full accent-purple-600 cursor-pointer"
                />
                <span className="font-mono text-[11px] text-slate-600 w-8">{gridOpacity}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Smartphone / Screen Simulator */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center p-2">
          {platform === 'tiktok' ? (
            /* ------------------------------------------------------------------- */
            /* TIKTOK 9:16 SIMULATOR */
            /* ------------------------------------------------------------------- */
            <div className="relative w-[280px] sm:w-[300px] aspect-[9/16] bg-black rounded-[36px] overflow-hidden shadow-2xl border-[6px] border-slate-900 select-none flex flex-col justify-between">
              {/* Media Background Layer (Video or Image) */}
              <div className="absolute inset-0 z-0 overflow-hidden bg-slate-950 flex items-center justify-center">
                {mediaUrl ? (
                  mediaType === 'video' ? (
                    <video
                      ref={videoRef}
                      src={mediaUrl}
                      autoPlay
                      loop
                      muted={isMuted}
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={mediaUrl}
                      alt="User creative"
                      className="w-full h-full object-cover"
                    />
                  )
                ) : (
                  <div className="w-full h-full bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 flex flex-col items-center justify-center p-4 text-center text-white/40">
                    <Smartphone className="w-12 h-12 mb-2 text-white/20" />
                    <p className="text-xs font-semibold">Drop Media or Video Here</p>
                    <p className="text-[10px] text-white/30 mt-1">9:16 Vertical Canvas</p>
                  </div>
                )}
              </div>

              {/* Video Playback Controls overlay if video */}
              {mediaType === 'video' && mediaUrl && (
                <div className="absolute top-12 left-3 z-30 flex items-center gap-1.5 bg-black/60 backdrop-blur-xs px-2 py-1 rounded-full text-white">
                  <button onClick={togglePlay} className="p-0.5 hover:text-purple-400">
                    {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                  </button>
                  <button onClick={toggleMute} className="p-0.5 hover:text-purple-400">
                    {isMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                  </button>
                </div>
              )}

              {/* USER'S INTERACTIVE TEST TEXT HOOK */}
              {hookText && (
                <div
                  style={{ top: `${hookYPosition}%` }}
                  className="absolute left-4 right-14 z-20 transition-all pointer-events-none"
                >
                  <div
                    style={{ fontSize: `${hookFontSize}px` }}
                    className={`p-2 rounded-lg font-black text-center leading-snug drop-shadow-md transition-all ${
                      isDangerZone
                        ? 'bg-rose-600/90 text-white border-2 border-dashed border-white animate-pulse'
                        : 'bg-black/60 text-white backdrop-blur-xs border border-white/20'
                    }`}
                  >
                    {hookText}
                  </div>
                </div>
              )}

              {/* SAFE ZONE BOUNDARY BOX (Green Bounding Box) */}
              {showSafeZoneBox && (
                <div
                  style={{ opacity: gridOpacity / 100 }}
                  className="absolute top-[14%] bottom-[24%] left-[4%] right-[17%] z-10 rounded-xl border-2 border-dashed border-emerald-400 bg-emerald-500/10 pointer-events-none flex flex-col justify-between p-2"
                >
                  <div className="flex justify-between items-center text-[8px] font-mono font-bold text-emerald-300">
                    <span>SAFE TOP (14%)</span>
                    <span>SAFE</span>
                  </div>

                  <div className="text-center my-auto">
                    <span className="text-[9px] font-bold text-emerald-300 uppercase tracking-wider bg-black/40 px-2 py-0.5 rounded">
                      Safe Text & Face Zone
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-[8px] font-mono font-bold text-emerald-300">
                    <span>LEFT SAFE (4%)</span>
                    <span>RIGHT SAFE (17%)</span>
                  </div>
                </div>
              )}

              {/* TOP DANGER ZONE SHADING */}
              {showSafeZoneBox && (
                <div
                  style={{ opacity: (gridOpacity / 100) * 0.4 }}
                  className="absolute top-0 left-0 right-0 h-[14%] bg-rose-500/20 border-b border-rose-500/40 pointer-events-none flex items-center justify-center text-[8px] font-bold text-rose-300 tracking-wider"
                >
                  TOP DANGER: HEADER & TABS
                </div>
              )}

              {/* BOTTOM DANGER ZONE SHADING */}
              {showSafeZoneBox && (
                <div
                  style={{ opacity: (gridOpacity / 100) * 0.4 }}
                  className="absolute bottom-0 left-0 right-0 h-[24%] bg-rose-500/20 border-t border-rose-500/40 pointer-events-none flex items-center justify-center text-[8px] font-bold text-rose-300 tracking-wider"
                >
                  BOTTOM DANGER: CAPTION & AUDIO
                </div>
              )}

              {/* TIKTOK APP NATIVE UI OVERLAYS */}
              {showNativeUI && (
                <div
                  style={{ opacity: gridOpacity / 100 }}
                  className="relative z-20 w-full h-full flex flex-col justify-between p-3 pointer-events-none text-white"
                >
                  {/* Top Bar: Tabs & Search */}
                  <div className="flex items-center justify-between text-xs font-bold pt-2 px-1 text-white/90 drop-shadow">
                    <span className="text-[10px] font-medium opacity-60">LIVE</span>
                    <div className="flex items-center gap-3">
                      <span className="opacity-70 text-[11px]">Following</span>
                      <span className="text-[11px] font-black border-b-2 border-white pb-0.5">For You</span>
                    </div>
                    <span className="text-[11px] opacity-80">🔍</span>
                  </div>

                  {/* Middle Area with Right Interaction Sidebar */}
                  <div className="flex justify-end pr-1 my-auto">
                    <div className="flex flex-col items-center gap-3 text-[9px] font-bold">
                      {/* Creator Avatar */}
                      <div className="w-8 h-8 rounded-full bg-purple-500 border-2 border-white flex items-center justify-center text-[10px] shadow">
                        👤
                      </div>
                      {/* Like */}
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-xs flex items-center justify-center text-sm">
                          ❤️
                        </div>
                        <span className="text-[8px] mt-0.5 drop-shadow">142K</span>
                      </div>
                      {/* Comment */}
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-xs flex items-center justify-center text-sm">
                          💬
                        </div>
                        <span className="text-[8px] mt-0.5 drop-shadow">1,248</span>
                      </div>
                      {/* Bookmark */}
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-xs flex items-center justify-center text-sm">
                          🔖
                        </div>
                        <span className="text-[8px] mt-0.5 drop-shadow">8.9K</span>
                      </div>
                      {/* Share */}
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-xs flex items-center justify-center text-sm">
                          ↗️
                        </div>
                        <span className="text-[8px] mt-0.5 drop-shadow">Share</span>
                      </div>
                      {/* Spinning Vinyl */}
                      <div className="w-7 h-7 rounded-full bg-slate-800 border-2 border-white/60 animate-spin flex items-center justify-center text-[9px]">
                        💿
                      </div>
                    </div>
                  </div>

                  {/* Bottom Caption, Handle, & Music Bar */}
                  <div className="text-[10px] max-w-[200px] pb-2 drop-shadow-md">
                    <span className="font-bold text-white text-[11px] block">{creatorHandle}</span>
                    <p className="line-clamp-2 mt-0.5 text-white/90 text-[9px] leading-tight">
                      {captionText}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1 text-[8px] text-white/80 font-mono">
                      <span>🎵</span>
                      <span className="truncate">Original Sound - Trending Creator Audio</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* ------------------------------------------------------------------- */
            /* YOUTUBE 16:9 SIMULATOR */
            /* ------------------------------------------------------------------- */
            <div className="relative w-full max-w-[460px] aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border-4 border-slate-900 select-none flex flex-col justify-between p-3 text-white">
              {/* Media Background */}
              <div className="absolute inset-0 z-0 bg-slate-950 flex items-center justify-center overflow-hidden">
                {mediaUrl ? (
                  mediaType === 'video' ? (
                    <video
                      ref={videoRef}
                      src={mediaUrl}
                      autoPlay
                      loop
                      muted={isMuted}
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img src={mediaUrl} alt="User creative" className="w-full h-full object-cover" />
                  )
                ) : (
                  <div className="flex flex-col items-center text-white/30">
                    <Monitor className="w-12 h-12 mb-1" />
                    <span className="text-xs">YouTube 16:9 Thumbnail & Video</span>
                  </div>
                )}
              </div>

              {/* Hook text */}
              {hookText && (
                <div
                  style={{ top: `${hookYPosition}%` }}
                  className="absolute left-8 right-8 z-20 pointer-events-none"
                >
                  <div className="bg-black/70 text-white font-black text-center p-2 rounded-lg text-sm border border-white/20 drop-shadow">
                    {hookText}
                  </div>
                </div>
              )}

              {/* YouTube Safe Box */}
              {showSafeZoneBox && (
                <div
                  style={{ opacity: gridOpacity / 100 }}
                  className="absolute inset-5 rounded-xl border-2 border-dashed border-emerald-400 bg-emerald-500/10 z-10 pointer-events-none flex flex-col items-center justify-center text-center p-2"
                >
                  <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider bg-black/40 px-2 py-0.5 rounded">
                    Safe Thumbnail Title & Face Zone
                  </span>
                  <span className="text-[9px] text-emerald-200 mt-1">
                    Bottom-right timestamp badge will obscure content in that corner!
                  </span>
                </div>
              )}

              {/* Native YouTube Timestamp */}
              {showNativeUI && (
                <div className="relative z-20 flex justify-end items-end h-full">
                  <div className="bg-black/85 text-white font-mono font-bold text-[10px] px-2 py-0.5 rounded shadow">
                    12:45
                  </div>
                </div>
              )}
            </div>
          )}

          <p className="text-[11px] text-slate-400 mt-3 text-center">
            {platform === 'tiktok'
              ? 'Previewing on simulated 1080 × 1920 viewport with standard iOS/Android overlays'
              : 'Previewing on simulated 1920 × 1080 YouTube video player'}
          </p>
        </div>
      </div>
    </div>
  );
};
