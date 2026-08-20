import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
      <header className="fixed top-2.5 sm:top-4 left-0 right-0 z-50 w-full max-w-5xl mx-auto px-3 sm:px-4 md:px-6 flex justify-center pointer-events-none transition-[top,transform] duration-200">
        <div 
          className="pointer-events-auto w-full bg-[#FAF5EB]/80 hover:bg-[#FAF5EB]/95 dark:bg-zinc-900/80 dark:hover:bg-zinc-900/95 backdrop-blur-md hover:backdrop-blur-lg backdrop-saturate-150 border border-[#E2D5BE]/80 hover:border-[#E2D5BE] dark:border-zinc-800/80 dark:hover:border-zinc-700 shadow-xs hover:shadow-md hover:shadow-black/5 dark:hover:shadow-black/30 rounded-xl sm:rounded-2xl px-2 xs:px-3 sm:px-4 md:px-5 h-11 sm:h-14 flex items-center justify-between transition-[background-color,border-color,box-shadow] duration-200 group/nav"
          style={{
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)'
          }}
        >
          {/* Logo / Title - Hidden on mobile */}
          <div className="hidden sm:flex items-center gap-2 cursor-pointer select-none" onClick={() => scrollToSection('header-section', 'about')}>
            <div className="w-7 h-7 rounded-lg bg-[#801428] dark:bg-[#7DE2C5] flex items-center justify-center text-white dark:text-zinc-900 shadow-xs text-xs font-bold font-sans">
              {renderWebsiteIcon()}
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight text-[#2A2D34] dark:text-zinc-100 block leading-tight">{profile.websiteTitle || profile.name || "Academic Portfolio"}</span>
              <span className="text-[9px] font-mono text-[#801428] dark:text-[#7DE2C5] font-bold block uppercase tracking-wider">Academic Portfolio</span>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto">
            {/* Quick Scroll Links with Sliding Active Pill */}
            <nav className="flex items-center justify-between sm:justify-start w-full sm:w-auto gap-0.5 sm:gap-1.5 text-[11px] font-bold uppercase tracking-wider select-none relative">
              {[
                { id: 'header-section', key: 'about' as const, label: 'Biography', shortLabel: 'Bio' },
                { id: 'interests-section', key: 'focus' as const, label: 'Research', shortLabel: 'Research' },
                { id: 'publications-section', key: 'pubs' as const, label: 'Publications', shortLabel: 'Papers' },
                { id: 'cv-section', key: 'cv' as const, label: 'Timeline', shortLabel: 'Timeline' },
              ].map((item) => {
                const isActive = activeTab === item.key;
                return (
                  <button
                    key={item.key}
                    onClick={() => scrollToSection(item.id, item.key)}
                    className={`relative flex-1 sm:flex-initial text-center px-2 xs:px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-bold tracking-tight sm:tracking-wider uppercase transition-[color,transform] duration-160 cursor-pointer active:scale-95 whitespace-nowrap ${
                      isActive
                        ? 'text-[#801428] dark:text-[#7DE2C5]'
                        : 'text-[#525660] dark:text-zinc-400 hover:text-[#801428] dark:hover:text-[#7DE2C5]'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="nav-active-pill"
                        className="absolute inset-0 bg-[#801428]/10 dark:bg-teal-950/60 rounded-lg border border-[#801428]/25 dark:border-teal-700/60 shadow-2xs"
                        transition={{ type: 'spring', duration: 0.35, bounce: 0.15 }}
                      />
                    )}
                    <span className="relative z-10 hidden sm:inline">{item.label}</span>
                    <span className="relative z-10 sm:hidden inline">{item.shortLabel}</span>
                  </button>
                );
              })}
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
        <AnimatePresence>
          {showBackToTop && (
            <motion.button
              key="back-to-top"
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 8 }}
              transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
              onClick={(e) => {
                e.currentTarget.blur();
                scrollToTop();
              }}
              className="bg-white dark:bg-white hover:bg-zinc-100 dark:hover:bg-zinc-100 text-[#2A2D34] dark:text-[#2A2D34] p-2.5 rounded-full shadow-lg cursor-pointer transition-[transform,background-color,border-color] duration-160 active:scale-95 sm:hover:scale-105 flex items-center justify-center group border border-[#E2D5BE] dark:border-zinc-300 backdrop-blur-xs select-none touch-manipulation focus:outline-none"
              title="Back to Top"
              aria-label="Back to Top"
            >
              <ArrowUp className="w-4 h-4 transition-transform duration-160 sm:group-hover:-translate-y-0.5 text-[#2A2D34]" />
            </motion.button>
          )}
        </AnimatePresence>

        <button
          onClick={(e) => {
            e.currentTarget.blur();
            toggleDarkMode();
          }}
          className="bg-white dark:bg-white hover:bg-zinc-100 dark:hover:bg-zinc-100 text-[#2A2D34] dark:text-[#2A2D34] p-2.5 rounded-full shadow-lg cursor-pointer transition-[transform,background-color,border-color] duration-160 active:scale-95 sm:hover:scale-105 flex items-center justify-center border border-[#E2D5BE] dark:border-zinc-300 backdrop-blur-xs select-none touch-manipulation focus:outline-none"
          title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDarkMode ? (
            <Sun className="w-4 h-4 text-amber-500 fill-amber-400 transition-transform duration-200 sm:hover:rotate-45" />
          ) : (
            <Moon className="w-4 h-4 text-[#2A2D34] fill-[#2A2D34] transition-transform duration-200 sm:hover:-rotate-12" />
          )}
        </button>
      </div>
    </div>
  );
}
