import { Sphere } from './sphere.js';

export class Graph {
  constructor() {
    // this.rorate = rorate; // [xy, yz, xz]

    this.objects = [];

    this.objects.push(new Sphere());
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
    for (let i = 0; i < this.objects.length; i++) {
      this.objects[i].draw(ctx, this.scale);
    }
  }

  coord(coord) {
    return [this.centerX + coord[0] * this.scale, this.centerY - coord[1] * this.scale];
  }
}
