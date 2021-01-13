import {Injectable} from '@angular/core';
import {Socket} from 'ngx-socket-io';

@Injectable()
export class IoService {
  peerConnections: any ={};
  constructor(private socket: Socket) {
  }
  listen(){
    this.socket.on("disconnect", () => {
      console.log("disconnect");
  })
  this.socket.on("connect", () => {
      console.log("connect");
  })
  this.socket.on("Error",(data)=>{
      console.log("socket error",data);
  })
  this.socket.on("messages", (data: any) => {

  })
  this.socket.on("reconnect", () => {
      console.log("reconnected");
  });
  }
  establishConnection(videoElement: HTMLVideoElement) {
    this.listen()
    const config = {
      iceServers: [
        {
          urls: 'stun:stun.l.google.com:19302',
        },
      ],
    };
    this.socket.on('answer', (id, description) => {
      this.peerConnections[id].setRemoteDescription(description);
    });

    this.socket.on('watcher', (id) => {
      const peerConnection = new RTCPeerConnection(config);
      this.peerConnections[id] = peerConnection;

      const stream: any = videoElement.srcObject;
      stream.getTracks().forEach((track) => peerConnection.addTrack(track, stream));
      
      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          this.socket.emit('candidate', id, event.candidate);
        }
      };

      peerConnection
        .createOffer()
        .then((sdp) => peerConnection.setLocalDescription(sdp))
        .then(() => {
          this.socket.emit('offer', id, peerConnection.localDescription);
        });
    });

    this.socket.on('candidate', (id, candidate) => {
      this.peerConnections[id].addIceCandidate(new RTCIceCandidate(candidate));
    });

    this.socket.on('disconnectPeer', (id) => {
      if(this.peerConnections[id]){
          this.peerConnections[id].close();
          delete this.peerConnections[id];
      }
    });
  }

  emitBroadcaster() {
    this.socket.emit('broadcaster');
  }

  stopBroadcasting(){
      Object.keys(this.peerConnections).forEach((id)=>{
        this.socket.emit('stopStream',id);
        this.peerConnections[id].close();
      })
  }

  stopConnection() {
    this.stopBroadcasting()
    this.peerConnections = {};
  }
}
