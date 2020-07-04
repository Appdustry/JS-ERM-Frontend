import { Injectable, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IEntity, INewEntity } from 'src/app/shared/interfaces/entity.interface';
import { Connection } from 'src/app/shared/classes/connection.class';
import { IAttribute, INewAttribute } from 'src/app/shared/interfaces/attribute.interface';
import { saveAs } from 'file-saver';
import { Vector2 } from 'src/app/shared/classes/vector2.class';
import { SaveFile } from 'src/app/shared/classes/saveFile.class';
import { Relation, relationTypes } from 'src/app/shared/classes/relation.class';

@Injectable({
  providedIn: 'root'
})
export class DiagramService {
  entities = new BehaviorSubject<IEntity[]>([]);
  relations = new BehaviorSubject<Relation[]>([]);
  attributes = new BehaviorSubject<IAttribute[]>([]);

  updatePositionEvent = new EventEmitter<IAttribute | IEntity>();

  zoomLevel = new BehaviorSubject<number>(100);
  panOffset = new BehaviorSubject<Vector2>(new Vector2());
  viewPortSize = new BehaviorSubject<Vector2>(new Vector2());
  viewPortClickEvent = new EventEmitter();
  panningEvent = new EventEmitter<boolean>();
  currentSelectSubject = new BehaviorSubject<IEntity | IAttribute>(null);
  selectedEvent = new EventEmitter<IEntity | IAttribute>();

  private _idCounter = 0;

  constructor() {
    this.panOffset.subscribe((panOffset) => {
      for (const connection of this.relations.getValue()) {
        connection.setPanOffset(panOffset);
      }
    });
  }

  setViewPortSize(viewPortSize: Vector2) {
    this.viewPortSize.next(viewPortSize);
  }

  updateEntitySize(entity: IEntity) {
    const index = this.entities.getValue().findIndex((search) => search.id === entity.id);
    if (index === -1) { throw new Error('Entity not found'); }

    const currentValues = this.entities.getValue();
    const entry = currentValues[index];

    if (!entity.height || !entity.width) { throw new Error('No height or width provided'); }
    entry.height = entity.height;
    entry.width = entity.width;
    this.entities.next(currentValues);
    this._updateConnection(entity);
  }

  updatePosition(element: IAttribute | IEntity): void {
    this.updatePositionEvent.emit(element);
    this._updateConnection(element);
  }

  updateAttributeSize(attribute: IAttribute) {
    const index = this.attributes.getValue().findIndex((search) => search.id === attribute.id);
    if (index === -1) { throw new Error('Attribute not found'); }

    const currentValues = this.attributes.getValue();
    const entry = currentValues[index];

    if (!attribute.height || !attribute.width) { throw new Error('No height or width provided'); }
    entry.height = attribute.height;
    entry.width = attribute.width;
    this.attributes.next(currentValues);
    this._updateConnection(attribute);
  }

  addConnectionsForAttribute(attribute: IAttribute): void {
    const entity = this.entities.getValue().find((search) => search.id === attribute.entityID);
    const connection = new Relation(attribute, entity, relationTypes.none, relationTypes.none);
    const newArray = this.relations.getValue();
    newArray.push(connection);
    this.relations.next(newArray);
  }

  private _updateConnection(updated: IAttribute | IEntity): void {
    for (const connection of this.relations.getValue()) {
      if (connection.startEntity === updated || connection.endEntity === updated) {
        connection.updateConnectionData(updated);
      }
    }
  }

  setZoom(newLevel: number) {
    this.zoomLevel.next(newLevel);
  }

  addEntity(entity: INewEntity) {
    const entites = this.entities.getValue();
    const newEntity: IEntity = {
      id: this._idCounter++,
      name: entity.name,
      x: entity.x,
      y: entity.y,
    };
    entites.push(newEntity);
    this.entities.next(entites);
  }

  addAttribute(attribute: INewAttribute) {
    const attributes = this.attributes.getValue();
    const newAttribute: IAttribute = {
      id: this._idCounter++,
      name: attribute.name,
      entityID: attribute.entityID,
      x: attribute.x,
      y: attribute.y,
      isPrimaryKey: attribute.isPrimaryKey
    };
    attributes.push(newAttribute);
    this.attributes.next(attributes);
    this._addConnection(newAttribute.id, newAttribute.entityID, relationTypes.none, relationTypes.none);
  }

  private _addConnection(startEntityId: number, endEntityId: number, startType: relationTypes, endType: relationTypes) {
    const connections = this.relations.getValue();
    console.log(this.entities.getValue());
    console.log(this.attributes.getValue());
    let startEntity = this.entities.getValue().find((search) => search.id === startEntityId);
    if (!startEntity) {
      startEntity = this.attributes.getValue().find((search) => search.id === startEntityId);
    }
    let endEntity = this.entities.getValue().find((search) => search.id === endEntityId);
    if (!endEntity) {
      endEntity = this.attributes.getValue().find((search) => search.id === endEntityId);
    }

    if (startEntity && endEntity) {
      connections.push(new Relation(startEntity, endEntity, startType, endType));
    }
    this.relations.next(connections);
    console.log(this.relations.getValue());
  }

  serializeData() {
    const configObject = new SaveFile();
    configObject.attributes = this.attributes.getValue();
    configObject.entites = this.entities.getValue();
    configObject.panOffset = this.panOffset.getValue();
    configObject.zoomLevel = this.zoomLevel.getValue();
    configObject.idCounter = this._idCounter;

    // Remove height and width propperties
    configObject.attributes = configObject.attributes.map(this._removeHeightAndWidth);
    configObject.entites = configObject.entites.map(this._removeHeightAndWidth);

    // Save connections
    configObject.connections = [];
    for (const connection of this.relations.getValue()) {
      configObject.connections.push({
        startId: connection.startEntity.id,
        endId: connection.endEntity.id,
        startType: connection.startType,
        endType: connection.endType
      });
    }

    const jsonObject = JSON.stringify(configObject, null, 2);
    const blob = new Blob([jsonObject], { type: 'application/json' });
    saveAs(blob, 'ER-Diagram.json');
  }

  private _removeHeightAndWidth(obj) {
    const copy = Object.assign({}, obj);
    if (copy.height) {
      delete copy.height;
    }
    if (copy.width) {
      delete copy.width;
    }
    return copy;
  }

  public loadFile(file: SaveFile) {
    this.entities.next(file.entites);
    this.attributes.next(file.attributes);
    this.relations.next([]);

    // Create connections
    const connections: Connection[] = [];
    for (const connection of file.connections) {
      console.log(connection);
      this._addConnection(connection.startId, connection.endId, connection.startType, connection.endType);
    }
    this.panOffset.next(file.panOffset);
    this.zoomLevel.next(file.zoomLevel);
    this._idCounter = file.idCounter;
  }

  public isEntity(element: IEntity | IAttribute): boolean {
    if (this.entities.getValue().find((searchElement) => searchElement.id === element.id)) {
      return true;
    }
    return false;
  }
}
