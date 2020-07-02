export class Vector2{
  x: number;
  y: number;

  constructor(x?: number, y?: number) {
    this.x = x ? x : 0;
    this.y = y ? y : 0;
  }

  get length(): number{
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }


  get abs(): Vector2{
    const x = Math.abs(this.x);
    const y = Math.abs(this.y);
    return new Vector2(x, y);
  }

  scale(scale: number){
    return new Vector2(Math.round(this.x * scale), Math.round(this.y * scale));
  }
}
