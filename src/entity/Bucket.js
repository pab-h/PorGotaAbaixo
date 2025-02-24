import * as THREE from "three";
import * as CANNON from "cannon-es";

class Bucket {

    constructor({ player, width, height, depth }) {

        this.player = player;

        this.width  = width;
        this.height = height;
        this.depth  = depth;


        this.geometry = new THREE.BoxGeometry(
            this.width,
            this.height,
            this.depth
        );
        this.material = new THREE.MeshBasicMaterial({ color: "red" });
        this.mesh     = new THREE.Mesh(
            this.geometry,
            this.material
        );

        this.body = new CANNON.Body({
            mass: 3,
            shape: new CANNON.Box(
                new THREE.Vector3(
                    this.player.width / 2, 
                    this.player.height / 2, 
                    this.depth / 2
                )
            )
        });

    }

    update() {

        this.body.position.set(
            this.player.body.position.x,
            this.player.body.position.y + this.player.height / 2 + this.height / 2,
            this.player.body.position.z
        );

        this.mesh.position.copy(this.body.position);
        this.mesh.quaternion.copy(this.body.quaternion);
    }

}

export { Bucket };
