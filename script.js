// --- GERADOR DE VIDEOS UGC TIKTOK SHOP (by Nicolas Lima) ---
const STORAGE_KEY_API_KEY = 'ugc_gemini_api_key';
const STORAGE_KEY_PROJECTS = 'ugc_projects_list';
const STORAGE_KEY_SUPABASE_URL = 'ugc_supabase_url';
const STORAGE_KEY_SUPABASE_KEY = 'ugc_supabase_key';
let supabaseClient = null;
let apiKey = localStorage.getItem(STORAGE_KEY_API_KEY) || '';
let currentView = 'home';
let currentProjectId = null;

function initSupabase() {
  const DEFAULT_URL = 'https://gbucaafkdssbldqndhog.supabase.co';
  const DEFAULT_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdidWNhYWZrZHNzYmxkcW5kaG9nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc0MTM4MDYsImV4cCI6MjEwMjk4OTgwNn0.1BRXlI2bD071fDEGHmkzb8nTB5azV_bKAnlhOvRP3QQ';
  const url = localStorage.getItem(STORAGE_KEY_SUPABASE_URL) || DEFAULT_URL;
  const key = localStorage.getItem(STORAGE_KEY_SUPABASE_KEY) || DEFAULT_KEY;
  if (url && key && window.supabase) {
    try { supabaseClient = window.supabase.createClient(url, key); updateSupabaseBadge(true); return true; } catch(e) { updateSupabaseBadge(false); return false; }
  }
  updateSupabaseBadge(false);
  return false;
}
function updateSupabaseBadge(connected) {
  const el = document.getElementById('supabaseStatusBadge');
  if (!el) return;
  el.textContent = connected ? 'Conectado' : 'Desconectado';
  el.className = connected ? 'text-[10px] font-mono text-emerald-400' : 'text-[10px] font-mono text-slate-400';
}
async function syncProjectsFromSupabase() {
  if (!supabaseClient) return;
  try {
    const { data, error } = await supabaseClient.from('projects').select('*').order('created_at');
    if (error) { console.warn('Supabase load', error.message); return; }
    if (data && data.length > 0) {
      const mapped = data.map(r => ({ id: r.id, folder: r.folder, name: r.name, description: r.description, images: Array.isArray(r.images) ? r.images : JSON.parse(r.images||'[]'), generatedIdeas: [] }));
      // carrega ideias de cada projeto
      for (const proj of mapped) {
        try {
          const { data: ideas } = await supabaseClient.from('generated_ideas').select('*').eq('project_id', proj.id).order('idx');
          if (ideas && ideas.length) proj.generatedIdeas = ideas.map(it => ({ title: it.title, hook: it.hook, povAction: it.pov_action, googleFlowPrompt: it.google_flow_prompt, recommendedImages: it.recommended_images }));
        } catch(e){}
      }
      projects = mapped;
      localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(projects));
      renderSidebarProjects(); renderHomeDashboard();
      if (currentView === 'generator' && currentProjectId) { const pr = projects.find(x=>x.id===currentProjectId); if(pr) renderProjectGenerator(pr); }
    }
  } catch(e){ console.warn(e); }
}
async function saveProjectToSupabase(proj) {
  if (!supabaseClient) return;
  try { await supabaseClient.from('projects').upsert({ id: proj.id, folder: proj.folder, name: proj.name, description: proj.description, images: proj.images }, { onConflict: 'id' }); } catch(e){ console.warn('saveProject', e.message); }
}
async function deleteProjectFromSupabase(projectId) {
  if (!supabaseClient) return;
  try { await supabaseClient.from('projects').delete().eq('id', projectId); await supabaseClient.from('generated_ideas').delete().eq('project_id', projectId); } catch(e){}
}
async function uploadImagesToSupabase(folder, files) {
  if (!supabaseClient || !files || files.length===0) return;
  for (const file of files) {
    try { await supabaseClient.storage.from('cap-images').upload(folder + '/' + file.name, file, { upsert: true, contentType: file.type }); } catch(e){ console.warn('upload', file.name, e.message); }
  }
}
async function saveIdeasToSupabase(proj) {
  if (!supabaseClient || !proj.generatedIdeas || !proj.generatedIdeas.length) return;
  try {
    await supabaseClient.from('generated_ideas').delete().eq('project_id', proj.id);
    const rows = proj.generatedIdeas.map((idea, idx) => ({ project_id: proj.id, idx: idx, title: idea.title, hook: idea.hook, pov_action: idea.povAction, google_flow_prompt: idea.googleFlowPrompt, recommended_images: idea.recommendedImages }));
    // insere em lotes de 20 para nao estourar
    for (let i=0;i<rows.length;i+=20){ await supabaseClient.from('generated_ideas').insert(rows.slice(i,i+20)); }
  } catch(e){ console.warn('saveIdeas', e.message); }
}
function supabasePublicUrl(folder, filename) {
  return 'https://gbucaafkdssbldqndhog.supabase.co/storage/v1/object/public/cap-images/' + folder + '/' + encodeURIComponent(filename);
}

