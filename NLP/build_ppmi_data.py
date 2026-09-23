"""Generate reproducible SVD data for the preset teaching corpora."""
import json
import re
from pathlib import Path

import numpy as np

EXAMPLES = {
    'textbook': 'You say goodbye and I say hello.',
    'two': 'I like music. You like movies.',
    'jp': '私 は 猫 が 好き 。 私 は 犬 が 好き 。 君 は 猫 が 好き 。',
    'repeat': 'a a b a a b a a c a a c',
}

data = {}
for text in EXAMPLES.values():
    tokens = re.sub(r'([.、。])', r' \1 ', text.lower()).split()
    words = list(dict.fromkeys(tokens))
    ids = [words.index(word) for word in tokens]
    for width in (1, 2, 3):
        counts = np.zeros((len(words), len(words)))
        for position, word in enumerate(ids):
            for neighbor in range(max(0, position-width), min(len(ids), position+width+1)):
                if neighbor != position:
                    counts[word, ids[neighbor]] += 1
        with np.errstate(divide='ignore'):
            ppmi = np.maximum(0, np.log2(counts*counts.sum()/np.outer(counts.sum(axis=1), counts.sum(axis=0))))
        u, s, vt = np.linalg.svd(ppmi, full_matrices=False)
        np.testing.assert_allclose(u @ np.diag(s) @ vt, ppmi, atol=1e-12)
        key = json.dumps([tokens, width], ensure_ascii=False, separators=(',', ':'))
        data[key] = {'U': u.tolist(), 'S': s.tolist(), 'V': vt.T.tolist()}

destination = Path(__file__).with_name('ppmi-svd-data.js')
destination.write_text('"use strict";\nconst PPMI_SVD_DATA = ' + json.dumps(data, ensure_ascii=False, separators=(',', ':')) + ';\n', encoding='utf-8')
print(f'{len(data)} NumPy SVD cases: {destination}')
