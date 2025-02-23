import * as THREE from "three";


class Textures {
    
    constructor() {

        this.loader = new THREE.TextureLoader();

        this.ground = this.loader.load(
            "/textures/ground.jpg"
        );
        this.ground.colorSpace = THREE.SRGBColorSpace;

    }

}

export { Textures }