let projects = [
  {
    id: 'saobento',
    folder: 'saobento',
    name: 'Bone Trucker Medalha de Sao Bento',
    description: 'Suede aveludado premium, tela trucker respirável, fecho snapback, patch circular em alto-relevo 3D da Medalha de Sao Bento e bordado cursivo dourado na aba "A Cruz Sagrada seja a minha luz".',
    images: ["exec-0d9c9a19-a56b-43f2-8182-e936b42e033e.png","exec-114ed2fd-1f47-40b3-8558-809a42122a36.png","exec-2069abf8-63e3-41ce-8dcd-c483ead38a68.png","exec-290125a1-6c9f-4948-a465-a03f4c400174.png","exec-34aef719-4ad2-4e2d-95d5-a76e9bcbcf66.png","exec-3e19cdc7-8876-4811-935f-35080702f5da.png","exec-4c2cdb51-5d33-471e-b9e9-28dfe8415638.png","exec-4f41771f-4fd3-4556-a94e-5c4bca318f41.png","exec-674b274e-df68-48c7-b6f3-312cea5a5c83.png","exec-805fb9df-13c5-451e-8242-3c9819f47dfc.png","exec-88ec0d62-2e7e-46b5-bd9b-4503e6deab68.png","exec-8a9dd791-8346-4f7c-bc91-70318dfd6966.png","exec-8dbf9071-108c-4175-bf9c-51139bfdb8a7.png","exec-8dfe9038-278c-4595-9775-83602823715a.png","exec-aa71bd27-96d3-4a24-bb0b-98820f11c463.png","exec-ae342a02-e0f3-4495-87e4-52a72e4b154f.png","exec-bc31f8dd-6fb4-494a-8109-9e7acb6f8e05.png","exec-c0fb5dc9-f355-423c-952c-34d20c7d4cac.png","exec-c87923d8-9a8f-4615-b0de-c2cb76662158.png","exec-d39e57af-67ed-4807-abe6-ac3073e57afa.png","exec-d7c882cd-7d3a-4620-83a4-76f253fd427b.png","exec-dc978fed-be8c-4be4-81b3-02bfecf52135.png","exec-df1c891b-4eb7-4fec-9a8b-a0cfffac1378.png","exec-df1f01f4-ce6c-40f6-baa5-08ad0a986baf.png","exec-e0fe7166-6544-472b-a043-ec42835e383a.png","exec-e6b8dace-3e6c-4195-941a-fcc19335f48c.png","exec-ec2af7d7-b3c1-477f-aede-37a38afe4392.png","exec-f3b7f460-7319-450f-a2b9-46e3454940ac.png","exec-fe0bb707-5daf-42ab-b4e5-f6d43d4f7483.png"],
    generatedIdeas: []
  },
  {
    id: 'abacurvapatch',
    folder: 'abacurvapatch',
    name: 'Bone Rancho Forte Country Aba Curva Patch',
    description: 'BONE RANCHO FORTE COUNTRY PREMIUM PATCH RF - Estrutura firme, visual sofisticado. Copa fechada, aba curva em couro sintetico texturizado e patch frontal em couro com logo RF. Fechamento ajustavel em velcro.',
    images: ["img1black.jfif","img1white.jfif","img2black.jfif","img2white.jfif","img3black.jfif","img3white.jfif","sg-11134201-82598-mqi105jooiku7f_tn.jfif"],
    generatedIdeas: []
  }
];

