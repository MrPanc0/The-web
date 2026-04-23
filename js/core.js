// =====================================================================
// 1. AUTOMATICKÝ TMAVÝ REŽIM PODLE SYSTÉMU (Spustí se hned)
// =====================================================================
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.classList.add('dark');
    const icon = document.getElementById('dark-icon');
    if (icon) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    }
}

// Naslouchání na změnu systému během prohlížení webu
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
    const icon = document.getElementById('dark-icon');
    if (event.matches) {
        document.documentElement.classList.add('dark');
        if (icon) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }
    } else {
        document.documentElement.classList.remove('dark');
        if (icon) {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    }
});


// =====================================================================
// 2. HLAVNÍ INICIALIZAČNÍ FUNKCE (Zavolá to core.js až po načtení HTML)
// =====================================================================
function initUIListeners() {
    
    // A. Manuální přepínání tmavého režimu tlačítkem
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

    // B. Spuštění nekonečného kolotoče galerie!
    initGallerySlider();
    initScrollReveal();
}


// =====================================================================
// 3. TABY A POZADÍ (Kalkulačka)
// =====================================================================
const bgImages = {
    'print': "url('print.jpg')", 
    'model': "url('model.jpg')",
    'scan': "url('scan.jpg')"
};

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
                content.classList.remove('hidden');
                btn.classList.remove(...inactiveClasses);
                btn.classList.add(...activeClasses);
            } else {
                content.classList.add('hidden');
                btn.classList.remove(...activeClasses);
                btn.classList.add(...inactiveClasses);
            }
        }
    });
}


// =====================================================================
// 4. NEKONEČNÁ GALERIE (Kód pro posouvání obrázků)
// =====================================================================
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
    
    container.innerHTML = '';
    galleryElements = [];

    galleryImages.forEach((src) => {
        const div = document.createElement('div');
        div.className = 'absolute w-3/4 md:w-3/5 h-full transition-all duration-700 ease-in-out rounded-2xl shadow-xl overflow-hidden flex items-center justify-center bg-gray-50/5 dark:bg-gray-800/5';
        
        const img = document.createElement('img');
        
        // ZMĚNA 1: Místo okamžitého načtení ('src') schováme adresu do 'data-src'
        img.dataset.src = src; 
        
        // ZMĚNA 2: Obrázek je na začátku plně průhledný (opacity-0)
        img.className = 'max-w-full max-h-full object-contain transition-opacity duration-500 opacity-0'; 
        
        // ZMĚNA 3: Jakmile ho prohlížeč v budoucnu stáhne, plynule ho zviditelníme
        img.onload = () => {
            img.classList.remove('opacity-0');
        };
        
        div.appendChild(img);
        container.appendChild(div);
        galleryElements.push(div); 
    });

    updateGalleryPositions();

    setInterval(() => {
        currentGalleryIndex = (currentGalleryIndex + 1) % galleryImages.length;
        updateGalleryPositions();
    }, 3000); 
}

function updateGalleryPositions() {
    const total = galleryElements.length;
    
    galleryElements.forEach((el, index) => {
        let offset = (index - currentGalleryIndex) % total;
        if (offset < 0) offset += total; 

        el.classList.remove('z-20', 'z-10', 'z-0', 'opacity-100', 'opacity-40', 'opacity-0');

        // ZMĚNA 4: Zjistíme, jestli obrázek zrovna je (nebo za chvíli bude) vidět
        // Viditelné jsou pozice 0 (střed), 1 (vpravo) a total-1 (vlevo)
        const isVisible = (offset === 0 || offset === 1 || offset === total - 1);

        // ZMĚNA 5: Pokud je vidět a ještě se nestahuje, teprve teď mu dáme jeho 'src'
        if (isVisible) {
            const img = el.querySelector('img');
            if (img && !img.src) {
                img.src = img.dataset.src;
            }
        }

        if (offset === 0) {
            el.classList.add('z-20', 'opacity-100');
            el.style.transform = 'translateX(0) scale(1)';
        } else if (offset === 1) {
            el.classList.add('z-10', 'opacity-40');
            el.style.transform = 'translateX(40%) scale(0.75)';
        } else if (offset === total - 1) {
            el.classList.add('z-10', 'opacity-40');
            el.style.transform = 'translateX(-40%) scale(0.75)';
        } else {
            el.classList.add('z-0', 'opacity-0');
            if (offset === 2) {
                 el.style.transform = 'translateX(80%) scale(0.5)';
            } else {
                 el.style.transform = 'translateX(-80%) scale(0.5)';
            }
        }
    });
}

/**
 * Zobrazí moderní notifikaci v rohu obrazovky
 * @param {string} message - Text zprávy
 * @param {string} type - 'success', 'error', nebo 'info'
 */
function showToast(message, type = 'info') {
    // Najdeme nebo vytvoříme kontejner
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }

    // Vytvoříme element notifikace
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    // Ikonka podle typu
    let icon = 'fa-info-circle';
    if (type === 'success') icon = 'fa-check-circle';
    if (type === 'error') icon = 'fa-exclamation-circle';

    toast.innerHTML = `
        <div class="flex items-center gap-3">
            <i class="fa-solid ${icon}"></i>
            <span>${message}</span>
        </div>
    `;

    // Přidáme do kontejneru
    container.appendChild(toast);

    // Automatické odstranění po 4 vteřinách
    setTimeout(() => {
        toast.classList.add('toast-fade-out');
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, { 
        // Spustí animaci, když je prvek 50px nad spodním okrajem obrazovky
        rootMargin: "0px 0px -50px 0px" 
    });

    // Najdeme všechny prvky s třídou .reveal a začneme je sledovat
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}
