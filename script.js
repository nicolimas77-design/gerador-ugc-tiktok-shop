// --- GERADOR DE V+ìDEOS UGC TIKTOK SHOP (by Nicolas Lima) ---
// Multi-Project / Sidebar Navigation & Gemini API Integration

const STORAGE_KEY_API_KEY = 'ugc_gemini_api_key';
const STORAGE_KEY_PROJECTS = 'ugc_projects_list';
const STORAGE_KEY_SUPABASE_URL = 'ugc_supabase_url';
const STORAGE_KEY_SUPABASE_KEY = 'ugc_supabase_key';
let supabaseClient = null;

let apiKey = localStorage.getItem(STORAGE_KEY_API_KEY) || '';
let currentView = 'home'; // 'home' or 'generator'
let currentProjectId = null;

function initSupabase() {
  const DEFAULT_URL = 'https://gbucaafkdssbldqndhog.supabase.co';
  const DEFAULT_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdidWNhYWZrZHNzYmxkcW5kaG9nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc0MTM4MDYsImV4cCI6MjEwMjk4OTgwNn0.1BRXlI2bD071fDEGHmkzb8nTB5azV_bKAnlhOvRP3QQ';
  const url = localStorage.getItem(STORAGE_KEY_SUPABASE_URL) || DEFAULT_URL;
  const key = localStorage.getItem(STORAGE_KEY_SUPABASE_KEY) || DEFAULT_KEY;
  if (url -and key -and window.supabase) {
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

// Default Projects (starting with saobento)
let projects = [
    {
        id: 'saobento',
        folder: 'saobento',
        name: 'Bon+® Trucker Medalha de S+úo Bento',
        description: 'Suede aveludado premium, tela trucker respir+ível, fecho snapback, patch circular em alto-relevo 3D da Medalha de S+úo Bento e bordado cursivo dourado na aba "A Cruz Sagrada seja a minha luz".',
        images: [
            "exec-0d9c9a19-a56b-43f2-8182-e936b42e033e.png", "exec-114ed2fd-1f47-40b3-8558-809a42122a36.png",
            "exec-2069abf8-63e3-41ce-8dcd-c483ead38a68.png", "exec-290125a1-6c9f-4948-a465-a03f4c400174.png",
            "exec-34aef719-4ad2-4e2d-95d5-a76e9bcbcf66.png", "exec-3e19cdc7-8876-4811-935f-35080702f5da.png",
            "exec-4c2cdb51-5d33-471e-b9e9-28dfe8415638.png", "exec-4f41771f-4fd3-4556-a94e-5c4bca318f41.png",
            "exec-674b274e-df68-48c7-b6f3-312cea5a5c83.png", "exec-805fb9df-13c5-451e-8242-3c9819f47dfc.png",
            "exec-88ec0d62-2e7e-46b5-bd9b-4503e6deab68.png", "exec-8a9dd791-8346-4f7c-bc91-70318dfd6966.png",
            "exec-8dbf9071-108c-4175-bf9c-51139bfdb8a7.png", "exec-8dfe9038-278c-4595-9775-83602823715a.png",
            "exec-aa71bd27-96d3-4a24-bb0b-98820f11c463.png", "exec-ae342a02-e0f3-4495-87e4-52a72e4b154f.png",
            "exec-bc31f8dd-6fb4-494a-8109-9e7acb6f8e05.png", "exec-c0fb5dc9-f355-423c-952c-34d20c7d4cac.png",
            "exec-c87923d8-9a8f-4615-b0de-c2cb76662158.png", "exec-d39e57af-67ed-4807-abe6-ac3073e57afa.png",
            "exec-d7c882cd-7d3a-4620-83a4-76f253fd427b.png", "exec-dc978fed-be8c-4be4-81b3-02bfecf52135.png",
            "exec-df1c891b-4eb7-4fec-9a8b-a0cfffac1378.png", "exec-df1f01f4-ce6c-40f6-baa5-08ad0a986baf.png",
            "exec-e0fe7166-6544-472b-a043-ec42835e383a.png", "exec-e6b8dace-3e6c-4195-941a-fcc19335f48c.png",
            "exec-ec2af7d7-b3c1-477f-aede-37a38afe4392.png", "exec-f3b7f460-7319-450f-a2b9-46e3454940ac.png",
            "exec-fe0bb707-5daf-42ab-b4e5-f6d43d4f7483.png"
        ],
        generatedIdeas: []
    },
    {
        id: 'abacurvapatch',
        folder: 'abacurvapatch',
        name: 'Bon+® Rancho Forte Country Aba Curva Patch',
        description: 'BON+ë RANCHO FORTE COUNTRY PREMIUM PATCH RF &bull; Estrutura firme, visual sofisticado e inspira+º+úo no universo sertanejo. Copa fechada, aba curva em couro sint+®tico texturizado e patch frontal em couro com logo RF. Fechamento ajust+ível em velcro.',
        images: [
            "img1black.jfif", "img1white.jfif", "img2black.jfif", "img2white.jfif",
            "img3black.jfif", "img3white.jfif", "sg-11134201-82598-mqi105jooiku7f_tn.jfif"
        ],
        generatedIdeas: []
    }
];

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    // Load API Key
    const savedKey = localStorage.getItem(STORAGE_KEY_API_KEY);
    if (savedKey) apiKey = savedKey;

    // Load Projects
    const savedProjects = localStorage.getItem(STORAGE_KEY_PROJECTS);
    if (savedProjects) {
        try { 
            const parsed = JSON.parse(savedProjects);
            // Ensure abacurvapatch has the correct images
            const abaProj = parsed.find(p => p.folder === 'abacurvapatch');
            if (abaProj) {
                abaProj.images = ["img1black.jfif", "img1white.jfif", "img2black.jfif", "img2white.jfif", "img3black.jfif", "img3white.jfif", "sg-11134201-82598-mqi105jooiku7f_tn.jfif"];
            }
            projects = parsed; 
        } catch(e) {}
    }

    initSupabase();
    renderSidebarProjects();
    renderHomeDashboard();
    lucide.createIcons();

    // Mobile sidebar toggle
    document.getElementById('openSidebarBtn').addEventListener('click', () => {
        document.getElementById('sidebar').classList.remove('-translate-x-full');
    });
    document.getElementById('closeSidebarBtn').addEventListener('click', () => {
        document.getElementById('sidebar').classList.add('-translate-x-full');
    });

    // Generate button listener
    document.getElementById('generatePromptsBtn').addEventListener('click', generateUgcPrompts);
});

