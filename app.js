/* =============================================
   STATE
   ============================================= */
let experiences = [];
let educations = [];
let skills = [];
let languages = [];
let photoBase64 = null;
let previewVisible = true;
let expCounter = 0;
let eduCounter = 0;
let skillCounter = 0;
let langCounter = 0;

/* =============================================
   THEME COLORS
   ============================================= */
const THEMES = {
  blue: { primary: '#1e40af', dark: '#1e3a5f', light: '#dbeafe', accent: '#3b82f6' },
  green: { primary: '#0f766e', dark: '#134e4a', light: '#ccfbf1', accent: '#14b8a6' },
  red: { primary: '#be123c', dark: '#881337', light: '#ffe4e6', accent: '#f43f5e' },
  purple: { primary: '#7c3aed', dark: '#4c1d95', light: '#ede9fe', accent: '#8b5cf6' },
};

function getTheme() {
  const radio = document.querySelector('input[name="theme"]:checked');
  return THEMES[radio ? radio.value : 'blue'];
}

/* =============================================
   ESCAPE HTML
   ============================================= */
function esc(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* =============================================
   PHOTO
   ============================================= */
function handlePhoto(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    photoBase64 = e.target.result;
    const img = document.getElementById('photoImg');
    img.src = photoBase64;
    img.style.display = 'block';
    document.getElementById('photoPreviewWrap').style.display = 'none';
    updatePreview();
  };
  reader.readAsDataURL(file);
}

/* =============================================
   ADD / REMOVE DYNAMIC ITEMS
   ============================================= */
function addExperience() {
  const id = ++expCounter;
  experiences.push({ id, title: '', company: '', location: '', from: '', to: '', description: '' });
  renderExperience(id);
  updatePreview();
}
function renderExperience(id) {
  const container = document.getElementById('experiences-container');
  const div = document.createElement('div');
  div.className = 'dynamic-item';
  div.id = `exp-${id}`;
  div.innerHTML = `
    <button class="item-remove" onclick="removeItem('exp',${id},'experiences')" title="Supprimer">✕</button>
    <div class="form-grid" style="margin-top:4px">
      <div class="form-group">
        <label>Poste / Titre</label>
        <input type="text" placeholder="Developpeur Frontend" oninput="updateField('experiences',${id},'title',this.value)" />
      </div>
      <div class="form-group">
        <label>Entreprise</label>
        <input type="text" placeholder="Google" oninput="updateField('experiences',${id},'company',this.value)" />
      </div>
      <div class="form-group">
        <label>Localisation</label>
        <input type="text" placeholder="Paris" oninput="updateField('experiences',${id},'location',this.value)" />
      </div>
      <div class="form-group" style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
        <div>
          <label>De</label>
          <input type="text" placeholder="Jan 2020" oninput="updateField('experiences',${id},'from',this.value)" />
        </div>
        <div>
          <label>A</label>
          <input type="text" placeholder="Present" oninput="updateField('experiences',${id},'to',this.value)" />
        </div>
      </div>
      <div class="form-group full">
        <label>Description</label>
        <textarea rows="3" placeholder="Decrivez vos missions et realisations..." oninput="updateField('experiences',${id},'description',this.value)"></textarea>
      </div>
    </div>`;
  container.appendChild(div);
}

function addEducation() {
  const id = ++eduCounter;
  educations.push({ id, degree: '', school: '', year: '', description: '' });
  renderEducation(id);
  updatePreview();
}
function renderEducation(id) {
  const container = document.getElementById('educations-container');
  const div = document.createElement('div');
  div.className = 'dynamic-item';
  div.id = `edu-${id}`;
  div.innerHTML = `
    <button class="item-remove" onclick="removeItem('edu',${id},'educations')" title="Supprimer">✕</button>
    <div class="form-grid" style="margin-top:4px">
      <div class="form-group">
        <label>Diplome</label>
        <input type="text" placeholder="Master Informatique" oninput="updateField('educations',${id},'degree',this.value)" />
      </div>
      <div class="form-group">
        <label>Ecole / Universite</label>
        <input type="text" placeholder="Universite Paris Saclay" oninput="updateField('educations',${id},'school',this.value)" />
      </div>
      <div class="form-group">
        <label>Annee</label>
        <input type="text" placeholder="2018 - 2020" oninput="updateField('educations',${id},'year',this.value)" />
      </div>
      <div class="form-group">
        <label>Mention / Details</label>
        <input type="text" placeholder="Mention Tres Bien" oninput="updateField('educations',${id},'description',this.value)" />
      </div>
    </div>`;
  container.appendChild(div);
}

