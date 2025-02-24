import * as THREE from "three";
import { vec3 } from "three/tsl";

class Roof {

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
            side:  THREE.DoubleSide
        });

        this.mesh     = new THREE.Mesh(
            this.geometry,
            this.material
        );

        this.mesh.rotateOnAxis(
            new THREE.Vector3(1, 0, 0),
            Math.PI / 2
        );


        this.mesh.position.y = 50;

    }

    getPosition() {
        return new THREE.Vector3(this.mesh.position.x, this.mesh.position.y, this.mesh.position.z);
    }

    getWidth() {
        return this.width
    }

    getHeight() {
        return this.height
    }


};

export { Roof };