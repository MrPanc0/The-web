let currentLang = 'cs';

const translations = {
    cs: {
        pageTitle: "Cluster3D | Profi Služby", navServices: "Služby", navGallery: "Galerie", navFaq: "FAQ", navContact: "Kontakt",
        heroTitle: "Profesionální 3D tisk a služby <br><span class='text-blue-600 dark:text-blue-500'>bez čekání</span>", heroDesc: "Vyberte si službu, zjistěte okamžitě cenu a nechte zbytek na nás s maximální přesností.",
        tabPrint: "3D Tisk", tabModel: "3D Modelování", tabScan: "3D Skenování",
        sectionTitle: "<i class='fa-solid fa-cloud-arrow-up mr-2'></i> Nahrajte model", dropText: "Přetáhněte 3D soubor (STL, OBJ, 3MF) sem", dropSub: "Vypočítáme objem automaticky",
        labelUnits: "Jednotky", optMm: "Milimetry (mm)", optCm: "Centimetry (cm)", optM: "Metry (m)", labelInfill: "Pevnost (Výplň)", optInf25: "Okrasný", optInf40: "Málo namáhaný", optInf70: "Namáhaný", optInf100: "Plný", infillWarning: "Malý díl vyžaduje plnou výplň.",
        labelMaterial: "Materiál", labelPieces: "Počet kusů", estPriceLabel: "Odhadovaná cena tisku", netVolumeLabel: "Čistý objem k tisku:", discountLabel: "Množstevní sleva:", feeLabel: "Manipulační poplatek:", prepLabel: "Příprava tisku:", 
        orderBtnPrint: "Přejít k objednávce", orderBtnModel: "Přejít k objednávce", orderBtnScan: "Přejít k objednávce", loadingText: "Zpracovávám 3D model...", alertStl: "Podporované formáty jsou .stl, .obj, .3mf", alertParse: "Soubor je poškozený nebo nepodporovaný.",
        modelTitle: "3D Modelování na zakázku", modelDesc: "Máte nápad, součástku nebo technický výkres? Převedeme vaše představy do 3D modelu.", modelRateLabel: "Hodinová sazba",
        scanTitle: "Profesionální 3D Skenování", scanDesc: "Potřebujete zkopírovat reálný objekt? Digitalizujeme s maximální přesností.", scanNoteUi: "<i class='fa-solid fa-circle-info text-blue-500 mr-2'></i>Typ skeneru si vyberete v dalším kroku.",
        scanIrDesc: "Vhodné pro střední a větší objekty, sochy či díly. Standardní rozlišení s přesností až 0.1 mm.",
        scanLaserDesc: "Ideální pro technické díly, reverzní inženýrství a jemné detaily. Extrémní přesnost až 0.02 mm.",
        galleryTitle: "Naše práce", faqTitle: "Často kladené dotazy", faqQ1: "Jak dlouho trvá výroba?", faqA1: "Standardní objednávky expedujeme do 48 hodin.", faqQ2: "Jaké jsou maximální rozměry tisku?", faqA2: "Náš největší tiskový objem je 300 x 300 x 400 mm.", faqQ3: "Můžete mi pomoci s návrhem modelu?", faqA3: "Ano! Nabízíme i drobné úpravy.", footerDesc: "Profesionální zakázkový 3D tisk a modelování.", contactTitle: "Kontakt", socialTitle: "Sledujte nás",
        modalTitle: "Odeslat poptávku", cartTitle: "Položky poptávky:", cartLblPrint: "3D Tisk", cartLblModel: "3D Modelování", cartLblScan: "3D Skenování",
        cartOptScanIr: "Infračervené (500 Kč/h)", cartOptScanLaser: "Modrý laser (1500 Kč/h)", 
        cartOptScanIrUi: "Infračervené", cartOptScanLaserUi: "Modrý laser",
        lblAddPrint: "Přidat Tisk", lblAddModel: "Přidat Modelování", lblAddScan: "Přidat Skenování", 
        warnAddPrint: "Pro kalkulaci tisku vložte 3D model do kalkulačky na webu.", modalName: "Vaše jméno", modalEmail: "E-mail", modalNote: "Poznámka", modalSubmitBtn: "Odeslat poptávku",
        modalFileLabel: "Přiložit soubory (STEP, STL, OBJ...)", sumHourlyStr: " + hodinová sazba", valOnRequest: "Na dotaz", valNoModel: "Model nenahrán (přiložte manuálně)"
    },
    en: {
        pageTitle: "Cluster3D | Pro Services", navServices: "Services", navGallery: "Gallery", navFaq: "FAQ", navContact: "Contact",
        heroTitle: "Professional 3D Printing & Services <br><span class='text-blue-600 dark:text-blue-500'>Without Waiting</span>", heroDesc: "Select a service, get an instant quote, and leave the rest to us.",
        tabPrint: "3D Printing", tabModel: "3D Modeling", tabScan: "3D Scanning",
        sectionTitle: "<i class='fa-solid fa-cloud-arrow-up mr-2'></i> Upload Model", dropText: "Drag & drop your 3D file (STL, OBJ, 3MF) here", dropSub: "Volume calculated automatically",
        labelUnits: "Units", optMm: "Millimeters (mm)", optCm: "Centimeters (cm)", optM: "Meters (m)", labelInfill: "Strength (Infill)", optInf25: "Decorative", optInf40: "Lightly Stressed", optInf70: "Stressed", optInf100: "Solid", infillWarning: "Small part requires solid infill.",
        labelMaterial: "Material", labelPieces: "Quantity", estPriceLabel: "Estimated Print Price", netVolumeLabel: "Net Print Volume:", discountLabel: "Volume Discount:", feeLabel: "Handling Fee:", prepLabel: "Print Preparation:", 
        orderBtnPrint: "Proceed to Order", orderBtnModel: "Proceed to Order", orderBtnScan: "Proceed to Order", loadingText: "Processing 3D model...", alertStl: "Supported formats: .stl, .obj, .3mf", alertParse: "File is corrupted or unsupported.",
        modelTitle: "Custom 3D Modeling", modelDesc: "Have an idea, a part, or a drawing? We convert it into a 3D model.", modelRateLabel: "Hourly Rate",
        scanTitle: "Professional 3D Scanning", scanDesc: "Need to duplicate a real object? We digitize with max precision.", scanNoteUi: "<i class='fa-solid fa-circle-info text-blue-500 mr-2'></i>Select scanner type in the next step.",
        scanIrDesc: "Suitable for medium and large objects, sculptures, or parts. Standard resolution with up to 0.1 mm accuracy.",
        scanLaserDesc: "Ideal for technical parts, reverse engineering, and fine details. Extreme accuracy up to 0.02 mm.",
        galleryTitle: "Our Work", faqTitle: "FAQ", faqQ1: "How long does production take?", faqA1: "We ship standard orders within 48 hours.", faqQ2: "What are the max print dimensions?", faqA2: "Our largest volume is 300 x 300 x 400 mm.", faqQ3: "Can you help with model design?", faqA3: "Yes! We offer modifications too.", footerDesc: "Professional custom 3D printing and modeling.", contactTitle: "Contact Us", socialTitle: "Follow Us",
        modalTitle: "Submit Request", cartTitle: "Your Cart Items:", cartLblPrint: "3D Printing", cartLblModel: "3D Modeling", cartLblScan: "3D Scanning",
        cartOptScanIr: "Infrared (500 CZK/h)", cartOptScanLaser: "Blue Laser (1500 CZK/h)", 
        cartOptScanIrUi: "Infrared", cartOptScanLaserUi: "Blue Laser",
        lblAddPrint: "Add Printing", lblAddModel: "Add Modeling", lblAddScan: "Add Scanning", 
        warnAddPrint: "For print calculation, upload a 3D model in the web calculator.", modalName: "Your Name", modalEmail: "Email", modalNote: "Note", modalSubmitBtn: "Submit Request",
        modalFileLabel: "Attach files (STEP, STL, OBJ...)", sumHourlyStr: " + hourly rate", valOnRequest: "On request", valNoModel: "Model not uploaded"
    }
};

