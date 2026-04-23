// @ts-nocheck
let rawVolume = 0; 

// Proměnné pro 3D scénu
let scene, camera, renderer, controls, currentMesh, currentWrapper;
let animationId;

function init3DPreview() {
    const container = document.getElementById('model-preview');
    if (!container || renderer) return;

    scene = new THREE.Scene();
    
    camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    // Vytvoření světla (můžete upravit barvu a intenzitu)
    const cameraLight = new THREE.DirectionalLight(0xffffff, 1.5);

    // Nastavení pozice relativně ke kameře 
    cameraLight.position.set(0, 0, 1);
    // PŘIPOJENÍ KE KAMEŘE místo do scény
    camera.add(cameraLight);
    scene.add(camera);
    
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(10, 20, 10);
    scene.add(dirLight);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

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

function showModelPreview(loadedObject, isGeometry = false) {
    const dropZone = document.getElementById('drop-zone');
    const previewContainer = document.getElementById('preview-container');

    dropZone.classList.add('hidden');
    previewContainer.classList.remove('hidden');

    if (!renderer) {
        init3DPreview();
    } else {
        camera.aspect = previewContainer.clientWidth / previewContainer.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(previewContainer.clientWidth, previewContainer.clientHeight);
    }

    if (currentWrapper) {
        scene.remove(currentWrapper);
        currentWrapper.traverse(child => {
            if (child.isMesh) {
                if (child.geometry) child.geometry.dispose();
                if (child.material) {
                    if (Array.isArray(child.material)) child.material.forEach(m => m.dispose());
                    else child.material.dispose();
                }
            }
        });
        currentWrapper = null;
    }

    const material = new THREE.MeshStandardMaterial({ 
        color: 0x2563eb, 
        roughness: 0.4,
        metalness: 0.1
    });

    if (isGeometry) {
        currentMesh = new THREE.Mesh(loadedObject, material);
    } else {
        currentMesh = loadedObject;
        currentMesh.traverse(child => {
            if (child.isMesh) {
                child.material = material;
            }
        });
    }

    const box = new THREE.Box3().setFromObject(currentMesh);
    const center = new THREE.Vector3();
    box.getCenter(center);
    
    currentMesh.position.x = -center.x;
    currentMesh.position.y = -center.y;
    currentMesh.position.z = -center.z;

    currentWrapper = new THREE.Group();
    currentWrapper.add(currentMesh);
    scene.add(currentWrapper);

    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);
    
    camera.position.set(0, maxDim * 0.5, maxDim * 1.5);
    camera.lookAt(0, 0, 0);
    
    if (controls) {
        controls.target.set(0, 0, 0);
        controls.update();
    }
}

