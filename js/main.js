// Mobile nav toggle
(function () {
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");
  if (!toggle || !links) return;
  toggle.addEventListener("click", function () {
    var open = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
  links.addEventListener("click", function (e) {
    if (e.target.tagName === "A") {
      links.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });
})();

// Footer year
(function () {
  var el = document.getElementById("year");
  if (el) el.textContent = new Date().getFullYear();
})();

// One-time boot-sequence typing effect on the hero heading
(function () {
  var el = document.querySelector("[data-typewriter]");
  if (!el) return;

  var lines = JSON.parse(el.getAttribute("data-typewriter"));
  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var finalHTML = el.innerHTML;

  if (prefersReducedMotion) {
    return;
  }

  el.innerHTML = '<span class="typed"></span><span class="cursor" aria-hidden="true"></span>';
  var typedEl = el.querySelector(".typed");
  var full = lines.join("\n");
  var i = 0;

  el.setAttribute("aria-label", full);

  function tick() {
    if (i <= full.length) {
      typedEl.textContent = full.slice(0, i);
      i++;
      setTimeout(tick, 22 + Math.random() * 28);
    }
  }
  tick();
})();

// Project filter (projects.html)
(function () {
  var buttons = document.querySelectorAll(".filter-btn");
  var cards = document.querySelectorAll(".project-card");
  if (!buttons.length || !cards.length) return;

  buttons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      buttons.forEach(function (b) {
        b.classList.remove("active");
        b.setAttribute("aria-pressed", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-pressed", "true");

      var filter = btn.getAttribute("data-filter");
      cards.forEach(function (card) {
        var match = filter === "all" || card.getAttribute("data-category") === filter;
        card.style.display = match ? "" : "none";
      });
    });
  });
})();

// Subtle scroll reveal
(function () {
  var targets = document.querySelectorAll("[data-reveal]");
  if (!targets.length || !("IntersectionObserver" in window)) return;

  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  targets.forEach(function (t) {
    io.observe(t);
  });
})();
