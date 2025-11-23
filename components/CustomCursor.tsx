import React, { useEffect, useState } from 'react';

const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Check if target is clickable
      if (target.tagName === 'BUTTON' || target.tagName === 'A' || target.closest('button') || target.closest('a')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseover', onMouseOver);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', onMouseOver);
    };
  }, []);

  return (
    <>
      {/* Main Cursor Dot */}
      <div 
        className="fixed top-0 left-0 w-2 h-2 bg-primary rounded-full pointer-events-none z-50 transform -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
        style={{ left: `${position.x}px`, top: `${position.y}px` }}
      />
      {/* Trailing Ring */}
      <div 
        className={`fixed top-0 left-0 border border-primary rounded-full pointer-events-none z-50 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-150 ease-out mix-blend-difference ${isHovering ? 'w-12 h-12 opacity-80 border-2 bg-primary/20' : 'w-8 h-8 opacity-40'}`}
        style={{ left: `${position.x}px`, top: `${position.y}px` }}
      />
    </>
  );
};

export default CustomCursor;