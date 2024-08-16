// Configurando a cena e o renderizador
let scene = new THREE.Scene();
let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// -----------------Câmera ------------------------------
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;
camera.position.x = 2;
camera.position.y = 5;

const controls = new THREE.TrackballControls(camera, renderer.domElement);
controls.rotateSpeed = 2.0;
controls.zoomSpeed = 4;
controls.panSpeed = 0.8;
controls.staticMoving = true;
//-----------------------Modelos---------------------------

const loader = new THREE.TextureLoader();

const sphereBase = loader.load('./Ground054_2K-JPG/Ground054_2K-JPG_Color.jpg');

//displacement -> altera de fato a geometria, ele a deforma. Um mapa de altura
//normal e o bump não afeta a geometria de fato, tudo uma ilusão, ele usa a luz para criar essa ilusão

const sphereNormal = loader.load('./Ground054_2K-JPG/Ground054_2K-JPG_NormalGL.jpg');

//bump cria de forma artificial na superficie dos objetos usando tons de cinza
//ele basicamente só recebe cores binarias
//quando os valores estão proximos de 50% de cinza, há pouco detalhe
//quando ficam mais brilhantes, mais proximos do branco, os detalhes "simulam" estar saindo na superficie.
//No meu caso é o contrario, ele da esse efeito de profundidade da areia pois está mais proximo do preto
//ruim do bump é que ele quebra com muita facilidade

const sphereDisplacement = loader.load('./Ground054_2K-JPG/Ground054_2K-JPG_Displacement.jpg');


//A normal usa RGB, , o rgb diz exatamente a direção exata na superficie normal para cada poligono

const sphereMaterial = new THREE.MeshStandardMaterial({
    map: sphereBase,
    bumpScale: 1,
    normalScale: new THREE.Vector2(2, 2),
    displacementScale: 0.1,
});

const sphereGeometry = new THREE.SphereGeometry(1);
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);

const directionalLight = new THREE.DirectionalLight(0xF6E96B,2);
scene.add(directionalLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Luz ambiente com intensidade 0.5
scene.add(ambientLight);

//---------------------Rotação da luz -------------------

let ang = 0;
const angIncreaseRate = 0.01;
const radius = 6;

//-------------------Menu--------------------------
//
const nenhumaOpSlct = document.getElementById("none");
nenhumaOpSlct.addEventListener("change", function () {
    if (this.checked) {
        sphereMaterial.bumpMap = null;
        sphereMaterial.normalMap = null;
        sphere.material.needsUpdate = true; //ele vê qual esta selecionada e renderiza no final para que de fato só o selecionado esteja sendo aplicado sobre a esfera
    }
});

const bumpMappingOpt = document.getElementById("bump_mapping");
bumpMappingOpt.addEventListener("change", function () {
    if (this.checked) {
        sphereMaterial.bumpMap = sphereDisplacement; //usando a de displacement pois mesmo não sendo o recomendado, ela serve pois também possui uma escala de cinza.
        sphereMaterial.normalMap = null;
        sphere.material.needsUpdate = true;
    }
});

const normalMappingOpt = document.getElementById("normal_mapping");
normalMappingOpt.addEventListener("change", function () {
    if (this.checked) {
        sphereMaterial.normalMap = sphereNormal;
        sphereMaterial.bumpMap = null;
        sphere.material.needsUpdate = true;
    }
});

const displacementMappingOpt = document.getElementById("displacement_mapping");
displacementMappingOpt.addEventListener("change", function () {
    if (this.checked) {
        sphereMaterial.displacementMap = sphereDisplacement;
        sphere.material.needsUpdate = true;
    } else {
        sphereMaterial.displacementMap = null;
        sphere.material.needsUpdate = true;
    }
}) //aqui o displacement fica em cima de qualquer outro mapa que tenha sido marcado

function animate() {
    requestAnimationFrame(animate);
    controls.update();

    directionalLight.position.x = radius * Math.cos(ang);
    directionalLight.position.z = radius * Math.sin(ang);
    ang += angIncreaseRate;

    renderer.render(scene, camera);
}

animate()