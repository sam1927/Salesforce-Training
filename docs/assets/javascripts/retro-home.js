/* =========================================================
   THEME SELECTOR — Normal / Warm / Cool
   =========================================================
   Source of truth: localStorage key "retroTheme"
   Values: "normal" (default) | "warm" | "cool"
   DOM mechanism: html.retro-a11y-active + --retro-a11y-bg CSS var
   ========================================================= */
document.addEventListener("DOMContentLoaded", function () {
  var page = document.querySelector(".retro-content-page");
  if (!page) return;

  page.setAttribute("data-has-theme-selector", "true");

  var THEME_BG = { warm: "#ffedbd", cool: "#caf9fc" };
  var THEME_LABELS = { normal: "Normal", warm: "Warm", cool: "Cool" };
  var THEME_KEYS = ["normal", "warm", "cool"];

  /* --- Build UI ------------------------------------------------ */
  var wrapper = document.createElement("div");
  wrapper.className = "retro-theme-controls";

  var btn = document.createElement("button");
  btn.type = "button";
  btn.className = "retro-theme-btn";
  btn.setAttribute("aria-expanded", "false");
  btn.innerHTML = '<span class="retro-theme-btn__text">Themes</span>';
  wrapper.appendChild(btn);

  var panel = document.createElement("div");
  panel.className = "retro-theme-panel";
  panel.setAttribute("role", "listbox");
  panel.setAttribute("aria-label", "Theme selection");

  var optionEls = {};
  THEME_KEYS.forEach(function (key) {
    var opt = document.createElement("button");
    opt.type = "button";
    opt.className = "retro-theme-option retro-theme-option--" + key;
    opt.setAttribute("role", "option");
    opt.setAttribute("data-theme", key);
    opt.textContent = THEME_LABELS[key];
    panel.appendChild(opt);
    optionEls[key] = opt;
  });

  wrapper.appendChild(panel);
  page.appendChild(wrapper);

  /* --- State helpers ------------------------------------------- */
  function getStoredTheme() {
    try { return window.localStorage.getItem("retroTheme") || "normal"; }
    catch (e) { return "normal"; }
  }

  function applyTheme(name) {
    if (!THEME_LABELS[name]) name = "normal";
    var root = document.documentElement;
    var bg = THEME_BG[name];

    /* Trigger the wash overlay */
    root.classList.add("retro-theme-switching");
    window.setTimeout(function () {
      root.classList.remove("retro-theme-switching");
    }, 500);

    if (bg) {
      root.classList.add("retro-a11y-active");
      root.setAttribute("data-retro-theme", name);
      root.style.setProperty("--retro-a11y-bg", bg);
    } else {
      root.classList.remove("retro-a11y-active");
      root.removeAttribute("data-retro-theme");
      root.style.removeProperty("--retro-a11y-bg");
    }

    try { window.localStorage.setItem("retroTheme", name); }
    catch (e) { /* ignore */ }

    renderUI(name);
  }

  function renderUI(active) {
    if (!active) active = getStoredTheme();
    THEME_KEYS.forEach(function (key) {
      var el = optionEls[key];
      var isCurrent = key === active;
      el.classList.toggle("is-selected", isCurrent);
      el.setAttribute("aria-selected", isCurrent ? "true" : "false");
    });
  }

  /* --- Events -------------------------------------------------- */
  var panelOpen = false;

  function togglePanel() {
    panelOpen = !panelOpen;
    panel.classList.toggle("is-open", panelOpen);
    btn.setAttribute("aria-expanded", panelOpen ? "true" : "false");
    btn.classList.toggle("is-open", panelOpen);
  }

  btn.addEventListener("click", function (e) {
    e.stopPropagation();
    togglePanel();
  });

  panel.addEventListener("click", function (e) {
    var opt = e.target.closest("[data-theme]");
    if (!opt) return;
    applyTheme(opt.getAttribute("data-theme"));
  });

  /* Close when clicking outside */
  document.addEventListener("click", function () {
    if (panelOpen) togglePanel();
  });
  wrapper.addEventListener("click", function (e) { e.stopPropagation(); });

  /* --- Restore saved theme on load (no wash animation) --------- */
  var saved = getStoredTheme();
  var savedBg = THEME_BG[saved];
  if (savedBg) {
    document.documentElement.classList.add("retro-a11y-active");
    document.documentElement.setAttribute("data-retro-theme", saved);
    document.documentElement.style.setProperty("--retro-a11y-bg", savedBg);
  } else {
    /* Explicitly enforce Normal: clear any stale a11y state */
    document.documentElement.classList.remove("retro-a11y-active");
    document.documentElement.removeAttribute("data-retro-theme");
    document.documentElement.style.removeProperty("--retro-a11y-bg");
    try { window.localStorage.setItem("retroTheme", "normal"); }
    catch (e) { /* ignore */ }
  }
  renderUI(saved);
});

