import * as THREE from "three";
import * as CANNON from "cannon-es";

class Bucket {

    constructor({ player, radiusTop, radiusBottom, height, textures }) {

        this.player = player;

        this.radiusTop = radiusTop;
        this.radiusBottom = radiusBottom;
        this.height = height;

        this.geometry = new THREE.CylinderGeometry(
            this.radiusTop,
            this.radiusBottom,
            this.height,
            16,
            16
        )

        this.mesh = new THREE.Mesh(
            this.geometry,
            [
                new THREE.MeshBasicMaterial({ 
                    color: "rgb(180, 70, 73)",
                    transparent: true 
                }),
                new THREE.MeshBasicMaterial({ 
                    map: textures.bucketTop,
                    transparent: true 
                }),
                new THREE.MeshBasicMaterial({ 
                    color: "rgb(180, 70, 73)",
                    transparent: true 
                }),
            ]
        )

        this.body = new CANNON.Body({
            mass: 3,
            shape: new CANNON.Box(
                new THREE.Vector3(
                    this.player.getWidth() / 2, 
                    this.player.getHeight() / 2, 
                    this.depth / 2
                )
            )
        });

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
