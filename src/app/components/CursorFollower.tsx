"use client";

import { useEffect, useRef, useCallback } from "react";

const CursorFollower = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const isHoveringRef = useRef(false);
  const isMenuActiveRef = useRef(false);
  const isPressedRef = useRef(false);

  const updateCursorStyle = useCallback(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const isHovering = isHoveringRef.current;
    const isMenuActive = isMenuActiveRef.current;
    const isPressed = isPressedRef.current;

    const baseSize = isHovering ? 32 : 16;
    const size = isPressed ? `${baseSize * 0.87}px` : `${baseSize}px`;
    cursor.style.width = size;
    cursor.style.height = size;

    const baseOpacity = isHovering ? 0.6 : 0.25;
    const opacity = isPressed ? Math.min(baseOpacity + 0.3, 1) : baseOpacity;
    cursor.style.backgroundColor = isMenuActive
      ? `rgba(248, 233, 216, ${opacity})`
      : `rgba(137, 25, 16, ${opacity})`;
  }, []);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const moveCursor = (e: MouseEvent) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      let isOverMenuActive = false;
      let isHovering = false;
      let currentElement: HTMLElement | null = target;

      while (currentElement) {
        if (currentElement.id === 'menuActive') {
          isOverMenuActive = true;
        }

        if (
          !isHovering &&
          (
            ["A", "BUTTON", "INPUT", "TEXTAREA", "LABEL"].includes(currentElement.tagName) ||
            currentElement.hasAttribute('onclick') ||
            typeof currentElement.onclick === 'function' ||
            currentElement.getAttribute('role') === 'button' ||
            currentElement.id.includes('enemy') ||
            currentElement.id === 'menu'
          )
        ) {
          isHovering = true;
        }

        currentElement = currentElement.parentElement;
      }

      isHoveringRef.current = isHovering;
      isMenuActiveRef.current = isOverMenuActive;
      updateCursorStyle();
    };

    const handleMouseOut = () => {
      isHoveringRef.current = false;
      isMenuActiveRef.current = false;
      updateCursorStyle();
    };

    const handleMouseDown = () => {
      isPressedRef.current = true;
      updateCursorStyle();
    };

    const handleMouseUp = () => {
      isPressedRef.current = false;
      updateCursorStyle();
    };

    window.addEventListener("mousemove", moveCursor, { passive: true });
    window.addEventListener("mouseover", handleMouseOver, { passive: true });
    window.addEventListener("mouseout", handleMouseOut, { passive: true });
    window.addEventListener("mousedown", handleMouseDown, { passive: true });
    window.addEventListener("mouseup", handleMouseUp, { passive: true });

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mouseout", handleMouseOut);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [updateCursorStyle]);

  return (
    <div
      ref={cursorRef}
      className="cursorFollower"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: "16px",
        height: "16px",
        backgroundColor: "rgba(137, 25, 16, 0.25)",
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        transition: 'width 0.2s, height 0.2s, background-color 0.2s',
        zIndex: 9999,
        borderRadius: '50%',
      }}
    />
  );
};

export default CursorFollower;