document.addEventListener("DOMContentLoaded", function () {
  const navbarStorageKey = "retroNavbarHidden";
  const page = document.querySelector(".retro-content-page");

  if (!page) {
    return;
  }

  var navbarToggle = document.createElement("button");
  navbarToggle.type = "button";
  navbarToggle.className = "retro-navbar-toggle";
  navbarToggle.setAttribute("aria-live", "polite");
  navbarToggle.innerHTML =
    '<span class="retro-navbar-toggle__text">Hide Navigation</span>' +
    '<span class="retro-navbar-toggle__state">ON</span>';

  /* Append into the theme controls wrapper if it exists,
     so both controls share a single flex-column layout
     and never overlap. Falls back to page if wrapper
     is not present (e.g. on the homepage). */
  var controlsWrapper = page.querySelector(".retro-theme-controls");
  if (controlsWrapper) {
    controlsWrapper.appendChild(navbarToggle);
  } else {
    page.appendChild(navbarToggle);
  }

  var navTextLabel = navbarToggle.querySelector(".retro-navbar-toggle__text");
  var navStateLabel = navbarToggle.querySelector(".retro-navbar-toggle__state");

  /* -----------------------------------------------------------
     NAV DRAWER STATE MACHINE
     States: "open" | "closing" | "closed" | "opening"
     Source of truth: navState variable + DOM classes
     ----------------------------------------------------------- */
  var navState = isNavbarHidden() ? "closed" : "open";
  var navTimer = null;
  var navbar = document.querySelector(".navbar.fixed-top");

  function isNavbarHidden() {
    return document.documentElement.classList.contains("retro-navbar-hidden");
  }

  function setNavState(state) {
    navState = state;
    if (navbar) {
      navbar.setAttribute("data-nav-state", state);
    }
  }

  function syncToggleUI() {
    var hidden = navState === "closed" || navState === "closing";
    navbarToggle.classList.toggle("is-hidden-state", hidden);
    navbarToggle.setAttribute("aria-pressed", hidden ? "true" : "false");
    if (navTextLabel) navTextLabel.textContent = hidden ? "Show Navigation" : "Hide Navigation";
    if (navStateLabel) navStateLabel.textContent = hidden ? "OFF" : "ON";
  }

  function clearNavTimer() {
    if (navTimer) { clearTimeout(navTimer); navTimer = null; }
  }

  function saveNavState(hidden) {
    try { window.sessionStorage.setItem(navbarStorageKey, hidden ? "true" : "false"); }
    catch (e) { /* ignore */ }
  }

  function getNavItems() {
    return navbar ? navbar.querySelectorAll(".navbar-nav .nav-link, .navbar-nav .dropdown-item") : [];
  }

  /* --- CLOSE: items fade out → panel slides away → done --- */
  function closeNav() {
    if (!navbar || navState === "closed" || navState === "closing") return;
    clearNavTimer();

    var items = getNavItems();
    var count = items.length;

    /* Assign reverse stagger indices */
    items.forEach(function (el, i) { el.style.setProperty("--nav-i", count - 1 - i); });
    navbar.style.setProperty("--nav-total", count);

    /* Enter closing state — items animate out, panel stays visible */
    navbar.classList.remove("retro-nav-booting");
    navbar.classList.add("retro-nav-powering-down");
    setNavState("closing");
    syncToggleUI();

    /* After item animations finish, hide the panel */
    var itemDuration = count * 18 + 120;
    navTimer = setTimeout(function () {
      /* Panel CSS transition fires here (opacity/transform via retro-navbar-hidden) */
      document.documentElement.classList.add("retro-navbar-hidden");
      saveNavState(true);

      /* After panel transition completes, finalize closed state */
      navTimer = setTimeout(function () {
        navbar.classList.remove("retro-nav-powering-down");
        setNavState("closed");
      }, 380);
    }, itemDuration);
  }

  /* --- OPEN: panel slides in → items stagger in → done --- */
  function openNav() {
    if (!navbar || navState === "open" || navState === "opening") return;
    clearNavTimer();

    /* Immediately show the panel */
    navbar.classList.remove("retro-nav-powering-down");
    document.documentElement.classList.remove("retro-navbar-hidden");
    saveNavState(false);
    setNavState("opening");
    syncToggleUI();

    /* Stagger items in */
    var items = getNavItems();
    items.forEach(function (el, i) { el.style.setProperty("--nav-i", i); });
    navbar.classList.add("retro-nav-booting");

    var maxDelay = items.length * 28 + 180;
    navTimer = setTimeout(function () {
      navbar.classList.remove("retro-nav-booting");
      setNavState("open");
    }, maxDelay);
  }

  navbarToggle.addEventListener("click", function () {
    if (navState === "open" || navState === "opening") {
      closeNav();
    } else {
      openNav();
    }
  });

  /* Initialize */
  setNavState(navState);
  syncToggleUI();
});

document.addEventListener("DOMContentLoaded", function () {
  const homeWrapper = document.getElementById("retro-homepage");
  const bootScreen = document.getElementById("retro-boot");
  const mainContent = document.getElementById("retro-main");
  const bootText = document.getElementById("boot-text");
  const revealLayer = document.getElementById("retro-reveal");

  const skipButton = document.getElementById("skip-intro");

  if (!homeWrapper || !bootScreen || !mainContent || !bootText || !revealLayer) {
    return;
  }

  const lines = [
    "MINDJAM SALESFORCE TRAINING SYSTEM...",
    "-------------------------------",
    "BOOTING INTERFACE...",
    "INITIALISING MINDJAM SYSTEM...",
    "LOADING JAMMY...",
    "ROLLING D20 FOR SUCCESS...",
    "CRITICAL SUCCESS!",
    "ACCESS GRANTED."
  ];

  const defaultCharacterDelay = 35;
  const defaultLineDelay = 250;
  const longPauseAfterRoll = 900;
  const longPauseAfterCritical = 700;
  const finalPauseBeforeReveal = 250;

  bootText.textContent = "";

  let lineIndex = 0;
  let charIndex = 0;
  let introFinished = false;
  let typingTimer = null;

  function showMainWithReveal() {
    if (introFinished) return;
    introFinished = true;

    if (skipButton) skipButton.style.display = "none";

    window.setTimeout(function () {
      revealLayer.classList.add("is-active");
    }, finalPauseBeforeReveal);

    window.setTimeout(function () {
      revealLayer.classList.add("is-playing");
    }, finalPauseBeforeReveal + 30);

    window.setTimeout(function () {
      bootScreen.style.display = "none";
      mainContent.style.display = "block";
    }, finalPauseBeforeReveal + 280);

    window.setTimeout(function () {
      revealLayer.classList.remove("is-playing");
      revealLayer.classList.remove("is-active");
    }, finalPauseBeforeReveal + 1150);
  }

  function typeNextCharacter() {
    if (introFinished) return;

    if (lineIndex >= lines.length) {
      showMainWithReveal();
      return;
    }

    const currentLine = lines[lineIndex];

    if (charIndex < currentLine.length) {
      bootText.textContent += currentLine.charAt(charIndex);
      charIndex += 1;
      typingTimer = window.setTimeout(typeNextCharacter, defaultCharacterDelay);
      return;
    }

    bootText.textContent += "\n";

    let pauseAfterLine = defaultLineDelay;

    if (currentLine === "ROLLING D20 FOR SUCCESS...") {
      pauseAfterLine = longPauseAfterRoll;
    } else if (currentLine === "CRITICAL SUCCESS!") {
      pauseAfterLine = longPauseAfterCritical;
    }

    lineIndex += 1;
    charIndex = 0;

    typingTimer = window.setTimeout(typeNextCharacter, pauseAfterLine);
  }

  if (skipButton) {
    skipButton.addEventListener("click", function () {
      if (introFinished) return;
      if (typingTimer) {
        clearTimeout(typingTimer);
        typingTimer = null;
      }
      showMainWithReveal();
    });
  }

  typeNextCharacter();
});

