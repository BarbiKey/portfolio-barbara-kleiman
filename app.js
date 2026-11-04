function copyEmail(btn){
  var email = "barbarakleiman1@gmail.com";
  var done = function(){ var t = btn.textContent; btn.textContent = "copied"; setTimeout(function(){ btn.textContent = t; }, 1400); };
  try{ navigator.clipboard.writeText(email).then(done).catch(function(){ fallbackCopy(email, done); }); }
  catch(e){ fallbackCopy(email, done); }
}
function fallbackCopy(text, done){
  try{
    var ta = document.createElement("textarea");
    ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.focus(); ta.select();
    document.execCommand("copy"); document.body.removeChild(ta);
    done();
  }catch(e){}
}

/* read live on every call: the OS setting can change while the page is open */
function prefersReducedMotion(){
  return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
}

function toggleMini(id, headEl){
  var el = document.getElementById(id);
  var opening = !el.classList.contains('open');
  el.classList.toggle('open');
  headEl.setAttribute('aria-expanded', opening ? 'true' : 'false');
}
document.querySelectorAll('.mini-head').forEach(function(h){
  h.addEventListener('keydown', function(e){
    if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); h.click(); }
  });
});

/* scrollspy for the floating side index */
(function(){
  var items = Array.prototype.slice.call(document.querySelectorAll('.side-index .item'));
  var targets = items.map(function(it){ return document.getElementById(it.getAttribute('data-target')); }).filter(Boolean);
  function onScroll(){
    var y = window.scrollY + window.innerHeight * 0.3;
    var current = targets[0];
    for (var i = 0; i < targets.length; i++){
      if (targets[i] && targets[i].offsetTop <= y) current = targets[i];
    }
    /* at the bottom of the page the last section may never reach the threshold */
    var atBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
    if (atBottom && targets.length) current = targets[targets.length - 1];
    items.forEach(function(it){
      it.classList.toggle('active', current && it.getAttribute('data-target') === current.id);
    });
  }
  items.forEach(function(it){
    it.addEventListener('click', function(e){
      e.preventDefault();
      var el = document.getElementById(it.getAttribute('data-target'));
      if (el) el.scrollIntoView({behavior: prefersReducedMotion() ? 'auto' : 'smooth', block:'start'});
    });
  });
  /* the index is display:none at <=860px, so no scroll work there; rAF-throttled where it shows */
  var spyMq = window.matchMedia ? window.matchMedia('(max-width: 860px)') : null;
  var spyTicking = false, spyListening = false;
  function onSpyScroll(){
    if (spyTicking) return;
    spyTicking = true;
    requestAnimationFrame(function(){ spyTicking = false; onScroll(); });
  }
  function syncSpy(){
    var hidden = spyMq && spyMq.matches;
    if (hidden && spyListening){
      window.removeEventListener('scroll', onSpyScroll);
      spyListening = false;
    } else if (!hidden && !spyListening){
      window.addEventListener('scroll', onSpyScroll, {passive:true});
      spyListening = true;
      onScroll();
    }
  }
  if (spyMq){
    if (spyMq.addEventListener) spyMq.addEventListener('change', syncSpy); else if (spyMq.addListener) spyMq.addListener(syncSpy);
  }
  syncSpy();
})();

/* tag filter: click a tag to dim every case/card that doesn't share it */
var activeTagFilter = null;
function getFilterUnits(){
  return Array.prototype.slice.call(document.querySelectorAll('.case, .family-card'));
}
function applyTagFilter(tagText){
  var norm = tagText.trim().toLowerCase();
  if (activeTagFilter === norm){ clearTagFilter(); return; }
  activeTagFilter = norm;
  getFilterUnits().forEach(function(unit){
    var tags = Array.prototype.slice.call(unit.querySelectorAll('.tag')).map(function(t){ return t.textContent.trim().toLowerCase(); });
    unit.classList.toggle('dimmed', tags.indexOf(norm) === -1);
  });
  document.querySelectorAll('.tag').forEach(function(t){
    var on = t.textContent.trim().toLowerCase() === norm;
    t.classList.toggle('tag-active', on);
    t.setAttribute('aria-pressed', on ? 'true' : 'false');
  });
  var pill = document.getElementById('filterPill');
  document.getElementById('filterPillText').textContent = 'filtering by: ' + tagText.trim();
  pill.classList.add('show');
}
function clearTagFilter(){
  activeTagFilter = null;
  getFilterUnits().forEach(function(unit){ unit.classList.remove('dimmed'); });
  document.querySelectorAll('.tag').forEach(function(t){ t.classList.remove('tag-active'); t.setAttribute('aria-pressed', 'false'); });
  document.getElementById('filterPill').classList.remove('show');
}
document.querySelectorAll('.tag').forEach(function(t){
  t.addEventListener('click', function(){ applyTagFilter(t.textContent); });
});

