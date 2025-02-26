import * as THREE from "three";
import * as CANNON from "cannon-es";

class Particle {
    
    constructor(radius) {
        this.radius = radius;


        this.geometry = new THREE.SphereGeometry(
            radius, 8, 8
        );
        this.material = new THREE.MeshBasicMaterial({
            color: "blue"
        });
        this.mesh = new THREE.Mesh(
            this.geometry,
            this.material
        );

        this.body = new CANNON.Body({
            shape: new CANNON.Sphere(radius),
            mass: 0.001
        });

    }

    update() {
        this.mesh.position.copy(this.body.position);
        this.mesh.quaternion.copy(this.body.quaternion);
    }

}

class Particles {

    constructor({ roof, world, scene, particleRadius }) {
        this.roof = roof;
        this.world = world;
        this.scene = scene;
        this.particleRadius = particleRadius;

        this.particles = [];  
    }

    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    getRandomCoordinates() {
        const minX = (this.roof.mesh.position.x - (this.roof.height / 2))
        const maxX = (this.roof.mesh.position.x + (this.roof.height / 2))
        const minZ = (this.roof.mesh.position.z - (this.roof.width / 2))
        const maxZ = (this.roof.mesh.position.z + (this.roof.width / 2))

        const x = this.getRandomInt(minX, maxX);
        const y = this.roof.mesh.position.y - 5;  
        const z = this.getRandomInt(minZ, maxZ);;

        return new CANNON.Vec3(x, y, z);
    }

    createRandomParticle(radius) {
        const randomPosition = this.getRandomCoordinates()

        
        const particle = new Particle(radius);

        particle.body.position.copy(randomPosition);

        this.scene.add(particle.mesh);
        this.world.addBody(particle.body);

        return particle;
    }

    createParticles(particleAmount) {
        for (let i = 0; i < particleAmount; i++) {
            const randomParticle = this.createRandomParticle(this.particleRadius);

            this.particles.push(randomParticle);
        }
    }

    removeParticles(particleAmount) {
        for (let i = 0; i < particleAmount; i++) {
            let removedParticle = this.particles.pop();
            
            if(removedParticle !== undefined) {
                this.scene.remove(removedParticle.mesh)
                this.world.removeBody(removedParticle.body)
            }
        }
    }

    updateParticles() {
        this.particles.forEach(particle => {
            particle.update();
        });
    }

};

export { Particles };