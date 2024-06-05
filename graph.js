import { Sphere } from './sphere.js';
import { Controller } from './controller.js';

export class Graph {
  constructor() {
    this.controller = new Controller();

    this.rorate = this.controller.rorate;

    this.r = 1;
    this.d = this.r * 2;

    this.boxDot = [45, 22.5, 22.5];

    this.objects = [];

    // this.objects.push(new Sphere(0));
    this.objects.push(new Sphere(1));
  }

  resize(width, height) {
    this.centerX = width / 2;
    this.centerY = height / 2;

    this.scale = 7;

    for (let i = 0; i < this.objects.length; i++) {
      this.objects[i].resize(this.centerX, this.centerY);
    }
  }

  draw(ctx) {
    this.rorate = this.controller.rorate;
    let count = 0;

    for (let i = 0; i < this.objects.length; i++) {
      this.objects[i].draw(ctx, this.scale);
      if (this.objects[i].isFinish) count++;
    }
    if (count === this.objects.length) {
      for (let i = 0; i < this.objects.length; i++) {
        this.objects[i].reset();
      }
    }

    this.sphereCollide();

    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      this.boxDot[0] *= i % 4 ? 1 : -1;
      this.boxDot[1] *= i % 2 ? 1 : -1;
      this.boxDot[2] *= -1;
      const [tx1, ty1] = this.coord([this.boxDot[0], this.boxDot[1], this.boxDot[2]]);

      if (this.boxDot[0] < 0) {
        const [tx2, ty2] = this.coord([-this.boxDot[0], this.boxDot[1], this.boxDot[2]]);
        ctx.moveTo(tx1, ty1);
        ctx.lineTo(tx2, ty2);
      }
      if (this.boxDot[1] < 0) {
        const [tx2, ty2] = this.coord([this.boxDot[0], -this.boxDot[1], this.boxDot[2]]);
        ctx.moveTo(tx1, ty1);
        ctx.lineTo(tx2, ty2);
      }
      if (this.boxDot[2] < 0) {
        const [tx2, ty2] = this.coord([this.boxDot[0], this.boxDot[1], -this.boxDot[2]]);
        ctx.moveTo(tx1, ty1);
        ctx.lineTo(tx2, ty2);
      }
    }

    ctx.lineWidth = '1';
    ctx.stroke();
  }

  coord(coord) {
    let x = coord[0];
    let y = coord[1];
    let z = coord[2];
    let tx = 0;
    let ty = 0;
    let tz = 0;

    tx = x * Math.cos(this.rorate[0]) - z * Math.sin(this.rorate[0]);
    tz = x * Math.sin(this.rorate[0]) + z * Math.cos(this.rorate[0]);
    x = tx;
    z = tz;
    ty = y * Math.cos(this.rorate[1]) - z * Math.sin(this.rorate[1]);
    tz = y * Math.sin(this.rorate[1]) + z * Math.cos(this.rorate[1]);
    y = ty;
    z = tz;

    return [this.centerX + x * this.scale, this.centerY - y * this.scale];
  }

  sphereCollide() {
    for (let i = 0; i < this.objects.length; i++) {
      for (let j = i + 1; j < this.objects.length; j++) {
        const x1 = this.objects[i].x;
        const y1 = this.objects[i].y;
        const x2 = this.objects[j].x;
        const y2 = this.objects[j].y;

        if ((x2 - x1) ** 2 + (y2 - y1) ** 2 < 4 * this.r ** 2 - 0.0001) {
          const px1 = this.objects[i].px;
          const py1 = this.objects[i].py;
          const px2 = this.objects[j].px;
          const py2 = this.objects[j].py;

          const a = x2 - x1 - px2 + px1;
          const b = px2 - px1;
          const c = y2 - y1 - py2 + py1;
          const d = py2 - py1;

          const t1 =
            (-(a * b + c * d) + (4 * this.r * this.r * (a * a + c * c) - (a * d - b * c) ** 2) ** 0.5) /
            (a * a + c * c);

          const t2 =
            (-(a * b + c * d) - (4 * this.r * this.r * (a * a + c * c) - (a * d - b * c) ** 2) ** 0.5) /
            (a * a + c * c);

          const t = t2 < 0 ? t1 : t2;

          // object pos
          const nx1 = px1 + t * (x1 - px1);
          const ny1 = py1 + t * (y1 - py1);
          const nx2 = px2 + t * (x2 - px2);
          const ny2 = py2 + t * (y2 - py2);

          this.objects[i].x = nx1;
          this.objects[i].y = ny1;
          this.objects[j].x = nx2;
          this.objects[j].y = ny2;

          this.objects[i].vx = 0;
          this.objects[i].vy = 0;
          this.objects[j].vx = 0;
          this.objects[j].vy = 0;
        }
      }
    }
  }
}
