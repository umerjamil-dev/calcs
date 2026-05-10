'use client';

import React from 'react';

interface AdSlotProps {
  type: 'horizontal' | 'rectangle' | 'square';
  className?: string;
}

export default function AdSlot({ type, className = "" }: AdSlotProps) {
  const styles = {
    horizontal: "w-full h-[90px] lg:h-[120px]",
    rectangle: "w-full h-[250px] lg:h-[300px]",
    square: "w-full aspect-square max-w-[300px]"
  };

  return (
    <div className={`container-custom py-8 flex justify-center ${className}`}>
      <div className={`${styles[type]} bg-forest/5 border-2 border-dashed border-forest/10 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden group`}>
        {/* Decorative corner accents */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-forest/20" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-forest/20" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-forest/20" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-forest/20" />
        
        <span className="text-[10px] font-black uppercase tracking-[4px] text-forest/30 mb-2">Advertisement</span>
        <div className="text-forest/10 font-display font-bold text-lg lg:text-xl group-hover:text-forest/20 transition-colors italic">
          Google Ad Placement
        </div>
        
        {/* Subtle hover pulse */}
        <div className="absolute inset-0 bg-forest/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </div>
  );
}
