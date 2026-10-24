(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const core = window.BowTfidf;
  const escape = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const fmt = n => n.toFixed(3);
  const presets = {
    english: { text: 'I like music.\nYou like movies.\nI enjoy music.\nYou enjoy music.', query: 'music movies' },
    repeated: { text: 'I like music. I enjoy music.\nYou like movies. You enjoy movies.\nI enjoy music.\nYou enjoy music.', query: 'music movies' },
    japanese: { text: '私 は 音楽 が 好き 。\n私 は 映画 が 好き 。\n君 は 音楽 を 聴く 。\n私 は 音楽 を 学ぶ 。', query: '音楽 映画' },
    ranking: { text: 'music music music music music music movies\nmovies\nmusic\nmusic', query: 'music movies' },
    order: { text: 'dog bites man.\nman bites dog.', query: 'dog bites' }
  };
  let model, method = 'bow', doc = 0, term = 0, focus = 0, resultDoc = 0, resultMethod = 'bow';
  let results, previewButton = null;
  // The teaching mirror has nlp-index.html; the public NLP directory has index.html.
  if (/\/NLP\//.test(location.pathname)) $('top-link').setAttribute('href', 'index.html');

  function matrixTable(matrix, rows, selectable = false, highlight = -1, extras = '') {
    const max = Math.max(1, ...matrix.flat());
    return `<table><thead><tr><th scope="col">${selectable ? '文書' : '行'} ＼ 単語</th>${model.words.map(w => `<th scope="col">${escape(w)}</th>`).join('')}</tr></thead><tbody>${matrix.map((row, i) => `<tr${i === highlight ? ' class="focus"' : ''}><th scope="row">${escape(rows[i])}</th>${row.map((value, j) => {
      const label = selectable && method === 'tfidf' ? fmt(value) : value;
      return `<td${value === 0 ? ' class="zero"' : ''}>${selectable ? `<button data-cell="${i},${j}" class="${i === doc && j === term ? 'selected' : ''}" aria-pressed="${i === doc && j === term}" aria-label="D${i + 1}・${escape(model.words[j])}：${label}" style="--cell-bg:rgba(8,127,120,${value ? 0.08 + 0.27 * value / max : 0})">${label}</button>` : label}</td>`;
    }).join('')}</tr>`).join('')}${extras}</tbody></table>`;
  }
  function renderMatrix() {
    const matrix = method === 'bow' ? model.counts : model.weighted;
    $('matrix-title').textContent = method === 'bow' ? '文書 × 単語：出現回数' : '文書 × 単語：TF × IDF';
    $('matrix-meaning').textContent = method === 'bow'
      ? '行＝文書、列＝単語。値は、その文書で単語が現れた回数。'
      : '行＝文書、列＝単語。値は、出現回数にIDFを掛けた重み。';
    $('matrix-size').textContent = `${model.documents.length} × ${model.words.length}`;
    const meta = `<tr class="meta-row"><th scope="row">DF（文書数）</th>${model.df.map(n => `<td>${n}</td>`).join('')}</tr><tr class="meta-row"><th scope="row">IDF</th>${model.idf.map(n => `<td>${fmt(n)}</td>`).join('')}</tr><tr class="query-row"><th scope="row">検索語 q</th>${results[method].vector.map(n => `<td>${method === 'bow' ? n : fmt(n)}</td>`).join('')}</tr>`;
    $('document-matrix').innerHTML = matrixTable(matrix, model.documents.map((_, i) => `D${i + 1}`), true, -1, meta);
    previewButton = null;
    showCell(doc, term);
  }
  function showCell(row, column) {
    const word = escape(model.words[column]), tf = model.counts[row][column], df = model.df[column];
    $('cell-detail').innerHTML = `<strong>TF-IDFの計算：D${row + 1} × ${word}</strong><p>TF(t,d) = <b>${tf}</b> 回 ／ DF(t) = <b>${df}</b> 文書 ／ 全文書数 D = ${model.documents.length}</p><p class="formula">IDF(t) = ln((1 + D) / (1 + DF(t))) + 1 = ln(${1 + model.documents.length}/${1 + df}) + 1 ≈ <b>${fmt(model.idf[column])}</b></p><p class="formula">TF-IDF(t,d) = TF(t,d) × IDF(t) = ${tf} × ${fmt(model.idf[column])} ≈ <b>${fmt(model.weighted[row][column])}</b></p>`;
    $('document-tokens').innerHTML = `<strong>D${row + 1} の単語列</strong><p>${model.tokens[row].map(w => `<span class="token${w === model.words[column] ? ' match' : ''}">${escape(w)}</span>`).join(' ')}</p><span class="note">D${row + 1}に「${word}」が${tf}回出現。単語同士が隣り合った回数ではない。</span>`;
  }
  function previewCell(button) {
    if (!button || button === previewButton) return;
    previewButton?.classList.remove('preview');
    previewButton = button;
    button.classList.add('preview');
    const [row, column] = button.dataset.cell.split(',').map(Number);
    showCell(row, column);
  }
  function clearPreview() {
    if (!previewButton) return;
    previewButton.classList.remove('preview');
    previewButton = null;
    showCell(doc, term);
  }
  function renderRanks() {
    for (const type of ['bow', 'tfidf']) {
      $(type === 'bow' ? 'bow-ranking' : 'tfidf-ranking').innerHTML = results[type].matches.map(match => `<button class="rank-row${match.i === resultDoc && type === resultMethod ? ' active' : ''}" data-result="${type},${match.i}" aria-label="${type === 'bow' ? 'BoW' : 'TF-IDF'} D${match.i + 1} の計算" aria-pressed="${match.i === resultDoc && type === resultMethod}" title="${escape(model.documents[match.i])}"><span>${match.score > 0 ? `${match.rank}位` : '一致なし'} <strong>D${match.i + 1}</strong></span><span>${fmt(match.score)}</span><span class="bar-track"><span class="bar" style="width:${100 * match.score}%"></span></span></button>`).join('');
    }
    const a = results.bow.matches, b = results.tfidf.matches;
    const queryNorm = Math.hypot(...results.bow.vector);
    const tied = a.some((m, i) => i && m.score > 0 && m.rank === a[i - 1].rank) || b.some((m, i) => i && m.score > 0 && m.rank === b[i - 1].rank);
    $('ranking-note').textContent = !queryNorm ? '語彙と一致する検索語がないため、検索スコアはすべて0。' : (a[0].i !== b[0].i ? `先頭の文書は D${a[0].i + 1} → D${b[0].i + 1}。` : 'この検索では先頭の文書は同じ。') + (tied ? '同点は同順位で、文書番号順に表示。' : 'スコアは確率ではない。');
    renderScore();
  }
  function renderScore() {
    const found = results[resultMethod].matches.find(m => m.i === resultDoc);
    const matrix = resultMethod === 'bow' ? model.counts : model.weighted;
    const vector = results[resultMethod].vector;
    const contributions = model.words.flatMap((w, j) => matrix[resultDoc][j] && vector[j] ? [`${escape(w)}：${fmt(matrix[resultDoc][j])} × ${fmt(vector[j])}`] : []);
    $('score-detail').innerHTML = `<h4>${resultMethod === 'bow' ? 'BoW' : 'TF-IDF'} ／ D${resultDoc + 1}</h4><p>${escape(model.documents[resultDoc])}</p><p class="note">${contributions.length ? contributions.join(' ＋ ') : '共通する語の寄与は0。'}</p><p>内積 q · d = ${fmt(found.dot)}</p><p class="formula">${found.normA && found.normB ? `cos = ${fmt(found.dot)} / (${fmt(found.normA)} × ${fmt(found.normB)}) ≈ <b>${fmt(found.score)}</b>` : '検索ベクトルが0のため、コサインは未定義。表示上は0とする。'}</p><p class="note">分母は文書の長さ × 検索ベクトルの長さ。計算には丸め前の値を使う。</p>`;
  }
  function renderCompare() {
    $('compare-bow').innerHTML = matrixTable(model.counts, model.documents.map((_, i) => `D${i + 1}`));
    $('compare-cooccurrence').innerHTML = matrixTable(model.cooccurrence, model.words, false, focus);
    $('bow-definition').textContent = `${model.documents.length} × ${model.words.length} の行列。1行は1文書、各成分はその文書内の出現回数。`;
    $('co-definition').textContent = `${model.words.length} × ${model.words.length} の行列。1行は1単語、各成分は「注目語 → 周辺語」が共起した回数。`;
    const word = model.words[focus], pairs = [];
    model.tokens.forEach((row, d) => row.forEach((w, i) => {
      if (w !== word) return;
      const neighbors = [i - 1, i + 1].filter(j => j >= 0 && j < row.length);
      pairs.push(`<p>D${d + 1}・${i + 1}語目「${escape(w)}」：${neighbors.length ? neighbors.map(j => `${j < i ? '左' : '右'}の「${escape(row[j])}」を1回`).join(' ／ ') : '周辺語なし'}</p>`);
    }));
    $('pair-evidence').innerHTML = `<strong>「${escape(word)}」の周辺語を数える（行和 ${model.cooccurrence[focus].reduce((s, n) => s + n, 0)}）</strong>${pairs.join('')}`;
  }
  function renderSearch() {
    results = { bow: core.search(model, $('query').value, 'bow'), tfidf: core.search(model, $('query').value, 'tfidf') };
    const unknown = results.bow.unknown;
    $('query-note').textContent = results.bow.empty ? '検索語を入力してください。' : unknown.length ? `語彙にない語（計算対象外）：${unknown.join('、')}` : '検索語にも、文書集合と同じ語彙・IDFを使用。';
    renderMatrix();
    renderRanks();
  }
  function applyCorpus() {
    try {
      const next = core.fit($('corpus').value);
      model = next;
      doc = 0; term = Math.max(0, model.words.indexOf(core.tokenize($('query').value)[0])); focus = term; resultDoc = 0;
      $('doc-count').textContent = model.documents.length;
      $('word-count').textContent = model.words.length;
      $('token-count').textContent = model.tokens.flat().length;
      $('focus-word').innerHTML = model.words.map((w, i) => `<option value="${i}">${escape(w)}</option>`).join('');
      $('focus-word').value = focus;
      $('error').hidden = true;
      $('dirty').hidden = true;
      renderSearch();
      renderCompare();
    } catch (error) {
      $('error').textContent = error.message + (model ? ' 表示中の結果は前回適用した文書のものです。' : '');
      $('error').hidden = false;
    }
  }
  function activateTab(name) {
    document.querySelectorAll('[data-tab]').forEach(button => {
      const active = button.dataset.tab === name;
      button.setAttribute('aria-selected', active);
      button.tabIndex = active ? 0 : -1;
      $(`panel-${button.dataset.tab}`).hidden = !active;
    });
  }
  document.querySelectorAll('[data-tab]').forEach((button, i, buttons) => {
    button.addEventListener('click', () => activateTab(button.dataset.tab));
    button.addEventListener('keydown', event => {
      const destination = { ArrowRight: (i + 1) % buttons.length, ArrowLeft: (i + buttons.length - 1) % buttons.length, Home: 0, End: buttons.length - 1 }[event.key];
      if (destination === undefined) return;
      event.preventDefault(); activateTab(buttons[destination].dataset.tab); buttons[destination].focus();
    });
  });
  document.querySelectorAll('[data-method]').forEach(button => button.addEventListener('click', () => {
    method = button.dataset.method;
    document.querySelectorAll('[data-method]').forEach(b => b.setAttribute('aria-pressed', b === button));
    renderMatrix();
  }));
  $('corpus-form').addEventListener('submit', event => { event.preventDefault(); applyCorpus(); });
  $('corpus').addEventListener('input', () => { $('dirty').hidden = false; $('preset').value = 'custom'; });
  $('preset').addEventListener('change', () => {
    const preset = presets[$('preset').value];
    if (!preset) return;
    $('corpus').value = preset.text; $('query').value = preset.query; applyCorpus();
  });
  $('query-form').addEventListener('submit', event => { event.preventDefault(); renderSearch(); });
  $('query').addEventListener('input', renderSearch);
  $('document-matrix').addEventListener('mouseover', event => previewCell(event.target.closest('[data-cell]')));
  $('document-matrix').addEventListener('mouseleave', clearPreview);
  $('document-matrix').addEventListener('focusin', event => previewCell(event.target.closest('[data-cell]')));
  $('document-matrix').addEventListener('focusout', event => {
    if (!$('document-matrix').contains(event.relatedTarget)) clearPreview();
  });
  $('document-matrix').addEventListener('click', event => {
    const button = event.target.closest('[data-cell]');
    if (!button) return;
    [doc, term] = button.dataset.cell.split(',').map(Number);
    renderMatrix();
    $('document-matrix').querySelector(`[data-cell="${doc},${term}"]`).focus({ preventScroll: true });
  });
  document.querySelector('.ranking-area').addEventListener('click', event => {
    const button = event.target.closest('[data-result]');
    if (!button) return;
    const [type, index] = button.dataset.result.split(',');
    resultMethod = type; resultDoc = Number(index); doc = resultDoc;
    renderMatrix(); renderRanks();
    document.querySelector(`[data-result="${type},${index}"]`).focus({ preventScroll: true });
  });
  $('focus-word').addEventListener('change', () => { focus = Number($('focus-word').value); renderCompare(); });
  if (window.lucide) window.lucide.createIcons();
  applyCorpus();
})();