document.addEventListener('DOMContentLoaded', () => {
  const savedKey = localStorage.getItem(STORAGE_KEY_API_KEY);
  if (savedKey) apiKey = savedKey;
  const savedProjects = localStorage.getItem(STORAGE_KEY_PROJECTS);
  if (savedProjects) {
    try {
      const parsed = JSON.parse(savedProjects);
      // migracao: garante que saobento/abacurvapatch tenham imagens corretas se vazias
      projects = parsed;
    } catch(e) {}
  }
  initSupabase();
  renderSidebarProjects();
  renderHomeDashboard();
  syncProjectsFromSupabase();
  lucide.createIcons();
  document.getElementById('openSidebarBtn').addEventListener('click', () => {
    document.getElementById('sidebar').classList.remove('-translate-x-full');
  });
  document.getElementById('closeSidebarBtn').addEventListener('click', () => {
    document.getElementById('sidebar').classList.add('-translate-x-full');
  });
  document.getElementById('generatePromptsBtn').addEventListener('click', generateUgcPrompts);
});

function switchView(view, projectId = null) {
  currentView = view;
  currentProjectId = projectId;
  const homeView = document.getElementById('homeView');
  const projectView = document.getElementById('projectGeneratorView');
  const breadcrumb = document.getElementById('breadcrumb');
  const navHomeBtn = document.getElementById('navHomeBtn');
  document.getElementById('sidebar').classList.add('-translate-x-full');
  if (view === 'home') {
    homeView.classList.remove('hidden');
    projectView.classList.add('hidden');
    breadcrumb.innerHTML = '<span>Dashboard</span>';
    navHomeBtn.className = "w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold bg-cardBg text-caramel shadow-sm";
    renderHomeDashboard();
  } else if (view === 'generator' && projectId) {
    homeView.classList.add('hidden');
    projectView.classList.remove('hidden');
    navHomeBtn.className = "w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:bg-cardHover hover:text-white transition-all";
    const proj = projects.find(p => p.id === projectId);
    if (proj) {
      breadcrumb.innerHTML = '<span class="text-slate-400">Dashboard</span> <i data-lucide="chevron-right" class="w-3.5 h-3.5 text-slate-500"></i> <span class="text-white">' + proj.name + '</span>';
      renderProjectGenerator(proj);
    }
  }
  renderSidebarProjects();
  lucide.createIcons();
}

function renderSidebarProjects() {
  const navList = document.getElementById('projectNavList');
  navList.innerHTML = projects.map(proj => {
    const isActive = currentView === 'generator' && currentProjectId === proj.id;
    return '<div class="flex items-center gap-1"><button onclick="switchView(\'generator\', \'' + proj.id + '\')" class="flex-1 flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ' + (isActive ? 'bg-caramel/15 text-caramel border border-caramel/30 font-semibold' : 'text-slate-400 hover:bg-cardHover hover:text-white') + '"><i data-lucide="folder" class="w-4 h-4 text-caramel shrink-0"></i><span class="truncate">' + proj.name + '</span></button><button onclick="event.stopPropagation(); deleteProject(\'' + proj.id + '\')" class="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10" title="Apagar pasta"><i data-lucide="trash-2" class="w-3.5 h-3.5"></i></button></div>';
  }).join('');
}

