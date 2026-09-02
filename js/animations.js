/* Per-project mini animations. Each takes a <canvas> (or element) and
   returns a stop() function. Driven by IntersectionObserver so nothing
   runs off-screen, and skipped entirely under prefers-reduced-motion. */

(function () {
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var ACCENT = "#3ddc84";
  var DIM = "#2a323c";
  var TEXT = "#9aa4af";

  function dpr(canvas) {
    var ratio = window.devicePixelRatio || 1;
    var w = canvas.clientWidth || parseInt(canvas.getAttribute("width"), 10);
    var h = canvas.clientHeight || parseInt(canvas.getAttribute("height"), 10);
    canvas.width = w * ratio;
    canvas.height = h * ratio;
    var ctx = canvas.getContext("2d");
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    return { ctx: ctx, w: w, h: h };
  }

  /* ---------------- Tic-Tac-Toe minimax ---------------- */
  function initTicTacToe(canvas) {
    var d = dpr(canvas), ctx = d.ctx, w = d.w, h = d.h;
    var cell = Math.min(w, h) / 3;
    var ox = (w - cell * 3) / 2, oy = (h - cell * 3) / 2;
    var sequence = ["X", "O", "X", "O", "X", "O", "X"];
    var cells = [4, 0, 8, 2, 6, 1, 5];
    var frame = 0, step = -1, showTree = false, raf;

    function drawBoard() {
      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = DIM;
      ctx.lineWidth = 2;
      for (var i = 1; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(ox + i * cell, oy);
        ctx.lineTo(ox + i * cell, oy + cell * 3);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(ox, oy + i * cell);
        ctx.lineTo(ox + cell * 3, oy + i * cell);
        ctx.stroke();
      }
    }

    function drawMark(idx, mark, alpha) {
      var r = idx % 3, c = Math.floor(idx / 3);
      var cx = ox + r * cell + cell / 2;
      var cy = oy + c * cell + cell / 2;
      var s = cell * 0.28;
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = mark === "X" ? ACCENT : TEXT;
      ctx.lineWidth = 3;
      if (mark === "X") {
        ctx.beginPath(); ctx.moveTo(cx - s, cy - s); ctx.lineTo(cx + s, cy + s); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cx + s, cy - s); ctx.lineTo(cx - s, cy + s); ctx.stroke();
      } else {
        ctx.beginPath(); ctx.arc(cx, cy, s, 0, Math.PI * 2); ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }

    function drawTree(alpha) {
      ctx.globalAlpha = alpha * 0.5;
      ctx.strokeStyle = ACCENT;
      ctx.lineWidth = 1;
      var topY = Math.max(4, oy - 30);
      var baseX = w / 2;
      for (var i = -3; i <= 3; i++) {
        ctx.beginPath();
        ctx.moveTo(baseX, topY);
        ctx.lineTo(baseX + i * 16, topY + 22);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }

    function tick() {
      frame++;
      if (frame % 45 === 0) {
        step++;
        showTree = true;
        if (step >= sequence.length) {
          step = -1;
          frame = 0;
        }
      }
      if (frame % 45 === 25) showTree = false;

      drawBoard();
      for (var i = 0; i <= step && i < cells.length; i++) {
        drawMark(cells[i], sequence[i], 1);
      }
      if (showTree && step >= 0 && step < cells.length) drawTree(1);
      raf = requestAnimationFrame(tick);
    }

    if (reduced) {
      drawBoard();
      for (var i = 0; i < cells.length; i++) drawMark(cells[i], sequence[i], 1);
      return function () {};
    }
    tick();
    return function () { cancelAnimationFrame(raf); };
  }

  /* ---------------- Adder bit propagation (ripple vs lookahead) ---------------- */
  function initAdder(canvas, mode) {
    var d = dpr(canvas), ctx = d.ctx, w = d.w, h = d.h;
    var n = 8;
    var pad = 20;
    var boxW = (w - pad * 2) / n;
    var y = h / 2;
    var frame = 0, raf;

    function drawBlocks() {
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < n; i++) {
        var x = pad + i * boxW;
        ctx.strokeStyle = DIM;
        ctx.lineWidth = 1.5;
        ctx.strokeRect(x + 4, y - 18, boxW - 8, 36);
      }
    }

    function activeIndex(t) {
      if (mode === "ripple") {
        return Math.floor(t % (n + 3));
      }
      return null;
    }

    function tick() {
      frame++;
      var t = frame / 20;
      drawBlocks();

      if (mode === "ripple") {
        var idx = activeIndex(t);
        for (var i = 0; i < n; i++) {
          if (i <= idx && i < n) {
            var x = pad + i * boxW + boxW / 2;
            var glow = i === idx ? 1 : 0.25;
            ctx.globalAlpha = glow;
            ctx.fillStyle = ACCENT;
            ctx.beginPath();
            ctx.arc(x, y, 6, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
          }
        }
      } else {
        var cycle = t % 6;
        var lit = cycle < 4;
        for (var j = 0; j < n; j++) {
          var xx = pad + j * boxW + boxW / 2;
          ctx.globalAlpha = lit ? 1 : 0.15;
          ctx.fillStyle = ACCENT;
          ctx.beginPath();
          ctx.arc(xx, y, 6, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1;
        }
      }
      raf = requestAnimationFrame(tick);
    }

    if (reduced) { drawBlocks(); return function () {}; }
    tick();
    return function () { cancelAnimationFrame(raf); };
  }

  /* ---------------- Warehouse multi-hop robots ---------------- */
  function initWarehouse(canvas) {
    var d = dpr(canvas), ctx = d.ctx, w = d.w, h = d.h;
    var midX = w / 2;
    var robots = [
      { region: 0, x: w * 0.2, y: h * 0.3, t: 0, speed: 0.02 },
      { region: 0, x: w * 0.3, y: h * 0.7, t: 2, speed: 0.017 },
      { region: 1, x: w * 0.7, y: h * 0.5, t: 1, speed: 0.019 }
    ];
    var pkg = { x: midX, y: h * 0.5, active: false, from: 0, to: 0, t: 0 };
    var frame = 0, raf;

    function drawRegions() {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "rgba(61,220,132,0.05)";
      ctx.fillRect(0, 0, midX, h);
      ctx.fillStyle = "rgba(255,180,84,0.05)";
      ctx.fillRect(midX, 0, w - midX, h);
      ctx.strokeStyle = DIM;
      ctx.setLineDash([4, 6]);
      ctx.beginPath();
      ctx.moveTo(midX, 0);
      ctx.lineTo(midX, h);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    function tick() {
      frame++;
      drawRegions();

      robots.forEach(function (r, i) {
        r.t += r.speed;
        var rangeX = r.region === 0 ? [20, midX - 20] : [midX + 20, w - 20];
        var cx = rangeX[0] + (rangeX[1] - rangeX[0]) * (0.5 + 0.5 * Math.sin(r.t + i));
        var cy = h * 0.2 + (h * 0.6) * (0.5 + 0.5 * Math.cos(r.t * 1.3 + i));
        r.x = cx; r.y = cy;
        ctx.fillStyle = TEXT;
        ctx.beginPath();
        ctx.arc(cx, cy, 7, 0, Math.PI * 2);
        ctx.fill();
      });

      if (frame % 260 === 0) {
        pkg.active = true;
        pkg.t = 0;
      }
      if (pkg.active) {
        pkg.t += 0.03;
        var y2 = h * 0.5 + Math.sin(pkg.t * 6) * 8;
        ctx.fillStyle = ACCENT;
        ctx.fillRect(midX - 6, y2 - 6, 12, 12);
        if (pkg.t >= 1) pkg.active = false;
      }

      raf = requestAnimationFrame(tick);
    }

    if (reduced) { drawRegions(); return function () {}; }
    tick();
    return function () { cancelAnimationFrame(raf); };
  }

  /* ---------------- Self-balancing robot (inverted pendulum) ---------------- */
  function initPendulum(canvas) {
    var d = dpr(canvas), ctx = d.ctx, w = d.w, h = d.h;
    var groundY = h * 0.75;
    var cartX = w / 2;
    var angle = 0.25, angVel = 0, frame = 0, raf, kick = 0;

    function tick() {
      frame++;
      if (frame % 130 === 0) angVel += (Math.random() - 0.5) * 0.12;

      var accel = -0.9 * Math.sin(angle) - 0.12 * angVel;
      angVel += accel * 0.02;
      angle += angVel * 0.02;

      var cartOffset = Math.sin(angle) * 18;

      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = DIM;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(20, groundY);
      ctx.lineTo(w - 20, groundY);
      ctx.stroke();

      var cx = cartX + cartOffset;
      ctx.fillStyle = TEXT;
      ctx.fillRect(cx - 26, groundY - 12, 52, 20);

      var poleLen = h * 0.32;
      var tipX = cx + Math.sin(angle) * poleLen;
      var tipY = groundY - 12 - Math.cos(angle) * poleLen;
      ctx.strokeStyle = ACCENT;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(cx, groundY - 12);
      ctx.lineTo(tipX, tipY);
      ctx.stroke();
      ctx.fillStyle = ACCENT;
      ctx.beginPath();
      ctx.arc(tipX, tipY, 6, 0, Math.PI * 2);
      ctx.fill();

      raf = requestAnimationFrame(tick);
    }

    if (reduced) {
      ctx.strokeStyle = DIM;
      ctx.beginPath(); ctx.moveTo(20, groundY); ctx.lineTo(w - 20, groundY); ctx.stroke();
      return function () {};
    }
    tick();
    return function () { cancelAnimationFrame(raf); };
  }

  /* ---------------- MQTT node graph ---------------- */
  function initMqtt(canvas) {
    var d = dpr(canvas), ctx = d.ctx, w = d.w, h = d.h;
    var broker = { x: w / 2, y: h / 2 };
    var nodes = [
      { x: w * 0.15, y: h * 0.2 },
      { x: w * 0.85, y: h * 0.2 },
      { x: w * 0.15, y: h * 0.8 },
      { x: w * 0.85, y: h * 0.8 }
    ];
    var frame = 0, raf;

    function draw() {
      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = DIM;
      ctx.lineWidth = 1.5;
      nodes.forEach(function (n) {
        ctx.beginPath();
        ctx.moveTo(broker.x, broker.y);
        ctx.lineTo(n.x, n.y);
        ctx.stroke();
      });

      ctx.fillStyle = ACCENT;
      ctx.beginPath();
      ctx.arc(broker.x, broker.y, 10, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = TEXT;
      nodes.forEach(function (n) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, 6, 0, Math.PI * 2);
        ctx.fill();
      });

      var cycle = frame % 100;
      var idx = Math.floor(frame / 100) % nodes.length;
      var n = nodes[idx];
      var t = cycle / 100;
      var px = n.x + (broker.x - n.x) * t;
      var py = n.y + (broker.y - n.y) * t;
      ctx.fillStyle = ACCENT;
      ctx.beginPath();
      ctx.arc(px, py, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    function tick() {
      frame++;
      draw();
      raf = requestAnimationFrame(tick);
    }

    if (reduced) { draw(); return function () {}; }
    tick();
    return function () { cancelAnimationFrame(raf); };
  }

  /* ---------------- Cipher scramble (DOM text, not canvas) ---------------- */
  function initCipher(el) {
    var original = el.textContent;
    var chars = "!<>-_\\/[]{}@#$%^&*()";
    var frame = 0, raf, phase = 0;

    function scrambled(revealCount) {
      var out = "";
      for (var i = 0; i < original.length; i++) {
        if (original[i] === " " || i < revealCount) {
          out += original[i];
        } else {
          out += chars[Math.floor(Math.random() * chars.length)];
        }
      }
      return out;
    }

    function tick() {
      frame++;
      var cycle = frame % 180;
      if (cycle < 60) {
        el.textContent = scrambled(0);
      } else if (cycle < 120) {
        var revealCount = Math.floor(((cycle - 60) / 60) * original.length);
        el.textContent = scrambled(revealCount);
      } else {
        el.textContent = original;
      }
      raf = requestAnimationFrame(tick);
    }

    if (reduced) { el.textContent = original; return function () {}; }
    tick();
    return function () { cancelAnimationFrame(raf); el.textContent = original; };
  }

  /* ---------------- Braille dot morph ---------------- */
  function initBraille(canvas) {
    var d = dpr(canvas), ctx = d.ctx, w = d.w, h = d.h;
    var letters = {
      a: [1, 0, 0, 0, 0, 0],
      b: [1, 1, 0, 0, 0, 0],
      c: [1, 0, 1, 0, 0, 0]
    };
    var order = ["a", "b", "c"];
    var frame = 0, raf;
    var r = Math.min(w, h) * 0.09;
    var gx = w / 2 - r * 1.6, gy = h / 2 - r * 2.4;

    function draw(letterIdx, alpha) {
      ctx.clearRect(0, 0, w, h);
      var dots = letters[order[letterIdx]];
      var positions = [
        [gx, gy], [gx + r * 3.2, gy],
        [gx, gy + r * 2.4], [gx + r * 3.2, gy + r * 2.4],
        [gx, gy + r * 4.8], [gx + r * 3.2, gy + r * 4.8]
      ];
      positions.forEach(function (p, i) {
        ctx.beginPath();
        ctx.arc(p[0], p[1], r, 0, Math.PI * 2);
        ctx.strokeStyle = DIM;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        if (dots[i]) {
          ctx.globalAlpha = alpha;
          ctx.fillStyle = ACCENT;
          ctx.fill();
          ctx.globalAlpha = 1;
        }
      });
      ctx.fillStyle = TEXT;
      ctx.font = "600 " + Math.round(r * 1.6) + "px monospace";
      ctx.textAlign = "center";
      ctx.globalAlpha = alpha;
      ctx.fillText(order[letterIdx].toUpperCase(), w / 2, gy + r * 7.6);
      ctx.globalAlpha = 1;
    }

    function tick() {
      frame++;
      var cycle = frame % 150;
      var idx = Math.floor(frame / 150) % order.length;
      var alpha = cycle < 30 ? cycle / 30 : 1;
      draw(idx, alpha);
      raf = requestAnimationFrame(tick);
    }

    if (reduced) { draw(0, 1); return function () {}; }
    tick();
    return function () { cancelAnimationFrame(raf); };
  }

  /* ---------------- Feature extraction scan ---------------- */
  function initFeatureScan(canvas) {
    var d = dpr(canvas), ctx = d.ctx, w = d.w, h = d.h;
    var points = [
      { x: w * 0.3, y: h * 0.35 },
      { x: w * 0.55, y: h * 0.5 },
      { x: w * 0.7, y: h * 0.28 },
      { x: w * 0.4, y: h * 0.65 },
      { x: w * 0.62, y: h * 0.72 }
    ];
    var frame = 0, raf;

    function draw() {
      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = DIM;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(w * 0.12, h * 0.12, w * 0.76, h * 0.76);

      var scanX = w * 0.12 + (w * 0.76) * ((frame % 120) / 120);
      ctx.strokeStyle = ACCENT;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(scanX, h * 0.12);
      ctx.lineTo(scanX, h * 0.88);
      ctx.stroke();

      points.forEach(function (p) {
        var hit = Math.abs(p.x - scanX) < 6;
        ctx.beginPath();
        ctx.arc(p.x, p.y, hit ? 6 : 4, 0, Math.PI * 2);
        ctx.fillStyle = hit || p.x < scanX ? ACCENT : DIM;
        ctx.fill();
      });

      raf = requestAnimationFrame(tick);
    }

    function tick() {
      frame++;
      draw();
    }

    if (reduced) { draw(); return function () {}; }
    tick();
    return function () { cancelAnimationFrame(raf); };
  }

  /* ---------------- Arduino 2D printer (snake-pattern plot) ---------------- */
  function initPlotter(canvas) {
    var d = dpr(canvas), ctx = d.ctx, w = d.w, h = d.h;
    var cols = 12, rows = 10;
    var pad = 16;
    var cellW = (w - pad * 2) / cols;
    var cellH = (h - pad * 2) / rows;

    var pattern = [];
    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        var cx = c - cols / 2 + 0.5, cy = r - rows / 2 + 0.5;
        pattern.push(Math.sqrt(cx * cx * 2.2 + cy * cy * 2.2) < rows / 2.1 ? 1 : 0);
      }
    }

    function order() {
      var seq = [];
      for (var r = 0; r < rows; r++) {
        if (r % 2 === 0) {
          for (var c = 0; c < cols; c++) seq.push(r * cols + c);
        } else {
          for (var c = cols - 1; c >= 0; c--) seq.push(r * cols + c);
        }
      }
      return seq;
    }
    var seq = order();
    var frame = 0, raf, pos = 0;

    function cellCenter(idx) {
      var r = Math.floor(idx / cols), c = idx % cols;
      return [pad + c * cellW + cellW / 2, pad + r * cellH + cellH / 2];
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = DIM;
      ctx.lineWidth = 1;
      for (var i = 0; i <= cols; i++) {
        ctx.beginPath();
        ctx.moveTo(pad + i * cellW, pad);
        ctx.lineTo(pad + i * cellW, pad + rows * cellH);
        ctx.stroke();
      }
      for (var j = 0; j <= rows; j++) {
        ctx.beginPath();
        ctx.moveTo(pad, pad + j * cellH);
        ctx.lineTo(pad + cols * cellW, pad + j * cellH);
        ctx.stroke();
      }

      for (var k = 0; k < pos && k < seq.length; k++) {
        var idx = seq[k];
        if (!pattern[idx]) continue;
        var p = cellCenter(idx);
        ctx.fillStyle = ACCENT;
        ctx.beginPath();
        ctx.arc(p[0], p[1], Math.min(cellW, cellH) * 0.28, 0, Math.PI * 2);
        ctx.fill();
      }

      if (pos < seq.length) {
        var head = cellCenter(seq[pos]);
        ctx.strokeStyle = TEXT;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(head[0], head[1], Math.min(cellW, cellH) * 0.42, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    function tick() {
      frame++;
      if (frame % 3 === 0) {
        pos++;
        if (pos > seq.length + 20) pos = 0;
      }
      draw();
      raf = requestAnimationFrame(tick);
    }

    if (reduced) { pos = seq.length; draw(); return function () {}; }
    tick();
    return function () { cancelAnimationFrame(raf); };
  }

  /* ---------------- Audio player waveform ---------------- */
  function initWaveform(canvas) {
    var d = dpr(canvas), ctx = d.ctx, w = d.w, h = d.h;
    var bars = 24;
    var gap = 4;
    var barW = (w - gap * (bars - 1)) / bars;
    var seeds = [];
    for (var i = 0; i < bars; i++) seeds.push(Math.random() * 10);
    var frame = 0, raf;

    function draw() {
      ctx.clearRect(0, 0, w, h);
      var mid = h / 2;
      for (var i = 0; i < bars; i++) {
        var t = frame / 12 + seeds[i];
        var amp = (0.35 + 0.65 * Math.abs(Math.sin(t) * Math.cos(t * 0.6))) * (h * 0.42);
        var x = i * (barW + gap);
        ctx.fillStyle = i % 4 === 0 ? ACCENT : TEXT;
        ctx.globalAlpha = i % 4 === 0 ? 1 : 0.55;
        ctx.fillRect(x, mid - amp / 2, barW, amp);
        ctx.globalAlpha = 1;
      }
    }

    function tick() {
      frame++;
      draw();
      raf = requestAnimationFrame(tick);
    }

    if (reduced) { draw(); return function () {}; }
    tick();
    return function () { cancelAnimationFrame(raf); };
  }

  /* ---------------- Boolean binary tree build ---------------- */
  function initTree(canvas) {
    var d = dpr(canvas), ctx = d.ctx, w = d.w, h = d.h;
    var depth = 4;
    var levelH = (h - 40) / depth;
    var frame = 0, raf;

    function nodesAtLevel(level) {
      var count = Math.pow(2, level);
      var out = [];
      for (var i = 0; i < count; i++) {
        var x = w * ((i + 0.5) / count);
        var y = 24 + level * levelH;
        out.push([x, y]);
      }
      return out;
    }

    function draw(revealLevels, alpha) {
      ctx.clearRect(0, 0, w, h);
      for (var lvl = 0; lvl < depth; lvl++) {
        if (lvl > revealLevels) break;
        var parents = nodesAtLevel(lvl);
        var children = nodesAtLevel(lvl + 1);
        var localAlpha = lvl === revealLevels ? alpha : 1;
        ctx.globalAlpha = localAlpha;
        ctx.strokeStyle = DIM;
        ctx.lineWidth = 1.5;
        parents.forEach(function (p, i) {
          var left = children[i * 2], right = children[i * 2 + 1];
          [left, right].forEach(function (c) {
            ctx.beginPath();
            ctx.moveTo(p[0], p[1]);
            ctx.lineTo(c[0], c[1]);
            ctx.stroke();
          });
        });
        ctx.globalAlpha = 1;
      }

      for (var lvl2 = 0; lvl2 <= Math.min(revealLevels, depth); lvl2++) {
        var pts = nodesAtLevel(lvl2);
        var a = lvl2 === revealLevels ? alpha : 1;
        ctx.globalAlpha = a;
        pts.forEach(function (p) {
          ctx.beginPath();
          ctx.arc(p[0], p[1], lvl2 === 0 ? 7 : 5, 0, Math.PI * 2);
          ctx.fillStyle = lvl2 === revealLevels ? ACCENT : TEXT;
          ctx.fill();
        });
        ctx.globalAlpha = 1;
      }
    }

    function tick() {
      frame++;
      var cycle = frame % (depth * 40 + 40);
      var lvl = Math.min(depth, Math.floor(cycle / 40));
      var alpha = Math.min(1, (cycle % 40) / 24);
      if (cycle >= depth * 40) {
        draw(depth, 1);
      } else {
        draw(lvl, alpha);
      }
      raf = requestAnimationFrame(tick);
    }

    if (reduced) { draw(depth, 1); return function () {}; }
    tick();
    return function () { cancelAnimationFrame(raf); };
  }

  /* ---------------- Neural net forward pass (MLP on FPGA) ---------------- */
  function initNeuralNet(canvas) {
    var d = dpr(canvas), ctx = d.ctx, w = d.w, h = d.h;
    var layers = [5, 4, 3];
    var padX = 36, padY = 18;
    var winner = 1;
    var frame = 0, raf;

    function nodePos(li, ni) {
      var count = layers[li];
      var x = padX + li * (w - padX * 2) / (layers.length - 1);
      var gap = (h - padY * 2) / (count - 1 || 1);
      var y = count === 1 ? h / 2 : padY + ni * gap;
      return [x, y];
    }

    function drawEdges() {
      ctx.strokeStyle = DIM;
      ctx.lineWidth = 1;
      for (var li = 0; li < layers.length - 1; li++) {
        for (var i = 0; i < layers[li]; i++) {
          for (var j = 0; j < layers[li + 1]; j++) {
            var p1 = nodePos(li, i), p2 = nodePos(li + 1, j);
            ctx.beginPath();
            ctx.moveTo(p1[0], p1[1]);
            ctx.lineTo(p2[0], p2[1]);
            ctx.stroke();
          }
        }
      }
    }

    function drawNodes(activeLayer) {
      for (var li = 0; li < layers.length; li++) {
        var isOutput = li === layers.length - 1;
        for (var i = 0; i < layers[li]; i++) {
          var p = nodePos(li, i);
          ctx.beginPath();
          ctx.arc(p[0], p[1], isOutput ? 7 : 5.5, 0, Math.PI * 2);
          if (isOutput && activeLayer >= layers.length - 1 && i === winner) {
            ctx.fillStyle = ACCENT;
          } else if (li <= activeLayer) {
            ctx.fillStyle = TEXT;
          } else {
            ctx.fillStyle = DIM;
          }
          ctx.fill();
        }
      }
    }

    function drawPulses(li, t) {
      for (var i = 0; i < layers[li]; i++) {
        for (var j = 0; j < layers[li + 1]; j++) {
          var p1 = nodePos(li, i), p2 = nodePos(li + 1, j);
          ctx.beginPath();
          ctx.arc(p1[0] + (p2[0] - p1[0]) * t, p1[1] + (p2[1] - p1[1]) * t, 2.5, 0, Math.PI * 2);
          ctx.globalAlpha = 0.85;
          ctx.fillStyle = ACCENT;
          ctx.fill();
          ctx.globalAlpha = 1;
        }
      }
    }

    function tick() {
      frame++;
      var segFrames = 46;
      var segs = layers.length - 1;
      var holdFrames = 36;
      var cycle = segFrames * segs + holdFrames;
      var c = frame % cycle;

      ctx.clearRect(0, 0, w, h);
      drawEdges();

      if (c < segFrames * segs) {
        var seg = Math.floor(c / segFrames);
        var t = (c % segFrames) / segFrames;
        drawNodes(seg);
        drawPulses(seg, t);
      } else {
        drawNodes(layers.length - 1);
      }

      raf = requestAnimationFrame(tick);
    }

    if (reduced) { drawEdges(); drawNodes(layers.length - 1); return function () {}; }
    tick();
    return function () { cancelAnimationFrame(raf); };
  }

  var registry = {
    tictactoe: function (el) { return initTicTacToe(el); },
    "adder-ripple": function (el) { return initAdder(el, "ripple"); },
    "adder-lookahead": function (el) { return initAdder(el, "lookahead"); },
    warehouse: function (el) { return initWarehouse(el); },
    pendulum: function (el) { return initPendulum(el); },
    mqtt: function (el) { return initMqtt(el); },
    cipher: function (el) { return initCipher(el); },
    braille: function (el) { return initBraille(el); },
    feature: function (el) { return initFeatureScan(el); },
    plotter: function (el) { return initPlotter(el); },
    neural: function (el) { return initNeuralNet(el); },
    waveform: function (el) { return initWaveform(el); },
    tree: function (el) { return initTree(el); }
  };

  function boot() {
    var els = document.querySelectorAll("[data-anim]");
    if (!els.length) return;

    if (!("IntersectionObserver" in window)) {
      els.forEach(function (el) {
        var fn = registry[el.getAttribute("data-anim")];
        if (fn) fn(el);
      });
      return;
    }

    var running = new Map();
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var el = entry.target;
          var name = el.getAttribute("data-anim");
          var fn = registry[name];
          if (!fn) return;
          if (entry.isIntersecting) {
            if (!running.has(el)) {
              running.set(el, fn(el));
            }
          } else {
            var stop = running.get(el);
            if (stop) {
              stop();
              running.delete(el);
            }
          }
        });
      },
      { threshold: 0.2 }
    );

    els.forEach(function (el) { io.observe(el); });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
