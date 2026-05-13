import { useState, useEffect, useRef } from 'react';
import { useLocalStorageState } from './useLocalStorageState';

export function useSidebarState(spentKudos: number, remainingKudos: number) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useLocalStorageState('hades-sidebar-collapsed', false);
  const [isSpentExpanded, setIsSpentExpanded] = useLocalStorageState('hades-spent-expanded', true);
  const [isRemainingExpanded, setIsRemainingExpanded] = useLocalStorageState('hades-remaining-expanded', true);
  const [isMobileStatsOpen, setIsMobileStatsOpen] = useState(false);

  const prevRemainingKudosRef = useRef(remainingKudos);
  const prevSpentKudosRef = useRef(spentKudos);

  // Auto-expand/collapse resource sections based on values
  useEffect(() => {
    if (remainingKudos === 0) {
      setIsRemainingExpanded(false);
    } else if (prevRemainingKudosRef.current === 0 && remainingKudos > 0) {
      setIsRemainingExpanded(true);
    }
    prevRemainingKudosRef.current = remainingKudos;
  }, [remainingKudos, setIsRemainingExpanded]);

  useEffect(() => {
    if (spentKudos === 0) {
      setIsSpentExpanded(false);
    } else if (prevSpentKudosRef.current === 0 && spentKudos > 0) {
      setIsSpentExpanded(true);
    }
    prevSpentKudosRef.current = spentKudos;
  }, [spentKudos, setIsSpentExpanded]);

  return {
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    isSpentExpanded,
    setIsSpentExpanded,
    isRemainingExpanded,
    setIsRemainingExpanded,
    isMobileStatsOpen,
    setIsMobileStatsOpen,
  };
}
