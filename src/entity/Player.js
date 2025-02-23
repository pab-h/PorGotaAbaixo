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

        const { key } = e;

        if (key == "w") {
            this.body.position.z -= 1
        }

        if (key == "s") {
            this.body.position.z += 1
        }

        if (key == "a") {
            this.body.position.x -= 1
        }

        if (key == "d") {
            this.body.position.x += 1
        }

    }

};

export { Player };