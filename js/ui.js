// Tmavý režim
document.getElementById('dark-mode-toggle').addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
    const icon = document.getElementById('dark-icon');
    icon.classList.toggle('fa-moon');
    icon.classList.toggle('fa-sun');
});

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