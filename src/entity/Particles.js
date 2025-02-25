import * as THREE from "three";
import * as CANNON from "cannon-es";

class Particles {

    constructor({ elementReference, world, scene }) {
        this.elementReference = elementReference;
        this.world = world;
        this.scene = scene;

        this.defaultParticleRadius = 0.15;

        this.particles = [];  
    }

    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    getRandomCoordinates() {
        const min_x = (this.elementReference.getPosition().x - (this.elementReference.getHeight()/2))
        const max_x = (this.elementReference.getPosition().x + (this.elementReference.getHeight()/2))
        const min_z = (this.elementReference.getPosition().z - (this.elementReference.getWidth()/2))
        const max_z = (this.elementReference.getPosition().z + (this.elementReference.getWidth()/2))

        const x = this.getRandomInt(min_x, max_x);
        const y = this.elementReference.getPosition().y + 1;  
        const z = this.getRandomInt(min_z, max_z);;

        return new CANNON.Vec3(x, y, z);
    }

    createRandomParticle(particleRadius) {
        const vec3_coordinates = this.getRandomCoordinates()

        const particleShape = new CANNON.Sphere(this.radius);
        const particleBody = new CANNON.Body({
          mass: .01,
          position: vec3_coordinates
        });
        particleBody.addShape(particleShape);
        this.world.addBody(particleBody);

        const geometry = new THREE.SphereGeometry(particleRadius, 8, 8);
        const material = new THREE.MeshBasicMaterial({ color: Math.random() * 0x2596BE });
        const particleMesh = new THREE.Mesh(geometry, material);
        
        particleMesh.position.copy(vec3_coordinates);
        
        particleMesh.userData.physicsBody = particleBody;

        this.scene.add(particleMesh);

        return particleMesh;
    }

    createParticles(particleAmount, particleRadius = this.defaultParticleRadius) {
        for (let i = 0; i < particleAmount; i++) {
            this.particles.push(this.createRandomParticle(particleRadius));
        }
    }

    removeParticles(particleAmount) {
        for (let i = 0; i < particleAmount; i++) {
            let removedParticle = this.particles.pop();
            
            if(removedParticle !== undefined) {
                this.scene.remove(removedParticle)
                this.world.removeBody(removedParticle)
            }
        }
    }

    updateParticles() {
        this.particles.forEach(particle => {
            const { x, y, z } = particle.userData.physicsBody.position;
            particle.position.set(x, y, z);
        });
    }

};

export { Particles };