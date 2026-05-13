/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight,
  History
} from 'lucide-react';
import { RANKS, TOTAL_KUDOS, TOTAL_RESOURCES, Rank } from './constants';
import { RankRow } from './components/RankRow';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

export default function App() {
  const [currentRankId, setCurrentRankId] = useState<number>(() => {
    // 1. Check URL first
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const rankParam = urlParams.get('rank');
      if (rankParam) {
        const parsed = parseInt(rankParam);
        if (parsed >= 0 && parsed < RANKS.length) return parsed;
      }
    }

    // 2. Fallback to localStorage
    const saved = localStorage.getItem('hades-rank-id');
    if (saved) {
      const parsed = parseInt(saved);
      if (parsed >= 0 && parsed < RANKS.length) return parsed;
    }
    return 0;
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileStatsOpen, setIsMobileStatsOpen] = useState(false);
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(false);
  const [isSpentExpanded, setIsSpentExpanded] = useState(true);
  const [isRemainingExpanded, setIsRemainingExpanded] = useState(true);
  const [isResetConfirming, setIsResetConfirming] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const [lastUpdated] = useState<string>(() => {
    // Use the build-time constant provided by Vite
    return (import.meta.env.VITE_LAST_UPDATED as string) || '';
  });
  const historyContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 1024;
  
  const handleRankClick = useCallback((id: number) => {
    setCurrentRankId(id);
    if (isMobile) setIsMobileStatsOpen(false);
  }, [isMobile]);

  const handleResetProgress = () => {
    if (!isResetConfirming) {
      setIsResetConfirming(true);
      // Auto-cancel after 3 seconds if not clicked again
      setTimeout(() => setIsResetConfirming(false), 3000);
      return;
    }
    
    localStorage.removeItem('hades-rank-id');
    setCurrentRankId(0);
    setIsHistoryExpanded(false);
    setIsResetConfirming(false);
  };
  
  useEffect(() => {
    if (isHistoryExpanded && historyContainerRef.current) {
      // Use a brief timeout to ensure the container has height before scrolling
      const timeoutId = setTimeout(() => {
        if (historyContainerRef.current) {
          historyContainerRef.current.scrollTop = historyContainerRef.current.scrollHeight;
        }
      }, 50);
      return () => clearTimeout(timeoutId);
    }
  }, [isHistoryExpanded, currentRankId]);

  const currentRank = useMemo(() => 
    RANKS.find((r) => r.id === currentRankId) || RANKS[0], 
  [currentRankId]);

  const remainingResources = useMemo(() => {
    const order = ['Feather', 'Golden Apple', 'Pearl', 'Wool', 'Moon Dust', 'Cinder', 'Tears', 'Nightmare', 'Void Lens', 'Zodiac Sand'];
    return TOTAL_RESOURCES.map(total => {
      const spent = currentRank.cumulativeResources.find(s => s.name === total.name)?.amount || 0;
      return { name: total.name, amount: total.amount - spent };
    })
    .filter(r => r.amount > 0)
    .sort((a, b) => order.indexOf(a.name) - order.indexOf(b.name));
  }, [currentRank]);

  const progressPercentage = useMemo(() => 
    (currentRank.cumulativeKudos / TOTAL_KUDOS) * 100, 
  [currentRank]);

  const remainingKudos = TOTAL_KUDOS - currentRank.cumulativeKudos;
  const prevRemainingKudosRef = useRef(remainingKudos);
  
  const spentKudos = currentRank.cumulativeKudos;
  const prevSpentKudosRef = useRef(spentKudos);

  useEffect(() => {
    if (remainingKudos === 0) {
      setIsRemainingExpanded(false);
    } else if (prevRemainingKudosRef.current === 0 && remainingKudos > 0) {
      // Only auto-expand if we transition from 0 back to having remaining kudos
      setIsRemainingExpanded(true);
    }
    prevRemainingKudosRef.current = remainingKudos;
  }, [remainingKudos]);

  useEffect(() => {
    if (spentKudos === 0) {
      setIsSpentExpanded(false);
    } else if (prevSpentKudosRef.current === 0 && spentKudos > 0) {
      // Only auto-expand if we transition from 0 to having spent kudos
      setIsSpentExpanded(true);
    }
    prevSpentKudosRef.current = spentKudos;
  }, [spentKudos]);

  useEffect(() => {
    localStorage.setItem('hades-rank-id', currentRankId.toString());
    
    // Sync to URL
    const url = new URL(window.location.href);
    if (currentRankId === 0) {
      url.searchParams.delete('rank');
    } else {
      url.searchParams.set('rank', currentRankId.toString());
    }
    window.history.replaceState({}, '', url);
  }, [currentRankId]);

  const filteredRanks = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return RANKS;
    return RANKS.filter((r) => 
      r.name.toLowerCase().includes(query) ||
      r.colorName.toLowerCase().includes(query) ||
      r.bossResourceName.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const completedRanks = useMemo(() => 
    filteredRanks.filter(r => r.id < currentRankId),
  [filteredRanks, currentRankId]);

  useEffect(() => {
    if (searchQuery && completedRanks.length > 0) {
      setIsHistoryExpanded(true);
    } else if (!searchQuery) {
      setIsHistoryExpanded(false);
    }
  }, [searchQuery, completedRanks.length]);

  const activeRanks = useMemo(() => 
    filteredRanks.filter(r => r.id >= currentRankId),
  [filteredRanks, currentRankId]);

  const statsData = [
    { name: 'Completed', value: currentRank.cumulativeKudos },
    { name: 'Remaining', value: remainingKudos },
  ];

  useEffect(() => {
    const element = document.getElementById(`rank-row-${currentRankId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [currentRankId]);

  return (
    <div id="app-root" className="h-screen bg-hades-bg text-hades-text font-sans overflow-hidden flex flex-col">
      <Header 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isResetConfirming={isResetConfirming}
        handleResetProgress={handleResetProgress}
        setIsMobileStatsOpen={setIsMobileStatsOpen}
        searchInputRef={searchInputRef}
        isMobile={isMobile}
        windowWidth={windowWidth}
      />

      <div className="flex flex-1 overflow-hidden justify-center bg-hades-bg">
        <div className="flex-1 flex w-full max-w-[1440px] overflow-hidden relative border-x border-hades-border shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          {/* Mobile Overlay / Backdrop */}
          <AnimatePresence>
            {isMobileStatsOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileStatsOpen(false)}
                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
              />
            )}
          </AnimatePresence>

          <Sidebar 
            currentRank={currentRank}
            remainingKudos={remainingKudos}
            spentKudos={spentKudos}
            progressPercentage={progressPercentage}
            remainingResources={remainingResources}
            isSidebarCollapsed={isSidebarCollapsed}
            setIsSidebarCollapsed={setIsSidebarCollapsed}
            isSpentExpanded={isSpentExpanded}
            setIsSpentExpanded={setIsSpentExpanded}
            isRemainingExpanded={isRemainingExpanded}
            setIsRemainingExpanded={setIsRemainingExpanded}
            isMobile={isMobile}
            isMobileStatsOpen={isMobileStatsOpen}
            setIsMobileStatsOpen={setIsMobileStatsOpen}
          />

          {/* Main Content */}
          <main className="flex-1 flex flex-col bg-hades-bg-main overflow-hidden relative">
            <div className="flex-1 flex flex-col w-full px-4 md:px-8 pb-6 md:pb-8 pt-4 overflow-hidden">
              <div className="grid grid-cols-[repeat(13,minmax(0,1fr))] gap-2 md:gap-4 mb-4 text-xs md:text-xs uppercase tracking-widest opacity-50 pl-1 pr-3 md:pl-9 md:pr-10 font-black py-2 bg-hades-bg-main sticky top-0 z-10 transition-all">
                <span className="col-span-6 md:col-span-4">Rank</span>
                <div className="col-span-3 md:col-span-3 text-right pr-3">
                  <span className="hidden sm:inline">Kudos Cost</span>
                  <span className="sm:hidden">Kudos</span>
                </div>
                <div className="col-span-4 md:col-span-3 text-right">
                  <span className="hidden sm:inline">Resource</span>
                  <span className="sm:hidden">Resource</span>
                </div>
                <span className="hidden md:block md:col-span-3 text-right">Progress</span>
              </div>

            <div className="flex-1 overflow-y-auto border border-hades-border-light rounded-xl bg-hades-bg-light shadow-2xl">
            <div className="grid grid-cols-1 divide-y divide-hades-border-light">
              {/* Collapsible Completed Section - Pinned to top */}
              {completedRanks.length > 0 && (
                <div className="sticky top-0 bg-hades-bg-light border-b border-hades-border-light z-20">
                  <button 
                    onClick={() => setIsHistoryExpanded(!isHistoryExpanded)}
                    className="w-full flex items-center justify-between py-1.5 md:py-2 pl-1 pr-3 md:pl-9 md:pr-10 hover:bg-hades-border/40 transition-colors group outline-none focus-visible:bg-hades-border/60 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-hades-accent/40"
                  >
                    <div className="flex items-center gap-2 md:gap-4">
                      <div className="w-8 h-8 md:w-11 md:h-11 flex-shrink-0 flex items-center justify-center">
                        <History className="w-3.5 h-3.5 md:w-4 md:h-4 text-hades-text opacity-30" />
                      </div>
                      <span className="text-xs uppercase tracking-wider text-hades-text opacity-40 font-bold">
                        {completedRanks.length} Completed Ranks
                      </span>
                    </div>
                    <motion.div
                      animate={{ rotate: isHistoryExpanded ? 90 : 0 }}
                      className="opacity-40 group-hover:opacity-100 transition-opacity"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </motion.div>
                  </button>
                  
                  <motion.div
                    ref={historyContainerRef}
                    initial={false}
                    animate={{ 
                      height: isHistoryExpanded ? 'auto' : 0,
                      maxHeight: isHistoryExpanded ? '300px' : 0,
                      opacity: isHistoryExpanded ? 1 : 0
                    }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-y-auto overflow-x-hidden border-t border-hades-border-light/30 bg-hades-bg-dark/50 scroll-smooth"
                  >
                    <div className="divide-y divide-hades-border-light/30">
                      {completedRanks.map((rank) => (
                        <RankRow 
                          key={rank.id}
                          rank={rank}
                          isCurrent={false}
                          isCompleted={true}
                          isHistoryExpanded={isHistoryExpanded}
                          onClick={handleRankClick}
                          totalKudos={TOTAL_KUDOS}
                        />
                      ))}
                    </div>
                  </motion.div>
                </div>
              )}

              {/* Active Section */}
              {activeRanks.map((rank) => (
                <RankRow 
                  key={rank.id}
                  rank={rank}
                  isCurrent={rank.id === currentRankId}
                  isCompleted={false}
                  onClick={handleRankClick}
                  totalKudos={TOTAL_KUDOS}
                />
              ))}

              {filteredRanks.length === 0 && (
                <div className="p-12 text-center opacity-40 text-sm italic">
                  No records found
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>

      <Footer lastUpdated={lastUpdated} />
    </div>
  );
}
