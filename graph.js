import { Sphere } from './sphere.js';

export class Graph {
  constructor() {
    // this.rorate = rorate; // [xy, yz, xz]

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
}
