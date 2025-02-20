import * as THREE from "three";
import * as CANNON from "cannon-es";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

/* Carregando as texturas */

const loader = new THREE.TextureLoader();

const groundTexture = loader.load("../textures/ground.jpg");
groundTexture.colorSpace = THREE.SRGBColorSpace;

/* Configuração da Cena */

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75, 
  window.innerWidth / window.innerHeight, 
  0.1, 
  1000 
);

camera.position.z = 10;
camera.position.y = 10;

const renderer = new THREE.WebGLRenderer();

renderer.setSize(
  window.innerWidth, 
  window.innerHeight 
);

document.body.appendChild(renderer.domElement);

/* Configurando os controle de orbita */

const controls = new OrbitControls(
  camera,
  renderer.domElement
);

controls.update();

/* Configuração do visual da Esfera */


const radius = 1;

const sphereGeometry = new THREE.SphereGeometry(radius);
const sphereMaterial = new THREE.MeshNormalMaterial();

const sphereMesh = new THREE.Mesh(
  sphereGeometry,
  sphereMaterial
);

scene.add(sphereMesh);

/* Configuração da física do mundo */

const world = new CANNON.World({
  gravity: new CANNON.Vec3(0, -9.82, 0)
});

/* Configuração do chão */

const groundWidth = 15;
const groundHeight = 15;

const groundGeometry = new THREE.PlaneGeometry(
  groundWidth,
  groundHeight
);
const groundMaterial = new THREE.MeshBasicMaterial({
  map: groundTexture
});

const groundMesh = new THREE.Mesh(
  groundGeometry,
  groundMaterial
);

scene.add(groundMesh);

const groundBody = new CANNON.Body({
  type: CANNON.Body.STATIC,
  shape: new CANNON.Plane()
});

groundBody.quaternion.setFromEuler(
  - Math.PI / 2, 
  0,
  0
);

world.addBody(groundBody);

groundMesh.position.copy(groundBody.position);
groundMesh.quaternion.copy(groundBody.quaternion);

/* Configuração da física da Esfera */

const sphereBody = new CANNON.Body({
  mass: 5,
  shape: new CANNON.Sphere(radius)
});
sphereBody.position.set(0, 10, 0);

world.addBody(sphereBody);


/* Processo de rendenização */

function animate() {

  controls.update();

  world.fixedStep();

  sphereMesh.position.copy(sphereBody.position);
  sphereMesh.quaternion.copy(sphereBody.quaternion);

	renderer.render( 
    scene, 
    camera 
  );

}

renderer.setAnimationLoop(animate);