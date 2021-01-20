import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import * as cocoSSD from '@tensorflow-models/coco-ssd';
import { WebcamLiveDetectionComponent } from '../webcam-live-detection/webcam-live-detection.component';
declare const MediaRecorder: any;
@Component({
  selector: 'app-webcam-live',
  templateUrl: './webcam-live.component.html',
  styleUrls: ['./webcam-live.component.scss'],
})
export class WebCamLiveComponent implements OnInit {
  @ViewChild('video', { static: true }) videoElement: ElementRef;
  @ViewChild('canvas', { static: true }) public canvas: ElementRef;
  public captures: any[] = [];
  constraints = {
    video: true,
    audio: true,
  };
  private recordedBlobs = [];
  private currentStream;
  private mediaRecorder;
  public recordingStarted = false;
  private liveDetectionVideoElem: HTMLVideoElement;
  @ViewChild('webCamLiveComp', { static: true }) webcamLiveDetectionComp: WebcamLiveDetectionComponent;
  constructor(private renderer: Renderer2) {}

  ngOnInit() {
    this.initCamera();
  }
  tabChanged(event) {
    clearInterval(this.webcamLiveDetectionComp.triggerInterval);
    if (event.index === 0) {
      this.initCamera();
      this.webcamLiveDetectionComp.loadTab = false;
    } else if (event.index === 1) {
      this.webcam_init();
      this.predictWithCocoModel();
      this.webcamLiveDetectionComp.loadTab = false;
    } else {
      this.webcamLiveDetectionComp.loadTab = true;
    }
  }

  // private initWebCamera() {
  //   const liveDetectionVideoElem = <HTMLVideoElement>document.getElementById('liveDetectionVideo1');
  //   this.predictWithLayersmodel(liveDetectionVideoElem);

  //   navigator.mediaDevices
  //     .getUserMedia({
  //       audio: false,
  //       video: {
  //         facingMode: 'user',
  //       },
  //     })
  //     .then((stream) => {
  //       liveDetectionVideoElem.srcObject = stream;
  //       liveDetectionVideoElem.onloadedmetadata = () => {
  //         liveDetectionVideoElem.play();
  //       };
  //     });
  // }

  // public async predictWithLayersmodel(liveDetectionVideoElem) {
  //   const canvas = <HTMLCanvasElement>document.getElementById('canvas-live-detection1');
  //   // const model = await cocoSSD.load({ modelUrl: './../assets/Ed_web_model/model.json' });
  //   // const model = await tf.loadLayersModel('./../assets/Ed_web_model/model.json');
  //   const model = await tf.loadGraphModel('./../assets/Ed_web_model/model.json');
  //   // const model = await cocoSSD.load({ base: 'lite_mobilenet_v2' });
  //   this.detectFrame(liveDetectionVideoElem, model, canvas);
  //   console.log('model loaded', model);
  // }

  private initCamera() {
    if (!!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
      navigator.mediaDevices
        .getUserMedia(this.constraints)
        .then((stream) => this.attachVideo(stream))
        .catch(this.handleError);
    } else {
      alert('Sorry, camera not available.');
    }
  }
  private attachVideo(stream) {
    this.currentStream = stream;
    this.renderer.setProperty(this.videoElement.nativeElement, 'srcObject', stream);
  }

  private handleError(error) {
    console.log('Error: ', error);
  }

  startRecording() {
    this.recordingStarted = true;
    let options = { mimeType: 'video/webm;codecs=vp9', bitsPerSecond: 100000 };
    try {
      this.mediaRecorder = new MediaRecorder(this.currentStream, options);
    } catch (e0) {
      console.log('Unable to create MediaRecorder with options Object: ', options, e0);
      try {
        options = { mimeType: 'video/webm;codecs=vp8', bitsPerSecond: 100000 };
        this.mediaRecorder = new MediaRecorder(this.currentStream, options);
      } catch (e1) {
        console.log('Unable to create MediaRecorder with options Object: ', options, e1);
        try {
          this.mediaRecorder = new MediaRecorder(this.currentStream, { mimeType: 'video/mp4' });
        } catch (e2) {
          alert('MediaRecorder is not supported by this browser.');
          console.error('Exception while creating MediaRecorder:', e2);
          return;
        }
      }
    }
    this.mediaRecorder.onstop = (event) => {
      console.log('stop', event.data);
    };
    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        this.recordedBlobs.push(event.data);
      }
    };
    this.mediaRecorder.start(10); // collect 10ms of data
  }

  stopRecording() {
    this.mediaRecorder.stop();
    this.mediaRecorder = null;
    this.recordingStarted = false;
  }

  public capturePhoto() {
    this.canvas.nativeElement.getContext('2d').drawImage(this.videoElement.nativeElement, 0, 0, 640, 480);
    this.captures.push(this.canvas.nativeElement.toDataURL('image/png'));
  }

  webcam_init() {
    this.liveDetectionVideoElem = <HTMLVideoElement>document.getElementById('liveDetectionVideo');

    navigator.mediaDevices
      .getUserMedia({
        audio: false,
        video: {
          facingMode: 'user',
        },
      })
      .then((stream) => {
        this.liveDetectionVideoElem.srcObject = stream;
        this.liveDetectionVideoElem.onloadedmetadata = () => {
          this.liveDetectionVideoElem.play();
        };
      });
  }
  public async predictWithCocoModel() {
    const canvas = <HTMLCanvasElement>document.getElementById('canvas-live-detection');
    const model = await cocoSSD.load({ base: 'lite_mobilenet_v2' });
    this.detectFrame(this.liveDetectionVideoElem, model, canvas);
    console.log('model loaded');
  }

  detectFrame = (video, model, canvas) => {
    if (model && model.detect && video) {
      model.detect(video).then((predictions) => {
        this.renderPredictions(predictions, canvas, video);
        requestAnimationFrame(() => {
          this.detectFrame(video, model, canvas);
        });
      });
    }
  };

  renderPredictions = (predictions, canvas, videoElem) => {
    // const canvas = <HTMLCanvasElement>document.getElementById('canvas-live-detection');
    if (canvas && canvas.getContext) {
      const ctx = canvas.getContext('2d');

      canvas.width = 640;
      canvas.height = 480;

      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      // Font options.
      const font = '16px sans-serif';
      ctx.font = font;
      ctx.textBaseline = 'top';
      ctx.drawImage(videoElem, 0, 0, 640, 480);

      predictions.forEach((prediction) => {
        const x = prediction.bbox[0];
        const y = prediction.bbox[1];
        const width = prediction.bbox[2];
        const height = prediction.bbox[3];
        // Draw the bounding box.
        ctx.strokeStyle = '#00FFFF';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, width, height);
        // Draw the label background.
        ctx.fillStyle = '#00FFFF';
        const textWidth = ctx.measureText(prediction.class).width;
        const textHeight = parseInt(font, 10); // base 10
        ctx.fillRect(x, y, textWidth + 4, textHeight + 4);
      });

      predictions.forEach((prediction) => {
        const x = prediction.bbox[0];
        const y = prediction.bbox[1];
        // Draw the text last to ensure it's on top.
        ctx.fillStyle = '#000000';
        ctx.fillText(prediction.class, x, y);
      });
    }
  };
}
