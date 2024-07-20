// Configurando a cena e o renderizador
let scene = new THREE.Scene();
let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Variáveis para movimentação e piscagem das luzes
let spotLightMovementRight = [true, true, true];
let spotLightBlink = [true, true, true];

// Criando o plano
function createPlane() {
    const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(20, 20),
        new THREE.MeshPhongMaterial({ color: 0x606676, shininess: 10000 }),
    );
    plane.rotation.x = -Math.PI / 2;
    scene.add(plane);
}

createPlane();

// Luzes
function addLight() {
    // Luz ambiente branca
    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.2);
    scene.add(ambientLight);

    // Luz direcional amarela
    const directionalLight = new THREE.DirectionalLight(0xFFFF00, 0.9);
    directionalLight.position.set(0, 5, 0);
    scene.add(directionalLight);

    // Luzes coloridas (vermelho, verde e azul)
    const colors = [0xFF0000, 0x00FF00, 0x0000FF];
    const positions = [[-3, 3, 0], [0, 3, 0], [3, 3, 0]];
    for (let i = 0; i < 3; i++) {
        const spotLight = new THREE.SpotLight(colors[i], 2);
        spotLight.position.set(...positions[i]);
        spotLight.angle = Math.PI / 6;
        spotLight.penumbra = 0.1;
        scene.add(spotLight);
        spotLights.push(spotLight);
    }
}

let spotLights = [];
addLight();

const lambertMaterial = new THREE.MeshLambertMaterial({ color: 0xFEF3E2 });
const phongMaterial = new THREE.MeshPhongMaterial({ color: 0xFEF3E2 });
loadGLTFModel('./cat/scene.gltf', lambertMaterial, { x: -1.5, y: 1, z: 0 });
loadGLTFModel('./cat/scene.gltf', phongMaterial, { x: 1.5, y: 1, z: 0 });

function loadGLTFModel(url, material, position) {
    const loader = new THREE.GLTFLoader();
    loader.load(url, function(gltf) {
        gltf.scene.traverse(function(node) {
            if (node.isMesh) {
                node.material = material;
            }
        });
        gltf.scene.position.set(position.x, position.y, position.z);
        scene.add(gltf.scene);
    });
}

// Adicionando uma câmera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;
camera.position.x = 2;
camera.position.y = 5;

const controls = new THREE.TrackballControls(camera, renderer.domElement);
controls.rotateSpeed = 2.0;
controls.zoomSpeed = 4;
controls.panSpeed = 0.8;
controls.staticMoving = true;

// Função de animação
function animate() {
    requestAnimationFrame(animate);

    // Movimentação e piscagem das luzes
    spotLights.forEach((spotLight, index) => {
        // Movimentação
        if (spotLightMovementRight[index]) {
            spotLight.position.x += 0.1;
        } else {
            spotLight.position.x -= 0.1;
        }

        if (spotLight.position.x > 5) {
            spotLightMovementRight[index] = false;
        } else if (spotLight.position.x < -5) {
            spotLightMovementRight[index] = true;
        }

        // Piscagem das luzes
        if (spotLightBlink[index]) {
            spotLight.intensity += 0.1;
        } else {
            spotLight.intensity -= 0.1;
        }

        if (spotLight.intensity > 3) {
            spotLightBlink[index] = false;
        } else if (spotLight.intensity < 0.5) {
            spotLightBlink[index] = true;
        }
    });

    controls.update();
    renderer.render(scene, camera);
}

animate();