function renderHomeDashboard() {
  const grid = document.getElementById('projectsGrid');
  if (projects.length === 0) {
    grid.innerHTML = '<p class="text-xs text-slate-500 col-span-full">Nenhuma pasta cadastrada ainda. Clique em Adicionar Nova Pasta.</p>';
    return;
  }
  grid.innerHTML = projects.map(proj => '<div class="glass-panel rounded-2xl p-6 hover:border-caramel/50 transition-all group flex flex-col justify-between"><div onclick="switchView(\'generator\', \'' + proj.id + '\')" class="cursor-pointer"><div class="flex items-center justify-between mb-3"><span class="px-2 py-0.5 text-[10px] font-bold rounded bg-tiktokCyan/10 text-tiktokCyan border border-tiktokCyan/20 uppercase font-mono">/' + proj.folder + '</span><span class="text-xs text-slate-400 flex items-center space-x-1"><i data-lucide="images" class="w-3.5 h-3.5 text-caramel"></i><span>' + proj.images.length + ' fotos</span></span></div><h4 class="text-base font-bold text-white group-hover:text-caramel transition-colors mb-2">' + proj.name + '</h4><p class="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">' + proj.description + '</p></div><div class="flex items-center justify-between pt-4 border-t border-borderSubtle"><button onclick="switchView(\'generator\', \'' + proj.id + '\')" class="text-xs font-semibold text-caramel flex items-center gap-1">Abrir gerador <i data-lucide="arrow-right" class="w-4 h-4"></i></button><button onclick="event.stopPropagation(); deleteProject(\'' + proj.id + '\')" class="px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-semibold hover:bg-rose-500/20">Apagar</button></div></div>').join('');
  lucide.createIcons();
}

function renderProjectGenerator(proj) {
  document.getElementById('projBadge').textContent = 'Pasta: /' + proj.folder;
  document.getElementById('projImageCount').textContent = proj.images.length + ' imagens mapeadas';
  document.getElementById('projTitle').textContent = proj.name;
  document.getElementById('projDesc').textContent = proj.description;
  document.getElementById('libraryTitle').textContent = 'Banco de Imagens - Pasta /' + proj.folder + ' (' + proj.images.length + ' itens)';

  let cache = {};
  try { cache = JSON.parse(localStorage.getItem('ugc_image_cache_' + proj.folder) || '{}'); } catch(e) {}

  const imgGrid = document.getElementById('imageGrid');
  if (proj.images.length === 0) {
    imgGrid.innerHTML = '<p class="text-xs text-slate-400 col-span-full p-4 border border-dashed border-borderSubtle rounded-xl text-center">Nenhuma imagem anexada nesta pasta. Anexe a pasta de fotos ao criar o projeto.</p>';
  } else {
    imgGrid.innerHTML = proj.images.map((img, idx) => {
      const imgSrc = cache[img] || supabasePublicUrl(proj.folder, img);
      return '<div class="relative bg-slateDark border border-borderSubtle rounded-xl overflow-hidden aspect-square flex items-center justify-center group" title="' + img + '"><img src="' + imgSrc + '" alt="' + img + '" class="w-full h-full object-cover group-hover:scale-105 transition-transform" loading="lazy" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\'"><div class="w-full h-full hidden items-center justify-center bg-obsidian text-[10px] text-slate-500 p-2 text-center flex-col"><span>Imagem nao encontrada</span><span class="font-mono text-caramel text-[9px] break-all">' + img + '</span></div><div class="absolute inset-0 bg-obsidian/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none"><span class="text-[9px] font-mono text-caramel font-bold">#' + (idx+1) + '</span></div></div>';
    }).join('');
  }

  const resultsSection = document.getElementById('resultsSection');
  if (proj.generatedIdeas && proj.generatedIdeas.length > 0) {
    renderVideoCards(proj.generatedIdeas);
  } else {
    resultsSection.innerHTML = '<div id="emptyState" class="text-center py-16 bg-cardBg/50 border border-borderSubtle rounded-2xl border-dashed"><div class="w-12 h-12 rounded-2xl bg-cardBg border border-borderSubtle flex items-center justify-center mx-auto mb-3 text-caramel"><i data-lucide="video" class="w-6 h-6"></i></div><h3 class="text-sm font-bold text-white mb-1">Nenhum roteiro gerado para esta pasta</h3><p class="text-xs text-slate-400 max-w-sm mx-auto mb-4">Clique em "Gerar 60 Prompts UGC (Gemini)" para criar os videos baseados nas imagens e detalhes deste bone.</p><button onclick="document.getElementById(\'generatePromptsBtn\').click()" class="px-4 py-2 bg-caramel text-obsidian font-bold text-xs rounded-xl hover:bg-caramelDark transition-all">Gerar Agora</button></div>';
  }
  lucide.createIcons();
}

