"use client"

import React, { useState, useRef } from 'react';

const RippleButton = ({ children }: { children: React.ReactNode }) => {
  const [ripples, setRipples] = useState<any[]>([]);
  const buttonRef = useRef<HTMLDivElement>(null);

  const createRipple = (e: React.MouseEvent<HTMLDivElement>) => {
    const button = buttonRef.current;
    if (!button) return;

    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const newRipple = {
      x,
      y,
      size,
    };

    setRipples((prevRipples) => [...prevRipples, newRipple]);

    // Remove ripple after animation ends (1s)
    setTimeout(() => {
      setRipples((prevRipples) => prevRipples.filter((ripple) => ripple !== newRipple));
    }, 200); // Matches the animation duration
  };

  return (
    <div
      ref={buttonRef}
      className="ripple"
      onMouseEnter={createRipple}
      style={{
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
      }}
    >
      {children}
      {ripples.map((ripple, index) => (
        <span
          key={index}
          className="rippleEffect"
          style={{
            position: 'absolute',
            borderRadius: '50%',
            background: 'rgba(0, 0, 0, 1)',
            width: ripple.size,
            height: ripple.size,
            left: ripple.x,
            top: ripple.y,
            animation: 'rippleAnimation .2s linear',
          }}
        />
      ))}
    </div>
  );
};

export default RippleButton;
