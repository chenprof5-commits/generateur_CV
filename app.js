/* =============================================
   STATE
   ============================================= */
let experiences = [];
let educations  = [];
let skills      = [];
let languages   = [];
let photoBase64 = null;
let previewVisible = true;
let expCounter  = 0;
let eduCounter  = 0;
let skillCounter = 0;
let langCounter = 0;

/* =============================================
   THEME COLORS
   ============================================= */
const THEMES = {
  blue:   { primary: '#1e40af', dark: '#1e3a5f', light: '#dbeafe', accent: '#3b82f6' },
  green:  { primary: '#0f766e', dark: '#134e4a', light: '#ccfbf1', accent: '#14b8a6' },
  red:    { primary: '#be123c', dark: '#881337', light: '#ffe4e6', accent: '#f43f5e' },
  purple: { primary: '#7c3aed', dark: '#4c1d95', light: '#ede9fe', accent: '#8b5cf6' },
};

function getTheme() {
  const radio = document.querySelector('input[name="theme"]:checked');
  return THEMES[radio ? radio.value : 'blue'];
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
        <input type="text" placeholder="Développeur Frontend" oninput="updateField('experiences',${id},'title',this.value)" />
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
          <label>À</label>
          <input type="text" placeholder="Présent" oninput="updateField('experiences',${id},'to',this.value)" />
        </div>
      </div>
      <div class="form-group full">
        <label>Description</label>
        <textarea rows="3" placeholder="Décrivez vos missions et réalisations..." oninput="updateField('experiences',${id},'description',this.value)"></textarea>
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
        <label>Diplôme</label>
        <input type="text" placeholder="Master Informatique" oninput="updateField('educations',${id},'degree',this.value)" />
      </div>
      <div class="form-group">
        <label>École / Université</label>
        <input type="text" placeholder="Université Paris Saclay" oninput="updateField('educations',${id},'school',this.value)" />
      </div>
      <div class="form-group">
        <label>Année</label>
        <input type="text" placeholder="2018 – 2020" oninput="updateField('educations',${id},'year',this.value)" />
      </div>
      <div class="form-group">
        <label>Mention / Détails</label>
        <input type="text" placeholder="Mention Très Bien" oninput="updateField('educations',${id},'description',this.value)" />
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
        <label>Compétence</label>
        <input type="text" placeholder="JavaScript" oninput="updateField('skills',${id},'name',this.value)" />
      </div>
      <div class="form-group">
        <label>Niveau (cliquer sur les cercles)</label>
        <div class="skill-stars" id="stars-${id}">
          ${[1,2,3,4,5].map(i=>`<span class="star ${i<=3?'active':''}" onclick="setSkillLevel(${id},${i})" title="Niveau ${i}">${i}</span>`).join('')}
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
  languages.push({ id, name: '', level: 'Intermédiaire' });
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
          <option>Débutant</option>
          <option>Intermédiaire</option>
          <option>Avancé</option>
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
  const btn   = document.getElementById('previewToggle');
  if (previewVisible) {
    panel.classList.remove('hidden');
    btn.textContent = '👁 Aperçu';
  } else {
    panel.classList.add('hidden');
    btn.textContent = '👁 Aperçu (caché)';
  }
}

/* =============================================
   COLLECT FORM DATA
   ============================================= */
function collectData() {
  const radio = document.querySelector('input[name="theme"]:checked');
  return {
    firstName:   document.getElementById('firstName').value.trim(),
    lastName:    document.getElementById('lastName').value.trim(),
    jobTitle:    document.getElementById('jobTitle').value.trim(),
    email:       document.getElementById('email').value.trim(),
    phone:       document.getElementById('phone').value.trim(),
    address:     document.getElementById('address').value.trim(),
    linkedin:    document.getElementById('linkedin').value.trim(),
    website:     document.getElementById('website').value.trim(),
    summary:     document.getElementById('summary').value.trim(),
    photo:       photoBase64,
    theme:       radio ? radio.value : 'blue',
    experiences: experiences.map(({id,...r})=>r),
    educations:  educations.map(({id,...r})=>r),
    skills:      skills.map(({id,...r})=>r),
    languages:   languages.map(({id,...r})=>r),
  };
}

/* =============================================
   LIVE PREVIEW
   ============================================= */
