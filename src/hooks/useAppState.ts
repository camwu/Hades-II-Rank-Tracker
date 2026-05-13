import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { RANKS, TOTAL_KUDOS, TOTAL_RESOURCES, RESOURCE_NAMES } from '../constants';

export function useAppState() {
  // --- Persistent State ---
  const [currentRankId, setCurrentRankId] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const rankParam = urlParams.get('rank');
      if (rankParam) {
        const parsed = parseInt(rankParam);
        if (parsed >= 0 && parsed < RANKS.length) return parsed;
      }
      const saved = localStorage.getItem('hades-rank-id');
      if (saved) {
        const parsed = parseInt(saved);
        if (parsed >= 0 && parsed < RANKS.length) return parsed;
      }
    }
    return 0;
  });

  const [searchQuery, setSearchQuery] = useState(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get('q') || '';
    }
    return '';
  });

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('hades-sidebar-collapsed') === 'true';
    }
    return false;
  });

  const [isHistoryExpanded, setIsHistoryExpanded] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('hades-history-expanded') === 'true';
    }
    return false;
  });

  const [isSpentExpanded, setIsSpentExpanded] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('hades-spent-expanded');
      return saved === null ? true : saved === 'true';
    }
    return true;
  });

  const [isRemainingExpanded, setIsRemainingExpanded] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('hades-remaining-expanded');
      return saved === null ? true : saved === 'true';
    }
    return true;
  });

  // --- Volatile State ---
  const [isMobileStatsOpen, setIsMobileStatsOpen] = useState(false);
  const [isResetConfirming, setIsResetConfirming] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const [lastUpdated] = useState<string>(() => {
    return (import.meta.env.VITE_LAST_UPDATED as string) || '';
  });

  // --- Refs ---
  const isInitialMount = useRef(true);
  const prevRemainingKudosRef = useRef(0);
  const prevSpentKudosRef = useRef(0);
  const historyContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // --- Window Resize ---
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setWindowWidth(window.innerWidth);
      }, 150);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  const isMobile = windowWidth < 1024;

  // --- Scroll Effects ---
  useEffect(() => {
    if (isHistoryExpanded && historyContainerRef.current) {
      const timeoutId = setTimeout(() => {
        if (historyContainerRef.current) {
          historyContainerRef.current.scrollTop = historyContainerRef.current.scrollHeight;
        }
      }, 50);
      return () => clearTimeout(timeoutId);
    }
  }, [isHistoryExpanded, currentRankId]);

  useEffect(() => {
    const element = document.getElementById(`rank-row-${currentRankId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [currentRankId]);

  // --- Derived Data ---
  const currentRank = useMemo(() => 
    RANKS.find((r) => r.id === currentRankId) || RANKS[0], 
  [currentRankId]);

  const remainingResources = useMemo(() => {
    return TOTAL_RESOURCES.map(total => {
      const spent = currentRank.cumulativeResources.find(s => s.name === total.name)?.amount || 0;
      return { name: total.name, amount: total.amount - spent };
    })
    .filter(r => r.amount > 0)
    .sort((a, b) => RESOURCE_NAMES.indexOf(a.name) - RESOURCE_NAMES.indexOf(b.name));
  }, [currentRank]);

  const spentResources = useMemo(() => {
    return currentRank.cumulativeResources
      .filter(r => r.amount > 0)
      .sort((a, b) => RESOURCE_NAMES.indexOf(a.name) - RESOURCE_NAMES.indexOf(b.name));
  }, [currentRank]);

  const progressPercentage = useMemo(() => 
    (currentRank.cumulativeKudos / TOTAL_KUDOS) * 100, 
  [currentRank]);

  const remainingKudos = TOTAL_KUDOS - currentRank.cumulativeKudos;
  const spentKudos = currentRank.cumulativeKudos;

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

  const activeRanks = useMemo(() => 
    filteredRanks.filter(r => r.id >= currentRankId),
  [filteredRanks, currentRankId]);

  const totalCompletedCount = useMemo(() => 
    RANKS.filter(r => r.id < currentRankId).length,
  [currentRankId]);

  // --- Handlers ---
  const handleRankClick = useCallback((id: number) => {
    setCurrentRankId(id);
    if (isMobile) setIsMobileStatsOpen(false);
  }, [isMobile]);

  const handleResetProgress = useCallback(() => {
    if (!isResetConfirming) {
      setIsResetConfirming(true);
      setTimeout(() => setIsResetConfirming(false), 3000);
      return;
    }
    
    setCurrentRankId(0);
    setIsHistoryExpanded(false);
    setIsSpentExpanded(true);
    setIsRemainingExpanded(true);
    setIsResetConfirming(false);
  }, [isResetConfirming]);

  // --- Effects ---
  
  // Storage Persistence
  useEffect(() => {
    localStorage.setItem('hades-rank-id', currentRankId.toString());
  }, [currentRankId]);

  useEffect(() => {
    localStorage.setItem('hades-sidebar-collapsed', isSidebarCollapsed.toString());
  }, [isSidebarCollapsed]);

  useEffect(() => {
    localStorage.setItem('hades-history-expanded', isHistoryExpanded.toString());
  }, [isHistoryExpanded]);

  useEffect(() => {
    localStorage.setItem('hades-spent-expanded', isSpentExpanded.toString());
  }, [isSpentExpanded]);

  useEffect(() => {
    localStorage.setItem('hades-remaining-expanded', isRemainingExpanded.toString());
  }, [isRemainingExpanded]);

  // URL Sync
  useEffect(() => {
    const url = new URL(window.location.href);
    if (currentRankId === 0) url.searchParams.delete('rank');
    else url.searchParams.set('rank', currentRankId.toString());

    if (!searchQuery.trim()) url.searchParams.delete('q');
    else url.searchParams.set('q', searchQuery.trim());
    
    window.history.replaceState({}, '', url);
  }, [currentRankId, searchQuery]);

  // Handle mobile drawer closure on resize
  useEffect(() => {
    if (!isMobile && isMobileStatsOpen) {
      setIsMobileStatsOpen(false);
    }
  }, [isMobile, isMobileStatsOpen]);

  // Auto-expand/collapse resource sections based on values
  useEffect(() => {
    if (remainingKudos === 0) {
      setIsRemainingExpanded(false);
    } else if (prevRemainingKudosRef.current === 0 && remainingKudos > 0) {
      setIsRemainingExpanded(true);
    }
    prevRemainingKudosRef.current = remainingKudos;
  }, [remainingKudos]);

  useEffect(() => {
    if (spentKudos === 0) {
      setIsSpentExpanded(false);
    } else if (prevSpentKudosRef.current === 0 && spentKudos > 0) {
      setIsSpentExpanded(true);
    }
    prevSpentKudosRef.current = spentKudos;
  }, [spentKudos]);

  // Auto-expand history on search
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (searchQuery && completedRanks.length > 0) {
      setIsHistoryExpanded(true);
    }
  }, [searchQuery, completedRanks.length]);

  return {
    currentRankId,
    setCurrentRankId,
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
  };
}
