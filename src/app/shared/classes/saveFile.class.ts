import { Connection } from './connection.class';
import { Vector2 } from './vector2.class';
import { relationTypes } from './relation.class';

interface ISaveAttribute{
  x: number;
  y: number;
  id: number;
  name: string;
  entityID: number;
  isPrimaryKey: boolean;
}

interface ISaveEntity{
  x: number;
  y: number;
  name: string;
  id: number;
}

interface ISaveConnection{
  startId: number;
  endId: number;
  startType: relationTypes;
  endType: relationTypes;
}

export class SaveFile{
  attributes: ISaveAttribute[];
  entites: ISaveEntity[];
  connections: ISaveConnection[];
  zoomLevel: number;
  panOffset: Vector2;
  idCounter: number;
}
