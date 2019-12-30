import { Engine } from "./classes/Engine";
import * as p5 from "p5";

const sketch = (p5: p5) => {
  const engine = new Engine(p5);
};

new p5(sketch, document.getElementById("canvas"));
