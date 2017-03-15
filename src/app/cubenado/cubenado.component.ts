import { Component, OnInit, AfterViewInit, Input, Output, ElementRef, ViewChild, EventEmitter} from '@angular/core';
import { Cubenado } from './cubenado';

@Component({
  selector: 'cubenado',
  templateUrl: './cubenado.component.html',
  styleUrls: ['./cubenado.component.css']
})
  

export class CubenadoComponent implements AfterViewInit {
  @ViewChild('cubenadoCanvas') cubenadoCanvas: ElementRef;
  @Input() cubes:number;
  @Input() speed:number;
  @Output() stop: EventEmitter<string> = new EventEmitter<string>();

  minCubes: number = 10;
  maxCubes: number = 1000; 
  minSpeed: number = 1;
  maxSpeed: number = 15; 
  private _cubenado: Cubenado = null;

  constructor() { }

  ngAfterViewInit() {
    this._cubenado = new Cubenado(this.cubenadoCanvas.nativeElement);
    this.onChanges();
   }

   onStop() {
     this.stop.emit("stopped");
   }

  onChanges() {
    //console.log("speed="+this.speed+" cubes:"+this.cubes);
    this._cubenado.speed = this.speed;
    this._cubenado.particleCount = this.cubes;
    this._cubenado.animate();
  }

}