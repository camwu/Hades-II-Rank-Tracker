import { RefObject, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  X, 
  RotateCcw, 
  BarChart2,
  AlertTriangle
} from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isResetConfirming: boolean;
  handleResetProgress: () => void;
  setIsMobileStatsOpen: (open: boolean) => void;
  searchInputRef: RefObject<HTMLInputElement | null>;
  isMobile: boolean;
  windowWidth: number;
}

export const Header = ({
  searchQuery,
  setSearchQuery,
  isResetConfirming,
  handleResetProgress,
  setIsMobileStatsOpen,
  searchInputRef,
  isMobile,
  windowWidth
}: HeaderProps) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Determine if we should collapse the search box to avoid cut-off on mobile
  const shouldCollapseSearch = isResetConfirming && windowWidth < 640 && !isSearchFocused && !searchQuery;

  return (
    <header className="min-h-24 bg-hades-bg-dark border-b border-hades-border shrink-0 z-10 px-4 py-4 lg:py-0">
      <div className="max-w-[1440px] mx-auto w-full h-full flex flex-col lg:flex-row items-center justify-between px-2 lg:px-8 gap-4 lg:gap-0">
        <div className="flex items-center gap-3 lg:gap-6 w-full lg:w-auto justify-center lg:justify-start">
          <img 
            src="/favicon.png" 
            alt="" 
            className="w-8 h-8 md:w-10 md:h-10 object-contain drop-shadow-[0_0_15px_var(--color-hades-accent)/40%]" 
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
              aria-label="View statistics"
            >
              <BarChart2 className="w-5 h-5" />
            </button>
            <button 
              onClick={handleResetProgress}
              className={`flex items-center justify-center gap-2 px-3 h-10 border rounded-lg transition-all text-xs md:text-sm font-bold uppercase tracking-wider group outline-none focus-visible:ring-2 focus-visible:ring-hades-red focus-visible:ring-offset-2 focus-visible:ring-offset-hades-bg focus-visible:bg-hades-red/20 sm:w-44 ${
                isResetConfirming 
                  ? 'bg-hades-red border-hades-red text-white' 
                  : 'bg-hades-panel border-hades-border-light text-hades-text/50 hover:text-hades-red hover:border-hades-red/50'
              }`}
              title={isResetConfirming ? "Click again to confirm reset" : "Reset All Progress"}
              aria-label={isResetConfirming ? "Confirm reset all progress" : "Reset progress"}
            >
              {isResetConfirming ? (
                <AlertTriangle className="w-4 h-4 shrink-0 animate-pulse" />
              ) : (
                <RotateCcw className="w-4 h-4 shrink-0 transition-transform group-hover:rotate-[-45deg]" />
              )}
              <span className="whitespace-nowrap">
                {isResetConfirming ? (
                  <>
                    <span className="hidden sm:inline">Confirm Reset</span>
                    <span className="sm:hidden">Confirm Reset</span>
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
          <div className={`relative group max-w-sm transition-all duration-300 ${shouldCollapseSearch ? 'w-10 flex-shrink-0' : 'w-full lg:w-64'}`}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-hades-accent/50 pointer-events-none z-10" />
            <input 
              ref={searchInputRef}
              id="search-input"
              type="text" 
              placeholder={shouldCollapseSearch ? "" : "Search..."} 
              aria-label="Search ranks"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className={`bg-hades-panel border border-hades-border-light rounded-lg h-10 outline-none focus:border-hades-accent transition-all text-sm text-white ${
                shouldCollapseSearch 
                  ? 'w-10 pl-10 pr-0 cursor-pointer' 
                  : 'w-full pl-10 pr-10'
              }`}
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-hades-border-light rounded-full transition-colors text-hades-text/50 hover:text-white outline-none focus-visible:ring-2 focus-visible:ring-hades-accent focus-visible:bg-hades-border-light z-20"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};
