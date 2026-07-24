import React, { useRef, useState } from 'react';
import { Mail, Phone, MapPin, Github, Linkedin, Twitter, FileText, BookOpen, RotateCcw, Camera, Check } from 'lucide-react';
import { Profile } from '../types';

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
    <div id="header-section" className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-sm overflow-hidden mb-6 transition-all duration-300">
      {/* Visual Accent Banner */}
      <div className="h-1.5 bg-zinc-900 dark:bg-blue-600" />

      <div className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row gap-8 items-start">

          {/* Avatar and Info Grid */}
          <div className="w-full md:w-1/4 flex flex-col items-center">
            <div className="relative group mb-2">
              <img
                src={profile.avatarUrl || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400&h=400"}
                alt={profile.name}
                className="w-32 md:w-40 h-auto rounded-lg border-2 border-zinc-200 dark:border-zinc-700 shadow-xs transition-all duration-300"
                referrerPolicy="no-referrer"
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
                    className="absolute inset-0 bg-zinc-900/80 rounded-lg flex flex-col items-center justify-center p-3 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer text-white"
                  >
                    <Camera className="w-5 h-5 mb-1.5 text-blue-400" />
                    <span className="text-[11px] font-bold">Upload Photo</span>
                    <span className="text-[8px] text-zinc-300 mt-1 font-mono">PNG, JPG, WebP</span>
                  </button>
                </>
              )}
            </div>

            {/* Academic Social & Contact Coordinates with descriptive text inside */}
            <div className="w-full flex flex-col gap-1.5 mt-2 font-sans">
              {profile.googleScholar && (
                <a
                  href={profile.googleScholar}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-zinc-50 dark:bg-zinc-800/80 hover:bg-zinc-100 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700/80 hover:border-zinc-300 dark:hover:border-zinc-600 text-zinc-700 dark:text-zinc-200 rounded text-xs font-semibold transition-all shadow-2xs"
                  title="Google Scholar Citations"
                >
                  <GoogleScholarIcon className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
                  <span>Google Scholar</span>
                </a>
              )}

              {profile.email && (
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-zinc-50 dark:bg-zinc-800/80 hover:bg-zinc-100 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700/80 hover:border-zinc-300 dark:hover:border-zinc-600 text-zinc-700 dark:text-zinc-200 rounded text-xs font-semibold cursor-pointer transition-all active:scale-[0.98] shadow-2xs"
                  title="Click to copy email address"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 animate-fadeIn" />
                      <span className="text-emerald-700 dark:text-emerald-400">Email Copied!</span>
                    </>
                  ) : (
                    <>
                      <Mail className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
                      <span>Copy Email</span>
                    </>
                  )}
                </button>
              )}

              {profile.cvUrl && (
                <a
                  href={profile.cvUrl}
                  download={`${profile.name.replace(/\s+/g, '_')}_CV.pdf`}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-zinc-50 dark:bg-zinc-800/80 hover:bg-zinc-100 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700/80 hover:border-zinc-300 dark:hover:border-zinc-600 text-zinc-700 dark:text-zinc-200 rounded text-xs font-semibold transition-all shadow-2xs cursor-pointer"
                  title="Download Curriculum Vitae"
                >
                  <FileText className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400 shrink-0" />
                  <span>Curriculum Vitae</span>
                </a>
              )}

              {/* LinkedIn and X buttons, resized to 1/2 length each */}
              <div className="grid grid-cols-2 gap-1.5 w-full">
                {profile.linkedin && (
                  <a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center px-1 py-2 bg-zinc-50 dark:bg-zinc-800/80 hover:bg-zinc-100 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700/80 hover:border-zinc-300 dark:hover:border-zinc-600 text-zinc-700 dark:text-zinc-200 rounded text-[11px] font-semibold transition-all shadow-2xs"
                    title="LinkedIn Profile"
                  >
                    <Linkedin className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400 shrink-0" />
                  </a>
                )}

                {profile.twitter && (
                  <a
                    href={profile.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center px-1 py-2 bg-zinc-50 dark:bg-zinc-800/80 hover:bg-zinc-100 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700/80 hover:border-zinc-300 dark:hover:border-zinc-600 text-zinc-700 dark:text-zinc-200 rounded text-[11px] font-semibold transition-all shadow-2xs"
                    title="Twitter/X Profile"
                  >
                    <XIcon className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400 shrink-0" />
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
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">Full Name</label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 border-b border-zinc-200 dark:border-zinc-700 focus:border-blue-600 outline-none w-full py-1 bg-transparent"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">Academic Title</label>
                      <input
                        type="text"
                        value={profile.title}
                        onChange={(e) => handleChange('title', e.target.value)}
                        className="text-zinc-700 dark:text-zinc-300 border-b border-zinc-200 dark:border-zinc-700 focus:border-blue-600 outline-none w-full py-1 text-sm bg-transparent"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">Affiliation</label>
                      <input
                        type="text"
                        value={profile.affiliation}
                        onChange={(e) => handleChange('affiliation', e.target.value)}
                        className="text-zinc-700 dark:text-zinc-300 border-b border-zinc-200 dark:border-zinc-700 focus:border-blue-600 outline-none w-full py-1 text-sm font-semibold bg-transparent"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <h1 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight mb-1">
                    {profile.name}
                  </h1>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">
                    {profile.title} • <span className="font-semibold text-zinc-800 dark:text-zinc-200">{profile.affiliation}</span>
                  </p>
                </>
              )}
            </div>

            {/* Academic Bio Text */}
            <div className="border-t border-zinc-100 dark:border-zinc-800 pt-4">
              <h2 className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-2.5">Biography</h2>
              {isEditing ? (
                <textarea
                  value={profile.bio}
                  onChange={(e) => handleChange('bio', e.target.value)}
                  rows={4}
                  className="w-full text-zinc-700 dark:text-zinc-200 text-xs leading-relaxed p-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md focus:border-blue-600 outline-none"
                />
              ) : (
                <p className="text-zinc-700 dark:text-zinc-300 text-sm leading-relaxed">
                  {profile.bio}
                </p>
              )}
            </div>

            {/* Research Interests Text */}
            <div className="border-t border-zinc-100 dark:border-zinc-800 pt-4">
              <h2 className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-2.5">Research Interests</h2>
              {isEditing ? (
                <textarea
                  value={profile.researchInterests}
                  onChange={(e) => handleChange('researchInterests', e.target.value)}
                  rows={4}
                  className="w-full text-zinc-700 dark:text-zinc-200 text-xs leading-relaxed p-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md focus:border-blue-600 outline-none"
                />
              ) : (
                <p className="text-zinc-700 dark:text-zinc-300 text-sm leading-relaxed">
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
