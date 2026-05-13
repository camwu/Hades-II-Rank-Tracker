import { memo, useState } from 'react';
import { History } from 'lucide-react';
import { Rank } from '../constants';

const SHADOW_CLASSES: Record<string, string> = {
  "Unranked": "drop-shadow-hades-slate",
  "Wraith": "drop-shadow-hades-grey",
  "Specter": "drop-shadow-hades-bronze",
  "Revenant": "drop-shadow-hades-white",
  "Nightmare": "drop-shadow-hades-purple",
  "Unseen": "drop-shadow-hades-gold",
};

interface RankRowProps {
  rank: Rank;
  isCurrent: boolean;
  isCompleted: boolean;
  isHistoryExpanded?: boolean;
  onClick: (id: number) => void;
  totalKudos: number;
}

export const RankRow = memo(({ 
  rank, 
  isCurrent, 
  isCompleted, 
  isHistoryExpanded,
  onClick, 
  totalKudos
}: RankRowProps) => {
  const [imgError, setImgError] = useState(false);
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
            {!imgError && (
              <img 
                src={rank.imageUrl} 
                alt="" 
                className={`w-full h-full object-contain z-10 ${rank.id > 0 ? SHADOW_CLASSES[rank.colorName] : ''}`}
                loading="lazy"
                onError={() => setImgError(true)}
              />
            )}
          </div>
          <span className="text-xs md:text-base font-medium">{rank.name}</span>
        </div>
        <div className="col-span-3 md:col-span-2 flex items-center justify-end gap-1 md:gap-2 opacity-80 pr-3">
          {rank.id > 0 ? (
            <>
              <span className="text-[10px] md:text-sm leading-none">{rank.kudos.toLocaleString()}</span>
              <img src="/assets/resources/Kudos.png" alt="" className="w-3.5 h-3.5 md:w-4 md:h-4 object-contain" loading="lazy" />
            </>
          ) : (
            <span className="text-sm opacity-30">—</span>
          )}
        </div>
        <div className="col-span-4 md:col-span-4 flex items-center justify-end gap-1 md:gap-3 opacity-90 min-w-0">
          {rank.id > 0 ? (
            <>
              <span className="text-[10px] md:text-sm leading-tight text-right whitespace-nowrap">
                {rank.bossResourceQty}x <span className="hidden sm:inline">{rank.bossResourceName}</span>
              </span>
              <img src={rank.bossResourceImageUrl} alt="" className="w-4 h-4 md:w-5 md:h-5 object-contain flex-shrink-0" loading="lazy" />
            </>
          ) : (
            <span className="text-sm opacity-30">—</span>
          )}
        </div>
        <div className="hidden md:flex md:col-span-3 items-center gap-3 justify-end">
          <div className="hidden sm:block w-20 h-1 bg-hades-border rounded-full overflow-hidden opacity-30">
            <div className="h-full bg-hades-accent" style={{ width: `${progress}%` }} />
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
          ? 'bg-hades-border border-l-4 border-hades-accent text-white shadow-[inset_4px_0_15px_var(--color-hades-accent)/10%] py-2.5 md:py-2 pl-1 pr-3 md:pl-9 md:pr-10 text-xs md:text-sm focus-visible:bg-hades-border/80' 
          : 'bg-transparent py-1.5 md:py-1.5 pl-1 pr-3 md:pl-9 md:pr-10 text-xs md:text-sm text-hades-text/80 border-l-4 border-transparent hover:bg-hades-border/40 focus-visible:bg-hades-accent/5'}
        focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-hades-accent/40
      `}
    >
      <div className="col-span-6 md:col-span-4 flex items-center gap-2 md:gap-4">
        <div className="relative w-8 h-8 md:w-12 md:h-12 flex-shrink-0 flex items-center justify-center">
          {!imgError && (
            <img 
              src={rank.imageUrl} 
              alt="" 
              className={`w-full h-full object-contain relative z-10 transition-transform group-hover:scale-110 ${rank.id > 0 ? SHADOW_CLASSES[rank.colorName] : ''}`}
              loading="lazy"
              onError={() => setImgError(true)}
            />
          )}
        </div>
        <span className={`text-xs md:text-base ${isCurrent ? 'font-bold text-hades-accent' : 'font-medium'}`}>{rank.name}</span>
      </div>
      <div className="col-span-3 md:col-span-2 flex items-center justify-end gap-1 md:gap-2 opacity-90 pr-3">
        {rank.id > 0 ? (
          <>
            <span className="text-[11px] md:text-sm">{rank.kudos.toLocaleString()}</span>
            <img src="/assets/resources/Kudos.png" alt="" className="w-3.5 h-3.5 md:w-4 md:h-4 object-contain" />
          </>
        ) : (
          <span className="text-[10px] uppercase opacity-40 font-black tracking-widest">—</span>
        )}
      </div>
      <div className="col-span-4 md:col-span-4 flex items-center justify-end gap-1 md:gap-3 opacity-90 min-w-0">
        {rank.id > 0 ? (
          <>
            <span className="text-[11px] md:text-sm leading-tight group-hover:text-white transition-colors text-right whitespace-nowrap">
              {rank.bossResourceQty}x <span className="hidden sm:inline">{rank.bossResourceName}</span>
            </span>
            <img src={rank.bossResourceImageUrl} alt="" className={`${isCurrent ? 'w-5 h-5 md:w-6 md:h-6' : 'w-4 h-4 md:w-5 md:h-5'} object-contain flex-shrink-0`} loading="lazy" />
          </>
        ) : (
          <span className="text-[10px] uppercase opacity-40 font-black tracking-widest">—</span>
        )}
      </div>
      <div className="hidden md:flex md:col-span-3 items-center gap-3 justify-end">
         <div className="hidden sm:block w-20 h-2 bg-hades-border rounded-full overflow-hidden border border-hades-border-light/50">
           <div className="h-full opacity-80 bg-hades-accent" style={{ width: `${progress}%` }} />
         </div>
         <span className="font-bold opacity-70 min-w-[35px] md:min-w-[40px] text-right text-xs md:text-sm">{progress.toFixed(1)}%</span>
      </div>
    </button>
  );
});
