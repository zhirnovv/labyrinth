import * as p5 from "p5";
import { Tile, Side, Wall } from "./Tile";

export class Painter {
  private BG_COLOR = 255;
  private TILE_WIDTH = 15;

  private p5: p5;
  private cols: number;
  private rows: number;
  private wallColors: Record<string, p5.Color>;

  public constructor(p5: p5, cols: number, rows: number) {
    this.p5 = p5;
    this.cols = cols;
    this.rows = rows;
    this.wallColors = {
      yes: this.p5.color(0, 0, 0),
      undetermined: this.p5.color(255, 0, 0)
    };
  }

  public setup() {
    this.createCanvas();
    this.drawBackground();
  }

  public draw(tiles: Tile[][], current: any): void {
    this.drawBackground();

    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        let x: number = i * this.TILE_WIDTH;
        let y: number = j * this.TILE_WIDTH;

        let tile: Tile = tiles[i][j];

        this.drawLine(x, y, x + this.TILE_WIDTH, y, tile.walls[Side.Top]);

        this.drawLine(
          x + this.TILE_WIDTH,
          y,
          x + this.TILE_WIDTH,
          y + this.TILE_WIDTH,
          tile.walls[Side.Right]
        );

        this.drawLine(
          x,
          y + this.TILE_WIDTH,
          x + this.TILE_WIDTH,
          y + this.TILE_WIDTH,
          tile.walls[Side.Bottom]
        );

        this.drawLine(x, y, x, y + this.TILE_WIDTH, tile.walls[Side.Left]);

        if (current.i === i && current.j === j) {
          this.p5.fill(this.p5.color(255, 0, 0));
          this.p5.square(x, y, this.TILE_WIDTH);
        }
      }
    }
  }

  public noLoop() {
    this.p5.noLoop();
  }

  private createCanvas(): void {
    this.p5.createCanvas(
      this.cols * this.TILE_WIDTH,
      this.rows * this.TILE_WIDTH,
      this.p5.P2D
    );
  }

  private drawBackground(): void {
    this.p5.background(this.BG_COLOR);
  }

  private drawLine(ax: number, ay: number, bx: number, by: number, wall: Wall) {
    let color: p5.Color;
    if (wall === Wall.Yes) {
      color = this.wallColors.yes;
    } else if (wall === Wall.Undetermined) {
      color = this.wallColors.undetermined;
    } else {
      return;
    }
    this.p5.stroke(color);
    this.p5.line(ax, ay, bx, by);
  }
}
