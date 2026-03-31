// @ts-nocheck
let rawVolume = 0; 

// --- NOVÉ: Proměnné pro 3D scénu ---
let scene, camera, renderer, controls, currentMesh;
let animationId;

function init3DPreview() {
    const container = document.getElementById('model-preview');
    if (!container || renderer) return;

    scene = new THREE.Scene();
    
    // Kamera
    camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    
    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Světla
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(10, 20, 10);
    scene.add(dirLight);

    // Ovládání myší
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // Responzivita
    window.addEventListener('resize', () => {
        if (!container.clientWidth) return;
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });

    animate();
}

function animate() {
    animationId = requestAnimationFrame(animate);
    if (controls) controls.update();
    if (renderer && scene && camera) renderer.render(scene, camera);
}

// Univerzální funkce pro zobrazení modelu (STL, OBJ i 3MF)
function showModelPreview(loadedObject, isGeometry = false) {
    if (!renderer) init3DPreview();

    // Vyčištění předchozího modelu
    if (currentMesh) {
        scene.remove(currentMesh);
        currentMesh.traverse(child => {
            if (child.isMesh) {
                if (child.geometry) child.geometry.dispose();
                if (child.material) {
                    if (Array.isArray(child.material)) child.material.forEach(m => m.dispose());
                    else child.material.dispose();
                }
            }
        });
    }

    // Náš firemní materiál
    const material = new THREE.MeshStandardMaterial({ 
        color: 0x2563eb, 
        roughness: 0.4,
        metalness: 0.1
    });

    // Zpracování geometrie (STL) vs. Group (OBJ, 3MF)
    if (isGeometry) {
        currentMesh = new THREE.Mesh(loadedObject, material);
    } else {
        currentMesh = loadedObject;
        // U OBJ a 3MF projdeme všechny pod-objekty a vnutíme jim náš materiál
        currentMesh.traverse(child => {
            if (child.isMesh) {
                child.material = material;
            }
        });
    }

    // AUTOMATICKÉ VYCENTROVÁNÍ POMOCÍ Box3 (Funguje na cokoliv)
    const box = new THREE.Box3().setFromObject(currentMesh);
    const center = new THREE.Vector3();
    box.getCenter(center);
    
    // Posuneme model tak, aby jeho těžiště bylo přesně na 0,0,0
    currentMesh.position.x = -center.x;
    currentMesh.position.y = -center.y;
    currentMesh.position.z = -center.z;

    const wrapper = new THREE.Group();
    wrapper.add(currentMesh);
    scene.add(wrapper);

    // Nastavení kamery podle skutečné velikosti obalového boxu
    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);
    
    camera.position.set(0, maxDim * 0.5, maxDim * 1.5);
    camera.lookAt(0, 0, 0);
    
    if (controls) {
        controls.target.set(0, 0, 0);
        controls.update();
    }

    // Odkrytí UI s náhledem
    document.getElementById('drop-zone').classList.add('hidden');
    document.getElementById('preview-container').classList.remove('hidden');
}

function resetPreview() {
    document.getElementById('drop-zone').classList.remove('hidden');
    document.getElementById('preview-container').classList.add('hidden');
    document.getElementById('file-input').value = ""; 
    document.getElementById('total-price').innerText = "0";
    document.getElementById('volume-display').innerText = "0.00";
    rawVolume = 0;
}
// --- KONEC NOVÉHO KÓDU PRO 3D ---


function getGeometryVolume(geom) {
    if (!geom) return 0;
    let geometry = geom.index ? geom.toNonIndexed() : geom;
    let position = geometry.attributes.position;
    if (!position) return 0;
    
    const array = position.array;
    let vol = 0;
    
    for (let i = 0; i < array.length; i += 9) {
        let p1x = array[i],   p1y = array[i+1], p1z = array[i+2];
        let p2x = array[i+3], p2y = array[i+4], p2z = array[i+5];
        let p3x = array[i+6], p3y = array[i+7], p3z = array[i+8];

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
                        let modelForPreview = null;
                        let isGeom = false;

                        if (ext === 'stl') {
                            const loader = new THREE.STLLoader();
                            const geometry = loader.parse(ev.target.result);
                            vol = getGeometryVolume(geometry);
                            
                            modelForPreview = geometry;
                            isGeom = true;
                        } else if (ext === '3mf') {
                            const loader = new THREE.ThreeMFLoader();
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
                            
                            modelForPreview = obj;
                            isGeom = false;
                        } else if (ext === 'obj') {
                            const loader = new THREE.OBJLoader();
                            const text = new TextDecoder().decode(ev.target.result);
                            const obj = loader.parse(text);
                            obj.traverse(c => { if (c.isMesh) vol += getGeometryVolume(c.geometry); });
                            
                            modelForPreview = obj;
                            isGeom = false;
                        }
                        
                        rawVolume = vol; 
                        updatePrice();
                        
                        // Zobrazení modelu po úspěšném výpočtu objemu
                        if (modelForPreview) {
                            showModelPreview(modelForPreview, isGeom);
                        }

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
