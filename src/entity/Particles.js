import * as THREE from "three";
import * as CANNON from "cannon-es";

class Particles {

    constructor({ elementReference, texture, world, scene }) {
        this.elementReference = elementReference;
        this.texture = texture;
        this.world = world;
        this.scene = scene;

        this.defaultParticleRadius = 0.15; // raio padrão das partículas esféricas

        this.particles = []; // Armazena o array de 
    }

    // Retorna um inteiro no intervalo entre os inteiros min e max
    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    // Retorna um CANNON Vec3 com altura (y) e dentro do plano especificado no elementReference (roof)
    getRandomCoordinates() {
        const min_x = (this.elementReference.getPosition().x - (this.elementReference.getHeight()/2))
        const max_x = (this.elementReference.getPosition().x + (this.elementReference.getHeight()/2))
        const min_z = (this.elementReference.getPosition().z - (this.elementReference.getWidth()/2))
        const max_z = (this.elementReference.getPosition().z + (this.elementReference.getWidth()/2))

        const x = this.getRandomInt(min_x, max_x);
        const y = this.elementReference.getPosition().y + 1; // Partícula gerada um pouco acima do plano
        const z = this.getRandomInt(min_z, max_z);;

        return new CANNON.Vec3(x, y, z);
    }

    // Cria uma única partícula na coordenada específica 
    createRandomParticle(particleRadius) {
        const vec3_coordinates = this.getRandomCoordinates()

        // Cria um corpo físico esférico com Cannon.js
        const particleShape = new CANNON.Sphere(this.radius);
        const particleBody = new CANNON.Body({
          mass: 1,
          position: vec3_coordinates
        });
        particleBody.addShape(particleShape);
        this.world.addBody(particleBody);

        // Criação da MESH com ThreeJS para renderização
        const geometry = new THREE.SphereGeometry(particleRadius, 8, 8);
        const material = new THREE.MeshBasicMaterial({ color: Math.random() * 0x2596BE });
        const particleMesh = new THREE.Mesh(geometry, material);
        particleMesh.position.copy(vec3_coordinates);
        
        // Vincula o corpo físico do Cannon.js com a MESH do ThreeJS
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
        // Atualiza as partículas das Meshes do Three.js baseados na física do mundo
        this.particles.forEach(particle => {
        const { x, y, z } = particle.userData.physicsBody.position;
        particle.position.set(x, y, z);
      });
    }

};

export { Particles };