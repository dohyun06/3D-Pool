import { Sphere } from './sphere.js';

export class Graph {
  constructor() {
    // this.rorate = rorate; // [xy, yz, xz]

    this.r = 1;
    this.d = this.r * 2;

    this.objects = [];

    this.objects.push(new Sphere(0));
    this.objects.push(new Sphere(1));
  }

  resize(width, height) {
    this.centerX = width / 2;
    this.centerY = height / 2;

    this.scale = width / 90;

    for (let i = 0; i < this.objects.length; i++) {
      this.objects[i].resize(this.centerX, this.centerY);
    }
  }

  draw(ctx) {
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
    ctx.moveTo(this.centerX + -45 * this.scale, this.centerY - 22.5 * this.scale);
    ctx.lineTo(this.centerX + -45 * this.scale, this.centerY - -22.5 * this.scale);
    ctx.lineTo(this.centerX + 45 * this.scale, this.centerY - -22.5 * this.scale);
    ctx.lineTo(this.centerX + 45 * this.scale, this.centerY - 22.5 * this.scale);
    ctx.lineTo(this.centerX + -45 * this.scale, this.centerY - 22.5 * this.scale);

    ctx.lineWidth = '1';
    ctx.stroke();
  }

  coord(coord) {
    return [this.centerX + coord[0] * this.scale, this.centerY - coord[1] * this.scale];
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
