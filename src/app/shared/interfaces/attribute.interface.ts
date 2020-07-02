export interface INewAttribute{
  x: number;
  y: number;
  name: string;
  entityID: number;
  isPrimaryKey: boolean;
}

export interface IAttribute extends INewAttribute{
  width?: number;
  height?: number;
  id: number;
}