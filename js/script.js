document.addEventListener("DOMContentLoaded", () => {
  /* VIDEO */
  const video = document.getElementById("heroVideo");
  const heroSection = document.getElementById("hero");

  if (video) {
    video.play().catch(() => {});

    const unmute = () => {
      video.muted = false;
      document.removeEventListener("click", unmute);
      document.removeEventListener("touchstart", unmute);
      document.removeEventListener("keydown", unmute);
    };

    document.addEventListener("click", unmute, { once: true, passive: true });
    document.addEventListener("touchstart", unmute, {
      once: true,
      passive: true,
    });
    document.addEventListener("keydown", unmute, { once: true });

    new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          video.muted = true;
        } else if (document.interacted) {
          video.muted = false;
        }
      },
      { threshold: 0.2 },
    ).observe(heroSection);

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        video.muted = true;
      } else {
        if (video.paused) video.play().catch(() => {});
        const heroVisible =
          heroSection.getBoundingClientRect().bottom > window.innerHeight * 0.2;
        if (heroVisible && document.interacted) video.muted = false;
      }
    });

    const markInteracted = () => {
      document.interacted = true;
    };
    document.addEventListener("click", markInteracted, {
      once: true,
      passive: true,
    });
    document.addEventListener("touchstart", markInteracted, {
      once: true,
      passive: true,
    });
    document.addEventListener("keydown", markInteracted, { once: true });
  }

  /* NAV */
  const navbar = document.getElementById("navbar");
  if (navbar)
    window.addEventListener(
      "scroll",
      () => navbar.classList.toggle("scrolled", scrollY > 60),
      { passive: true },
    );

  /* MOBILE MENU */
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobileMenu");

  const closeMobile = () => {
    hamburger?.classList.remove("open");
    mobileMenu?.classList.remove("open");
    setTimeout(() => {
      if (!mobileMenu?.classList.contains("open"))
        mobileMenu.style.display = "none";
    }, 420);
    document.body.style.overflow = "";
  };

  if (hamburger && mobileMenu) {
    hamburger.addEventListener("click", () => {
      const open = hamburger.classList.toggle("open");
      if (open) {
        mobileMenu.style.display = "flex";
        requestAnimationFrame(() =>
          requestAnimationFrame(() => mobileMenu.classList.add("open")),
        );
        document.body.style.overflow = "hidden";
      } else {
        closeMobile();
      }
    });
    mobileMenu
      .querySelectorAll("a")
      .forEach((a) => a.addEventListener("click", closeMobile));
  }

  window.closeMobile = closeMobile;

  /* SCROLL REVEAL */
  const observer = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          observer.unobserve(e.target);
        }
      }),
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
  );

  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

  /* LIGHTBOX */
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");

  const openLightbox = (el) => {
    if (el.dataset.type === "video") return;
    const img = el.querySelector("img");
    if (!img || !lightbox) return;
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    lightbox?.classList.remove("open");
    document.body.style.overflow = "";
  };

  document.querySelectorAll(".gallery-item.video-item video").forEach((vid) => {
    vid.play().catch(() => {});
  });

  document
    .querySelectorAll(".gallery-item")
    .forEach((item) =>
      item.addEventListener("click", () => openLightbox(item)),
    );
  lightbox?.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLightbox();
  });

  window.openLightbox = openLightbox;
  window.closeLightbox = closeLightbox;

  /* SMOOTH SCROLL */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const target = document.querySelector(a.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  /* SCROLL INDICATOR */
  const about = document.getElementById("about");
  document
    .querySelector(".scroll-indicator")
    ?.addEventListener("click", () =>
      about?.scrollIntoView({ behavior: "smooth", block: "start" }),
    );
});
