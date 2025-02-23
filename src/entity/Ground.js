import * as THREE from "three";
import * as CANNON from "cannon-es";

class Ground {

    constructor({ width, height, texture }) {
        this.width   = width;
        this.height  = height;
        this.texture = texture;


        this.geometry = new THREE.PlaneGeometry(
            this.width,
            this.height
        );
        this.material = new THREE.MeshBasicMaterial({
            map:  this.texture,
            side: THREE.DoubleSide
        });
        this.mesh     = new THREE.Mesh(
            this.geometry,
            this.material
        );


        this.body = new CANNON.Body({
            type: CANNON.Body.STATIC,
            shape: new CANNON.Plane()
        });
          
        this.body.quaternion.setFromEuler(
            -Math.PI / 2, 
            0,
            0
        );

        this.mesh.position.copy(this.body.position);
        this.mesh.quaternion.copy(this.body.quaternion);

    }

};

export { Ground };