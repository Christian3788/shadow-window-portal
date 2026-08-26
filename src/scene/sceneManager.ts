import * as THREE from 'three';

export class SceneManager {
  public scene: THREE.Scene;
  public spotLight: THREE.SpotLight;

  constructor() {
    this.scene = new THREE.Scene();

    // Studio Ambient Light
    const ambient = new THREE.AmbientLight(0xdce0e6, 0.6);
    this.scene.add(ambient);

    // Dynamic Shadow Projector Light
    this.spotLight = new THREE.SpotLight(0xffffff, 30.0);
    this.spotLight.position.set(0, 1.2, 4.0);
    this.spotLight.target.position.set(0, -0.2, -4.0);
    this.spotLight.angle = Math.PI / 2.6;
    this.spotLight.penumbra = 0.5;
    this.spotLight.castShadow = true;
    this.spotLight.shadow.mapSize.width = 2048;
    this.spotLight.shadow.mapSize.height = 2048;
    this.spotLight.shadow.camera.near = 0.2;
    this.spotLight.shadow.camera.far = 15;
    this.spotLight.shadow.bias = -0.0001;
    this.spotLight.shadow.radius = 3;
    this.scene.add(this.spotLight);
    this.scene.add(this.spotLight.target);

    this.buildShowroom();
  }

  private buildShowroom() {
    const clayMaterial = new THREE.MeshStandardMaterial({
      color: 0xc8cbd0,
      roughness: 0.75,
      metalness: 0.1,
    });

    // Room Envelope
    const room = new THREE.Mesh(
      new THREE.BoxGeometry(12, 7, 14),
      new THREE.MeshStandardMaterial({
        color: 0xbfc3cb,
        roughness: 0.8,
        side: THREE.BackSide,
      })
    );
    room.position.set(0, 0.5, -3);
    room.receiveShadow = true;
    this.scene.add(room);

    // Floor Grid
    const grid = new THREE.GridHelper(12, 16, 0x8d929b, 0xaeb2ba);
    grid.position.set(0, -2.98, -3);
    this.scene.add(grid);

    // Left Prop: Stylized Car Geometry
    const carGroup = new THREE.Group();
    const carBody = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.6, 1.6), clayMaterial);
    carBody.position.y = 0.3;
    const carCabin = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.5, 1.3), clayMaterial);
    carCabin.position.set(-0.2, 0.75, 0);
    const carSpoiler = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.4, 1.5), clayMaterial);
    carSpoiler.position.set(1.3, 0.7, 0);

    carGroup.add(carBody, carCabin, carSpoiler);
    carGroup.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    carGroup.position.set(-2.2, -2.7, -3.2);
    carGroup.rotation.y = Math.PI * 0.12;
    this.scene.add(carGroup);

    // Right Prop: Pedestal with Sculpture
    const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.55, 1.6, 32), clayMaterial);
    pedestal.position.set(2.4, -2.2, -3.0);
    pedestal.castShadow = true;
    pedestal.receiveShadow = true;

    const sculpture = new THREE.Mesh(
      new THREE.DodecahedronGeometry(0.65),
      new THREE.MeshStandardMaterial({ color: 0x3a3d44, roughness: 0.3, metalness: 0.5 })
    );
    sculpture.position.set(2.4, -1.0, -3.0);
    sculpture.castShadow = true;
    sculpture.receiveShadow = true;

    this.scene.add(pedestal, sculpture);
  }
}
