import * as THREE from "three";

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

};

export { Roof };