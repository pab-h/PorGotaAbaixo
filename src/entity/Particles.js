import * as THREE from "three";
import * as CANNON from "cannon-es";

class Particle {
    
    constructor(radius, bucketId) {
        this.radius = radius;
        this.bucketId = bucketId;
        this.ballCount = 0;
        this.colors = ["blue", 0x5DE2E7]
        this.geometry = new THREE.SphereGeometry(
            radius, 8, 8
        );
        this.material = new THREE.MeshBasicMaterial({
            color: this.colors[Math.floor(Math.random()*2 )]
        });
        this.mesh = new THREE.Mesh(
            this.geometry,
            this.material
        );

        this.body = new CANNON.Body({
            shape: new CANNON.Sphere(radius),
            mass: 0.001
        });

        
        // Detect collisions between two bodies
        this.body.addEventListener('collide', (event) => {
            const collidedWith = event.body; // The body it collided with
        
            // Log information about the collision
            console.log("Collision detected between", this.body.id, "and", collidedWith.id, "bucketId:", this.bucketId);

            if (event.body.id ===  this.bucketId) {
                console.log("Ball collided with the bucket!");

                // Count and remove the ball here
                //AJEITAR A FUNÇÃO DE HANDLE BALL COLISION "Uncaught ReferenceError: handleBallCollision is not defined" 
                // ESSA FUNçÃO DEVE REMOVER A BOLINHA E INCREMENTAR O CONTADOR DE PARTICULAS OBTIDAS (ballCount)
                //handleBallCollision(ballBody); 
            }
        
            // Handle the collision, e.g., stop the object, change color, etc.
        });
    }

    handleBallCollision(ballBody) {
        // Increment the collision count
        this.ballCount++;
        console.log(`Ball count: ${this.ballCount}`);

        // Remove the ball from the physics world
        world.removeBody(ballBody);

        // Optionally, also remove the Three.js mesh if you have one associated with the ball
        if (ballBody.mesh) {
            scene.remove(ballBody.mesh);  // Remove from the Three.js scene
        }
    }

    update() {
        this.mesh.position.copy(this.body.position);
        this.mesh.quaternion.copy(this.body.quaternion);
    }

}

class Particles {
  
    constructor({ roof, world, scene, bucketId }) {
        this.roof = roof;
        this.world = world;
        this.scene = scene;
        this.bucketId = bucketId;

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

        const x = 0//this.getRandomInt(minX, maxX);
        const y = this.roof.mesh.position.y - 5;  
        const z = 0//this.getRandomInt(minZ, maxZ);;

        return new CANNON.Vec3(x, y, z);
    }

    createRandomParticle(radius) {
        const randomPosition = this.getRandomCoordinates()

        
        const particle = new Particle(radius, this.bucketId);

        particle.collisionResponse = true;
        particle.ccdSpeedThreshold = 1; // Set a threshold for the speed to start using CCD
        particle.ccdRadius = radius; // Use a radius for the CCD check (similar to the sphere size)

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