function toggleImageLibrary() {
  const sec = document.getElementById('imageLibrarySection');
  const btnText = document.getElementById('libraryBtnText');
  sec.classList.toggle('hidden');
  btnText.textContent = sec.classList.contains('hidden') ? 'Ver Imagens' : 'Ocultar Imagens';
}

function openNewProjectModal() { document.getElementById('newProjectModal').classList.remove('hidden'); }
function closeNewProjectModal() { document.getElementById('newProjectModal').classList.add('hidden'); }
function openSettingsModal() {
  document.getElementById('apiKeyInput').value = apiKey;
  document.getElementById('supabaseUrlInput').value = localStorage.getItem(STORAGE_KEY_SUPABASE_URL) || '';
  document.getElementById('supabaseKeyInput').value = localStorage.getItem(STORAGE_KEY_SUPABASE_KEY) || '';
  document.getElementById('settingsModal').classList.remove('hidden');
  initSupabase();
}
function closeSettingsModal() { document.getElementById('settingsModal').classList.add('hidden'); }
function saveApiKey() { saveAllSettings(); }
function saveAllSettings() {
  const val = document.getElementById('apiKeyInput').value.trim();
  if (val) { apiKey = val; localStorage.setItem(STORAGE_KEY_API_KEY, apiKey); }
  const url = document.getElementById('supabaseUrlInput').value.trim();
  const key = document.getElementById('supabaseKeyInput').value.trim();
  if (url) localStorage.setItem(STORAGE_KEY_SUPABASE_URL, url);
  if (key) localStorage.setItem(STORAGE_KEY_SUPABASE_KEY, key);
  initSupabase();
  closeSettingsModal();
  showToast(supabaseClient ? 'Configuracoes salvas e Supabase conectado!' : 'Configuracoes salvas!', 'success');
}

function handleCreateProject(e) {
  e.preventDefault();
  const folder = document.getElementById('newProjFolder').value.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-_]/g,'');
  const name = document.getElementById('newProjName').value.trim();
  const description = document.getElementById('newProjDesc').value.trim();
  const fileInput = document.getElementById('newProjFiles');
  const folderInput = document.getElementById('newProjFolderFiles');
  const imagesRaw = document.getElementById('newProjImages').value.trim();

  let files = [];
  let rawFilesForUpload = [];
  if (folderInput && folderInput.files && folderInput.files.length > 0) {
    files = Array.from(folderInput.files).filter(f => f.type.startsWith('image/'));
    rawFilesForUpload = files.slice();
  } else if (fileInput.files && fileInput.files.length > 0) {
    files = Array.from(fileInput.files);
    rawFilesForUpload = files.slice();
  }

  if (files.length > 0) {
    const imageNames = files.map(f => f.name);
    window._pendingUploadFiles = rawFilesForUpload;
    let loadedCount = 0;
    const imageMap = {};
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = function(ev) {
        imageMap[file.name] = ev.target.result;
        loadedCount++;
        if (loadedCount === files.length) {
          finalizeProject(folder, name, description, imageNames, imageMap);
        }
      };
      reader.readAsDataURL(file);
    });
    return;
  }

  let images = [];
  if (imagesRaw) images = imagesRaw.split(/[\n,]+/).map(s => s.trim()).filter(Boolean);
  if (images.length === 0) {
    showToast('Anexe as imagens ou selecione a PASTA com as fotos para o Gemini ler.', 'error');
    return;
  }
  finalizeProject(folder, name, description, images, {});
}

