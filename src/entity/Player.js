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

        this.body.position.set(0, 10, 0);

    }

    update() {
        this.mesh.position.copy(this.body.position);
        this.mesh.quaternion.copy(this.body.quaternion);
    }

    keypress(e) {

        if(!(e['w'] || e['a'] || e['s'] || e['d']))
            return;

        if (e['w'] && e['d']) {
            //Movimento Frente - Direita
            this.body.position.z -= 1;
            this.body.position.x += 1;
          } else if (e['w'] && e['a']) {
            //Movimento Frente - Esquerda
            this.body.position.z -= 1;
            this.body.position.x -= 1;
          } else if (e['s'] && e['d']) {
            //Movimento Tras - Direita
            this.body.position.z += 1;
            this.body.position.x += 1;
          } else if (e['s'] && e['a']) {
            //Movimento Tras - Esquerda
            this.body.position.z += 1;
            this.body.position.x -= 1;
          } else if (e['w']) {
                this.body.position.z -= 1
            } else if (e['s']) {
                this.body.position.z += 1
            } else if (e['a']) {
                this.body.position.x -= 1
            } else if (e['d']) {
                this.body.position.x += 1
            }

    }

};

export { Player };