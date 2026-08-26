import * as THREE from 'three';

export class ShadowPlane {
  public mesh: THREE.Mesh;
  public maskCanvas: HTMLCanvasElement;
  public texture: THREE.CanvasTexture;

  constructor() {
    this.maskCanvas = document.createElement('canvas');
    this.maskCanvas.width = 256;
    this.maskCanvas.height = 256;

    this.texture = new THREE.CanvasTexture(this.maskCanvas);
    this.texture.minFilter = THREE.LinearFilter;
    this.texture.magFilter = THREE.LinearFilter;
    this.texture.generateMipmaps = false;

    // Plane scaled to realistic human upper-body proportions
    const geometry = new THREE.PlaneGeometry(2.4, 1.8);

    // Alpha-tested depth material ensures shadow maps respect the cutout
    const depthMaterial = new THREE.MeshDepthMaterial({
      depthPacking: THREE.RGBADepthPacking,
      alphaMap: this.texture,
      alphaTest: 0.5,
    });

    const material = new THREE.MeshBasicMaterial({
      alphaMap: this.texture,
      transparent: true,
      opacity: 0.0, // Invisible to viewer, only casts shadow
      alphaTest: 0.5,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.customDepthMaterial = depthMaterial;
    this.mesh.customDistanceMaterial = depthMaterial;
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = false;
    this.mesh.position.set(0, -0.1, 1.2);
  }

  updateTexture() {
    this.texture.needsUpdate = true;
  }
}
