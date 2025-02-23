import * as THREE from "three";
import * as CANNON from "cannon-es";

class Player {

    constructor(radius) {
        this.radius   = radius;
        

        this.geometry = new THREE.SphereGeometry(this.radius);
        this.material = new THREE.MeshNormalMaterial();
        this.mesh     = new THREE.Mesh(
            this.geometry,
            this.material
        );


        this.body = new CANNON.Body({
            mass: 5,
            shape: new CANNON.Sphere(this.radius)
        });

        this.body.position.set(0, 10, 0);

    }

    update() {
        this.mesh.position.copy(this.body.position);
        this.mesh.quaternion.copy(this.body.quaternion);
    }

};

export { Player };