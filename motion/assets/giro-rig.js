// Rig do Giro para o estudo. Cada transição existe em duas versões: "cur" reproduz o
// src/styles/giro.css de hoje (com os saltos) e "nov" é a proposta que vai virar CSS.
// Tudo é função do tempo da timeline: os laços contínuos são calculados por fórmula.
(function () {
  function bezier(x1, y1, x2, y2) {
    var cx = 3 * x1;
    var bx = 3 * (x2 - x1) - cx;
    var ax = 1 - cx - bx;
    var cy = 3 * y1;
    var by = 3 * (y2 - y1) - cy;
    var ay = 1 - cy - by;
    function sx(t) { return ((ax * t + bx) * t + cx) * t; }
    function sy(t) { return ((ay * t + by) * t + cy) * t; }
    function dx(t) { return (3 * ax * t + 2 * bx) * t + cx; }
    function solve(x) {
      var t = x;
      for (var i = 0; i < 8; i++) {
        var err = sx(t) - x;
        if (Math.abs(err) < 1e-6) return t;
        var d = dx(t);
        if (Math.abs(d) < 1e-6) break;
        t -= err / d;
      }
      var lo = 0;
      var hi = 1;
      t = x;
      for (var j = 0; j < 30; j++) {
        var v = sx(t);
        if (Math.abs(v - x) < 1e-6) return t;
        if (v < x) lo = t;
        else hi = t;
        t = (lo + hi) / 2;
      }
      return t;
    }
    return function (p) {
      if (p <= 0) return 0;
      if (p >= 1) return 1;
      return sy(solve(p));
    };
  }

  var E = {
    resolve: bezier(0.2, 0.8, 0.2, 1),
    hop: bezier(0.34, 1.56, 0.64, 1),
    turn: bezier(0.34, 1.3, 0.64, 1),
    inOut: bezier(0.45, 0, 0.55, 1),
    spinIn: bezier(0.5, 0, 0.7, 0.67),
    finish: bezier(0.25, 0.6, 0.3, 1),
    close: bezier(0.5, 0, 0.75, 0),
    easeInOut: bezier(0.42, 0, 0.58, 1),
    easeOut: bezier(0, 0, 0.58, 1),
    easeIn: bezier(0.42, 0, 1, 1),
    linear: function (p) { return p; },
  };

  var LIMA = "#d2ff4d";
  var CORAL = "#ff5c3d";
  var LEN = { happy: 23, sleep: 17, x: 18 };

  function lerp(a, b, k) { return a + (b - a) * k; }

  // Respiração e laços: 0 a 1 a 0 por período, com a curva aplicada em cada metade (como no CSS).
  function wave(e, period, ease) {
    var c = e % period;
    var h = period / 2;
    return c < h ? ease(c / h) : 1 - ease((c - h) / h);
  }

  function ft(tl, target, from, to, at) {
    to.immediateRender = false;
    return tl.fromTo(target, from, to, at);
  }

  // Encadeia passos de keyframe; cada passo leva sua própria curva, como animation-timing-function.
  function seq(tl, target, at, from, steps) {
    var prev = from;
    var t = at;
    steps.forEach(function (s) {
      var to = Object.assign({}, s.v, { duration: s.d, ease: s.e });
      ft(tl, target, Object.assign({}, prev), to, t);
      t += s.d;
      prev = Object.assign({}, prev, s.v);
    });
    return t;
  }

  function loop(tl, t0, t1, fn) {
    var p = { e: 0 };
    var d = Math.max(0.001, t1 - t0);
    tl.fromTo(
      p,
      { e: 0 },
      { e: d, duration: d, ease: "none", immediateRender: false, onUpdate: function () { fn(p.e); } },
      t0
    );
  }

  function create(svg, opts) {
    var o = Object.assign({ v: "nov", amp: 1, stroke: 12, face: 7, eye: 1 }, opts);
    var q = function (s) { return svg.querySelector(s); };
    var qa = function (s) { return Array.prototype.slice.call(svg.querySelectorAll(s)); };
    var P = {
      svg: svg,
      disc: q(".g-disc"),
      body: q(".g-body"),
      turn: q(".g-turn"),
      spin: q(".g-spin"),
      arc: q(".g-arc"),
      eyes: [q(".g-eye-l"), q(".g-eye-r")],
      lids: [q(".g-lid-l"), q(".g-lid-r")],
      happy: [q(".g-happy-l"), q(".g-happy-r")],
      x: qa(".g-x"),
      sleep: [q(".g-sleep-l"), q(".g-sleep-r")],
      z: q(".g-z"),
    };
    var nov = o.v === "nov";
    var bodyOrigin = nov ? "60 104" : "60 60";
    var r = { o: o, P: P, E: E, nov: nov, loadAt: null };

    function dash(a) { return a + " " + (277 - a); }

    function bodyRest() { return { x: 0, y: 0, scaleX: 1, scaleY: 1, rotation: 0, svgOrigin: bodyOrigin }; }

    function draw(tl, paths, len, at, dur, ease, delays) {
      paths.forEach(function (f, i) {
        var d = at + (delays ? delays[i] : i * 0.05);
        ft(tl, f, { opacity: 0 }, { opacity: 1, duration: 0.06, ease: "none" }, d);
        ft(tl, f, { attr: { "stroke-dashoffset": len } }, { attr: { "stroke-dashoffset": 0 }, duration: dur, ease: ease }, d);
      });
    }

    function undraw(tl, paths, len, at) {
      paths.forEach(function (f) {
        ft(tl, f, { opacity: 1 }, { opacity: 0, duration: 0.1, ease: "none" }, at);
        ft(tl, f, { attr: { "stroke-dashoffset": 0 } }, { attr: { "stroke-dashoffset": len }, duration: 0.12, ease: E.easeIn }, at);
      });
    }

    function fade(tl, paths, from, to, at) {
      ft(tl, paths, { opacity: from }, { opacity: to, duration: 0.15, ease: "none" }, at);
    }

    r.init = function (tl) {
      tl.set(svg, { color: LIMA }, 0);
      tl.set(P.disc, { opacity: 0 }, 0);
      tl.set(P.arc, { attr: { "stroke-dasharray": "240 37", "stroke-dashoffset": 0, "stroke-width": o.stroke } }, 0);
      tl.set(P.turn, { rotation: -21.5, svgOrigin: "60 60" }, 0);
      tl.set(P.spin, { rotation: 0, svgOrigin: "60 60" }, 0);
      tl.set(P.body, bodyRest(), 0);
      tl.set(P.eyes[0], { x: 0, y: 0, scaleX: o.eye, scaleY: o.eye, opacity: 1, svgOrigin: "46 54" }, 0);
      tl.set(P.eyes[1], { x: 0, y: 0, scaleX: o.eye, scaleY: o.eye, opacity: 1, svgOrigin: "74 54" }, 0);
      tl.set(P.lids[0], { scaleY: 1, svgOrigin: "46 54" }, 0);
      tl.set(P.lids[1], { scaleY: 1, svgOrigin: "74 54" }, 0);
      [["happy", P.happy], ["sleep", P.sleep], ["x", P.x]].forEach(function (pair) {
        var len = LEN[pair[0]];
        tl.set(pair[1], {
          opacity: 0,
          attr: {
            "stroke-width": o.face,
            "stroke-dasharray": nov ? len + " 60" : "none",
            "stroke-dashoffset": nov ? len : 0,
          },
        }, 0);
      });
      tl.set(P.z, { opacity: 0, x: 0, y: 0 }, 0);
    };

    // Repouso. Atual: escala 1,03 pelo centro em 3 s. Proposto: mais alto e estreito, apoiado na base.
    r.idle = function (tl, t0, t1) {
      loop(tl, t0, t1, function (e) {
        if (nov) {
          var k = wave(e, 3.4, E.easeInOut);
          gsap.set(P.body, { scaleX: 1 - 0.012 * k, scaleY: 1 + 0.03 * k, svgOrigin: bodyOrigin });
        } else {
          var c = wave(e, 3, E.easeInOut);
          gsap.set(P.body, { scale: 1 + 0.03 * c, svgOrigin: bodyOrigin });
        }
      });
    };

    // Piscada. Atual: os dois olhos juntos, linear. Proposto: o direito 40 ms depois.
    r.blink = function (tl, t) {
      if (!nov) {
        ft(tl, P.lids, { scaleY: 1 }, { scaleY: 0.1, duration: 0.125, ease: "none" }, t);
        ft(tl, P.lids, { scaleY: 0.1 }, { scaleY: 1, duration: 0.175, ease: "none" }, t + 0.125);
        return;
      }
      P.lids.forEach(function (lid, i) {
        var d = t + i * 0.04;
        ft(tl, lid, { scaleY: 1 }, { scaleY: 0.08, duration: 0.09, ease: E.easeIn }, d);
        ft(tl, lid, { scaleY: 0.08 }, { scaleY: 1, duration: 0.12, ease: E.easeOut }, d + 0.09);
      });
    };

    // Pose do carregamento e segundos depois de entrar em loading.
    function loadPose(e) {
      var a;
      var off = 0;
      var rot;
      if (!nov) {
        rot = 400 * e;
        a = e < 0.4 ? lerp(240, 100, E.resolve(e / 0.4)) : 100;
        return { rot: rot, a: a, off: off };
      }
      rot = e < 1 ? 360 * E.spinIn(e) : 360 + 400 * (e - 1);
      if (e < 0.32) {
        a = lerp(240, 24, E.resolve(e / 0.32));
      } else {
        var c = (e - 0.32) % 1.8;
        var k;
        if (c < 0.9) {
          k = E.easeInOut(c / 0.9);
          a = lerp(24, 150, k);
          off = lerp(0, -60, k);
        } else {
          k = E.easeInOut((c - 0.9) / 0.9);
          a = lerp(150, 24, k);
          off = lerp(-60, -277, k);
        }
      }
      return { rot: rot, a: a, off: off };
    }

    r.loading = function (tl, t) {
      r.loadAt = t;
      if (!nov) {
        P.eyes.forEach(function (eye) {
          ft(tl, eye, { y: 0, scaleY: o.eye }, { y: 4, scaleY: o.eye * 0.39, duration: 0.25, ease: E.resolve }, t);
        });
        return;
      }
      P.eyes.forEach(function (eye) {
        ft(tl, eye, { y: 0, scaleY: o.eye }, { y: 5, scaleY: o.eye * 0.4, duration: 0.22, ease: E.resolve }, t);
      });
      // Antecipação: recua 4° e amassa antes de girar.
      seq(tl, P.body, t, bodyRest(), [
        { d: 0.112, e: E.resolve, v: { rotation: -4, scaleX: 1.03, scaleY: 0.97 } },
        { d: 0.168, e: E.resolve, v: { rotation: 0, scaleX: 1, scaleY: 1 } },
      ]);
    };

    function endLoading(tl, t) {
      var t0 = r.loadAt;
      loop(tl, t0, t, function (e) {
        var p = loadPose(e);
        gsap.set(P.spin, { rotation: p.rot });
        gsap.set(P.arc, { attr: { "stroke-dasharray": dash(p.a), "stroke-dashoffset": p.off } });
      });
      r.loadAt = null;
      return loadPose(t - t0);
    }

    r.done = function (tl, t) {
      var p = endLoading(tl, t);
      if (!nov) {
        tl.set(P.spin, { rotation: 0 }, t); // o salto de hoje
        tl.set(P.arc, { attr: { "stroke-dashoffset": 0 } }, t);
        ft(tl, P.arc, { attr: { "stroke-dasharray": dash(p.a) } }, { attr: { "stroke-dasharray": "70 207" }, duration: 0.4, ease: E.resolve }, t);
        ft(tl, P.turn, { rotation: -21.5 }, { rotation: 44.5, duration: 0.4, ease: E.resolve }, t);
        fade(tl, P.eyes, 1, 0, t);
        fade(tl, P.happy, 0, 1, t + 0.25);
        // is-hop: 480 ms, a mesma curva em cada trecho.
        seq(tl, P.body, t, { x: 0, y: 0, scaleX: 1, scaleY: 1, rotation: 0, svgOrigin: "60 104" }, [
          { d: 0.096, e: E.hop, v: { scaleX: 1.1, scaleY: 0.88 } },
          { d: 0.168, e: E.hop, v: { y: -16, scaleX: 0.95, scaleY: 1.06 } },
          { d: 0.12, e: E.hop, v: { y: 0, scaleX: 1.05, scaleY: 0.95 } },
          { d: 0.096, e: E.hop, v: { scaleX: 1, scaleY: 1 } },
        ]);
        return;
      }
      // Termina a volta a partir do ângulo em que estava.
      var ang = ((p.rot % 360) + 360) % 360;
      var rest = 360 - ang;
      var dur = Math.max(0.28, Math.min(0.72, (rest * 2.2) / 1000));
      ft(tl, P.spin, { rotation: p.rot }, { rotation: p.rot + rest, duration: dur, ease: E.finish }, t);
      var offTo = p.off < -138.5 ? -277 : 0;
      ft(tl, P.arc, { attr: { "stroke-dashoffset": p.off } }, { attr: { "stroke-dashoffset": offTo }, duration: dur, ease: E.finish }, t);
      ft(tl, P.arc, { attr: { "stroke-dasharray": dash(p.a) } }, { attr: { "stroke-dasharray": "70 207" }, duration: 0.52, ease: E.resolve }, t);
      ft(tl, P.turn, { rotation: -21.5 }, { rotation: 44.5, duration: 0.56, ease: E.turn }, t);
      P.eyes.forEach(function (eye) {
        ft(tl, eye, { scaleY: o.eye * 0.4 }, { scaleY: o.eye * 0.12, duration: 0.15, ease: E.close }, t);
      });
      ft(tl, P.eyes, { opacity: 1 }, { opacity: 0, duration: 0.07, ease: "none" }, t + 0.13);
      draw(tl, P.happy, LEN.happy, t + 0.17, 0.32, E.resolve);
      seq(tl, P.body, t + 0.12, bodyRest(), [
        { d: 0.136, e: bezier(0.3, 0, 0.6, 1), v: { scaleX: 1.09, scaleY: 0.9 } },
        { d: 0.204, e: bezier(0.2, 0.8, 0.4, 1), v: { y: -13 * o.amp, scaleX: 0.96, scaleY: 1.05 } },
        { d: 0.15, e: bezier(0.5, 0, 0.8, 0.4), v: { y: 0, scaleX: 1.05, scaleY: 0.95 } },
        { d: 0.19, e: E.resolve, v: { scaleX: 1, scaleY: 1 } },
      ]);
    };

    r.error = function (tl, t) {
      if (!nov) {
        tl.set(svg, { color: CORAL }, t);
        tl.set(P.disc, { opacity: 1 }, t);
        ft(tl, P.turn, { rotation: -21.5 }, { rotation: 224.5, duration: 0.4, ease: E.resolve }, t);
        ft(tl, P.arc, { attr: { "stroke-dasharray": "240 37" } }, { attr: { "stroke-dasharray": "70 207" }, duration: 0.4, ease: E.resolve }, t);
        fade(tl, P.eyes, 1, 0, t);
        fade(tl, P.x, 0, 1, t);
        seq(tl, P.body, t, bodyRest(), [
          { d: 0.06, e: E.easeInOut, v: { x: -6 } },
          { d: 0.075, e: E.easeInOut, v: { x: 6 } },
          { d: 0.075, e: E.easeInOut, v: { x: -4 } },
          { d: 0.054, e: E.easeInOut, v: { x: 3 } },
          { d: 0.036, e: E.easeInOut, v: { x: 0 } },
        ]);
        return;
      }
      var a = o.amp;
      ft(tl, svg, { color: LIMA }, { color: CORAL, duration: 0.22, ease: "none" }, t);
      ft(tl, P.disc, { opacity: 0 }, { opacity: 1, duration: 0.22, ease: "none" }, t);
      ft(tl, P.turn, { rotation: -21.5 }, { rotation: 224.5, duration: 0.56, ease: E.turn }, t);
      ft(tl, P.arc, { attr: { "stroke-dasharray": "240 37" } }, { attr: { "stroke-dasharray": "70 207" }, duration: 0.52, ease: E.resolve }, t);
      P.eyes.forEach(function (eye) {
        ft(tl, eye, { scaleY: o.eye }, { scaleY: o.eye * 0.12, duration: 0.15, ease: E.close }, t);
      });
      ft(tl, P.eyes, { opacity: 1 }, { opacity: 0, duration: 0.07, ease: "none" }, t + 0.13);
      draw(tl, P.x, LEN.x, t + 0.17, 0.32, E.resolve, [0, 0.06, 0.05, 0.11]);
      var D = 0.48;
      seq(tl, P.body, t, bodyRest(), [
        { d: D * 0.12, e: E.easeOut, v: { x: 3 * a, scaleX: 0.93, scaleY: 0.93 } },
        { d: D * 0.18, e: E.easeOut, v: { x: -7 * a, scaleX: 1, scaleY: 1 } },
        { d: D * 0.18, e: E.easeOut, v: { x: 5 * a } },
        { d: D * 0.18, e: E.easeOut, v: { x: -3 * a } },
        { d: D * 0.18, e: E.easeOut, v: { x: 1.5 * a } },
        { d: D * 0.16, e: E.easeOut, v: { x: 0 } },
      ]);
    };

    r.recover = function (tl, t) {
      if (!nov) {
        tl.set(svg, { color: LIMA }, t);
        tl.set(P.disc, { opacity: 0 }, t);
        ft(tl, P.turn, { rotation: 224.5 }, { rotation: -21.5, duration: 0.4, ease: E.resolve }, t);
        ft(tl, P.arc, { attr: { "stroke-dasharray": "70 207" } }, { attr: { "stroke-dasharray": "240 37" }, duration: 0.4, ease: E.resolve }, t);
        fade(tl, P.x, 1, 0, t);
        fade(tl, P.eyes, 0, 1, t);
        return;
      }
      ft(tl, svg, { color: CORAL }, { color: LIMA, duration: 0.22, ease: "none" }, t);
      ft(tl, P.disc, { opacity: 1 }, { opacity: 0, duration: 0.22, ease: "none" }, t);
      ft(tl, P.turn, { rotation: 224.5 }, { rotation: -21.5, duration: 0.56, ease: E.turn }, t);
      ft(tl, P.arc, { attr: { "stroke-dasharray": "70 207" } }, { attr: { "stroke-dasharray": "240 37" }, duration: 0.52, ease: E.resolve }, t);
      undraw(tl, P.x, LEN.x, t);
      P.eyes.forEach(function (eye) {
        ft(tl, eye, { scaleY: o.eye * 0.12 }, { scaleY: o.eye, duration: 0.34, ease: E.hop }, t + 0.08);
      });
      ft(tl, P.eyes, { opacity: 0 }, { opacity: 1, duration: 0.12, ease: "none" }, t + 0.06);
      // Suspiro de alívio: solta o ar e volta.
      seq(tl, P.body, t + 0.16, bodyRest(), [
        { d: 0.26, e: E.inOut, v: { scaleX: 1.025, scaleY: 0.955 } },
        { d: 0.28, e: E.inOut, v: { scaleX: 1, scaleY: 1 } },
      ]);
    };

    function zLoop(tl, t0, t1, period) {
      loop(tl, t0, t1, function (e) {
        var k = (e % period) / period;
        var tr = E.easeOut(k);
        var op = k < 0.25 ? E.easeOut(k / 0.25) : 1 - E.easeOut((k - 0.25) / 0.75);
        gsap.set(P.z, { opacity: op, x: 10 * tr, y: -24 * tr });
      });
    }

    r.sleep = function (tl, t, tEnd) {
      if (!nov) {
        fade(tl, P.eyes, 1, 0, t);
        fade(tl, P.sleep, 0, 1, t);
        ft(tl, P.arc, { attr: { "stroke-dasharray": "240 37" } }, { attr: { "stroke-dasharray": "1 276" }, duration: 0.4, ease: E.resolve }, t);
        ft(tl, P.turn, { rotation: -21.5 }, { rotation: 90, duration: 0.4, ease: E.resolve }, t);
        zLoop(tl, t, tEnd, 2.6);
        return;
      }
      P.eyes.forEach(function (eye) {
        ft(tl, eye, { scaleY: o.eye }, { scaleY: o.eye * 0.1, duration: 0.52, ease: E.inOut }, t);
      });
      ft(tl, P.eyes, { opacity: 1 }, { opacity: 0, duration: 0.08, ease: "none" }, t + 0.47);
      draw(tl, P.sleep, LEN.sleep, t + 0.48, 0.42, E.inOut);
      ft(tl, P.arc, { attr: { "stroke-dasharray": "240 37" } }, { attr: { "stroke-dasharray": "1 276" }, duration: 0.9, ease: E.inOut }, t + 0.2);
      ft(tl, P.turn, { rotation: -21.5 }, { rotation: 90, duration: 0.56, ease: E.turn }, t);
      loop(tl, t + 0.6, tEnd, function (e) {
        var k = wave(e, 4.8, E.inOut);
        gsap.set(P.body, { scaleX: 1 + 0.02 * k, scaleY: 1 - 0.035 * k, svgOrigin: bodyOrigin });
      });
      zLoop(tl, t + 1, tEnd, 2.8);
    };

    r.wake = function (tl, t) {
      if (!nov) {
        tl.set(P.z, { opacity: 0 }, t);
        fade(tl, P.eyes, 0, 1, t);
        fade(tl, P.sleep, 1, 0, t);
        ft(tl, P.arc, { attr: { "stroke-dasharray": "1 276" } }, { attr: { "stroke-dasharray": "240 37" }, duration: 0.4, ease: E.resolve }, t);
        ft(tl, P.turn, { rotation: 90 }, { rotation: -21.5, duration: 0.4, ease: E.resolve }, t);
        return;
      }
      tl.to(P.z, { opacity: 0, duration: 0.1, ease: "none" }, t);
      undraw(tl, P.sleep, LEN.sleep, t);
      P.eyes.forEach(function (eye) {
        ft(tl, eye, { scaleY: o.eye * 0.1 }, { scaleY: o.eye, duration: 0.34, ease: E.hop }, t + 0.08);
      });
      ft(tl, P.eyes, { opacity: 0 }, { opacity: 1, duration: 0.12, ease: "none" }, t + 0.06);
      ft(tl, P.arc, { attr: { "stroke-dasharray": "1 276" } }, { attr: { "stroke-dasharray": "240 37" }, duration: 0.52, ease: E.resolve }, t + 0.06);
      ft(tl, P.turn, { rotation: 90 }, { rotation: -21.5, duration: 0.56, ease: E.turn }, t);
      // Pulinho de susto.
      seq(tl, P.body, t, bodyRest(), [
        { d: 0.08, e: E.easeOut, v: { scaleX: 1.06, scaleY: 0.92 } },
        { d: 0.14, e: E.resolve, v: { y: -8 * o.amp, scaleX: 0.97, scaleY: 1.04 } },
        { d: 0.14, e: E.easeIn, v: { y: 0, scaleX: 1.03, scaleY: 0.97 } },
        { d: 0.12, e: E.resolve, v: { scaleX: 1, scaleY: 1 } },
      ]);
    };

    // Do pronto de volta ao repouso (proposto): sorriso some e os olhos abrem com pulo.
    r.settle = function (tl, t) {
      undraw(tl, P.happy, LEN.happy, t);
      P.eyes.forEach(function (eye) {
        ft(tl, eye, { y: 5, scaleY: o.eye * 0.12 }, { y: 0, scaleY: o.eye, duration: 0.34, ease: E.hop }, t + 0.08);
      });
      ft(tl, P.eyes, { opacity: 0 }, { opacity: 1, duration: 0.12, ease: "none" }, t + 0.06);
      ft(tl, P.arc, { attr: { "stroke-dasharray": "70 207" } }, { attr: { "stroke-dasharray": "240 37" }, duration: 0.52, ease: E.resolve }, t);
      ft(tl, P.turn, { rotation: 44.5 }, { rotation: -21.5, duration: 0.56, ease: E.turn }, t);
    };

    return r;
  }

  window.GiroRig = { create: create, E: E, bezier: bezier, ft: ft, seq: seq, loop: loop, wave: wave, LEN: LEN };
})();
