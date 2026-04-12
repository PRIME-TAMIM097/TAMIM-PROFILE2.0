// ============================================================
// SAIF PLUGIN: currency.js
// Feature: Currency Converter (Free, No API Key)
// Author: Saif Elite
// ============================================================

(function () {

  const CURRENCIES = ['USD','BDT','EUR','GBP','INR','JPY','CAD','AUD','SAR','AED','SGD','MYR','THB','KWD','QAR'];

  function injectUI() {
    const sectionTitles = document.querySelectorAll('.section-title');
    let connectSection = null;
    sectionTitles.forEach(el => {
      if (el.textContent.includes('Connect With Me')) connectSection = el;
    });
    if (!connectSection || document.getElementById('saif-currency-box')) return;

    const options = CURRENCIES.map(c => `<option value="${c}">${c}</option>`).join('');

    const box = document.createElement('div');
    box.id = 'saif-currency-box';
    box.style.cssText = `margin-top:30px;padding:25px;background:var(--dl-bg);border-radius:25px;border:2px solid var(--primary);backdrop-filter:blur(10px);`;
    box.innerHTML = `
      <h3 style="font-size:1rem;color:var(--primary);margin-bottom:15px;font-weight:900;">
        <i class="fas fa-coins"></i> Currency Converter
      </h3>
      <input type="number" id="currencyAmount" placeholder="Amount... (e.g. 100)" style="margin:0 0 10px 0;">
      <div style="display:grid;grid-template-columns:1fr auto 1fr;gap:10px;align-items:center;margin-bottom:15px;">
        <select id="currencyFrom" style="margin:0;">${options}</select>
        <button onclick="saifSwapCurrency()" style="background:rgba(0,210,255,0.2);border:1px solid var(--primary);color:var(--primary);padding:12px;border-radius:12px;cursor:pointer;font-size:1.1rem;font-weight:900;">⇄</button>
        <select id="currencyTo" style="margin:0;">${options}</select>
      </div>
      <button class="dl-btn" onclick="handleCurrency()">
        <i class="fas fa-calculator"></i> CONVERT
      </button>
      <div id="currencyResult" style="margin-top:15px;"></div>
    `;
    connectSection.parentNode.insertBefore(box, connectSection);

    // Set defaults
    document.getElementById('currencyFrom').value = 'USD';
    document.getElementById('currencyTo').value = 'BDT';

    console.log('[Saif Plugin: currency] UI injected ✅');
  }

  window.saifSwapCurrency = function () {
    const from = document.getElementById('currencyFrom');
    const to = document.getElementById('currencyTo');
    const temp = from.value;
    from.value = to.value;
    to.value = temp;
  };

  window.handleCurrency = async function () {
    const amount = parseFloat(document.getElementById('currencyAmount').value);
    const from = document.getElementById('currencyFrom').value;
    const to = document.getElementById('currencyTo').value;
    const resultDiv = document.getElementById('currencyResult');

    if (!amount || amount <= 0) {
      if (typeof showNotification === 'function') showNotification("Amount likhoo!", "error");
      return;
    }

    resultDiv.innerHTML = `<div style="text-align:center;padding:20px;"><div style="width:40px;height:40px;border:3px solid var(--primary);border-top-color:transparent;border-radius:50%;animation:spin 1s linear infinite;margin:0 auto 15px;"></div><p style="color:var(--primary);font-weight:700;">Converting...</p></div>`;

    try {
      const res = await fetch(`https://api.exchangerate-api.com/v4/latest/${from}`);
      const data = await res.json();
      const rate = data.rates[to];
      const converted = (amount * rate).toFixed(2);

      resultDiv.innerHTML = `
        <div style="background:linear-gradient(135deg,rgba(0,210,255,0.1),rgba(0,140,255,0.1));padding:20px;border-radius:20px;border:2px solid var(--primary);margin-top:15px;text-align:center;">
          <p style="font-size:0.8rem;opacity:0.7;color:var(--text);margin-bottom:10px;">${amount} ${from} =</p>
          <p style="font-size:2.5rem;font-weight:900;color:var(--primary);margin:0;">${converted}</p>
          <p style="font-size:1rem;font-weight:700;color:var(--text);margin:5px 0 15px 0;">${to}</p>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
            <div style="background:rgba(0,0,0,0.2);padding:12px;border-radius:12px;">
              <p style="font-size:0.6rem;opacity:0.7;color:var(--text);margin:0 0 5px 0;font-weight:900;">RATE</p>
              <p style="font-size:0.9rem;font-weight:700;color:var(--primary);margin:0;">1 ${from} = ${rate.toFixed(4)} ${to}</p>
            </div>
            <div style="background:rgba(0,0,0,0.2);padding:12px;border-radius:12px;">
              <p style="font-size:0.6rem;opacity:0.7;color:var(--text);margin:0 0 5px 0;font-weight:900;">UPDATED</p>
              <p style="font-size:0.9rem;font-weight:700;color:var(--primary);margin:0;">${new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      `;
      if (typeof showNotification === 'function') showNotification(`✅ ${amount} ${from} = ${converted} ${to}`, "success");
    } catch (e) {
      resultDiv.innerHTML = `<div style="padding:20px;border-radius:20px;border:2px solid var(--danger);text-align:center;margin-top:15px;"><i class="fas fa-exclamation-triangle" style="font-size:2rem;color:var(--danger);margin-bottom:10px;"></i><p style="color:var(--danger);font-weight:700;">Convert hoyni! Try again.</p></div>`;
      if (typeof showNotification === 'function') showNotification("❌ Convert hoyni.", "error");
    }
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', injectUI);
  else injectUI();

  console.log('[Saif Plugin: currency] Loaded ✅');
})();