function addSkill() {
  const id = ++skillCounter;
  skills.push({ id, name: '', level: 3 });
  renderSkill(id);
  updatePreview();
}
function renderSkill(id) {
  const container = document.getElementById('skills-container');
  const div = document.createElement('div');
  div.className = 'dynamic-item';
  div.id = `skill-${id}`;
  div.innerHTML = `
    <button class="item-remove" onclick="removeItem('skill',${id},'skills')" title="Supprimer">✕</button>
    <div class="form-grid" style="margin-top:4px">
      <div class="form-group">
        <label>Competence</label>
        <input type="text" placeholder="JavaScript" oninput="updateField('skills',${id},'name',this.value)" />
      </div>
      <div class="form-group">
        <label>Niveau (cliquer sur les cercles)</label>
        <div class="skill-stars" id="stars-${id}">
          ${[1, 2, 3, 4, 5].map(i => `<span class="star ${i <= 3 ? 'active' : ''}" onclick="setSkillLevel(${id},${i})" title="Niveau ${i}">${i}</span>`).join('')}
        </div>
      </div>
    </div>`;
  container.appendChild(div);
}

function setSkillLevel(id, level) {
  updateField('skills', id, 'level', level);
  const stars = document.querySelectorAll(`#stars-${id} .star`);
  stars.forEach((s, i) => s.classList.toggle('active', i < level));
}

function addLanguage() {
  const id = ++langCounter;
  languages.push({ id, name: '', level: 'Intermediaire' });
  renderLanguage(id);
  updatePreview();
}
function renderLanguage(id) {
  const container = document.getElementById('languages-container');
  const div = document.createElement('div');
  div.className = 'dynamic-item';
  div.id = `lang-${id}`;
  div.innerHTML = `
    <button class="item-remove" onclick="removeItem('lang',${id},'languages')" title="Supprimer">✕</button>
    <div class="form-grid" style="margin-top:4px">
      <div class="form-group">
        <label>Langue</label>
        <input type="text" placeholder="Anglais" oninput="updateField('languages',${id},'name',this.value)" />
      </div>
      <div class="form-group">
        <label>Niveau</label>
        <select onchange="updateField('languages',${id},'level',this.value)">
          <option>Debutant</option>
          <option>Intermediaire</option>
          <option>Avance</option>
          <option selected>Courant</option>
          <option>Bilingue</option>
          <option>Langue maternelle</option>
        </select>
      </div>
    </div>`;
  container.appendChild(div);
}

function updateField(arr, id, field, value) {
  const list = arr === 'experiences' ? experiences
    : arr === 'educations' ? educations
      : arr === 'skills' ? skills
        : languages;
  const obj = list.find(x => x.id === id);
  if (obj) obj[field] = value;
  updatePreview();
}

function removeItem(prefix, id, arr) {
  document.getElementById(`${prefix}-${id}`)?.remove();
  if (arr === 'experiences') experiences = experiences.filter(x => x.id !== id);
  else if (arr === 'educations') educations = educations.filter(x => x.id !== id);
  else if (arr === 'skills') skills = skills.filter(x => x.id !== id);
  else languages = languages.filter(x => x.id !== id);
  updatePreview();
}

/* =============================================
   THEME PICKER UI
   ============================================= */
document.querySelectorAll('input[name="theme"]').forEach(radio => {
  radio.addEventListener('change', () => {
    document.querySelectorAll('.theme-option').forEach(l => l.classList.remove('active'));
    radio.parentElement.classList.add('active');
    updatePreview();
  });
});

/* =============================================
   PREVIEW TOGGLE
   ============================================= */
function togglePreview() {
  previewVisible = !previewVisible;
  const panel = document.getElementById('previewPanel');
  const btn = document.getElementById('previewToggle');
  if (previewVisible) {
    panel.classList.remove('hidden');
    btn.textContent = 'Apercu';
  } else {
    panel.classList.add('hidden');
    btn.textContent = 'Apercu (cache)';
  }
}

/* =============================================
   COLLECT FORM DATA
   ============================================= */
