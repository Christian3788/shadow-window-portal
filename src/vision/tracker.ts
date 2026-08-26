import {
  FilesetResolver,
  FaceLandmarker,
  ImageSegmenter
} from '@mediapipe/tasks-vision';

export class VisionPipeline {
  private faceLandmarker!: FaceLandmarker;
  private segmenter!: ImageSegmenter;
  private wasmLoaded = false;

  async init() {
    const vision = await FilesetResolver.forVisionTasks(
      'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
    );

    this.faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
        delegate: 'GPU'
      },
      runningMode: 'VIDEO',
      numFaces: 1
    });

    this.segmenter = await ImageSegmenter.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/image_segmenter/selfie_segmenter/float16/latest/selfie_segmenter.tflite',
        delegate: 'GPU'
      },
      runningMode: 'VIDEO',
      outputCategoryMask: true
    });

    this.wasmLoaded = true;
  }

  getHeadPosition(video: HTMLVideoElement, timestamp: number): { x: number; y: number; z: number } | null {
    if (!this.wasmLoaded || video.readyState < 2) return null;
    const result = this.faceLandmarker.detectForVideo(video, timestamp);
    if (!result.faceLandmarks || result.faceLandmarks.length === 0) return null;

    const nose = result.faceLandmarks[0][1];
    return {
      x: (nose.x - 0.5) * 2.0,
      y: -(nose.y - 0.5) * 2.0,
      z: nose.z
    };
  }

  segmentSilhouette(video: HTMLVideoElement, timestamp: number, targetCanvas: HTMLCanvasElement) {
    if (!this.wasmLoaded || video.readyState < 2) return;
    this.segmenter.segmentForVideo(video, timestamp, (result) => {
      const mask = result.categoryMask;
      if (!mask) return;

      const ctx = targetCanvas.getContext('2d');
      if (!ctx) return;

      const maskData = mask.getAsUint8Array();
      const imgData = ctx.createImageData(mask.width, mask.height);

      for (let i = 0; i < maskData.length; i++) {
        const isPerson = maskData[i] === 0;
        const idx = i * 4;
        imgData.data[idx] = 255;
        imgData.data[idx + 1] = 255;
        imgData.data[idx + 2] = 255;
        imgData.data[idx + 3] = isPerson ? 255 : 0;
      }
      ctx.putImageData(imgData, 0, 0);
    });
  }
}
