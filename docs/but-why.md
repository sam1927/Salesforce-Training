<div class="retro-content-page retro-level-page theme-level-1">

  <div class="retro-content-shell">

    <div class="retro-content-header">
      <div class="retro-content-kicker">Level 1</div>
      <h1>But Why?</h1>
    </div>
<div class="retro-why-carousel" data-retro-why-carousel>

      <div class="retro-why-carousel__viewport">

        <section class="retro-why-slide is-active" data-retro-why-slide>
          <div class="retro-panel">
            <p>
              As MindJam has grown, the number of processes involved in mentoring has increased.
              This includes things like <strong>mentee profiles</strong>, <strong>mentor notes</strong>,
              <strong>attendance</strong>, <strong>timesheets</strong>, <strong>session details</strong>,
              and <strong>availability</strong>.
            </p>
          </div>
        </section>

        <section class="retro-why-slide" data-retro-why-slide>
          <div class="retro-panel">
            <p>
              Right now, much of this sits across separate documents and systems in
              <strong>Google Workspace</strong>. Because these processes are not connected,
              information sometimes needs to be <strong>updated in multiple places</strong>,
              which can create extra work and make records harder to keep aligned.
            </p>
          </div>
        </section>

        <section class="retro-why-slide" data-retro-why-slide>
          <div class="retro-panel">
            <p>
              <strong>Schools and local authorities</strong> are also placing greater expectations
              on how we manage <strong>information</strong>, maintain clear <strong>records</strong>,
              and provide reliable <strong>audit trails</strong>. Our current setup was not designed
              for this level of <strong>scale</strong>.
            </p>
          </div>
        </section>

        <section class="retro-why-slide" data-retro-why-slide>
          <div class="retro-panel">
            <p>
              <strong>Salesforce</strong> brings these processes into <strong>one connected system</strong>.
              This helps keep information <strong>consistent</strong>, improves <strong>visibility</strong>
              across sessions, and reduces the need for <strong>follow-up emails</strong> and
              <strong>manual updates</strong> later.
            </p>
          </div>
        </section>

        <section class="retro-why-slide" data-retro-why-slide>
          <div class="retro-panel">
            <p>
              We are <strong>not moving away from Google Workspace entirely</strong>. Tools like
              <strong>Google Meet</strong> and <strong>historic notes</strong> will still remain available.
            </p>
          </div>
        </section>

      </div>

      <div class="retro-why-carousel__controls retro-step-nav">
        <button type="button" class="retro-button retro-step-button" data-retro-why-back>
          Previous
        </button>

        <button type="button" class="retro-button retro-button-pulse retro-step-button" data-retro-why-next>
          Next
        </button>
      </div>

    </div>

    <div class="retro-panel retro-video-panel">

      <h2 class="retro-video-title">Watch a short explanation below</h2>

      <div class="retro-video-embed">
        <iframe
          src="https://www.youtube-nocookie.com/embed/0knMU3Ypz3o?rel=0"
          title="MindJam Salesforce explanation video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerpolicy="strict-origin-when-cross-origin"
          allowfullscreen>
        </iframe>
      </div>

    </div>

    <div class="retro-content-footer">
      <a
        class="retro-button retro-section-nav__link retro-button-pulse retro-nav-button"
        href="../switching-systems-mid-month/"
        data-target="../switching-systems-mid-month/"
      >
        Next Level
      </a>
    </div>

  </div>

  <div id="retro-transition" class="retro-transition" aria-hidden="true">
    <div class="retro-transition__scanlines"></div>
    <div class="retro-transition__grid"></div>
    <div class="retro-transition__flash"></div>
    <div class="retro-transition__beam"></div>
    <div class="retro-transition__stars"></div>

    <div class="retro-transition__terminal">
      <div class="retro-transition__terminal-title">System Transfer</div>
      <div class="retro-transition__terminal-text">Loading Next Level...</div>
    </div>
  </div>

</div>

<script>
  document.addEventListener("DOMContentLoaded", function () {
    const carousel = document.querySelector("[data-retro-why-carousel]");

    if (!carousel) {
      return;
    }

    const viewport = carousel.querySelector(".retro-why-carousel__viewport");
    const slides = Array.from(carousel.querySelectorAll("[data-retro-why-slide]"));
    const backButton = carousel.querySelector("[data-retro-why-back]");
    const nextButton = carousel.querySelector("[data-retro-why-next]");

    if (!slides.length || !backButton || !nextButton) {
      return;
    }

    let currentIndex = 0;
    let resizeRaf = null;
    let activeSlideResizeObserver = null;

    function syncViewportHeight() {
      if (!viewport) {
        return;
      }

      const activeSlide = slides[currentIndex];

      if (!activeSlide) {
        return;
      }

      const nextHeight = Math.ceil(activeSlide.offsetHeight);

      if (nextHeight > 0) {
        viewport.style.height = nextHeight + "px";
      }
    }

    function observeActiveSlide() {
      if (typeof ResizeObserver === "undefined") {
        return;
      }

      if (activeSlideResizeObserver) {
        activeSlideResizeObserver.disconnect();
      }

      const activeSlide = slides[currentIndex];

      if (!activeSlide) {
        return;
      }

      activeSlideResizeObserver = new ResizeObserver(function () {
        syncViewportHeight();
      });

      activeSlideResizeObserver.observe(activeSlide);
    }

    function queueHeightRefresh() {
      if (resizeRaf) {
        window.cancelAnimationFrame(resizeRaf);
      }

      resizeRaf = window.requestAnimationFrame(function () {
        syncViewportHeight();
      });
    }

    function renderSlide() {
      slides.forEach(function (slide, index) {
        const isActive = index === currentIndex;
        slide.classList.toggle("is-active", isActive);
        slide.setAttribute("aria-hidden", isActive ? "false" : "true");
      });

      window.requestAnimationFrame(function () {
        syncViewportHeight();
        observeActiveSlide();
      });

      const hideBack = currentIndex === 0;
      const hideNext = currentIndex === slides.length - 1;

      backButton.disabled = hideBack;
      backButton.classList.toggle("is-hidden", hideBack);
      nextButton.disabled = hideNext;
      nextButton.classList.toggle("is-hidden", hideNext);
    }

    backButton.addEventListener("click", function () {
      if (currentIndex > 0) {
        currentIndex -= 1;
        renderSlide();
      }
    });

    nextButton.addEventListener("click", function () {
      if (currentIndex < slides.length - 1) {
        currentIndex += 1;
        renderSlide();
      }
    });

    window.addEventListener("resize", queueHeightRefresh);

    queueHeightRefresh();
    renderSlide();
  });
</script>
