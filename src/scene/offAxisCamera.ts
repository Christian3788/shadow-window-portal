import * as THREE from 'three';

export class OffAxisCamera {
  public camera: THREE.PerspectiveCamera;
  public screenWidth: number = 3.2;
  public screenHeight: number = 1.8;
  public near: number = 0.1;
  public far: number = 100.0;

  constructor() {
    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, this.near, this.far);
    this.camera.position.set(0, 0, 3.0);
  }

  updateFrustum(headX: number, headY: number, headZ: number) {
    const pez = Math.max(0.5, headZ);
    this.camera.position.set(headX, headY, pez);

    const aspect = window.innerWidth / window.innerHeight;
    const halfH = this.screenHeight / 2;
    const halfW = halfH * aspect;

    const left = ((-halfW - headX) * this.near) / pez;
    const right = ((halfW - headX) * this.near) / pez;
    const bottom = ((-halfH - headY) * this.near) / pez;
    const top = ((halfH - headY) * this.near) / pez;

    this.camera.projectionMatrix.makePerspective(left, right, top, bottom, this.near, this.far);
    this.camera.projectionMatrixInverse.copy(this.camera.projectionMatrix).invert();
  }
}
