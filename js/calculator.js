// @ts-nocheck
let rawVolume = 0; 

function getGeometryVolume(geom) {
    if (!geom) return 0;
    let geometry = geom.index ? geom.toNonIndexed() : geom;
    let position = geometry.attributes.position;
    if (!position) return 0;
    
    const array = position.array;
    let vol = 0;
    
    // Čteme rovnou po 9 číslech (3 vrcholy x 3 souřadnice X,Y,Z = 1 trojúhelník)
    for (let i = 0; i < array.length; i += 9) {
        let p1x = array[i],   p1y = array[i+1], p1z = array[i+2];
        let p2x = array[i+3], p2y = array[i+4], p2z = array[i+5];
        let p3x = array[i+6], p3y = array[i+7], p3z = array[i+8];

        // Matematický křížový a skalární součin vypsaný natvrdo (nejrychlejší možný způsob)
        vol += (
            p1x * (p2y * p3z - p2z * p3y) +
            p1y * (p2z * p3x - p2x * p3z) +
            p1z * (p2x * p3y - p2y * p3x)
        ) / 6.0;
    }
    
    return Math.abs(vol);
}

function updatePrice() {
    if (rawVolume === 0) return;
    
    const u = document.getElementById('units').value;
    const pieces = parseInt(document.getElementById('pieces').value) || 1;
    let v = u === 'mm' ? rawVolume / 1000 : (u === 'm' ? rawVolume * 1000000 : rawVolume);
    
    const inf = document.getElementById('infill');
    if (v < 40) { 
        inf.value = "1.00"; 
        inf.disabled = true; 
        document.getElementById('infill-warning').classList.remove('hidden'); 
    } else { 
        inf.disabled = false; 
        document.getElementById('infill-warning').classList.add('hidden'); 
    }
    
    v = v * parseFloat(inf.value);
    document.getElementById('volume-display').innerText = v.toFixed(2);
    
    let price = v * parseFloat(document.getElementById('material').value) * pieces;
    let disc = pieces >= 100 ? 0.15 : (pieces >= 10 ? 0.10 : 0);
    
    document.getElementById('discount-row').classList.toggle('hidden', disc === 0);
    document.getElementById('discount-display').innerText = `- ${Math.round(disc * 100)} %`;
    
    let handlingFee = pieces >= 100 ? 0 : 50;
    const feeDisplay = document.getElementById('fee-display');
    if (feeDisplay) {
        if (handlingFee === 0) {
            feeDisplay.innerText = "0 Kč";
            feeDisplay.classList.add('text-green-600', 'dark:text-green-400');
        } else {
            feeDisplay.innerText = handlingFee + " Kč";
            feeDisplay.classList.remove('text-green-600', 'dark:text-green-400');
        }
    }
    
    document.getElementById('total-price').innerText = Math.round((price * (1 - disc)) + handlingFee);
    
    if (typeof toggleService === 'function' && typeof cartState !== 'undefined' && cartState.print) {
        toggleService('print', true);
    }
}

function initCalculatorListeners() {
    const fileInput = document.getElementById('file-input');
    if (fileInput) {
        fileInput.addEventListener('change', function(e) {
            try {
                const file = e.target.files[0];
                if (!file) return;
                const ext = file.name.split('.').pop().toLowerCase();
                
                if (!['stl', 'obj', '3mf'].includes(ext)) {
                    alert(typeof translations !== 'undefined' ? translations[currentLang].alertStl : "Nepodporovaný formát. Nahrajte STL, OBJ nebo 3MF.");
                    return;
                }
                
                document.getElementById('drop-text').innerText = file.name;
                document.getElementById('loading').classList.remove('hidden');
                
                const reader = new FileReader();
                reader.onload = function(ev) {
                    try {
                        let vol = 0;
                        if (ext === 'stl') {
                            const loader = new THREE.STLLoader();
                            const geometry = loader.parse(ev.target.result);
                            vol = getGeometryVolume(geometry);
                        } else if (ext === '3mf') {
                            const loader = new THREE.ThreeMFLoader();
                            try {
                                const obj = loader.parse(ev.target.result);
                                if (!obj) throw new Error("Loader vrátil prázdný objekt.");
                                obj.traverse(child => {
                                    if (child.isMesh && child.geometry) {
                                        child.updateMatrixWorld();
                                        const worldScale = new THREE.Vector3();
                                        child.matrixWorld.decompose(new THREE.Vector3(), new THREE.Quaternion(), worldScale);
                                        let meshVol = getGeometryVolume(child.geometry);
                                        vol += meshVol * Math.abs(worldScale.x * worldScale.y * worldScale.z);
                                    }
                                });
                            } catch (parseError) {
                                console.error("Detail chyby 3MF:", parseError);
                                throw new Error("Soubor 3MF je poškozený nebo obsahuje neznám reference. Zkuste soubor zaslat přímo na email.");
                            }
                        } else if (ext === 'obj') {
                            const loader = new THREE.OBJLoader();
                            const text = new TextDecoder().decode(ev.target.result);
                            const obj = loader.parse(text);
                            obj.traverse(c => { if (c.isMesh) vol += getGeometryVolume(c.geometry); });
                        }
                        
                        rawVolume = vol; 
                        updatePrice();
                    } catch (err) { 
                        console.error(err);
                        alert("Chyba při zpracování modelu: " + err.message); 
                    } finally { 
                        document.getElementById('loading').classList.add('hidden'); 
                    }
                };
                reader.readAsArrayBuffer(file);
            } catch (globalErr) {
                alert("Kritická chyba: " + globalErr.message);
            }
        });
    }

    ['units', 'infill', 'material'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('change', updatePrice);
    });

    const piecesEl = document.getElementById('pieces');
    if (piecesEl) piecesEl.addEventListener('input', updatePrice);
}
