(function () {
  "use strict";

  const DESKTOP_POINTER_QUERY = "(min-width: 1024px) and (hover: hover) and (pointer: fine)";
  const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

  let rootContext = null;
  let matchMediaCtx = null;
  let workContext = null;
  let tiltAbortController = null;
  let filterGeneration = 0;
  let isInitialized = false;

  function hasGsap() {
    return typeof window.gsap !== "undefined" && typeof window.ScrollTrigger !== "undefined";
  }

  function prefersReducedMotion() {
    return (
      typeof window.matchMedia === "function" &&
      window.matchMedia(REDUCED_MOTION_QUERY).matches
    );
  }

  function isDesktopFinePointer() {
    return (
      typeof window.matchMedia === "function" &&
      window.matchMedia(DESKTOP_POINTER_QUERY).matches
    );
  }

  function isCompactViewport() {
    return window.innerWidth < 768;
  }

  function clearMotionHiddenStates() {
    const selectors = [
      ".hero-portrait",
      ".hero-eyebrow",
      ".hero-title",
      ".hero-name-segment",
      ".hero-role-mobile",
      ".hero-tagline",
      "#hero-actions > a",
      ".hero-specialty",
      ".hero-scroll-cue",
      "#site-header .brand",
      "#site-header .nav-link",
      "#site-header .nav-circle-btn",
      "#site-header .mobile-menu-btn",
      "[data-reveal]",
      ".reveal-item",
      ".featured-card",
      ".project-card"
    ];

    document.querySelectorAll(selectors.join(", ")).forEach((el) => {
      el.style.opacity = "";
      el.style.transform = "";
      el.style.clipPath = "";
      el.classList.add("is-visible");
    });
  }

  function runHeroEntrance() {
    // Portrait and Hero copy now render immediately without JS opacity-0 gating
    // (LCP stays unblocked and hero remains visible even if GSAP fails or stalls).
  }

  function animateSectionBlock(sectionSelector, groups) {
    const section = document.querySelector(sectionSelector);
    if (!section || section.hidden) return;

    const gsap = window.gsap;
    const isCompact = isCompactViewport();
    const yDist = isCompact ? 12 : 18;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 88%",
        once: true
      }
    });

    groups.forEach((group, idx) => {
      const targets = Array.from(section.querySelectorAll(group.selector)).filter(
        (el) => !el.hidden && !el.closest("[hidden]")
      );
      if (targets.length === 0) return;

      tl.from(
        targets,
        {
          opacity: 0,
          y: group.y !== undefined ? group.y : yDist,
          scale: group.scale !== undefined ? group.scale : 1,
          duration: group.duration || 0.48,
          stagger: group.stagger !== undefined ? group.stagger : 0.055,
          ease: "power3.out",
          clearProps: "transform,opacity"
        },
        idx === 0 ? 0 : group.position !== undefined ? group.position : 0.08
      );
    });
  }

  function initSectionReveals() {
    if (!hasGsap() || prefersReducedMotion()) return;

    animateSectionBlock("#about", [
      { selector: ".about-lead .section-eyebrow, .about-lead .section-heading", stagger: 0.05 },
      { selector: ".about-fact-item", y: 10, stagger: 0.04, duration: 0.42, position: 0.08 },
      { selector: ".about-paragraph", y: 12, stagger: 0.055, duration: 0.48, position: 0.1 }
    ]);

    animateSectionBlock("#featured", [
      { selector: ".featured-header > *", stagger: 0.05, duration: 0.46 },
      {
        selector: ".featured-card",
        y: 18,
        scale: 0.992,
        stagger: 0.1,
        duration: 0.54,
        position: 0.08
      }
    ]);

    animateSectionBlock("#skills", [
      { selector: ".section-header > *", stagger: 0.045, duration: 0.46 },
      {
        selector: ".skill-group-card",
        stagger: 0.055,
        scale: 0.988,
        duration: 0.48,
        position: 0.08
      },
      { selector: ".skill-item-chip", y: 4, stagger: 0.014, duration: 0.28, position: 0.16 }
    ]);

    animateSectionBlock("#capabilities", [
      { selector: ".section-header > *", stagger: 0.045, duration: 0.46 },
      {
        selector: ".capability-card",
        stagger: 0.065,
        scale: 0.988,
        duration: 0.48,
        position: 0.08
      }
    ]);

    animateSectionBlock("#credentials", [
      { selector: ".section-header > *", stagger: 0.045, duration: 0.46 },
      { selector: ".credential-pane-title", y: 8, stagger: 0.05, duration: 0.4, position: 0.07 },
      {
        selector: ".education-card, .certification-card",
        stagger: 0.06,
        scale: 0.99,
        duration: 0.48,
        position: 0.12
      }
    ]);

    animateSectionBlock("#experience", [
      { selector: ".section-header > *", stagger: 0.045, duration: 0.46 },
      { selector: ".experience-card", stagger: 0.06, duration: 0.48, position: 0.08 }
    ]);

    animateSectionBlock("#contact", [
      { selector: "#contact-card", y: 14, scale: 0.992, duration: 0.48 },
      { selector: ".contact-copy > *", y: 10, stagger: 0.045, duration: 0.42, position: 0.08 },
      { selector: "#direct-channels-list .channel-btn", y: 10, stagger: 0.045, duration: 0.42, position: 0.12 }
    ]);

    animateSectionBlock(".site-footer", [
      { selector: ".footer-top, .footer-bottom", y: 10, stagger: 0.06, duration: 0.44 }
    ]);
  }

  function initWorkSectionMotion() {
    if (!hasGsap() || prefersReducedMotion()) return;

    if (workContext) {
      workContext.revert();
      workContext = null;
    }

    const workSection = document.getElementById("work");
    if (!workSection || workSection.hidden) return;

    const gsap = window.gsap;
    const isCompact = isCompactViewport();

    workContext = gsap.context(() => {
      const headerTargets = workSection.querySelectorAll(
        ".work-header-text > *, .work-status-note, #work-filters"
      );
      if (headerTargets.length > 0) {
        gsap.from(headerTargets, {
          opacity: 0,
          y: isCompact ? 12 : 16,
          duration: 0.55,
          stagger: 0.06,
          ease: "power3.out",
          clearProps: "transform,opacity",
          scrollTrigger: {
            trigger: workSection,
            start: "top 86%",
            once: true
          }
        });
      }

      const visualGrid = workSection.querySelector(".projects-visual-grid");
      const visualCards = visualGrid ? visualGrid.querySelectorAll(".project-card") : [];
      const compactGroup = workSection.querySelector(".projects-compact-group");
      const compactCards = compactGroup ? compactGroup.querySelectorAll(".project-card") : [];

      if (visualCards.length > 0 || compactCards.length > 0) {
        if (visualCards.length > 0) {
          gsap.from(visualCards, {
            opacity: 0,
            y: isCompact ? 12 : 18,
            scale: 0.988,
            duration: 0.5,
            stagger: 0.06,
            ease: "power3.out",
            clearProps: "transform,opacity",
            scrollTrigger: {
              trigger: visualGrid,
              start: "top 88%",
              once: true
            }
          });
        }
        if (compactCards.length > 0) {
          gsap.from(compactCards, {
            opacity: 0,
            y: isCompact ? 10 : 14,
            scale: 0.99,
            duration: 0.46,
            stagger: 0.055,
            ease: "power3.out",
            clearProps: "transform,opacity",
            scrollTrigger: {
              trigger: compactGroup,
              start: "top 88%",
              once: true
            }
          });
        }
      } else {
        const cards = workSection.querySelectorAll("#projects-grid .project-card");
        if (cards.length > 0) {
          gsap.from(cards, {
            opacity: 0,
            y: isCompact ? 12 : 18,
            scale: 0.988,
            duration: 0.52,
            stagger: 0.07,
            ease: "power3.out",
            clearProps: "transform,opacity",
            scrollTrigger: {
              trigger: "#projects-grid",
              start: "top 88%",
              once: true
            }
          });
        }
      }
    }, workSection);
  }

  function bindCardInteractions() {
    if (tiltAbortController) {
      tiltAbortController.abort();
      tiltAbortController = null;
    }

    if (!hasGsap() || prefersReducedMotion() || !isDesktopFinePointer()) return;

    const gsap = window.gsap;
    tiltAbortController = new AbortController();
    const { signal } = tiltAbortController;

    document.querySelectorAll("#projects-grid .project-card").forEach((card) => {
      const rotX = gsap.quickTo(card, "rotationX", { duration: 0.38, ease: "power3.out" });
      const rotY = gsap.quickTo(card, "rotationY", { duration: 0.38, ease: "power3.out" });
      let rafId = 0;

      gsap.set(card, { transformPerspective: 1100, transformOrigin: "center center" });

      card.addEventListener(
        "pointermove",
        (e) => {
          if (e.pointerType && e.pointerType !== "mouse") return;
          if (rafId) return;
          const clientX = e.clientX;
          const clientY = e.clientY;
          rafId = window.requestAnimationFrame(() => {
            rafId = 0;
            const rect = card.getBoundingClientRect();
            if (!rect.width || !rect.height) return;
            const relX = (clientX - rect.left) / rect.width;
            const relY = (clientY - rect.top) / rect.height;
            const maxTilt = 2.4;
            rotY((relX - 0.5) * maxTilt * 2);
            rotX((0.5 - relY) * maxTilt * 2);
            card.style.setProperty("--mx", `${(relX * 100).toFixed(1)}%`);
            card.style.setProperty("--my", `${(relY * 100).toFixed(1)}%`);
          });
        },
        { signal }
      );

      const resetTilt = () => {
        if (rafId) {
          window.cancelAnimationFrame(rafId);
          rafId = 0;
        }
        rotX(0);
        rotY(0);
      };

      card.addEventListener("pointerleave", resetTilt, { signal });
      card.addEventListener("blur", resetTilt, { signal });
    });
  }

  function initDesktopResponsiveEnhancements() {
    if (!hasGsap()) return;
    if (matchMediaCtx) {
      matchMediaCtx.revert();
      matchMediaCtx = null;
    }

    const gsap = window.gsap;
    matchMediaCtx = gsap.matchMedia();

    matchMediaCtx.add(
      {
        desktopFine: `${DESKTOP_POINTER_QUERY} and (prefers-reduced-motion: no-preference)`,
        reduced: REDUCED_MOTION_QUERY
      },
      (context) => {
        const { desktopFine, reduced } = context.conditions;
        if (reduced) {
          clearMotionHiddenStates();
          return;
        }
        if (!desktopFine) return;

        // Subtle studio depth on hero portrait when leaving top cover (keeps top edge sealed)
        const portrait = document.getElementById("hero-photo");
        const hero = document.getElementById("overview");
        if (portrait && hero && !portrait.hidden) {
          gsap.fromTo(
            portrait,
            { scale: 1, yPercent: 0 },
            {
              scale: 1.045,
              yPercent: -2,
              transformOrigin: "center 20%",
              ease: "none",
              scrollTrigger: {
                trigger: hero,
                start: "top top",
                end: "bottom top",
                scrub: 0.45
              }
            }
          );
        }

        // Restrained magnetic hover on primary desktop CTAs
        const magneticTargets = document.querySelectorAll(
          ".btn-hero-primary, .btn-hero-ghost, .nav-circle-btn, #reset-filter-btn"
        );
        const cleanups = [];

        magneticTargets.forEach((el) => {
          const xTo = gsap.quickTo(el, "x", { duration: 0.32, ease: "power3.out" });
          const yTo = gsap.quickTo(el, "y", { duration: 0.32, ease: "power3.out" });
          let rafId = 0;

          const onMove = (e) => {
            if (e.pointerType && e.pointerType !== "mouse") return;
            if (rafId) return;
            const clientX = e.clientX;
            const clientY = e.clientY;
            rafId = window.requestAnimationFrame(() => {
              rafId = 0;
              const r = el.getBoundingClientRect();
              if (!r.width || !r.height) return;
              const nx = (clientX - r.left) / r.width - 0.5;
              const ny = (clientY - r.top) / r.height - 0.5;
              xTo(nx * 7);
              yTo(ny * 5);
            });
          };

          const onLeave = () => {
            if (rafId) {
              window.cancelAnimationFrame(rafId);
              rafId = 0;
            }
            xTo(0);
            yTo(0);
          };

          el.addEventListener("pointermove", onMove);
          el.addEventListener("pointerleave", onLeave);
          el.addEventListener("blur", onLeave);

          cleanups.push(() => {
            if (rafId) {
              window.cancelAnimationFrame(rafId);
              rafId = 0;
            }
            el.removeEventListener("pointermove", onMove);
            el.removeEventListener("pointerleave", onLeave);
            el.removeEventListener("blur", onLeave);
            gsap.set(el, { clearProps: "x,y" });
          });
        });

        bindCardInteractions();

        return () => {
          cleanups.forEach((fn) => fn());
          if (tiltAbortController) {
            tiltAbortController.abort();
            tiltAbortController = null;
          }
        };
      }
    );
  }

  function init() {
    if (isInitialized) {
      destroy();
    }
    isInitialized = true;

    if (!hasGsap() || prefersReducedMotion()) {
      document.documentElement.classList.remove("gsap-pending", "gsap-motion", "reveal-ready");
      clearMotionHiddenStates();
      return;
    }

    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    gsap.registerPlugin(ScrollTrigger);
    gsap.config({ nullTargetWarn: false });

    document.documentElement.classList.add("gsap-motion");
    document.documentElement.classList.remove("gsap-pending", "reveal-ready");

    rootContext = gsap.context(() => {
      runHeroEntrance();
      initSectionReveals();
    });

    initWorkSectionMotion();
    initDesktopResponsiveEnhancements();

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        if (hasGsap()) ScrollTrigger.refresh();
      });
    }
  }

  function animateFilterTransition(renderGridFn) {
    filterGeneration += 1;
    const currentGen = filterGeneration;

    const grid = document.getElementById("projects-grid");
    const emptyState = document.getElementById("projects-filter-empty");

    if (!hasGsap() || prefersReducedMotion() || !grid) {
      renderGridFn();
      if (hasGsap()) window.ScrollTrigger.refresh();
      return;
    }

    const gsap = window.gsap;
    const existingCards = Array.from(
      grid.querySelectorAll(".project-card, .projects-compact-heading")
    );
    gsap.killTweensOf(existingCards);
    if (emptyState) gsap.killTweensOf(emptyState);

    const enterNewCards = () => {
      if (currentGen !== filterGeneration) return;
      renderGridFn();

      const nextCards = Array.from(grid.querySelectorAll(".project-card"));
      const isCompact = isCompactViewport();

      if (nextCards.length > 0) {
        gsap.fromTo(
          nextCards,
          { opacity: 0, y: isCompact ? 10 : 16, scale: 0.985 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: isCompact ? 0.24 : 0.3,
            stagger: 0.045,
            ease: "power3.out",
            clearProps: "transform,opacity"
          }
        );
      } else if (emptyState && !emptyState.hidden) {
        gsap.fromTo(
          emptyState,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.24, ease: "power2.out", clearProps: "transform,opacity" }
        );
      }

      bindCardInteractions();
      window.requestAnimationFrame(() => {
        if (currentGen === filterGeneration && hasGsap()) {
          window.ScrollTrigger.refresh();
        }
      });
    };

    if (existingCards.length > 0) {
      gsap.to(existingCards, {
        opacity: 0,
        y: 6,
        scale: 0.988,
        duration: 0.11,
        ease: "power2.in",
        onComplete: enterNewCards
      });
    } else {
      enterNewCards();
    }
  }

  function refreshWork() {
    if (!isInitialized) return;
    if (!hasGsap() || prefersReducedMotion()) {
      clearMotionHiddenStates();
      return;
    }
    initWorkSectionMotion();
    bindCardInteractions();
    window.ScrollTrigger.refresh();
  }

  function openMobileDrawer(drawer) {
    if (!drawer) return;
    drawer.hidden = false;

    if (!hasGsap() || prefersReducedMotion()) return;
    const gsap = window.gsap;
    gsap.killTweensOf(drawer);
    const links = Array.from(drawer.querySelectorAll(".mobile-drawer-link")).filter((l) => !l.hidden);
    gsap.killTweensOf(links);

    gsap.fromTo(
      drawer,
      { opacity: 0, y: -6 },
      { opacity: 1, y: 0, duration: 0.24, ease: "power2.out", clearProps: "transform,opacity" }
    );
    if (links.length > 0) {
      gsap.fromTo(
        links,
        { opacity: 0, x: -8 },
        {
          opacity: 1,
          x: 0,
          duration: 0.24,
          stagger: 0.03,
          ease: "power2.out",
          clearProps: "transform,opacity"
        }
      );
    }
  }

  function closeMobileDrawer(drawer) {
    if (!drawer || drawer.hidden) return;
    const links = Array.from(drawer.querySelectorAll(".mobile-drawer-link"));
    if (!hasGsap() || prefersReducedMotion()) {
      drawer.hidden = true;
      return;
    }
    const gsap = window.gsap;
    gsap.killTweensOf(drawer);
    gsap.killTweensOf(links);
    gsap.to(drawer, {
      opacity: 0,
      y: -6,
      duration: 0.16,
      ease: "power2.in",
      onComplete: () => {
        drawer.hidden = true;
        drawer.style.opacity = "";
        drawer.style.transform = "";
        links.forEach((l) => {
          l.style.opacity = "";
          l.style.transform = "";
        });
      }
    });
  }

  function animateLightboxOpen(lightboxEl) {
    if (!lightboxEl || !hasGsap() || prefersReducedMotion()) return;
    const gsap = window.gsap;
    const backdrop = lightboxEl.querySelector(".lightbox-backdrop");
    const dialog = lightboxEl.querySelector(".lightbox-dialog");

    if (backdrop) {
      gsap.fromTo(
        backdrop,
        { opacity: 0 },
        { opacity: 1, duration: 0.24, ease: "power2.out", clearProps: "opacity" }
      );
    }
    if (dialog) {
      gsap.fromTo(
        dialog,
        { opacity: 0, scale: 0.96, y: 12 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.3,
          ease: "power3.out",
          clearProps: "transform,opacity"
        }
      );
    }
  }

  function animateSlideChange(imgEl) {
    if (!imgEl || !hasGsap() || prefersReducedMotion()) return;
    const gsap = window.gsap;
    gsap.killTweensOf(imgEl);
    gsap.fromTo(
      imgEl,
      { opacity: 0.55 },
      { opacity: 1, duration: 0.2, ease: "power2.out", clearProps: "opacity" }
    );
  }

  function destroy() {
    if (tiltAbortController) {
      tiltAbortController.abort();
      tiltAbortController = null;
    }
    if (workContext) {
      workContext.revert();
      workContext = null;
    }
    if (matchMediaCtx) {
      matchMediaCtx.revert();
      matchMediaCtx = null;
    }
    if (rootContext) {
      rootContext.revert();
      rootContext = null;
    }
    clearMotionHiddenStates();
    isInitialized = false;
  }

  window.PortfolioMotion = {
    init,
    animateFilterTransition,
    refreshWork,
    openMobileDrawer,
    closeMobileDrawer,
    animateLightboxOpen,
    animateSlideChange,
    destroy
  };
})();
