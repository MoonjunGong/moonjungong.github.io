import React, { useState, useEffect } from 'react';
import { ArrowUp, Sun, Moon, BookOpen } from 'lucide-react';
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

  // Dark mode state with localStorage persistence and OS preference detection
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Apply dark mode class to html element and persist preference
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // Listen for dynamic OS theme changes (e.g., automatic sunset/sunrise switches)
  useEffect(() => {
    if (!window.matchMedia) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      // Follow OS changes dynamically if user hasn't manually pinned a theme override
      const savedTheme = localStorage.getItem('theme');
      if (!savedTheme) {
        setIsDarkMode(e.matches);
      }
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleSystemThemeChange);
    } else {
      mediaQuery.addListener(handleSystemThemeChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleSystemThemeChange);
      } else {
        mediaQuery.removeListener(handleSystemThemeChange);
      }
    };
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  // Helper to dynamically render websiteIcon
  const renderWebsiteIcon = () => {
    return <BookOpen className="w-3.5 h-3.5" />;
  };

  const isManualScrollingRef = React.useRef(false);
  const isScrollingToTopRef = React.useRef(false);
  const manualScrollTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  // Back to top scroll listener & Active Tab ScrollSpy
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = Math.max(
        window.scrollY || 0,
        document.documentElement.scrollTop || 0,
        document.body.scrollTop || 0
      );

      // Manage Back to Top visibility
      if (isScrollingToTopRef.current) {
        if (scrollY <= 50) {
          isScrollingToTopRef.current = false;
          setShowBackToTop(false);
        }
      } else {
        if (scrollY > 300) {
          setShowBackToTop(true);
        } else {
          setShowBackToTop(false);
        }
      }

      // Do not auto-update active tab if user manually clicked a tab
      if (isManualScrollingRef.current) {
        if (manualScrollTimeoutRef.current) {
          clearTimeout(manualScrollTimeoutRef.current);
        }
        manualScrollTimeoutRef.current = setTimeout(() => {
          isManualScrollingRef.current = false;
        }, 150);
        return;
      }

      const sectionList: Array<{ id: string; tab: 'about' | 'focus' | 'pubs' | 'cv' }> = [
        { id: 'header-section', tab: 'about' },
        { id: 'interests-section', tab: 'focus' },
        { id: 'publications-section', tab: 'pubs' },
        { id: 'cv-section', tab: 'cv' },
      ];

      const isAtBottom = window.innerHeight + scrollY >= document.documentElement.scrollHeight - 60;
      if (isAtBottom) {
        setActiveTab('cv');
        return;
      }

      const targetThreshold = 140;
      let currentTab: 'about' | 'focus' | 'pubs' | 'cv' = 'about';

      for (const item of sectionList) {
        const el = document.getElementById(item.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= targetThreshold) {
            currentTab = item.tab;
          }
        }
      }

      setActiveTab(currentTab);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (manualScrollTimeoutRef.current) {
        clearTimeout(manualScrollTimeoutRef.current);
      }
    };
  }, []);

  const scrollToTop = () => {
    isScrollingToTopRef.current = true;
    setShowBackToTop(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Helper to scroll smoothly to a specific section element
  const scrollToSection = (id: string, tabName: typeof activeTab) => {
    setActiveTab(tabName);
    isManualScrollingRef.current = true;

    if (manualScrollTimeoutRef.current) {
      clearTimeout(manualScrollTimeoutRef.current);
    }

    if (tabName === 'about') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const element = document.getElementById(id);
      if (element) {
        const navbarHeight = 64;
        const breathingRoom = 16;
        const totalOffset = navbarHeight + breathingRoom;
        const scrollY = Math.max(
          window.scrollY || 0,
          document.documentElement.scrollTop || 0,
          document.body.scrollTop || 0
        );

        const elementTop = element.getBoundingClientRect().top + scrollY;

        window.scrollTo({
          top: Math.max(0, elementTop - totalOffset),
          behavior: 'smooth'
        });
      }
    }

    manualScrollTimeoutRef.current = setTimeout(() => {
      isManualScrollingRef.current = false;
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#F3E8D3] dark:bg-zinc-950 text-[#2A2D34] dark:text-zinc-100 flex flex-col pb-12 selection:bg-[#801428]/20 selection:text-[#801428] dark:selection:bg-teal-900 dark:selection:text-teal-100 transition-colors duration-300">
      
      {/* Fixed Floating Navigation Bar */}
      <header className="fixed top-3 sm:top-4 left-0 right-0 z-50 w-full max-w-5xl mx-auto px-4 md:px-6 flex justify-center pointer-events-none transition-all duration-300">
        <div 
          className="pointer-events-auto w-[calc(100%+10px)] -mx-[5px] bg-[#FAF5EB]/[0.01] dark:bg-zinc-900/[0.01] backdrop-blur-md backdrop-saturate-150 border border-[#E2D5BE]/70 dark:border-zinc-800/70 shadow-sm shadow-black/5 dark:shadow-black/20 rounded-xl sm:rounded-2xl px-4 md:px-5 h-12 sm:h-14 flex items-center justify-between transition-all duration-300"
          style={{
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)'
          }}
        >
          {/* Logo / Title - Hidden on mobile */}
          <div className="hidden sm:flex items-center gap-2 cursor-pointer" onClick={() => scrollToSection('header-section', 'about')}>
            <div className="w-7 h-7 rounded-lg bg-[#801428] dark:bg-[#7DE2C5] flex items-center justify-center text-white dark:text-zinc-900 shadow-xs text-xs font-bold font-sans">
              {renderWebsiteIcon()}
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight text-[#2A2D34] dark:text-zinc-100 block leading-tight">{profile.websiteTitle || profile.name || "Academic Portfolio"}</span>
              <span className="text-[9px] font-mono text-[#801428] dark:text-[#7DE2C5] font-bold block uppercase tracking-wider">Academic Portfolio</span>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
            {/* Quick Scroll Links */}
            <nav className="flex items-center justify-between sm:justify-start w-full sm:w-auto gap-3 sm:gap-5 text-[11px] font-bold uppercase tracking-wider">
              <button
                onClick={() => scrollToSection('header-section', 'about')}
                className={`pb-1 border-b-2 transition-all duration-200 cursor-pointer ${
                  activeTab === 'about' ? 'border-[#801428] dark:border-[#7DE2C5] text-[#2A2D34] dark:text-zinc-100' : 'border-transparent text-[#525660] dark:text-zinc-400 hover:text-[#801428] dark:hover:text-[#7DE2C5]'
                }`}
              >
                Biography
              </button>
              <button
                onClick={() => scrollToSection('interests-section', 'focus')}
                className={`pb-1 border-b-2 transition-all duration-200 cursor-pointer ${
                  activeTab === 'focus' ? 'border-[#801428] dark:border-[#7DE2C5] text-[#2A2D34] dark:text-zinc-100' : 'border-transparent text-[#525660] dark:text-zinc-400 hover:text-[#801428] dark:hover:text-[#7DE2C5]'
                }`}
              >
                Research
              </button>
              <button
                onClick={() => scrollToSection('publications-section', 'pubs')}
                className={`pb-1 border-b-2 transition-all duration-200 cursor-pointer ${
                  activeTab === 'pubs' ? 'border-[#801428] dark:border-[#7DE2C5] text-[#2A2D34] dark:text-zinc-100' : 'border-transparent text-[#525660] dark:text-zinc-400 hover:text-[#801428] dark:hover:text-[#7DE2C5]'
                }`}
              >
                Publications
              </button>
              <button
                onClick={() => scrollToSection('cv-section', 'cv')}
                className={`pb-1 border-b-2 transition-all duration-200 cursor-pointer ${
                  activeTab === 'cv' ? 'border-[#801428] dark:border-[#7DE2C5] text-[#2A2D34] dark:text-zinc-100' : 'border-transparent text-[#525660] dark:text-zinc-400 hover:text-[#801428] dark:hover:text-[#7DE2C5]'
                }`}
              >
                Timeline
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Structural Container */}
      <main className="max-w-5xl mx-auto px-4 md:px-6 pt-20 sm:pt-24 flex-1 w-full space-y-6">
        
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
        <footer className="text-center text-[#525660] dark:text-zinc-400 text-xs py-6 border-t border-[#E2D5BE] dark:border-zinc-800/80 max-w-2xl mx-auto space-y-1">
          <p className="font-medium text-[#2A2D34] dark:text-zinc-400 text-[11px]">
            Last Updated on {import.meta.env.VITE_BUILD_DATE || 'Jul 2026'}
          </p>
          <p className="text-[10px] text-[#525660] dark:text-zinc-400">© {new Date().getFullYear()} {profile.name}. All rights reserved.</p>
        </footer>

      </main>

      {/* Floating Action Buttons Stack (Bottom Right) */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-2.5 items-center">
        {showBackToTop && (
          <button
            onClick={(e) => {
              e.currentTarget.blur();
              scrollToTop();
            }}
            className="bg-white dark:bg-white hover:bg-zinc-100 dark:hover:bg-zinc-100 text-[#2A2D34] dark:text-[#2A2D34] p-2.5 rounded-full shadow-lg cursor-pointer transition-all active:scale-95 sm:hover:scale-105 flex items-center justify-center animate-fadeIn group border border-[#E2D5BE] dark:border-zinc-300 backdrop-blur-xs select-none touch-manipulation focus:outline-none"
            title="Back to Top"
            aria-label="Back to Top"
          >
            <ArrowUp className="w-4 h-4 transition-transform sm:group-hover:-translate-y-0.5 text-[#2A2D34]" />
          </button>
        )}

        <button
          onClick={(e) => {
            e.currentTarget.blur();
            toggleDarkMode();
          }}
          className="bg-white dark:bg-white hover:bg-zinc-100 dark:hover:bg-zinc-100 text-[#2A2D34] dark:text-[#2A2D34] p-2.5 rounded-full shadow-lg cursor-pointer transition-all active:scale-95 sm:hover:scale-105 flex items-center justify-center border border-[#E2D5BE] dark:border-zinc-300 backdrop-blur-xs select-none touch-manipulation focus:outline-none"
          title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDarkMode ? (
            <Sun className="w-4 h-4 text-amber-500 fill-amber-400 transition-transform sm:hover:rotate-45" />
          ) : (
            <Moon className="w-4 h-4 text-[#2A2D34] fill-[#2A2D34] transition-transform sm:hover:-rotate-12" />
          )}
        </button>
      </div>
    </div>
  );
}
