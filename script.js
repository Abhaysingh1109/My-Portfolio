const header = document.querySelector(".site-header");
const navLinks = document.querySelectorAll(".nav-links a");
const revealItems = document.querySelectorAll(".reveal");
const expCards = document.querySelectorAll(".exp-card");
const projectCards = document.querySelectorAll(".project-card");
const counters = document.querySelectorAll("[data-count]");
const contactForm = document.getElementById("contactForm");
const yearEl = document.getElementById("year");

if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

window.addEventListener("scroll", () => {
  if (window.scrollY > 30) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18 },
);

revealItems.forEach((item) => observer.observe(item));

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => {
          const targetId = link.getAttribute("href").replace("#", "");
          link.classList.toggle("active", targetId === entry.target.id);
        });
      }
    });
  },
  { threshold: 0.55 },
);

const sections = document.querySelectorAll("main section[id]");
sections.forEach((section) => sectionObserver.observe(section));

expCards.forEach((card) => {
  const toggle = card.querySelector(".exp-toggle");
  toggle.addEventListener("click", () => {
    const isOpen = card.classList.contains("active");
    expCards.forEach((item) => {
      item.classList.remove("active");
    });
    if (!isOpen) {
      card.classList.add("active");
    }
  });
});

projectCards.forEach((card) => {
  card.addEventListener("mousemove", (event) => {
    const rect = card.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    const rotateY = (px - 0.5) * 18;
    const rotateX = (0.5 - py) * 18;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform =
      "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)";
  });
});

const animateCounter = (element) => {
  const target = Number(element.dataset.count || 0);
  let current = 0;
  const step = Math.max(1, Math.ceil(target / 50));

  const interval = setInterval(() => {
    current += step;
    if (current >= target) {
      element.textContent = target;
      clearInterval(interval);
      return;
    }
    element.textContent = current;
  }, 24);
};

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.6 },
);

counters.forEach((counter) => counterObserver.observe(counter));

const heroVisual = document.querySelector(".visual-scene");
if (heroVisual) {
  document.addEventListener("pointermove", (event) => {
    const x = (event.clientX / window.innerWidth - 0.5) * 18;
    const y = (event.clientY / window.innerHeight - 0.5) * 18;
    heroVisual.style.transform = `rotateX(${(-y).toFixed(2)}deg) rotateY(${x.toFixed(2)}deg)`;
  });
}

const canvas = document.getElementById("space-bg");
const ctx = canvas.getContext("2d");
let stars = [];
let shootingStars = [];

const resizeCanvas = () => {
  canvas.width = window.innerWidth * window.devicePixelRatio;
  canvas.height = window.innerHeight * window.devicePixelRatio;
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  ctx.setTransform(
    window.devicePixelRatio,
    0,
    0,
    window.devicePixelRatio,
    0,
    0,
  );
  stars = Array.from({ length: 180 }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: Math.random() * 2.2 + 0.4,
    alpha: Math.random() * 0.9 + 0.1,
    speed: Math.random() * 0.4 + 0.08,
  }));
};

const drawStars = () => {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  stars.forEach((star) => {
    star.y += star.speed;
    if (star.y > window.innerHeight) {
      star.y = -10;
      star.x = Math.random() * window.innerWidth;
    }

    ctx.beginPath();
    ctx.fillStyle = `rgba(255,255,255,${star.alpha})`;
    ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
    ctx.fill();
  });

  shootingStars.forEach((shootingStar, index) => {
    shootingStar.x += shootingStar.vx;
    shootingStar.y += shootingStar.vy;
    shootingStar.life -= 0.02;

    ctx.beginPath();
    ctx.strokeStyle = `rgba(255,255,255,${shootingStar.life})`;
    ctx.lineWidth = 1.5;
    ctx.moveTo(shootingStar.x, shootingStar.y);
    ctx.lineTo(shootingStar.x - 30, shootingStar.y - 18);
    ctx.stroke();

    if (shootingStar.life <= 0) {
      shootingStars.splice(index, 1);
    }
  });

  if (Math.random() < 0.012) {
    shootingStars.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight * 0.4,
      vx: 5,
      vy: 2.3,
      life: 1,
    });
  }

  requestAnimationFrame(drawStars);
};

resizeCanvas();
window.addEventListener("resize", resizeCanvas);
requestAnimationFrame(drawStars);

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const submitBtn = contactForm.querySelector("button");
  const originalText = submitBtn.textContent;
  submitBtn.textContent = "Message Sent";
  submitBtn.disabled = true;

  setTimeout(() => {
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
    contactForm.reset();
  }, 2000);
});
