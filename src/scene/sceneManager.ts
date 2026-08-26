import * as THREE from 'three';

export class SceneManager {
  public scene: THREE.Scene;
  public spotLight: THREE.SpotLight;

  constructor() {
    this.scene = new THREE.Scene();

    const ambient = new THREE.AmbientLight(0xffffff, 0.4);
    this.scene.add(ambient);

    // Projector light behind the user casting forward
    this.spotLight = new THREE.SpotLight(0xffeedd, 9.0);
    this.spotLight.position.set(0, 1.2, 3.2);
    this.spotLight.target.position.set(0, -0.5, -4.0);
    this.spotLight.angle = Math.PI / 2.5;
    this.spotLight.penumbra = 0.2;
    this.spotLight.castShadow = true;
    this.spotLight.shadow.mapSize.width = 2048;
    this.spotLight.shadow.mapSize.height = 2048;
    this.spotLight.shadow.camera.near = 0.5;
    this.spotLight.shadow.camera.far = 15;
    this.spotLight.shadow.bias = -0.0002;
    this.scene.add(this.spotLight);
    this.scene.add(this.spotLight.target);

    this.createRoom();
  }

  private createRoom() {
    // Room shell
    const roomGeo = new THREE.BoxGeometry(10, 6, 12);
    const roomMat = new THREE.MeshStandardMaterial({
      color: 0x5a5d64,
      roughness: 0.8,
      metalness: 0.1,
      side: THREE.BackSide,
    });
    const room = new THREE.Mesh(roomGeo, roomMat);
    room.position.set(0, 0, -3);
    room.receiveShadow = true;
    this.scene.add(room);

    // Floor Grid
    const grid = new THREE.GridHelper(10, 10, 0x444444, 0x222222);
    grid.position.set(0, -2.99, -3);
    this.scene.add(grid);

    // Main Showcase Model
    const knotGeo = new THREE.TorusKnotGeometry(0.55, 0.18, 128, 32);
    const knotMat = new THREE.MeshStandardMaterial({
      color: 0xb53b23,
      roughness: 0.25,
      metalness: 0.6,
    });
    const knot = new THREE.Mesh(knotGeo, knotMat);
    knot.position.set(0, -0.6, -2.5);
    knot.castShadow = true;
    knot.receiveShadow = true;
    this.scene.add(knot);

    // Flanking Props
    const pillarGeo = new THREE.CylinderGeometry(0.3, 0.3, 3.5, 32);
    const pillarMat = new THREE.MeshStandardMaterial({ color: 0x888890, roughness: 0.6 });

    const left = new THREE.Mesh(pillarGeo, pillarMat);
    left.position.set(-2.8, -1.25, -2.8);
    left.castShadow = true;
    left.receiveShadow = true;
    this.scene.add(left);

    const right = new THREE.Mesh(pillarGeo, pillarMat);
    right.position.set(2.8, -1.25, -2.8);
    right.castShadow = true;
    right.receiveShadow = true;
    this.scene.add(right);
  }
}
