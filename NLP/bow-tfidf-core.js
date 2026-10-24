/* Shared by the browser and the numerical checks. No external dependencies. */
(function (root) {
  'use strict';
  function tokenize(text) {
    return text.normalize('NFKC').toLowerCase().replace(/[\p{P}\p{S}]+/gu, ' ').split(/\s+/u).filter(Boolean);
  }
  function fit(text) {
    const documents = text.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
    if (!documents.length || documents.length > 8) throw new Error('文書を1〜8行で入力してください。1行を1文書として数えます。');
    const tokens = documents.map(tokenize);
    if (tokens.some(t => !t.length)) throw new Error('単語のない文書があります。記号だけの行は使えません。');
    if (tokens.flat().length > 200) throw new Error('合計200語以内にしてください。');
    const words = [...new Set(tokens.flat())];
    if (words.length > 40) throw new Error('異なる単語を40語以内にしてください。');
    const ids = new Map(words.map((word, i) => [word, i]));
    const counts = tokens.map(row => {
      const vector = Array(words.length).fill(0);
      row.forEach(word => vector[ids.get(word)]++);
      return vector;
    });
    const df = words.map((_, j) => counts.filter(row => row[j] > 0).length);
    const idf = df.map(n => Math.log((1 + documents.length) / (1 + n)) + 1);
    const weighted = counts.map(row => row.map((n, j) => n * idf[j]));
    // Each document is its own sequence; no context crosses a document boundary.
    const cooccurrence = words.map(() => Array(words.length).fill(0));
    tokens.forEach(row => row.forEach((word, i) => {
      for (const neighbor of [i - 1, i + 1]) {
        if (neighbor >= 0 && neighbor < row.length) cooccurrence[ids.get(word)][ids.get(row[neighbor])]++;
      }
    }));
    return { documents, tokens, words, ids, counts, df, idf, weighted, cooccurrence };
  }
  function cosine(a, b) {
    const dot = a.reduce((sum, value, i) => sum + value * b[i], 0);
    const normA = Math.hypot(...a), normB = Math.hypot(...b);
    return { dot, normA, normB, score: normA && normB ? Math.min(1, dot / (normA * normB)) : 0 };
  }
  function search(model, text, method) {
    const terms = tokenize(text);
    const query = Array(model.words.length).fill(0);
    terms.forEach(term => { if (model.ids.has(term)) query[model.ids.get(term)]++; });
    const vector = method === 'tfidf' ? query.map((n, i) => n * model.idf[i]) : query;
    const matrix = method === 'tfidf' ? model.weighted : model.counts;
    const matches = matrix.map((row, i) => ({ i, ...cosine(row, vector) }));
    matches.sort((a, b) => b.score - a.score || a.i - b.i);
    // Equal scores share a competition rank; zero scores are not search hits.
    matches.forEach((match, k) => {
      match.rank = k && Math.abs(match.score - matches[k - 1].score) < 1e-12 ? matches[k - 1].rank : k + 1;
    });
    return { query, vector, matches, unknown: [...new Set(terms.filter(t => !model.ids.has(t)))], empty: !terms.length };
  }
  const api = { tokenize, fit, cosine, search };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.BowTfidf = api;
})(globalThis);
