import { useEffect, useRef, useState, useCallback } from "react";
import catSprite from "../../components/res/catsprites-running.png";
import catStopSprite from "../../components/res/catsprites-stopping.png";

const WALK_OFFSETS = [0, 22, 44, 68, 90, 113];
const STOP_OFFSETS = [0, 21, 42, 63];

const WALK_SPRITE_W = 137;
const STOP_SPRITE_W = 140;
const SPRITE_H = 14;
const STOP_SPRITE_H = 17;

const WALK_FRAMES = 6;
const STOP_FRAMES = 5;

const SCALE = 2;
const CAT_W = 24 * SCALE;
const CAT_H = 17 * SCALE;
const ARRIVE_DIST = 12;
const WALK_PX = 3.5;
const WALK_SPEED = 100;
const STOP_SPEED = 750;
const ROAM_INTERVAL = 3000;

const isMobileDevice = () => window.matchMedia("(pointer: coarse)").matches;

const CatCursor = ({ enabled, startPos }) => {
  const initial = startPos ?? { x: -200, y: -200 };
  const [catPos, setCatPos] = useState(initial);
  const [frame, setFrame] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [mode, setMode] = useState("walk");
  const [isMobile] = useState(isMobileDevice);

  const cursorRef = useRef(initial);
  const catRef = useRef(initial);
  const rafRef = useRef(null);
  const modeRef = useRef("walk");

  const setModeSync = (m) => {
    modeRef.current = m;
    setMode(m);
  };

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
      setFlipped(dx > 0);
      if (modeRef.current !== "walk") {
        setModeSync("walk");
        setFrame(0);
      }
    } else {
      if (modeRef.current === "walk") {
        setModeSync("stop");
        setFrame(0);
      }
    }

    rafRef.current = requestAnimationFrame(animate);
  }, []);
  useEffect(() => {
    if (enabled && startPos) {
      setCatPos(startPos);
      catRef.current = startPos;
      cursorRef.current = startPos;
    }
  }, [enabled, startPos]);

  useEffect(() => {
    if (!enabled) return;

    const speed = mode === "stop" ? STOP_SPEED : WALK_SPEED;

    const timer = setInterval(() => {
      if (mode === "walk") {
        setFrame((f) => (f + 1) % WALK_FRAMES);
      } else if (mode === "stop") {
        setFrame((f) => {
          const next = f + 1;
          if (next >= STOP_FRAMES) {
            setModeSync("idle");
            return STOP_FRAMES - 1;
          }
          return next;
        });
      }
    }, speed);

    return () => clearInterval(timer);
  }, [enabled, mode]);

  useEffect(() => {
    if (!enabled || isMobile) return;
    const onMove = (e) => {
      cursorRef.current = {
        x: e.clientX - CAT_W / 2,
        y: e.clientY - CAT_H,
      };
    };
    window.addEventListener("mousemove", onMove);
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, [enabled, isMobile, animate]);

  useEffect(() => {
    if (!enabled || !isMobile) return;
    cursorRef.current = {
      x: Math.random() * (window.innerWidth - CAT_W),
      y: Math.random() * (window.innerHeight - CAT_H),
    };
    rafRef.current = requestAnimationFrame(animate);
    const roam = setInterval(() => {
      cursorRef.current = {
        x: Math.random() * (window.innerWidth - CAT_W),
        y: Math.random() * (window.innerHeight - CAT_H),
      };
    }, ROAM_INTERVAL);
    return () => {
      clearInterval(roam);
      cancelAnimationFrame(rafRef.current);
    };
  }, [enabled, isMobile, animate]);

  if (!enabled) return null;

  const isStop = mode === "stop" || mode === "idle";
  const offsets = isStop ? STOP_OFFSETS : WALK_OFFSETS;
  const spriteW = isStop ? STOP_SPRITE_W : WALK_SPRITE_W;
  const spriteH = isStop ? STOP_SPRITE_H : SPRITE_H;
  const frameW = isStop ? 21 : 24;

  return (
    <div
      style={{
        position: "fixed",
        left: catPos.x,
        top: catPos.y,
        width: frameW * SCALE,
        height: CAT_H,
        pointerEvents: "none",
        zIndex: 9999,
        imageRendering: "pixelated",
        transform: flipped ? "scaleX(-1)" : "scaleX(1)",
        backgroundImage: `url(${isStop ? catStopSprite : catSprite})`,
        backgroundPosition: `-${offsets[frame] * SCALE}px 0px`,
        backgroundSize: `${spriteW * SCALE}px ${spriteH * SCALE}px`,
        backgroundRepeat: "no-repeat",
        transition: "none",
      }}
    />
  );
};

export default CatCursor;
