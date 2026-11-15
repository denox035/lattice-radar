// LATTICE dashboard: renders window.RADAR (written by main.ts as data.js).
// No network, no framework. State lives in the URL: ?shot=board|detail|filtered
// sets the scene for screenshots; #/p/<slug> opens a protocol's detail view.
(function () {
  'use strict';
  var R = window.RADAR;
  var rowsEl = document.getElementById('rows');
  var detailEl = document.getElementById('detail');
  if (!R || !R.rows) {
    rowsEl.innerHTML = '<tr><td colspan="9">No radar data loaded. Run main.ts first: it writes data.js beside this page.</td></tr>';
    window.__shotReady = true;
    return;
  }

  var state = { q: '', cat: '', chain: '', scope: 'all', sort: 'rank', dir: 1, detail: null };

  function $(id) { return document.getElementById(id); }
  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function money(n) {
    if (n === null || n === undefined) return '—';
    var a = Math.abs(n);
    if (a >= 1e9) return '$' + (n / 1e9).toFixed(2) + 'B';
    if (a >= 1e6) return '$' + (n / 1e6).toFixed(1) + 'M';
    if (a >= 1e3) return '$' + (n / 1e3).toFixed(1) + 'K';
    return '$' + n;
  }
  function pct(v) {
    if (v === null || v === undefined) return '<span class="flat">—</span>';
    var cls = v > 0 ? 'up' : v < 0 ? 'down' : 'flat';
    var sign = v > 0 ? '+' : '';
    return '<span class="' + cls + '">' + sign + v.toFixed(1) + '%</span>';
  }
  function age(v) {
    if (v === null || v === undefined) return '—';
    if (v < 365) return v + 'd';
    return (v / 365).toFixed(1) + 'y';
  }
  function num(n, d) {
    return n === null || n === undefined ? '—' : n.toFixed(d === undefined ? 2 : d);
  }

  // ---- header, model strip, footer -------------------------------------
  $('snapLine').textContent = 'Snapshot ' + R.as_of + ' · ' + R.rows.length + ' rows · ' + R.watchlist_size + ' watchlist · ' + R.early_size + ' early';
  $('modelText').textContent =
    'Implied value = TVL × peer multiple × growth × maturity. Peer multiple: median MCap/TVL of live ' +
    R.calibration.length + ' categories (global ' + R.global_multiple.toFixed(3) + '), shrunk toward the market with a prior of ' +
    R.model.peer_shrink_k + ' peers, clamped ' + R.model.peer_clamp_lo + '–' + R.model.peer_clamp_hi +
    '. Growth: 7-day TVL change × ' + R.model.growth_weight + ', clamped ' + R.model.growth_floor + '…+' + R.model.growth_cap +
    '%. Maturity: ' + R.model.maturity_floor + ' at birth to 1.00 at ' + R.model.maturity_days + ' days' +
    (R.unknown_age_days ? '; unknown age takes the snapshot median of ' + R.unknown_age_days + ' days' : '') + '.';
  $('footLine').textContent =
    'LATTICE ' + R.model_version + ' · built from the sealed DefiLlama snapshot of ' + R.as_of + ' (' + R.source + ') · ' +
    R.rows.length + ' protocols ranked · no network · deterministic: the same snapshot always writes the same board.';

  // ---- filter controls ---------------------------------------------------
  var cats = {}, chains = {};
  R.rows.forEach(function (r) {
    if (r.category) cats[r.category] = 1;
    r.chains.forEach(function (c) { chains[c] = 1; });
  });
  function fillSelect(el, values) {
    Object.keys(values).sort().forEach(function (v) {
      var o = document.createElement('option');
      o.value = v; o.textContent = v;
      el.appendChild(o);
    });
  }
  fillSelect($('cat'), cats);
  fillSelect($('chain'), chains);

  // ---- filtering + sorting ----------------------------------------------
  function visible() {
    var q = state.q.trim().toLowerCase();
    var list = R.rows.filter(function (r) {
      if (state.scope !== 'all' && r.scope !== state.scope) return false;
      if (state.cat && r.category !== state.cat) return false;
      if (state.chain && r.chains.indexOf(state.chain) < 0) return false;
      if (q && r.name.toLowerCase().indexOf(q) < 0 && r.slug.indexOf(q) < 0) return false;
      return true;
    });
    var k = state.sort, d = state.dir;
    function key(r) {
      if (k === 'rank') return r.rank;
      if (k === 'tvl') return r.tvl_usd;
      if (k === 'change') return r.change_7d === null ? -1e9 : r.change_7d;
      if (k === 'age') return r.age_days === null ? -1 : r.age_days;
      if (k === 'implied') return r.implied_value_usd;
      if (k === 'name') return r.name;
      if (k === 'category') return r.category || '';
      return r.rank;
    }
    list.sort(function (a, b) {
      var ka = key(a), kb = key(b);
      if (ka < kb) return -1 * d;
      if (ka > kb) return 1 * d;
      return a.slug < b.slug ? -1 : 1;
    });
    return list;
  }

  function renderTable() {
    var list = visible();
    var html = '';
    var show = list.slice(0, 200);
    show.forEach(function (r) {
      html += '<tr data-slug="' + esc(r.slug) + '"' + (state.detail === r.slug ? ' class="sel"' : '') + '>' +
        '<td class="rk">' + r.rank + '</td>' +
        '<td class="nm">' + esc(r.name) + '<span class="slug">' + esc(r.slug) + ' ' +
        (r.scope === 'watchlist' ? '<span class="badge wl">WATCHLIST</span>' : '<span class="badge er">EARLY</span>') + '</span></td>' +
        '<td>' + esc(r.category || '—') + '</td>' +
        '<td>' + esc(r.chains.slice(0, 2).join(', ') || '—') + (r.chains.length > 2 ? ' +' + (r.chains.length - 2) : '') + '</td>' +
        '<td class="num">' + money(r.tvl_usd) + '</td>' +
        '<td class="num">' + pct(r.change_7d) + '</td>' +
        '<td class="num">' + age(r.age_days) + '</td>' +
        '<td class="num"><b>' + money(r.implied_value_usd) + '</b></td>' +
        '<td><span class="conf ' + r.confidence + '">' + r.confidence.toUpperCase() + '</span></td></tr>';
    });
    rowsEl.innerHTML = html || '<tr><td colspan="9">No protocol matches these filters.</td></tr>';
    var total = list.reduce(function (s, r) { return s + r.implied_value_usd; }, 0);
    $('stats').innerHTML =
      '<span>Showing <b>' + list.length + '</b> of ' + R.rows.length + ' rows' + (list.length > 200 ? ' (first 200)' : '') + '</span>' +
      '<span>Combined implied value <b>' + money(total) + '</b></span>' +
      '<span>Watchlist <b>' + R.watchlist_size + '</b> · early <b>' + R.early_size + '</b></span>' +
      '<span>Live comps <b>' + R.live_size + '</b> · global multiple <b>' + R.global_multiple.toFixed(3) + '</b></span>';
    $('countLine').textContent = list.length > 200
      ? 'Showing the first 200 of ' + list.length + ' matching rows. Narrow the filters to see the rest.'
      : list.length + ' matching rows.';
  }

  // ---- detail view ---------------------------------------------------------
  function renderDetail() {
    var slug = state.detail;
    if (!slug) { detailEl.hidden = true; detailEl.innerHTML = ''; return; }
    var r = null;
    R.rows.forEach(function (x) { if (x.slug === slug) r = x; });
    if (!r) { detailEl.hidden = true; detailEl.innerHTML = ''; return; }
    var cal = null;
    R.calibration.forEach(function (c) { if (c.category === r.category) cal = c; });
    var steps = r.farm_steps.map(function (s, i) {
      var m = s.match(/^(.*) Cost: (.*)\. Time: (.*)\.$/);
      var text = m ? m[1] : s, cost = m ? m[2] : '', time = m ? m[3] : '';
      return '<li><b>Step ' + (i + 1) + '.</b> ' + esc(text) +
        (cost || time ? ' <span class="cost">Cost: ' + esc(cost) + '. Time: ' + esc(time) + '.</span>' : '') + '</li>';
    }).join('');
    detailEl.innerHTML =
      '<h2>#' + r.rank + ' ' + esc(r.name) + ' <span class="badge ' + (r.scope === 'watchlist' ? 'wl' : 'er') + '">' + r.scope.toUpperCase() + '</span></h2>' +
      '<div class="meta">' + esc(r.slug) + ' · ' + esc(r.category || 'uncategorised') + ' · ' + esc(r.chains.join(', ') || 'no chain listed') +
      ' · listed ' + (r.listed_at || 'unknown') + ' · age ' + age(r.age_days) + ' · confidence <span class="conf ' + r.confidence + '">' + r.confidence.toUpperCase() + '</span></div>' +
      '<div class="factors">' +
      '<div class="factor"><div class="k">TVL</div><div class="v">' + money(r.tvl_usd) + '</div><div class="d">7-day change ' + (r.change_7d === null ? 'not reported' : (r.change_7d > 0 ? '+' : '') + r.change_7d.toFixed(1) + '%') + '</div></div>' +
      '<div class="factor"><div class="k">Peer multiple</div><div class="v">' + num(r.peer_multiple, 3) + '×</div><div class="d">' + r.peer_count + ' live peer' + (r.peer_count === 1 ? '' : 's') + ' in ' + esc(r.category || 'this category') + (cal ? ' · median ' + num(cal.median_multiple, 3) + '×' : ' · no live peers, global median used') + '</div></div>' +
      '<div class="factor"><div class="k">Growth factor</div><div class="v">' + num(r.growth_multiplier, 3) + '×</div><div class="d">7-day change ' + (r.change_7d === null ? 'unknown, taken as 0' : r.change_7d.toFixed(1) + '%') + ' × 0.35</div></div>' +
      '<div class="factor"><div class="k">Maturity factor</div><div class="v">' + num(r.maturity_multiplier, 3) + '×</div><div class="d">' + (r.age_days === null ? 'age unknown, snapshot median ' + R.unknown_age_days + ' days' : 'age ' + r.age_days + ' days') + '</div></div>' +
      '<div class="factor total"><div class="k">Implied value</div><div class="v">' + money(r.implied_value_usd) + '</div><div class="d">TVL × peer × growth × maturity</div></div>' +
      '</div>' +
      '<h3>Farm plan — six steps</h3><ol class="steps">' + steps + '</ol>' +
      '<p class="hint">This plan is derived from the protocol\u2019s category, chains, size and age. It does not predict an airdrop, and it never asks you to pay to claim: a real claim is always free, from the protocol\u2019s own site.</p>';
    detailEl.hidden = false;
  }

  // ---- live + calibration --------------------------------------------------
  (function renderLive() {
    var h = '';
    R.live.forEach(function (p) {
      h += '<tr><td class="nm">' + esc(p.name) + '<span class="slug">' + esc(p.slug) + '</span></td>' +
        '<td>' + esc(p.category || '—') + '</td>' +
        '<td class="num">' + money(p.tvl_usd) + '</td>' +
        '<td class="num">' + money(p.mcap_usd) + '</td>' +
        '<td class="num">' + num(p.mcap_tvl, 3) + '×</td></tr>';
    });
    $('liveRows').innerHTML = h;
    var c = '';
    R.calibration.forEach(function (x) {
      c += '<tr><td>' + esc(x.category) + '</td><td class="num">' + x.peers + '</td>' +
        '<td class="num">' + num(x.median_multiple, 3) + '×</td><td class="num"><b>' + num(x.multiple, 3) + '×</b></td></tr>';
    });
    $('calRows').innerHTML = c;
  })();

  // ---- events ---------------------------------------------------------------
  $('q').addEventListener('input', function (e) { state.q = e.target.value; renderTable(); });
  $('cat').addEventListener('change', function (e) { state.cat = e.target.value; renderTable(); });
  $('chain').addEventListener('change', function (e) { state.chain = e.target.value; renderTable(); });
  $('scope').addEventListener('change', function (e) { state.scope = e.target.value; renderTable(); });
  $('sort').addEventListener('change', function (e) { state.sort = e.target.value; state.dir = 1; renderTable(); });
  document.querySelectorAll('#board thead th[data-k]').forEach(function (th) {
    th.addEventListener('click', function () {
      var k = th.getAttribute('data-k');
      if (state.sort === k) state.dir = -state.dir;
      else { state.sort = k; state.dir = k === 'name' || k === 'category' ? 1 : -1; }
      $('sort').value = state.sort;
      renderTable();
    });
  });
  rowsEl.addEventListener('click', function (e) {
    var tr = e.target.closest('tr[data-slug]');
    if (!tr) return;
    openDetail(tr.getAttribute('data-slug'));
  });
  function openDetail(slug) {
    state.detail = slug;
    try { history.replaceState(null, '', '#/p/' + slug); } catch (err) { /* file URLs may refuse */ }
    renderDetail();
    renderTable();
    detailEl.scrollIntoView({ block: 'nearest' });
  }
  window.addEventListener('hashchange', function () {
    var m = window.location.hash.match(/^#\/p\/(.+)$/);
    state.detail = m ? decodeURIComponent(m[1]) : null;
    renderDetail();
    renderTable();
  });

  // ---- scene from the URL (?shot=board|detail|filtered) ---------------------
  function applyScene() {
    var params = new URLSearchParams(window.location.search);
    var shot = params.get('shot') || '';
    var slug = params.get('slug') || '';
    var cat = params.get('category') || '';
    var chain = params.get('chain') || '';
    var scope = params.get('scope') || '';
    var hm = window.location.hash.match(/^#\/p\/(.+)$/);
    if (hm) slug = decodeURIComponent(hm[1]);
    if (cat) { state.cat = cat; $('cat').value = cat; }
    if (chain) { state.chain = chain; $('chain').value = chain; }
    if (scope) { state.scope = scope; $('scope').value = scope; }
    if (shot === 'detail' && slug) state.detail = slug;
    if (shot === 'filtered' && !cat && !chain) { state.cat = 'Lending'; $('cat').value = 'Lending'; }
    if (shot === 'detail' && !slug) state.detail = R.rows[0].slug;
  }

  applyScene();
  renderTable();
  renderDetail();
  if (state.detail) detailEl.scrollIntoView();
  requestAnimationFrame(function () {
    setTimeout(function () { window.__shotReady = true; }, 60);
  });
})();
