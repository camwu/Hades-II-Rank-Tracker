/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight,
  History
} from 'lucide-react';
import { TOTAL_KUDOS } from './constants';
import { RankRow } from './components/RankRow';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { OrientationGuard } from './components/OrientationGuard';
import { useAppState } from './hooks/useAppState';

export default function App() {
  const {
    currentRankId,
    searchQuery,
    setSearchQuery,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    isMobileStatsOpen,
    setIsMobileStatsOpen,
    isHistoryExpanded,
    setIsHistoryExpanded,
    isSpentExpanded,
    setIsSpentExpanded,
    isRemainingExpanded,
    setIsRemainingExpanded,
    isResetConfirming,
    windowWidth,
    isMobile,
    currentRank,
    remainingResources,
    spentResources,
    progressPercentage,
    remainingKudos,
    spentKudos,
    filteredRanks,
    completedRanks,
    activeRanks,
    totalCompletedCount,
    handleRankClick,
    handleResetProgress,
    historyContainerRef,
    searchInputRef,
    lastUpdated
  } = useAppState();

  return (
    <div id="app-root" className="h-screen bg-hades-bg text-hades-text font-sans overflow-hidden flex flex-col">
      <OrientationGuard />
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {searchQuery && `${filteredRanks.length} rank${filteredRanks.length === 1 ? '' : 's'} found`}
      </div>
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
            spentResources={spentResources}
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
                <div className="col-span-3 md:col-span-2 text-right pr-3">
                  <span className="hidden sm:inline">Kudos Cost</span>
                  <span className="sm:hidden">Kudos</span>
                </div>
                <div className="col-span-4 md:col-span-4 text-right">
                  <span>Resource</span>
                </div>
                <span className="hidden md:block md:col-span-3 text-right">Progress</span>
              </div>

            <div className="flex-1 overflow-y-auto border border-hades-border-light rounded-xl bg-hades-bg-light shadow-2xl">
            <div className="grid grid-cols-1 divide-y divide-hades-border-light">
              {/* Collapsible Completed Section - Pinned to top */}
              {totalCompletedCount > 0 && (
                <div className="sticky top-0 bg-hades-bg-light border-b border-hades-border-light z-20">
                  <button 
                    onClick={() => setIsHistoryExpanded(!isHistoryExpanded)}
                    aria-expanded={isHistoryExpanded}
                    aria-controls="history-section-content"
                    className="w-full flex items-center justify-between py-1.5 md:py-2 pl-1 pr-3 md:pl-9 md:pr-10 hover:bg-hades-border/40 transition-colors group outline-none focus-visible:bg-hades-border/60 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-hades-accent/40"
                  >
                    <div className="flex items-center gap-2 md:gap-4">
                      <div className="w-8 h-8 md:w-11 md:h-11 flex-shrink-0 flex items-center justify-center">
                        <History className="w-3.5 h-3.5 md:w-4 md:h-4 text-hades-text opacity-30" />
                      </div>
                      <span className="text-xs uppercase tracking-wider text-hades-text opacity-40 font-bold">
                        {totalCompletedCount} Completed Ranks
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
                    id="history-section-content"
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
                      {completedRanks.length > 0 ? (
                        completedRanks.map((rank) => (
                          <RankRow 
                            key={rank.id}
                            rank={rank}
                            isCurrent={false}
                            isCompleted={true}
                            isHistoryExpanded={isHistoryExpanded}
                            onClick={handleRankClick}
                            totalKudos={TOTAL_KUDOS}
                          />
                        ))
                      ) : (
                        <div className="py-8 px-4 text-center opacity-30 text-xs italic">
                          No completed ranks match your search
                        </div>
                      )}
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
