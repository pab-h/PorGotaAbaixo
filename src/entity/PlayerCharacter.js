import * as THREE from "three";
import * as CANNON from "cannon-es";

class Steve {
    constructor(texture_path, physicsWorld) {
      this._rotationX = 1;
      this.scale = 0.5;
      this._steve = new THREE.Group();
      this._armLeft = new THREE.Group();
      this._armRight = new THREE.Group();
      this._head = new THREE.Group();
      this._body = new THREE.Group();
      this._legLeft = new THREE.Group();
      this._legRight = new THREE.Group();
        
      this.physicsWorld = physicsWorld;

      // Default texture path
      if (texture_path === undefined) {
        texture_path = "./textures/mertdogan12-skin.png";
      }
  
      const texture = new THREE.TextureLoader().load(texture_path);
      texture.magFilter = THREE.NearestFilter;
  
      const material = new THREE.MeshStandardMaterial({
        map: texture,
      });
      const secondLayerMaterial = new THREE.MeshStandardMaterial({
        map: texture,
      });
      secondLayerMaterial.transparent = true;
  
      // Arms, body, head, and legs setup
      this._armLeft.add(this.createBox(-1.8, -2, 0, 4, 12, 4, 36, 52, material, this.scale));
      this._armLeft.add(this.createBox(2, -2, 0, 4, 12, 4, 52, 52, secondLayerMaterial, this.scale));
      this._armLeft.position.set(4, 6.5, 0);
      this._armLeft.rotateX(Math.PI);
  
      this._armRight.add(this.createBox(1.8, -2, 0, 4, 12, 4, 44, 20, material, this.scale));
      this._armRight.add(this.createBox(-2, -2, 0, 4, 12, 4, 44, 36, secondLayerMaterial, this.scale));
      this._armRight.position.set(-4, 6.5, 0);
      this._armRight.rotateX(Math.PI);
  
      this._body.add(this.createBox(0, 6, 0, 8, 12, 4.1, 20, 20, material, this.scale));
      this._body.add(this.createBox(0, 0, 0, 8, 12, 4.1, 20, 36, secondLayerMaterial, this.scale));
  
      this._head.add(this.createBox(0, 4, 0, 8, 8, 8, 8, 8, material, this.scale));
      this._head.add(this.createBox(0, 4, 0, 8, 8, 8, 40, 8, secondLayerMaterial, this.scale));
      this._head.position.set(0, 6, 0);
  
      this._legLeft.add(this.createBox(2, -1, 0, 4, 12, 4, 4, 20, material, this.scale));
      this._legLeft.add(this.createBox(2, -12, 0, 4, 12, 4, 4, 52, secondLayerMaterial, this.scale));
  
      this._legRight.add(this.createBox(-2, -1, 0, 4, 12, 4, 4, 20, material, this.scale));
      this._legRight.add(this.createBox(-2, -12, 0, 4, 12, 4, 4, 36, secondLayerMaterial, this.scale));
  
      this.steve.add(this._armLeft, this._armRight, this._body, this._head, this._legLeft, this._legRight);
  
      // Initial position
      this._steve.position.set(0, 0, 0); // Set default position

      this.createPhysicsBody();
    }
  
    createUVData(box, x, y, width, height, depth) {
        const uvData = [
          ...this.createUVDataSide(width + x, y, depth, height), // Left
          ...this.createUVDataSide(x - depth, y, depth, height), // Right
          ...this.createUVDataSide(x, y - depth, width, depth), // Top
          ...this.createUVDataSide(x + width, y - depth, width, depth), // Bottom
          ...this.createUVDataSide(x, y, width, height), // Front
          ...this.createUVDataSide(depth + width + x, y, width, height), // Back
        ];
    
        const uvAttribute = box.attributes.uv;
        uvAttribute.set(new Float32Array(uvData));
        uvAttribute.needsUpdate = true;
      }
    
      createUVDataSide(u, v, width, height) {
        return [
          u / 64,
          1 - v / 64,
          (u + width) / 64,
          1 - v / 64,
          u / 64,
          1 - (v + height) / 64,
          (u + width) / 64,
          1 - (v + height) / 64,
        ];
      }
    
      createBox(x, y, z, width, height, depth, textureX, textureY, material, scale = 1) {
    
        var box = new THREE.BoxGeometry(
            width * scale,
            height * scale,
            depth * scale
        );
        const mesh = new THREE.Mesh(box, material);
    
        mesh.position.set(x * scale, y * scale, z * scale);
    
        this.createUVData(box, textureX, textureY, width, height, depth);
    
        return mesh;
      }

    // Create a method to set Steve's position
    setPosition(x, y, z) {
      this._steve.position.set(x, y, z);
    }

    getHeight() {
        return 20;
    }

    getWidth() {
        return this._steve.width;
    }

    getX() {
        return this._steve.position.x;
    }

    getY() {
        return this._steve.position.y;
    }

    getZ() {
        return this._steve.position.z;
    }
  
      move(dx, dy, dz) {
        // Move the Three.js mesh visually
        this._steve.position.x += dx;
        this._steve.position.y += dy;
        this._steve.position.z += dz;
    
        // Sync the new position to Cannon.js body
        this.physicsBody.position.copy(this._steve.position);
        
        // Reset the velocity to zero (so it doesn't keep moving due to inertia)
        this.physicsBody.velocity.set(0, 0, 0);
    }da
  
    // Method to update rotation
    rotate(rx, ry, rz) {
      this._steve.rotation.x += rx;
      this._steve.rotation.y += ry;
      this._steve.rotation.z += rz;
    }
  
    get steve() {
      return this._steve;
    }

    createPhysicsBody() {
        this.physicsBody = new CANNON.Body({ 
            mass: 10,
            shape: new CANNON.Box(new CANNON.Vec3((4 * this.scale)/2, (12 * this.scale)/2, (4 * this.scale)/2)),
            position: new CANNON.Vec3(0, 3, 0)
         });
        this.physicsBody.mass = 0; // Set to zero to disable gravity effects
        this.physicsBody.updateMassProperties(); // Update the body's properties

    
        // Add the physics body to the physics world
        this.physicsWorld.addBody(this.physicsBody);
      }

    update() {
        // Sync the Three.js model position and rotation with Cannon.js physics body
        this._steve.position.copy(this.physicsBody.position);
        this._steve.quaternion.copy(this.physicsBody.quaternion);
    }

    keypress(keysPressed) {

        if(!(keysPressed['w'] || keysPressed['a'] || keysPressed['s'] || keysPressed['d']))
            return;

        if (keysPressed['w'] && keysPressed['d']) {
            //Movimento Frente - Direita
            this.move(1, 0, -1);

          } else if (keysPressed['w'] && keysPressed['a']) {
            //Movimento Frente - Esquerda
            this.move(-1, 0, -1);
          } else if (keysPressed['s'] && keysPressed['d']) {
            //Movimento Tras - Direita
            this.move(1, 0, 1);

          } else if (keysPressed['s'] && keysPressed['a']) {
            //Movimento Tras - Esquerda
            this.move(-1, 0, 1);

          } else if (keysPressed['w']) {
                this.move(0, 0, -1);

            } else if (keysPressed['s']) {
                this.move(0, 0, 1);

            } else if (keysPressed['a']) {
                this.move(-1, 0, 0);

            } else if (keysPressed['d']) {
                this.move(1, 0, 0);
                
            }
    }
}

export { Steve };
  