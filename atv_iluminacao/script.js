let scene = new THREE.Scene();
let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 15;
camera.position.set(3, 3, 3);
camera.lookAt(0, 0, 0);

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


const controls = new THREE.TrackballControls(camera, renderer.domElement);
controls.rotateSpeed = 2.0;
controls.zoomSpeed = 1.2;
controls.panSpeed = 0.8;
controls.staticMoving = true;

//luzes (ambiente)
const ambientLight = new THREE.AmbientLight(0xFFFFFF, 1);
scene.add(ambientLight);
//(direcional)
const directionalLight = new THREE.DirectionalLight(0xFFFF00, 0.5);
directionalLight.position.set(0, 5, 0);
scene.add(directionalLight);
//spotilight
const spotLight1 = new THREE.SpotLight(0xFF0000);
spotLight1.position.set(0, 1, 0);
spotLight1.target.position.set(0, 0, 0);
spotLight1.angle = Math.PI;
spotLight1.penumbra = 0.1;
spotLight1.intensity = 4;
scene.add(spotLight1);
scene.add(spotLight1.target);

//os objetos
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(8, 8),
    new THREE.MeshPhongMaterial({ color: 0xFFFFFF, shininess: 10000 }),
);
floor.rotation.x = -Math.PI / 2;
scene.add(floor);

let futinha1;
let frutinha2;
const loader = new THREE.GLTFLoader();
loader.load('./atv_iluminacao/scene.gltf/', (gltf) => {
    futinha1 = gltf.scene;
   frutinha1.traverse(function (child) {
        if (child.isMesh) {
            child.material = new THREE.MeshLambertMaterial({ color: 0xFFAAAA });
        }
    });
    scene.add(duck1);
   frutinha1.position.set(-1, 0, 1);

    frutinha2 = gltf.scene.clone();
    frutinha2.traverse(function (child) {
        if (child.isMesh) {
            child.material = new THREE.MeshPhongMaterial({ color: 0xAAAAFF, shininess: 10000 });
        }
    });
    scene.add(frutinha2);
    frutinha2.rotation.y = -Math.PI / 2;
    frutinha2.position.set(1, 0, -1);

    animate();
});

function animate(){
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}