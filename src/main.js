import * as THREE from "three";
import * as CANNON from "cannon-es";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { Player } from "./entity/Player";
import { Ground } from "./entity/Ground";
import { Roof } from "./entity/Roof";

import { Textures } from "./utils/Textures";
import { Bucket } from "./entity/Bucket";

/* instanciando os objetos em cena */

const textures = new Textures();

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75, 
  window.innerWidth / window.innerHeight, 
  0.1, 
  1000 
);

camera.position.z = 60;
camera.position.y = 60;

const renderer = new THREE.WebGLRenderer();

renderer.setSize(
  window.innerWidth, 
  window.innerHeight 
);

document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(
  camera,
  renderer.domElement
);

controls.update();

const world = new CANNON.World({
  gravity: new CANNON.Vec3(0, -9.82, 0)
});


const player = new Player({
  width: 5,
  height: 10,
  depth: 5
});

scene.add(player.mesh);
world.addBody(player.body);

const bucket = new Bucket({
  player: player,
  
  width: 5,
  height: 5,
  depth: 5
});

scene.add(bucket.mesh);
world.addBody(bucket.body);


const roof = new Roof({
  width: 50, 
  height: 50,
  texture: textures.roof
});

scene.add(roof.mesh);

const ground = new Ground({  
  width: 50, 
  height: 50, 
  texture: textures.ground
});

scene.add(ground.mesh);
world.addBody(ground.body);

/* Inputs do usuário */

const keysPressed = {};

window.addEventListener('keydown', (event) => {
  keysPressed[event.key.toLowerCase()] = true;
  player.keypress(keysPressed);
});

window.addEventListener('keyup', (event) => {
  keysPressed[event.key.toLowerCase()] = false;
  player.keypress(keysPressed);
});

/* Rendenização */

function animate() {

  controls.update();
  
  player.update();
  bucket.update();

  world.fixedStep();

	renderer.render( 
    scene, 
    camera 
  );

}

renderer.setAnimationLoop(animate);