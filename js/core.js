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
 * Spustí načítání všech komponent paralelně a po dokončení inicializuje další skripty.
 */
async function initializeApp() {
    console.log("Zahajuji načítání komponent...");
    
    // Načtení všech komponent
    await Promise.all(components.map(loadComponent));
    
    console.log("Komponenty úspěšně načteny. Inicializuji UI a logiku.");

    // Ruční spuštění event listenerů, které by se jinak spustily dříve, než by existovalo HTML
    initUIListeners();
    initTranslationsListener();
    initCartListeners();
    initCalculatorListeners();
    
    // Zajištění překladu ihned po načtení UI
    if (typeof applyTranslations === 'function') {
        applyTranslations();
    }
}

// Spustí proces načítání ve chvíli, kdy je struktura dokumentu připravena
document.addEventListener("DOMContentLoaded", initializeApp);