function finalizeProject(folder, name, description, images, imageMap) {
  if (Object.keys(imageMap).length > 0) {
    if (!window.uploadedImageCache) window.uploadedImageCache = {};
    window.uploadedImageCache[folder] = imageMap;
    try { localStorage.setItem('ugc_image_cache_' + folder, JSON.stringify(imageMap)); } catch(e) { console.warn('Cache muito grande, imagens salvas em memoria'); }
  }
  const newProj = { id: folder + '-' + Date.now(), folder: folder, name: name, description: description, images: images, generatedIdeas: [] };
  projects.push(newProj);
  localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(projects));
  saveProjectToSupabase(newProj);
  if (window._pendingUploadFiles && window._pendingUploadFiles.length) {
    uploadImagesToSupabase(folder, window._pendingUploadFiles);
    window._pendingUploadFiles = null;
  }
  closeNewProjectModal();
  document.getElementById('newProjectForm').reset();
  renderSidebarProjects();
  switchView('generator', newProj.id);
  showToast('Pasta /' + folder + ' criada com ' + images.length + ' imagens! (Supabase sync)', 'success');
}

function deleteProject(projectId) {
  const proj = projects.find(p => p.id === projectId);
  if (!proj) return;
  if (!confirm('Apagar a pasta /' + proj.folder + ' (' + proj.name + ')? Esta acao nao pode ser desfeita e apagara as imagens em cache.')) return;
  projects = projects.filter(p => p.id !== projectId);
  localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(projects));
  try { localStorage.removeItem('ugc_image_cache_' + proj.folder); } catch(e){}
  deleteProjectFromSupabase(projectId);
  if (currentProjectId === projectId) {
    currentProjectId = null;
    switchView('home');
  } else {
    renderSidebarProjects();
    renderHomeDashboard();
  }
  showToast('Pasta /' + proj.folder + ' apagada. (Supabase)', 'success');
}
function deleteCurrentProject() {
  if (!currentProjectId) { showToast('Nenhuma pasta selecionada.', 'error'); return; }
  deleteProject(currentProjectId);
}


