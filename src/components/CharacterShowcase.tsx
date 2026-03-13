import React from 'react';
import gokuImg from '@/assets/goku.png';
import vegetaImg from '@/assets/vegeta.png';
import trunksImg from '@/assets/trunks.png';
import gohanImg from '@/assets/gohan.png';

const characters = [
  { name: 'GOKU', img: gokuImg, color: 'hsl(35 100% 50%)' },
  { name: 'VEGETA', img: vegetaImg, color: 'hsl(210 100% 55%)' },
  { name: 'TRUNKS', img: trunksImg, color: 'hsl(270 80% 55%)' },
  { name: 'GOHAN', img: gohanImg, color: 'hsl(45 100% 55%)' },
];

const CharacterShowcase: React.FC = () => {
  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-6 max-w-md mx-auto">
      {characters.map((char) => (
        <div key={char.name} className="relative group">
          {/* Ki aura behind character */}
          <div
            className="absolute inset-0 rounded-2xl ki-character-aura opacity-60"
            style={{
              background: `radial-gradient(ellipse at 50% 60%, ${char.color}, transparent 70%)`,
            }}
          />
          {/* Character image */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="character-float w-28 h-28 sm:w-32 sm:h-32 relative">
              <img
                src={char.img}
                alt={char.name}
                className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(255,200,0,0.5)]"
              />
              {/* Ki sparks */}
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="ki-spark"
                    style={{
                      left: `${20 + Math.random() * 60}%`,
                      top: `${20 + Math.random() * 60}%`,
                      animationDelay: `${i * 0.4}s`,
                      background: char.color,
                    }}
                  />
                ))}
              </div>
            </div>
            <p
              className="font-bangers text-sm sm:text-base tracking-[0.3em] mt-2"
              style={{ color: char.color, textShadow: `0 0 10px ${char.color}` }}
            >
              {char.name}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CharacterShowcase;
