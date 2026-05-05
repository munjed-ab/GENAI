// ================================================
// PARTICLES — animated canvas background for hero
// ================================================
(function initParticles() {
  var canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var W, H, particles;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function Particle() {
    this.reset();
  }

  Particle.prototype.reset = function () {
    this.x     = Math.random() * W;
    this.y     = Math.random() * H;
    this.r     = Math.random() * 3.5 + 1;
    this.dx    = (Math.random() - 0.5) * 0.55;
    this.dy    = (Math.random() - 0.5) * 0.55;
    this.color = Math.random() > 0.5 ? '#00c896' : '#ff6b35';
    this.alpha = Math.random() * 0.45 + 0.12;
  };

  Particle.prototype.update = function () {
    this.x += this.dx;
    this.y += this.dy;
    if (this.x < -10 || this.x > W + 10) this.dx *= -1;
    if (this.y < -10 || this.y > H + 10) this.dy *= -1;
  };

  Particle.prototype.draw = function () {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle   = this.color;
    ctx.globalAlpha = this.alpha;
    ctx.fill();
    ctx.globalAlpha = 1;
  };

  function init() {
    resize();
    particles = Array.from({ length: 55 }, function () { return new Particle(); });
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(function (p) { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }

  window.addEventListener('resize', resize);
  init();
  loop();
}());

// ================================================
// SCROLL REVEAL — fade + slide elements into view
// ================================================
(function initReveal() {
  var targets = document.querySelectorAll(
    '.card, .tool-card, .verdict-list li, .flow-step, ' +
    '.split-layout, .gallery-item, .video-showcase, ' +
    '.video-placeholder-wrap, h2, .section-note'
  );

  targets.forEach(function (el) { el.classList.add('reveal'); });

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  targets.forEach(function (el) { observer.observe(el); });
}());

// ================================================
// NAV ACTIVE SECTION — highlight link of current section
// ================================================
(function initNavHighlight() {
  var sections  = document.querySelectorAll('section[id]');
  var navLinks  = document.querySelectorAll('.nav-links a[data-section]');

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var id = entry.target.id;
        navLinks.forEach(function (link) {
          link.classList.toggle('active', link.dataset.section === id);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(function (s) { observer.observe(s); });
}());
