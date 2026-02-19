// Smooth scrolling & small interaction enhancements

// Smooth scroll for internal anchor links (with offset for sticky header)
document.addEventListener("DOMContentLoaded", function () {
  const header = document.querySelector(".site-header");
  const headerHeight = header ? header.offsetHeight : 72;
  const links = document.querySelectorAll('a[href^="#"]:not([href="#"])');

  links.forEach((link) => {
    link.addEventListener("click", function (event) {
      const targetId = this.getAttribute("href").slice(1);
      const targetEl = document.getElementById(targetId);

      if (targetEl) {
        event.preventDefault();
        const rect = targetEl.getBoundingClientRect();
        const offsetTop = rect.top + window.pageYOffset - headerHeight + 4;

        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        });
      }
    });
  });

  // Mobile navigation toggle
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      const isOpen = navToggle.classList.toggle("is-open");
      navLinks.classList.toggle("is-open", isOpen);
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    // Close menu after clicking a link on mobile
    navLinks.addEventListener("click", (event) => {
      if (event.target.tagName.toLowerCase() === "a" && navToggle.classList.contains("is-open")) {
        navToggle.classList.remove("is-open");
        navLinks.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // Fade-in on scroll using Intersection Observer
  const fadeInElements = document.querySelectorAll(".fade-in");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.18,
      }
    );

    fadeInElements.forEach((el) => observer.observe(el));
  } else {
    // Fallback: if IntersectionObserver is not supported, show all elements
    fadeInElements.forEach((el) => el.classList.add("is-visible"));
  }

  const heroVideo = document.getElementById("heroVideo");
  const muteBtn = document.getElementById("muteBtn");
  const muteIcon = document.getElementById("muteIcon");
  const iconUse = muteIcon ? muteIcon.querySelector("use") : null;
  let hasHeroVideoPlayed = false;

  function setMuteIcon(muted) {
    if (!iconUse) return;
    const id = muted ? "#volume-xmark" : "#volume-high";
    iconUse.setAttribute("href", id);
    iconUse.setAttribute("xlink:href", id);
    if (muteBtn) {
      muteBtn.setAttribute("aria-pressed", String(!muted));
      muteBtn.setAttribute("aria-label", muted ? "Unmute video" : "Mute video");
    }
  }

  if (heroVideo && muteBtn && iconUse) {
    setMuteIcon(heroVideo.muted);

    const heroObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasHeroVideoPlayed) {
          heroVideo
            .play()
            .then(() => {
              hasHeroVideoPlayed = true;
              heroObserver.disconnect();
            })
            .catch(() => {
              hasHeroVideoPlayed = true;
              heroObserver.disconnect();
            });
        }
      },
      { threshold: 0.6 }
    );

    heroObserver.observe(heroVideo);

    function toggleHeroMute() {
      heroVideo.muted = !heroVideo.muted;
      setMuteIcon(heroVideo.muted);
    }

    muteBtn.addEventListener("click", toggleHeroMute);

    muteBtn.addEventListener("keydown", (event) => {
      if (event.key === " " || event.key === "Enter") {
        event.preventDefault();
        toggleHeroMute();
      }
    });
  }
});