function resetPreview() {
    document.getElementById('drop-zone').classList.remove('hidden');
    document.getElementById('preview-container').classList.add('hidden');
    document.getElementById('file-input').value = ""; 
    document.getElementById('total-price').innerText = "0";
    document.getElementById('volume-display').innerText = "0.00";
    rawVolume = 0;

    if (currentWrapper && scene) {
        scene.remove(currentWrapper);
        currentWrapper = null;
    }
}

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
                            // --- VLASTNÍ NEPRŮSTŘELNÝ 3MF PARSER ---
                            try {
                                const fileData = new Uint8Array(ev.target.result);
                                const unzipped = fflate.unzipSync(fileData);

                                let availableObjects = {};
                                let buildItems = [];

                                // 1. Projdeme ÚPLNĚ VŠECHNY .model soubory v archivu
                                Object.keys(unzipped).forEach(path => {
                                    if (path.toLowerCase().endsWith('.model')) {
                                        const xmlString = new TextDecoder().decode(unzipped[path]);
                                        const parser = new DOMParser();
                                        const xmlDoc = parser.parseFromString(xmlString, "application/xml");

                                        // Extrakce všech 3D sítí (i těch z Bambu/Prusa Sliceru)
                                        const objects = xmlDoc.getElementsByTagName('object');
                                        for (let i = 0; i < objects.length; i++) {
                                            const objNode = objects[i];
                                            const id = objNode.getAttribute('id');
                                            availableObjects[id] = { isMesh: false, geometry: null, components: [] };

                                            const meshNode = objNode.getElementsByTagName('mesh')[0];
                                            if (meshNode) {
                                                availableObjects[id].isMesh = true;
                                                const vertices = [];
                                                const indices = [];

                                                // Načtení vrcholů
                                                const vs = meshNode.getElementsByTagName('vertex');
                                                for (let j = 0; j < vs.length; j++) {
                                                    vertices.push(
                                                        parseFloat(vs[j].getAttribute('x')),
                                                        parseFloat(vs[j].getAttribute('y')),
                                                        parseFloat(vs[j].getAttribute('z'))
                                                    );
                                                }

                                                // Načtení trojúhelníků
                                                const ts = meshNode.getElementsByTagName('triangle');
                                                for (let j = 0; j < ts.length; j++) {
                                                    indices.push(
                                                        parseInt(ts[j].getAttribute('v1')),
                                                        parseInt(ts[j].getAttribute('v2')),
                                                        parseInt(ts[j].getAttribute('v3'))
                                                    );
                                                }

                                                // Vytvoření čisté Three.js geometrie (bez barev)
                                                const geometry = new THREE.BufferGeometry();
                                                geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
                                                geometry.setIndex(indices);
                                                geometry.computeVertexNormals();
                                                availableObjects[id].geometry = geometry;
                                            }

                                            // Podpora pro komponenty (více částí jednoho objektu)
                                            const compsNode = objNode.getElementsByTagName('components')[0];
                                            if (compsNode) {
                                                const comps = compsNode.getElementsByTagName('component');
                                                for (let j = 0; j < comps.length; j++) {
                                                    availableObjects[id].components.push({
                                                        objectId: comps[j].getAttribute('objectid'),
                                                        transform: comps[j].getAttribute('transform')
                                                    });
                                                }
                                            }
                                        }

                                        // Najdeme objekty, které se mají reálně vykreslit (Build items)
                                        const buildNode = xmlDoc.getElementsByTagName('build')[0];
                                        if (buildNode) {
                                            const items = buildNode.getElementsByTagName('item');
                                            for (let i = 0; i < items.length; i++) {
                                                buildItems.push({
                                                    objectId: items[i].getAttribute('objectid'),
                                                    transform: items[i].getAttribute('transform')
                                                });
                                            }
                                        }
                                    }
                                });

                                // 2. Funkce pro sestavení modelu podle transformačních matic ze Sliceru
                                function buildThreeObject(objectId, transformStr) {
                                    const objData = availableObjects[objectId];
                                    if (!objData) return null;

                                    const group = new THREE.Group();

                                    // Aplikace pozice a rotace
                                    if (transformStr) {
                                        const t = transformStr.split(' ').map(parseFloat);
                                        if (t.length === 12) {
                                            const matrix = new THREE.Matrix4();
                                            matrix.set(
                                                t[0], t[3], t[6], t[9],
                                                t[1], t[4], t[7], t[10],
                                                t[2], t[5], t[8], t[11],
                                                 0,    0,    0,    1
                                            );
                                            group.applyMatrix4(matrix);
                                        }
                                    }

                                    if (objData.isMesh && objData.geometry) {
                                        // Vnutíme náš jednotný modrý materiál
                                        const material = new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.4, metalness: 0.1 });
                                        const mesh = new THREE.Mesh(objData.geometry, material);
                                        group.add(mesh);
                                    }

                                    objData.components.forEach(comp => {
                                        const child = buildThreeObject(comp.objectId, comp.transform);
                                        if (child) group.add(child);
                                    });

                                    return group;
                                }

                                // 3. Finální složení scény
                                const finalGroup = new THREE.Group();
                                buildItems.forEach(item => {
                                    const child = buildThreeObject(item.objectId, item.transform);
                                    if (child) finalGroup.add(child);
                                });

                                // 4. Výpočet objemu pro všechny části modelu
                                vol = 0;
                                finalGroup.updateMatrixWorld(true);
                                finalGroup.traverse(child => {
                                    if (child.isMesh && child.geometry) {
                                        const worldScale = new THREE.Vector3();
                                        child.matrixWorld.decompose(new THREE.Vector3(), new THREE.Quaternion(), worldScale);
                                        try {
                                            let meshVol = getGeometryVolume(child.geometry);
                                            vol += meshVol * Math.abs(worldScale.x * worldScale.y * worldScale.z);
                                        } catch (e) {}
                                    }
                                });

                                modelForPreview = finalGroup;
                                isGeom = false; // Říkáme hlavní funkci, že jde o Group, nikoliv holou geometrii

                            } catch (customErr) {
                                console.error("Kritická chyba parseru 3MF:", customErr);
                                throw new Error("Soubor 3MF se nepodařilo načíst. Zkuste nahrát STL formát.");
                            }
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