function collectData() {
  const radio = document.querySelector('input[name="theme"]:checked');
  return {
    firstName: document.getElementById('firstName').value.trim(),
    lastName: document.getElementById('lastName').value.trim(),
    jobTitle: document.getElementById('jobTitle').value.trim(),
    email: document.getElementById('email').value.trim(),
    phone: document.getElementById('phone').value.trim(),
    address: document.getElementById('address').value.trim(),
    linkedin: document.getElementById('linkedin').value.trim(),
    website: document.getElementById('website').value.trim(),
    summary: document.getElementById('summary').value.trim(),
    photo: photoBase64,
    theme: radio ? radio.value : 'blue',
    experiences: experiences.map(({ id, ...r }) => r),
    educations: educations.map(({ id, ...r }) => r),
    skills: skills.map(({ id, ...r }) => r),
    languages: languages.map(({ id, ...r }) => r),
  };
}

/* =============================================
   BUILD CV HTML (used by preview AND pdf)
   ============================================= */
function buildCVHTML(data, theme, forPdf) {
  const fullName = (esc(data.firstName) + ' ' + esc(data.lastName)).trim();

  const photoHtml = data.photo
    ? `<div style="text-align:center;margin-bottom:16px;">
         <img src="${data.photo}" style="width:80px;height:80px;border-radius:50%;object-fit:cover;border:3px solid rgba(255,255,255,0.5);" crossorigin="anonymous"/>
       </div>`
    : '';

  const sideTitle = (label) =>
    `<div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:2px;opacity:0.7;
     border-bottom:1px solid rgba(255,255,255,0.25);padding-bottom:5px;margin:18px 0 10px;">${label}</div>`;

  let skillsHtml = '';
  if (data.skills.some(s => s.name)) {
    skillsHtml = sideTitle('Competences');
    data.skills.forEach(s => {
      if (!s.name) return;
      const dots = [1, 2, 3, 4, 5].map(i =>
        `<span style="display:inline-block;width:9px;height:9px;border-radius:50%;
         background:${i <= s.level ? theme.accent : '#cbd5e1'};margin-right:3px;"></span>`
      ).join('');
      skillsHtml += `<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:7px;font-size:11px;">
        <span>${esc(s.name)}</span><span>${dots}</span></div>`;
    });
  }

  let langsHtml = '';
  if (data.languages.some(l => l.name)) {
    langsHtml = sideTitle('Langues');
    data.languages.forEach(l => {
      if (!l.name) return;
      langsHtml += `<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:7px;font-size:11px;">
        <span>${esc(l.name)}</span>
        <span style="background:rgba(255,255,255,0.2);padding:1px 7px;border-radius:10px;font-size:9px;">${esc(l.level)}</span>
      </div>`;
    });
  }

  const mainTitle = (label) =>
    `<div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;
     color:${theme.primary};border-bottom:2px solid ${theme.light};padding-bottom:5px;margin:20px 0 12px;">${label}</div>`;

  let expHtml = '';
  if (data.experiences.some(e => e.title || e.company)) {
    expHtml = mainTitle('Experiences professionnelles');
    data.experiences.forEach(e => {
      if (!e.title && !e.company) return;
      const dateStr = (e.from || e.to) ? `${esc(e.from)} &ndash; ${esc(e.to || 'Present')}` : '';
      expHtml += `<div style="margin-bottom:12px;">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;">
          <div style="font-size:12px;font-weight:700;color:#1e293b;">${esc(e.title)}</div>
          <div style="font-size:10px;color:#64748b;white-space:nowrap;margin-left:6px;">${dateStr}</div>
        </div>
        <div style="font-size:10.5px;font-weight:600;color:${theme.primary};margin:2px 0 4px;">
          ${esc(e.company)}${e.location ? ' &middot; ' + esc(e.location) : ''}</div>
        <div style="font-size:10.5px;color:#475569;line-height:1.5;">${esc(e.description).replace(/\n/g, '<br>')}</div>
      </div>`;
    });
  }

  let eduHtml = '';
  if (data.educations.some(e => e.degree || e.school)) {
    eduHtml = mainTitle('Formations');
    data.educations.forEach(e => {
      if (!e.degree && !e.school) return;
      eduHtml += `<div style="margin-bottom:12px;">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;">
          <div style="font-size:12px;font-weight:700;color:#1e293b;">${esc(e.degree)}</div>
          <div style="font-size:10px;color:#64748b;white-space:nowrap;margin-left:6px;">${esc(e.year)}</div>
        </div>
        <div style="font-size:10.5px;font-weight:600;color:${theme.primary};margin:2px 0 4px;">${esc(e.school)}</div>
        <div style="font-size:10.5px;color:#475569;">${esc(e.description)}</div>
      </div>`;
    });
  }

  const summaryHtml = data.summary
    ? mainTitle('Profil') + `<div style="font-size:11.5px;color:#475569;line-height:1.6;">${esc(data.summary).replace(/\n/g, '<br>')}</div>`
    : '';

  const contactItem = (icon, val) => val
    ? `<div style="font-size:10.5px;margin-bottom:6px;opacity:0.9;word-break:break-all;">${icon} ${esc(val)}</div>`
    : '';

  return `<div style="display:table;width:100%;font-family:Arial,Helvetica,sans-serif;color:#fff;">
    <div style="display:table-cell;width:33%;background:${theme.primary};padding:28px 18px;vertical-align:top;">
      ${photoHtml}
      <div style="font-size:20px;font-weight:800;line-height:1.2;margin-bottom:3px;">${fullName}</div>
      <div style="font-size:11px;opacity:0.8;margin-bottom:18px;">${esc(data.jobTitle)}</div>
      ${sideTitle('Contact')}
      ${contactItem('&#9993;', data.email)}
      ${contactItem('&#9990;', data.phone)}
      ${contactItem('&#8962;', data.address)}
      ${data.linkedin ? contactItem('in', data.linkedin) : ''}
      ${data.website ? contactItem('&#127760;', data.website) : ''}
      ${skillsHtml}
      ${langsHtml}
    </div>
    <div style="display:table-cell;width:67%;padding:28px 22px;background:#fff;vertical-align:top;color:#1e293b;">
      ${summaryHtml}
      ${expHtml}
      ${eduHtml}
    </div>
  </div>`;
}

