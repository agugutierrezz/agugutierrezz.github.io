/* ============================================================
   Portfolio — Agustín Gutiérrez Mora
   Navegación, efecto de tipeo, parallax de halos y apariciones
   ============================================================ */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Menú mobile ---------- */
  var menuBtn = document.getElementById("menu-btn");
  var nav = document.getElementById("nav");

  function closeMenu() {
    if (!nav || !menuBtn) return;
    nav.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.setAttribute("aria-label", "Abrir menú");
  }

  if (menuBtn && nav) {
    menuBtn.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", String(open));
      menuBtn.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    });
    nav.addEventListener("click", function (e) { if (e.target.tagName === "A") closeMenu(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeMenu(); });
  }

  /* ---------- Efecto de tipeo en el título ---------- */
  var typedEl = document.getElementById("typed");
  var PHRASES = [
    "desarrollador full-stack.",
    "estudiante de Ingeniería en Sistemas."
  ];

  if (typedEl) {
    if (reduceMotion) {
      typedEl.textContent = PHRASES[0];
    } else {
      var pi = 0, ci = 0, deleting = false;
      (function tick() {
        var phrase = PHRASES[pi];
        ci += deleting ? -1 : 1;
        typedEl.textContent = phrase.slice(0, ci);

        var delay = deleting ? 32 : 62;
        if (!deleting && ci === phrase.length) { delay = 2200; deleting = true; }
        else if (deleting && ci === 0) { deleting = false; pi = (pi + 1) % PHRASES.length; delay = 380; }

        setTimeout(tick, delay);
      })();
    }
  }

  /* ---------- Parallax: halos de fondo y mockups ---------- */
  var parallaxItems = [];
  document.querySelectorAll(".glow[data-speed]").forEach(function (el) {
    parallaxItems.push({ el: el, speed: parseFloat(el.dataset.speed) || 0, base: 0 });
  });
  document.querySelectorAll("[data-parallax]").forEach(function (el) {
    parallaxItems.push({ el: el, speed: parseFloat(el.dataset.parallax) || 0, centered: true });
  });

  var header = document.getElementById("header");
  var ticking = false;

  function frame() {
    ticking = false;
    var y = window.scrollY;
    var vh = window.innerHeight;

    if (header) header.classList.toggle("scrolled", y > 8);

    if (reduceMotion) return;

    for (var i = 0; i < parallaxItems.length; i++) {
      var item = parallaxItems[i];
      var offset;
      if (item.centered) {
        // desplazamiento relativo a la posición del elemento en pantalla
        var rect = item.el.getBoundingClientRect();
        offset = (rect.top + rect.height / 2 - vh / 2) * item.speed;
      } else {
        offset = y * item.speed;
      }
      item.el.style.transform = "translate3d(0," + offset.toFixed(1) + "px,0)";
    }
  }

  function onScroll() {
    if (!ticking) { ticking = true; window.requestAnimationFrame(frame); }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  frame();

  /* ---------- Apariciones al entrar en pantalla ---------- */
  var reveals = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window) || reduceMotion) {
    reveals.forEach(function (el) { el.classList.add("visible"); });
  } else {
    var io = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry, i) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        setTimeout(function () { el.classList.add("visible"); }, Math.min(i, 4) * 90);
        observer.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -60px 0px" });

    reveals.forEach(function (el) { io.observe(el); });

    // Red de seguridad: si algo no se observó, se muestra igual
    setTimeout(function () {
      document.querySelectorAll(".reveal:not(.visible)").forEach(function (el) {
        if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add("visible");
      });
    }, 1400);
  }

  /* ---------- Sección activa en la navegación ---------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav a"));
  var sections = navLinks
    .map(function (a) { return document.querySelector(a.getAttribute("href")); })
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (link) {
          link.classList.toggle("active", link.getAttribute("href") === "#" + entry.target.id);
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
    sections.forEach(function (s) { spy.observe(s); });
  }

  var finePointer = window.matchMedia("(pointer: fine)").matches;

  /* ---------- El memoji sigue al mouse por toda la pantalla ---------- */
  var tilt = document.querySelector("[data-tilt]");
  if (tilt && !reduceMotion && finePointer) {
    window.addEventListener("mousemove", function (e) {
      var rect = tilt.getBoundingClientRect();
      var dx = (e.clientX - (rect.left + rect.width / 2)) / window.innerWidth;
      var dy = (e.clientY - (rect.top + rect.height / 2)) / window.innerHeight;
      tilt.style.transform =
        "perspective(700px) translate3d(" + (dx * 14).toFixed(1) + "px," + (dy * 10).toFixed(1) + "px,0)" +
        " rotateY(" + (dx * 12).toFixed(1) + "deg) rotateX(" + (-dy * 10).toFixed(1) + "deg)";
    }, { passive: true });
  }

  /* ---------- Capturas: inclinación 3D siguiendo el cursor ---------- */
  if (!reduceMotion && finePointer) {
    document.querySelectorAll("[data-tilt3d]").forEach(function (card) {
      var raf = null, tx = 0, ty = 0;

      function apply() {
        raf = null;
        card.style.transform =
          "perspective(1100px) rotateX(" + ty.toFixed(2) + "deg) rotateY(" + tx.toFixed(2) + "deg) scale(1.025)";
      }

      card.addEventListener("mousemove", function (e) {
        var r = card.getBoundingClientRect();
        tx = ((e.clientX - r.left) / r.width - 0.5) * 12;   // izquierda/derecha
        ty = (0.5 - (e.clientY - r.top) / r.height) * 8;    // arriba/abajo
        if (!raf) raf = window.requestAnimationFrame(apply);
      }, { passive: true });

      card.addEventListener("mouseleave", function () {
        if (raf) { window.cancelAnimationFrame(raf); raf = null; }
        card.style.transform = "";
      });
    });
  }

  /* ---------- Copiar dirección de mail ---------- */
  var copyBtn = document.getElementById("copy-mail");
  if (copyBtn) {
    copyBtn.addEventListener("click", function () {
      var mail = copyBtn.dataset.mail;
      var label = copyBtn.querySelector(".copy-label");
      var original = label.textContent;

      function done(ok) {
        label.textContent = ok ? "¡copiado!" : mail;
        setTimeout(function () { label.textContent = original; }, 2400);
      }

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(mail).then(function () { done(true); }, function () { done(false); });
      } else {
        var ta = document.createElement("textarea");
        ta.value = mail; ta.setAttribute("readonly", "");
        ta.style.position = "absolute"; ta.style.left = "-9999px";
        document.body.appendChild(ta); ta.select();
        var ok = false;
        try { ok = document.execCommand("copy"); } catch (err) { ok = false; }
        document.body.removeChild(ta);
        done(ok);
      }
    });
  }

  /* ---------- Año del footer ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
