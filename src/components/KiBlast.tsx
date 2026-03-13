import React from 'react';

const KiBlast: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`ki-blast-container ${className}`}>
      {/* Central Ki orb */}
      <div className="ki-orb" />
      {/* Ki rings */}
      <div className="ki-ring ki-ring-1" />
      <div className="ki-ring ki-ring-2" />
      <div className="ki-ring ki-ring-3" />
    </div>
  );
};

export default KiBlast;