/* =============================================
   LIVE PREVIEW
   ============================================= */
function updatePreview() {
  if (!previewVisible) return;
  const data = collectData();
  const theme = THEMES[data.theme] || THEMES.blue;
  const preview = document.getElementById('cvPreview');

  const fullName = (data.firstName + ' ' + data.lastName).trim();
  if (!fullName) {
    preview.innerHTML = '<div class="cv-placeholder">Commencez a remplir le formulaire pour voir l\'apercu de votre CV</div>';
    return;
  }

  preview.innerHTML = buildCVHTML(data, theme, false);
}

/* =============================================
   GENERATE PDF (100% client-side: html2canvas + jsPDF)
   No server required — works on GitHub Pages
   ============================================= */
async function generatePDF() {
  const data = collectData();
  if (!data.firstName && !data.lastName) {
    alert('Veuillez renseigner au moins votre prenom ou nom.');
    return;
  }

  const overlay = document.getElementById('loadingOverlay');
  const dlBtn = document.getElementById('downloadBtn');
  const genBtn = document.getElementById('generateBtn');
  overlay.classList.add('active');
  dlBtn.disabled = true;
  if (genBtn) genBtn.disabled = true;

  try {
    const theme = THEMES[data.theme] || THEMES.blue;

    // Build a hidden A4 container
    const container = document.createElement('div');
    container.style.cssText =
      'position:fixed;left:-9999px;top:0;width:794px;background:#fff;' +
      'font-family:Arial,Helvetica,sans-serif;z-index:-1;';
    container.innerHTML = buildCVHTML(data, theme, true);
    document.body.appendChild(container);

    // Let images render
    await new Promise(r => requestAnimationFrame(r));
    await new Promise(r => setTimeout(r, 400));

    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: 794,
      windowWidth: 794,
    });

    document.body.removeChild(container);

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });

    const pageW = pdf.internal.pageSize.getWidth();   // ~595pt
    const pageH = pdf.internal.pageSize.getHeight();  // ~842pt
    const ratio = pageW / canvas.width;
    const scaledH = canvas.height * ratio;

    const imgData = canvas.toDataURL('image/jpeg', 0.95);

    if (scaledH <= pageH) {
      pdf.addImage(imgData, 'JPEG', 0, 0, pageW, scaledH);
    } else {
      // Multi-page support
      let posY = 0;
      while (posY < scaledH) {
        if (posY > 0) pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, -posY, pageW, scaledH);
        posY += pageH;
      }
    }

    const fn = data.firstName || 'cv';
    const ln = data.lastName || '';
    pdf.save(`CV_${fn}_${ln}.pdf`);

  } catch (err) {
    alert('Erreur lors de la generation du PDF :\n' + err.message);
    console.error(err);
  } finally {
    overlay.classList.remove('active');
    dlBtn.disabled = false;
    if (genBtn) genBtn.disabled = false;
  }
}

/* =============================================
   INIT
   ============================================= */
window.addEventListener('DOMContentLoaded', () => {
  addExperience();
  addEducation();
  addSkill();
  addLanguage();
  updatePreview();
});
