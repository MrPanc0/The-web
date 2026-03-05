// @ts-nocheck
const cartState = { print: false, model: false, scan: false };
const printDetailsObj = { price: 0, desc: "" };

function openCartModal(trigger) {
    cartState[trigger] = true;
    if (trigger === 'print') {
        if (typeof rawVolume !== 'undefined' && rawVolume > 0) {
            printDetailsObj.price = document.getElementById('total-price').innerText;
            printDetailsObj.desc = `${document.getElementById('pieces').value} ks | ${document.getElementById('material').options[document.getElementById('material').selectedIndex].text.split('(')[0].trim()} | ${document.getElementById('infill').options[document.getElementById('infill').selectedIndex].text}`;
        } else {
            printDetailsObj.price = translations[currentLang].valOnRequest;
            printDetailsObj.desc = translations[currentLang].valNoModel;
        }
        transferFiles();
    }
    updateCartUI();
    document.getElementById('order-modal').classList.remove('hidden');
}

function toggleService(service, state) {
    cartState[service] = state;
    if (service === 'print' && state) {
        printDetailsObj.price = (typeof rawVolume !== 'undefined' && rawVolume > 0) ? document.getElementById('total-price').innerText : translations[currentLang].valOnRequest;
        printDetailsObj.desc = (typeof rawVolume !== 'undefined' && rawVolume > 0) ? "Přidáno z kalkulačky" : translations[currentLang].valNoModel;
        if (typeof rawVolume !== 'undefined' && rawVolume > 0) transferFiles();
    }
    updateCartUI();
}

function updateCartUI() {
    const t = translations[currentLang];
    document.getElementById('cart-item-print').classList.toggle('hidden', !cartState.print);
    document.getElementById('cart-item-model').classList.toggle('hidden', !cartState.model);
    document.getElementById('cart-item-scan').classList.toggle('hidden', !cartState.scan);
    document.getElementById('btn-add-print').classList.toggle('hidden', cartState.print);
    document.getElementById('btn-add-model').classList.toggle('hidden', cartState.model);
    document.getElementById('btn-add-scan').classList.toggle('hidden', cartState.scan);
    document.getElementById('warn-add-print').classList.toggle('hidden', !cartState.print || (typeof rawVolume !== 'undefined' && rawVolume > 0));

    let sArr = [], dArr = [], sum = 0, hr = false;

    if (cartState.print) {
        document.getElementById('cart-price-print').innerText = isNaN(printDetailsObj.price) ? printDetailsObj.price : printDetailsObj.price + " Kč";
        document.getElementById('cart-desc-print').innerText = printDetailsObj.desc;
        sArr.push(t.cartLblPrint); 
        dArr.push(`${t.cartLblPrint}: ${printDetailsObj.price} (${printDetailsObj.desc})`);
        if (!isNaN(printDetailsObj.price)) sum += parseInt(printDetailsObj.price);
    }
    if (cartState.model) {
        sArr.push(t.cartLblModel); 
        dArr.push(`${t.cartLblModel}: 350 Kč/h`); 
        hr = true;
    }
    if (cartState.scan) {
        const scanSel = document.getElementById('cart-scan-tech');
        document.getElementById('cart-price-scan').innerText = scanSel.value + " Kč / h";
        sArr.push(t.cartLblScan); 
        dArr.push(`${t.cartLblScan}: ${scanSel.options[scanSel.selectedIndex].text}`);
        hr = true;
    }

    document.getElementById('hidden-services').value = sArr.join(', ');
    document.getElementById('hidden-details').value = dArr.join('\n');
    document.getElementById('hidden-price-sum').value = sum > 0 ? `${sum} Kč${hr ? t.sumHourlyStr : ''}` : (cartState.print && isNaN(printDetailsObj.price) ? t.valOnRequest : '0 Kč');
    
    const submitBtn = document.getElementById('modal-submit-btn');
    if(!cartState.print && !cartState.model && !cartState.scan) {
        submitBtn.disabled = true; submitBtn.classList.add('opacity-50', 'cursor-not-allowed');
    } else {
        submitBtn.disabled = false; submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
    }
}

function transferFiles() {
    const cFile = document.getElementById('file-input');
    const mFile = document.getElementById('modal-file-input');
    if (cFile && cFile.files.length > 0) {
        const dt = new DataTransfer();
        for(let i=0; i<mFile.files.length; i++) dt.items.add(mFile.files[i]);
        let exists = false;
        for(let i=0; i<mFile.files.length; i++) if (mFile.files[i].name === cFile.files[0].name) exists = true;
        if (!exists) dt.items.add(cFile.files[0]);
        mFile.files = dt.files;
    }
}

function initCartListeners() {
    const cmBtn = document.getElementById('close-modal');
    if (cmBtn) cmBtn.addEventListener('click', () => document.getElementById('order-modal').classList.add('hidden'));

    const scanTech = document.getElementById('cart-scan-tech');
    if (scanTech) scanTech.addEventListener('change', updateCartUI);
}