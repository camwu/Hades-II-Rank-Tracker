import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { RANKS, TOTAL_KUDOS, TOTAL_RESOURCES, RESOURCE_NAMES, formatResourceName } from '../constants';
import { useLocalStorageState } from './useLocalStorageState';
import { useSidebarState } from './useSidebarState';

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

  const [isHistoryExpanded, setIsHistoryExpanded] = useLocalStorageState('hades-history-expanded', false);

  // --- Derived Basic Values ---
  const currentRank = useMemo(() => 
    RANKS.find((r) => r.id === currentRankId) || RANKS[0], 
  [currentRankId]);

  const remainingKudos = TOTAL_KUDOS - currentRank.cumulativeKudos;
  const spentKudos = currentRank.cumulativeKudos;

  // --- Hooks ---
  const sidebar = useSidebarState(spentKudos, remainingKudos);

  // --- Volatile State ---
  const [isResetConfirming, setIsResetConfirming] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const [lastUpdated] = useState<string>(() => {
    return (import.meta.env.VITE_LAST_UPDATED as string) || '';
  });

  // --- Refs ---
  const isInitialMount = useRef(true);
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

  const filteredRanks = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return RANKS;
    return RANKS.filter((r) => {
      const nameMatch = r.name.toLowerCase().includes(query);
      const colorMatch = r.colorName.toLowerCase().includes(query);
      const resourceMatch = r.bossResourceName.toLowerCase().includes(query);
      const formattedResourceMatch = formatResourceName(r.bossResourceName).toLowerCase().includes(query);
      
      return nameMatch || colorMatch || resourceMatch || formattedResourceMatch;
    });
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

  const { setIsMobileStatsOpen, setIsSpentExpanded, setIsRemainingExpanded } = sidebar;

  // --- Handlers ---
  const handleRankClick = useCallback((id: number) => {
    setCurrentRankId(id);
    if (isMobile) setIsMobileStatsOpen(false);
  }, [isMobile, setIsMobileStatsOpen]);

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
  }, [isResetConfirming, setIsHistoryExpanded, setIsSpentExpanded, setIsRemainingExpanded]);

  // --- Effects ---
  
  // Storage Persistence for currentRankId (others handled by hooks)
  useEffect(() => {
    localStorage.setItem('hades-rank-id', currentRankId.toString());
  }, [currentRankId]);

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
    if (!isMobile && sidebar.isMobileStatsOpen) {
      sidebar.setIsMobileStatsOpen(false);
    }
  }, [isMobile, sidebar]);

  // Auto-expand history on search
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (searchQuery && completedRanks.length > 0) {
      setIsHistoryExpanded(true);
    }
  }, [searchQuery, completedRanks.length, setIsHistoryExpanded]);

  // --- Keyboard Shortcut ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if key is '/' and user is not already typing in an input or textarea
      if (e.key === '/' && 
          document.activeElement?.tagName !== 'INPUT' && 
          document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return {
    currentRankId,
    setCurrentRankId,
    searchQuery,
    setSearchQuery,
    isSidebarCollapsed: sidebar.isSidebarCollapsed,
    setIsSidebarCollapsed: sidebar.setIsSidebarCollapsed,
    isSpentExpanded: sidebar.isSpentExpanded,
    setIsSpentExpanded: sidebar.setIsSpentExpanded,
    isRemainingExpanded: sidebar.isRemainingExpanded,
    setIsRemainingExpanded: sidebar.setIsRemainingExpanded,
    isMobileStatsOpen: sidebar.isMobileStatsOpen,
    setIsMobileStatsOpen: sidebar.setIsMobileStatsOpen,
    isHistoryExpanded,
    setIsHistoryExpanded,
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

