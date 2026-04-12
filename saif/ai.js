// ============================================================
// SAIF ULTRA PREMIUM AI HUB V2
// Author: Saif
// ============================================================

(function () {

  const STORAGE_KEY = "saif_ai_history";

  function injectUI() {
    const section = document.querySelector('.section-title');
    if (!section) return;

    if (document.getElementById('saif-ai-box')) return;

    const box = document.createElement('div');
    box.id = 'saif-ai-box';
    box.className = 'dl-box';

    box.innerHTML = `
      <h3 style="color:var(--primary);font-weight:900;">🤖 SAIF AI HUB V2</h3>

      <select id="aiMode" style="margin:10px 0;">
        <option value="normal">Normal</option>
        <option value="code">Code</option>
        <option value="funny">Funny</option>
        <option value="pro">Pro</option>
      </select>

      <textarea id="aiInput" placeholder="Ask anything..." 
        style="width:100%;padding:10px;border-radius:10px;"></textarea>

      <div style="display:flex;gap:10px;margin-top:10px;">
        <button onclick="saifAI()" class="dl-btn">⚡ Generate</button>
        <button onclick="startVoice()">🎤</button>
        <button onclick="clearHistory()">🗑️</button>
      </div>

      <div id="aiResult" style="margin-top:15px;"></div>

      <div id="historyBox" style="margin-top:20px;"></div>
    `;

    section.parentNode.insertBefore(box, section);

    loadHistory();
  }

  // ===== AI =====
  window.saifAI = async function () {
    const input = document.getElementById('aiInput');
    const result = document.getElementById('aiResult');
    const mode = document.getElementById('aiMode').value;

    if (!input.value.trim()) return;

    result.innerHTML = "⏳ Thinking...";

    try {
      const prompt = `[${mode.toUpperCase()} MODE] ${input.value}`;

      const res = await fetch(`https://api.popcat.xyz/chatbot?msg=${encodeURIComponent(prompt)}`);
      const data = await res.json();

      typeEffect(result, data.response);
      saveHistory(input.value, data.response);

    } catch {
      result.innerHTML = "❌ Failed...";
    }
  };

  // ===== Typing Effect =====
  function typeEffect(el, text) {
    el.innerHTML = "";
    let i = 0;
    const speed = 20;

    function type() {
      if (i < text.length) {
        el.innerHTML += text.charAt(i);
        i++;
        setTimeout(type, speed);
      }
    }
    type();
  }

  // ===== Voice Input =====
  window.startVoice = function () {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';

    recognition.onresult = function (event) {
      document.getElementById('aiInput').value = event.results[0][0].transcript;
    };

    recognition.start();
  };

  // ===== History =====
  function saveHistory(q, a) {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    data.unshift({ q, a });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    loadHistory();
  }

  function loadHistory() {
    const box = document.getElementById('historyBox');
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

    box.innerHTML = data.map(item => `
      <div style="background:rgba(0,0,0,0.2);padding:10px;margin:5px;border-radius:10px;">
        <b>Q:</b> ${item.q}<br>
        <b>A:</b> ${item.a}
        <button onclick="copyText(\`${item.a}\`)">📋</button>
      </div>
    `).join('');
  }

  window.clearHistory = function () {
    localStorage.removeItem(STORAGE_KEY);
    loadHistory();
  };

  window.copyText = function (text) {
    navigator.clipboard.writeText(text);
  };

  // ===== RUN =====
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectUI);
  } else {
    injectUI();
  }

})();
