import { Component, OnInit, Input, AfterViewInit, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { Vector2 } from 'src/app/shared/classes/vector2.class';
import { Connection } from 'src/app/shared/classes/connection.class';
import { DiagramService } from '../diagram.service';
import { Relation } from 'src/app/shared/classes/relation.class';

@Component({
  selector: 'app-connection',
  templateUrl: './connection.component.html',
  styleUrls: ['./connection.component.scss']
})
export class ConnectionComponent{
  @Input() connectionData: Relation;

  constructor(private _diagramService: DiagramService) { }

  onClick(){
    this._diagramService.viewPortClickEvent.emit();
    this._diagramService.currentSelectSubject.next(null);
    this._diagramService.panningEvent.next(false);
  }

}
