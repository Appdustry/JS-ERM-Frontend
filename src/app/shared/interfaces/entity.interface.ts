export interface INewEntity{
  x: number;
  y: number;
  name: string;
}

export interface IEntity extends INewEntity{
  width?: number;
  height?: number;
  id: number;
}