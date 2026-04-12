// ============================================================
// SAIF PLUGIN: dictionary.js
// Feature: English Dictionary (Meaning, Phonetic, Examples)
// Author: Saif Elite
// ============================================================

(function () {

  function injectUI() {
    const sectionTitles = document.querySelectorAll('.section-title');
    let connectSection = null;
    sectionTitles.forEach(el => {
      if (el.textContent.includes('Connect With Me')) connectSection = el;
    });
    if (!connectSection || document.getElementById('saif-dict-box')) return;

    const box = document.createElement('div');
    box.id = 'saif-dict-box';
    box.style.cssText = `margin-top:30px;padding:25px;background:var(--dl-bg);border-radius:25px;border:2px solid var(--primary);backdrop-filter:blur(10px);`;
    box.innerHTML = `
      <h3 style="font-size:1rem;color:var(--primary);margin-bottom:15px;font-weight:900;">
        <i class="fas fa-book-open"></i> English Dictionary
      </h3>
      <input type="text" id="dictInput" placeholder="Word likhoo... (e.g. Serendipity)" style="margin:0 0 15px 0;">
      <button class="dl-btn" onclick="handleDictionary()">
        <i class="fas fa-search"></i> SEARCH WORD
      </button>
      <div id="dictResult" style="margin-top:15px;"></div>
    `;
    connectSection.parentNode.insertBefore(box, connectSection);
    console.log('[Saif Plugin: dictionary] UI injected ✅');
  }

  window.handleDictionary = async function () {
    const word = document.getElementById('dictInput').value.trim();
    const resultDiv = document.getElementById('dictResult');

    if (!word) {
      if (typeof showNotification === 'function') showNotification("Word likhoo!", "error");
      return;
    }

    resultDiv.innerHTML = `<div style="text-align:center;padding:20px;"><div style="width:40px;height:40px;border:3px solid var(--primary);border-top-color:transparent;border-radius:50%;animation:spin 1s linear infinite;margin:0 auto 15px;"></div><p style="color:var(--primary);font-weight:700;">Word khujchi...</p></div>`;

    try {
      const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`);
      if (!res.ok) throw new Error('Word pawa jai ni!');
      const data = await res.json();
      const entry = data[0];
      const phonetic = entry.phonetic || entry.phonetics?.find(p => p.text)?.text || '';
      const audioUrl = entry.phonetics?.find(p => p.audio)?.audio || '';

      let html = `
        <div style="background:linear-gradient(135deg,rgba(0,210,255,0.1),rgba(0,140,255,0.1));padding:20px;border-radius:20px;border:2px solid var(--primary);margin-top:15px;">
          <div style="margin-bottom:20px;">
            <p style="font-size:1.8rem;font-weight:900;color:var(--primary);margin:0;">${entry.word}</p>
            ${phonetic ? `<p style="font-size:0.9rem;opacity:0.7;color:var(--text);margin:5px 0 0 0;">${phonetic}</p>` : ''}
            ${audioUrl ? `<audio controls src="${audioUrl}" style="margin-top:10px;width:100%;border-radius:10px;"></audio>` : ''}
          </div>
      `;

      entry.meanings.slice(0, 3).forEach(meaning => {
        html += `
          <div style="background:rgba(0,0,0,0.2);padding:15px;border-radius:15px;margin-bottom:12px;">
            <span style="background:rgba(0,210,255,0.2);border:1px solid var(--primary);color:var(--primary);padding:3px 12px;border-radius:20px;font-size:0.7rem;font-weight:900;">${meaning.partOfSpeech}</span>
        `;
        meaning.definitions.slice(0, 2).forEach((def, i) => {
          html += `<p style="font-size:0.85rem;color:var(--text);margin:10px 0 5px 0;line-height:1.5;">${i + 1}. ${def.definition}</p>`;
          if (def.example) html += `<p style="font-size:0.75rem;opacity:0.6;color:var(--text);font-style:italic;margin:0;">"${def.example}"</p>`;
        });
        if (meaning.synonyms?.length) {
          html += `<p style="font-size:0.7rem;margin:10px 0 0 0;color:var(--text);"><span style="color:var(--primary);font-weight:900;">Synonyms:</span> ${meaning.synonyms.slice(0,5).join(', ')}</p>`;
        }
        html += `</div>`;
      });

      html += `</div>`;
      resultDiv.innerHTML = html;
      if (typeof showNotification === 'function') showNotification(`✅ "${word}" found!`, "success");
    } catch (e) {
      resultDiv.innerHTML = `<div style="padding:20px;border-radius:20px;border:2px solid var(--danger);text-align:center;margin-top:15px;"><i class="fas fa-exclamation-triangle" style="font-size:2rem;color:var(--danger);margin-bottom:10px;"></i><p style="color:var(--danger);font-weight:700;">${e.message}</p></div>`;
      if (typeof showNotification === 'function') showNotification("❌ Word pawa jai ni.", "error");
    }
  };

  document.addEventListener('keydown', e => {
    if (e.key === 'Enter' && document.activeElement.id === 'dictInput') handleDictionary();
  });

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', injectUI);
  else injectUI();

  console.log('[Saif Plugin: dictionary] Loaded ✅');
})();
