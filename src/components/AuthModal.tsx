import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, Briefcase, LogIn, UserPlus, Sparkles } from 'lucide-react';
import { User } from '../types.ts';
import { LinkedInIcon, FacebookIcon, InstagramIcon, YouTubeIcon } from './SocialIcons.tsx';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onAuthSuccess: (user: User, token: string) => void;
  onLogout: () => void;
  language: 'en' | 'bn';
}

type PlatformType = 'linkedin' | 'facebook' | 'instagram' | 'youtube';

const PLATFORM_CONFIG: Record<
  PlatformType,
  {
    name: string;
    bnName: string;
    bg: string;
    border: string;
    text: string;
    hoverBg: string;
    headlineLabel: string;
    headlineLabelBn: string;
    headlinePlaceholder: string;
    icon: React.ComponentType<{ className?: string }>;
  }
> = {
  linkedin: {
    name: 'LinkedIn',
    bnName: 'লিঙ্কডইন',
    bg: 'bg-[#0A66C2]',
    border: 'border-[#0A66C2]/30',
    text: 'text-[#0A66C2]',
    hoverBg: 'hover:bg-[#0A66C2]/10',
    headlineLabel: 'LinkedIn Headline',
    headlineLabelBn: 'LinkedIn হেডলাইন ও পদবি',
    headlinePlaceholder: 'e.g. Growth Strategist & Content Creator',
    icon: LinkedInIcon,
  },
  facebook: {
    name: 'Facebook',
    bnName: 'ফেসবুক',
    bg: 'bg-[#1877F2]',
    border: 'border-[#1877F2]/30',
    text: 'text-[#1877F2]',
    hoverBg: 'hover:bg-[#1877F2]/10',
    headlineLabel: 'Facebook Page / Bio',
    headlineLabelBn: 'Facebook পেজ বা বায়ো',
    headlinePlaceholder: 'e.g. Digital Creator & Community Lead',
    icon: FacebookIcon,
  },
  instagram: {
    name: 'Instagram',
    bnName: 'ইনস্টাগ্রাম',
    bg: 'bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF]',
    border: 'border-[#DD2A7B]/30',
    text: 'text-[#DD2A7B]',
    hoverBg: 'hover:bg-[#DD2A7B]/10',
    headlineLabel: 'Instagram Bio & Handle',
    headlineLabelBn: 'Instagram বায়ো ও ইউজারনেম',
    headlinePlaceholder: 'e.g. @creative.lead | Visual Storyteller',
    icon: InstagramIcon,
  },
  youtube: {
    name: 'YouTube',
    bnName: 'ইউটিউব',
    bg: 'bg-[#FF0000]',
    border: 'border-[#FF0000]/30',
    text: 'text-[#FF0000]',
    hoverBg: 'hover:bg-[#FF0000]/10',
    headlineLabel: 'YouTube Channel Description',
    headlineLabelBn: 'YouTube চ্যানেল বিবরণ',
    headlinePlaceholder: 'e.g. Tech & Creator Studio (85K Subs)',
    icon: YouTubeIcon,
  },
};

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onAuthSuccess,
  onLogout,
  language,
}) => {
  const isBn = language === 'bn';
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformType>('linkedin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [headline, setHeadline] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<PlatformType | null>(null);

  if (!isOpen) return null;

  const handleSocialLogin = async (platform: PlatformType) => {
    setError('');
    setSocialLoading(platform);

    try {
      const res = await fetch('/api/auth/social', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider: platform }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Social sign in failed');
      } else {
        onAuthSuccess(data.user, data.token);
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Network error');
    } finally {
      setSocialLoading(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = tab === 'login' ? '/api/auth/login' : '/api/auth/register';
    const payload =
      tab === 'login'
        ? { email, password }
        : { name, email, password, headline, platform: selectedPlatform };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Authentication failed');
      } else {
        onAuthSuccess(data.user, data.token);
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  const currentPlatformKey: PlatformType =
    (currentUser?.platform as PlatformType) || 'linkedin';
  const CurrentPlatformIcon = PLATFORM_CONFIG[currentPlatformKey]?.icon || LinkedInIcon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col transition-colors max-h-[90vh] overflow-y-auto">
        {/* Header with multi-platform branding */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-850">
          <div className="flex items-center gap-3">
            {/* Multi-platform icon strip */}
            <div className="flex -space-x-1.5 items-center">
              <div
                className="w-7 h-7 rounded-lg bg-[#0A66C2] text-white flex items-center justify-center shadow-xs z-40"
                title="LinkedIn"
              >
                <LinkedInIcon className="w-3.5 h-3.5" />
              </div>
              <div
                className="w-7 h-7 rounded-lg bg-[#1877F2] text-white flex items-center justify-center shadow-xs z-30"
                title="Facebook"
              >
                <FacebookIcon className="w-3.5 h-3.5" />
              </div>
              <div
                className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white flex items-center justify-center shadow-xs z-20"
                title="Instagram"
              >
                <InstagramIcon className="w-3.5 h-3.5" />
              </div>
              <div
                className="w-7 h-7 rounded-lg bg-[#FF0000] text-white flex items-center justify-center shadow-xs z-10"
                title="YouTube"
              >
                <YouTubeIcon className="w-3.5 h-3.5" />
              </div>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                {currentUser
                  ? isBn
                    ? 'সংযুক্ত অ্যাকাউন্ট'
                    : 'Connected Account'
                  : tab === 'login'
                  ? isBn
                    ? 'অ্যাকাউন্টে সাইন ইন করুন'
                    : 'Sign In to Account'
                  : isBn
                  ? 'নতুন অ্যাকাউন্ট তৈরি করুন'
                  : 'Create an Account'}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {isBn
                  ? 'LinkedIn, Facebook, Instagram ও YouTube সাপোর্টেড'
                  : 'LinkedIn, Facebook, Instagram & YouTube supported'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* If user is already logged in */}
        {currentUser ? (
          <div className="p-5 sm:p-6 flex flex-col gap-5">
            <div className="flex items-center gap-3.5 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
              <div className="relative">
                <img
                  src={currentUser.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=user'}
                  alt={currentUser.name}
                  className="w-14 h-14 rounded-full border-2 border-white dark:border-slate-700 shadow-xs object-cover"
                />
                <div
                  className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full ${PLATFORM_CONFIG[currentPlatformKey]?.bg || 'bg-purple-600'} text-white flex items-center justify-center border-2 border-white dark:border-slate-800 shadow-xs`}
                >
                  <CurrentPlatformIcon className="w-2.5 h-2.5" />
                </div>
              </div>

              <div className="flex-1 overflow-hidden">
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                    {currentUser.name}
                  </h4>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded font-semibold uppercase tracking-wider ${PLATFORM_CONFIG[currentPlatformKey]?.text} bg-slate-100 dark:bg-slate-700`}
                  >
                    {PLATFORM_CONFIG[currentPlatformKey]?.name || 'Creator'}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 truncate">{currentUser.email}</p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate mt-0.5">
                  {currentUser.headline}
                </p>
              </div>
            </div>

            {/* Quick Switch Platform */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span>{isBn ? 'অন্য প্ল্যাটফর্মে পরিবর্তন করুন:' : 'Switch to another platform:'}</span>
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['linkedin', 'facebook', 'instagram', 'youtube'] as PlatformType[]).map((plt) => {
                  const cfg = PLATFORM_CONFIG[plt];
                  const Icon = cfg.icon;
                  const isActive = currentPlatformKey === plt;
                  return (
                    <button
                      key={plt}
                      onClick={() => handleSocialLogin(plt)}
                      disabled={socialLoading !== null}
                      className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-1 text-xs font-semibold transition-all cursor-pointer ${
                        isActive
                          ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 ring-2 ring-purple-500/20'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-lg ${cfg.bg} text-white flex items-center justify-center`}>
                        <Icon className="w-3 h-3" />
                      </div>
                      <span className="text-[11px]">{isBn ? cfg.bnName : cfg.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="w-full py-2.5 px-4 rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 text-xs font-bold transition-colors cursor-pointer"
            >
              {isBn ? 'লগআউট করুন' : 'Sign Out'}
            </button>
          </div>
        ) : (
          <div className="p-5 sm:p-6 flex flex-col gap-4">
            {/* 1-Click Social Sign In Options */}
            <div className="flex flex-col gap-2.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                {isBn ? 'সোশ্যাল মিডিয়া দিয়ে দ্রুত লগইন করুন' : 'Quick Sign In with Social Platform'}
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {/* LinkedIn */}
                <button
                  type="button"
                  onClick={() => handleSocialLogin('linkedin')}
                  disabled={socialLoading !== null}
                  className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-[#0A66C2] hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition-all cursor-pointer group text-left"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#0A66C2] text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <LinkedInIcon className="w-4 h-4" />
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      {isBn ? 'LinkedIn দিয়ে সাইন ইন' : 'Continue with LinkedIn'}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">
                      {isBn ? 'প্রফেশনাল পোস্ট' : 'Professional network'}
                    </div>
                  </div>
                </button>

                {/* Facebook */}
                <button
                  type="button"
                  onClick={() => handleSocialLogin('facebook')}
                  disabled={socialLoading !== null}
                  className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-[#1877F2] hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition-all cursor-pointer group text-left"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#1877F2] text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <FacebookIcon className="w-4 h-4" />
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      {isBn ? 'Facebook দিয়ে সাইন ইন' : 'Continue with Facebook'}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">
                      {isBn ? 'পেজ ও গ্রুপ পোস্ট' : 'Pages & Groups'}
                    </div>
                  </div>
                </button>

                {/* Instagram */}
                <button
                  type="button"
                  onClick={() => handleSocialLogin('instagram')}
                  disabled={socialLoading !== null}
                  className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-[#DD2A7B] hover:bg-pink-50/50 dark:hover:bg-pink-950/20 transition-all cursor-pointer group text-left"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <InstagramIcon className="w-4 h-4" />
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      {isBn ? 'Instagram দিয়ে সাইন ইন' : 'Continue with Instagram'}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">
                      {isBn ? 'রিলস ও ফটো ক্যাপশন' : 'Reels & Captions'}
                    </div>
                  </div>
                </button>

                {/* YouTube */}
                <button
                  type="button"
                  onClick={() => handleSocialLogin('youtube')}
                  disabled={socialLoading !== null}
                  className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-[#FF0000] hover:bg-red-50/50 dark:hover:bg-red-950/20 transition-all cursor-pointer group text-left"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#FF0000] text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <YouTubeIcon className="w-4 h-4" />
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      {isBn ? 'YouTube দিয়ে সাইন ইন' : 'Continue with YouTube'}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">
                      {isBn ? 'কমিউনিটি পোস্ট ও শর্টস' : 'Community & Shorts'}
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className="relative my-1">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-800" />
              </div>
              <div className="relative flex justify-center text-[11px] uppercase tracking-wider font-semibold">
                <span className="bg-white dark:bg-slate-900 px-3 text-slate-400 dark:text-slate-500">
                  {isBn ? 'অথবা ইমেইল দিয়ে প্রবেশ করুন' : 'or continue with email'}
                </span>
              </div>
            </div>

            {/* Tabs */}
            <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
              <button
                type="button"
                onClick={() => {
                  setTab('login');
                  setError('');
                }}
                className={`py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  tab === 'login'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {isBn ? 'লগইন' : 'Login'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setTab('register');
                  setError('');
                }}
                className={`py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  tab === 'register'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {isBn ? 'রেজিস্ট্রেশন' : 'Register'}
              </button>
            </div>

            {error && (
              <div className="p-2.5 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-xs text-red-600 dark:text-red-400 font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              {tab === 'register' && (
                <>
                  {/* Platform Selection for Register */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {isBn ? 'আপনার প্রধান প্ল্যাটফর্ম' : 'Primary Target Platform'}
                    </label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {(['linkedin', 'facebook', 'instagram', 'youtube'] as PlatformType[]).map((plt) => {
                        const cfg = PLATFORM_CONFIG[plt];
                        const Icon = cfg.icon;
                        const isSelected = selectedPlatform === plt;
                        return (
                          <button
                            key={plt}
                            type="button"
                            onClick={() => setSelectedPlatform(plt)}
                            className={`py-1.5 px-2 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                              isSelected
                                ? `${cfg.bg} text-white border-transparent shadow-xs`
                                : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                            }`}
                          >
                            <Icon className="w-3 h-3" />
                            <span className="text-[11px] truncate">{isBn ? cfg.bnName : cfg.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {isBn ? 'আপনার পূর্ণ নাম' : 'Full Name'}
                    </label>
                    <div className="relative">
                      <UserIcon className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Sonia Akter"
                        className="w-full pl-8 pr-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:border-purple-600 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {isBn
                        ? PLATFORM_CONFIG[selectedPlatform].headlineLabelBn
                        : PLATFORM_CONFIG[selectedPlatform].headlineLabel}
                    </label>
                    <div className="relative">
                      <Briefcase className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={headline}
                        onChange={(e) => setHeadline(e.target.value)}
                        placeholder={PLATFORM_CONFIG[selectedPlatform].headlinePlaceholder}
                        className="w-full pl-8 pr-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:border-purple-600 outline-none"
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {isBn ? 'ইমেইল অ্যাড্রেস' : 'Email Address'}
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-8 pr-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:border-purple-600 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {isBn ? 'পাসওয়ার্ড' : 'Password'}
                </label>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-8 pr-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:border-purple-600 outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || socialLoading !== null}
                className="w-full mt-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] hover:from-[#6D28D9] hover:to-[#5B21B6] text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {tab === 'login' ? <LogIn className="w-3.5 h-3.5" /> : <UserPlus className="w-3.5 h-3.5" />}
                <span>
                  {loading
                    ? isBn
                      ? 'অপেক্ষা করুন...'
                      : 'Processing...'
                    : tab === 'login'
                    ? isBn
                      ? 'ইমেইল দিয়ে লগইন করুন'
                      : 'Sign In with Email'
                    : isBn
                    ? 'নতুন একাউন্ট তৈরি করুন'
                    : 'Create Account'}
                </span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
