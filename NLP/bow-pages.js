(function () {
  'use strict';
  const view=document.body.dataset.view, corpus=document.getElementById('corpus'), preset=document.getElementById('preset'), query=document.getElementById('query');
  const titles={bow:'BoW：文書を単語の出現回数で表す',df:'DFとIDF：出現する文書数と単語のレア度を求める',tfidf:'TF-IDF：出現回数に重みを付ける',search:'文書検索：検索語と文書を比べる'};
  const links={bow:'bow-documents.html',df:'document-frequency.html',tfidf:'tfidf-weights.html',search:'document-search.html'};
  document.querySelector('.page-links a[href="'+links[view]+'"]').setAttribute('aria-current','page');
  document.querySelector('.section-heading h2').textContent=titles[view];
  try {
    const saved=JSON.parse(sessionStorage.getItem('nlp-bow-corpus')||'null');
    if(saved&&typeof saved.corpus==='string'&&typeof saved.query==='string'){
      corpus.value=saved.corpus;query.value=saved.query;preset.value=[...preset.options].some(o=>o.value===saved.preset)?saved.preset:'custom';
      document.getElementById('corpus-form').requestSubmit();
    }
  } catch(e) { /* Storage may be unavailable for local files. */ }
  function save(){try {sessionStorage.setItem('nlp-bow-corpus',JSON.stringify({corpus:corpus.value,query:query.value,preset:preset.value}));}catch(e){}}
  document.querySelectorAll('.page-links a').forEach(a=>a.addEventListener('click',save));
  if(view==='tfidf') document.querySelector('[data-method="tfidf"]').click();
})();
