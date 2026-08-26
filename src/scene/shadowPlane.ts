import * as THREE from 'three';

export class ShadowPlane {
  public mesh: THREE.Mesh;
  public maskCanvas: HTMLCanvasElement;
  private texture: THREE.CanvasTexture;

  constructor() {
    this.maskCanvas = document.createElement('canvas');
    this.maskCanvas.width = 256;
    this.maskCanvas.height = 256;

    this.texture = new THREE.CanvasTexture(this.maskCanvas);
    this.texture.minFilter = THREE.LinearFilter;
    this.texture.magFilter = THREE.LinearFilter;

    const geometry = new THREE.PlaneGeometry(1.6, 1.2);
    const material = new THREE.MeshStandardMaterial({
      alphaMap: this.texture,
      transparent: true,
      opacity: 0.0,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    const customDepthMaterial = new THREE.MeshDepthMaterial({
      depthPacking: THREE.RGBADepthPacking,
      alphaMap: this.texture,
      alphaTest: 0.5
    });

    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.customDepthMaterial = customDepthMaterial;
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = false;
    this.mesh.position.set(0, 0, 0.4);
  }

  updateTexture() {
    this.texture.needsUpdate = true;
  }
}
