// Inicializace posluchačů pro UI (Zavolá to core.js až po načtení HTML)
function initUIListeners() {
    const toggleBtn = document.getElementById('dark-mode-toggle');
    if(toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            document.documentElement.classList.toggle('dark');
            const icon = document.getElementById('dark-icon');
            if(icon) {
                icon.classList.toggle('fa-moon');
                icon.classList.toggle('fa-sun');
            }
        });
    }
}

// Taby a Pozadí
const bgImages = {
    'print': "url('print.jpg')", 
    'model': "url('model.jpg')",
    'scan': "url('scan.jpg')"
};

// Sady tříd pro správné zbarvení ve světlém i tmavém režimu
const activeClasses = ['bg-blue-600', 'text-white', 'border-blue-500/50'];
const inactiveClasses = ['bg-white/80', 'text-gray-800', 'dark:bg-gray-800/80', 'dark:text-gray-200', 'border-white/30', 'dark:border-gray-600/50'];

function switchTab(tabId) {
    const sectionBg = document.getElementById('section-bg');
    if (sectionBg) sectionBg.style.backgroundImage = bgImages[tabId];
    
    ['print', 'model', 'scan'].forEach(id => {
        const btn = document.getElementById(`tab-btn-${id}`);
        const content = document.getElementById(`tab-content-${id}`);
        
        if (btn && content) {
            if (id === tabId) {
                // Zobrazit obsah a obarvit tlačítko namodro
                content.classList.remove('hidden');
                btn.classList.remove(...inactiveClasses);
                btn.classList.add(...activeClasses);
            } else {
                // Skrýt obsah a odbarvit tlačítko (šedé/průhledné)
                content.classList.add('hidden');
                btn.classList.remove(...activeClasses);
                btn.classList.add(...inactiveClasses);
            }
        }
    });
}

// ... stávající kód ...

function initUIListeners() {
    const toggleBtn = document.getElementById('dark-mode-toggle');
    if(toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            document.documentElement.classList.toggle('dark');
            const icon = document.getElementById('dark-icon');
            if(icon) {
                icon.classList.toggle('fa-moon');
                icon.classList.toggle('fa-sun');
            }
        });
    }
    
    // PŘIDÁNO: Spuštění rotace obrázků po načtení UI
    initGallerySlider();
}

// --- KÓD PRO NEKONEČNOU GALERII ---

// Názvy vašich obrázků (doplňte podle skutečnosti)
const galleryImages = [
    'galerie/1.jpg',
    'galerie/2.jpg',
    'galerie/3.jpg',
    'galerie/4.jpg',
    'galerie/5.jpg'
];

let currentGalleryIndex = 0;
let galleryElements = [];

function initGallerySlider() {
    const container = document.getElementById('gallery-carousel');
    if (!container) return;
    
    // Vyčistíme kontejner pro jistotu při opětovném načtení
    container.innerHTML = '';
    galleryElements = [];

    // Vytvoříme HTML elementy pro každý obrázek v poli
    galleryImages.forEach((src) => {
        const div = document.createElement('div');
        // Kontejner má flex centrování a velmi jemné pozadí pro případ, 
        // že obrázek nevyplní celou šířku/výšku (odstraněna stará maska)
        div.className = 'absolute w-3/4 md:w-3/5 h-full transition-all duration-700 ease-in-out rounded-2xl shadow-xl overflow-hidden flex items-center justify-center bg-gray-50/5 dark:bg-gray-800/5';
        
        const img = document.createElement('img');
        img.src = src;
        // max-w-full a object-contain zajistí, že se obrázek nikdy neořízne
        img.className = 'max-w-full max-h-full object-contain'; 
        
        div.appendChild(img);
        container.appendChild(div);
        galleryElements.push(div); // Uložíme si jej do pole pro posouvání
    });

    // První srovnání obrázků na jejich startovní pozice
    updateGalleryPositions();

    // Spustí posouvání každé 3 vteřiny
    setInterval(() => {
        currentGalleryIndex = (currentGalleryIndex + 1) % galleryImages.length;
        updateGalleryPositions();
    }, 3000); 
}

function updateGalleryPositions() {
    const total = galleryElements.length;
    
    galleryElements.forEach((el, index) => {
        // Výpočet relativní pozice obrázku vůči aktuálnímu středu
        let offset = (index - currentGalleryIndex) % total;
        if (offset < 0) offset += total; // Ošetření záporných čísel

        // Vyresetujeme základní třídy vrstvení a průhlednosti
        el.classList.remove('z-20', 'z-10', 'z-0', 'opacity-100', 'opacity-40', 'opacity-0');

        if (offset === 0) {
            // AKTIVNÍ (STŘED)
            el.classList.add('z-20', 'opacity-100');
            el.style.transform = 'translateX(0) scale(1)';
        } else if (offset === 1) {
            // BUDOUCÍ (VPRAVO)
            el.classList.add('z-10', 'opacity-40');
            el.style.transform = 'translateX(40%) scale(0.75)';
        } else if (offset === total - 1) {
            // PŘEDCHOZÍ (VLEVO)
            el.classList.add('z-10', 'opacity-40');
            el.style.transform = 'translateX(-40%) scale(0.75)';
        } else {
            // SKRYTÉ (ÚPLNĚ VZADU)
            el.classList.add('z-0', 'opacity-0');
            // Zjistíme, jestli se mají schovat do pravé nebo levé strany
            if (offset === 2) {
                 el.style.transform = 'translateX(80%) scale(0.5)';
            } else {
                 el.style.transform = 'translateX(-80%) scale(0.5)';
            }
        }
    });
}
