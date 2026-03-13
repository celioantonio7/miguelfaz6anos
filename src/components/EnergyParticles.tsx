import React from 'react';

const EnergyParticles: React.FC<{ count?: number; color?: string }> = ({ count = 20, color }) => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="energy-particle"
          style={{
            left: `${Math.random() * 100}%`,
            animationDuration: `${3 + Math.random() * 5}s`,
            animationDelay: `${Math.random() * 5}s`,
            width: `${2 + Math.random() * 4}px`,
            height: `${2 + Math.random() * 4}px`,
            background: color || `hsl(${35 + Math.random() * 20} 100% ${50 + Math.random() * 30}%)`,
          }}
        />
      ))}
    </div>
  );
};

export default EnergyParticles;
