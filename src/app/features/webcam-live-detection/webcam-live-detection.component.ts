import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';
import { ObjectDetectionService } from 'src/app/services/object-detection.service';

@Component({
  selector: 'app-webcam-live-detection',
  templateUrl: './webcam-live-detection.component.html',
  styleUrls: ['./webcam-live-detection.component.scss'],
})
export class WebcamLiveDetectionComponent implements OnInit, AfterViewInit {
  isLoading: boolean;
  isComplete: boolean;
  videoSrc: string;
  predictionImageSrc: string;
  predictions: any = [];
  loadTab = true;

  buttonText = 'Start Prediction';

  // toggle webcam on/off
  public showWebcam = true;
  public allowCameraSwitch = true;
  public multipleWebcamsAvailable = false;
  public deviceId: string;
  public triggerInterval: any;
  public videoOptions: MediaTrackConstraints = {};
  public errors: WebcamInitError[] = [];

  // latest snapshot
  public webcamImage: WebcamImage = null;

  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();
  // switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId
  private nextWebcam: Subject<boolean | string> = new Subject<boolean | string>();

  videoDetection = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
  });

  constructor(private objectDetectionService: ObjectDetectionService, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    WebcamUtil.getAvailableVideoInputs().then((mediaDevices: MediaDeviceInfo[]) => {
      this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
    });
  }

  ngAfterViewInit(): void {
    // const video = this.video.nativeElement;
    // this.runLocalMedia(video);
  }

  startPredection() {
    if (this.buttonText === 'Stop Prediction') {
      this.buttonText = 'Start Prediction';
      this.isLoading = false;
      if (this.triggerInterval) {
        clearInterval(this.triggerInterval);
      }
    } else {
      this.isLoading = true;
      this.buttonText = 'Stop Prediction';
      this.triggerSnapshot();
    }
  }

  sanitize(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  runLocalMedia(params) {
    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          params.srcObject = stream;
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  public triggerSnapshot(): void {
    this.triggerInterval = setInterval(() => {
      this.trigger.next();
    }, 6000);
  }

  public toggleWebcam(): void {
    this.showWebcam = !this.showWebcam;
  }

  public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }

  public showNextWebcam(directionOrDeviceId: boolean | string): void {
    // true => move forward through devices
    // false => move backwards through devices
    // string => move to device with given deviceId
    this.nextWebcam.next(directionOrDeviceId);
  }

  public handleImage(webcamImage: WebcamImage): void {
    this.webcamImage = webcamImage;
    this.objectDetectionService.getImageDetectionOutput(this.webcamImage.imageAsDataUrl).subscribe((res) => {
      if (res && res.path) {
        this.predictionImageSrc = res.path;
      }
    });
    console.log(this.webcamImage, 'predictionVideoSrc');
  }

  public cameraWasSwitched(deviceId: string): void {
    console.log('active device: ' + deviceId);
    this.deviceId = deviceId;
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  public get nextWebcamObservable(): Observable<boolean | string> {
    return this.nextWebcam.asObservable();
  }
}
