/* script.js
   Interactivity: dark mode toggle, nav mobile toggle, smooth scrolling,
   contact form mailto fallback, and simple scroll reveal for sections.
*/

// --- Helpers
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

// --- Dark mode toggle (persist in localStorage)
const colorToggle = $("#color-toggle");
const rootHtml = document.documentElement;
const DARK_KEY = "dark_mode_v1";

function setDark(val) {
  if (val) {
    rootHtml.classList.add("dark");
    localStorage.setItem(DARK_KEY, "1");
    colorToggle.innerHTML = '<i class="fas fa-sun"></i>';
    colorToggle.setAttribute("aria-pressed", "true");
  } else {
    rootHtml.classList.remove("dark");
    localStorage.removeItem(DARK_KEY);
    colorToggle.innerHTML = '<i class="fas fa-moon"></i>';
    colorToggle.setAttribute("aria-pressed", "false");
  }
}

colorToggle?.addEventListener("click", () => {
  setDark(!rootHtml.classList.contains("dark"));
});

// Initialize dark from pref or storage
(function initTheme() {
  const saved = localStorage.getItem(DARK_KEY);
  if (saved === "1") {
    setDark(true);
  } else {
    // respect prefers-color-scheme if no saved preference
    const prefersDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDark(prefersDark);
  }
})();

// --- Mobile nav toggle
const navToggle = $("#navToggle");
const nav = $("#nav");
navToggle?.addEventListener("click", () => {
  nav.classList.toggle("open");
  navToggle.querySelector("i").classList.toggle("fa-times");
  navToggle.querySelector("i").classList.toggle("fa-bars");
});

// Close mobile nav on link click (small screens)
$$("#nav a").forEach((a) =>
  a.addEventListener("click", () => {
    if (window.innerWidth < 720) nav.classList.remove("open");
  })
);

// --- Smooth scroll for internal anchors
document.addEventListener("click", (e) => {
  const a = e.target.closest('a[href^="#"]');
  if (!a) return;
  const id = a.getAttribute("href");
  if (id.length === 1) return;
  const target = document.querySelector(id);
  if (target) {
    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }
});

// --- Simple intersection observer to reveal sections (fade-in)
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((ent) => {
      if (ent.isIntersecting) {
        ent.target.classList.add("visible");
        observer.unobserve(ent.target);
      }
    });
  },
  { threshold: 0.12 }
);

$$(".section, .card, .hero-inner, .about-grid, .contact-grid").forEach((el) => {
  el.classList.add("fade-in");
  observer.observe(el);
});

// --- Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// --- Contact form handling
const contactForm = $("#contactForm");
const mailtoBtn = $("#mailtoBtn");

contactForm?.addEventListener("submit", (ev) => {
  ev.preventDefault();
  // Quick frontend validation (already using required attributes)
  const name = $("#name").value.trim();
  const email = $("#email").value.trim();
  const message = $("#message").value.trim();
  if (!name || !email || !message) {
    alert("Please fill all fields.");
    return;
  }

  // Option 1: If you have a server endpoint, replace the fetch URL with your API
  // Example:
  // fetch('/api/send-email', { method: 'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify({name,email,message})})
  //   .then(r => r.json()).then(res => alert('Message sent.')).catch(err => alert('Error sending.'));

  // Option 2: No server - fallback to mailto (opens user's email client)
  const subject = encodeURIComponent(`Website message from ${name}`);
  const body = encodeURIComponent(
    `Name: ${name}\nEmail: ${email}\n\n${message}`
  );
  window.location.href = `mailto:your.email@example.com?subject=${subject}&body=${body}`;
});

// Mailto button: quickly open email client
mailtoBtn?.addEventListener("click", () => {
  const subject = encodeURIComponent("Contact from portfolio");
  window.location.href = `mailto:your.email@example.com?subject=${subject}`;
});

/* === Notes for production / deployment ===
 - Replace 'your.email@example.com' with your real email.
 - To have the form send emails without opening the user's mail client, use:
   - A lightweight server endpoint (Node/PHP) that sends via SMTP or an API (SendGrid, Mailgun).
   - Or use a form provider like Formspree: set form action to Formspree endpoint and remove JS mailto fallback.
 - Replace Font Awesome kit URL in index.html with your kit, or include link to CSS CDN.
 - Replace placeholder images with screenshots and use real project links.
 - Consider preloading a key image for the hero with <link rel="preload"> for performance.
*/
