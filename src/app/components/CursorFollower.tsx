"use client";

import { useEffect, useState } from "react";

const CursorFollower = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // Check if the element or any of its parents have onClick or id="menu"
      let currentElement: HTMLElement | null = target;
      while (currentElement) {
        // Check for onClick attribute or event
        const hasOnClick = currentElement.hasAttribute('onclick') || 
                           currentElement.onclick !== null ||
                           currentElement.getAttribute('role') === 'button';
        
        // Check for id="menu"
        const hasMenuId = currentElement.id === 'menu';
        
        if (["A", "BUTTON", "INPUT"].includes(currentElement.tagName) || 
            currentElement.closest("a, button, input") ||
            hasOnClick || 
            hasMenuId) {
          setIsHovering(true);
          return;
        }
        
        currentElement = currentElement.parentElement;
      }
      
      setIsHovering(false);
    };

    const handleMouseOut = () => {
      setIsHovering(false);
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mouseout", handleMouseOut);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mouseout", handleMouseOut);
    };
  }, []);

  return (
    <div
      className={"cursorFollower"}
      style={{
        top: position.y,
        left: position.x,
        width: isHovering ? "32px" : "16px",
        height: isHovering ? "32px" : "16px",
        backgroundColor: isHovering ? "rgba(139, 25, 16, .6)" : "rgba(139, 25, 16, 0.25)",
      }}
    />
  );
};

export default CursorFollower;