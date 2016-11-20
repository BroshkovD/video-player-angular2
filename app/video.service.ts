import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()

export class VideoService {

  public videoElement:any;
  public currentPath:string = '';
  public currentTitle:string = 'loading...';
  public currentTime:number = 0;
  public totalTime:number = 0;
  public calculatedWidth:number;
  public calculatedScrubY:number;
  public isMuted:boolean = false;
  public isPlaying:boolean = false;
  public isDragging:boolean = false;
  public showDetails:boolean = false;
  public currentDesc:string = 'A very nice video...';
  public playlist:Array<Object> = [];



  constructor(private http:Http) {}

  appSetup(v:string) {
    this.videoElement = <HTMLVideoElement> document.getElementById(v);
    this.videoElement.addEventListener('loadedmetadata', this.updateData)
    this.videoElement.addEventListener('timeupdate', this.updateTime);
    window.setInterval(this.timerFired, 100);
  }

  gatherJSON = () => {
    this.http.get('./data/playlist.json')
        .map(( res: Response ) => res.json())
        .subscribe(
          data => {
            this.playlist = data;
            this.selectedVideo(0);
          }
        );
  };

  selectedVideo = (i:number) => {
    this.currentTitle = this.playlist[i]['title'];
    this.currentDesc = this.playlist[i]['description'];
    this.videoElement.src = this.playlist[i]['path'];
    this.videoElement.pause();
    this.isPlaying = false;
  };

  seekVideo(e:any) {
    let el = document.getElementById('progressMeterFull');
    let w = el.offsetWidth;
    let d = this.videoElement.duration;
    let extra = el.getBoundingClientRect().left;
    let s = Math.round( (e.pageX - extra) / w * d);
    this.videoElement.currentTime = s;
  };

  dragStart = function(e:any) {
    this.isDragging = true;
  };

  dragMove = function(e:any) {
    if(this.isDragging) {
      let el = document.getElementById('progressMeterFull');
      let extra = el.getBoundingClientRect().left;
      this.calculatedWidth = e.x - extra;
    }
  };

  dragStop = function(e:any) {
    if(this.isDragging) {
      this.isDragging = false;
      this.seekVideo(e);
    }
  };

  muteVideo() {
    if(this.videoElement.volume == 0) {
      this.videoElement.volume = 1;
      this.isMuted = false;
    } else {
      this.videoElement.volume = 0;
      this.isMuted = true;
    }
  };

  playVideo() {
    if(this.videoElement.paused) {
      this.videoElement.play();
      this.isPlaying = true;
    } else {
      this.videoElement.pause();
      this.isPlaying = false;
    }
  };

  updateData = (e:any) => {
    this.totalTime = this.videoElement.duration;
  };

  updateTime = (e:any) => {
    this.currentTime = this.videoElement.currentTime;
  };

  timerFired = () => {
    if(!this.isDragging) {
      this.calculatedScrubY = this.videoElement.offsetHeight;
      let t = this.videoElement.currentTime;
      let d = this.videoElement.duration;
      let position = t / d * this.videoElement.offsetWidth;
      if(position !== 0) {
        this.calculatedWidth = position;
      } else {
        this.calculatedWidth = -1000;
      }
    }
  };

  details() {
    if(this.showDetails == false) {
      this.showDetails = true;
    } else {
      this.showDetails = false;
    }
  }

  fullScreen() {
    if(this.videoElement.requestFullscreen) {
      this.videoElement.requestFullscreen();
    } else if(this.videoElement.mozRequestFullScreen) {
      this.videoElement.mozRequestFullScreen();
    } else if(this.videoElement.webkitRequestFullscreen) {
      this.videoElement.webkitRequestFullscreen();
    } else if(this.videoElement.msRequestFullscreen) {
      this.videoElement.msRequestFullscreen();
    }
  };

}
