import * as THREE from "three";
import * as CANNON from "cannon-es";

/* Configuração da Cena */

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75, 
  window.innerWidth / window.innerHeight, 
  0.1, 
  1000 
);

camera.position.z = 5;

const renderer = new THREE.WebGLRenderer();

renderer.setSize(
  window.innerWidth, 
  window.innerHeight 
);
renderer.setAnimationLoop(animate);

document.body.appendChild(renderer.domElement);

/* Configuração do visual da Esfera */


const radius = 1;

const geometry = new THREE.SphereGeometry(radius);
const material = new THREE.MeshNormalMaterial();

const sphereMesh = new THREE.Mesh(
  geometry,
  material
);

scene.add(sphereMesh);

/* Configuração da física do mundo */

const world = new CANNON.World({
  gravity: new CANNON.Vec3(0, -9.82, 0)
});

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

/* Configuração da física da Esfera */

const sphereBody = new CANNON.Body({
  mass: 5,
  shape: new CANNON.Sphere(radius)
});
sphereBody.position.set(0, 10, 0);

world.addBody(sphereBody);


/* Processo de rendenização */

function animate() {

  world.fixedStep();

  sphereMesh.position.copy(sphereBody.position);
  sphereMesh.quaternion.copy(sphereBody.quaternion);

	renderer.render( 
    scene, 
    camera 
  );

}