async function generateUgcPrompts() {
  if (!apiKey) { openSettingsModal(); showToast('Configure sua Gemini API Key primeiro.', 'error'); return; }
  const proj = projects.find(p => p.id === currentProjectId);
  if (!proj) return;
  if (!proj.images || proj.images.length === 0) { showToast('Esta pasta nao tem imagens anexadas. Anexe a pasta primeiro.', 'error'); return; }
  const loadingSection = document.getElementById('loadingSection');
  const resultsSection = document.getElementById('resultsSection');
  loadingSection.classList.remove('hidden');
  resultsSection.innerHTML = '';

  let cache = {};
  try { cache = JSON.parse(localStorage.getItem('ugc_image_cache_' + proj.folder) || '{}'); } catch(e) {}

  // Monta parts com imagens para Gemini Vision (inlineData)
  const imageParts = [];
  const maxImagesForVision = Math.min(6, proj.images.length);
  for (let i = 0; i < maxImagesForVision; i++) {
    const imgName = proj.images[i];
    const dataUrl = cache[imgName];
    if (dataUrl && dataUrl.startsWith('data:')) {
      const match = dataUrl.match(/^data:(.+);base64,(.+)$/);
      if (match) imageParts.push({ inlineData: { mimeType: match[1], data: match[2] } });
    }
  }

  const systemPrompt = 'Voce e o estrategista senior de TikTok Shop e Especialista em Criacao de Conteudo UGC para a marca sertaneja premium "Rancho Forte" (parceira Ondas Bones / Era Mato).\nProduto nesta pasta:\n- Nome: ' + proj.name + '\n- Pasta: ' + proj.folder + '\n- Descricao: ' + proj.description + '\n\nREGRAS INEGOCIAVEIS (ANTI-IA FAKE):\n1. NUNCA avatares talking heads.\n2. NAO formato "Direto da Fabrica".\n3. Lifestyle NUNCA mostra rosto (costas, silhueta, nuca, POV 1a pessoa).\n4. Estetica 100% iPhone 15 Pro, luz natural dia, micro-movimentos mao.\n5. Maos reais rusticas POV pegando bone, relevo patch, teste aba.\n6. CLAUSULA ANTIDISTORCAO GOOGLE FLOW: prompts em ingles rigidos que impedem deformar bone, mudar cores, alucinar letras. Se houver texto bordado, preserve EXATA posicao/fonte/curvatura da imagem de referencia (ex: "A Cruz Sagrada seja a minha luz" apenas lateral direita inferior da aba, nunca centro).\n\nAnalise as IMAGENS ANEXADAS desta pasta para descrever patch, textura suede, costura, tela trucker, cores exatas. Gere exatamente 60 ideias UGC. Cada ideia: title (pt), hook (3s pt), povAction (pt), googleFlowPrompt (EN completo com clausulas anti-distorcao, 9:16, iPhone 15 Pro, luz natural, preservacao geometria/cores), recommendedImages (array 3 nomes exatos da lista).\nRetorne APENAS JSON valido {"ideas":[60 objetos]}.\nImagens disponiveis: ' + JSON.stringify(proj.images);

  // Fallback: se nao tem imagens em cache, envia so texto
  const parts = [{ text: systemPrompt }].concat(imageParts);

  try {
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=' + apiKey, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: parts }], generationConfig: { responseMimeType: "application/json", temperature: 0.7, maxOutputTokens: 65536 } })
    });
    if (!response.ok) { const errData = await response.json(); throw new Error(errData.error?.message || 'Erro Gemini API'); }
    const data = await response.json();
    const rawText = data.candidates[0].content.parts[0].text;
    const parsedData = JSON.parse(rawText);
    proj.generatedIdeas = parsedData.ideas;
    localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(projects));
    saveIdeasToSupabase(proj);
    loadingSection.classList.add('hidden');
    renderVideoCards(proj.generatedIdeas);
    showToast('60 roteiros gerados analisando as fotos da pasta! (Supabase salvo)', 'success');
  } catch (error) {
    console.error(error);
    loadingSection.classList.add('hidden');
    showToast('Erro: ' + error.message, 'error');
    resultsSection.innerHTML = '<div class="p-6 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-center"><p class="text-rose-400 font-bold mb-2">Falha na geracao com Gemini API</p><p class="text-xs text-slate-300 mb-4">' + error.message + '</p><button onclick="generateUgcPrompts()" class="px-4 py-2 bg-caramel text-obsidian font-bold text-xs rounded-xl">Tentar Novamente</button></div>';
  }
}

