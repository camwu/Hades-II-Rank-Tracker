/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useEffect, useRef } from 'react';
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
  RotateCcw
} from 'lucide-react';
import { RANKS, TOTAL_KUDOS, Rank, RESOURCE_ORDER } from './constants';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip as RechartsTooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis
} from 'recharts';

export default function App() {
  const [currentRankId, setCurrentRankId] = useState<number>(() => {
    const saved = localStorage.getItem('hades-rank-id');
    if (saved) {
      const parsed = parseInt(saved);
      if (RANKS.some(r => r.id === parsed)) return parsed;
    }
    return 0;
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(false);
  const [isSpentExpanded, setIsSpentExpanded] = useState(true);
  const [isRemainingExpanded, setIsRemainingExpanded] = useState(true);
  const [isResetConfirming, setIsResetConfirming] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const historyContainerRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    localStorage.setItem('hades-rank-id', currentRankId.toString());
  }, [currentRankId]);

  const currentRank = useMemo(() => 
    RANKS.find((r) => r.id === currentRankId) || RANKS[0], 
  [currentRankId]);

  const totalResources = useMemo(() => RANKS[RANKS.length - 1].cumulativeResources, []);

  const remainingResources = useMemo(() => {
    return totalResources.map(total => {
      const spent = currentRank.cumulativeResources.find(s => s.name === total.name)?.amount || 0;
      return { name: total.name, amount: total.amount - spent };
    }).filter(r => r.amount > 0);
  }, [currentRank, totalResources]);

  const progressPercentage = useMemo(() => 
    (currentRank.cumulativeKudos / TOTAL_KUDOS) * 100, 
  [currentRank]);

  const remainingKudos = TOTAL_KUDOS - currentRank.cumulativeKudos;

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
    <div id="app-root" className="h-screen bg-[#06060a] text-[#d1d1e0] font-sans overflow-hidden flex flex-col">
      {/* Header */}
      <header className="h-24 bg-[#0c0c14] border-b border-[#1a1a25] shrink-0 z-10 px-4">
        <div className="max-w-[1440px] mx-auto w-full h-full flex items-center justify-between px-6 md:px-8">
          <div className="flex items-center gap-6">
            <img src="/favicon.png" alt="" className="w-10 h-10 object-contain drop-shadow-[0_0_15px_rgba(16,185,129,0.4)]" />
            <h1 className="text-2xl md:text-3xl font-sans font-black tracking-wider text-[#10b981] uppercase truncate">Hades II Rank Tracker</h1>
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            <button 
              onClick={handleResetProgress}
              className={`flex items-center gap-2 px-3 py-2 border rounded-lg transition-all text-sm font-bold uppercase tracking-wider group ${
                isResetConfirming 
                  ? 'bg-[#f87171] border-[#f87171] text-white' 
                  : 'bg-[#161625] border-[#2a2a3a] text-[#d1d1e0]/50 hover:text-[#f87171] hover:border-[#f87171]/50'
              }`}
              title={isResetConfirming ? "Click again to confirm reset" : "Reset All Progress"}
            >
              <RotateCcw className={`w-3.5 h-3.5 transition-transform ${isResetConfirming ? 'animate-spin' : 'group-hover:rotate-[-45deg]'}`} />
              <span className="hidden sm:inline">
                {isResetConfirming ? "Confirm Reset?" : "Reset Progress"}
              </span>
            </button>
            <div className="relative group w-40 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#10b981]/50" />
              <input 
                id="search-input"
                type="text" 
                placeholder="Search..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[#161625] border border-[#2a2a3a] rounded-lg pl-10 pr-10 py-2.5 outline-none focus:border-[#10b981] transition-all w-full text-sm text-white"
              />
              <AnimatePresence>
                {searchQuery && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={() => {
                      setSearchQuery('');
                      document.getElementById('search-input')?.focus();
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-[#2a2a3a] rounded-full transition-colors text-[#d1d1e0]/50 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden justify-center bg-[#06060a]">
        <div className="flex-1 flex w-full max-w-[1440px] overflow-hidden relative border-x border-[#1a1a25] shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          {/* Sidebar */}
          <motion.aside 
            initial={false}
            animate={{ width: isSidebarCollapsed ? 64 : 350 }}
            className="bg-[#0c0c14] border-r border-[#1a1a25] flex flex-col hidden lg:flex shrink-0 relative z-20"
          >
            {/* Toggle Button Integrated into Divider */}
            <button 
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="absolute -right-3 top-[21px] z-30 flex items-center justify-center w-6 h-6 bg-[#0c0c14] border border-[#1a1a25] rounded-md shadow-lg hover:border-[#10b981]/50 transition-all text-[#10b981]/60 hover:text-[#10b981]"
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
                        <label className="text-xs uppercase tracking-widest text-[#10b981] font-bold">Progress</label>
                        <p className="text-lg font-black text-[#10b981] leading-none tracking-wide">{progressPercentage.toFixed(1)}%</p>
                      </div>
                      <div className="w-full h-4 bg-[#1a1a2a] rounded-full overflow-hidden border border-[#2a2a3a] shadow-inner p-0.5 mb-6">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${progressPercentage}%` }}
                          className="h-full bg-[#10b981] rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                        />
                      </div>

                      <div className="space-y-6">
                        <div className="bg-[#161625] rounded-lg border border-[#2a2a3a] relative overflow-hidden group">

                          <button 
                            onClick={() => setIsSpentExpanded(!isSpentExpanded)}
                            className="w-full flex items-center justify-between px-4 py-3 hover:bg-[#2a2a3a]/30 transition-colors group/header"
                          >
                            <div className="flex items-center gap-2">
                              <Target className="w-3 h-3 text-[#10b981]" />
                              <p className="text-xs uppercase opacity-70 tracking-wider font-bold whitespace-nowrap">Resources Spent</p>
                            </div>
                            <div className="p-1.5 rounded transition-colors text-[#10b981]/50 group-hover/header:text-[#10b981] group-hover/header:bg-[#2a2a3a]">
                              <motion.div animate={{ rotate: isSpentExpanded ? 90 : 0 }}>
                                <ChevronRight className="w-4 h-4" />
                              </motion.div>
                            </div>
                          </button>

                          <div className={`px-4 pt-2 transition-all ${isSpentExpanded ? 'pb-5' : 'pb-4'}`}>
                            {/* Kudos Header - Always Visible */}
                            <div className={`flex items-start gap-3 transition-all ${isSpentExpanded ? 'mb-5' : 'mb-0'}`}>
                              <div className="w-[34px] h-[34px] rounded-lg bg-[#1a1a2a] flex items-center justify-center border border-[#2a2a3a] flex-shrink-0">
                                <img src="/assets/resources/Kudos.png" alt="" className="w-5 h-5 object-contain" />
                              </div>
                              <div className="min-w-0 pt-0.5">
                                <p className="text-base text-white leading-none font-bold tracking-tight">{currentRank.cumulativeKudos.toLocaleString()}</p>
                                <p className="text-[10px] uppercase opacity-50 font-sans mt-1.5 tracking-wider">Kudos</p>
                              </div>
                            </div>

                            <motion.div
                              initial={false}
                              animate={{
                                height: isSpentExpanded ? 'auto' : 0,
                                opacity: isSpentExpanded ? 1 : 0
                              }}
                              className="overflow-hidden"
                            >
                              <div className="grid grid-cols-2 gap-y-4 gap-x-4 pt-4 border-t border-[#2a2a3a]/50 w-full">
                                {['Feather', 'Golden Apple', 'Pearl', 'Wool', 'Moon Dust', 'Cinder', 'Tears', 'Nightmare', 'Void Lens', 'Zodiac Sand'].map((resName) => {
                                  const amount = currentRank.cumulativeResources.find(r => r.name === resName)?.amount || 0;
                                  if (amount === 0) return null;
                                  
                                  return (
                                    <div key={`spent-${resName}`} className="flex items-start gap-3 min-w-0">
                                      <div className="w-[32px] h-[32px] flex-shrink-0 rounded-lg bg-[#1a1a2a] flex items-center justify-center border border-[#2a2a3a]/30">
                                        <img src={`/assets/resources/${resName.replace(/\s+/g, '_')}.png`} alt="" className="w-5 h-5 object-contain" />
                                      </div>
                                      <div className="min-w-0 pt-0.5">
                                        <p className="text-sm text-white leading-none font-bold">{amount.toLocaleString()}</p>
                                        <p className="text-[10px] uppercase opacity-50 font-sans mt-1.5 leading-tight tracking-normal">{resName === 'Golden Apple' ? 'Gold Apple' : resName}</p>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </motion.div>
                          </div>
                        </div>

                        <div className="bg-[#161625] rounded-lg border border-[#2a2a3a] relative overflow-hidden group">

                          <button 
                            onClick={() => setIsRemainingExpanded(!isRemainingExpanded)}
                            className="w-full flex items-center justify-between px-4 py-3 hover:bg-[#2a2a3a]/30 transition-colors group/header"
                          >
                            <div className="flex items-center gap-2">
                              <TrendingUp className="w-3 h-3 text-[#f97316]" />
                              <p className="text-xs uppercase opacity-70 tracking-wider font-bold whitespace-nowrap">Resources Remaining</p>
                            </div>
                            <div className="p-1.5 rounded transition-colors text-[#f97316]/50 group-hover/header:text-[#f97316] group-hover/header:bg-[#2a2a3a]">
                              <motion.div animate={{ rotate: isRemainingExpanded ? 90 : 0 }}>
                                <ChevronRight className="w-4 h-4" />
                              </motion.div>
                            </div>
                          </button>

                          <div className={`px-4 pt-2 transition-all ${isRemainingExpanded ? 'pb-5' : 'pb-4'}`}>
                            {/* Kudos Header - Always Visible */}
                            <div className={`flex items-start gap-3 transition-all ${isRemainingExpanded ? 'mb-5' : 'mb-0'}`}>
                              <div className="w-[34px] h-[34px] rounded-lg bg-[#1a1a2a] flex items-center justify-center border border-[#2a2a3a] flex-shrink-0">
                                <img src="/assets/resources/Kudos.png" alt="" className="w-5 h-5 object-contain" />
                              </div>
                              <div className="min-w-0 pt-0.5">
                                <p className="text-base text-white leading-none font-bold tracking-tight">{remainingKudos.toLocaleString()}</p>
                                <p className="text-[10px] uppercase opacity-50 font-sans mt-1.5 tracking-wider">Kudos</p>
                              </div>
                            </div>

                            <motion.div
                              initial={false}
                              animate={{
                                height: isRemainingExpanded ? 'auto' : 0,
                                opacity: isRemainingExpanded ? 1 : 0
                              }}
                              className="overflow-hidden"
                            >
                              <div className="grid grid-cols-2 gap-y-4 gap-x-4 pt-4 border-t border-[#2a2a3a]/50 w-full">
                                {['Feather', 'Golden Apple', 'Pearl', 'Wool', 'Moon Dust', 'Cinder', 'Tears', 'Nightmare', 'Void Lens', 'Zodiac Sand'].map((resName) => {
                                  const amount = totalResources.find(r => r.name === resName)?.amount 
                                      ? (totalResources.find(r => r.name === resName)!.amount - (currentRank.cumulativeResources.find(r => r.name === resName)?.amount || 0))
                                      : 0;
                                  if (amount === 0) return null;
                                  
                                  return (
                                    <div key={`rem-${resName}`} className="flex items-start gap-3 min-w-0">
                                      <div className="w-[32px] h-[32px] flex-shrink-0 rounded-lg bg-[#1a1a2a] flex items-center justify-center border border-[#2a2a3a]/30">
                                        <img src={`/assets/resources/${resName.replace(/\s+/g, '_')}.png`} alt="" className="w-5 h-5 object-contain" />
                                      </div>
                                      <div className="min-w-0 pt-0.5">
                                        <p className="text-sm text-white leading-none font-bold">{amount.toLocaleString()}</p>
                                        <p className="text-[10px] uppercase opacity-50 font-sans mt-1.5 leading-tight tracking-normal">{resName === 'Golden Apple' ? 'Gold Apple' : resName}</p>
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
          <main className="flex-1 flex flex-col bg-[#08080c] overflow-hidden relative">
            <div className="flex-1 flex flex-col w-full px-6 md:px-8 pb-6 md:pb-8 pt-4 overflow-hidden">
              <div className="grid grid-cols-[repeat(13,minmax(0,1fr))] gap-4 mb-4 text-xs uppercase tracking-widest opacity-50 px-10 font-black py-2 bg-[#08080c] sticky top-0 z-10">
              <span className="col-span-5 md:col-span-4">Rank</span>
              <div className="hidden md:block md:col-span-3 text-right">
                <span>Kudos Cost</span>
              </div>
              <div className="col-span-5 md:col-span-3 text-right">
                <span>Resource</span>
              </div>
              <span className="col-span-3 md:col-span-3 text-right">Progress</span>
            </div>

            <div className="flex-1 overflow-y-auto border border-[#2a2a3a] rounded-xl bg-[#12121e] shadow-2xl">
            <div className="grid grid-cols-1 divide-y divide-[#2a2a3a]">
              {/* Collapsible Completed Section - Pinned to top */}
              {completedRanks.length > 0 && (
                <div className="sticky top-0 bg-[#12121e] border-b border-[#2a2a3a] z-20">
                  <button 
                    onClick={() => setIsHistoryExpanded(!isHistoryExpanded)}
                    className="w-full flex items-center justify-between p-4 px-10 hover:bg-[#1a1a2a]/40 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <History className="w-4 h-4 text-[#d1d1e0] opacity-30" />
                      <span className="text-[11px] uppercase tracking-[0.2em] text-[#d1d1e0] opacity-40 font-black">
                        {completedRanks.length} Completed Ranks
                      </span>
                    </div>
                    <motion.div
                      animate={{ rotate: isHistoryExpanded ? 180 : 0 }}
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
                    className="overflow-y-auto overflow-x-hidden border-t border-[#2a2a3a]/30 bg-[#0c0c12]/50 scroll-smooth"
                  >
                    <div className="divide-y divide-[#2a2a3a]/30">
                      {completedRanks.map((rank) => {
                        const progress = (rank.cumulativeKudos / TOTAL_KUDOS) * 100;
                        return (
                          <div 
                            key={rank.id}
                            id={`rank-row-${rank.id}`}
                            onClick={() => setCurrentRankId(rank.id)}
                            className="grid grid-cols-[repeat(13,minmax(0,1fr))] gap-4 py-2.5 px-10 text-sm opacity-30 italic hover:opacity-100 hover:bg-[#1a1a2a]/20 cursor-pointer transition-all items-center"
                          >
                            <div className="col-span-5 md:col-span-4 flex items-center gap-3">
                              <div className="relative w-5 h-5 flex items-center justify-center">
                                <img 
                                  src={rank.imageUrl} 
                                  alt="" 
                                  className="w-full h-full object-contain z-10"
                                  onError={(e) => (e.currentTarget.style.display = 'none')}
                                />
                                <div 
                                  className="absolute inset-0 w-1.5 h-1.5 m-auto rounded-full ring-2 ring-transparent opacity-50" 
                                  style={{ backgroundColor: rank.colorHex }}
                                />
                              </div>
                              <span className="text-base truncate">{rank.name}</span>
                            </div>
                            <div className="hidden md:flex md:col-span-3 items-center justify-end gap-2 opacity-80">
                              {rank.id > 0 ? (
                                <>
                                  <span className="text-sm leading-none">{rank.kudos.toLocaleString()}</span>
                                  <img src="/assets/resources/Kudos.png" alt="" className="w-4 h-4 object-contain" />
                                </>
                              ) : (
                                <span className="text-sm opacity-30">—</span>
                              )}
                            </div>
                            <div className="col-span-5 md:col-span-3 flex items-center justify-end gap-3 opacity-90 min-w-0">
                               {rank.id > 0 ? (
                                 <>
                                   <span className="text-sm leading-tight text-right">{rank.bossResourceQty}x {rank.bossResourceName}</span>
                                   <img src={rank.bossResourceImageUrl} alt="" className="w-5 h-5 object-contain flex-shrink-0" />
                                 </>
                               ) : (
                                 <span className="text-sm opacity-30">—</span>
                               )}
                             </div>
                            <div className="col-span-3 md:col-span-3 flex items-center gap-3 justify-end">
                               <div className="w-20 h-1 bg-[#1a1a2a] rounded-full overflow-hidden opacity-30">
                                 <div className="h-full" style={{ width: `${progress}%`, backgroundColor: '#10b981' }} />
                               </div>
                               <span className="font-bold opacity-70 min-w-[40px] text-right text-sm">{progress.toFixed(1)}%</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                </div>
              )}

              {/* Active Section */}
              {activeRanks.map((rank) => {
                const isCurrent = rank.id === currentRankId;
                const progress = (rank.cumulativeKudos / TOTAL_KUDOS) * 100;

                return (
                  <div 
                    key={rank.id}
                    id={`rank-row-${rank.id}`}
                    onClick={() => setCurrentRankId(rank.id)}
                    className={`
                      grid grid-cols-[repeat(13,minmax(0,1fr))] gap-4 transition-all cursor-pointer group items-center
                      ${isCurrent ? 'bg-[#1a1a2a] border-l-4 border-[#10b981] text-white shadow-[inset_4px_0_15_rgba(16,185,129,0.1)] py-4 px-10 text-sm' : 'bg-transparent py-2 px-10 text-sm text-[#d1d1e0]/80 border-l border-transparent hover:bg-[#1a1a2a]/40'}
                    `}
                  >
                    <div className="col-span-5 md:col-span-4 flex items-center gap-3">
                      <div className="relative w-11 h-11 flex items-center justify-center">
                        <img 
                          src={rank.imageUrl} 
                          alt="" 
                          className="w-full h-full object-contain z-10"
                          onError={(e) => (e.currentTarget.style.display = 'none')}
                        />
                        <div 
                          className="absolute inset-0 w-1.5 h-1.5 m-auto rounded-full ring-4 ring-transparent group-hover:ring-current/10" 
                          style={{ backgroundColor: rank.colorHex }}
                        />
                      </div>
                      <span className={`text-base ${isCurrent ? 'font-bold text-[#10b981]' : ''} truncate`}>{rank.name}</span>
                    </div>
                    <div className="hidden md:flex md:col-span-3 items-center justify-end gap-2 opacity-90">
                      {rank.id > 0 ? (
                        <>
                          <span className="text-sm leading-none">{rank.kudos.toLocaleString()}</span>
                          <img src="/assets/resources/Kudos.png" alt="" className="w-4 h-4 object-contain" />
                        </>
                      ) : (
                        <span className="text-sm opacity-30">—</span>
                      )}
                    </div>
                    <div className="col-span-5 md:col-span-3 flex items-center justify-end gap-3 opacity-100 min-w-0">
                      {rank.id > 0 ? (
                        <>
                          <span className="text-sm leading-tight group-hover:text-white transition-colors text-right">{rank.bossResourceQty}x {rank.bossResourceName}</span>
                          <img src={rank.bossResourceImageUrl} alt="" className={`${isCurrent ? 'w-6 h-6' : 'w-5 h-5'} object-contain flex-shrink-0`} />
                        </>
                      ) : (
                        <span className="text-sm opacity-30">—</span>
                      )}
                    </div>
                    <div className="col-span-3 md:col-span-3 flex items-center gap-3 justify-end">
                       <div className="w-20 h-2 bg-[#1a1a2a] rounded-full overflow-hidden border border-[#2a2a3a]/50">
                         <div className="h-full opacity-80" style={{ width: `${progress}%`, backgroundColor: '#10b981' }} />
                       </div>
                       <span className="font-bold opacity-70 min-w-[40px] text-right text-sm">{progress.toFixed(1)}%</span>
                    </div>
                  </div>
                );
              })}

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

      <footer className="py-4 bg-[#080810] border-t border-[#2a2a3a] px-8 flex flex-col md:flex-row items-center justify-between text-[10px] uppercase tracking-widest opacity-60 shrink-0 gap-4">
        <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-center">
          <a 
            href="https://github.com/camwu/hades-2-rank-tracker" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-[#10b981] transition-colors"
          >
            <Github className="w-3.5 h-3.5" />
            <span>GitHub Repository</span>
          </a>
          {lastUpdated && (
            <span className="opacity-50">Last Updated: {lastUpdated}</span>
          )}
        </div>
        <div className="text-center md:text-right opacity-40 px-4 leading-relaxed">
          <p>Hades II Rank Tracker is an unofficial, fan-developed project that is not affiliated with or endorsed by Supergiant Games.</p>
          <p>Hades II and all related characters and assets are the sole property of Supergiant Games.</p>
        </div>
      </footer>
    </div>
  );
}
