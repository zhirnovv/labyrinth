export enum Wall {
  Yes,
  No,
  Undetermined
}

export enum Side {
  Top = 0,
  Right,
  Bottom,
  Left
}

export class Tile {
  public walls: Wall[];
  public visited: boolean;

  constructor() {
    this.walls = [];

    for (let i = 0; i < 4; i++) {
      this.walls.push(Wall.Undetermined);
    }

    this.visited = false;
  }
}