// Navigation & View Controller
function switchView(view, projectId = null) {
    currentView = view;
    currentProjectId = projectId;

    const homeView = document.getElementById('homeView');
    const projectView = document.getElementById('projectGeneratorView');
    const breadcrumb = document.getElementById('breadcrumb');
    const navHomeBtn = document.getElementById('navHomeBtn');

    // Close mobile sidebar on navigation
    document.getElementById('sidebar').classList.add('-translate-x-full');

    if (view === 'home') {
        homeView.classList.remove('hidden');
        projectView.classList.add('hidden');
        breadcrumb.innerHTML = `<span>Dashboard</span>`;
        navHomeBtn.className = "w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold bg-cardBg text-caramel shadow-sm";
        renderHomeDashboard();
    } else if (view === 'generator' && projectId) {
        homeView.classList.add('hidden');
        projectView.classList.remove('hidden');
        navHomeBtn.className = "w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:bg-cardHover hover:text-white transition-all";
        
        const proj = projects.find(p => p.id === projectId);
        if (proj) {
            breadcrumb.innerHTML = `<span class="text-slate-400">Dashboard</span> <i data-lucide="chevron-right" class="w-3.5 h-3.5 text-slate-500"></i> <span class="text-white">${proj.name}</span>`;
            renderProjectGenerator(proj);
        }
    }
    renderSidebarProjects();
    lucide.createIcons();
}

