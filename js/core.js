/**
 * @fileoverview Core systém pro načítání HTML komponent.
 * Rozděluje monolitický index.html do menších, spravovatelných částí.
 */

const components = [
    { id: 'app-navbar', file: 'components/navbar.html' },
    { id: 'app-header', file: 'components/header.html' },
    { id: 'app-services', file: 'components/services.html' },
    { id: 'app-gallery', file: 'components/gallery.html' },
    { id: 'app-faq', file: 'components/faq.html' },
    { id: 'app-footer', file: 'components/footer.html' },
    { id: 'app-modal', file: 'components/modal-cart.html' }
];

/**
 * Asynchronně načte obsah HTML souboru a vloží ho do příslušného divu.
 */
async function loadComponent(component) {
    try {
        const response = await fetch(component.file);
        if (!response.ok) throw new Error(`Nepodařilo se načíst: ${component.file}`);
        const html = await response.text();
        const element = document.getElementById(component.id);
        if (element) {
            element.innerHTML = html;
        } else {
            console.error(`Cílový element #${component.id} nebyl nalezen.`);
        }
    } catch (error) {
        console.error('Chyba při načítání komponenty:', error);
    }
}

/**
 * Spustí načítání všech komponent paralelně a po dokončení inicializuje další skripty a schová loader.
 */
async function initializeApp() {
    console.log("Zahajuji načítání komponent...");
    
    // Načtení všech komponent
    await Promise.all(components.map(loadComponent));
    
    console.log("Komponenty úspěšně načteny. Inicializuji UI a logiku.");

    // Ruční spuštění event listenerů
    if (typeof initUIListeners === 'function') initUIListeners();
    if (typeof initTranslationsListener === 'function') initTranslationsListener();
    if (typeof initCartListeners === 'function') initCartListeners();
    if (typeof initCalculatorListeners === 'function') initCalculatorListeners();
    
    // Zajištění překladu ihned po načtení UI
    if (typeof applyTranslations === 'function') {
        applyTranslations();
    }

    // ==========================================
    // ODSTRANĚNÍ LOADERU PO DOKONČENÍ NAČÍTÁNÍ
    // ==========================================
    const loader = document.getElementById('page-loader');
    if (loader) {
        // Zprůhlední se
        loader.classList.add('opacity-0');
        
        // Počkáme 700ms na dokončení animace a pak prvek úplně smažeme
        setTimeout(() => {
            loader.remove();
        }, 700);
    }
}

// Spustí proces načítání ve chvíli, kdy je struktura dokumentu připravena
document.addEventListener("DOMContentLoaded", initializeApp);