
(function initNeuralNodes() {
  var canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  var ctx    = canvas.getContext('2d');
  var W, H, nodes = [];
  var LIFETIME = 2500;  // ms until node fully fades
  var STEP = 20;    // min px movement to spawn new node
  var CONNECT = 150;   // max px distance to draw a connection
  var MAX_NODES = 130;   // hard cap
  var lastX = -999, lastY = -999;
  var PALETTE = ['#1a1a2e', '#1f1f5f', '#1a1a2e', '#00c896', '#ff6b35'];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function spawn(x, y) {
    nodes.push({
      x:     x,
      y:     y,
      size:  (Math.random() * 5 | 0) + 10,
      color: PALETTE[Math.random() * PALETTE.length | 0],
      born:  performance.now()
    });
    if (nodes.length > MAX_NODES) nodes.shift();
  }

  function loop(now) {
    ctx.clearRect(0, 0, W, H);

    // drop expired nodes
    nodes = nodes.filter(function (n) { return now - n.born < LIFETIME; });

    // draw connections first (under nodes)
    ctx.lineWidth = 1;
    for (var i = 0; i < nodes.length; i++) {
      for (var j = i + 1; j < nodes.length; j++) {
        var dx = nodes[i].x - nodes[j].x;
        var dy = nodes[i].y - nodes[j].y;
        var d  = Math.sqrt(dx * dx + dy * dy);
        if (d < CONNECT) {
          var ageI  = (now - nodes[i].born) / LIFETIME;
          var ageJ  = (now - nodes[j].born) / LIFETIME;
          var alpha = (1 - Math.max(ageI, ageJ)) * (1 - d / CONNECT) * 0.6;
          ctx.globalAlpha = alpha;
          ctx.strokeStyle = '#1a1a2e';
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }

    // draw brutalist square nodes on top
    ctx.lineWidth = 1.8;
    nodes.forEach(function (n) {
      var age   = (now - n.born) / LIFETIME;
      var alpha = (1 - age) * 0.85;
      var h     = n.size / 2;
      ctx.globalAlpha = alpha;
      ctx.strokeStyle  = n.color;
      ctx.strokeRect(n.x - h, n.y - h, n.size, n.size);
    });

    ctx.globalAlpha = 1;
    requestAnimationFrame(loop);
  }

  window.addEventListener('mousemove', function (e) {
    var r  = canvas.getBoundingClientRect();
    var x  = e.clientX - r.left;
    var y  = e.clientY - r.top;
    if (x < 0 || y < 0 || x > W || y > H) return;
    var dx = x - lastX, dy = y - lastY;
    if (Math.sqrt(dx * dx + dy * dy) < STEP) return;
    spawn(x, y);
    lastX = x; lastY = y;
  });

  window.addEventListener('resize', resize);
  resize();
  requestAnimationFrame(loop);
}());

// SCROLL REVEAL... fade + slide elements into view
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

// NAV ACTIVE SECTION
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
