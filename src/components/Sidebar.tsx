import { motion, AnimatePresence } from 'motion/react';
import { 
  Target, 
  TrendingUp, 
  X, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';
import { Rank, RESOURCE_NAMES } from '../constants';

interface SidebarProps {
  currentRank: Rank;
  remainingKudos: number;
  spentKudos: number;
  progressPercentage: number;
  remainingResources: { name: string; amount: number }[];
  spentResources: { name: string; amount: number }[];
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (collapsed: boolean) => void;
  isSpentExpanded: boolean;
  setIsSpentExpanded: (expanded: boolean) => void;
  isRemainingExpanded: boolean;
  setIsRemainingExpanded: (expanded: boolean) => void;
  isMobile: boolean;
  isMobileStatsOpen: boolean;
  setIsMobileStatsOpen: (open: boolean) => void;
}

export const Sidebar = ({
  currentRank,
  remainingKudos,
  spentKudos,
  progressPercentage,
  remainingResources,
  spentResources,
  isSidebarCollapsed,
  setIsSidebarCollapsed,
  isSpentExpanded,
  setIsSpentExpanded,
  isRemainingExpanded,
  setIsRemainingExpanded,
  isMobile,
  isMobileStatsOpen,
  setIsMobileStatsOpen
}: SidebarProps) => {
  return (
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
          aria-label="Close statistics"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Toggle Button Integrated into Divider (Desktop Only) */}
      <button 
        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        className="absolute -right-3 top-[21px] z-30 hidden lg:flex items-center justify-center w-6 h-6 bg-hades-bg-dark border border-hades-border rounded-md shadow-lg hover:border-hades-accent/50 transition-all text-hades-accent/60 hover:text-hades-accent outline-none focus-visible:ring-2 focus-visible:ring-hades-accent focus-visible:border-hades-accent"
        title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        aria-label={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
      >
        {isSidebarCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>

      <div className={`flex-1 flex flex-col gap-6 overflow-y-auto px-8 pb-8 pt-6 ${isSidebarCollapsed ? 'items-center overflow-x-hidden' : ''}`}>
        {!isSidebarCollapsed ? (
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
                  className="h-full bg-hades-accent rounded-full shadow-[0_0_15px_var(--color-hades-accent)/30%]"
                />
              </div>

              <div className="space-y-6">
                <div className="bg-hades-panel rounded-lg border border-hades-border-light relative overflow-hidden group">
                  <button 
                    onClick={() => setIsSpentExpanded(!isSpentExpanded)}
                    aria-expanded={isSpentExpanded}
                    aria-controls="spent-resources-content"
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

                  <div className={`px-4 transition-all ${isSpentExpanded ? 'pt-2 pb-5' : (spentKudos > 0 || spentResources.length > 0 ? 'pt-2 pb-4' : 'p-0 h-0')}`}>
                    {spentKudos > 0 && (
                      <div className={`flex items-start gap-3 transition-all ${isSpentExpanded ? 'mb-5' : 'mb-0'}`}>
                        <div className="w-[34px] h-[34px] rounded-lg bg-hades-border flex items-center justify-center border border-hades-border-light flex-shrink-0">
                          <img src="/assets/resources/Kudos.png" alt="" className="w-5 h-5 object-contain" loading="lazy" />
                        </div>
                        <div className="min-w-0 pt-0.5">
                          <p className="text-base text-hades-text/80 leading-none font-bold tracking-tight">{spentKudos.toLocaleString()}</p>
                          <p className="text-[10px] uppercase opacity-50 font-sans mt-1.5 tracking-wider">Kudos</p>
                        </div>
                      </div>
                    )}

                    <motion.div
                      id="spent-resources-content"
                      initial={false}
                      animate={{
                        height: isSpentExpanded ? 'auto' : 0,
                        opacity: isSpentExpanded ? 1 : 0
                      }}
                      className="overflow-hidden"
                    >
                      <div className="grid grid-cols-2 gap-y-4 gap-x-4 pt-4 border-t border-hades-border-light/50 w-full">
                        {spentResources.map((resource) => (
                          <div key={`spent-${resource.name}`} className="flex items-start gap-3 min-w-0">
                            <div className="w-[32px] h-[32px] flex-shrink-0 rounded-lg bg-hades-border flex items-center justify-center border border-hades-border-light/30">
                              <img src={`/assets/resources/${resource.name.replace(/\s+/g, '_')}.png`} alt="" className="w-5 h-5 object-contain" loading="lazy" />
                            </div>
                            <div className="min-w-0 pt-0.5">
                              <p className="text-sm text-hades-text/80 leading-none font-bold">{resource.amount.toLocaleString()}</p>
                              <p className="text-[9px] uppercase opacity-50 font-sans mt-1 leading-tight tracking-tight">{resource.name === 'Golden Apple' ? 'Gold Apple' : resource.name}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </div>
                </div>

                <div className="bg-hades-panel rounded-lg border border-hades-border-light relative overflow-hidden group">
                  <button 
                    onClick={() => setIsRemainingExpanded(!isRemainingExpanded)}
                    aria-expanded={isRemainingExpanded}
                    aria-controls="remaining-resources-content"
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
                    {remainingKudos > 0 && (
                      <div className={`flex items-start gap-3 transition-all ${isRemainingExpanded ? 'mb-5' : 'mb-0'}`}>
                        <div className="w-[34px] h-[34px] rounded-lg bg-hades-border flex items-center justify-center border border-hades-border-light flex-shrink-0">
                          <img src="/assets/resources/Kudos.png" alt="" className="w-5 h-5 object-contain" loading="lazy" />
                        </div>
                        <div className="min-w-0 pt-0.5">
                          <p className="text-base text-hades-text/80 leading-none font-bold tracking-tight">{remainingKudos.toLocaleString()}</p>
                          <p className="text-[10px] uppercase opacity-50 font-sans mt-1.5 tracking-wider">Kudos</p>
                        </div>
                      </div>
                    )}

                    <motion.div
                      id="remaining-resources-content"
                      initial={false}
                      animate={{
                        height: isRemainingExpanded ? 'auto' : 0,
                        opacity: isRemainingExpanded ? 1 : 0
                      }}
                      className="overflow-hidden"
                    >
                      <div className="grid grid-cols-2 gap-y-4 gap-x-4 pt-4 border-t border-hades-border-light/50 w-full">
                        {remainingResources.map((resource) => (
                          <div key={`rem-${resource.name}`} className="flex items-start gap-3 min-w-0">
                            <div className="w-[32px] h-[32px] flex-shrink-0 rounded-lg bg-hades-border flex items-center justify-center border border-hades-border-light/30">
                              <img src={`/assets/resources/${resource.name.replace(/\s+/g, '_')}.png`} alt="" className="w-5 h-5 object-contain" loading="lazy" />
                            </div>
                            <div className="min-w-0 pt-0.5">
                              <p className="text-sm text-hades-text/80 leading-none font-bold">{resource.amount.toLocaleString()}</p>
                              <p className="text-[9px] uppercase opacity-50 font-sans mt-1 leading-tight tracking-tight">{resource.name === 'Golden Apple' ? 'Gold Apple' : resource.name}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ) : null}
      </div>
    </motion.aside>
  );
};
