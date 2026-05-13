import { Github } from 'lucide-react';

interface FooterProps {
  lastUpdated: string;
}

export const Footer = ({ lastUpdated }: FooterProps) => {
  return (
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
  );
};
