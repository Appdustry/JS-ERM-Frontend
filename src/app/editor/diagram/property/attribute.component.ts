import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { IAttribute } from 'src/app/shared/interfaces/attribute.interface';
import { Vector2 } from 'src/app/shared/classes/vector2.class';
import { DiagramService } from '../diagram.service';

@Component({
  selector: 'app-attribute',
  templateUrl: './attribute.component.html',
  styleUrls: ['./attribute.component.scss']
})
export class AttributeComponent implements AfterViewInit {
  @Input() attributeData: IAttribute;
  @ViewChild('text') text: ElementRef;
  textSize = new Vector2();

  constructor(private _changeDetectorRef: ChangeDetectorRef, private _elementRef: ElementRef, private _diagramService: DiagramService) { }

  ngAfterViewInit(): void {
    const BoundingBox = this.text.nativeElement.getBBox();
    this.textSize.x = BoundingBox.width;
    this.textSize.y = BoundingBox.height;
    this._changeDetectorRef.detectChanges();

    this.attributeData.height = this._elementRef.nativeElement.offsetHeight;
    this.attributeData.width = this._elementRef.nativeElement.offsetWidth;
    this._diagramService.updateAttributeSize(this.attributeData);
  }

}