/* version curve "paints" (v1.0 -> v1.4) as you scroll through each case.
   Scroll work is rAF-throttled and only runs where the curve is visible and motion is allowed. */
(function(){
  var fills = Array.prototype.slice.call(document.querySelectorAll('.curve-fill'));
  if (!fills.length || !window.matchMedia) return;
  var reduceMq = window.matchMedia('(prefers-reduced-motion: reduce)');
  var mobileMq = window.matchMedia('(max-width: 640px)'); /* .curve-col is display:none here */
  var lengths = null, listening = false, ticking = false;
  function init(){
    if (lengths) return;
    lengths = fills.map(function(p){ var len = p.getTotalLength(); p.style.strokeDasharray = len; p.style.strokeDashoffset = len; return len; });
  }
  function paint(){
    fills.forEach(function(p, i){
      var caseEl = p.closest('.case');
      if (!caseEl) return;
      var rect = caseEl.getBoundingClientRect();
      var vh = window.innerHeight;
      var progress = (vh * 0.85 - rect.top) / (rect.height || 1);
      progress = Math.max(0, Math.min(1, progress));
      p.style.strokeDashoffset = lengths[i] * (1 - progress);
    });
  }
  function onScroll(){
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function(){ ticking = false; paint(); });
  }
  function sync(){
    var reduce = reduceMq.matches;
    if (reduce || mobileMq.matches){
      if (listening){
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onScroll);
        listening = false;
      }
      if (reduce){ init(); fills.forEach(function(p){ p.style.strokeDashoffset = 0; }); }
      return;
    }
    init();
    if (!listening){
      window.addEventListener('scroll', onScroll, {passive:true});
      window.addEventListener('resize', onScroll, {passive:true});
      listening = true;
    }
    paint();
  }
  [reduceMq, mobileMq].forEach(function(mq){
    if (mq.addEventListener) mq.addEventListener('change', sync); else if (mq.addListener) mq.addListener(sync);
  });
  sync();
})();

/* hero blob: pause the drift while it is out of the viewport */
(function(){
  var blob = document.querySelector('.blob');
  if (!blob || !('IntersectionObserver' in window)) return;
  new IntersectionObserver(function(entries){
    blob.classList.toggle('paused', !entries[entries.length - 1].isIntersecting);
  }).observe(blob);
})();

/* shooting star: fires once, the first time the trigger section is 40% in view.
   Never fires under reduced motion. The path is computed from the current viewport so it stays on screen. */
(function(){
  var STAR_SECTION_ID = 'about'; /* [EDITABLE] section that triggers the star */
  var section = document.getElementById(STAR_SECTION_ID);
  if (!section || !('IntersectionObserver' in window)) return;
  function shoot(){
    var vw = document.documentElement.clientWidth, vh = window.innerHeight, m = 24;
    var ang = (28 + Math.random() * 10) * Math.PI / 180;
    var cos = Math.cos(ang), sin = Math.sin(ang);
    var tail = Math.min(170, vw * 0.35);
    /* starts bottom right, travels up left; the tail trails behind toward the start */
    var x = Math.min(vw * (0.7 + Math.random() * 0.18), vw - m - tail * cos);
    var y = Math.min(vh * (0.62 + Math.random() * 0.18), vh - m - tail * sin);
    var travel = Math.min(520, (x - m) / cos, (y - m) / sin);
    var star = document.createElement('div');
    star.className = 'star fly';
    star.style.left = x + 'px';
    star.style.top = y + 'px';
    star.style.setProperty('--tail', tail + 'px');
    star.style.setProperty('--ang', (ang * 180 / Math.PI) + 'deg');
    star.style.setProperty('--dx', (-travel * cos) + 'px');
    star.style.setProperty('--dy', (-travel * sin) + 'px');
    document.body.appendChild(star);
    setTimeout(function(){ star.remove(); }, 2000);
  }
  var io = new IntersectionObserver(function(entries){
    for (var i = 0; i < entries.length; i++){
      if (!entries[i].isIntersecting) continue;
      io.unobserve(section);
      if (!prefersReducedMotion()) shoot();
      return;
    }
  }, {threshold: 0.4});
  io.observe(section);
})();