function renderVideoCards(ideas) {
  const resultsSection = document.getElementById('resultsSection');
  const proj = projects.find(p => p.id === currentProjectId);
  let cache = {};
  try { cache = JSON.parse(localStorage.getItem('ugc_image_cache_' + proj.folder) || '{}'); } catch(e) {}
  resultsSection.innerHTML = ideas.map((idea, idx) => {
    const ingredients = idea.recommendedImages.map(imgName => {
      const imgSrc = cache[imgName] || (proj.folder + '/' + imgName);
      return '<div class="relative aspect-square rounded-lg overflow-hidden border border-borderSubtle bg-obsidian group cursor-pointer" title="' + imgName + '"><img src="' + imgSrc + '" alt="' + imgName + '" class="w-full h-full object-cover"><div class="absolute inset-0 bg-obsidian/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-1 text-[9px] text-caramel font-mono text-center">Usar</div></div>';
    }).join('');
    return '<div class="glass-panel rounded-2xl p-6 sm:p-8 shadow-xl border border-borderSubtle hover:border-caramel/40 transition-all"><div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-borderSubtle"><div><div class="flex items-center space-x-2 mb-1.5"><span class="px-2.5 py-0.5 text-xs font-bold rounded-md bg-caramel/10 text-caramel border border-caramel/20">Video UGC #' + (idx+1) + '</span><span class="text-xs text-slate-400 font-medium">TikTok Shop - /' + proj.folder + '</span></div><h3 class="text-xl font-bold text-white">' + idea.title + '</h3></div><div class="flex items-center space-x-3"><a href="https://labs.google/fx/tools/flow" target="_blank" class="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-tiktokCyan/20 to-tiktokMagenta/20 border border-tiktokCyan/30 text-white font-bold text-xs"><i data-lucide="clapperboard" class="w-4 h-4 text-tiktokCyan"></i><span>Abrir no Google Flow</span></a></div></div><div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6"><div class="lg:col-span-2 space-y-4"><div class="bg-slateDark/60 border border-borderSubtle rounded-xl p-4"><span class="text-xs font-bold text-caramel uppercase tracking-wider block mb-1">Gancho (Hook 3s)</span><p class="text-sm font-semibold text-white">"' + idea.hook + '"</p></div><div class="bg-slateDark/60 border border-borderSubtle rounded-xl p-4"><span class="text-xs font-bold text-tiktokCyan uppercase tracking-wider block mb-1">Acao da Mao Real (POV)</span><p class="text-xs sm:text-sm text-slate-300 leading-relaxed">' + idea.povAction + '</p></div></div><div class="bg-slateDark/60 border border-borderSubtle rounded-xl p-4 flex flex-col justify-between"><div><span class="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2 flex items-center justify-between"><span>Image Ingredients</span><i data-lucide="image" class="w-3.5 h-3.5 text-caramel"></i></span><div class="grid grid-cols-3 gap-2">' + ingredients + '</div></div><p class="text-[11px] text-slate-400 mt-3 italic">Arraste estas fotos como referencias no Google Flow.</p></div></div><div><div class="flex items-center justify-between mb-2"><span class="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5"><i data-lucide="terminal" class="w-3.5 h-3.5 text-caramel"></i><span>Prompt para Google Flow (Anti-Distortion)</span></span><button onclick="copyPrompt(this)" data-prompt="' + encodeURIComponent(idea.googleFlowPrompt) + '" class="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-cardBg hover:bg-cardHover border border-borderSubtle text-slate-300 text-xs">Copiar Prompt</button></div><div class="prompt-box rounded-xl p-4 text-xs sm:text-sm text-slate-200 leading-relaxed overflow-x-auto max-h-40 custom-scrollbar">' + idea.googleFlowPrompt + '</div></div></div>';
  }).join('');
  lucide.createIcons();
}

function copyPrompt(btn) {
  const promptText = decodeURIComponent(btn.getAttribute('data-prompt'));
  navigator.clipboard.writeText(promptText).then(() => { showToast('Prompt copiado!', 'success'); }).catch(() => { showToast('Falha ao copiar', 'error'); });
}
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toastMessage');
  const toastIcon = document.getElementById('toastIcon');
  toastMessage.textContent = message;
  if (type === 'success') { toastIcon.className = "w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center"; toastIcon.innerHTML = '<i data-lucide="check" class="w-4 h-4"></i>'; }
  else { toastIcon.className = "w-6 h-6 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center"; toastIcon.innerHTML = '<i data-lucide="alert-circle" class="w-4 h-4"></i>'; }
  lucide.createIcons();
  toast.classList.remove('translate-y-20', 'opacity-0');
  setTimeout(() => { toast.classList.add('translate-y-20', 'opacity-0'); }, 3500);
}
