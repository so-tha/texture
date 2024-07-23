// Configurando a cena e o renderizador
let scene = new THREE.Scene();
let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// confirmando que as luzes vão piscar e movimentar
let spotLightMovementRight = [true, true, true]; 
let spotLightBlink = [true, true, true];

// Criando o plano
function createPlane() {
    const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(20, 20),
        new THREE.MeshPhongMaterial({ color: 0x606676, shininess: 10000 }),
    );
    plane.rotation.x = -Math.PI / 2; // deixar ele deitado imitando chão
    scene.add(plane);
}

createPlane();

// Luzes
function addLight() {
    // Luz ambiente - só ilumina os objeto da cena de forma igual, e não possui direção
    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.2);
    scene.add(ambientLight);

    // Luz direcional - é como o sol, uma fonte distante de luz. Basicamente raios paralelos que iluminam toda a cena de forma uniforme
    const directionalLight = new THREE.DirectionalLight(0xFFFF00, 0.9);
    directionalLight.position.set(0, 5, 0);
    scene.add(directionalLight);

    // vermelho, verde e azul
    // Spotlight - Um unico ponto em formato de cone emite luz, como um holofote
    const colors = [0xFF0000, 0x00FF00, 0x0000FF];
    const positions = [[-3, 3, 0], [0, 3, 0], [3, 3, 0]];
    for (let i = 0; i < 3; i++) {
        const spotLight = new THREE.SpotLight(colors[i], 2);
        spotLight.position.set(...positions[i]); //definindo a posição da luz
        spotLight.angle = Math.PI / 3; //quanto maior o angulo o feixe é mais disperso, diminuindo o angulo o feixe é mais focado
        spotLight.penumbra = 0.1; // suavidade das bordas das sombras (entre a luz e a sombra), fica entre 0 e 1
        scene.add(spotLight);
        spotLights.push(spotLight);
    }
}

let spotLights = [];
let lambertObject, phongObject;
let angle = 0;
addLight();

const lambertMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 });
const phongMaterial = new THREE.MeshPhongMaterial({ color: 0x0000ff, shininess: 10000 });

function loadGLTFModel(url, material, position, callback) {
    const loader = new THREE.GLTFLoader();
    loader.load(url, function(gltf) {
        gltf.scene.traverse(function(node) {
            if (node.isMesh) {
                node.material = material;
            }
        });
        gltf.scene.position.set(position.x, position.y, position.z);
        scene.add(gltf.scene);
        callback(gltf.scene);
    });
}

loadGLTFModel('./cat/scene.gltf', lambertMaterial, { x: -1.5, y: 1, z: 0 }, function(object) {
    lambertObject = object; 
// o Lambert possui apenas a componente difusa (dar uma cor basica ao ambiente), ideial pra superficies foscas
});

loadGLTFModel('./cat/scene.gltf', phongMaterial, { x: 1.5, y: 1, z: 0 }, function(object) {
    phongObject = object;
// O Phong é difusa e especular, então possui brilho e reflexo. Ela é ideial pra superficies brilhantes e reflexivas.    
});

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
            spotLight.position.x += 0.1; //as luzes irão se movimentar para a direita torno do eixo x caso verdadeiro
        } else {
            spotLight.position.x -= 0.1; // e para a esquerda caso falso 
        }

        if (spotLight.position.x > 5) {
            spotLightMovementRight[index] = false; // se a posição da luz se movimentar além de 5, ela fica false e se movimenta para a direita
        } else if (spotLight.position.x < -5) {
            spotLightMovementRight[index] = true;
        }

        // Piscagem das luzes
        //Faz o movimento de piscar, a intensidade sobe até no maximo 7 e depois ela quase apaga e assim vai
        if (spotLightBlink[index]) {
            spotLight.intensity += 0.6; 
        } else {
            spotLight.intensity -= 0.6;
        }

        if (spotLight.intensity > 8) {
            spotLightBlink[index] = false;
        } else if (spotLight.intensity < 0.5) { // 0.5 pois ela para de diminuir e começa a aumentar 
            spotLightBlink[index] = true;
        }
    });

    // Gatinhos orbitando
    if (lambertObject && phongObject) {
        angle += 0.04; // a cada frame o angulo aumenta 0.04 passos , criando a ilusão de movimento, 
        let radius = 2; // a distancia em que um gatinho orbita o outro
        //
        lambertObject.position.x = radius * Math.cos(angle);
        lambertObject.position.z = radius * Math.sin(angle);
        phongObject.position.x = radius * Math.cos(angle + Math.PI); // o pi serve para inverter a posição
        phongObject.position.z = radius * Math.sin(angle + Math.PI); // se não fosse o pi, os objetos iriam ficar sobrepostos
    }

    controls.update();
    renderer.render(scene, camera);
}

animate();
