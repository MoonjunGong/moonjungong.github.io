import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
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

  // Helper to dynamically render websiteIcon from Lucide
  const renderWebsiteIcon = () => {
    const iconName = profile.websiteIcon || "BookOpen";
    const IconComponent = (Icons as any)[iconName];
    if (IconComponent) {
      return <IconComponent className="w-3.5 h-3.5" />;
    }
    return <span className="text-sm leading-none flex items-center justify-center font-sans">{iconName}</span>;
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

    const element = document.getElementById(id);
    if (element) {
      const navbarHeight = 56;
      const breathingRoom = 20;
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

    manualScrollTimeoutRef.current = setTimeout(() => {
      isManualScrollingRef.current = false;
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col pb-12 selection:bg-blue-100 dark:selection:bg-blue-900 selection:text-blue-900 dark:selection:text-blue-100 transition-colors duration-300">
      
      {/* Sticky Main Scholarly Navigation Bar */}
      <header className="sticky top-0 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 z-40 transition-all duration-300">
        <div className="max-w-5xl mx-auto px-4 md:px-6 h-14 flex items-center justify-between">
          {/* Logo / Title - Hidden on mobile */}
          <div className="hidden sm:flex items-center gap-2 cursor-pointer" onClick={() => scrollToSection('header-section', 'about')}>
            <div className="w-7 h-7 rounded bg-zinc-900 dark:bg-blue-600 flex items-center justify-center text-white shadow-xs text-xs font-bold font-sans">
              {renderWebsiteIcon()}
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight text-zinc-900 dark:text-zinc-100 block leading-tight">{profile.websiteTitle || profile.name || "Academic Portfolio"}</span>
              <span className="text-[9px] font-mono text-blue-700 dark:text-blue-400 font-bold block uppercase tracking-wider">Academic Portfolio</span>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
            {/* Quick Scroll Links */}
            <nav className="flex items-center justify-between sm:justify-start w-full sm:w-auto gap-3 sm:gap-5 text-[11px] font-bold uppercase tracking-wider">
              <button
                onClick={() => scrollToSection('header-section', 'about')}
                className={`pb-1 border-b-2 transition-all cursor-pointer ${
                  activeTab === 'about' ? 'border-blue-700 dark:border-blue-400 text-zinc-900 dark:text-zinc-100' : 'border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200'
                }`}
              >
                Biography
              </button>
              <button
                onClick={() => scrollToSection('interests-section', 'focus')}
                className={`pb-1 border-b-2 transition-all cursor-pointer ${
                  activeTab === 'focus' ? 'border-blue-700 dark:border-blue-400 text-zinc-900 dark:text-zinc-100' : 'border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200'
                }`}
              >
                Research
              </button>
              <button
                onClick={() => scrollToSection('publications-section', 'pubs')}
                className={`pb-1 border-b-2 transition-all cursor-pointer ${
                  activeTab === 'pubs' ? 'border-blue-700 dark:border-blue-400 text-zinc-900 dark:text-zinc-100' : 'border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200'
                }`}
              >
                Publications
              </button>
              <button
                onClick={() => scrollToSection('cv-section', 'cv')}
                className={`pb-1 border-b-2 transition-all cursor-pointer ${
                  activeTab === 'cv' ? 'border-blue-700 dark:border-blue-400 text-zinc-900 dark:text-zinc-100' : 'border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200'
                }`}
              >
                Timeline
              </button>
            </nav>
          </div>
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
          <p className="font-medium text-zinc-500 text-[11px]">
            Last Updated on {import.meta.env.VITE_BUILD_DATE || 'Jul 2026'}
          </p>
          <p className="text-[10px] text-zinc-400">© {new Date().getFullYear()} {profile.name}. All rights reserved.</p>
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
            className="bg-zinc-900/90 text-white hover:bg-zinc-800 dark:bg-white/90 dark:text-zinc-900 dark:hover:bg-zinc-100 p-2.5 rounded-full shadow-lg cursor-pointer transition-all active:scale-95 sm:hover:scale-105 flex items-center justify-center animate-fadeIn group border border-zinc-700/80 dark:border-zinc-200/80 backdrop-blur-xs select-none touch-manipulation focus:outline-none"
            title="Back to Top"
            aria-label="Back to Top"
          >
            <Icons.ArrowUp className="w-4 h-4 transition-transform sm:group-hover:-translate-y-0.5" />
          </button>
        )}

        <button
          onClick={(e) => {
            e.currentTarget.blur();
            toggleDarkMode();
          }}
          className="bg-white/90 dark:bg-zinc-900/90 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-100 p-2.5 rounded-full shadow-lg cursor-pointer transition-all active:scale-95 sm:hover:scale-105 flex items-center justify-center border border-zinc-200/80 dark:border-zinc-700/80 backdrop-blur-xs select-none touch-manipulation focus:outline-none"
          title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDarkMode ? (
            <Icons.Sun className="w-4 h-4 text-orange-500 fill-orange-400 transition-transform sm:hover:rotate-45" />
          ) : (
            <Icons.Moon className="w-4 h-4 text-indigo-950 fill-indigo-900 transition-transform sm:hover:-rotate-12" />
          )}
        </button>
      </div>
    </div>
  );
}
