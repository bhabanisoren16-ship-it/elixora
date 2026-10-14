import React, { useRef, useState, useEffect } from 'react';

/**
 * MagneticButton: High-end interactive button that magnetically gravitates 
 * towards the user's cursor on desktop, providing award-winning tactile feel.
 */
export default function MagneticButton({
  children,
  onClick,
  className = '',
  strength = 0.28,
  as: Component = 'button',
  ...props
}) {
  const btnRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!btnRef.current) return;
    const { left, top, width, height } = btnRef.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const deltaX = (e.clientX - centerX) * strength;
    const deltaY = (e.clientY - centerY) * strength;
    setPosition({ x: deltaX, y: deltaY });
  };

  const handleMouseEnter = () => setIsHovered(true);

  const handleMouseLeave = () => {
    setIsHovered(false);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <Component
      ref={btnRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        transition: isHovered
          ? 'transform 0.1s ease-out'
          : 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)',
      }}
      className={`relative inline-flex items-center justify-center cursor-pointer transition-colors will-change-transform ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}
