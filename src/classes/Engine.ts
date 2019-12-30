import { Tile, Wall, Side } from "./Tile";
import { Painter } from "./Painter";
import * as p5 from "p5";

class Coordinate {
  public constructor(i: number, j: number) {
    this.i = i;
    this.j = j;
  }

  public i: number;
  public j: number;
}

export class Engine {
  private COLS = 20;
  private ROWS = 20;

  private painter: Painter;
  private stack: Coordinate[];
  private tiles: Tile[][];
  private current: Coordinate;

  constructor(p5: p5) {
    this.painter = new Painter(p5, this.COLS, this.ROWS);

    p5.setup = this.setup.bind(this);
    p5.draw = this.update.bind(this);

    let rand = Math.floor(Math.random() * this.COLS);
    this.current = new Coordinate(0, rand);

    this.stack = [this.current];
  }

  private setup() {
    this.tiles = [];
    for (let i = 0; i < this.COLS; i++) {
      this.tiles.push([] as Tile[]);
      for (let j = 0; j < this.ROWS; j++) {
        this.tiles[i][j] = new Tile();

        if (i === 0) {
          this.tiles[i][j].walls[Side.Left] = Wall.Yes;
        } else if (i === this.COLS - 1) {
          this.tiles[i][j].walls[Side.Right] = Wall.Yes;
        }

        if (j === 0) {
          this.tiles[i][j].walls[Side.Top] = Wall.Yes;
        } else if (j === this.ROWS - 1) {
          this.tiles[i][j].walls[Side.Bottom] = Wall.Yes;
        }
      }
    }

    this.painter.setup();
  }

  private update() {
    let current = this.stack[this.stack.length - 1];
    let tile = this.tiles[current.i][current.j];

    tile.visited = true;
    let available: Side[] = [];

    for (let i = 0; i < 4; i++) {
      if (tile.walls[i] !== Wall.Undetermined) {
        continue;
      }

      let neighbourCoordinate = this.getNeighbour(current, i as Side);
      let neighbour = this.tiles[neighbourCoordinate.i][neighbourCoordinate.j];

      if (neighbour.visited) {
        neighbour.walls[this.flipSide(i as Side)] = Wall.Yes;
        tile.walls[i as Side] = Wall.Yes;
      } else {
        available.push(i as Side);
      }
    }

    if (available.length === 0) {
      this.stack.pop();
    } else {
      let nextSideIndex: number = Math.floor(Math.random() * available.length);
      let nextSide = available[nextSideIndex];
      let neighbour = this.getNeighbour(current, nextSide);

      tile.walls[nextSide] = Wall.No;
      this.tiles[neighbour.i][neighbour.j].walls[this.flipSide(nextSide)] =
        Wall.No;

      this.stack.push(neighbour);
    }

    this.painter.draw(this.tiles, current);

    if (this.stack.length === 0) {
      this.painter.noLoop();
    }
  }

  private getNeighbour(current: Coordinate, side: Side): Coordinate {
    switch (side) {
      case Side.Top: {
        return new Coordinate(current.i, current.j - 1);
      }
      case Side.Right: {
        return new Coordinate(current.i + 1, current.j);
      }
      case Side.Bottom: {
        return new Coordinate(current.i, current.j + 1);
      }
      case Side.Left: {
        return new Coordinate(current.i - 1, current.j);
      }
    }
  }

  private flipSide(side: Side): Side {
    return ((side + 2) % 4) as Side;
  }
}
