import * as THREE from 'three';

export class SceneManager {
  public scene: THREE.Scene;
  public spotLight: THREE.SpotLight;

  constructor() {
    this.scene = new THREE.Scene();

    // Brighter ambient light to see the room structure
    const ambient = new THREE.AmbientLight(0xffffff, 0.7);
    this.scene.add(ambient);

    // Primary projector spotlight positioned behind the user
    this.spotLight = new THREE.SpotLight(0xfff5e6, 8.0);
    this.spotLight.position.set(0, 1.5, 3.5);
    this.spotLight.target.position.set(0, 0, -3.0);
    this.spotLight.angle = Math.PI / 2.8;
    this.spotLight.penumbra = 0.4;
    this.spotLight.castShadow = true;
    this.spotLight.shadow.mapSize.width = 2048;
    this.spotLight.shadow.mapSize.height = 2048;
    this.spotLight.shadow.camera.near = 0.5;
    this.spotLight.shadow.camera.far = 15;
    this.spotLight.shadow.bias = -0.0005;
    this.scene.add(this.spotLight);
    this.scene.add(this.spotLight.target);

    this.createRoom();
  }

  private createRoom() {
    // Inverted Room Box (Walls, Floor, Ceiling)
    const roomGeo = new THREE.BoxGeometry(10, 6, 12);
    const roomMat = new THREE.MeshStandardMaterial({
      color: 0x777785,
      roughness: 0.8,
      metalness: 0.1,
      side: THREE.BackSide,
    });
    const room = new THREE.Mesh(roomGeo, roomMat);
    room.position.set(0, 0, -3);
    room.receiveShadow = true;
    this.scene.add(room);

    // Grid on floor for extra depth perception
    const grid = new THREE.GridHelper(10, 10, 0x333333, 0x555555);
    grid.position.set(0, -2.99, -3);
    this.scene.add(grid);

    // Center prop (resembling the car/object placement in the video)
    const centerGeo = new THREE.TorusKnotGeometry(0.7, 0.25, 128, 32);
    const centerMat = new THREE.MeshStandardMaterial({
      color: 0xe05638,
      roughness: 0.3,
      metalness: 0.4
    });
    const centerMesh = new THREE.Mesh(centerGeo, centerMat);
    centerMesh.position.set(0, -0.5, -3.5);
    centerMesh.castShadow = true;
    centerMesh.receiveShadow = true;
    this.scene.add(centerMesh);

    // Side Pillars
    const pillarGeo = new THREE.CylinderGeometry(0.35, 0.35, 4, 32);
    const pillarMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, roughness: 0.5 });

    const leftPillar = new THREE.Mesh(pillarGeo, pillarMat);
    leftPillar.position.set(-2.5, -1.0, -3.0);
    leftPillar.castShadow = true;
    leftPillar.receiveShadow = true;
    this.scene.add(leftPillar);

    const rightPillar = new THREE.Mesh(pillarGeo, pillarMat);
    rightPillar.position.set(2.5, -1.0, -3.0);
    rightPillar.castShadow = true;
    rightPillar.receiveShadow = true;
    this.scene.add(rightPillar);
  }
}
