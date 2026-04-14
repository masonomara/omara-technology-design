interface FrameRelativeRect {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

interface Position {
  x: number;
  y: number;
}

/**
 * Returns a random (x, y) position within the game frame that does not overlap
 * any of the provided avoid-rects. All coordinates are relative to the frame.
 *
 * @param frameWidth  - width of the game frame in px
 * @param frameHeight - height of the game frame in px
 * @param enemyWidth  - width of the enemy element in px
 * @param enemyHeight - height of the enemy element in px
 * @param avoidRects  - frame-relative rects that the enemy must not overlap
 */
export function getEnemyPosition(
  frameWidth: number,
  frameHeight: number,
  enemyWidth: number,
  enemyHeight: number,
  avoidRects: FrameRelativeRect[],
): Position {
  let x: number, y: number, overlap: boolean;

  do {
    x = Math.random() * (frameWidth - enemyWidth);
    y = Math.random() * (frameHeight - enemyHeight);

    overlap = avoidRects.some(
      (rect) =>
        x < rect.right &&
        x + enemyWidth > rect.left &&
        y < rect.bottom &&
        y + enemyHeight > rect.top,
    );
  } while (overlap);

  return { x, y };
}

/**
 * Converts a DOMRect (page coordinates) into coordinates relative to a frame rect.
 */
export function toFrameCoords(rect: DOMRect, frameRect: DOMRect): FrameRelativeRect {
  return {
    left: rect.left - frameRect.left,
    right: rect.right - frameRect.left,
    top: rect.top - frameRect.top,
    bottom: rect.bottom - frameRect.top,
  };
}
