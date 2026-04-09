(function () {
  const canvas = document.getElementById("fluid-canvas");
  if (!canvas) {
    return;
  }

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const context = canvas.getContext("2d", { alpha: true });
  if (!context) {
    return;
  }

  const pointer = {
    x: 0,
    y: 0,
    active: false
  };

  let width = 0;
  let height = 0;
  let dpr = 1;
  let animationFrame = null;
  const blobs = [];

  function randomBetween(min, max) {
    return min + Math.random() * (max - min);
  }

  function createBlob(x, y, sizeMultiplier) {
    const angle = randomBetween(0, Math.PI * 2);
    const speed = randomBetween(0.15, 0.55) * (sizeMultiplier || 1);
    const colorModes = [
      "86, 121, 255",
      "90, 190, 255",
      "255, 170, 98",
      "255, 110, 110"
    ];

    return {
      x,
      y,
      radius: randomBetween(120, 230) * (sizeMultiplier || 1),
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      drift: randomBetween(-0.003, 0.003),
      seed: randomBetween(0, Math.PI * 2),
      color: colorModes[Math.floor(Math.random() * colorModes.length)],
      alpha: randomBetween(0.045, 0.08)
    };
  }

  function resizeCanvas() {
    dpr = Math.max(window.devicePixelRatio || 1, 1);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function seedBlobs() {
    blobs.length = 0;
    const count = reducedMotion ? 6 : 14;

    for (let index = 0; index < count; index += 1) {
      blobs.push(
        createBlob(
          randomBetween(0, width),
          randomBetween(0, height),
          randomBetween(0.8, 1.2)
        )
      );
    }
  }

  function wrap(blob) {
    const padding = blob.radius * 0.8;

    if (blob.x < -padding) {
      blob.x = width + padding;
    } else if (blob.x > width + padding) {
      blob.x = -padding;
    }

    if (blob.y < -padding) {
      blob.y = height + padding;
    } else if (blob.y > height + padding) {
      blob.y = -padding;
    }
  }

  function drawBlob(blob) {
    const gradient = context.createRadialGradient(
      blob.x,
      blob.y,
      0,
      blob.x,
      blob.y,
      blob.radius
    );

    gradient.addColorStop(0, `rgba(${blob.color}, ${blob.alpha})`);
    gradient.addColorStop(0.5, `rgba(${blob.color}, ${blob.alpha * 0.45})`);
    gradient.addColorStop(1, `rgba(${blob.color}, 0)`);

    context.fillStyle = gradient;
    context.beginPath();
    context.arc(blob.x, blob.y, blob.radius, 0, Math.PI * 2);
    context.fill();
  }

  function animate(time) {
    context.clearRect(0, 0, width, height);
    context.globalCompositeOperation = "source-over";

    context.fillStyle = "rgba(255, 255, 255, 0.04)";
    context.fillRect(0, 0, width, height);

    context.globalCompositeOperation = "screen";

    blobs.forEach((blob, index) => {
      const wave = Math.sin(time * 0.00035 + blob.seed + index * 0.2);
      blob.vx += Math.cos(time * 0.00018 + blob.seed) * blob.drift;
      blob.vy += Math.sin(time * 0.00022 + blob.seed) * blob.drift;

      blob.x += blob.vx + wave * 0.08;
      blob.y += blob.vy + wave * 0.06;

      if (pointer.active) {
        const dx = blob.x - pointer.x;
        const dy = blob.y - pointer.y;
        const distance = Math.max(Math.hypot(dx, dy), 1);
        const influence = Math.max(0, 240 - distance) / 240;

        blob.x += (dx / distance) * influence * 0.9;
        blob.y += (dy / distance) * influence * 0.9;
      }

      wrap(blob);
      drawBlob(blob);
    });

    animationFrame = window.requestAnimationFrame(animate);
  }

  function addPointerBurst(x, y, strength) {
    if (reducedMotion) {
      return;
    }

    const count = strength > 1 ? 4 : 2;
    for (let index = 0; index < count; index += 1) {
      blobs.push(createBlob(x + randomBetween(-30, 30), y + randomBetween(-30, 30), randomBetween(0.45, 0.75)));
    }

    while (blobs.length > 22) {
      blobs.shift();
    }
  }

  window.addEventListener("pointermove", (event) => {
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    pointer.active = true;
    addPointerBurst(pointer.x, pointer.y, 1);
  });

  window.addEventListener("pointerdown", (event) => {
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    pointer.active = true;
    addPointerBurst(pointer.x, pointer.y, 2);
  });

  window.addEventListener("pointerleave", () => {
    pointer.active = false;
  });

  window.addEventListener("blur", () => {
    pointer.active = false;
  });

  window.addEventListener("resize", () => {
    resizeCanvas();
    seedBlobs();
  });

  resizeCanvas();
  seedBlobs();
  animationFrame = window.requestAnimationFrame(animate);

  window.addEventListener("beforeunload", () => {
    if (animationFrame !== null) {
      window.cancelAnimationFrame(animationFrame);
    }
  });
})();
