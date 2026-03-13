import React from 'react';

interface DragonBallStarProps {
  stars: number;
  size?: number;
  className?: string;
}

const DragonBallStar: React.FC<DragonBallStarProps> = ({ stars, size = 60, className = '' }) => {
  const starPositions: Record<number, { x: number; y: number }[]> = {
    1: [{ x: 50, y: 50 }],
    2: [{ x: 40, y: 40 }, { x: 60, y: 60 }],
    3: [{ x: 50, y: 30 }, { x: 35, y: 60 }, { x: 65, y: 60 }],
    4: [{ x: 35, y: 35 }, { x: 65, y: 35 }, { x: 35, y: 65 }, { x: 65, y: 65 }],
    5: [{ x: 50, y: 25 }, { x: 30, y: 45 }, { x: 70, y: 45 }, { x: 35, y: 70 }, { x: 65, y: 70 }],
    6: [{ x: 50, y: 25 }, { x: 30, y: 40 }, { x: 70, y: 40 }, { x: 30, y: 60 }, { x: 70, y: 60 }, { x: 50, y: 75 }],
    7: [{ x: 50, y: 20 }, { x: 30, y: 35 }, { x: 70, y: 35 }, { x: 50, y: 50 }, { x: 30, y: 65 }, { x: 70, y: 65 }, { x: 50, y: 80 }],
  };

  const positions = starPositions[stars] || starPositions[4];

  return (
    <div
      className={`relative rounded-full ${className}`}
      style={{
        width: size,
        height: size,
        background: 'radial-gradient(circle at 35% 35%, hsl(45 100% 75%), hsl(35 100% 50%), hsl(25 100% 40%))',
        boxShadow: `
          inset -${size * 0.08}px -${size * 0.08}px ${size * 0.25}px rgba(0,0,0,0.3),
          inset ${size * 0.08}px ${size * 0.08}px ${size * 0.25}px rgba(255,255,200,0.4),
          0 0 ${size * 0.33}px rgba(255,165,0,0.5),
          0 0 ${size * 0.66}px rgba(255,165,0,0.3)
        `,
      }}
    >
      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
        {positions.map((pos, i) => (
          <text
            key={i}
            x={pos.x}
            y={pos.y + 4}
            textAnchor="middle"
            fill="hsl(0 85% 45%)"
            fontSize={stars <= 3 ? 16 : stars <= 5 ? 12 : 10}
            style={{ filter: 'drop-shadow(0 0 2px rgba(200,0,0,0.5))' }}
          >
            ★
          </text>
        ))}
      </svg>
    </div>
  );
};

export default DragonBallStar;
