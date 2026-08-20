import React, { useRef, useState } from 'react';
import { Mail, Phone, MapPin, Github, Linkedin, Twitter, FileText, BookOpen, RotateCcw, Camera, Check } from 'lucide-react';
import { Profile } from '../types';
import { OptimizedImage } from './OptimizedImage';

interface HeaderCardProps {
  profile: Profile;
  isEditing: boolean;
  onUpdateProfile: (updated: Profile | ((prev: Profile) => Profile)) => void;
  onReset: () => void;
  hasLocalChanges: boolean;
}

const GoogleScholarIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M12 2L1 9l11 7 9-5.73V17h2V9L12 2zM4 11.4v4.6l8 4.6 8-4.6v-4.6l-8 4.4-8-4.4z" />
  </svg>
);

const GmailIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <path fill="#4285F4" d="M20 18h1.5c.83 0 1.5-.67 1.5-1.5V6c0-.83-.67-1.5-1.5-1.5H20v13.5z" />
    <path fill="#34A853" d="M4 18H2.5C1.67 18 1 17.33 1 16.5V6c0-.83.67-1.5 1.5-1.5H4v13.5z" />
    <path fill="#EA4335" d="M20 4.5l-8 6-8-6V18h3V9.5l5 3.75 5-3.75V18h3V4.5z" />
    <path fill="#C5221F" d="M12 10.5l8-6h-2.5l-5.5 4.125L6.5 4.5H4l8 6z" />
  </svg>
);

const XIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export default function HeaderCard({
  profile,
  isEditing,
  onUpdateProfile,
  onReset,
  hasLocalChanges
}: HeaderCardProps) {
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    if (!profile.email) return;
    if (!navigator.clipboard) {
      alert("Clipboard copy is not supported in this browser context.");
      return;
    }
    navigator.clipboard.writeText(profile.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleChange = (field: keyof Profile, value: string | string[]) => {
    onUpdateProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit to prevent oversized localStorage payload (5MB is general limit, let's keep it sane under 1.5MB)
    if (file.size > 1.5 * 1024 * 1024) {
      alert("Image is too large. Please upload an image smaller than 1.5MB to preserve local database storage.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64String = event.target?.result as string;
      if (base64String) {
        handleChange('avatarUrl', base64String);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div id="header-section" className="bg-[#FAF5EB] hover:bg-[#FDFBF7] dark:bg-zinc-900 dark:hover:bg-[#1f1f23] border-4 border-[#801428] dark:border-[#7DE2C5] rounded-2xl shadow-sm hover:shadow-xs overflow-hidden mb-6 transition-[background-color,box-shadow,border-color] duration-200">
      <div className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row gap-8 items-stretch">

          {/* Avatar and Info Grid */}
          <div className="w-full md:w-1/4 flex flex-col items-center justify-between">
            <div className="flex-1 flex flex-col items-center justify-center py-2">
              <div className="relative group">
                <OptimizedImage
                  src={profile.avatarUrl || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400&h=400"}
                  alt={profile.name}
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                  className="w-32 md:w-40 h-auto rounded-xl transition-[transform,opacity] duration-200"
                />
                {isEditing && (
                  <>
                    <input
                      type="file"
                      ref={avatarInputRef}
                      onChange={handleAvatarUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      onClick={() => avatarInputRef.current?.click()}
                      className="absolute inset-0 bg-zinc-900/80 rounded-xl flex flex-col items-center justify-center p-3 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer text-white"
                    >
                      <Camera className="w-5 h-5 mb-1.5 text-white" />
                      <span className="text-[11px] font-bold">Upload Photo</span>
                      <span className="text-[8px] text-zinc-300 mt-1 font-mono">PNG, JPG, WebP</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Academic Social & Contact Coordinates with descriptive text inside */}
            <div className="w-full flex flex-col gap-1.5 mt-4 md:mt-auto font-sans select-none">
              {profile.googleScholar && (
                <a
                  href={profile.googleScholar}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/btn relative overflow-hidden w-full flex items-center justify-center gap-2 px-3 py-2 bg-[#F7F1E6] active:bg-[#EBDDC3] dark:bg-zinc-800/90 dark:active:bg-zinc-700 border border-[#E5DAC5] dark:border-zinc-700/80 text-[#2A2D34] dark:text-zinc-200 hover:text-[#801428] dark:hover:text-[#7DE2C5] rounded-lg text-xs font-semibold transition-[transform,background-color,border-color,color] duration-160 active:scale-[0.97] shadow-2xs cursor-pointer"
                  title="Google Scholar Citations"
                >
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 rounded-[inherit] bg-white/90 dark:bg-zinc-700/80 blur-[2px] opacity-0 group-hover/btn:opacity-100 transition-opacity duration-160 pointer-events-none shadow-[inset_0_0_4px_rgba(255,255,255,0.8),0_0_8px_rgba(255,255,255,0.95)] dark:shadow-[inset_0_0_4px_rgba(125,226,197,0.3),0_0_8px_rgba(125,226,197,0.35)]"
                  />
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <GoogleScholarIcon className="w-3.5 h-3.5 shrink-0 transition-colors duration-160" />
                    <span>Google Scholar</span>
                  </span>
                </a>
              )}

              {profile.email && (
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="group/btn relative overflow-hidden w-full flex items-center justify-center gap-2 px-3 py-2 bg-[#F7F1E6] active:bg-[#EBDDC3] dark:bg-zinc-800/90 dark:active:bg-zinc-700 border border-[#E5DAC5] dark:border-zinc-700/80 text-[#2A2D34] dark:text-zinc-200 hover:text-[#801428] dark:hover:text-[#7DE2C5] rounded-lg text-xs font-semibold cursor-pointer transition-[transform,background-color,border-color,color] duration-160 active:scale-[0.97] shadow-2xs"
                  title="Click to copy email address"
                >
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 rounded-[inherit] bg-white/90 dark:bg-zinc-700/80 blur-[2px] opacity-0 group-hover/btn:opacity-100 transition-opacity duration-160 pointer-events-none shadow-[inset_0_0_4px_rgba(255,255,255,0.8),0_0_8px_rgba(255,255,255,0.95)] dark:shadow-[inset_0_0_4px_rgba(125,226,197,0.3),0_0_8px_rgba(125,226,197,0.35)]"
                  />
                  <span className="relative z-10 flex items-center justify-center gap-2 transition-[filter,opacity] duration-160">
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 shrink-0 text-[#801428] dark:text-[#7DE2C5] animate-fadeIn" />
                        <span className="text-[#801428] dark:text-[#7DE2C5] font-bold">Email Copied!</span>
                      </>
                    ) : (
                      <>
                        <Mail className="w-3.5 h-3.5 shrink-0 transition-colors duration-160" />
                        <span>Copy Email</span>
                      </>
                    )}
                  </span>
                </button>
              )}

              {profile.cvUrl && (
                <a
                  href={profile.cvUrl}
                  download={`${profile.name.replace(/\s+/g, '_')}_CV.pdf`}
                  className="group/btn relative overflow-hidden w-full flex items-center justify-center gap-2 px-3 py-2 bg-[#F7F1E6] active:bg-[#EBDDC3] dark:bg-zinc-800/90 dark:active:bg-zinc-700 border border-[#E5DAC5] dark:border-zinc-700/80 text-[#2A2D34] dark:text-zinc-200 hover:text-[#801428] dark:hover:text-[#7DE2C5] rounded-lg text-xs font-semibold transition-[transform,background-color,border-color,color] duration-160 active:scale-[0.97] shadow-2xs cursor-pointer"
                  title="Download Curriculum Vitae"
                >
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 rounded-[inherit] bg-white/90 dark:bg-zinc-700/80 blur-[2px] opacity-0 group-hover/btn:opacity-100 transition-opacity duration-160 pointer-events-none shadow-[inset_0_0_4px_rgba(255,255,255,0.8),0_0_8px_rgba(255,255,255,0.95)] dark:shadow-[inset_0_0_4px_rgba(125,226,197,0.3),0_0_8px_rgba(125,226,197,0.35)]"
                  />
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <FileText className="w-3.5 h-3.5 shrink-0 transition-colors duration-160" />
                    <span>Curriculum Vitae</span>
                  </span>
                </a>
              )}

              {/* LinkedIn and X buttons, resized to 1/2 length each */}
              <div className="grid grid-cols-2 gap-1.5 w-full">
                {profile.linkedin && (
                  <a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/btn relative overflow-hidden flex items-center justify-center px-1 py-2 bg-[#F7F1E6] active:bg-[#EBDDC3] dark:bg-zinc-800/90 dark:active:bg-zinc-700 border border-[#E5DAC5] dark:border-zinc-700/80 text-[#2A2D34] dark:text-zinc-200 hover:text-[#801428] dark:hover:text-[#7DE2C5] rounded-lg text-[11px] font-semibold transition-[transform,background-color,border-color,color] duration-160 active:scale-[0.97] shadow-2xs cursor-pointer"
                    title="LinkedIn Profile"
                  >
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 rounded-[inherit] bg-white/90 dark:bg-zinc-700/80 blur-[2px] opacity-0 group-hover/btn:opacity-100 transition-opacity duration-160 pointer-events-none shadow-[inset_0_0_4px_rgba(255,255,255,0.8),0_0_8px_rgba(255,255,255,0.95)] dark:shadow-[inset_0_0_4px_rgba(125,226,197,0.3),0_0_8px_rgba(125,226,197,0.35)]"
                    />
                    <span className="relative z-10 flex items-center justify-center">
                      <Linkedin className="w-3.5 h-3.5 shrink-0 transition-colors duration-160" />
                    </span>
                  </a>
                )}

                {profile.twitter && (
                  <a
                    href={profile.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/btn relative overflow-hidden flex items-center justify-center px-1 py-2 bg-[#F7F1E6] active:bg-[#EBDDC3] dark:bg-zinc-800/90 dark:active:bg-zinc-700 border border-[#E5DAC5] dark:border-zinc-700/80 text-[#2A2D34] dark:text-zinc-200 hover:text-[#801428] dark:hover:text-[#7DE2C5] rounded-lg text-[11px] font-semibold transition-[transform,background-color,border-color,color] duration-160 active:scale-[0.97] shadow-2xs cursor-pointer"
                    title="Twitter/X Profile"
                  >
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 rounded-[inherit] bg-white/90 dark:bg-zinc-700/80 blur-[2px] opacity-0 group-hover/btn:opacity-100 transition-opacity duration-160 pointer-events-none shadow-[inset_0_0_4px_rgba(255,255,255,0.8),0_0_8px_rgba(255,255,255,0.95)] dark:shadow-[inset_0_0_4px_rgba(125,226,197,0.3),0_0_8px_rgba(125,226,197,0.35)]"
                    />
                    <span className="relative z-10 flex items-center justify-center">
                      <XIcon className="w-3.5 h-3.5 shrink-0 transition-colors duration-160" />
                    </span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Main Bio / Narrative Section */}
          <div className="flex-1 space-y-5 w-full">
            <div>
              {isEditing ? (
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] font-bold text-[#525660] dark:text-zinc-400 uppercase tracking-widest block">Full Name</label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      className="text-2xl font-bold tracking-tight text-[#2A2D34] dark:text-zinc-100 border-b border-[#E2D5BE] dark:border-zinc-700 focus:border-[#801428] dark:focus:border-[#7DE2C5] outline-none w-full py-1 bg-transparent"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-[#525660] dark:text-zinc-400 uppercase tracking-widest block">Academic Title</label>
                      <input
                        type="text"
                        value={profile.title}
                        onChange={(e) => handleChange('title', e.target.value)}
                        className="text-[#2A2D34] dark:text-zinc-300 border-b border-[#E2D5BE] dark:border-zinc-700 focus:border-[#801428] dark:focus:border-[#7DE2C5] outline-none w-full py-1 text-sm bg-transparent"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-[#525660] dark:text-zinc-400 uppercase tracking-widest block">Affiliation</label>
                      <input
                        type="text"
                        value={profile.affiliation}
                        onChange={(e) => handleChange('affiliation', e.target.value)}
                        className="text-[#2A2D34] dark:text-zinc-300 border-b border-[#E2D5BE] dark:border-zinc-700 focus:border-[#801428] dark:focus:border-[#7DE2C5] outline-none w-full py-1 text-sm font-semibold bg-transparent"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <h1 className="text-2xl md:text-3xl font-bold text-[#2A2D34] dark:text-zinc-100 tracking-tight mb-1">
                    {profile.name}
                  </h1>
                  <p className="text-sm text-[#525660] dark:text-zinc-400 font-medium">
                    {profile.title} • <span className="font-semibold text-[#2A2D34] dark:text-zinc-200">{profile.affiliation}</span>
                  </p>
                </>
              )}
            </div>

            {/* Academic Bio Text */}
            <div className="border-t border-[#E2D5BE] dark:border-zinc-800 pt-4">
              <h2 className="text-xs font-bold text-[#525660] dark:text-zinc-500 uppercase tracking-widest mb-2.5">Biography</h2>
              {isEditing ? (
                <textarea
                  value={profile.bio}
                  onChange={(e) => handleChange('bio', e.target.value)}
                  rows={5}
                  className="w-full text-[#2A2D34] dark:text-zinc-200 text-xs sm:text-sm leading-relaxed p-3 bg-[#F3E8D3] dark:bg-zinc-800 border border-[#E2D5BE] dark:border-zinc-700 rounded-md focus:border-[#801428] dark:focus:border-[#7DE2C5] outline-none font-['Fast_Sans','Fast_Sans_Fallback',sans-serif]"
                />
              ) : (
                <div className="space-y-3 text-[#2A2D34] dark:text-zinc-300 text-xs sm:text-sm leading-relaxed font-['Fast_Sans','Fast_Sans_Fallback',sans-serif]">
                  {profile.bio.split('\n\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              )}
            </div>

            {/* Research Interests Text */}
            <div className="border-t border-[#E2D5BE] dark:border-zinc-800 pt-4">
              <h2 className="text-xs font-bold text-[#525660] dark:text-zinc-500 uppercase tracking-widest mb-2.5">Research Interests</h2>
              {isEditing ? (
                <textarea
                  value={profile.researchInterests}
                  onChange={(e) => handleChange('researchInterests', e.target.value)}
                  rows={4}
                  className="w-full text-[#2A2D34] dark:text-zinc-200 text-xs sm:text-sm leading-relaxed p-3 bg-[#F3E8D3] dark:bg-zinc-800 border border-[#E2D5BE] dark:border-zinc-700 rounded-md focus:border-[#801428] dark:focus:border-[#7DE2C5] outline-none font-['Fast_Sans','Fast_Sans_Fallback',sans-serif]"
                />
              ) : (
                <p className="text-[#2A2D34] dark:text-zinc-300 text-xs sm:text-sm leading-relaxed [hyphens:auto] [-webkit-hyphens:auto] font-['Fast_Sans','Fast_Sans_Fallback',sans-serif]">
                  {profile.researchInterests}
                </p>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