// Render Sidebar Project List
function renderSidebarProjects() {
    const navList = document.getElementById('projectNavList');
    navList.innerHTML = projects.map(proj => {
        const isActive = currentView === 'generator' && currentProjectId === proj.id;
        return `
            <button onclick="switchView('generator', '${proj.id}')" class="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${isActive ? 'bg-caramel/15 text-caramel border border-caramel/30 font-semibold' : 'text-slate-400 hover:bg-cardHover hover:text-white'}">
                <i data-lucide="folder" class="w-4 h-4 text-caramel shrink-0"></i>
                <span class="truncate">${proj.name}</span>
            </button>
        `;
    }).join('');
}

// Render Home Dashboard Projects Grid
function renderHomeDashboard() {
    const grid = document.getElementById('projectsGrid');
    grid.innerHTML = projects.map(proj => `
        <div onclick="switchView('generator', '${proj.id}')" class="glass-panel rounded-2xl p-6 cursor-pointer hover:border-caramel/50 transition-all group flex flex-col justify-between">
            <div>
                <div class="flex items-center justify-between mb-3">
                    <span class="px-2 py-0.5 text-[10px] font-bold rounded bg-tiktokCyan/10 text-tiktokCyan border border-tiktokCyan/20 uppercase font-mono">
                        /${proj.folder}
                    </span>
                    <span class="text-xs text-slate-400 flex items-center space-x-1">
                        <i data-lucide="images" class="w-3.5 h-3.5 text-caramel"></i>
                        <span>${proj.images.length} fotos</span>
                    </span>
                </div>
                <h4 class="text-base font-bold text-white group-hover:text-caramel transition-colors mb-2">${proj.name}</h4>
                <p class="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">${proj.description}</p>
            </div>
            <div class="flex items-center justify-between pt-4 border-t border-borderSubtle text-xs font-semibold text-caramel">
                <span>Abrir gerador de roteiros</span>
                <i data-lucide="arrow-right" class="w-4 h-4 transform group-hover:translate-x-1 transition-transform"></i>
            </div>
        </div>
    `).join('');
}

// Render Specific Project Generator Screen
function renderProjectGenerator(proj) {
    document.getElementById('projBadge').textContent = `Pasta: /${proj.folder}`;
    document.getElementById('projImageCount').textContent = `${proj.images.length} imagens mapeadas`;
    document.getElementById('projTitle').textContent = proj.name;
    document.getElementById('projDesc').textContent = proj.description;
    document.getElementById('libraryTitle').textContent = `Banco de Imagens &bull; Pasta /${proj.folder} (${proj.images.length} itens)`;

    // Load image cache if any
    let cache = {};
    try {
        cache = JSON.parse(localStorage.getItem('ugc_image_cache_' + proj.folder) || '{}');
    } catch(e) {}

    // Render Image Grid
    const imgGrid = document.getElementById('imageGrid');
    imgGrid.innerHTML = proj.images.map((img, idx) => {
        const imgSrc = cache[img] || `${proj.folder}/${img}`;
        return `
            <div class="relative bg-slateDark border border-borderSubtle rounded-xl overflow-hidden aspect-square flex items-center justify-center group" title="${img}">
                <img src="${imgSrc}" alt="${img}" class="w-full h-full object-cover group-hover:scale-105 transition-transform" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=200&auto=format&fit=crop&q=60'">
                <div class="absolute inset-0 bg-obsidian/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span class="text-[9px] font-mono text-caramel font-bold">#${idx + 1}</span>
                </div>
            </div>
        `;
    }).join('');

    // Render results or empty state
    const resultsSection = document.getElementById('resultsSection');
    if (proj.generatedIdeas && proj.generatedIdeas.length > 0) {
        renderVideoCards(proj.generatedIdeas);
    } else {
        resultsSection.innerHTML = `
            <div id="emptyState" class="text-center py-16 bg-cardBg/50 border border-borderSubtle rounded-2xl border-dashed">
                <div class="w-12 h-12 rounded-2xl bg-cardBg border border-borderSubtle flex items-center justify-center mx-auto mb-3 text-caramel">
                    <i data-lucide="video" class="w-6 h-6"></i>
                </div>
                <h3 class="text-sm font-bold text-white mb-1">Nenhum roteiro gerado para esta pasta</h3>
                <p class="text-xs text-slate-400 max-w-sm mx-auto mb-4">
                    Clique em "Gerar 60 Prompts UGC (Gemini)" para criar os v+¡deos baseados nas imagens e detalhes deste bon+®.
                </p>
                <button onclick="document.getElementById('generatePromptsBtn').click()" class="px-4 py-2 bg-caramel text-obsidian font-bold text-xs rounded-xl hover:bg-caramelDark transition-all">
                    Gerar Agora
                </button>
            </div>
        `;
    }
    lucide.createIcons();
}

