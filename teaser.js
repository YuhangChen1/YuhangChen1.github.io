(function () {
  const PLACEHOLDER_MEDIA = window.PLACEHOLDER_MEDIA || "";
  const PAGE_MEDIA = window.PAGE_MEDIA || {};

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function randomBetween(min, max) {
    return min + Math.random() * (max - min);
  }

  function normalizeMediaSource(src) {
    if (!src) {
      return "";
    }

    if (src.startsWith("file:///")) {
      return `/__local_asset__?path=${encodeURIComponent(src.slice("file://".length))}`;
    }

    if (src.startsWith("/mnt/")) {
      return `/__local_asset__?path=${encodeURIComponent(src)}`;
    }

    return src;
  }

  function setImageSource(node, src) {
    if (!node || node.tagName !== "IMG" || !src) {
      return;
    }

    node.src = normalizeMediaSource(src);
  }

  function applyImageList(selector, sources, fallback = "") {
    const nodes = Array.from(document.querySelectorAll(selector));
    nodes.forEach((node, index) => {
      const source = Array.isArray(sources) ? sources[index] || fallback : fallback;
      setImageSource(node, source);
    });
  }

  function applyPlaceholderMedia() {
    const heroDesigner = PAGE_MEDIA.hero_designer || PLACEHOLDER_MEDIA;
    const heroCoder = PAGE_MEDIA.hero_coder || heroDesigner;
    const profilePhoto = PAGE_MEDIA.profile_photo || heroDesigner;
    const defaultSectionImage = PAGE_MEDIA.default_section_image || heroDesigner;
    const defaultLogoImage = PAGE_MEDIA.default_logo_image || heroDesigner;

    if (heroDesigner) {
      document.documentElement.style.setProperty("--placeholder-image", `url("${normalizeMediaSource(heroDesigner)}")`);
    }

    setImageSource(document.getElementById("designer-img"), heroDesigner);
    setImageSource(document.getElementById("coder-img"), heroCoder);
    setImageSource(document.querySelector(".profile-photo"), profilePhoto);

    applyImageList('img.paper-media[alt="Paper preview"]', PAGE_MEDIA.publication_media, defaultSectionImage);
    applyImageList('img.paper-media[alt="Project preview"]', PAGE_MEDIA.project_media, defaultSectionImage);
    applyImageList('img.org-logo[alt="Organization logo"]', PAGE_MEDIA.research_logos, defaultLogoImage);
    applyImageList('img.org-logo[alt="School logo"]', PAGE_MEDIA.education_logos, defaultLogoImage);
  }

  function initToggles() {
    document.querySelectorAll("[data-toggle-target]").forEach((button) => {
      button.addEventListener("click", () => {
        const selector = button.dataset.toggleTarget;
        const displayValue = button.dataset.toggleDisplay || "block";
        const nodes = Array.from(document.querySelectorAll(selector));

        if (nodes.length === 0) {
          return;
        }

        const shouldShow = nodes.every((node) => window.getComputedStyle(node).display === "none");

        nodes.forEach((node) => {
          node.style.display = shouldShow ? displayValue : "none";
        });

        button.textContent = shouldShow ? "Show less" : "Show all";
      });
    });
  }

  function initImageLightbox() {
    const lightbox = document.getElementById("image-lightbox");
    const lightboxImage = document.getElementById("image-lightbox-img");

    if (!lightbox || !lightboxImage) {
      return;
    }

    const closeButtons = lightbox.querySelectorAll(".image-lightbox__backdrop, .image-lightbox__close");

    function closeLightbox() {
      lightbox.classList.remove("is-open");
      lightbox.setAttribute("aria-hidden", "true");
      lightboxImage.removeAttribute("src");
      document.body.style.overflow = "";
    }

    function openLightbox(source, altText) {
      if (!source) {
        return;
      }

      lightboxImage.src = source;
      lightboxImage.alt = altText || "Enlarged paper preview";
      lightbox.classList.add("is-open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    }

    closeButtons.forEach((button) => {
      button.addEventListener("click", closeLightbox);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && lightbox.classList.contains("is-open")) {
        closeLightbox();
      }
    });

    function bindImage(image) {
      if (!image) {
        return;
      }

      image.tabIndex = 0;
      image.setAttribute("role", "button");
      image.setAttribute("aria-label", `Open enlarged image: ${image.alt || "preview"}`);

      const open = () => openLightbox(image.currentSrc || image.src, image.alt);

      image.addEventListener("click", open);
      image.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          open();
        }
      });
    }

    document.querySelectorAll(
      [
        ".profile-photo",
        "#designer-img",
        "#coder-img",
        'img.paper-media[alt="Paper preview"]',
        'img.paper-media[alt="Project preview"]',
        ".org-logo",
        ".japan-gallery__image"
      ].join(", ")
    ).forEach((image) => {
      bindImage(image);
    });
  }

  function initJapanGallery() {
    const images = Array.isArray(PAGE_MEDIA.japan_gallery) ? PAGE_MEDIA.japan_gallery : [];
    const galleryImage = document.getElementById("japan-gallery-image");
    const prevButton = document.getElementById("japan-gallery-prev");
    const nextButton = document.getElementById("japan-gallery-next");

    if (!galleryImage || !prevButton || !nextButton || images.length === 0) {
      return;
    }

    let currentIndex = 0;
    let timerId = null;

    function render() {
      const source = images[currentIndex];
      galleryImage.src = normalizeMediaSource(source);
      galleryImage.alt = `Travel photo taken in Japan (${currentIndex + 1}/${images.length})`;
    }

    function show(step) {
      currentIndex = (currentIndex + step + images.length) % images.length;
      render();
    }

    function restartTimer() {
      if (timerId) {
        window.clearInterval(timerId);
      }
      timerId = window.setInterval(() => {
        show(1);
      }, 4000);
    }

    prevButton.addEventListener("click", () => {
      show(-1);
      restartTimer();
    });

    nextButton.addEventListener("click", () => {
      show(1);
      restartTimer();
    });

    galleryImage.addEventListener("load", () => {
      galleryImage.dataset.galleryReady = "true";
    });

    render();
    restartTimer();
  }

  function initHero() {
    const face = document.getElementById("face");
    const avatarOrb = document.getElementById("avatar-orb");
    const particlesLayer = document.getElementById("page-particles") || document.getElementById("hero-particles");
    const scrollHint = document.querySelector(".teaser-hero__scroll");
    const teaserSection = document.querySelector(".teaser-hero");
    const pageContent = document.getElementById("page-content");

    if (!face || !avatarOrb || !particlesLayer || !teaserSection || !pageContent) {
      return;
    }

    const designerDesc = document.querySelector("#designer .description");
    const coderDesc = document.querySelector("#coder .description");
    const topDesc = document.querySelector("#top .description");
    const leftScript = document.querySelector(".hero-script--left");
    const rightScript = document.querySelector(".hero-script--right");
    const brushLeft = document.querySelector(".hero-brush--left");
    const brushRight = document.querySelector(".hero-brush--right");
    const avatarSplit = document.getElementById("avatar-split");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const FADE_DISTANCE = 240;
    const AMBIENT_INK_COUNT = reducedMotion ? 8 : 18;
    const TRAIL_INK_POOL = reducedMotion ? 0 : 96;

    let raf = null;
    let interactive = window.innerWidth >= 900 && !reducedMotion;
    let faceBounds = face.getBoundingClientRect();
    let particleBounds = particlesLayer.getBoundingClientRect();
    let trailCursor = 0;

    const inkPalette = [
      "101, 198, 255",
      "255, 126, 175",
      "255, 184, 92",
      "129, 235, 187",
      "157, 141, 255",
      "255, 152, 102"
    ];

    const motion = {
      x: 0.5,
      y: 0.2,
      targetX: 0.5,
      targetY: 0.2
    };

    const pointer = {
      x: particleBounds.width * 0.5,
      y: particleBounds.height * 0.2,
      vx: 0,
      vy: 0,
      active: false
    };

    const ambientInks = [];
    const trailInks = [];

    function buildInks() {
      particlesLayer.innerHTML = "";
      ambientInks.length = 0;
      trailInks.length = 0;
      faceBounds = face.getBoundingClientRect();
      particleBounds = particlesLayer.getBoundingClientRect();

      for (let index = 0; index < AMBIENT_INK_COUNT; index += 1) {
        const node = document.createElement("span");
        node.className = "hero-ink hero-ink--ambient";

        const size = randomBetween(18, 42);
        const blur = randomBetween(3, 7);
        const opacity = randomBetween(0.16, 0.28);
        const color = inkPalette[index % inkPalette.length];

        node.style.setProperty("--ink-size", `${size}px`);
        node.style.setProperty("--ink-blur", `${blur}px`);
        node.style.setProperty("--ink-opacity", `${opacity}`);
        node.style.setProperty("--ink-rgb", color);

        particlesLayer.appendChild(node);
        ambientInks.push({
          node,
          x: randomBetween(0, particleBounds.width || window.innerWidth || 1200),
          y: randomBetween(0, particleBounds.height || window.innerHeight || 700),
          vx: randomBetween(-0.16, 0.16),
          vy: randomBetween(-0.14, 0.14),
          rotation: randomBetween(-25, 25),
          rotationSpeed: randomBetween(-0.06, 0.06),
          scale: randomBetween(0.88, 1.22),
          seed: randomBetween(0, Math.PI * 2)
        });
      }

      for (let index = 0; index < TRAIL_INK_POOL; index += 1) {
        const node = document.createElement("span");
        node.className = "hero-ink hero-ink--trail";
        node.style.opacity = "0";
        particlesLayer.appendChild(node);

        trailInks.push({
          node,
          x: 0,
          y: 0,
          vx: 0,
          vy: 0,
          rotation: 0,
          rotationSpeed: 0,
          scale: 1,
          size: 20,
          blur: 6,
          opacity: 0,
          life: 0,
          decay: 0.02,
          active: false
        });
      }
    }

    function emitInk(localX, localY) {
      if (!interactive || trailInks.length === 0) {
        return;
      }

      const velocity = Math.hypot(pointer.vx, pointer.vy);
      const spawnCount = 4 + Math.min(5, Math.floor(velocity / 24));

      for (let index = 0; index < spawnCount; index += 1) {
        const ink = trailInks[trailCursor % trailInks.length];
        trailCursor += 1;

        const size = randomBetween(16, 34);
        const blur = randomBetween(3, 8);
        const opacity = randomBetween(0.2, 0.42);
        const color = inkPalette[(trailCursor + index) % inkPalette.length];

        ink.active = true;
        ink.life = 1;
        ink.decay = randomBetween(0.018, 0.03);
        ink.x = localX + randomBetween(-14, 14);
        ink.y = localY + randomBetween(-14, 14);
        ink.vx = randomBetween(-1.05, 1.05) + pointer.vx * 0.02;
        ink.vy = randomBetween(-0.95, 0.95) + pointer.vy * 0.02;
        ink.rotation = randomBetween(-18, 18);
        ink.rotationSpeed = randomBetween(-0.35, 0.35);
        ink.scale = randomBetween(0.96, 1.22);
        ink.size = size;
        ink.blur = blur;
        ink.opacity = opacity;

        ink.node.style.setProperty("--ink-size", `${size}px`);
        ink.node.style.setProperty("--ink-blur", `${blur}px`);
        ink.node.style.setProperty("--ink-opacity", `${opacity}`);
        ink.node.style.setProperty("--ink-rgb", color);
      }
    }

    function updateScrollFade() {
      const progress = clamp(window.scrollY / FADE_DISTANCE, 0, 1);
      const opacity = 1 - progress;

      teaserSection.style.opacity = opacity.toFixed(3);
      if (progress >= 0.98) {
        teaserSection.classList.add("is-hidden");
      } else {
        teaserSection.classList.remove("is-hidden");
      }

      const contentOpacity = clamp((progress - 0.08) / 0.92, 0, 1);
      pageContent.style.opacity = contentOpacity.toFixed(3);
    }

    function applyState(balanceX, balanceY) {
      const split = clamp(50 + balanceX * 12, 37, 63);
      avatarOrb.style.setProperty("--split-pos", `${split}%`);
      avatarOrb.style.setProperty("--tilt-x", `${balanceY * -7}deg`);
      avatarOrb.style.setProperty("--tilt-y", `${balanceX * 8}deg`);
      avatarOrb.style.setProperty("--lift", `${-Math.abs(balanceX) * 5 - Math.abs(balanceY) * 2}px`);
      avatarOrb.style.setProperty("--shift-left", `${-balanceX * 11}px`);
      avatarOrb.style.setProperty("--shift-right", `${balanceX * 13}px`);

      if (avatarSplit) {
        avatarSplit.style.opacity = `${clamp(0.78 + Math.abs(balanceX) * 0.18, 0.78, 1)}`;
      }

      if (designerDesc) {
        designerDesc.style.opacity = `${clamp(1 - Math.max(balanceX, 0) * 0.44, 0.55, 1)}`;
        designerDesc.style.transform = `translate3d(${balanceX * -10}px, ${balanceY * 3}px, 0)`;
      }

      if (coderDesc) {
        coderDesc.style.opacity = `${clamp(1 + Math.min(balanceX, 0) * 0.44, 0.55, 1)}`;
        coderDesc.style.transform = `translate3d(${balanceX * -10}px, ${balanceY * 3}px, 0)`;
      }

      if (topDesc) {
        topDesc.style.transform = `translate3d(${balanceX * 2}px, ${balanceY * 4}px, 0)`;
      }

      if (leftScript) {
        leftScript.style.transform = `translate3d(${balanceX * -8}px, ${balanceY * 6}px, 0)`;
      }

      if (rightScript) {
        rightScript.style.transform = `translate3d(${balanceX * 8}px, ${balanceY * 8}px, 0)`;
      }

      if (brushLeft) {
        brushLeft.style.transform = `translate3d(${balanceX * -10}px, ${balanceY * 7}px, 0) rotate(${balanceX * -3}deg)`;
      }

      if (brushRight) {
        brushRight.style.transform = `translate3d(${balanceX * 6}px, ${balanceY * 7}px, 0) rotate(${balanceX * 2.5}deg)`;
      }
    }

    function updateAmbientInks(time) {
      ambientInks.forEach((ink) => {
        ink.x += ink.vx + Math.cos(time * 0.00028 + ink.seed) * 0.08;
        ink.y += ink.vy + Math.sin(time * 0.00022 + ink.seed) * 0.06;
        ink.rotation += ink.rotationSpeed * 0.05;

        if (ink.x < -120) {
          ink.x = particleBounds.width + 120;
        } else if (ink.x > particleBounds.width + 120) {
          ink.x = -120;
        }

        if (ink.y < -120) {
          ink.y = particleBounds.height + 120;
        } else if (ink.y > particleBounds.height + 120) {
          ink.y = -120;
        }

        const breathe = 1 + Math.sin(time * 0.001 + ink.seed) * 0.1;
        ink.node.style.transform = `translate(${ink.x}px, ${ink.y}px) rotate(${ink.rotation}deg) scale(${ink.scale * breathe})`;
      });
    }

    function updateTrailInks() {
      trailInks.forEach((ink) => {
        if (!ink.active) {
          return;
        }

        ink.life -= ink.decay;
        if (ink.life <= 0) {
          ink.active = false;
          ink.node.style.opacity = "0";
          return;
        }

        ink.x += ink.vx;
        ink.y += ink.vy;
        ink.vx *= 0.978;
        ink.vy *= 0.978;
        ink.rotation += ink.rotationSpeed * 0.12;

        const spread = 1 + (1 - ink.life) * 0.32;
        const currentBlur = ink.blur + (1 - ink.life) * 5;
        const currentOpacity = clamp(ink.opacity * ink.life, 0, 0.42);

        ink.node.style.setProperty("--ink-blur", `${currentBlur}px`);
        ink.node.style.opacity = `${currentOpacity}`;
        ink.node.style.transform = `translate(${ink.x}px, ${ink.y}px) rotate(${ink.rotation}deg) scale(${ink.scale * spread})`;
      });
    }

    function setDefaultState() {
      motion.x = 0.5;
      motion.y = 0.2;
      motion.targetX = 0.5;
      motion.targetY = 0.2;
      pointer.active = false;
      faceBounds = face.getBoundingClientRect();
      particleBounds = particlesLayer.getBoundingClientRect();
      applyState(0, -0.05);
    }

    function frame(time) {
      motion.x += (motion.targetX - motion.x) * 0.12;
      motion.y += (motion.targetY - motion.y) * 0.12;

      const balanceX = (motion.x - 0.5) * 2;
      const balanceY = (motion.y - 0.36) * 1.3;

      applyState(balanceX, balanceY);
      updateAmbientInks(time);
      updateTrailInks();
      raf = window.requestAnimationFrame(frame);
    }

    function startLoop() {
      if (raf === null) {
        raf = window.requestAnimationFrame(frame);
      }
    }

    function stopLoop() {
      if (raf !== null) {
        window.cancelAnimationFrame(raf);
        raf = null;
      }
    }

    function updateMode() {
      interactive = window.innerWidth >= 900 && !reducedMotion;
      faceBounds = face.getBoundingClientRect();
      particleBounds = particlesLayer.getBoundingClientRect();
    }

    window.addEventListener("pointermove", (event) => {
      particleBounds = particlesLayer.getBoundingClientRect();
      const particleX = clamp(event.clientX - particleBounds.left, 0, particleBounds.width || window.innerWidth);
      const particleY = clamp(event.clientY - particleBounds.top, 0, particleBounds.height || window.innerHeight);

      pointer.vx = particleX - pointer.x;
      pointer.vy = particleY - pointer.y;
      pointer.x = particleX;
      pointer.y = particleY;
      pointer.active = true;

      if (!interactive) {
        return;
      }

      emitInk(particleX, particleY);

      faceBounds = face.getBoundingClientRect();
      const insideFace =
        event.clientX >= faceBounds.left &&
        event.clientX <= faceBounds.right &&
        event.clientY >= faceBounds.top &&
        event.clientY <= faceBounds.bottom;

      if (!insideFace) {
        return;
      }

      const localX = clamp(event.clientX - faceBounds.left, 0, faceBounds.width);
      const localY = clamp(event.clientY - faceBounds.top, 0, faceBounds.height);
      motion.targetX = clamp(localX / faceBounds.width, 0.06, 0.94);
      motion.targetY = clamp(localY / faceBounds.height, 0.06, 0.94);
    });

    face.addEventListener("pointerleave", () => {
      pointer.active = false;
      motion.targetX = 0.5;
      motion.targetY = 0.2;
    });

    window.addEventListener("pointerleave", () => {
      pointer.active = false;
    });

    window.addEventListener("resize", () => {
      updateMode();
      buildInks();
      setDefaultState();
    });

    window.addEventListener("scroll", updateScrollFade, { passive: true });
    updateScrollFade();

    if (scrollHint) {
      scrollHint.addEventListener("click", () => {
        window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
      });
    }

    buildInks();
    setDefaultState();
    startLoop();

    if (reducedMotion) {
      stopLoop();
      updateAmbientInks(0);
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    applyPlaceholderMedia();
    initToggles();
    initJapanGallery();
    initImageLightbox();
    initHero();
  });
})();
