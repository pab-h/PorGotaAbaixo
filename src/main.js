import * as THREE from "three";
import * as CANNON from "cannon-es";

import * as dat from "dat.gui";

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { Player } from "./entity/Player";
import { Ground } from "./entity/Ground";
import { Roof } from "./entity/Roof";
import { Particles } from "./entity/Particles";

import { Textures } from "./utils/Textures";
import { Bucket } from "./entity/Bucket";
import { Steve } from "./entity/PlayerCharacter";

async function main() {
  /* Instanciando os objetos em cena */
  
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
  
  const ambientLight = new THREE.AmbientLight(
    0xFFFFFF,
    1
  );

  const universeGeometry = new THREE.SphereGeometry(100, 64, 64);
  const universeMaterial = new THREE.MeshBasicMaterial({
      color: 0xECF0F1,
      side: THREE.BackSide
  });
  scene.add(new THREE.Mesh(universeGeometry, universeMaterial));

  scene.add(ambientLight);
  
  const world = new CANNON.World({
    gravity: new CANNON.Vec3(0, -9.82, 0)
  });

  // Criando o painel do dat.GUI
  const gui = new dat.GUI();

  // Criando um objeto para armazenar valores controláveis
  const gravitySettings = {
    gravityX: 0,
    gravityY: -9.82,
    gravityZ: 0
  };

  gui.add(gravitySettings, "gravityY", -20, 20).name("Gravidade").onChange(updateGravity);

  function updateGravity() {
    world.gravity.set(0, gravitySettings.gravityY, 0);
  }
  
  const BASE_URI = "https://mineskin.eu/skin/";
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const name = urlParams.get("name");

  const player2 = new Steve(BASE_URI + name, world);
  player2.setPosition(0, 0, 0)
  scene.add(player2.steve)

  const bucket = new Bucket({
    player: player2,
    textures: textures
  });

  await bucket.init();
  
  scene.add(bucket.mesh);

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
    player2.keypress(keysPressed);
  });
  
  window.addEventListener('keyup', (event) => {
    keysPressed[event.key.toLowerCase()] = false;
    player2.keypress(keysPressed);
  });
  
  /* Particulas */
  const particlesFactory = new Particles({
    roof: roof,
    world: world,
    scene: scene,
    bucketId: bucket.body.id
  });
  
  particlesFactory.createParticles(2);
  
  let dropTimer = 0;
  

  
  
  /* Rendenização */
  
  function animate() {

    controls.update();
    
    player2.update();
    bucket.update();
  
    world.step(1 / 60);
  
    particlesFactory.updateParticles();
  
    renderer.render( 
      scene, 
      camera 
    );
  
  
    if(dropTimer == 150 || dropTimer == 300){
      particlesFactory.createParticles(1);
    }
  
    if(dropTimer > 500) {
      particlesFactory.removeParticles(1);
      dropTimer = 0;
    }
  
    dropTimer++;
  }
  
  renderer.setAnimationLoop(animate);

}

main();
