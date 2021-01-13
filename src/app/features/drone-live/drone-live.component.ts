import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as cocoSSD from '@tensorflow-models/coco-ssd';
import * as tf from '@tensorflow/tfjs';
import * as Hls from 'hls.js';
import videojs from 'video.js';
import * as data from './../../../assets/configuration/config.json';

@Component({
  selector: 'app-drone-live',
  templateUrl: './drone-live.component.html',
  styleUrls: ['./drone-live.component.scss'],
})
export class DroneLiveComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('droneVideo', { static: true }) public droneVideoElem: ElementRef;
  public droneLiveUrl: string;
  private player;
  constructor() {}
  ngOnInit() {
    const liveurls = (data as any).default;
    console.log('liveurls', liveurls);
    this.droneLiveUrl = liveurls ? liveurls.droneLiveUrl : null;
    console.log('Using TensorFlow backend: ', tf.getBackend());
  }

  ngAfterViewInit() {
    const options = {
      controls: true,
      autoplay: true,
      fluid: false,
      loop: false,
      bigPlayButton: true,
      controlBar: {
        volumePanel: true,
      },
    };
    this.player = videojs(this.droneVideoElem.nativeElement, options, function onPlayerReady() {
      videojs.log('your player is ready');
    });
  }

  ngOnDestroy() {
    if (this.player) {
      this.player.dispose();
    }
    const genericVideo: any = document.getElementById('genericVideo');
    if (genericVideo) {
      genericVideo.src = '';
    }
    const video: any = document.getElementById('video');
    if (video) {
      video.src = '';
    }
  }

  tabChanged(event) {
    const genericVideo: any = document.getElementById('genericVideo');
    if (genericVideo) {
      genericVideo.src = '';
    }
    const video: any = document.getElementById('video');
    if (video) {
      video.src = '';
    }
    if (event.index === 2) {
      this.initGenericDetection();
    } else if (event.index === 1) {
      this.liveInit();
    }
  }

  initGenericDetection() {
    const canvas = document.getElementById('genericCanvas') as HTMLCanvasElement;
    const LIVE_STREAM_URL = 'https://bitmovin-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8';
    const video: any = document.getElementById('genericVideo');
    video.addEventListener('loadeddata', () => {
      cocoSSD.load({ base: 'lite_mobilenet_v2' }).then((model) => {
        console.log('model', model);
        this.detectFrame(model, video, canvas);
      });
    });

    this.initHLS(video, LIVE_STREAM_URL);
  }

  liveInit() {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const LIVE_STREAM_URL = 'https://bitmovin-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8';
    const video: any = document.getElementById('video');
    video.addEventListener('loadeddata', () => {
      cocoSSD.load({ modelUrl: './../assets/model_web/model.json', base: 'lite_mobilenet_v2' }).then((model) => {
        console.log('model', model);
        this.detectFrame(model, video, canvas);
      });
    });

    this.initHLS(video, LIVE_STREAM_URL);
  }

  private initHLS(video, LIVE_STREAM_URL) {
    if (Hls.isSupported()) {
      const config = { liveDurationInfinity: true };
      const hls = new Hls(config);
      hls.loadSource(LIVE_STREAM_URL);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, function () {
        video.play();
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = LIVE_STREAM_URL;
      video.addEventListener('loadedmetadata', function () {
        video.play();
      });
    }
  }

  private async detectFrame(model, video, canvas) {
    if (video.src.indexOf('blob') !== -1) {
      const predictions = await model.detect(video);
      this.renderPredictions(predictions, canvas);
      requestAnimationFrame(() => {
        this.detectFrame(model, video, canvas);
      });
    }
  }

  private renderPredictions(predictions, canvas) {
    // const canvas = <HTMLCanvasElement>document.getElementById("canvas");
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    // Font options.
    const font = '16px sans-serif';
    ctx.font = font;
    ctx.textBaseline = 'top';
    predictions.forEach((prediction) => {
      const x = prediction.bbox[0];
      const y = prediction.bbox[1];
      const width = prediction.bbox[2];
      const height = prediction.bbox[3];
      const label = `${prediction.class}: ${prediction.score.toFixed(2)}`;
      // Draw the bounding box.
      ctx.strokeStyle = '#FFFF3F';
      ctx.lineWidth = 5;
      ctx.strokeRect(x, y, width, height);
      // Draw the label background.
      ctx.fillStyle = '#FFFF3F';
      const textWidth = ctx.measureText(label).width;
      const textHeight = parseInt(font, 10); // base 10
      ctx.fillRect(x, y, textWidth + 4, textHeight + 4);
    });

    predictions.forEach((prediction) => {
      const x = prediction.bbox[0];
      const y = prediction.bbox[1];
      const label = `${prediction.class}: ${prediction.score.toFixed(2)}`;
      // Draw the text last to ensure it's on top.
      ctx.fillStyle = '#000000';
      ctx.fillText(label, x, y);
    });
  }
}
