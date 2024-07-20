let scene = new THREE.Scene();
let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let spotLightMovementRight = true; // se for true vai pra direita e se for false vai pra esquerda
const spotLight = new THREE.SpotLight(0xfffff); // Definir a cor depois

// Criando o plano
function createPlane() {
    const geometry = new THREE.PlaneGeometry(100, 100, 20, 20);
    const material = new THREE.MeshBasicMaterial({
        color: 0x00000,
        wireframe: false,
        side: THREE.DoubleSide // DoubleSide faz ser possível ver o plano em todos os lados
    });
    const plane = new THREE.Mesh(geometry, material);


    scene.add(plane);
}

function addPerspectiveCamera() {
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    //Primeiro é o campo de visão
    //near and far, define os objetos que não seram renderizados.
}
// Objeto que interage com a luz
function createTorusKnot() {
    const geometry = new THREE.TorusKnotGeometry();
    const materialLambert = new THREE.MeshLambertMaterial();

    const torusKnot = new THREE.Mesh(geometry, materialLambert);

    torusKnot.position.x = 2;
    torusKnot.position.y = 6;
    torusKnot.position.z = 2;

    scene.add(torusKnot);
}

createPlane();
createTorusKnot();

// Luzes
function addLight() {

    spotLight.position.set(0, 20, 0); // No alto
    spotLight.castShadow = true; // Possui sombra
    scene.add(spotLight);

    const spotLightHelper = new THREE.SpotLightHelper(spotLight);
    scene.add(spotLightHelper);
}

function addAmbientLight() {
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);
}

addAmbientLight();
addLight();

// Cria o "reflexo" de luz
function createDodecahedron() {
    const dodeGeometry = new THREE.DodecahedronGeometry(7, 1);
    const materialPhong = new THREE.MeshPhongMaterial({
        color: 0x58b33a,
        specular: 0xffffff,
        shininess: 30,
        flatShading: false
    });

    const dodecahedron = new THREE.Mesh(dodeGeometry, materialPhong);

    dodecahedron.position.x = 8;
    dodecahedron.position.y = 6;
    dodecahedron.position.z = 2;
    dodecahedron.scale.set(0.25, 0.25, 0.25);

    scene.add(dodecahedron);
}

createDodecahedron();

// Adicionando uma câmera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 15;

function animate() {
    requestAnimationFrame(animate);

    // Efeito da luz de baladinha
    if (spotLightMovementRight) {
        spotLight.position.x += 1;
    } else {
        spotLight.position.x -= 1;
    }

    if (spotLight.position.x > 20) {
        spotLightMovementRight = false;
    } else if (spotLight.position.x < -20) {
        spotLightMovementRight = true;
    }

    renderer.render(scene, camera);
}

animate();
