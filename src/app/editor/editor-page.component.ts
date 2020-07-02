import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Vector2 } from '../shared/classes/vector2.class';
import { DiagramService } from './diagram/diagram.service';
import { MatDialog } from '@angular/material/dialog';
import { OpenFileDialogComponent } from './open-file-dialog/open-file-dialog.component';
import { NewEntityDialogComponent } from './new-entity-dialog/new-entity-dialog.component';
import { INewEntity, IEntity } from '../shared/interfaces/entity.interface';
import { IAttribute, INewAttribute } from '../shared/interfaces/attribute.interface';
import { NewAttributeDialogComponent } from './new-attribute-dialog/new-attribute-dialog.component';
import { MatExpansionPanel } from '@angular/material/expansion';


@Component({
  selector: 'app-editor-page',
  templateUrl: './editor-page.component.html',
  styleUrls: ['./editor-page.component.scss']
})
export class EditorPageComponent implements AfterViewInit, OnInit {
  @ViewChild('sideBar') sideBar: ElementRef;
  sideBarWidth = 0;
  selected = false;
  entitySelected = true;

  @ViewChild('entityExpand') entityExpandPanel: MatExpansionPanel;
  @ViewChild('attributeExpand') attributeExpandPanel: MatExpansionPanel;

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _diagramService: DiagramService,
    private _dialog: MatDialog) { }

  @ViewChild('viewPort') viewPort: ElementRef;
  viewPortSize = new Vector2();

  ngOnInit(): void{
    this._diagramService.currentSelectSubject.subscribe((element) => {
      this.onSelect(element);
    });
  }

  ngAfterViewInit(): void {
    if (this.viewPort.nativeElement){
      const nativeElement = this.viewPort.nativeElement;
      this.viewPortSize = new Vector2(nativeElement.offsetWidth, nativeElement.offsetHeight);
      this._diagramService.setViewPortSize(this.viewPortSize);
      this.sideBarWidth = this.sideBar.nativeElement.offsetWidth;
      this._changeDetectorRef.detectChanges();
    }
  }

  onSelect(element: IEntity|IAttribute){
    if (element === null){
      if (this.attributeExpandPanel){
        this.attributeExpandPanel.close();
      }
      this.selected = false;
      this.entitySelected = false;
      return;
    } else {
      this.selected = true;
      if (this.attributeExpandPanel){
        this.attributeExpandPanel.open();
      }
    }
    this.entitySelected = this._diagramService.isEntity(element);
  }

  saveFile(): void{
    this._diagramService.serializeData();
  }

  openFileDialog(): void{
    const dialogRef = this._dialog.open(OpenFileDialogComponent);
    dialogRef.afterClosed().subscribe((closeEvent) => {
      if (closeEvent.loaded){
        this._diagramService.laodFile(closeEvent.data);
      }
    });
  }

  onNewEntity(): void{
    const dialogRef = this._dialog.open(NewEntityDialogComponent);
    dialogRef.afterClosed().subscribe((closeEvent) => {
      if (closeEvent.created){
        this._createNewEntity(closeEvent.data);
      }
    });
  }

  onNewAttribute(): void {
    const dialogRef = this._dialog.open(NewAttributeDialogComponent);
    dialogRef.afterClosed().subscribe((closeEvent) => {
      if (closeEvent.created){
        this._createNewAttribute(closeEvent.data.attributeName, closeEvent.data.isPrimaryKey);
      }
    });
  }

  private _createNewEntity(name: string){
    const middleOfViewPort = this._getMiddleOfViewport();
    const newEntity: INewEntity  = {
      name,
      x: middleOfViewPort.x,
      y: middleOfViewPort.y,
    };
    this._diagramService.addEntity(newEntity);
  }

  private _createNewAttribute(name: string, isPrimaryKey: boolean){
    const middleOfViewPort = this._getMiddleOfViewport();
    const newAttribute: INewAttribute = {
      name,
      ...middleOfViewPort,
      entityID: this._diagramService.currentSelectSubject.getValue().id,
      isPrimaryKey
    };
    this._diagramService.addAttribute(newAttribute);
  }

  private _getMiddleOfViewport(): Vector2{
    const middleOfViewPort = new Vector2();
    middleOfViewPort.x = this.viewPortSize.x / 2 * (this._diagramService.zoomLevel.getValue() / 100) - this._diagramService.panOffset.getValue().x;
    middleOfViewPort.y = this.viewPortSize.y / 2 * (this._diagramService.zoomLevel.getValue() / 100) - this._diagramService.panOffset.getValue().y;
    return middleOfViewPort;
  }
}
