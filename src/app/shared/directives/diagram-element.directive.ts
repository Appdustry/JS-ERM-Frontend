import {
  Directive,
  ElementRef,
  Input,
  HostListener,
  Renderer2,
  AfterViewInit,
  Host,
} from '@angular/core';
import { Vector2 } from '../classes/vector2.class';
import { IVector2 } from '../interfaces/vector2.interface';
import { DiagramService } from 'src/app/editor/diagram/diagram.service';
import { IEntity } from '../interfaces/entity.interface';
import { IAttribute } from '../interfaces/attribute.interface';

@Directive({
  selector: '[appDiagramElement]',
})
export class DiagramElementDirective implements AfterViewInit {
  @Input() element: IEntity | IAttribute;

  private _dragOffset = new Vector2();
  private _panOffset = new Vector2();
  private _mouseHolding = false;
  selected = false;
  private _panning = false;

  constructor(
    private _elRef: ElementRef,
    private _renderer: Renderer2,
    private _diagramService: DiagramService
  ) {
    _renderer.listen(_elRef.nativeElement, 'mousedown', (event) => {
      this.onMouseDown(event);
      this._diagramService.selectedEvent.emit(this.element);
    });
    _diagramService.selectedEvent.subscribe((element: IEntity | IAttribute) => {
      if (element.id !== this.element.id){
        this._deselect();
      }
    })
    _diagramService.panOffset.subscribe((panOffset) => {
      this._panOffset = panOffset;
      if (this.element) {
        this._updatePosition(this.element);
      }
    });
    _diagramService.panningEvent.subscribe((panning) => this._panning = panning);
    _diagramService.viewPortClickEvent.subscribe(() => { this.selected = false; this._renderer.removeClass(_elRef.nativeElement, 'selected'); });
  }

  /**
   * Sets initial position of the dragable
   */
  ngAfterViewInit(): void {
    this._updatePosition(this.element);
  }

  onMouseDown($e: MouseEvent) {
    this._mouseHolding = true;
    const zoomLevel = this._diagramService.zoomLevel.getValue() / 100;
    this._dragOffset.x = $e.clientX - this.element.x * zoomLevel;
    this._dragOffset.y = $e.clientY - this.element.y * zoomLevel;
    this._select();
  }

  private _deselect(){
    this.selected = false;
    this._renderer.removeClass(this._elRef.nativeElement, 'selected');
  }

  private _select(){
    this.selected = true;
    this._diagramService.currentSelectSubject.next(this.element);
    this._renderer.addClass(this._elRef.nativeElement, 'selected');
  }

  @HostListener('document:mouseup')
  onMouseUp() {
    this._mouseHolding = false;
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove($e: MouseEvent) {
    if (this.selected && this._mouseHolding && !this._panning) {
      const zoomLevel = this._diagramService.zoomLevel.getValue() / 100;
      this.element.x = ($e.clientX - this._dragOffset.x) / zoomLevel;
      this.element.y = ($e.clientY - this._dragOffset.y) / zoomLevel;
      this._updatePosition(this.element);
      this._diagramService.updatePosition(this.element);
    }
  }

  private _updatePosition(position: IVector2) {
    this._elRef.nativeElement.style.top = position.y + this._panOffset.y + 'px';
    this._elRef.nativeElement.style.left =
      position.x + this._panOffset.x + 'px';
  }
}
