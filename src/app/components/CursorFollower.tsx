"use client";

import { useEffect, useState, useCallback } from "react";

const CursorFollower = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [cursorState, setCursorState] = useState({
    isHovering: false,
    isMenuActive: false
  });

  const moveCursor = useCallback((e: MouseEvent) => {
    requestAnimationFrame(() => {
      setPosition({ x: e.clientX, y: e.clientY });
    });
  }, []);

  const handleMouseOver = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;

    // Check for menu active state
    let isOverMenuActive = false;
    let isHovering = false;
    let currentElement: HTMLElement | null = target;

    // Single traversal through the DOM hierarchy
    while (currentElement) {
      // Menu active check
      if (currentElement.id === 'menuActive') {
        isOverMenuActive = true;
      }

      // Interactive element check
      if (!isHovering && (
        ["A", "BUTTON", "INPUT"].includes(currentElement.tagName) ||
        currentElement.hasAttribute('onclick') ||
        currentElement.onclick !== null ||
        currentElement.getAttribute('role') === 'button' ||
        currentElement.id === 'menu'
      )) {
        isHovering = true;
      }

      currentElement = currentElement.parentElement;
    }

    setCursorState({ isHovering, isMenuActive: isOverMenuActive });
  }, []);

  const handleMouseOut = useCallback(() => {
    setCursorState({ isHovering: false, isMenuActive: false });
  }, []);

  useEffect(() => {
    // Passive: true improves performance for scroll/touch events
    window.addEventListener("mousemove", moveCursor, { passive: true });
    window.addEventListener("mouseover", handleMouseOver, { passive: true });
    window.addEventListener("mouseout", handleMouseOut, { passive: true });

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mouseout", handleMouseOut);
    };
  }, [moveCursor, handleMouseOver, handleMouseOut]);

  const { isHovering, isMenuActive } = cursorState;

  // Prepare styles outside the render to reduce calculations
  const backgroundColor = isMenuActive
    ? isHovering ? "rgba(248, 237, 226, 0.6)" : "rgba(248, 237, 226, 0.25)"
    : isHovering ? "rgba(151, 27, 17, .6)" : "rgba(151, 27, 17, 0.25)";

  const size = isHovering ? "32px" : "16px";

  return (
    <div
      className="cursorFollower"
      style={{
        position: 'fixed', // Add position fixed for better performance
        top: position.y,
        left: position.x,
        width: size,
        height: size,
        backgroundColor,
        transform: 'translate(-50%, -50%)', // Center the cursor
        pointerEvents: 'none', // Ensure it doesn't interfere with clicks
        transition: 'width 0.2s, height 0.2s, background-color 0.2s', // Smooth transitions
        zIndex: 9999, // Make sure it's on top
        borderRadius: '50%', // Circular cursor
      }}
    />
  );
};

export default CursorFollower;