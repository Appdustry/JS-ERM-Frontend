import { Component, ViewChild, ElementRef, OnDestroy, Input, ChangeDetectorRef, OnChanges, SimpleChanges, HostListener } from '@angular/core';
import { Vector2 } from 'src/app/shared/classes/vector2.class';
import { IEntity } from 'src/app/shared/interfaces/entity.interface';
import { IAttribute } from 'src/app/shared/interfaces/attribute.interface';
import { DiagramService } from './diagram.service';
import { Observable, Subscription } from 'rxjs';
import { Connection } from 'src/app/shared/classes/connection.class';
import { MatSliderChange } from '@angular/material/slider';

@Component({
  selector: 'app-diagram',
  templateUrl: './diagram.component.html',
  styleUrls: ['./diagram.component.scss']
})
export class DiagramComponent implements OnDestroy, OnChanges {

  @ViewChild('wrapper') wrapperElement: ElementRef;
  @Input() viewPortSize: Vector2;
  @Input() sideBarWidth: number;
  entities: Observable<IEntity[]>;
  attributes: Observable<IAttribute[]>;
  connections: Observable<Connection[]>;
  wrapperSize = this.viewPortSize;
  wrapperOffset = new Vector2();

  private _baseSize: Vector2;
  private _panning = false;
  private _initialPanningPosition: Vector2;
  private _holdingMouse = false;
  private _holdTimeout;
  private _currentMousePosition = new Vector2();
  // Time in ms until click is defined as hold
  private _holdTimer = 150;

  private _zoomSubscription: Subscription;

  zoomLevel: number;
  zoomSliederValue = 100;

  constructor(private _diagramService: DiagramService, private _changeDectorRef: ChangeDetectorRef) {
    this.entities = _diagramService.entities;
    this.attributes = _diagramService.attributes;
    this.connections = _diagramService.connections;
    this._zoomSubscription = _diagramService.zoomLevel.subscribe((level) => {
      this.zoomLevel = level / 100;
      if (this.viewPortSize){
        this._calculateWrapperSize();
      }
      this._diagramService.zoomLevel.subscribe((zoomLevel) => {
        this.zoomSliederValue = zoomLevel;
      });
    });

    this._diagramService.panningEvent.subscribe((panning) => this._panning = panning);
  }

  onZoom($e: MatSliderChange) {
    this._diagramService.setZoom($e.value);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.viewPortSize) {
      if (changes.viewPortSize.currentValue.x > 0){
        this._baseSize = new Vector2(changes.viewPortSize.currentValue.x, changes.viewPortSize.currentValue.y);
        this._calculateWrapperSize();
      }
    }
  }

  private _calculateWrapperSize() {
    const xDifference = this._baseSize.x - this._baseSize.x * this.zoomLevel;
    const yDifference = this._baseSize.y - this._baseSize.y * this.zoomLevel;
    this.wrapperSize = new Vector2();
    this.wrapperSize.x = (this._baseSize.x + xDifference / this.zoomLevel);
    this.wrapperSize.y = (this._baseSize.y + yDifference / this.zoomLevel);

    // Calculate offsets
  }

  ngOnDestroy(): void {
    this._zoomSubscription.unsubscribe();
  }

  onMouseDown($e: MouseEvent){
    if ($e.target !== this.wrapperElement.nativeElement){
      return;
    }
    // Click state
    this._holdingMouse = false;
    this._holdTimeout = setTimeout((event) => {
      // Hold state
      this._holdingMouse = true;
      this.startPanning(event);
    }, this._holdTimer, $e);
  }

  onMouseUp($e: MouseEvent, wasLeave: boolean) {
    this._diagramService.panningEvent.emit(false);
    clearTimeout(this._holdTimeout);
    if ($e.target !== this.wrapperElement.nativeElement){
      return;
    }
    this._panning = false;
    if (!this._holdingMouse && !wasLeave){
      this.onClick();
    }
  }

  onClick(){
    this._diagramService.viewPortClickEvent.emit();
    this._diagramService.currentSelectSubject.next(null);
  }

  startPanning($e: MouseEvent){
    $e.preventDefault();
    this._diagramService.panningEvent.emit(true);
    this._panning = true;
    const currentOffset = this._diagramService.panOffset.getValue();
    this._initialPanningPosition = new Vector2(this._currentMousePosition.x - currentOffset.x, this._currentMousePosition.y - currentOffset.y);
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove($e: MouseEvent){
    if (!this._panning){ return; }
    const currentOffset = this._diagramService.panOffset.getValue();
    currentOffset.x = $e.clientX - this._initialPanningPosition.x ;
    currentOffset.y = $e.clientY - this._initialPanningPosition.y;
    this._diagramService.panOffset.next(currentOffset);
  }

  onMouseMoveWrapper($e: MouseEvent){
    this._currentMousePosition.x = $e.clientX;
    this._currentMousePosition.y = $e.clientY;
  }

  get panning(): boolean{
    return this._panning;
  }
}
