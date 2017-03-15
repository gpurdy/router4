import { Component, OnInit, Input, AfterViewInit, Output, EventEmitter } from '@angular/core';
declare var jQuery:any; // Materialize uses jQuery

@Component({
  selector: 'vrplayer',
  templateUrl: './vrplayer.component.html',
  styleUrls: ['./vrplayer.component.css']
})
export class VrplayerComponent implements AfterViewInit {
  mediaElement: any;

  @Input() url: string;
  @Input() type: string; 
  @Output() stop: EventEmitter<string> = new EventEmitter<string>();

   constructor() {
    this.type = "";
  }

  isPaused() {
    return this.mediaElement && this.mediaElement.paused;
  }
  onPlay() {
    this.play();
  }
 
  onStop() {
    this.mediaElement.setCurrentTime(0);
    this.pause();
    this.stop.emit("stopped");
  }
 
  onPause() {
    this.pause();
  }

  play() {
    this.mediaElement.play();
  }

   pause() {
    this.mediaElement.pause();
  }
   
  ngAfterViewInit() {
       var _this = this;
       // Note: The mediaelementplayer API was used to test the play, stop, and pause methods of this component
       jQuery('#player1').mediaelementplayer({
         features:['playpause', 'stop', 'progress'],
         success: function(mediaElement, originalNode) {
           _this.mediaElement = mediaElement;
        }
    });

   }

}