function initTranslationsListener() {
    const langBtn = document.getElementById('lang-toggle');
    if(langBtn) {
        langBtn.addEventListener('click', () => {
            currentLang = currentLang === 'cs' ? 'en' : 'cs';
            langBtn.innerText = currentLang === 'cs' ? 'EN' : 'CS';
            applyTranslations();
            if (typeof updateCartUI === 'function') updateCartUI();
        });
    }
}

function applyTranslations() {
    const t = translations[currentLang];
    const elements = [
        'page-title', 'nav-services', 'nav-gallery', 'nav-faq', 'nav-contact', 'drop-sub', 'label-units', 'opt-mm', 'opt-cm', 'opt-m', 
        'label-infill', 'opt-inf-25', 'opt-inf-40', 'opt-inf-70', 'opt-inf-100', 'label-material', 'label-pieces', 'est-price-label', 
        'net-volume-label', 'discount-label', 'fee-label', 'prep-label', 'order-btn-print', 'order-btn-model', 'order-btn-scan', 
        'loading-text', 'model-title', 'model-desc', 'model-rate-label', 'scan-title', 'scan-desc', 'gallery-title', 'faq-title', 
        'faq-q1', 'faq-a1', 'faq-q2', 'faq-a2', 'faq-q3', 'faq-a3', 'footer-desc', 'contact-title', 'social-title', 'modal-title', 
        'cart-title', 'cart-lbl-print', 'cart-lbl-model', 'cart-lbl-scan', 'cart-opt-scan-ir', 'cart-opt-scan-laser', 
        'cart-opt-scan-ir-ui', 'cart-opt-scan-laser-ui', 'scan-ir-desc', 'scan-laser-desc', 'lbl-add-print', 'lbl-add-model', 'lbl-add-scan', 'modal-name', 'modal-email', 
        'modal-note', 'modal-submit-btn', 'modal-file-label'
    ];
    
    elements.forEach(id => {
        const el = document.getElementById(id);
        let key = id.replace(/-([a-z0-9])/g, g => g[1].toUpperCase());
        if (el && t[key]) el.innerText = t[key];
    });

    const setTxt = (id, key) => { if (document.getElementById(id)) document.getElementById(id).innerText = t[key]; };
    const setHtml = (id, key) => { if (document.getElementById(id)) document.getElementById(id).innerHTML = t[key]; };

    setTxt('tab-btn-print', 'tabPrint');
    setTxt('tab-btn-model', 'tabModel');
    setTxt('tab-btn-scan', 'tabScan');

    setHtml('hero-title', 'heroTitle');
    setHtml('section-title', 'sectionTitle');
    setHtml('scan-note-ui', 'scanNoteUi');
    
    setTxt('infill-warning', 'infillWarning');
    setTxt('warn-add-print', 'warnAddPrint');
    
    const dropTextEl = document.getElementById('drop-text');
    if (dropTextEl && (dropTextEl.innerText.includes("STL") || dropTextEl.innerText.includes("sem") || dropTextEl.innerText.includes("here"))) {
        dropTextEl.innerText = t.dropText;
    }
}
