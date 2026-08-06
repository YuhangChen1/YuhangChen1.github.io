"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";

const photos = Array.from({ length: 67 }, (_, index) => `/japan/${index + 1}.jpg`);

export function JapanGallery() {
  const [index, setIndex] = useState(0);
  const startX = useRef<number | null>(null);

  const move = useCallback((step: number) => {
    setIndex((current) => (current + step + photos.length) % photos.length);
  }, []);

  return (
    <section id="japan" className="content-section japan-section scroll-mt-24">
      <div className="section-heading">
        <p className="section-kicker">Japan</p>
        <h2 className="section-title">A Personal Travel Record</h2>
      </div>
      <p className="japan-copy">
        Here are photos I took while traveling in Japan. I love traveling in Japan - the people, the scenery, and the food. I hope to study there someday and eventually settle down in this wonderful and fascinating country.
      </p>
      <div
        className="japan-gallery"
        tabIndex={0}
        aria-label="Japan travel photo gallery"
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") move(-1);
          if (event.key === "ArrowRight") move(1);
        }}
        onTouchStart={(event) => {
          startX.current = event.changedTouches[0]?.clientX ?? null;
        }}
        onTouchEnd={(event) => {
          const endX = event.changedTouches[0]?.clientX;
          if (startX.current !== null && endX !== undefined) {
            const distance = endX - startX.current;
            if (Math.abs(distance) > 40) move(distance < 0 ? 1 : -1);
          }
          startX.current = null;
        }}
      >
        <div className="japan-gallery-frame">
          <Image
            key={photos[index]}
            src={photos[index]}
            alt={`Travel photo taken in Japan (${index + 1} of ${photos.length})`}
            fill
            sizes="(max-width: 720px) 100vw, 760px"
            className="japan-gallery-image"
            priority={index === 0}
          />
        </div>
        <div className="japan-gallery-controls">
          <button type="button" className="gallery-button" onClick={() => move(-1)} aria-label="Previous photo">
            <span aria-hidden="true">&#8592;</span>
          </button>
          <p className="gallery-count" aria-live="polite">{String(index + 1).padStart(2, "0")} / {photos.length}</p>
          <button type="button" className="gallery-button" onClick={() => move(1)} aria-label="Next photo">
            <span aria-hidden="true">&#8594;</span>
          </button>
        </div>
      </div>
    </section>
  );
}
