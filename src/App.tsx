import React, { useState, useEffect } from 'react';
import { BookOpen, ArrowUp } from 'lucide-react';
import { Profile, Paper, AcademicExperience, ResearchArea } from './types';
import {
  INITIAL_PROFILE,
  INITIAL_RESEARCH_AREAS,
  INITIAL_PAPERS,
  INITIAL_EXPERIENCES
} from './data';

import HeaderCard from './components/HeaderCard';
import ResearchInterestsCard from './components/ResearchInterestsCard';
import PublicationsSection from './components/PublicationsSection';
import AcademicTimeline from './components/AcademicTimeline';

export default function App() {
  // Static data loaded directly from source files
  const profile = INITIAL_PROFILE;
  const areas = INITIAL_RESEARCH_AREAS;
  const papers = INITIAL_PAPERS;
  const experiences = INITIAL_EXPERIENCES;

  const [activeTab, setActiveTab] = useState<'about' | 'focus' | 'pubs' | 'cv'>('about');
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Back to top scroll listener
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Helper to scroll smoothly to a specific section element
  const scrollToSection = (id: string, tabName: typeof activeTab) => {
    setActiveTab(tabName);
    const element = document.getElementById(id);
    if (element) {
      const navbarHeight = 56;
      const breathingRoom = 24;
      const totalOffset = navbarHeight + breathingRoom;
      
      const elementTop = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementTop - totalOffset,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 flex flex-col pb-12 selection:bg-blue-100 selection:text-blue-900">
      
      {/* Sticky Main Scholarly Navigation Bar */}
      <header className="sticky top-0 bg-white/90 backdrop-blur-md border-b border-zinc-200 z-40 transition-all duration-300">
        <div className="max-w-5xl mx-auto px-4 md:px-6 h-14 flex items-center justify-between">
          {/* Logo / Title */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => scrollToSection('header-section', 'about')}>
            <div className="w-7 h-7 rounded bg-zinc-900 flex items-center justify-center text-white shadow-xs text-xs font-bold font-sans">
              {profile.websiteIcon ? (
                <span>{profile.websiteIcon}</span>
              ) : (
                <BookOpen className="w-3.5 h-3.5" />
              )}
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight text-zinc-900 block leading-tight">{profile.websiteTitle || profile.name || "Academic Portfolio"}</span>
              <span className="text-[9px] font-mono text-blue-700 font-bold block uppercase tracking-wider">Academic Portfolio</span>
            </div>
          </div>

          {/* Quick Scroll Links */}
          <nav className="hidden md:flex items-center gap-5 text-[11px] font-bold uppercase tracking-wider">
            <button
              onClick={() => scrollToSection('header-section', 'about')}
              className={`pb-1 border-b-2 transition-all cursor-pointer ${
                activeTab === 'about' ? 'border-blue-700 text-zinc-900' : 'border-transparent text-zinc-500 hover:text-zinc-800'
              }`}
            >
              Biography
            </button>
            <button
              onClick={() => scrollToSection('interests-section', 'focus')}
              className={`pb-1 border-b-2 transition-all cursor-pointer ${
                activeTab === 'focus' ? 'border-blue-700 text-zinc-900' : 'border-transparent text-zinc-500 hover:text-zinc-800'
              }`}
            >
              Research
            </button>
            <button
              onClick={() => scrollToSection('publications-section', 'pubs')}
              className={`pb-1 border-b-2 transition-all cursor-pointer ${
                activeTab === 'pubs' ? 'border-blue-700 text-zinc-900' : 'border-transparent text-zinc-500 hover:text-zinc-800'
              }`}
            >
              Publications
            </button>
            <button
              onClick={() => scrollToSection('cv-section', 'cv')}
              className={`pb-1 border-b-2 transition-all cursor-pointer ${
                activeTab === 'cv' ? 'border-blue-700 text-zinc-900' : 'border-transparent text-zinc-500 hover:text-zinc-800'
              }`}
            >
              CV & Timeline
            </button>
          </nav>

          {/* Dummy element for alignment in flex layout */}
          <div className="w-14 h-1 md:hidden"></div>
        </div>
      </header>

      {/* Main Structural Container */}
      <main className="max-w-5xl mx-auto px-4 md:px-6 pt-6 flex-1 w-full space-y-6">
        
        {/* Profile Card & Narrative Bio */}
        <HeaderCard
          profile={profile}
          isEditing={false}
          onUpdateProfile={() => {}}
          onReset={() => {}}
          hasLocalChanges={false}
        />

        {/* Focus Areas Grid */}
        <ResearchInterestsCard
          areas={areas}
          isEditing={false}
          onUpdateAreas={() => {}}
        />

        {/* Publications Bibliography */}
        <PublicationsSection
          papers={papers}
          profile={profile}
          isEditing={false}
          onUpdatePapers={() => {}}
        />

        {/* Academic timeline */}
        <AcademicTimeline
          experiences={experiences}
          isEditing={false}
          onUpdateExperiences={() => {}}
        />

        {/* Subtle bottom details */}
        <footer className="text-center text-zinc-400 text-xs py-6 border-t border-zinc-200/60 max-w-2xl mx-auto space-y-1">
          <p className="font-medium text-zinc-500 text-[11px]">Last Updated on Jul 2026</p>
          <p className="text-[10px] text-zinc-400">© {new Date().getFullYear()} {profile.name}. All rights reserved.</p>
        </footer>

      </main>

      {/* Floating Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-40 bg-zinc-900 text-white hover:bg-zinc-800 p-2.5 rounded-full shadow-lg cursor-pointer transition-all hover:scale-110 flex items-center justify-center animate-fadeIn group border border-zinc-700"
          title="Back to Top"
        >
          <ArrowUp className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
        </button>
      )}
    </div>
  );
}
