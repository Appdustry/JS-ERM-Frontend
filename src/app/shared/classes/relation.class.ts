import { Connection } from './connection.class';
import { IEntity } from '../interfaces/entity.interface';
import { IAttribute } from '../interfaces/attribute.interface';

export class Relation extends Connection{
  startType: relationTypes;
  endType: relationTypes;
  verb: string;

  constructor(start: IEntity | IAttribute, end: IEntity | IAttribute, startType: relationTypes, endType: relationTypes) {
    super(start, end);
    this.startType = startType;
    this.endType = endType;
  }
}

export enum relationTypes {
  one,
  many,
  oneNotNull,
  manyNotNull,
  none,
};