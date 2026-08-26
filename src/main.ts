import * as THREE from 'three';
import { VisionPipeline } from './vision/tracker';
import { OffAxisCamera } from './scene/offAxisCamera';
import { ShadowPlane } from './scene/shadowPlane';
import { SceneManager } from './scene/sceneManager';

const canvas = document.getElementById('webgl-canvas') as HTMLCanvasElement;
const video = document.getElementById('webcam') as HTMLVideoElement;

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const sceneManager = new SceneManager();
const offAxisCam = new OffAxisCamera();
const shadowPlane = new ShadowPlane();
sceneManager.scene.add(shadowPlane.mesh);

// Debug PIP
shadowPlane.maskCanvas.style.position = 'fixed';
shadowPlane.maskCanvas.style.bottom = '16px';
shadowPlane.maskCanvas.style.right = '16px';
shadowPlane.maskCanvas.style.width = '140px';
shadowPlane.maskCanvas.style.height = '105px';
shadowPlane.maskCanvas.style.border = '2px solid rgba(255,255,255,0.3)';
shadowPlane.maskCanvas.style.borderRadius = '8px';
shadowPlane.maskCanvas.style.zIndex = '999';
document.body.appendChild(shadowPlane.maskCanvas);

const vision = new VisionPipeline();
let currentHead = { x: 0, y: 0, z: 2.8 };

offAxisCam.updateFrustum(currentHead.x, currentHead.y, currentHead.z);

function loop(timestamp: number) {
  requestAnimationFrame(loop);

  if (video.readyState >= 2 && vision.isReady) {
    const head = vision.getHeadPosition(video, timestamp);
    if (head) {
      const targetX = -head.x * 2.2;
      const targetY = head.y * 1.5;
      const targetZ = 2.8 + (head.z || 0) * 2.5;

      currentHead.x += (targetX - currentHead.x) * 0.12;
      currentHead.y += (targetY - currentHead.y) * 0.12;
      currentHead.z += (targetZ - currentHead.z) * 0.12;

      // Update camera portal view
      offAxisCam.updateFrustum(currentHead.x, currentHead.y, currentHead.z);

      // Move shadow plane and spotlight in tandem
      shadowPlane.mesh.position.x = currentHead.x * 0.5;
      shadowPlane.mesh.position.y = currentHead.y * 0.5 - 0.2;
      sceneManager.spotLight.position.x = currentHead.x * 0.6;
      sceneManager.spotLight.position.y = currentHead.y * 0.6 + 1.2;
    }

    vision.segmentSilhouette(video, timestamp, shadowPlane.maskCanvas);
    shadowPlane.updateTexture();
  }

  renderer.render(sceneManager.scene, offAxisCam.camera);
}
requestAnimationFrame(loop);

async function start() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
    video.srcObject = stream;
    await video.play();
    await vision.init();
  } catch (err) {
    console.error('Initialization error:', err);
  }
}

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  offAxisCam.updateFrustum(currentHead.x, currentHead.y, currentHead.z);
});

start();
