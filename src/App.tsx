/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useEffect, useRef, memo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  Search, 
  Target, 
  Info, 
  ArrowRight,
  TrendingUp,
  Skull,
  Github,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  ChevronLeft,
  ChevronRight,
  History,
  RotateCcw,
  BarChart2,
  Menu
} from 'lucide-react';
import { RANKS, TOTAL_KUDOS, TOTAL_RESOURCES, Rank, RESOURCE_ORDER } from './constants';

const RankRow = memo(({ 
  rank, 
  isCurrent, 
  isCompleted, 
  isHistoryExpanded,
  onClick, 
  totalKudos
}: { 
  rank: Rank; 
  isCurrent: boolean; 
  isCompleted: boolean; 
  isHistoryExpanded?: boolean;
  onClick: (id: number) => void;
  totalKudos: number;
}) => {
  const progress = (rank.cumulativeKudos / totalKudos) * 100;

  if (isCompleted) {
    return (
      <button 
        id={`rank-row-${rank.id}`}
        onClick={() => onClick(rank.id)}
        tabIndex={isHistoryExpanded ? 0 : -1}
        aria-hidden={!isHistoryExpanded}
        className="grid grid-cols-[repeat(13,minmax(0,1fr))] gap-2 md:gap-4 py-0.5 pl-1 pr-3 md:pl-9 md:pr-10 text-[11px] md:text-sm opacity-30 italic hover:opacity-100 hover:bg-hades-border/20 focus-visible:opacity-100 focus-visible:not-italic focus-visible:bg-hades-accent/5 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-hades-accent/40 cursor-pointer transition-all items-center w-full text-left outline-none border-l-4 border-transparent"
      >
        <div className="col-span-6 md:col-span-4 flex items-center gap-2 md:gap-4">
          <div className="relative w-8 h-8 md:w-11 md:h-11 flex flex-shrink-0 items-center justify-center">
            <img 
              src={rank.imageUrl} 
              alt="" 
              className="w-full h-full object-contain z-10"
              loading="lazy"
              style={{ filter: rank.id > 0 ? `drop-shadow(0 0 10px ${rank.colorHex}33)` : 'none' }}
              onError={(e) => (e.currentTarget.style.display = 'none')}
            />
          </div>
          <span className="text-xs md:text-base font-medium">{rank.name}</span>
        </div>
        <div className="col-span-3 md:col-span-3 flex items-center justify-end gap-1 md:gap-2 opacity-80 pr-3">
          {rank.id > 0 ? (
            <>
              <span className="text-[10px] md:text-sm leading-none">{rank.kudos.toLocaleString()}</span>
              <img src="/assets/resources/Kudos.png" alt="" className="w-3.5 h-3.5 md:w-4 md:h-4 object-contain" loading="lazy" />
            </>
          ) : (
            <span className="text-sm opacity-30">—</span>
          )}
        </div>
        <div className="col-span-4 md:col-span-3 flex items-center justify-end gap-1 md:gap-3 opacity-90 min-w-0">
          {rank.id > 0 ? (
            <>
              <span className="text-[10px] md:text-sm leading-tight text-right truncate">
                {rank.bossResourceQty}x <span className="hidden lg:inline">{rank.bossResourceName}</span>
              </span>
              <img src={rank.bossResourceImageUrl} alt="" className="w-4 h-4 md:w-5 md:h-5 object-contain flex-shrink-0" loading="lazy" />
            </>
          ) : (
            <span className="text-sm opacity-30">—</span>
          )}
        </div>
        <div className="hidden md:flex md:col-span-3 items-center gap-3 justify-end">
          <div className="hidden sm:block w-20 h-1 bg-hades-border rounded-full overflow-hidden opacity-30">
            <div className="h-full" style={{ width: `${progress}%`, backgroundColor: '#10b981' }} />
          </div>
          <span className="font-bold opacity-70 min-w-[35px] md:min-w-[40px] text-right text-xs md:text-sm">{progress.toFixed(1)}%</span>
        </div>
      </button>
    );
  }

  return (
    <button 
      id={`rank-row-${rank.id}`}
      onClick={() => onClick(rank.id)}
      className={`
        grid grid-cols-[repeat(13,minmax(0,1fr))] gap-2 md:gap-4 transition-all cursor-pointer group items-center w-full text-left outline-none
        ${isCurrent 
          ? 'bg-hades-border border-l-4 border-hades-accent text-white shadow-[inset_4px_0_15_rgba(16,185,129,0.1)] py-2.5 pl-1 pr-3 md:pl-9 md:pr-10 text-xs md:text-sm focus-visible:bg-hades-border/80' 
          : 'bg-transparent py-1.5 md:py-2 pl-1 pr-3 md:pl-9 md:pr-10 text-xs md:text-sm text-hades-text/80 border-l-4 border-transparent hover:bg-hades-border/40 focus-visible:bg-hades-accent/5'}
        focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-hades-accent/40
      `}
    >
      <div className="col-span-6 md:col-span-4 flex items-center gap-2 md:gap-4">
        <div className="relative w-8 h-8 md:w-11 md:h-11 flex-shrink-0 flex items-center justify-center p-1">
          <img 
            src={rank.imageUrl} 
            alt="" 
            className="w-full h-full object-contain relative z-10 transition-transform group-hover:scale-110"
            loading="lazy"
            style={{ filter: rank.id > 0 ? `drop-shadow(0 0 10px ${rank.colorHex}33)` : 'none' }}
            onError={(e) => (e.currentTarget.style.display = 'none')}
          />
        </div>
        <span className={`text-xs md:text-base ${isCurrent ? 'font-bold text-hades-accent' : 'font-medium'}`}>{rank.name}</span>
      </div>
      <div className="col-span-3 md:col-span-3 flex items-center justify-end gap-1 md:gap-2 opacity-90 pr-3">
        {rank.id > 0 ? (
          <>
            <span className="font-bold text-[11px] md:text-sm">{rank.kudos.toLocaleString()}</span>
            <img src="/assets/resources/Kudos.png" alt="" className="w-3.5 h-3.5 md:w-4 md:h-4 object-contain" />
          </>
        ) : (
          <span className="text-[10px] uppercase opacity-40 font-black tracking-widest">—</span>
        )}
      </div>
      <div className="col-span-4 md:col-span-3 flex items-center justify-end gap-1 md:gap-3 opacity-90 min-w-0">
        {rank.id > 0 ? (
          <>
            <span className="text-[11px] md:text-sm leading-tight group-hover:text-white transition-colors text-right truncate">
              {rank.bossResourceQty}x <span className="hidden lg:inline">{rank.bossResourceName}</span>
            </span>
            <img src={rank.bossResourceImageUrl} alt="" className={`${isCurrent ? 'w-5 h-5 md:w-6 md:h-6' : 'w-4 h-4 md:w-5 md:h-5'} object-contain flex-shrink-0`} loading="lazy" />
          </>
        ) : (
          <span className="text-[10px] uppercase opacity-40 font-black tracking-widest">—</span>
        )}
      </div>
      <div className="hidden md:flex md:col-span-3 items-center gap-3 justify-end">
         <div className="hidden sm:block w-20 h-2 bg-hades-border rounded-full overflow-hidden border border-hades-border-light/50">
           <div className="h-full opacity-80" style={{ width: `${progress}%`, backgroundColor: '#10b981' }} />
         </div>
         <span className="font-bold opacity-70 min-w-[35px] md:min-w-[40px] text-right text-xs md:text-sm">{progress.toFixed(1)}%</span>
      </div>
    </button>
  );
});

