import React from 'react';
import { cn } from '@/lib/utils';
import gokuImg from '@/assets/goku.png';
import vegetaImg from '@/assets/vegeta.png';
import trunksImg from '@/assets/trunks.png';
import gohanImg from '@/assets/gohan.png';

interface ZFightersRowProps {
  className?: string;
}

const fighters = [
  { name: 'GOKU', img: gokuImg },
  { name: 'VEGETA', img: vegetaImg },
  { name: 'TRUNKS', img: trunksImg },
  { name: 'GOHAN', img: gohanImg },
];

const ZFightersRow: React.FC<ZFightersRowProps> = ({ className }) => {
  return (
    <div className={cn('grid grid-cols-4 gap-2 sm:gap-3 max-w-md mx-auto', className)}>
      {fighters.map((fighter) => (
        <div key={fighter.name} className="relative overflow-hidden rounded-xl border border-border/60 bg-card/60 p-2 backdrop-blur-sm">
          <div className="absolute inset-0 ki-character-aura opacity-20" />

          <img
            src={fighter.img}
            alt={fighter.name}
            loading="lazy"
            className="character-float relative z-10 mx-auto h-12 w-12 sm:h-14 sm:w-14 object-contain"
          />

          <p className="relative z-10 mt-1 text-center font-bangers text-[10px] sm:text-xs tracking-[0.18em] text-primary">
            {fighter.name}
          </p>

          <div className="pointer-events-none absolute inset-0">
            <span className="ki-spark" style={{ left: '18%', top: '72%', animationDelay: '0.1s' }} />
            <span className="ki-spark" style={{ left: '75%', top: '34%', animationDelay: '0.5s' }} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ZFightersRow;
