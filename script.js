const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
if (!prefersReducedMotion.matches) document.documentElement.classList.add("js");

const header = document.querySelector(".site-header");
const navLinks = document.querySelectorAll(".nav-links a");
const revealItems = document.querySelectorAll(".hero-copy, .hero-photo, .project-card");
const expCards = document.querySelectorAll(".exp-card");
const counters = document.querySelectorAll("[data-count]");
const contactForm = document.getElementById("contactForm");
const formNote = document.getElementById("formNote");
const yearEl = document.getElementById("year");
const formspreeFormId = "YOUR_FORM_ID";

if (yearEl) yearEl.textContent = new Date().getFullYear();

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealItems.forEach((item) => revealObserver.observe(item));

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  }, { rootMargin: "-32% 0px -62% 0px", threshold: 0 });

  document.querySelectorAll("main section[id]").forEach((section) => navObserver.observe(section));

  if (!prefersReducedMotion.matches) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const element = entry.target;
        const target = Number(element.dataset.count || 0);
        const start = performance.now();
        const duration = 650;

        const update = (now) => {
          const progress = Math.min(1, (now - start) / duration);
          element.textContent = Math.round(target * progress);
          if (progress < 1) requestAnimationFrame(update);
        };

        requestAnimationFrame(update);
        observer.unobserve(element);
      });
    }, { threshold: 0.6 });

    counters.forEach((counter) => counterObserver.observe(counter));
  } else {
    counters.forEach((counter) => { counter.textContent = counter.dataset.count || "0"; });
  }
} else {
  revealItems.forEach((item) => item.classList.add("visible"));
  counters.forEach((counter) => { counter.textContent = counter.dataset.count || "0"; });
}

if (header) {
  let ticking = false;
  window.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      header.classList.toggle("scrolled", window.scrollY > 24);
      ticking = false;
    });
  }, { passive: true });
}

expCards.forEach((card) => {
  const toggle = card.querySelector(".exp-toggle");
  if (!toggle) return;

  toggle.addEventListener("click", () => {
    const shouldOpen = !card.classList.contains("active");
    expCards.forEach((item) => {
      item.classList.remove("active");
      item.querySelector(".exp-toggle")?.setAttribute("aria-expanded", "false");
    });
    if (shouldOpen) {
      card.classList.add("active");
      toggle.setAttribute("aria-expanded", "true");
    }
  });
});

if (contactForm) {
  if (!formspreeFormId || formspreeFormId === "YOUR_FORM_ID") {
    const submitButton = contactForm.querySelector("[type='submit']");
    if (submitButton) submitButton.disabled = true;
    if (formNote) formNote.textContent = "Form delivery needs a Formspree form ID before messages can be sent.";
  } else {
    contactForm.action = `https://formspree.io/f/${formspreeFormId}`;
    window.formspree = window.formspree || function () {
      (window.formspree.q = window.formspree.q || []).push(arguments);
    };
    window.formspree("initForm", {
      formElement: "#contactForm",
      formId: formspreeFormId,
    });
  }
}