function toggleImageLibrary() {
    const sec = document.getElementById('imageLibrarySection');
    const btnText = document.getElementById('libraryBtnText');
    sec.classList.toggle('hidden');
    btnText.textContent = sec.classList.contains('hidden') ? 'Ver Imagens' : 'Ocultar Imagens';
}

// Modal management
function openNewProjectModal() {
    document.getElementById('newProjectModal').classList.remove('hidden');
}
function closeNewProjectModal() {
    document.getElementById('newProjectModal').classList.add('hidden');
}
function openSettingsModal() {
    document.getElementById('apiKeyInput').value = apiKey;
    document.getElementById('supabaseUrlInput').value = localStorage.getItem(STORAGE_KEY_SUPABASE_URL) || '';
    document.getElementById('supabaseKeyInput').value = localStorage.getItem(STORAGE_KEY_SUPABASE_KEY) || '';
    document.getElementById('settingsModal').classList.remove('hidden');
    initSupabase();
}
function closeSettingsModal() {
    document.getElementById('settingsModal').classList.add('hidden');
}
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
    showToast(supabaseClient ? 'Configurações salvas e Supabase conectado!' : 'Configurações salvas!', 'success');
}
    apiKey = val;
    localStorage.setItem(STORAGE_KEY_API_KEY, apiKey);
    closeSettingsModal();
    showToast('Chave salva com sucesso!', 'success');
}

// Create New Project / Folder
function handleCreateProject(e) {
    e.preventDefault();
    const folder = document.getElementById('newProjFolder').value.trim().toLowerCase().replace(/\s+/g, '-');
    const name = document.getElementById('newProjName').value.trim();
    const description = document.getElementById('newProjDesc').value.trim();
    const fileInput = document.getElementById('newProjFiles');
    const imagesRaw = document.getElementById('newProjImages').value.trim();

    let images = [];
    let imageMap = {};
    if (fileInput.files && fileInput.files.length > 0) {
        let loadedCount = 0;
        const totalFiles = fileInput.files.length;
        
        for (let i = 0; i < totalFiles; i++) {
            const file = fileInput.files[i];
            images.push(file.name);
            const reader = new FileReader();
            reader.onload = function(event) {
                imageMap[file.name] = event.target.result;
                loadedCount++;
                if (loadedCount === totalFiles) {
                    finalizeProject(folder, name, description, images, imageMap);
                }
            };
            reader.readAsDataURL(file);
        }
        return;
    }

    if (images.length === 0 && imagesRaw) {
        images = imagesRaw.split(/[\n,]+/).map(s => s.trim()).filter(Boolean);
    }
    if (images.length === 0) {
        images = ["default-cap.png"];
    }
    finalizeProject(folder, name, description, images, {});
}

