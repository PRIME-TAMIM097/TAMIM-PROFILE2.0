// ============================================================
// SAIF PLUGIN: imageenhancer.js
// Feature: AI Image Enhancer / Upscaler (4K Remini)
// Author: Saif Elite
// API: arychauhann.onrender.com
// ============================================================

(function () {

  function injectUI() {
    const sectionTitles = document.querySelectorAll('.section-title');
    let connectSection = null;
    sectionTitles.forEach(el => {
      if (el.textContent.includes('Connect With Me')) connectSection = el;
    });
    if (!connectSection || document.getElementById('saif-enhance-box')) return;

    const box = document.createElement('div');
    box.id = 'saif-enhance-box';
    box.style.cssText = `margin-top:30px;padding:25px;background:var(--dl-bg);border-radius:25px;border:2px solid var(--primary);backdrop-filter:blur(10px);`;
    box.innerHTML = `
      <h3 style="font-size:1rem;color:var(--primary);margin-bottom:5px;font-weight:900;">
        <i class="fas fa-wand-magic-sparkles"></i> AI Image Enhancer
      </h3>
      <p style="font-size:0.7rem;opacity:0.6;color:var(--text);margin-bottom:15px;">Remini / 4K Upscale Baby!</p>

      <!-- Upload Box -->
      <div id="enhanceDropZone" onclick="document.getElementById('enhanceFileInput').click()"
           style="border:2px dashed var(--primary);border-radius:20px;padding:30px;text-align:center;cursor:pointer;
                  background:rgba(0,210,255,0.05);transition:all 0.3s;margin-bottom:15px;">
        <i class="fas fa-cloud-upload-alt" style="font-size:2.5rem;color:var(--primary);margin-bottom:10px;display:block;"></i>
        <p style="font-weight:700;color:var(--text);margin:0;font-size:0.85rem;">Click kore image upload koro</p>
        <p style="font-size:0.7rem;opacity:0.5;color:var(--text);margin:5px 0 0 0;">JPG, PNG support</p>
      </div>
      <input type="file" id="enhanceFileInput" accept="image/*" style="display:none;" onchange="saifPreviewImage(event)">

      <!-- Preview -->
      <div id="enhancePreview" style="display:none;margin-bottom:15px;text-align:center;">
        <img id="enhancePreviewImg" style="max-width:100%;max-height:200px;border-radius:15px;border:2px solid var(--primary);object-fit:contain;">
        <p id="enhancePreviewName" style="font-size:0.7rem;opacity:0.6;color:var(--text);margin:8px 0 0 0;"></p>
      </div>

      <!-- Options -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:15px;">
        <div>
          <label style="font-size:0.65rem;color:var(--primary);font-weight:900;letter-spacing:1px;display:block;margin-bottom:6px;">ENHANCE TYPE</label>
          <select id="enhanceType" style="margin:0;font-size:0.85rem;">
            <option value="1">Type 1 — Standard</option>
            <option value="2" selected>Type 2 — Remini</option>
            <option value="3">Type 3 — Sharp</option>
            <option value="4">Type 4 — Anime</option>
          </select>
        </div>
        <div>
          <label style="font-size:0.65rem;color:var(--primary);font-weight:900;letter-spacing:1px;display:block;margin-bottom:6px;">LEVEL</label>
          <select id="enhanceLevel" style="margin:0;font-size:0.85rem;">
            <option value="low" selected>Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      <button class="dl-btn" onclick="handleEnhance()" id="enhanceBtn">
        <i class="fas fa-wand-magic-sparkles"></i> ENHANCE IMAGE
      </button>

      <div id="enhanceResult" style="margin-top:15px;"></div>
    `;
    connectSection.parentNode.insertBefore(box, connectSection);

    // Drag and drop support
    const dropZone = document.getElementById('enhanceDropZone');
    dropZone.addEventListener('dragover', e => {
      e.preventDefault();
      dropZone.style.background = 'rgba(0,210,255,0.15)';
      dropZone.style.borderStyle = 'solid';
    });
    dropZone.addEventListener('dragleave', () => {
      dropZone.style.background = 'rgba(0,210,255,0.05)';
      dropZone.style.borderStyle = 'dashed';
    });
    dropZone.addEventListener('drop', e => {
      e.preventDefault();
      dropZone.style.background = 'rgba(0,210,255,0.05)';
      dropZone.style.borderStyle = 'dashed';
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) {
        saifLoadFile(file);
      }
    });

    console.log('[Saif Plugin: imageenhancer] UI injected ✅');
  }

  window.saifPreviewImage = function (event) {
    const file = event.target.files[0];
    if (!file) return;
    saifLoadFile(file);
  };

  window.saifLoadFile = function (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      document.getElementById('enhancePreviewImg').src = e.target.result;
      document.getElementById('enhancePreviewName').textContent = file.name + ' (' + (file.size / 1024).toFixed(1) + ' KB)';
      document.getElementById('enhancePreview').style.display = 'block';
      document.getElementById('enhanceDropZone').style.display = 'none';
      document.getElementById('enhanceResult').innerHTML = '';
    };
    reader.readAsDataURL(file);
  };

  window.handleEnhance = async function () {
    const fileInput = document.getElementById('enhanceFileInput');
    const resultDiv = document.getElementById('enhanceResult');
    const type = document.getElementById('enhanceType').value;
    const level = document.getElementById('enhanceLevel').value;
    const btn = document.getElementById('enhanceBtn');

    // Check if image selected
    const previewSrc = document.getElementById('enhancePreviewImg').src;
    if (!previewSrc || previewSrc === window.location.href) {
      if (typeof showNotification === 'function') showNotification("Image upload koro আগে!", "error");
      return;
    }

    btn.disabled = true;
    btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ENHANCING...`;

    resultDiv.innerHTML = `
      <div style="text-align:center;padding:25px;background:rgba(0,210,255,0.05);border-radius:20px;border:1px solid rgba(0,210,255,0.2);margin-top:15px;">
        <div style="width:50px;height:50px;border:3px solid var(--primary);border-top-color:transparent;border-radius:50%;animation:spin 1s linear infinite;margin:0 auto 15px;"></div>
        <p style="color:var(--primary);font-weight:900;font-size:0.95rem;margin-bottom:5px;">AI processing baby...</p>
        <p style="font-size:0.75rem;opacity:0.6;color:var(--text);margin:0;">Type ${type} • ${level} level • Please wait</p>
      </div>
    `;

    try {
      // Convert local image to blob URL via canvas → upload via imgbb free (no key needed for direct approach)
      // We use the direct API with image URL approach
      // Since we have a local file, we'll use a free image host first: freeimage.host or use base64

      const file = fileInput.files[0];
      let imageUrl = '';

      if (file) {
        // Upload to tmpfiles.org (free, no key)
        const formData = new FormData();
        formData.append('file', file);

        const uploadRes = await fetch('https://tmpfiles.org/api/v1/upload', {
          method: 'POST',
          body: formData
        });
        const uploadData = await uploadRes.json();

        if (!uploadData?.data?.url) throw new Error('Image upload failed. Try again!');

        // tmpfiles returns https://tmpfiles.org/XXXXX/file.jpg
        // Direct link format: https://tmpfiles.org/dl/XXXXX/file.jpg
        imageUrl = uploadData.data.url.replace('tmpfiles.org/', 'tmpfiles.org/dl/');
      } else {
        throw new Error('Image select koro!');
      }

      // Now call enhance API
      const apiUrl = `https://arychauhann.onrender.com/api/ihancer?url=${encodeURIComponent(imageUrl)}&type=${type}&level=${level}`;

      const enhanceRes = await fetch(apiUrl);
      if (!enhanceRes.ok) throw new Error('Enhance API busy! Try again baby.');

      const blob = await enhanceRes.blob();
      const enhancedUrl = URL.createObjectURL(blob);

      resultDiv.innerHTML = `
        <div style="background:linear-gradient(135deg,rgba(0,210,255,0.1),rgba(0,140,255,0.1));
                    padding:20px;border-radius:20px;border:2px solid var(--primary);margin-top:15px;">

          <p style="color:var(--primary);font-weight:900;font-size:1rem;margin-bottom:15px;">
            <i class="fas fa-check-circle"></i> Enhanced Ready Baby! ✨
          </p>

          <!-- Before / After -->
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:15px;">
            <div style="text-align:center;">
              <p style="font-size:0.65rem;font-weight:900;color:var(--text);opacity:0.7;margin:0 0 8px 0;letter-spacing:1px;">BEFORE</p>
              <img src="${document.getElementById('enhancePreviewImg').src}"
                   style="width:100%;border-radius:12px;border:2px solid rgba(255,255,255,0.1);object-fit:cover;max-height:150px;">
            </div>
            <div style="text-align:center;">
              <p style="font-size:0.65rem;font-weight:900;color:var(--primary);margin:0 0 8px 0;letter-spacing:1px;">AFTER ✨</p>
              <img src="${enhancedUrl}"
                   style="width:100%;border-radius:12px;border:2px solid var(--primary);object-fit:cover;max-height:150px;
                          box-shadow:0 0 20px rgba(0,210,255,0.3);">
            </div>
          </div>

          <div style="background:rgba(0,0,0,0.2);padding:12px;border-radius:12px;margin-bottom:15px;display:flex;gap:15px;justify-content:center;">
            <span style="font-size:0.75rem;color:var(--text);"><i class="fas fa-layer-group" style="color:var(--primary);"></i> Type ${type}</span>
            <span style="font-size:0.75rem;color:var(--text);"><i class="fas fa-sliders" style="color:var(--primary);"></i> ${level} level</span>
          </div>

          <a href="${enhancedUrl}" download="saif-enhanced.png"
             style="display:block;background:linear-gradient(135deg,var(--primary),#008cff);color:#000;
                    padding:14px;border-radius:14px;text-decoration:none;font-weight:900;
                    text-align:center;font-size:0.9rem;">
            <i class="fas fa-download"></i> DOWNLOAD ENHANCED IMAGE
          </a>

          <button onclick="saifResetEnhancer()"
                  style="width:100%;margin-top:10px;background:rgba(0,210,255,0.1);border:1px solid var(--primary);
                         color:var(--primary);padding:12px;border-radius:12px;cursor:pointer;font-weight:700;font-size:0.8rem;">
            <i class="fas fa-redo"></i> New Image
          </button>
        </div>
      `;

      if (typeof showNotification === 'function') showNotification("✅ Image enhanced baby!", "success");

    } catch (error) {
      console.error('[Saif Plugin: imageenhancer]', error);
      resultDiv.innerHTML = `
        <div style="padding:25px;border-radius:20px;border:2px solid var(--danger);text-align:center;margin-top:15px;
                    background:linear-gradient(135deg,rgba(255,65,108,0.1),rgba(255,75,43,0.1));">
          <i class="fas fa-exclamation-triangle" style="font-size:2.5rem;color:var(--danger);margin-bottom:10px;display:block;"></i>
          <p style="color:var(--danger);font-weight:700;margin-bottom:5px;">${error.message || 'Enhance hoyni!'}</p>
          <p style="font-size:0.75rem;opacity:0.6;color:var(--text);margin-bottom:15px;">API slow thakle kichu khon por try koro</p>
          <button onclick="handleEnhance()"
                  style="background:var(--primary);color:#000;border:none;padding:10px 25px;
                         border-radius:10px;font-weight:900;cursor:pointer;">
            <i class="fas fa-redo"></i> Try Again
          </button>
        </div>
      `;
      if (typeof showNotification === 'function') showNotification("❌ Enhance hoyni. Try again!", "error");
    } finally {
      btn.disabled = false;
      btn.innerHTML = `<i class="fas fa-wand-magic-sparkles"></i> ENHANCE IMAGE`;
    }
  };

  window.saifResetEnhancer = function () {
    document.getElementById('enhancePreview').style.display = 'none';
    document.getElementById('enhanceDropZone').style.display = 'block';
    document.getElementById('enhanceResult').innerHTML = '';
    document.getElementById('enhanceFileInput').value = '';
    document.getElementById('enhancePreviewImg').src = '';
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', injectUI);
  else injectUI();

  console.log('[Saif Plugin: imageenhancer] Loaded ✅');
})();