document.addEventListener("DOMContentLoaded", function () {
  const logo = document.querySelector("#retro-homepage .retro-logo-image");

  if (logo) {
    let wrapper = logo.parentElement;

    if (!wrapper || !wrapper.classList.contains("retro-logo-glitch")) {
      wrapper = document.createElement("span");
      wrapper.className = "retro-logo-glitch";
      logo.parentNode.insertBefore(wrapper, logo);
      wrapper.appendChild(logo);
    }

    const logoUrl = logo.currentSrc || logo.src || new URL(logo.getAttribute("src"), window.location.href).href;
    wrapper.style.setProperty("--retro-logo-image", `url("${logoUrl}")`);

    var ambientTimer = null;

    function startAmbientGlitch() {
      stopAmbientGlitch();
      wrapper.classList.add("is-glitching");
    }

    function stopAmbientGlitch() {
      wrapper.classList.remove("is-glitching");
    }

    /* Gentle single-pulse every 5 seconds when NOT hovered */
    function triggerIdleGlitch() {
      wrapper.classList.remove("is-glitching");
      void wrapper.offsetWidth;
      wrapper.classList.add("is-glitching");
      window.setTimeout(function () {
        wrapper.classList.remove("is-glitching");
      }, 1800);
    }

    ambientTimer = window.setInterval(triggerIdleGlitch, 5000);

    /* On hover: start continuous loop; on leave: stop cleanly */
    wrapper.addEventListener("mouseenter", function () {
      clearInterval(ambientTimer);
      ambientTimer = null;
      startAmbientGlitch();
    });

    wrapper.addEventListener("mouseleave", function () {
      stopAmbientGlitch();
      ambientTimer = window.setInterval(triggerIdleGlitch, 5000);
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const transitionLayer = document.getElementById("retro-transition");

  if (!transitionLayer) {
    return;
  }

  let isTransitioning = false;
  let progressTimer = null;
  const transitionLinkSelector = "a.retro-nav-button, a.retro-section-nav__link";

  function shouldRunFancyTransition(link) {
    if (!link) {
      return false;
    }

    const label = (link.textContent || "").replace(/\s+/g, " ").trim().toLowerCase();
    return label === "next level";
  }

  function ensureTransitionUi() {
    const terminal = transitionLayer.querySelector(".retro-transition__terminal");

    if (!terminal) {
      return null;
    }

    let loading = terminal.querySelector(".retro-transition__loading");

    if (!loading) {
      loading = document.createElement("div");
      loading.className = "retro-transition__loading";
      loading.innerHTML = `
        <div class="retro-transition__loading-bar" aria-hidden="true">
          <div class="retro-transition__loading-fill"></div>
        </div>
        <div class="retro-transition__loading-meta">
          <span class="retro-transition__loading-status">Booting module</span>
          <span class="retro-transition__loading-percent">0%</span>
        </div>
      `;
      terminal.appendChild(loading);
    }

    return {
      title: terminal.querySelector(".retro-transition__terminal-title"),
      text: terminal.querySelector(".retro-transition__terminal-text"),
      fill: loading.querySelector(".retro-transition__loading-fill"),
      status: loading.querySelector(".retro-transition__loading-status"),
      percent: loading.querySelector(".retro-transition__loading-percent")
    };
  }

  function titleFromButton(button) {
    const explicit = button.getAttribute("data-transition-page");

    if (explicit) {
      return explicit;
    }

    const href = button.getAttribute("data-target") || button.getAttribute("href") || "";
    const slug = href.split("/").filter(Boolean).pop() || "next-module";

    return slug
      .replace(/-/g, " ")
      .replace(/\b\w/g, function (char) {
        return char.toUpperCase();
      });
  }

  function setTransitionCopy(button) {
    const ui = ensureTransitionUi();

    if (!ui) {
      return;
    }

    if (ui.title) {
      ui.title.textContent = button.getAttribute("data-transition-title") || "=== NEXT LEVEL ===";
    }

    if (ui.text) {
      ui.text.textContent = "LOADING: " + titleFromButton(button).toUpperCase();
    }

    if (ui.status) {
      ui.status.textContent = "Synchronising";
    }

    if (ui.percent) {
      ui.percent.textContent = "0%";
    }

    if (ui.fill) {
      ui.fill.style.width = "0%";
      ui.fill.style.setProperty("--retro-load-progress", "0%");
    }
  }

  function startRandomLoadingBar() {
    const ui = ensureTransitionUi();

    if (!ui || !ui.fill || !ui.percent) {
      return;
    }

    const statuses = [
      "Synchronising",
      "Loading records",
      "Checking profile",
      "Preparing module",
      "Finalising"
    ];

    let progress = 0;

    function bump() {
      if (progress >= 93) {
        return;
      }

      const jump = Math.floor(Math.random() * 18) + 4;
      progress = Math.min(93, progress + jump);
      ui.fill.style.width = progress + "%";
      ui.fill.style.setProperty("--retro-load-progress", progress + "%");
      ui.percent.textContent = progress + "%";

      if (ui.status) {
        const statusIndex = Math.min(statuses.length - 1, Math.floor(progress / 24));
        ui.status.textContent = statuses[statusIndex];
      }

      const nextDelay = Math.floor(Math.random() * 140) + 60;
      progressTimer = window.setTimeout(bump, nextDelay);
    }

    bump();
  }

  function shouldHandleTransitionLink(link, event) {
    if (!link) {
      return false;
    }

    if (link.target && link.target !== "_self") {
      return false;
    }

    if (link.hasAttribute("download")) {
      return false;
    }

    if (event && (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0)) {
      return false;
    }

    const href = link.getAttribute("data-target") || link.getAttribute("href") || "";

    if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
      return false;
    }

    return true;
  }

  function runPageTransition(link) {
    const targetUrl = link.getAttribute("data-target") || link.getAttribute("href");

    if (!targetUrl || isTransitioning) {
      return;
    }

    if (progressTimer) {
      window.clearTimeout(progressTimer);
    }

    isTransitioning = true;
    setTransitionCopy(link);

    /* --- Phase 1: Smooth-scroll upward ---
       Scroll up by ~40% of the viewport height from the current position.
       This gives a visible upward movement without overshooting to
       the page top. Clamped to the valid scroll range. */
    var prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var vh = window.innerHeight;
    var maxScroll = document.documentElement.scrollHeight - vh;
    var scrollTarget = Math.max(0, Math.min(maxScroll, Math.round(window.scrollY - vh * 0.4)));
    var scrollDistance = window.scrollY - scrollTarget;

    /* --- Phase 2: Start the overlay animation --- */
    function startOverlay() {
      transitionLayer.classList.remove("is-playing");
      transitionLayer.classList.add("is-active");

      window.setTimeout(function () {
        transitionLayer.classList.add("is-playing");
        startRandomLoadingBar();
      }, 30);

      window.setTimeout(function () {
        window.location.href = targetUrl;
      }, 600);
    }

    /* --- Phase 3: Scroll, wait for completion, pause, then overlay --- */
    if (scrollDistance > 30) {
      window.scrollTo({ top: scrollTarget, behavior: prefersReduced ? "auto" : "smooth" });

      if (prefersReduced) {
        window.setTimeout(startOverlay, 100);
      } else {
        /* Poll until scroll arrives, then hold a visible pause */
        var t0 = Date.now();
        (function poll() {
          var arrived = Math.abs(window.scrollY - scrollTarget) < 10;
          var expired = Date.now() - t0 > 1800;
          if (arrived || expired) {
            /* 300ms pause so the user sees the page at rest before the overlay */
            window.setTimeout(startOverlay, 300);
          } else {
            window.setTimeout(poll, 40);
          }
        })();
      }
    } else {
      /* Already near the target — start overlay directly */
      startOverlay();
    }
  }

  window.retroRunTransition = runPageTransition;

  document.addEventListener("click", function (event) {
    const link = event.target.closest(transitionLinkSelector);

    if (!shouldHandleTransitionLink(link, event) || !shouldRunFancyTransition(link)) {
      return;
    }

    event.preventDefault();
    runPageTransition(link);
  }, true);

  const homeStartButton = document.querySelector("#retro-homepage .retro-start-panel a");

  if (homeStartButton) {
    homeStartButton.addEventListener("click", function (event) {
      if (!shouldHandleTransitionLink(homeStartButton, event) || !shouldRunFancyTransition(homeStartButton)) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      runPageTransition(homeStartButton);
    }, true);
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const steppers = document.querySelectorAll("[data-stepper]");

  if (!steppers.length) {
    return;
  }

  steppers.forEach(function (stepper) {
    const panels = Array.from(stepper.querySelectorAll("[data-step-panel]"));
    const prevButton = stepper.querySelector("[data-step-prev]");
    const nextButton = stepper.querySelector("[data-step-next]");
    const currentLabel = stepper.querySelector("[data-step-current]");
    const totalLabel = stepper.querySelector("[data-step-total]");
    const stage = stepper.querySelector(".retro-step-stage");

    if (!panels.length || !prevButton || !nextButton || !currentLabel || !totalLabel) {
      return;
    }

    let currentIndex = 0;
    const totalSteps = panels.length;
    let resizeRaf = null;
    let activePanelResizeObserver = null;

    totalLabel.textContent = String(totalSteps);

    function syncStageHeight() {
      if (!stage) {
        return;
      }

      const activePanel = panels[currentIndex];

      if (!activePanel) {
        return;
      }

      const nextHeight = Math.ceil(activePanel.offsetHeight);

      if (nextHeight > 0) {
        stage.style.height = nextHeight + "px";
      }
    }

    function observeActivePanel() {
      if (typeof ResizeObserver === "undefined") {
        return;
      }

      if (activePanelResizeObserver) {
        activePanelResizeObserver.disconnect();
      }

      const activePanel = panels[currentIndex];

      if (!activePanel) {
        return;
      }

      activePanelResizeObserver = new ResizeObserver(function () {
        syncStageHeight();
      });

      activePanelResizeObserver.observe(activePanel);
    }

    function queueHeightRefresh() {
      if (resizeRaf) {
        window.cancelAnimationFrame(resizeRaf);
      }

      resizeRaf = window.requestAnimationFrame(function () {
        syncStageHeight();
      });
    }

    function renderStep() {
      panels.forEach(function (panel, index) {
        panel.classList.remove("is-active");

        if (index === currentIndex) {
          void panel.offsetWidth;
          panel.classList.add("is-active");
        }
      });

      window.requestAnimationFrame(function () {
        syncStageHeight();
        observeActivePanel();
      });

      currentLabel.textContent = String(currentIndex + 1);

      const hidePrev = currentIndex === 0;
      const hideNext = currentIndex === totalSteps - 1;

      prevButton.disabled = hidePrev;
      prevButton.classList.toggle("is-disabled", hidePrev);

      nextButton.disabled = hideNext;
      nextButton.textContent = "Next";
      nextButton.classList.toggle("is-disabled", hideNext);
    }

    prevButton.addEventListener("click", function () {
      if (currentIndex > 0) {
        currentIndex -= 1;
        renderStep();
      }
    });

    nextButton.addEventListener("click", function () {
      if (currentIndex < totalSteps - 1) {
        currentIndex += 1;
        renderStep();
      }
    });

    /* Support [data-go-to-step] links inside panels */
    stepper.addEventListener("click", function (e) {
      var link = e.target.closest("[data-go-to-step]");
      if (!link) return;
      e.preventDefault();
      var target = parseInt(link.getAttribute("data-go-to-step"), 10);
      if (!isNaN(target) && target >= 0 && target < totalSteps) {
        currentIndex = target;
        renderStep();
        stepper.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });

    window.addEventListener("resize", queueHeightRefresh);

    queueHeightRefresh();
    renderStep();
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const pageSequence = [
    "/switching-systems-mid-month/",
    "/first-time-logging-in/",
    "/how-to-navigate-the-community-site/",
    "/my-account/",
    "/what-to-do-first/",
    "/update-your-games-equipment-and-preferences/",
    "/availability/",
    "/understanding-the-difference/",
    "/using-calendar-events/",
    "/wrap-up-a-session/",
    "/finding-your-mentees-and-sessions/",
    "/accessing-your-mentees/",
    "/accessing-your-sessions/",
    "/recording-an-absence-illness-and-holiday/",
    "/how-to-log-a-support-ticket/",
    "/dashboard/"
  ];

  const currentPath = window.location.pathname.endsWith("/")
    ? window.location.pathname
    : window.location.pathname + "/";
  const currentIndex = pageSequence.findIndex(function (page) {
    return currentPath.endsWith(page);
  });

  if (currentIndex <= 0) {
    return;
  }

  const footer = document.querySelector(".retro-content-footer");

  if (!footer) {
    return;
  }

  const existingBack = Array.from(footer.querySelectorAll("a, button")).some(function (item) {
    return (item.textContent || "").replace(/\s+/g, " ").trim().toLowerCase() === "previous page";
  });

  if (existingBack) {
    return;
  }

  footer.classList.add("retro-section-nav");

  const backLink = document.createElement("a");
  backLink.className = "retro-button retro-section-nav__link";
  backLink.href = "../" + pageSequence[currentIndex - 1].replace(/^\//, "");
  backLink.textContent = "Previous Page";

  footer.insertBefore(backLink, footer.firstChild);
});

document.addEventListener("DOMContentLoaded", function () {
  const copyButtons = document.querySelectorAll("[data-copy-text]");

  if (!copyButtons.length) {
    return;
  }

  copyButtons.forEach(function (button) {
    button.addEventListener("click", async function () {
      const textToCopy = button.getAttribute("data-copy-text");
      const label = button.getAttribute("data-copy-label") || "Text";
      const panel = button.closest("[data-step-panel]");
      const feedback = panel ? panel.querySelector("[data-copy-feedback]") : null;
      const originalText = button.textContent;

      if (!textToCopy) {
        return;
      }

      try {
        await navigator.clipboard.writeText(textToCopy);

        button.textContent = "COPIED!";
        button.classList.add("is-copied");

        if (feedback) {
          feedback.textContent = ">> " + label + " copied to clipboard <<";
        }

        window.setTimeout(function () {
          button.textContent = originalText;
          button.classList.remove("is-copied");

          if (feedback) {
            feedback.textContent = "";
          }
        }, 1800);
      } catch (error) {
        if (feedback) {
          feedback.textContent = "Copy failed. Please copy it manually.";
        }
      }
    });
  });
});
//////////////////////////////////////////////////////////////
// Lightbox
//////////////////////////////////////////////////////////////
document.addEventListener("DOMContentLoaded", function () {
  let lightbox = document.getElementById("global-lightbox");

  if (!lightbox) {
    lightbox = document.createElement("div");
    lightbox.id = "global-lightbox";
    lightbox.className = "global-lightbox";
    lightbox.setAttribute("aria-hidden", "true");

    lightbox.innerHTML = `
      <div class="global-lightbox__inner" role="dialog" aria-modal="true" aria-label="Expanded image viewer">
        <button class="global-lightbox__close" type="button" aria-label="Close expanded image">Close</button>
        <img class="global-lightbox__media" src="" alt="">
        <p class="global-lightbox__hint">Press Escape to close</p>
      </div>
    `;

    document.body.appendChild(lightbox);
  }

  const media = lightbox.querySelector(".global-lightbox__media");
  const closeBtn = lightbox.querySelector(".global-lightbox__close");
  const inner = lightbox.querySelector(".global-lightbox__inner");
  let lastTrigger = null;

  function setThemeFromImage(img) {
    const page = img.closest(".retro-content-page");
    document.body.removeAttribute("data-lightbox-theme");

    if (!page) {
      return;
    }

    if (page.classList.contains("theme-level-3")) {
      document.body.setAttribute("data-lightbox-theme", "theme-level-3");
    } else if (page.classList.contains("theme-level-4")) {
      document.body.setAttribute("data-lightbox-theme", "theme-level-4");
    }
  }

  function isLightboxTarget(element) {
    return Boolean(
      element &&
      element.matches(
        "img[data-lightbox], img.retro-lightbox-target, img.global-lightbox-target, .retro-image-panel img"
      )
    );
  }

  function prepareImage(img) {
    if (!img.classList.contains("global-lightbox-target")) {
      img.classList.add("global-lightbox-target");
    }

    if (!img.hasAttribute("tabindex")) {
      img.setAttribute("tabindex", "0");
    }

    if (!img.hasAttribute("role")) {
      img.setAttribute("role", "button");
    }

    if (!img.hasAttribute("aria-label")) {
      const alt = img.getAttribute("alt") || "Expand image";
      img.setAttribute("aria-label", alt);
    }
  }

  function prepareImages() {
    const images = document.querySelectorAll(
      "img[data-lightbox], img.retro-lightbox-target, img.global-lightbox-target, .retro-image-panel img"
    );

    images.forEach(prepareImage);
  }

  function open(img) {
    if (!img || !img.src) {
      return;
    }

    lastTrigger = img;
    setThemeFromImage(img);
    media.src = img.currentSrc || img.src;
    media.alt = img.alt || "";
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    closeBtn.focus();
  }

  function close() {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    media.src = "";
    media.alt = "";
    document.body.style.overflow = "";
    document.body.removeAttribute("data-lightbox-theme");

    if (lastTrigger) {
      lastTrigger.focus();
    }
  }

  prepareImages();

  document.addEventListener("click", function (event) {
    const img = event.target.closest("img");

    if (!isLightboxTarget(img)) {
      return;
    }

    prepareImage(img);
    open(img);
  });

  document.addEventListener("keydown", function (event) {
    const img = event.target.closest ? event.target.closest("img") : null;

    if (
      (event.key === "Enter" || event.key === " ") &&
      isLightboxTarget(img)
    ) {
      event.preventDefault();
      prepareImage(img);
      open(img);
      return;
    }

    if (event.key === "Escape" && lightbox.classList.contains("is-open")) {
      close();
    }
  });

  closeBtn.addEventListener("click", close);

  lightbox.addEventListener("click", function (event) {
    if (event.target === lightbox) {
      close();
    }
  });

  if (inner) {
    inner.addEventListener("click", function (event) {
      event.stopPropagation();
    });
  }
});


document.addEventListener("DOMContentLoaded", function () {
  const homeStartButton = document.getElementById("retro-start-here");

  if (homeStartButton && typeof window.retroRunTransition === "function") {
    ["click", "pointerup", "touchend"].forEach(function (eventName) {
      homeStartButton.addEventListener(eventName, function (event) {
        if (eventName !== "click") {
          return;
        }

        if (event.defaultPrevented) {
          return;
        }

        const label = (homeStartButton.textContent || "").replace(/\s+/g, " ").trim().toLowerCase();

        if (label !== "next level") {
          return;
        }

        event.preventDefault();
        event.stopPropagation();
        window.retroRunTransition(homeStartButton);
      }, true);
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const pageSequence = [
    "/switching-systems-mid-month/",
    "/first-time-logging-in/",
    "/how-to-navigate-the-community-site/",
    "/my-account/",
    "/what-to-do-first/",
    "/update-your-games-equipment-and-preferences/",
    "/availability/",
    "/understanding-the-difference/",
    "/using-calendar-events/",
    "/wrap-up-a-session/",
    "/finding-your-mentees-and-sessions/",
    "/accessing-your-mentees/",
    "/accessing-your-sessions/",
    "/recording-an-absence-illness-and-holiday/",
    "/how-to-log-a-support-ticket/",
    "/dashboard/"
  ];

  const currentPath = window.location.pathname.endsWith("/")
    ? window.location.pathname
    : window.location.pathname + "/";
  const currentIndex = pageSequence.findIndex(function (page) {
    return currentPath.endsWith(page);
  });

  if (currentIndex <= 0) {
    return;
  }

  const footer = document.querySelector(".retro-content-footer");

  if (!footer) {
    return;
  }

  const existingBack = Array.from(footer.querySelectorAll("a, button")).some(function (item) {
    return (item.textContent || "").replace(/\s+/g, " ").trim().toLowerCase() === "previous page";
  });

  if (existingBack) {
    return;
  }

  footer.classList.add("retro-section-nav");

  const backLink = document.createElement("a");
  backLink.className = "retro-button retro-section-nav__link";
  backLink.href = "../" + pageSequence[currentIndex - 1].replace(/^\//, "");
  backLink.textContent = "Previous Page";

  footer.insertBefore(backLink, footer.firstChild);
});

document.addEventListener("DOMContentLoaded", function () {
  const copyButtons = document.querySelectorAll("[data-copy-text]");

  function createSparkle(button) {
    const sparkle = document.createElement("span");
    sparkle.className = "retro-copy-sparkle-burst";

    for (let i = 0; i < 6; i += 1) {
      const particle = document.createElement("span");
      particle.className = "retro-copy-sparkle";
      particle.style.setProperty("--sparkle-x", (Math.random() * 72 - 36).toFixed(1) + "px");
      particle.style.setProperty("--sparkle-y", (-12 - Math.random() * 28).toFixed(1) + "px");
      particle.style.setProperty("--sparkle-delay", (Math.random() * 120).toFixed(0) + "ms");
      sparkle.appendChild(particle);
    }

    button.appendChild(sparkle);

    window.setTimeout(function () {
      sparkle.remove();
    }, 900);
  }

  copyButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      window.setTimeout(function () {
        if (button.classList.contains("is-copied")) {
          createSparkle(button);
        }
      }, 80);
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const keywordPhrases = [
    "Salesforce Community site",
    "Salesforce Community",
    "Community site",
    "parent/carer meeting",
    "parent/carer",
    "initial parent/carer meeting",
    "mentee profile",
    "mentee profiles",
    "support ticket",
    "support tickets",
    "calendar event",
    "calendar events",
    "Google Meet",
    "Availability",
    "Accept",
    "Reject",
    "Save",
    "Submit",
    "Discord",
    "email address",
    "username",
    "caseload",
    "session notes",
    "mentor notes",
    "mentee",
    "mentees",
    "session",
    "sessions",
    "profile",
    "profiles"
  ].sort(function (a, b) {
    return b.length - a.length;
  });

  const selector = "#retro-homepage p, #retro-homepage li, .retro-content-page p, .retro-content-page li";
  const blocks = document.querySelectorAll(selector);

  if (!blocks.length) {
    return;
  }

  function escapeRegex(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function shouldSkipNode(node) {
    const parent = node.parentElement;

    if (!parent) {
      return true;
    }

    return Boolean(parent.closest("strong, b, a, code, pre, button, .retro-copy-item__text, .md-typeset__scrollwrap, [data-no-auto-strong]"));
  }

  function wrapKeywords(textNode) {
    if (!textNode || !textNode.nodeValue || shouldSkipNode(textNode)) {
      return;
    }

    const original = textNode.nodeValue;
    let matchIndex = -1;
    let matchedPhrase = "";

    keywordPhrases.forEach(function (phrase) {
      const regex = new RegExp("(^|[^A-Za-z])(" + escapeRegex(phrase) + ")(?=$|[^A-Za-z])", "i");
      const match = original.match(regex);

      if (match) {
        const index = match.index + match[1].length;

        if (matchIndex === -1 || index < matchIndex) {
          matchIndex = index;
          matchedPhrase = original.substr(index, match[2].length);
        }
      }
    });

    if (matchIndex === -1 || !matchedPhrase) {
      return;
    }

    const before = original.slice(0, matchIndex);
    const after = original.slice(matchIndex + matchedPhrase.length);
    const fragment = document.createDocumentFragment();

    if (before) {
      fragment.appendChild(document.createTextNode(before));
    }

    const strong = document.createElement("strong");
    strong.className = "retro-auto-strong";
    strong.textContent = matchedPhrase;
    fragment.appendChild(strong);

    if (after) {
      fragment.appendChild(document.createTextNode(after));
    }

    textNode.parentNode.replaceChild(fragment, textNode);

    if (after) {
      wrapKeywords(strong.nextSibling);
    }
  }

  blocks.forEach(function (block) {
    const walker = document.createTreeWalker(block, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        if (!node.nodeValue || !node.nodeValue.trim()) {
          return NodeFilter.FILTER_REJECT;
        }

        return shouldSkipNode(node) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
      }
    });

    const textNodes = [];
    let currentNode = walker.nextNode();

    while (currentNode) {
      textNodes.push(currentNode);
      currentNode = walker.nextNode();
    }

    textNodes.forEach(function (node) {
      wrapKeywords(node);
    });
  });
});


document.addEventListener("DOMContentLoaded", function () {
  const topNavLinks = Array.from(document.querySelectorAll(".md-tabs__link"));

  if (!topNavLinks.length) {
    return;
  }

  const sidebar = document.createElement("aside");
  sidebar.className = "retro-training-sidebar";
  sidebar.setAttribute("aria-label", "Training guide navigation");

  const heading = document.createElement("div");
  heading.className = "retro-training-sidebar__heading";
  heading.textContent = "Training Map";
  sidebar.appendChild(heading);

  const currentLabel = document.createElement("div");
  currentLabel.className = "retro-training-sidebar__current-label";
  currentLabel.innerHTML = 'Current page<span class="retro-training-sidebar__current-page"></span>';
  sidebar.appendChild(currentLabel);

  const list = document.createElement("nav");
  list.className = "retro-training-sidebar__list";
  sidebar.appendChild(list);

  function normalisePath(urlValue) {
    try {
      const url = new URL(urlValue, window.location.href);
      let path = url.pathname.replace(/index\.html$/i, "");
      path = path.replace(/\/+/g, "/");
      path = path.replace(/\/$/, "");
      return path || "/";
    } catch (error) {
      return "";
    }
  }

  const currentPath = normalisePath(window.location.href);
  let activeLabel = "";

  topNavLinks.forEach(function (sourceLink) {
    const clonedLink = document.createElement("a");
    const href = sourceLink.getAttribute("href") || "#";
    const label = (sourceLink.textContent || "").trim();
    const sourceItem = sourceLink.closest(".md-tabs__item");
    const sourcePath = normalisePath(href);
    const isActive = sourceItem && sourceItem.classList.contains("md-tabs__item--active") || sourcePath === currentPath;

    clonedLink.className = "retro-training-sidebar__link";
    clonedLink.href = href;
    clonedLink.textContent = label;

    if (isActive) {
      clonedLink.classList.add("is-active");
      activeLabel = label;
    }

    list.appendChild(clonedLink);
  });

  const currentPage = sidebar.querySelector(".retro-training-sidebar__current-page");

  if (currentPage) {
    currentPage.textContent = activeLabel || document.title || "Current page";
  }

  const headerTitle = document.querySelector(".md-header__title");

  if (headerTitle && activeLabel) {
    const chip = document.createElement("span");
    chip.className = "retro-current-chip";
    chip.textContent = "Current: " + activeLabel;
    headerTitle.appendChild(chip);
  }

  document.body.appendChild(sidebar);
  document.body.classList.add("retro-has-training-sidebar");
});

/* =========================================================
   SMOOTH PAGE-EXIT FADE
   Intercepts internal navigation clicks and applies a short
   fade-out before the browser navigates to the next page.
   ========================================================= */
document.addEventListener("DOMContentLoaded", function () {
  var exitDuration = 180;
  var isExiting = false;

  function isInternalLink(link) {
    if (!link || !link.href) return false;
    if (link.target && link.target !== "_self") return false;
    if (link.hasAttribute("download")) return false;
    try {
      var url = new URL(link.href, window.location.href);
      return url.origin === window.location.origin;
    } catch (e) {
      return false;
    }
  }

  function shouldIntercept(link) {
    if (!link) return false;
    /* Skip links handled by the fancy "Next Level" transition */
    var label = (link.textContent || "").replace(/\s+/g, " ").trim().toLowerCase();
    if (label === "next level") return false;
    /* Only intercept internal navigation links */
    return isInternalLink(link);
  }

  /* Selectors for nav links we want to soften */
  var navSelector = [
    '.navbar a[rel="prev"]',
    '.navbar a[rel="next"]',
    "a.retro-section-nav__link",
    "a.retro-nav-button",
    ".retro-content-footer a",
    ".retro-side-rail__link",
    ".retro-training-sidebar__link"
  ].join(", ");

  document.addEventListener("click", function (event) {
    if (isExiting) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;

    var link = event.target.closest(navSelector);
    if (!shouldIntercept(link)) return;

    event.preventDefault();
    isExiting = true;
    document.documentElement.classList.add("retro-page-exiting");

    var target = link.getAttribute("href");
    window.setTimeout(function () {
      window.location.href = target;
    }, exitDuration);
  }, true);
});

/* =========================================================
   SIDEBAR: Custom tree-nav expand/collapse (replaces Bootstrap
   dropdown behaviour on desktop for stable, predictable toggling)
   ========================================================= */
document.addEventListener("DOMContentLoaded", function () {
  var isDesktop = window.matchMedia("(min-width: 992px)").matches;
  if (!isDesktop) return;

  var dropdowns = document.querySelectorAll(".navbar .nav-item.dropdown");
  if (!dropdowns.length) return;

  dropdowns.forEach(function (dd) {
    var toggle = dd.querySelector(".dropdown-toggle");
    var menu = dd.querySelector(".dropdown-menu");
    if (!toggle || !menu) return;

    /* Strip Bootstrap's dropdown behaviour so it does not interfere */
    toggle.removeAttribute("data-bs-toggle");
    toggle.removeAttribute("role");
    toggle.setAttribute("aria-expanded", "false");

    /* Measure and set up height animation */
    function openSection() {
      dd.classList.add("show");
      menu.classList.add("show");
      toggle.setAttribute("aria-expanded", "true");
      /* Animate: set height from 0 to scrollHeight */
      menu.style.height = "0px";
      menu.style.overflow = "hidden";
      var h = menu.scrollHeight;
      menu.style.height = h + "px";
      window.setTimeout(function () {
        menu.style.height = "";
        menu.style.overflow = "";
      }, 250);
    }

    function closeSection() {
      /* Animate: set height from current to 0 */
      menu.style.height = menu.scrollHeight + "px";
      menu.style.overflow = "hidden";
      void menu.offsetHeight; /* force reflow */
      menu.style.height = "0px";
      window.setTimeout(function () {
        dd.classList.remove("show");
        menu.classList.remove("show");
        toggle.setAttribute("aria-expanded", "false");
        menu.style.height = "";
        menu.style.overflow = "";
      }, 250);
    }

    /* Toggle on parent header click */
    toggle.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      if (dd.classList.contains("show")) {
        closeSection();
      } else {
        openSection();
      }
    });

    /* Keyboard support: Enter and Space */
    toggle.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggle.click();
      }
    });

    /* Auto-open the section containing the active page */
    if (dd.querySelector(".dropdown-item.active")) {
      dd.classList.add("show");
      menu.classList.add("show");
      toggle.setAttribute("aria-expanded", "true");
    }
  });

  /* Child page links navigate normally — no interference needed
     since Bootstrap dropdown is no longer controlling these elements. */
});

/* =========================================================
   FLIP CARDS — unified handler for [data-flip-card] elements
   Used by both retro-nav-tile and retro-flip-card systems.
   ========================================================= */
document.addEventListener("DOMContentLoaded", function () {
  var cards = document.querySelectorAll("[data-flip-card]");
  if (!cards.length) return;

  var animClasses = ["is-animating-a", "is-animating-b", "is-animating-c"];

  cards.forEach(function (card) {
    var trigger = card.querySelector("[data-flip-trigger]");
    var preset = card.getAttribute("data-animation");
    if (!trigger) return;

    function toggleFlip() {
      /* Remove any running accent animation */
      animClasses.forEach(function (c) { card.classList.remove(c); });

      /* Pick and apply the decorative accent animation */
      var animClass = preset === "b" ? "is-animating-b"
                    : preset === "c" ? "is-animating-c"
                    : "is-animating-a";
      card.classList.add(animClass);

      /* Toggle the flip state */
      var isFlipped = card.classList.toggle("is-flipped");
      trigger.setAttribute("aria-expanded", isFlipped ? "true" : "false");

      /* Clean up accent class after it finishes */
      window.setTimeout(function () { card.classList.remove(animClass); }, 900);
    }

    trigger.addEventListener("click", function (e) {
      if (e.target.closest("a")) return;
      toggleFlip();
    });
    trigger.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggleFlip(); }
    });
  });
});