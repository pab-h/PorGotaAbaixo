import * as THREE from "three";
import * as CANNON from "cannon-es";

import { threeToCannon, ShapeType } from "three-to-cannon";
import { GLTFLoader } from "three/examples/jsm/Addons.js";

class Bucket {

    constructor({ player, textures }) {

        this.player = player;
        this.textures = textures;
        this.height = .5

    }

    async init() {

        const loader = new GLTFLoader();

        const bucketGLFT = await loader.loadAsync(
            "/objects/metal_bucket/scene.gltf"
        );

        this.mesh = bucketGLFT.scene.children[0];

        this.mesh.scale.copy(new THREE.Vector3(.25, .25, .25));

        const {
            shape: bucketShape, 
            offset, 
            orientation
        } = threeToCannon(this.mesh, { type: ShapeType.MESH });

        this.body = new CANNON.Body({ mass: 1 });
        this.body.id = 0;
        this.body.addShape(bucketShape, offset, orientation);

        this.body.quaternion.setFromEuler(
            -Math.PI / 2, 
            0,
            0
        );
    }

    update() {
        this.body.position.set(
            this.player.getX(),
            this.player.getY() + this.player.getHeight() / 2 + this.height / 2,
            this.player.getZ()
        );

        this.mesh.position.copy(this.body.position);
        this.mesh.quaternion.copy(this.body.quaternion);
    }

}

export { Bucket };
