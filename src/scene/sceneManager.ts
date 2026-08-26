import * as THREE from 'three';

export class SceneManager {
  public scene: THREE.Scene;
  public spotLight: THREE.SpotLight;

  constructor() {
    this.scene = new THREE.Scene();

    // Soft ambient fill
    const ambient = new THREE.AmbientLight(0xffffff, 0.45);
    this.scene.add(ambient);

    // Powerful projector spotlight behind the user casting toward the back wall
    this.spotLight = new THREE.SpotLight(0xffffff, 25.0);
    this.spotLight.position.set(0, 1.0, 3.8);
    this.spotLight.target.position.set(0, -0.4, -4.5);
    this.spotLight.angle = Math.PI / 3.0;
    this.spotLight.penumbra = 0.35;
    this.spotLight.castShadow = true;
    this.spotLight.shadow.mapSize.width = 2048;
    this.spotLight.shadow.mapSize.height = 2048;
    this.spotLight.shadow.camera.near = 0.5;
    this.spotLight.shadow.camera.far = 15;
    this.spotLight.shadow.bias = -0.0001;
    this.spotLight.shadow.radius = 2; // Soft edges
    this.scene.add(this.spotLight);
    this.scene.add(this.spotLight.target);

    this.createRoom();
  }

  private createRoom() {
    // High-diffuse light grey room walls for clear shadow projection
    const roomGeo = new THREE.BoxGeometry(11, 7, 12);
    const roomMat = new THREE.MeshStandardMaterial({
      color: 0xd6d8dc,
      roughness: 0.6,
      metalness: 0.05,
      side: THREE.BackSide,
    });
    const room = new THREE.Mesh(roomGeo, roomMat);
    room.position.set(0, 0.2, -3);
    room.receiveShadow = true;
    this.scene.add(room);

    // Floor Grid
    const grid = new THREE.GridHelper(11, 14, 0x888899, 0xb0b4bc);
    grid.position.set(0, -3.29, -3);
    this.scene.add(grid);

    // Center focal prop (metallic car-styled form)
    const knotGeo = new THREE.TorusKnotGeometry(0.55, 0.18, 128, 32);
    const knotMat = new THREE.MeshStandardMaterial({
      color: 0x222222,
      roughness: 0.2,
      metalness: 0.85,
    });
    const knot = new THREE.Mesh(knotGeo, knotMat);
    knot.position.set(0, -0.8, -2.2);
    knot.castShadow = true;
    knot.receiveShadow = true;
    this.scene.add(knot);

    // Flanking Pillars
    const pillarGeo = new THREE.CylinderGeometry(0.32, 0.32, 4.5, 32);
    const pillarMat = new THREE.MeshStandardMaterial({
      color: 0x999da6,
      roughness: 0.5,
    });

    const left = new THREE.Mesh(pillarGeo, pillarMat);
    left.position.set(-3.0, -1.0, -2.5);
    left.castShadow = true;
    left.receiveShadow = true;
    this.scene.add(left);

    const right = new THREE.Mesh(pillarGeo, pillarMat);
    right.position.set(3.0, -1.0, -2.5);
    right.castShadow = true;
    right.receiveShadow = true;
    this.scene.add(right);
  }
}
