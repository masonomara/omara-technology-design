"use client";

import { useEffect, useState } from "react";

const CursorFollower = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isMenuActive, setIsMenuActive] = useState(false); // New state for menuActive

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // First check specifically for menuActive ID
      let isOverMenuActive = false;
      let currentElement: HTMLElement | null = target;
      while (currentElement) {
        if (currentElement.id === 'menuActive') {
          isOverMenuActive = true;
          break;
        }
        currentElement = currentElement.parentElement;
      }
      setIsMenuActive(isOverMenuActive);

      // Reset current element to check for other interactive elements
      currentElement = target;
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
      setIsMenuActive(false);
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
        backgroundColor: isMenuActive
          ? isHovering ?  "rgba(237, 225, 204, 0.6)" : "rgba(237, 225, 204, 0.25)"
          : isHovering
            ? "rgba(139, 25, 16, .6)"
            : "rgba(139, 25, 16, 0.25)",
      }}
    />
  );
};

export default CursorFollower;