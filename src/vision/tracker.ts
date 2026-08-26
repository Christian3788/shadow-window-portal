import { FilesetResolver, FaceLandmarker, ImageSegmenter } from '@mediapipe/tasks-vision';

export class VisionPipeline {
  private faceLandmarker!: FaceLandmarker;
  private segmenter!: ImageSegmenter;
  public isReady = false;

  async init() {
    try {
      const vision = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
      );

      this.faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
          delegate: 'CPU'
        },
        runningMode: 'VIDEO',
        numFaces: 1
      });

      this.segmenter = await ImageSegmenter.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/image_segmenter/selfie_segmenter/float16/latest/selfie_segmenter.tflite',
          delegate: 'CPU'
        },
        runningMode: 'VIDEO',
        outputCategoryMask: false,
        outputConfidenceMasks: true
      });

      this.isReady = true;
    } catch (err) {
      console.error('MediaPipe initialization error:', err);
    }
  }

  getHeadPosition(video: HTMLVideoElement, timestamp: number): { x: number; y: number; z: number } | null {
    if (!this.isReady || video.readyState < 2) return null;
    try {
      const result = this.faceLandmarker.detectForVideo(video, timestamp);
      if (!result.faceLandmarks || result.faceLandmarks.length === 0) return null;

      const nose = result.faceLandmarks[0][1];
      return {
        x: (nose.x - 0.5) * 2.0,
        y: -(nose.y - 0.5) * 2.0,
        z: nose.z
      };
    } catch {
      return null;
    }
  }

  segmentSilhouette(video: HTMLVideoElement, timestamp: number, targetCanvas: HTMLCanvasElement) {
    if (!this.isReady || video.readyState < 2) return;
    try {
      this.segmenter.segmentForVideo(video, timestamp, (result) => {
        if (!result.confidenceMasks || result.confidenceMasks.length === 0) return;
        const mask = result.confidenceMasks[0];

        if (targetCanvas.width !== mask.width || targetCanvas.height !== mask.height) {
          targetCanvas.width = mask.width;
          targetCanvas.height = mask.height;
        }

        const ctx = targetCanvas.getContext('2d');
        if (!ctx) return;

        const maskFloats = mask.getAsFloat32Array();
        const imgData = ctx.createImageData(mask.width, mask.height);

        // Feathered alpha gradient mapping
        for (let i = 0; i < maskFloats.length; i++) {
          const confidence = maskFloats[i]; // 0.0 to 1.0
          const idx = i * 4;
          imgData.data[idx] = 255;
          imgData.data[idx + 1] = 255;
          imgData.data[idx + 2] = 255;
          imgData.data[idx + 3] = Math.round(confidence * 255);
        }
        ctx.putImageData(imgData, 0, 0);
      });
    } catch {
      // drop dropped frame
    }
  }
}
