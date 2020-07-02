import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit, HostListener } from '@angular/core';
import { IEntity } from 'src/app/shared/interfaces/entity.interface';
import { DiagramService } from '../diagram.service';

@Component({
  selector: 'app-entity',
  templateUrl: './entity.component.html',
  styleUrls: ['./entity.component.scss']
})
export class EntityComponent implements AfterViewInit{
  @Input() entityData: IEntity;
  @ViewChild('wrapper') wrapper: ElementRef;

  constructor(private _diagramService: DiagramService) {}

  ngAfterViewInit(){
    const element = this.wrapper.nativeElement;
    this.entityData.height = element.offsetHeight;
    this.entityData.width = element.offsetWidth;
    this._diagramService.updateEntitySize(this.entityData);
  }
}
