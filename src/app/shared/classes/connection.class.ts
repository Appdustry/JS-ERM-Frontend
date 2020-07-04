import { Vector2 } from './vector2.class';
import { IEntity } from '../interfaces/entity.interface';
import { IAttribute } from '../interfaces/attribute.interface';
import { IVector2 } from '../interfaces/vector2.interface';

export class Connection{
  containerStart = new Vector2();
  containerEnd = new Vector2();

  startEntity: IEntity | IAttribute;
  endEntity: IEntity | IAttribute;

  lineStart = new Vector2();
  lineEnd = new Vector2();

  requiredPositionStart = new Vector2();
  requiredPositionEnd = new Vector2();
  requiredOffset = 70;

  padding = 20;

  private _panOffset = new Vector2();

  constructor(start: IEntity | IAttribute, end: IEntity | IAttribute) {
    this.startEntity = start;
    this.endEntity = end;
    this.updateConnectionData();
  }

  setPanOffset(offset: IVector2){
    this._panOffset.x = offset.x;
    this._panOffset.y = offset.y;
    this.updateConnectionData();
  }

  get containerSize(): Vector2 {
    if (this.containerStart && this.containerEnd){
      const temp = new Vector2(this.containerEnd.x - this.containerStart.x, this.containerEnd.y - this.containerStart.y);
      return temp;
    } else {
      return new Vector2();
    }
  }

  updateConnectionData(entity?: IEntity | IAttribute): void{
    if (entity){
      if (this.startEntity.id === entity.id){ this.startEntity = entity; }
      if (this.endEntity.id === entity.id){ this.endEntity = entity; }
    }
    if (!this.startEntity.width || !this.endEntity.width){
      return;
    }

    // tslint:disable-next-line: max-line-length
    const startEntityMiddle = new Vector2(this.startEntity.x + this.startEntity.width / 2, this.startEntity.y + this.startEntity.height / 2);
    const endEntityMiddle = new Vector2(this.endEntity.x + this.endEntity.width / 2, this.endEntity.y + this.endEntity.height / 2);

    this.containerStart.x = (startEntityMiddle.x <= endEntityMiddle.x) ? startEntityMiddle.x - this.padding / 2 : endEntityMiddle.x - this.padding / 2;
    this.containerStart.y = (startEntityMiddle.y <= endEntityMiddle.y) ? startEntityMiddle.y - this.padding / 2 : endEntityMiddle.y - this.padding / 2;


    this.containerEnd.x = (startEntityMiddle.x >= endEntityMiddle.x) ? startEntityMiddle.x + this.padding / 2 : endEntityMiddle.x + this.padding / 2;
    this.containerEnd.y = (startEntityMiddle.y >= endEntityMiddle.y) ? startEntityMiddle.y + this.padding / 2 : endEntityMiddle.y + this.padding / 2;

    this.lineStart.x = startEntityMiddle.x - this.containerStart.x;
    this.lineStart.y = startEntityMiddle.y - this.containerStart.y;

    this.lineEnd.x = endEntityMiddle.x - this.containerStart.x;
    this.lineEnd.y = endEntityMiddle.y - this.containerStart.y;

    this.containerStart.x += this._panOffset.x;
    this.containerStart.y += this._panOffset.y;
    this.containerEnd.x += this._panOffset.x;
    this.containerEnd.y += this._panOffset.y;

    this.requiredPositionStart = Object.assign({}, this.lineStart);
    this.requiredPositionEnd = Object.assign({}, this.lineEnd);

    const m = new Vector2();
    m.x = this.lineEnd.x - this.lineStart.x;
    m.y = this.lineEnd.y - this.lineStart.y;

    this.requiredPositionStart.x += m.normalized.x * this.requiredOffset;
    this.requiredPositionStart.y += m.normalized.y * this.requiredOffset;

    this.requiredPositionEnd.x -= m.normalized.x * this.requiredOffset;
    this.requiredPositionEnd.y -= m.normalized.y * this.requiredOffset;

    console.log('start', this.requiredPositionStart);
    console.log('end', this.requiredPositionEnd);
  }
}
