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
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();
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
    t.classList.toggle('tag-active', t.textContent.trim().toLowerCase() === norm);
  });
  var pill = document.getElementById('filterPill');
  document.getElementById('filterPillText').textContent = 'filtering by: ' + tagText.trim();
  pill.classList.add('show');
}
function clearTagFilter(){
  activeTagFilter = null;
  getFilterUnits().forEach(function(unit){ unit.classList.remove('dimmed'); });
  document.querySelectorAll('.tag').forEach(function(t){ t.classList.remove('tag-active'); });
  document.getElementById('filterPill').classList.remove('show');
}
document.querySelectorAll('.tag').forEach(function(t){
  t.addEventListener('click', function(){ applyTagFilter(t.textContent); });
});

/* version curve "paints" (v1.0 -> v1.4) as you scroll through each case */
(function(){
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fills = Array.prototype.slice.call(document.querySelectorAll('.curve-fill'));
  var lengths = fills.map(function(p){ var len = p.getTotalLength(); p.style.strokeDasharray = len; p.style.strokeDashoffset = len; return len; });
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
  if (!reduceMotion){
    window.addEventListener('scroll', paint, {passive:true});
    window.addEventListener('resize', paint);
    paint();
  } else {
    fills.forEach(function(p){ p.style.strokeDashoffset = 0; });
  }
})();

/* hero blob: pause the drift while it is out of the viewport */
(function(){
  var blob = document.querySelector('.blob');
  if (!blob || !('IntersectionObserver' in window)) return;
  new IntersectionObserver(function(entries){
    blob.classList.toggle('paused', !entries[entries.length - 1].isIntersecting);
  }).observe(blob);
})();

/* shooting star: a rare, quiet flourish behind the hero blob, off by default for reduced motion */
(function(){
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var blob = document.querySelector('.blob');
  if (!blob) return;
  function shoot(){
    var r = blob.getBoundingClientRect();
    var star = document.createElement('div');
    star.className = 'star fly';
    star.style.left = (r.left + r.width * (0.55 + Math.random() * 0.3)) + 'px';
    star.style.top = (r.top + r.height * (0.08 + Math.random() * 0.12)) + 'px';
    document.body.appendChild(star);
    setTimeout(function(){ star.remove(); }, 1700);
  }
  setTimeout(function schedule(){ shoot(); setTimeout(schedule, 14000 + Math.random() * 10000); }, 4000);
})();