function finalizeProject(folder, name, description, images, imageMap) {
    if (!window.uploadedImageCache) window.uploadedImageCache = {};
    window.uploadedImageCache[folder] = imageMap;
    localStorage.setItem('ugc_image_cache_' + folder, JSON.stringify(imageMap));

    const newProj = {
        id: folder + '-' + Date.now(),
        folder: folder,
        name: name,
        description: description,
        images: images,
        generatedIdeas: []
    };

    projects.push(newProj);
    localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(projects));
    closeNewProjectModal();
    document.getElementById('newProjectForm').reset();
    
    renderSidebarProjects();
    switchView('generator', newProj.id);
    showToast(`Pasta /${folder} criada com ${images.length} imagens carregadas!`, 'success');
}

// Gemini API Call to Generate 60 UGC Prompts
async function generateUgcPrompts() {
    if (!apiKey) {
        openSettingsModal();
        showToast('Configure sua Gemini API Key primeiro.', 'error');
        return;
    }

    const proj = projects.find(p => p.id === currentProjectId);
    if (!proj) return;

    const loadingSection = document.getElementById('loadingSection');
    const resultsSection = document.getElementById('resultsSection');

    loadingSection.classList.remove('hidden');
    resultsSection.innerHTML = '';

    const systemPrompt = `Voc+¬ +® o estrategista s+¬nior de TikTok Shop e Especialista em Cria+º+úo de Conte+¦do UGC (User Generated Content) para a marca sertaneja premium "Rancho Forte" (parceira de f+íbrica Ondas Bon+®s / Era Mato).
O produto em foco nesta pasta +®:
- Nome: ${proj.name}
- Pasta: ${proj.folder}
- Descri+º+úo e Acabamento: ${proj.description}

REGRAS INEGOCI+üVEIS DE CONTE+ÜDO (ANTI-IA FAKE):
1. NUNCA usar avatares ou personagens de IA falando para a c+ómera (talking heads).
2. N+âO criar v+¡deos no formato "Direto da F+íbrica" (foco 100% no cliente final, produto e lifestyle aut+¬ntico).
3. V+¡deos de Lifestyle NUNCA mostram o rosto do modelo (sempre sem rosto: de costas, silhueta com aba cobrindo o olhar, nuca ou vis+úo em 1-¬ pessoa POV).
4. Zero cara de anima+º+úo, cartoon ou IA plastificada: Est+®tica 100% gravada por c+ómera real de iPhone 15 Pro (UGC aut+¬ntico), ilumina+º+úo natural de luz do dia e micro-movimentos de m+úo.
5. M+úos Reais Humanas (POV): M+úos r+¦sticas masculinas pegando o bon+® da mesa, dedos passando pelo relevo do patch/bordado, teste firme de rigidez da aba e giro suave.
6. CL+üUSULA R+ìGIDA ANTI-DISTOR+ç+âO E POSICIONAMENTO DE TEXTO NO GOOGLE FLOW: Todo prompt gerado para o Google Flow (Image-to-Video) DEVE ter comandos estritos em ingl+¬s que:
   - Impedem a IA de deformar o bon+®, alterar geometria ou mudar cores.
   - EXIGEM PRECIS+âO ABSOLUTA NO TEXTO BORDADO NA ABA: O bordado em letra cursiva dourada "A Cruz Sagrada seja a minha luz" fica localizado EXCLUSIVAMENTE na lateral direita inferior da aba frontal do bon+® (nunca no centro, nunca na aba inteira, nunca em ambos os lados). O texto deve ser estritamente preservado exatamente como na imagem de refer+¬ncia, mantendo a fonte cursiva elegante e a curvatura exata na parte inferior direita da aba.

Gere exatamente 60 ideias de v+¡deos UGC de alta convers+úo para o TikTok Shop para este bon+®. Cada ideia deve conter:
- title: T+¡tulo cativante da cena em portugu+¬s.
- hook: Gancho de 3 segundos para prender a aten+º+úo no TikTok em portugu+¬s.
- povAction: Descri+º+úo detalhada da a+º+úo da m+úo real em portugu+¬s.
- googleFlowPrompt: O prompt profissional COMPLETO e RIGOROSO em INGL+èS para ser inserido no Google Flow (Image-to-Video), incluindo as cl+íusulas anti-distor+º+úo, propor+º+úo 9:16, estilo iPhone 15 Pro, ilumina+º+úo natural, e preserva+º+úo exata da geometria, cores e detalhes do bon+®.
- recommendedImages: Array com 3 nomes de arquivos de imagem exatos da lista fornecida para usar como "Image Ingredients".

Retorne APENAS um objeto JSON v+ílido (sem markdown extra, sem texto fora do JSON) contendo um array "ideas" com exatamente 60 objetos.
Lista de arquivos de imagem dispon+¡veis na pasta ${proj.folder}:
${JSON.stringify(proj.images)}`;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: systemPrompt }] }],
                generationConfig: {
                    responseMimeType: "application/json",
                    temperature: 0.7,
                    maxOutputTokens: 65536
                }
            })
        });

        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.error?.message || 'Erro ao chamar a Gemini API');
        }

        const data = await response.json();
        const rawText = data.candidates[0].content.parts[0].text;
        const parsedData = JSON.parse(rawText);

        proj.generatedIdeas = parsedData.ideas;
        localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(projects));

        loadingSection.classList.add('hidden');
        renderVideoCards(proj.generatedIdeas);
        showToast('60 Roteiros UGC gerados com sucesso!', 'success');

    } catch (error) {
        console.error(error);
        loadingSection.classList.add('hidden');
        showToast(`Erro: ${error.message}`, 'error');
        resultsSection.innerHTML = `
            <div class="p-6 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-center">
                <p class="text-rose-400 font-bold mb-2">Falha na gera+º+úo com Gemini API</p>
                <p class="text-xs text-slate-300 mb-4">${error.message}</p>
                <button onclick="generateUgcPrompts()" class="px-4 py-2 bg-caramel text-obsidian font-bold text-xs rounded-xl">Tentar Novamente</button>
            </div>
        `;
    }
}