export default function App() {
  const [currentRankId, setCurrentRankId] = useState<number>(() => {
    // 1. Check URL first
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const rankParam = urlParams.get('rank');
      if (rankParam) {
        const parsed = parseInt(rankParam);
        if (RANKS.some(r => r.id === parsed)) return parsed;
      }
    }

    // 2. Fallback to localStorage
    const saved = localStorage.getItem('hades-rank-id');
    if (saved) {
      const parsed = parseInt(saved);
      if (RANKS.some(r => r.id === parsed)) return parsed;
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
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const historyContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 1024;

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
    setSearchQuery('');
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

  useEffect(() => {
    fetch('https://api.github.com/repos/camwu/hades-2-rank-tracker/commits/main')
      .then(res => res.json())
      .then(data => {
        if (data.commit?.committer?.date) {
          const date = new Date(data.commit.committer.date);
          setLastUpdated(date.toLocaleDateString(undefined, { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          }));
        }
      })
      .catch(() => {});
  }, []);

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

  const filteredRanks = useMemo(() => 
    RANKS.filter((r) => 
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.colorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.bossResourceName.toLowerCase().includes(searchQuery.toLowerCase())
    ), 
  [searchQuery]);

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
      {/* Header */}
      <header className="min-h-24 bg-hades-bg-dark border-b border-hades-border shrink-0 z-10 px-4 py-4 lg:py-0">
        <div className="max-w-[1440px] mx-auto w-full h-full flex flex-col lg:flex-row items-center justify-between px-2 lg:px-8 gap-4 lg:gap-0">
          <div className="flex items-center gap-3 lg:gap-6 w-full lg:w-auto justify-center lg:justify-start">
            <img 
              src="/favicon.png" 
              alt="" 
              className="w-8 h-8 md:w-10 md:h-10 object-contain drop-shadow-[0_0_15px_rgba(16,185,129,0.4)]" 
              loading="lazy"
            />
            <h1 className="text-xl lg:text-3xl font-sans font-black tracking-wider text-hades-accent uppercase truncate">
              Hades II Rank Tracker
            </h1>
          </div>

          <div className="flex items-center gap-3 lg:gap-6 w-full lg:w-auto justify-center lg:justify-end">
            <div className="flex items-center gap-2 lg:gap-4 shrink-0">
              <button 
                onClick={() => setIsMobileStatsOpen(true)}
                className="lg:hidden h-10 w-10 flex items-center justify-center bg-hades-panel border border-hades-border-light rounded-lg text-hades-accent hover:bg-hades-border-light transition-colors outline-none focus-visible:ring-2 focus-visible:ring-hades-accent"
                title="View stats"
              >
                <BarChart2 className="w-5 h-5" />
              </button>
              <button 
                onClick={handleResetProgress}
                className={`flex items-center gap-2 px-3 h-10 border rounded-lg transition-all text-xs md:text-sm font-bold uppercase tracking-wider group outline-none focus-visible:ring-2 focus-visible:ring-hades-red focus-visible:ring-offset-2 focus-visible:ring-offset-hades-bg focus-visible:bg-hades-red/20 ${
                  isResetConfirming 
                    ? 'bg-hades-red border-hades-red text-white' 
                    : 'bg-hades-panel border-hades-border-light text-hades-text/50 hover:text-hades-red hover:border-hades-red/50'
                }`}
                title={isResetConfirming ? "Click again to confirm reset" : "Reset All Progress"}
              >
                <RotateCcw className={`w-3.5 h-3.5 transition-transform ${isResetConfirming ? 'animate-spin' : 'group-hover:rotate-[-45deg]'}`} />
                <span className="whitespace-nowrap">
                  {isResetConfirming ? (
                    <>
                      <span className="hidden sm:inline">Confirm Reset</span>
                      <span className="sm:hidden">Confirm</span>
                    </>
                  ) : (
                    <>
                      <span className="hidden sm:inline">Reset Progress</span>
                      <span className="sm:hidden">Reset</span>
                    </>
                  )}
                </span>
              </button>
            </div>
            <div className="relative group w-full lg:w-64 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-hades-accent/50" />
              <input 
                ref={searchInputRef}
                id="search-input"
                type="text" 
                placeholder="Search..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-hades-panel border border-hades-border-light rounded-lg pl-10 pr-10 h-10 outline-none focus:border-hades-accent transition-all w-full text-sm text-white"
              />
              <AnimatePresence>
                {searchQuery && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={() => {
                      setSearchQuery('');
                      searchInputRef.current?.focus();
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-hades-border-light rounded-full transition-colors text-hades-text/50 hover:text-white outline-none focus-visible:ring-2 focus-visible:ring-hades-accent focus-visible:bg-hades-border-light"
                  >
                    <X className="w-3.5 h-3.5" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

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

          {/* Sidebar */}
          <motion.aside 
            initial={false}
            animate={{ 
              width: isMobile ? 320 : (isSidebarCollapsed ? 64 : 350),
              x: isMobile ? (isMobileStatsOpen ? 0 : -320) : 0
            }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`
              bg-hades-bg-dark border-r border-hades-border flex flex-col shrink-0
              ${isMobile ? 'fixed inset-y-0 left-0 z-50 shadow-2xl' : 'relative z-20'}
              ${!isMobile || isMobileStatsOpen ? 'flex' : 'hidden lg:flex'}
            `}
          >
            {/* Mobile Header / Close */}
            <div className="lg:hidden flex items-center justify-between p-6 border-b border-hades-border-light shrink-0">
              <h2 className="text-sm font-black uppercase tracking-[0.2em] text-hades-accent">Statistics</h2>
              <button 
                onClick={() => setIsMobileStatsOpen(false)}
                className="p-1 hover:bg-hades-border-light rounded-full transition-colors text-hades-text/50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Toggle Button Integrated into Divider (Desktop Only) */}
            <button 
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="absolute -right-3 top-[21px] z-30 hidden lg:flex items-center justify-center w-6 h-6 bg-hades-bg-dark border border-hades-border rounded-md shadow-lg hover:border-hades-accent/50 transition-all text-hades-accent/60 hover:text-hades-accent outline-none focus-visible:ring-2 focus-visible:ring-hades-accent focus-visible:border-hades-accent"
              title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {isSidebarCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
            </button>

            <div className={`flex-1 flex flex-col gap-6 overflow-y-auto px-8 pb-8 pt-6 ${isSidebarCollapsed ? 'items-center overflow-x-hidden' : ''}`}>
              {!isSidebarCollapsed ? (
                <>
                  <section>
                    <div className="mb-2">
                      <div className="flex justify-between items-baseline mb-2">
                        <label className="text-xs uppercase tracking-widest text-hades-accent font-bold">Progress</label>
                        <p className="text-lg font-black text-hades-accent leading-none tracking-wide">{progressPercentage.toFixed(1)}%</p>
                      </div>
                      <div className="w-full h-4 bg-hades-border rounded-full overflow-hidden border border-hades-border-light shadow-inner p-0.5 mb-6">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${progressPercentage}%` }}
                          className="h-full bg-hades-accent rounded-full shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                        />
                      </div>

                      <div className="space-y-6">
                        <div className="bg-hades-panel rounded-lg border border-hades-border-light relative overflow-hidden group">

                          <button 
                            onClick={() => setIsSpentExpanded(!isSpentExpanded)}
                            className="w-full flex items-center justify-between px-4 py-3 hover:bg-hades-border-light/30 transition-colors group/header outline-none focus-visible:bg-hades-border-light/50 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-hades-accent/40"
                          >
                            <div className="flex items-center gap-2">
                              <Target className="w-3 h-3 text-hades-accent" />
                              <p className="text-xs uppercase opacity-70 tracking-wider font-bold whitespace-nowrap">Resources Spent</p>
                            </div>
                            <div className="p-1.5 rounded transition-colors text-hades-accent/50 group-hover/header:text-hades-accent group-hover/header:bg-hades-border-light">
                              <motion.div animate={{ rotate: isSpentExpanded ? 90 : 0 }}>
                                <ChevronRight className="w-4 h-4" />
                              </motion.div>
                            </div>
                          </button>

                          <div className={`px-4 transition-all ${isSpentExpanded ? 'pt-2 pb-5' : (spentKudos > 0 || currentRank.cumulativeResources.length > 0 ? 'pt-2 pb-4' : 'p-0 h-0')}`}>
                            {/* Kudos Header */}
                            {spentKudos > 0 && (
                              <div className={`flex items-start gap-3 transition-all ${isSpentExpanded ? 'mb-5' : 'mb-0'}`}>
                                <div className="w-[34px] h-[34px] rounded-lg bg-hades-border flex items-center justify-center border border-hades-border-light flex-shrink-0">
                                  <img src="/assets/resources/Kudos.png" alt="" className="w-5 h-5 object-contain" loading="lazy" />
                                </div>
                                <div className="min-w-0 pt-0.5">
                                  <p className="text-base text-white leading-none font-bold tracking-tight">{spentKudos.toLocaleString()}</p>
                                  <p className="text-[10px] uppercase opacity-50 font-sans mt-1.5 tracking-wider">Kudos</p>
                                </div>
                              </div>
                            )}

                            <motion.div
                              initial={false}
                              animate={{
                                height: isSpentExpanded ? 'auto' : 0,
                                opacity: isSpentExpanded ? 1 : 0
                              }}
                              className="overflow-hidden"
                            >
                              <div className="grid grid-cols-2 gap-y-4 gap-x-4 pt-4 border-t border-hades-border-light/50 w-full">
                                {['Feather', 'Golden Apple', 'Pearl', 'Wool', 'Moon Dust', 'Cinder', 'Tears', 'Nightmare', 'Void Lens', 'Zodiac Sand'].map((resName) => {
                                  const amount = currentRank.cumulativeResources.find(r => r.name === resName)?.amount || 0;
                                  if (amount === 0) return null;
                                  
                                  return (
                                    <div key={`spent-${resName}`} className="flex items-start gap-3 min-w-0">
                                      <div className="w-[32px] h-[32px] flex-shrink-0 rounded-lg bg-hades-border flex items-center justify-center border border-hades-border-light/30">
                                        <img src={`/assets/resources/${resName.replace(/\s+/g, '_')}.png`} alt="" className="w-5 h-5 object-contain" loading="lazy" />
                                      </div>
                                      <div className="min-w-0 pt-0.5">
                                        <p className="text-sm text-white leading-none font-bold">{amount.toLocaleString()}</p>
                                        <p className="text-[9px] uppercase opacity-50 font-sans mt-1 leading-tight tracking-tight">{resName === 'Golden Apple' ? 'Gold Apple' : resName}</p>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </motion.div>
                          </div>
                        </div>

                        <div className="bg-hades-panel rounded-lg border border-hades-border-light relative overflow-hidden group">

                          <button 
                            onClick={() => setIsRemainingExpanded(!isRemainingExpanded)}
                            className="w-full flex items-center justify-between px-4 py-3 hover:bg-hades-border-light/30 transition-colors group/header outline-none focus-visible:bg-hades-border-light/50 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-hades-accent/40"
                          >
                            <div className="flex items-center gap-2">
                              <TrendingUp className="w-3 h-3 text-hades-orange" />
                              <p className="text-xs uppercase opacity-70 tracking-wider font-bold whitespace-nowrap">Resources Remaining</p>
                            </div>
                            <div className="p-1.5 rounded transition-colors text-hades-orange/50 group-hover/header:text-hades-orange group-hover/header:bg-hades-border-light">
                              <motion.div animate={{ rotate: isRemainingExpanded ? 90 : 0 }}>
                                <ChevronRight className="w-4 h-4" />
                              </motion.div>
                            </div>
                          </button>

                          <div className={`px-4 transition-all ${isRemainingExpanded ? 'pt-2 pb-5' : (remainingKudos > 0 || remainingResources.length > 0 ? 'pt-2 pb-4' : 'p-0 h-0')}`}>
                            {/* Kudos Header */}
                            {remainingKudos > 0 && (
                              <div className={`flex items-start gap-3 transition-all ${isRemainingExpanded ? 'mb-5' : 'mb-0'}`}>
                                <div className="w-[34px] h-[34px] rounded-lg bg-hades-border flex items-center justify-center border border-hades-border-light flex-shrink-0">
                                  <img src="/assets/resources/Kudos.png" alt="" className="w-5 h-5 object-contain" loading="lazy" />
                                </div>
                                <div className="min-w-0 pt-0.5">
                                  <p className="text-base text-white leading-none font-bold tracking-tight">{remainingKudos.toLocaleString()}</p>
                                  <p className="text-[10px] uppercase opacity-50 font-sans mt-1.5 tracking-wider">Kudos</p>
                                </div>
                              </div>
                            )}

                            <motion.div
                              initial={false}
                              animate={{
                                height: isRemainingExpanded ? 'auto' : 0,
                                opacity: isRemainingExpanded ? 1 : 0
                              }}
                              className="overflow-hidden"
                            >
                              <div className="grid grid-cols-2 gap-y-4 gap-x-4 pt-4 border-t border-hades-border-light/50 w-full">
                                {['Feather', 'Golden Apple', 'Pearl', 'Wool', 'Moon Dust', 'Cinder', 'Tears', 'Nightmare', 'Void Lens', 'Zodiac Sand'].map((resName) => {
                                  const resource = remainingResources.find(r => r.name === resName);
                                  if (!resource) return null;
                                  const amount = resource.amount;
                                  
                                  return (
                                    <div key={`rem-${resName}`} className="flex items-start gap-3 min-w-0">
                                      <div className="w-[32px] h-[32px] flex-shrink-0 rounded-lg bg-hades-border flex items-center justify-center border border-hades-border-light/30">
                                        <img src={`/assets/resources/${resName.replace(/\s+/g, '_')}.png`} alt="" className="w-5 h-5 object-contain" loading="lazy" />
                                      </div>
                                      <div className="min-w-0 pt-0.5">
                                        <p className="text-sm text-white leading-none font-bold">{amount.toLocaleString()}</p>
                                        <p className="text-[9px] uppercase opacity-50 font-sans mt-1 leading-tight tracking-tight">{resName === 'Golden Apple' ? 'Gold Apple' : resName}</p>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </motion.div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                </>
              ) : null}
            </div>
          </motion.aside>

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
                      <span className="text-[10px] uppercase tracking-[0.2em] text-hades-text opacity-40 font-black">
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
                          onClick={(id) => {
                            setCurrentRankId(id);
                            if (isMobile) setIsMobileStatsOpen(false);
                          }}
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
                  onClick={(id) => {
                    setCurrentRankId(id);
                    if (isMobile) setIsMobileStatsOpen(false);
                  }}
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

      <footer className="py-2.5 md:py-4 bg-hades-bg-main border-t border-hades-border-light px-4 md:px-8 flex flex-col md:flex-row items-center justify-between text-[10px] uppercase tracking-widest opacity-60 shrink-0 gap-2.5 md:gap-4">
        <div className="flex flex-col md:flex-row gap-2.5 md:gap-8 items-center">
          <a 
            href="https://github.com/camwu/hades-2-rank-tracker" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-hades-accent transition-colors"
          >
            <Github className="w-3.5 h-3.5" />
            <span>GitHub</span>
          </a>
          {lastUpdated && (
            <span className="opacity-50 hidden sm:inline">Updated: {lastUpdated}</span>
          )}
        </div>
        <div className="text-center md:text-right opacity-40 px-2 leading-tight md:leading-relaxed">
          <p className="hidden md:block">Hades II Rank Tracker is an unofficial, fan-developed project that is not affiliated with or endorsed by Supergiant Games.</p>
          <p className="md:hidden">Unofficial fan-developed project.</p>
          <p>Hades II characters and assets property of Supergiant Games.</p>
        </div>
      </footer>
    </div>
  );
}
