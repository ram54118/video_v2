import { AfterViewInit, Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { DeviceInfoService } from 'src/app/services/device-info.service';
import { IoService } from 'src/app/services/io.service';
import { WatcherService } from 'src/app/services/watcher.service';
import * as data from './../../../assets/configuration/config.json';

@Component({
  selector: 'app-iphone-live',
  templateUrl: './iphone-live.component.html',
  styleUrls: ['./iphone-live.component.scss'],
  providers: [IoService, WatcherService],
})
export class IphoneLiveComponent extends DeviceInfoService implements OnInit, AfterViewInit, OnDestroy {
  public tabs;
  public iPhoneLiveUrl: string;
  private player;
  public isIphoneDevice: boolean;

  public recordingStarted = false;
  public isdirectInt: boolean = false;
  public isLiveVideoLoaded = false;
  private isDirectFeedLoaded = false;
  public remoteStream: MediaStream;
  constructor(private renderer: Renderer2, private ioService: IoService, private watcherService: WatcherService) {
    super();
  }
  ngOnInit() {
    if (this.isIOSDevice()) {
      this.tabs = [
        {
          label: 'Start Iphone Streaming',
          value: 'iphoneStream',
        },
      ];
    } else {
      this.tabs = [
        {
          label: 'Live Stream Direct',
          value: 'liveDirectStream',
        },
        // will remove this tab
        {
          label: 'Start Iphone Streaming',
          value: 'iphoneStream',
        },
      ];
    }
    const liveurls = (data as any).default;
    this.iPhoneLiveUrl = liveurls ? liveurls.iPhoneLiveUrl : null;
  }

  tabChanged(event) {
    if (this.isIOSDevice()) {
      this.initCamera();
    } else {
      if (event.index === 1) {
        this.initCamera();
      }

      if (event.index === 0) {
        this.getDirectFeed();
      }
    }
  }

  private getDirectFeed() {
    if (!this.isDirectFeedLoaded) {
      this.watcherService.establishConnection(document.querySelector('#directFeed'));
      this.isDirectFeedLoaded = true;
    } else {
      this.remoteStream = this.watcherService.getStream();
      if (this.remoteStream) {
        setTimeout(() => {
          let ele: any = document.querySelector('#directFeed');
          ele.srcObject = this.remoteStream;
        }, 100);
      }
    }
  }

  ngAfterViewInit() {
    if (!this.isDirectFeedLoaded) {
      this.getDirectFeed();
    }
  }

  private initCamera() {
    if (!!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
      navigator.mediaDevices
        .getUserMedia({
          video: true,
          audio: true,
        })
        .then((stream) => this.attachVideo(stream))
        .catch(this.handleError);
    } else {
      alert('Sorry, camera not available.');
    }
  }
  private attachVideo(stream) {
    const liveStreamVideo: HTMLVideoElement = document.querySelector('#iPhoneStreamVideo');
    liveStreamVideo.srcObject = stream;
    this.isLiveVideoLoaded = true;
  }

  private handleError(error) {
    console.log('Error: ', error);
  }

  startRecording() {
    this.recordingStarted = true;
    if (!this.isdirectInt) {
      this.ioService.establishConnection(document.querySelector('#iPhoneStreamVideo'));
    }
    this.ioService.emitBroadcaster();
    this.isdirectInt = true;
  }

  stopRecording() {
    this.recordingStarted = false;
    this.ioService.stopConnection();
  }

  ngOnDestroy() {
    if (this.player) {
      this.player.dispose();
    }
  }
}
