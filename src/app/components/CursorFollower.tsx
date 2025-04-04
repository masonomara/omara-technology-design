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

      // Traverse the DOM from the target element upwards to check if it's inside the parent
      if (["A", "BUTTON", "INPUT"].includes(target.tagName) || target.closest("a, button, input")) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
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
  }, []); // Re-run effect if isMobile changes


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
