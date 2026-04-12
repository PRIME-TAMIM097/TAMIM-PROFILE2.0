// ============================================================
// SAIF PLUGIN: texttools.js
// Feature: Text Tools (Case, Count, Reverse, Encode etc)
// Author: Saif Elite
// ============================================================

(function () {

  function injectUI() {
    const sectionTitles = document.querySelectorAll('.section-title');
    let connectSection = null;
    sectionTitles.forEach(el => {
      if (el.textContent.includes('Connect With Me')) connectSection = el;
    });
    if (!connectSection || document.getElementById('saif-text-box')) return;

    const box = document.createElement('div');
    box.id = 'saif-text-box';
    box.style.cssText = `margin-top:30px;padding:25px;background:var(--dl-bg);border-radius:25px;border:2px solid var(--primary);backdrop-filter:blur(10px);`;
    box.innerHTML = `
      <h3 style="font-size:1rem;color:var(--primary);margin-bottom:15px;font-weight:900;">
        <i class="fas fa-font"></i> Text Tools
      </h3>
      <textarea id="textToolInput" rows="4" placeholder="Tomar text likhoo ekhane..."></textarea>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:12px;">
        <button onclick="saifText('upper')" style="background:rgba(0,210,255,0.15);border:1px solid var(--primary);color:var(--primary);padding:10px;border-radius:12px;cursor:pointer;font-weight:700;font-size:0.75rem;">
          <i class="fas fa-arrow-up"></i> UPPERCASE
        </button>
        <button onclick="saifText('lower')" style="background:rgba(0,210,255,0.15);border:1px solid var(--primary);color:var(--primary);padding:10px;border-radius:12px;cursor:pointer;font-weight:700;font-size:0.75rem;">
          <i class="fas fa-arrow-down"></i> lowercase
        </button>
        <button onclick="saifText('title')" style="background:rgba(0,210,255,0.15);border:1px solid var(--primary);color:var(--primary);padding:10px;border-radius:12px;cursor:pointer;font-weight:700;font-size:0.75rem;">
          <i class="fas fa-heading"></i> Title Case
        </button>
        <button onclick="saifText('reverse')" style="background:rgba(0,210,255,0.15);border:1px solid var(--primary);color:var(--primary);padding:10px;border-radius:12px;cursor:pointer;font-weight:700;font-size:0.75rem;">
          <i class="fas fa-undo"></i> Reverse
        </button>
        <button onclick="saifText('count')" style="background:rgba(0,210,255,0.15);border:1px solid var(--primary);color:var(--primary);padding:10px;border-radius:12px;cursor:pointer;font-weight:700;font-size:0.75rem;">
          <i class="fas fa-calculator"></i> Word Count
        </button>
        <button onclick="saifText('remove')" style="background:rgba(0,210,255,0.15);border:1px solid var(--primary);color:var(--primary);padding:10px;border-radius:12px;cursor:pointer;font-weight:700;font-size:0.75rem;">
          <i class="fas fa-eraser"></i> Remove Spaces
        </button>
        <button onclick="saifText('encode')" style="background:rgba(0,210,255,0.15);border:1px solid var(--primary);color:var(--primary);padding:10px;border-radius:12px;cursor:pointer;font-weight:700;font-size:0.75rem;">
          <i class="fas fa-lock"></i> Base64 Encode
        </button>
        <button onclick="saifText('decode')" style="background:rgba(0,210,255,0.15);border:1px solid var(--primary);color:var(--primary);padding:10px;border-radius:12px;cursor:pointer;font-weight:700;font-size:0.75rem;">
          <i class="fas fa-lock-open"></i> Base64 Decode
        </button>
      </div>

      <div id="textToolResult" style="margin-top:15px;"></div>
    `;
    connectSection.parentNode.insertBefore(box, connectSection);
    console.log('[Saif Plugin: texttools] UI injected ✅');
  }

  window.saifText = function (action) {
    const input = document.getElementById('textToolInput').value;
    const resultDiv = document.getElementById('textToolResult');

    if (!input.trim()) {
      if (typeof showNotification === 'function') showNotification("Kisu likhoo!", "error");
      return;
    }

    let output = '';
    let label = '';

    switch (action) {
      case 'upper':
        output = input.toUpperCase();
        label = 'UPPERCASE';
        break;
      case 'lower':
        output = input.toLowerCase();
        label = 'lowercase';
        break;
      case 'title':
        output = input.replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
        label = 'Title Case';
        break;
      case 'reverse':
        output = input.split('').reverse().join('');
        label = 'Reversed';
        break;
      case 'count':
        const words = input.trim().split(/\s+/).filter(Boolean).length;
        const chars = input.length;
        const charsNoSpace = input.replace(/\s/g, '').length;
        const lines = input.split('\n').length;
        resultDiv.innerHTML = `
          <div style="background:linear-gradient(135deg,rgba(0,210,255,0.1),rgba(0,140,255,0.1));padding:20px;border-radius:20px;border:2px solid var(--primary);margin-top:15px;">
            <p style="color:var(--primary);font-weight:900;margin-bottom:15px;"><i class="fas fa-chart-bar"></i> Text Statistics</p>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
              <div style="background:rgba(0,0,0,0.2);padding:12px;border-radius:12px;text-align:center;">
                <p style="font-size:0.6rem;opacity:0.7;color:var(--text);margin:0 0 5px 0;font-weight:900;">WORDS</p>
                <p style="font-size:1.8rem;font-weight:900;color:var(--primary);margin:0;">${words}</p>
              </div>
              <div style="background:rgba(0,0,0,0.2);padding:12px;border-radius:12px;text-align:center;">
                <p style="font-size:0.6rem;opacity:0.7;color:var(--text);margin:0 0 5px 0;font-weight:900;">CHARACTERS</p>
                <p style="font-size:1.8rem;font-weight:900;color:var(--primary);margin:0;">${chars}</p>
              </div>
              <div style="background:rgba(0,0,0,0.2);padding:12px;border-radius:12px;text-align:center;">
                <p style="font-size:0.6rem;opacity:0.7;color:var(--text);margin:0 0 5px 0;font-weight:900;">NO SPACES</p>
                <p style="font-size:1.8rem;font-weight:900;color:var(--primary);margin:0;">${charsNoSpace}</p>
              </div>
              <div style="background:rgba(0,0,0,0.2);padding:12px;border-radius:12px;text-align:center;">
                <p style="font-size:0.6rem;opacity:0.7;color:var(--text);margin:0 0 5px 0;font-weight:900;">LINES</p>
                <p style="font-size:1.8rem;font-weight:900;color:var(--primary);margin:0;">${lines}</p>
              </div>
            </div>
          </div>
        `;
        if (typeof showNotification === 'function') showNotification("✅ Text counted!", "success");
        return;
      case 'remove':
        output = input.replace(/\s+/g, ' ').trim();
        label = 'Extra Spaces Removed';
        break;
      case 'encode':
        try { output = btoa(unescape(encodeURIComponent(input))); label = 'Base64 Encoded'; }
        catch (e) { output = 'Encode hoyni!'; label = 'Error'; }
        break;
      case 'decode':
        try { output = decodeURIComponent(escape(atob(input))); label = 'Base64 Decoded'; }
        catch (e) { output = 'Valid Base64 na!'; label = 'Error'; }
        break;
    }

    resultDiv.innerHTML = `
      <div style="background:linear-gradient(135deg,rgba(0,210,255,0.1),rgba(0,140,255,0.1));padding:20px;border-radius:20px;border:2px solid var(--primary);margin-top:15px;">
        <p style="color:var(--primary);font-weight:900;margin-bottom:12px;"><i class="fas fa-check-circle"></i> ${label}</p>
        <div style="background:rgba(0,0,0,0.2);padding:12px;border-radius:12px;margin-bottom:12px;">
          <p style="font-size:0.85rem;line-height:1.6;color:var(--text);margin:0;word-break:break-all;">${output}</p>
        </div>
        <button onclick="navigator.clipboard.writeText(\`${output.replace(/`/g,"'")}\`).then(()=>{ if(typeof showNotification==='function') showNotification('✅ Copied!','success'); })" style="width:100%;background:rgba(0,210,255,0.2);border:1px solid var(--primary);color:var(--primary);padding:10px;border-radius:10px;cursor:pointer;font-weight:700;font-size:0.8rem;">
          <i class="fas fa-copy"></i> COPY RESULT
        </button>
      </div>
    `;
    if (typeof showNotification === 'function') showNotification(`✅ ${label} done!`, "success");
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', injectUI);
  else injectUI();

  console.log('[Saif Plugin: texttools] Loaded ✅');
})();
