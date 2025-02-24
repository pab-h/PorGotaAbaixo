import * as THREE from "three";
import * as CANNON from "cannon-es";

class Player {

    constructor({ width, height, depth }) {
        this.width  = width;
        this.height = height;
        this.depth  = depth;
        

        this.geometry = new THREE.BoxGeometry(
            this.width,
            this.height,
            this.depth
        );
        this.material = new THREE.MeshNormalMaterial();
        this.mesh     = new THREE.Mesh(
            this.geometry,
            this.material
        );

        // vejam https://discourse.threejs.org/t/three-js-and-cannon-js-are-different-in-width-property-of-object/47813
        this.body = new CANNON.Body({
            mass: 10,
            shape: new CANNON.Box(
                new THREE.Vector3(
                    this.width / 2, 
                    this.height / 2, 
                    this.depth / 2
                )
            )
        });

        this.body.position.set(0, this.depth, 0);

    }

    update() {
        this.mesh.position.copy(this.body.position);
        this.mesh.quaternion.copy(this.body.quaternion);
    }

    keypress(keysPressed) {

        if(!(keysPressed['w'] || keysPressed['a'] || keysPressed['s'] || keysPressed['d']))
            return;

        if (keysPressed['w'] && keysPressed['d']) {
            //Movimento Frente - Direita
            this.body.position.z -= 1;
            this.body.position.x += 1;

          } else if (keysPressed['w'] && keysPressed['a']) {
            //Movimento Frente - Esquerda
            this.body.position.z -= 1;
            this.body.position.x -= 1;
          } else if (keysPressed['s'] && keysPressed['d']) {
            //Movimento Tras - Direita
            this.body.position.z += 1;
            this.body.position.x += 1;
          } else if (keysPressed['s'] && keysPressed['a']) {
            //Movimento Tras - Esquerda
            this.body.position.z += 1;
            this.body.position.x -= 1;
          } else {
            if (keysPressed['w']) {
                this.body.position.z -= 1
            } else if (keysPressed['s']) {
                this.body.position.z += 1
            } else if (keysPressed['a']) {
                this.body.position.x -= 1
            } else if (keysPressed['d']) {
                this.body.position.x += 1
            }
        }

       

    }

};

export { Player };