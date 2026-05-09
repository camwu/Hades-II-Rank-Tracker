/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  Search, 
  ChevronRight, 
  Target, 
  Info, 
  ArrowRight,
  TrendingUp,
  Skull,
  Github
} from 'lucide-react';
import { RANKS, TOTAL_KUDOS, Rank } from './constants';
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
    return 1;
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  
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

  const progressPercentage = useMemo(() => 
    (currentRank.cumulativeKudos / TOTAL_KUDOS) * 100, 
  [currentRank]);

  const remainingKudos = TOTAL_KUDOS - currentRank.cumulativeKudos;

  const filteredRanks = useMemo(() => 
    RANKS.filter((r) => 
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.colorName.toLowerCase().includes(searchQuery.toLowerCase())
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
    <div id="app-root" className="h-screen bg-[#0c0c12] text-[#d1d1e0] font-sans selection:bg-[#a855f7]/30 selection:text-white overflow-hidden flex flex-col">
      {/* Header */}
      <header className="h-24 flex items-center justify-between px-8 bg-[#12121e] border-b border-[#2a2a3a] shrink-0 z-10">
        <div>
          <h1 className="text-3xl font-sans font-black tracking-wider text-[#10b981] uppercase drop-shadow-[0_0_20px_rgba(16,185,129,0.4)]">Hades 2 Rank Tracker</h1>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-80 bg-[#0e0e16] border-r border-[#2a2a3a] p-8 flex flex-col gap-8 hidden lg:flex shrink-0 overflow-y-auto custom-scrollbar">
          <section>
            <div className="mb-6">
              <label className="text-xs uppercase tracking-widest text-[#10b981] block mb-2 font-bold">Current Rank</label>
              <div className="bg-[#12121e] border border-[#2a2a3a] rounded-xl p-4 flex items-center gap-4 shadow-lg">
                <div className="w-12 h-12 bg-[#1a1a2a] rounded-lg flex items-center justify-center border border-[#2a2a3a]/50">
                  <img 
                    src={currentRank.imageUrl} 
                    alt="" 
                    className="w-8 h-8 object-contain"
                    onError={(e) => (e.currentTarget.style.display = 'none')}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-lg font-black text-white uppercase truncate tracking-wide">{currentRank.name}</p>
                </div>
              </div>
            </div>

            <div className="mb-2">
              <div className="flex justify-between items-end mb-2">
                <label className="text-xs uppercase tracking-widest text-[#10b981] font-bold">Global Completion</label>
                <p className="text-2xl font-mono font-black text-[#10b981] leading-none">{progressPercentage.toFixed(1)}%</p>
              </div>
              <div className="w-full h-4 bg-[#1a1a2a] rounded-full overflow-hidden border border-[#2a2a3a] shadow-inner p-0.5">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  className="h-full bg-[#10b981] rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                />
              </div>
            </div>
          </section>

          <section>
            <label className="text-xs uppercase tracking-widest text-[#10b981] block mb-4 font-bold">Projected Completion</label>
            <div className="space-y-4">
              <div className="bg-[#161625] p-5 rounded-lg border border-[#2a2a3a] relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-1 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Target className="w-12 h-12" />
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <Target className="w-3 h-3 text-[#10b981]" />
                  <p className="text-[10px] uppercase opacity-60 tracking-wider">Spent Kudos</p>
                </div>
                <p className="text-2xl font-mono text-white">{currentRank.cumulativeKudos.toLocaleString()}</p>
              </div>
              <div className="bg-[#161625] p-5 rounded-lg border border-[#2a2a3a] relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-1 opacity-10 group-hover:opacity-20 transition-opacity">
                  <TrendingUp className="w-12 h-12" />
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-3 h-3 text-[#f97316]" />
                  <p className="text-[10px] uppercase opacity-60 tracking-wider">Remaining</p>
                </div>
                <p className="text-2xl font-mono text-[#f97316]">{remainingKudos.toLocaleString()}</p>
              </div>
            </div>
          </section>

          <section>
            <label className="text-xs uppercase tracking-widest text-[#10b981] block mb-4 font-bold">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#10b981]/50" />
              <input 
                id="search-input"
                type="text" 
                placeholder="Search ranks..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[#161625] border border-[#2a2a3a] rounded-lg pl-10 pr-4 py-3 outline-none focus:border-[#10b981] transition-all w-full text-sm font-mono text-white"
              />
            </div>
          </section>


        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col bg-[#0c0c12] p-6 md:p-8 overflow-hidden relative">
          <div className="grid grid-cols-5 md:grid-cols-6 gap-4 mb-4 text-xs uppercase tracking-widest opacity-50 px-6 font-black py-2 bg-[#0c0c12] sticky top-0 z-10">
            <span className="col-span-2">Rank</span>
            <div className="hidden md:block text-right">
              <div className="inline-flex items-center gap-1.5">
                <span>Kudos Cost</span>
              </div>
            </div>
            <div className="text-right">
              <div className="inline-flex items-center gap-1.5">
                <span>Cumulative Kudos</span>
              </div>
            </div>
            <span className="text-right">Progress</span>
            <span className="text-right">Status</span>
          </div>

          <div className="flex-1 overflow-y-auto border border-[#2a2a3a] rounded-xl bg-[#12121e] shadow-2xl custom-scrollbar">
            <div className="grid grid-cols-1 divide-y divide-[#2a2a3a]">
              {/* Collapsible Completed Section */}
              {completedRanks.length > 0 && (
                <div className="bg-[#0c0c12]/20">
                  <button 
                    onClick={() => setIsHistoryExpanded(!isHistoryExpanded)}
                    className="w-full flex items-center justify-between p-4 px-6 hover:bg-[#1a1a2a]/40 transition-colors border-b border-[#2a2a3a]/50 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-1 px-2 rounded-md bg-[#10b981]/10 border border-[#10b981]/20">
                        <span className="text-[10px] font-black text-[#10b981] uppercase tracking-widest">{completedRanks.length} Recorded</span>
                      </div>
                      <span className="text-[11px] uppercase tracking-[0.2em] opacity-40 font-black">Completed Ranks</span>
                    </div>
                    <motion.div
                      animate={{ rotate: isHistoryExpanded ? 180 : 0 }}
                      className="opacity-40 group-hover:opacity-100 transition-opacity"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </motion.div>
                  </button>
                  
                  <motion.div
                    initial={false}
                    animate={{ 
                      height: isHistoryExpanded ? 'auto' : 0,
                      opacity: isHistoryExpanded ? 1 : 0
                    }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="divide-y divide-[#2a2a3a]/30">
                      {completedRanks.map((rank) => {
                        const progress = (rank.cumulativeKudos / TOTAL_KUDOS) * 100;
                        return (
                          <div 
                            key={rank.id}
                            id={`rank-row-${rank.id}`}
                            onClick={() => setCurrentRankId(rank.id)}
                            className="grid grid-cols-5 md:grid-cols-6 gap-4 py-4 px-6 text-[13px] font-mono opacity-30 italic hover:opacity-100 hover:bg-[#1a1a2a]/20 cursor-pointer transition-all items-center border-l border-transparent"
                          >
                            <div className="col-span-2 flex items-center gap-3">
                              <span className="text-[10px] opacity-30 w-8">#{rank.id.toString().padStart(3, '0')}</span>
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
                              <span className="truncate">{rank.name}</span>
                            </div>
                            <div className="hidden md:block opacity-60 text-right">{rank.kudos.toLocaleString()}</div>
                            <div className="opacity-80 text-right">{rank.cumulativeKudos.toLocaleString()}</div>
                            <div className="flex items-center gap-3 justify-end">
                               <div className="w-20 h-1 bg-[#1a1a2a] rounded-full overflow-hidden opacity-30">
                                 <div className="h-full" style={{ width: `${progress}%`, backgroundColor: rank.colorHex }} />
                               </div>
                               <span className="font-bold opacity-70 min-w-[40px] text-right text-[11px]">{progress.toFixed(1)}%</span>
                            </div>
                            <div className="text-right">
                              <span className="text-[#10b981] text-[10px] uppercase font-bold tracking-tight opacity-40">Done</span>
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
                      grid grid-cols-5 md:grid-cols-6 gap-4 font-mono transition-all cursor-pointer group items-center
                      ${isCurrent ? 'bg-[#1a1a2a] border-l-4 border-[#10b981] text-white shadow-[inset_4px_0_15px_rgba(16,185,129,0.1)] py-8 px-6 text-sm' : 'bg-transparent py-5 px-6 text-[13px] text-[#d1d1e0]/80 border-l border-transparent hover:bg-[#1a1a2a]/40'}
                    `}
                  >
                    <div className="col-span-2 flex items-center gap-3">
                      <span className="text-[10px] opacity-30 w-8">#{rank.id.toString().padStart(3, '0')}</span>
                      <div className="relative w-8 h-8 flex items-center justify-center">
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
                      <span className={`${isCurrent ? 'font-bold text-[#10b981]' : ''} truncate`}>{rank.name}</span>
                    </div>
                    <div className="hidden md:block opacity-60 text-right">{rank.kudos.toLocaleString()}</div>
                    <div className="opacity-80 text-right">{rank.cumulativeKudos.toLocaleString()}</div>
                    <div className="flex items-center gap-3 justify-end">
                       <div className="w-20 h-2 bg-[#1a1a2a] rounded-full overflow-hidden border border-[#2a2a3a]/50">
                         <div className="h-full opacity-80" style={{ width: `${progress}%`, backgroundColor: rank.colorHex }} />
                       </div>
                       <span className="font-bold opacity-70 min-w-[40px] text-right text-[11px]">{progress.toFixed(1)}%</span>
                    </div>
                    <div className="text-right">
                      {isCurrent ? (
                        <span className="text-[#f97316] text-[10px] uppercase font-bold tracking-wider underline underline-offset-4">Current</span>
                      ) : (
                        <span className="opacity-20 text-[10px] uppercase tracking-wider">Incomplete</span>
                      )}
                    </div>
                  </div>
                );
              })}
              {filteredRanks.length === 0 && (
                <div className="p-12 text-center opacity-40 text-sm italic font-serif">
                  No records found
                </div>
              )}
            </div>
          </div>
        </main>
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
        <div className="text-center md:text-right opacity-40 px-4 max-w-md">
          This is an unofficial, fan-developed project. Hades II and all related characters, assets, and intellectual property are the sole property of Supergiant Games.
        </div>
      </footer>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #0c0c12;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #2a2a3a;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #10b981;
        }
      `}</style>
    </div>
  );
}
