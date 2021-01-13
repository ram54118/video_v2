import {Injectable} from '@angular/core';
import {Socket} from 'ngx-socket-io';

@Injectable()
export class WatcherService {
  public stream: MediaStream= null;
  public peerConnection: any;
  public config: any;
  public videoElement: any;
  constructor(private socket: Socket)   {
     this.config = {
      iceServers: [
        {
          urls: 'stun:stun.l.google.com:19302',
        }
      ],
    };
  }
  getStream(){
    if(this.stream){
      return this.stream;
    }else{
      this.socket.emit('watcher');
      return null;
    }
  }
  establishConnection(videoElement: HTMLVideoElement) {
    this.videoElement = videoElement;
    this.peerConnection = new RTCPeerConnection(this.config);

    this.socket.on('offer', (id, description) => {
      this.peerConnection
        .setRemoteDescription(description)
        .then(() => this.peerConnection.createAnswer())
        .then((sdp) => this.peerConnection.setLocalDescription(sdp))
        .then(() => {
          this.socket.emit('answer', id, this.peerConnection.localDescription);
        });
        this.peerConnection.ontrack = (event) => {
        this.videoElement.srcObject = event.streams[0];
        this.stream = event.streams[0]; 
      };
      this.peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          this.socket.emit('candidate', id, event.candidate);
        }
      };
    });

    this.socket.on('candidate', (id, candidate) => {
      this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate)).catch((e) => console.error(e));
    });

    this.socket.on('connect', () => {
      this.socket.emit('watcher');
    });
    this.socket.on('stopStream',()=>{
      this.videoElement.srcObject = null;
      this.stream = null;
      if(this.peerConnection){
        this.peerConnection.close();
        this.peerConnection = null;
      }
    })

   this.socket.on('broadcaster', () => {
     if(!this.peerConnection){
      this.peerConnection = new RTCPeerConnection(this.config);
     }
      this.socket.emit('watcher');
    });
    this.socket.emit('watcher');
  }
}
