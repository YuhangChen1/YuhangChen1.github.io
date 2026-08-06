"use client";

import { useEffect, useRef } from "react";

export function CursorJasmine() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const petalLayerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    let currentX = window.innerWidth / 2;
    let currentY = window.innerHeight / 2;
    let targetX = currentX;
    let targetY = currentY;
    let frame = 0;
    let lastPetal = 0;

    const onMove = (event: PointerEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;

      const now = performance.now();
      if (now - lastPetal > 120 && Math.random() > 0.48) {
        lastPetal = now;
        spawnPetal(event.clientX, event.clientY);
      }
    };

    const spawnPetal = (x: number, y: number) => {
      if (!petalLayerRef.current) {
        return;
      }

      const petal = document.createElement("span");
      const dx = `${(Math.random() - 0.5) * 28}px`;
      const dy = `${24 + Math.random() * 28}px`;
      const rotateStart = `${Math.random() * 90 - 45}deg`;
      const rotateEnd = `${Math.random() * 160 - 80}deg`;
      const scale = (0.8 + Math.random() * 0.55).toFixed(2);
      const duration = `${900 + Math.random() * 700}ms`;

      petal.className = "gardenia-petal";
      petal.style.left = `${x - 2}px`;
      petal.style.top = `${y - 2}px`;
      petal.style.setProperty("--petal-dx", dx);
      petal.style.setProperty("--petal-dy", dy);
      petal.style.setProperty("--petal-r1", rotateStart);
      petal.style.setProperty("--petal-r2", rotateEnd);
      petal.style.setProperty("--petal-scale", scale);
      petal.style.animationDuration = duration;
      petalLayerRef.current.appendChild(petal);

      petal.addEventListener("animationend", () => petal.remove(), { once: true });
    };

    const tick = () => {
      currentX += (targetX - currentX) * 0.16;
      currentY += (targetY - currentY) * 0.16;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${currentX - 9}px, ${currentY - 9}px, 0)`;
      }

      frame = window.requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    frame = window.requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
      <div ref={petalLayerRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-50 hidden md:block" />
      <div
        ref={cursorRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[60] hidden h-[22px] w-[22px] md:block"
      >
        <div className="gardenia-cursor h-full w-full" />
      </div>
    </>
  );
}
