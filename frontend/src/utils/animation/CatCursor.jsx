import { useEffect, useRef, useState, useCallback } from "react";


const SPRITE_W = 548;
const SPRITE_H = 200;
const FRAME_W = 78;
const FRAME_H = 100;
const WALK_FRAMES = 7;
const IDLE_FRAMES = 5;

const WALK_SPEED = 100;
const IDLE_SPEED = 200;

const CAT_W = 78;
const CAT_H = 80;

const ARRIVE_DIST = 12;

const WALK_PX = 3.5;

const SPRITE_B64 =
  "iVBORw0KGgoAAAANSUhEUgAAAiQAAADICAYAAADY6vqgAAABCGlDQ1BJQ0MgUHJvZmlsZQAAeJxjYGA8wQAELAYMDLl5JUVB7k4KEZFRCuwPGBiBEAwSk4sLGHADoKpv1yBqL+viUYcLcKakFicD6Q9ArFIEtBxopAiQLZIOYWuA2EkQtg2IXV5SUAJkB4DYRSFBzkB2CpCtkY7ETkJiJxcUgdT3ANk2uTmlyQh3M/Ck5oUGA2kOIJZhKGYIYnBncAL5H6IkfxEDg8VXBgbmCQixpJkMDNtbGRgkbiHEVBYwMPC3MDBsO48QQ4RJQWJRIliIBYiZ0tIYGD4tZ2DgjWRgEL7AwMAVDQsIHG5TALvNnSEfCNMZchhSgSKeDHkMyQx6QJYRgwGDIYMZAKbWPz9HbOBQAAAjhElEQVR4nO3d2XNb2bXfcYLgTHGQOAIgwJkSJbVaUlo9SD3d2C+uJPfmVqUc5yGVlP+plPMXpNKuVLlSeYjj2+62W1O7B0ktaqA4gJg5zwNAgsxLHvxbyj0omCA3QH4/b0sHwzn7HBxuYS2s7avCieqItBz9dbwc2/QV8/zOvjZ5/lJivajnAwBQCapd7wAAAAATEgAA4BwTEgAA4BwTEgAA4BwTEgAA4BwTEgAA4BwTEgAA4BwTEgAA4Byva0ICAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOdKvg5COByWxRaaWy7I9lcvXrL2AsrWh+9/YNZm0bVDHv/lW67fYxgf1bVqqk1rxonXk4wv8De6+sHn8vlqbGmV7SuLCxLPPn1UVp83OrUCAADnmJAAAADnmJAAAADnakr9gvF4vKxyUmdNONwvOcLh4WHZ/tVXXzL+RegPR2Q8H337WMbv+rVxLSJBUYb7B2T8Xr7RGpF7H7zP+JZQuL9PxjM+l+B+cIYNXv3IfH4aJNrc3NfHD49LnN9alefHpl87vV74hgQAADjHhAQAADjHhAQAAOBczfBwj+SMp6fnJWf87q2b8oR4KimPr6rWMBjuln9IxRcqKocfCvRpDj2dKGr/N9e1ZqS5RWtE/s2//XuJf/e730n8n//jf5L4N//lv0rs9xUs+zlXfv3rX0v81Vdfyfn78ssHFXX9WSddM2JdvnxZ4mRqUeKDA1PUBAAlwjckAADAOSYkAADAOSYkAADAuaLzX6OXhySntpvLyvbe3l6JDw815/bD4x/Jcf6Vq1evy3heMH0xfvWrX0n8m9/8RuKhoSGJ19bWJH748H5FjXckoDUEsfTxaghuX78pr9fcojUOPp++/E52R+KLFy9KvLKyIvH3PzypqPEttbHRYVNDomtp1Pj0/zyNjY0S19bWSry9vS3x4+/P9/j2BjplfD//+WfZ/uGHHyXO7u5KnIxHzfXxK9bAsNZEXWjrle27u3p/WFnbkHg9vcda4x0ZvCrv3+bWI9sPfXUSX2jv0v1Z1vOh";

const SPRITE_SRC = `data:image/png;base64,${SPRITE_B64}`;

const CatCursor = ({ enabled }) => {
  const [catPos, setCatPos] = useState({ x: -200, y: -200 });
  const [frame, setFrame] = useState(0);
  const [row, setRow] = useState(1); // 0=walk, 1=idle
  const [flipped, setFlipped] = useState(false);
  const [frameCount, setFrameCount] = useState(0);

  const cursorRef = useRef({ x: -200, y: -200 });
  const catRef = useRef({ x: -200, y: -200 });
  const rafRef = useRef(null);
  const frameTimer = useRef(null);

  const animate = useCallback(() => {
    const cursor = cursorRef.current;
    const cat = catRef.current;

    const dx = cursor.x - cat.x;
    const dy = cursor.y - cat.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > ARRIVE_DIST) {
      const nx = cat.x + (dx / dist) * WALK_PX;
      const ny = cat.y + (dy / dist) * WALK_PX;
      catRef.current = { x: nx, y: ny };
      setCatPos({ x: nx, y: ny });
      setRow(0);
      setFlipped(dx < 0);
    } else {
      // Idle
      setRow(1);
    }

    rafRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    frameTimer.current = setInterval(() => {
      setFrameCount((c) => c + 1);
    }, WALK_SPEED);
    return () => clearInterval(frameTimer.current);
  }, [enabled]);

  useEffect(() => {
    const maxFrames = row === 0 ? WALK_FRAMES : IDLE_FRAMES;
    setFrame((frameCount) => frameCount % maxFrames);
  }, [frameCount, row]);

  useEffect(() => {
    if (!enabled) return;

    const onMove = (e) => {
      cursorRef.current = {
        x: e.clientX + window.scrollX - CAT_W / 2,
        y: e.clientY + window.scrollY - CAT_H,
      };
    };

    window.addEventListener("mousemove", onMove);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, [enabled, animate]);

  if (!enabled) return null;

  const spriteX = -(frame * FRAME_W);
  const spriteY = -(row * FRAME_H);

  return (
    <div
      style={{
        position: "fixed",
        left: catPos.x,
        top: catPos.y,
        width: CAT_W,
        height: CAT_H,
        pointerEvents: "none",
        zIndex: 9999,
        imageRendering: "pixelated",
        transform: flipped ? "scaleX(-1)" : "scaleX(1)",
        backgroundImage: `url(${SPRITE_SRC})`,
        backgroundPosition: `${spriteX}px ${spriteY}px`,
        backgroundSize: `${SPRITE_W}px ${SPRITE_H}px`,
        backgroundRepeat: "no-repeat",
        transition: "none",
      }}
    />
  );
};

export default CatCursor;