// Render generated video idea cards
function renderVideoCards(ideas) {
    const resultsSection = document.getElementById('resultsSection');
    const proj = projects.find(p => p.id === currentProjectId);

    let cache = {};
    try {
        cache = JSON.parse(localStorage.getItem('ugc_image_cache_' + proj.folder) || '{}');
    } catch(e) {}

    resultsSection.innerHTML = ideas.map((idea, idx) => `
        <div class="glass-panel rounded-2xl p-6 sm:p-8 shadow-xl border border-borderSubtle hover:border-caramel/40 transition-all">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-borderSubtle">
                <div>
                    <div class="flex items-center space-x-2 mb-1.5">
                        <span class="px-2.5 py-0.5 text-xs font-bold rounded-md bg-caramel/10 text-caramel border border-caramel/20">
                            V+¡deo UGC #${idx + 1}
                        </span>
                        <span class="text-xs text-slate-400 font-medium">TikTok Shop &bull; /${proj.folder}</span>
                    </div>
                    <h3 class="text-xl font-bold text-white">${idea.title}</h3>
                </div>
                <div class="flex items-center space-x-3">
                    <a href="https://labs.google/fx/tools/flow" target="_blank" rel="noopener noreferrer" class="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-tiktokCyan/20 to-tiktokMagenta/20 hover:from-tiktokCyan/30 hover:to-tiktokMagenta/30 border border-tiktokCyan/30 text-white font-bold text-xs transition-all shadow-md">
                        <i data-lucide="clapperboard" class="w-4 h-4 text-tiktokCyan"></i>
                        <span>Abrir no Google Flow</span>
                        <i data-lucide="external-link" class="w-3 h-3 text-slate-400"></i>
                    </a>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div class="lg:col-span-2 space-y-4">
                    <div class="bg-slateDark/60 border border-borderSubtle rounded-xl p-4">
                        <span class="text-xs font-bold text-caramel uppercase tracking-wider block mb-1">Gancho (Hook 3s)</span>
                        <p class="text-sm font-semibold text-white">"${idea.hook}"</p>
                    </div>
                    <div class="bg-slateDark/60 border border-borderSubtle rounded-xl p-4">
                        <span class="text-xs font-bold text-tiktokCyan uppercase tracking-wider block mb-1">A+º+úo da M+úo Real (POV)</span>
                        <p class="text-xs sm:text-sm text-slate-300 leading-relaxed">${idea.povAction}</p>
                    </div>
                </div>

                <div class="bg-slateDark/60 border border-borderSubtle rounded-xl p-4 flex flex-col justify-between">
                    <div>
                        <span class="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2 flex items-center justify-between">
                            <span>Image Ingredients</span>
                            <i data-lucide="image" class="w-3.5 h-3.5 text-caramel"></i>
                        </span>
                        <div class="grid grid-cols-3 gap-2">
                            ${idea.recommendedImages.map(imgName => {
                                const imgSrc = cache[imgName] || `${proj.folder}/${imgName}`;
                                return `
                                    <div class="relative aspect-square rounded-lg overflow-hidden border border-borderSubtle bg-obsidian group cursor-pointer" title="${imgName}">
                                        <img src="${imgSrc}" alt="Ingredient" class="w-full h-full object-cover" onerror="this.src='https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=200&auto=format&fit=crop&q=60'">
                                        <div class="absolute inset-0 bg-obsidian/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-1 text-[9px] text-caramel font-mono text-center">
                                            Usar
                                        </div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>
                    <p class="text-[11px] text-slate-400 mt-3 italic">Arraste estas fotos como refer+¬ncias no Google Flow.</p>
                </div>
            </div>

            <div>
                <div class="flex items-center justify-between mb-2">
                    <span class="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
                        <i data-lucide="terminal" class="w-3.5 h-3.5 text-caramel"></i>
                        <span>Prompt Profissional para o Google Flow (Image-to-Video &bull; Anti-Distortion)</span>
                    </span>
                    <button onclick="copyPrompt(this)" data-prompt="${encodeURIComponent(idea.googleFlowPrompt)}" class="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-cardBg hover:bg-cardHover border border-borderSubtle text-slate-300 hover:text-white text-xs font-medium transition-all">
                        <i data-lucide="copy" class="w-3.5 h-3.5 text-caramel"></i>
                        <span>Copiar Prompt</span>
                    </button>
                </div>
                <div class="prompt-box rounded-xl p-4 text-xs sm:text-sm text-slate-200 leading-relaxed overflow-x-auto max-h-40 custom-scrollbar">
                    ${idea.googleFlowPrompt}
                </div>
            </div>
        </div>
    `).join('');
    lucide.createIcons();
}

function copyPrompt(btn) {
    const promptText = decodeURIComponent(btn.getAttribute('data-prompt'));
    navigator.clipboard.writeText(promptText).then(() => {
        showToast('Prompt copiado para a +írea de transfer+¬ncia!', 'success');
    }).catch(err => {
        showToast('Falha ao copiar prompt', 'error');
    });
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    const toastIcon = document.getElementById('toastIcon');

    toastMessage.textContent = message;
    if (type === 'success') {
        toastIcon.className = "w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center";
        toastIcon.innerHTML = '<i data-lucide="check" class="w-4 h-4"></i>';
    } else {
        toastIcon.className = "w-6 h-6 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center";
        toastIcon.innerHTML = '<i data-lucide="alert-circle" class="w-4 h-4"></i>';
    }
    lucide.createIcons();

    toast.classList.remove('translate-y-20', 'opacity-0');
    setTimeout(() => {
        toast.classList.add('translate-y-20', 'opacity-0');
    }, 3500);
}