function esc(str) {
  if (!str) return '';
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function updatePreview() {
  if (!previewVisible) return;
  const data  = collectData();
  const theme = THEMES[data.theme] || THEMES.blue;
  const preview = document.getElementById('cvPreview');

  const fullName = `${esc(data.firstName)} ${esc(data.lastName)}`.trim();
  if (!fullName) {
    preview.innerHTML = '<div class="cv-placeholder">✏️ Commencez à remplir le formulaire pour voir l\'aperçu de votre CV</div>';
    return;
  }

  // Photo
  let photoHtml = '';
  if (data.photo) {
    photoHtml = `<div class="cv-photo-wrap"><img class="cv-photo" src="${data.photo}" alt="Photo" /></div>`;
  }

  // Skills
  let skillsHtml = '';
  if (data.skills.length) {
    skillsHtml = `<div class="cv-section-title">Compétences</div>`;
    data.skills.forEach(s => {
      if (!s.name) return;
      const dots = [1,2,3,4,5].map(i =>
        `<span class="cv-dot" style="background:${i<=s.level ? theme.accent : '#cbd5e1'}"></span>`
      ).join('');
      skillsHtml += `<div class="cv-skill-row"><span>${esc(s.name)}</span><div class="cv-skill-dots">${dots}</div></div>`;
    });
  }

  // Languages
  let langsHtml = '';
  if (data.languages.length) {
    langsHtml = `<div class="cv-section-title">Langues</div>`;
    data.languages.forEach(l => {
      if (!l.name) return;
      langsHtml += `<div class="cv-lang-row"><span>${esc(l.name)}</span><span class="cv-lang-badge">${esc(l.level)}</span></div>`;
    });
  }

  // Experiences
  let expHtml = '';
  if (data.experiences.length) {
    expHtml = `<div class="cv-main-title" style="color:${theme.primary};border-color:${theme.light}">Expériences professionnelles</div>`;
    data.experiences.forEach(e => {
      if (!e.title && !e.company) return;
      expHtml += `<div class="cv-item">
        <div class="cv-item-header">
          <div class="cv-item-title">${esc(e.title)}</div>
          <div class="cv-item-date">${esc(e.from)}${e.from||e.to?' – ':''}${esc(e.to||'Présent')}</div>
        </div>
        <div class="cv-item-sub" style="color:${theme.primary}">${esc(e.company)}${e.location?' · '+esc(e.location):''}</div>
        <div class="cv-item-desc">${esc(e.description).replace(/\n/g,'<br>')}</div>
      </div>`;
    });
  }

  // Educations
  let eduHtml = '';
  if (data.educations.length) {
    eduHtml = `<div class="cv-main-title" style="color:${theme.primary};border-color:${theme.light}">Formations</div>`;
    data.educations.forEach(e => {
      if (!e.degree && !e.school) return;
      eduHtml += `<div class="cv-item">
        <div class="cv-item-header">
          <div class="cv-item-title">${esc(e.degree)}</div>
          <div class="cv-item-date">${esc(e.year)}</div>
        </div>
        <div class="cv-item-sub" style="color:${theme.primary}">${esc(e.school)}</div>
        <div class="cv-item-desc">${esc(e.description)}</div>
      </div>`;
    });
  }

  // Summary
  const summaryHtml = data.summary
    ? `<div class="cv-main-title" style="color:${theme.primary};border-color:${theme.light}">Profil</div>
       <div class="cv-summary">${esc(data.summary).replace(/\n/g,'<br>')}</div>`
    : '';

  preview.innerHTML = `
  <div class="cv-wrap">
    <div class="cv-sidebar" style="background:${theme.primary}">
      ${photoHtml}
      <div class="cv-name">${fullName}</div>
      <div class="cv-jobtitle">${esc(data.jobTitle)}</div>
      <div class="cv-section-title">Contact</div>
      ${data.email    ? `<div class="cv-contact-item">✉ ${esc(data.email)}</div>` : ''}
      ${data.phone    ? `<div class="cv-contact-item">☎ ${esc(data.phone)}</div>` : ''}
      ${data.address  ? `<div class="cv-contact-item">⌂ ${esc(data.address)}</div>` : ''}
      ${data.linkedin ? `<div class="cv-contact-item">in ${esc(data.linkedin)}</div>` : ''}
      ${data.website  ? `<div class="cv-contact-item">🌐 ${esc(data.website)}</div>` : ''}
      ${skillsHtml}
      ${langsHtml}
    </div>
    <div class="cv-main">
      ${summaryHtml}
      ${expHtml}
      ${eduHtml}
    </div>
  </div>`;
}

/* =============================================
   GENERATE PDF
   ============================================= */
async function generatePDF() {
  const data = collectData();
  if (!data.firstName && !data.lastName) {
    alert('Veuillez renseigner au moins votre prénom ou nom.');
    return;
  }

  const overlay  = document.getElementById('loadingOverlay');
  const dlBtn    = document.getElementById('downloadBtn');
  const genBtn   = document.getElementById('generateBtn');
  overlay.classList.add('active');
  dlBtn.disabled = true;
  if (genBtn) genBtn.disabled = true;

  try {
    const response = await fetch('generate-pdf.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(err || `Erreur HTTP ${response.status}`);
    }

    const blob = await response.blob();
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    const firstName = data.firstName || 'cv';
    const lastName  = data.lastName  || '';
    a.href     = url;
    a.download = `CV_${firstName}_${lastName}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

  } catch (err) {
    alert('Erreur lors de la génération du PDF :\n' + err.message);
    console.error(err);
  } finally {
    overlay.classList.remove('active');
    dlBtn.disabled = false;
    if (genBtn) genBtn.disabled = false;
  }
}

/* =============================================
   INIT — pre-populate one item each
   ============================================= */
window.addEventListener('DOMContentLoaded', () => {
  addExperience();
  addEducation();
  addSkill();
  addLanguage();
  updatePreview();
});
