(function () {
  'use strict';
  const $=id=>document.getElementById(id), esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let model, selected='';
  function applyDocuments() {
    try { model=window.BowTfidf.fit($('corpus').value); } catch(e) { return; }
    render();
  }
  function render() {
    if(!model.words.includes(selected)) selected=model.words[0];
    const index=model.words.indexOf(selected), counts=model.counts.map(row=>row[index]), flags=counts.map(n=>Number(n>0));
    $('matrix-title').textContent='文書 × 単語：出現したか';
    $('matrix-meaning').textContent='DF：その単語が1回以上出る文書の数。同じ文書に何回出ても1文書と数える。';
    $('matrix-guide').lastElementChild.textContent='IDF：この文書集合の中での単語のレア度。少ない文書に出る語ほど大きい。IDF = ln(N / DF)、Nは文書の総数。';
    $('matrix-size').textContent=model.documents.length+' × '+model.words.length;
    const head=model.words.map((w,i)=>`<th scope="col"><button class="df-word ${i===index?'df-selected':''}" data-df-word="${i}" aria-pressed="${i===index}">${esc(w)}</button></th>`).join('');
    const rows=model.counts.map((r,i)=>`<tr><th scope="row">D${i+1}</th>${r.map((n,j)=>`<td class="${j===index?'df-column':''}">${n>0?'1':'0'}</td>`).join('')}</tr>`).join('');
    const totals=model.df.map((n,i)=>`<td class="${i===index?'df-column':''}"><strong>${n}</strong></td>`).join('');
    const idfRow=model.idf.map((n,i)=>`<td class="${i===index?'df-column':''}">${n.toFixed(3)}</td>`).join('');
    $('document-matrix').innerHTML=`<table><thead><tr><th scope="col">文書 / 単語</th>${head}</tr></thead><tbody>${rows}<tr class="meta-row"><th scope="row">DF（文書数）</th>${totals}</tr><tr class="meta-row"><th scope="row">IDF</th>${idfRow}</tr></tbody></table>`;
    $('cell-detail').innerHTML=`<strong>「${esc(selected)}」のDF</strong><p>${counts.map((n,i)=>`D${i+1}：${n}回 → ${n?'1文書':'0文書'}`).join(' ／ ')}</p><p class="math-line"><math aria-label="文書頻度"><mi>DF</mi><mo>(</mo><mtext>${esc(selected)}</mtext><mo>)</mo><mo>=</mo>${flags.map((value,i)=>`${i?'<mo>+</mo>':''}<mn>${value}</mn>`).join('')}<mo>=</mo><mn>${model.df[index]}</mn></math> 文書</p><p class="math-line"><math aria-label="逆文書頻度"><mi>IDF</mi><mo>(</mo><mtext>${esc(selected)}</mtext><mo>)</mo><mo>=</mo><mi>ln</mi><mo>(</mo><mfrac><mi>N</mi><mrow><mi>DF</mi><mo>(</mo><mtext>${esc(selected)}</mtext><mo>)</mo></mrow></mfrac><mo>)</mo><mo>=</mo><mi>ln</mi><mo>(</mo><mfrac><mn>${model.documents.length}</mn><mn>${model.df[index]}</mn></mfrac><mo>)</mo><mo>≈</mo><mn>${model.idf[index].toFixed(3)}</mn></math></p><p>同じ文書に複数回出ても、DFには1だけ加える。IDFは自然対数 ln（底が e の対数、logₑ）を使って求める。</p>`;
    $('document-tokens').innerHTML=`<strong>「${esc(selected)}」が出る文書</strong><p>${model.documents.map((text,i)=>`D${i+1}：${flags[i]?'出る':'出ない'}（${counts[i]}回）`).join(' ／ ')}</p>`;
  }
  $('document-matrix').addEventListener('click',e=>{const b=e.target.closest('[data-df-word]');if(!b)return;selected=model.words[Number(b.dataset.dfWord)];render();$('document-matrix').querySelector('[data-df-word="'+model.words.indexOf(selected)+'"]').focus({preventScroll:true});});
  $('corpus-form').addEventListener('submit',applyDocuments);
  $('preset').addEventListener('change',()=>{if($('preset').value!=='custom') applyDocuments();});
  applyDocuments();
})();
