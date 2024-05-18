import { Controller } from './controller.js';

export class Sphere {
  constructor() {
    this.data = new Controller();

    this.r = 1;

    this.input();

    this.x = -40;
    this.y = 0;
    this.signX = Math.sign(Math.cos(this.angle));
    this.signY = Math.sign(Math.sin(this.angle));
    this.v = 80 / 60;
    this.vx = Math.abs(this.v * Math.cos(this.angle));
    this.vy = Math.abs(this.v * Math.sin(this.angle));
    this.ax = Math.abs(this.a * Math.cos(this.angle));
    this.ay = Math.abs(this.a * Math.sin(this.angle));
    this.omega = this.nomega;
    this.signOmega = this.nsignOmega;
    this.alpha = this.nalpha;

    this.boxX = 45;
    this.boxY = 22.5;
  }

  resize(centerX, centerY) {
    this.centerX = centerX;
    this.centerY = centerY;
  }

  input() {
    this.angle = this.data.angle;
    this.a = this.data.accel / 60 / 60;
    this.nomega = Math.abs(this.data.angVel / 60);
    this.nsignOmega = Math.sign(this.data.angVel);
    this.nalpha = Math.abs(this.data.angAccel / 60 / 60);
    this.dt = this.data.colTime;

    this.data.isInput = false;
  }

  draw(ctx, scale) {
    this.vx -= this.ax;
    this.vy -= this.ay;

    this.omega -= this.alpha;

    if (this.vx < 0) this.vx = 0;
    if (this.vy < 0) this.vy = 0;
    if (this.omega < 0) this.omega = 0;

    if (this.vx === 0 && this.vy === 0) {
      this.x = -40;
      this.y = 0;
      this.signX = Math.sign(Math.cos(this.angle));
      this.signY = Math.sign(Math.sin(this.angle));
      this.v = 80 / 60;
      this.vx = Math.abs(this.v * Math.cos(this.angle));
      this.vy = Math.abs(this.v * Math.sin(this.angle));
      this.ax = Math.abs(this.a * Math.cos(this.angle));
      this.ay = Math.abs(this.a * Math.sin(this.angle));
      this.omega = this.nomega;
      this.signOmega = this.nsignOmega;
      this.alpha = this.nalpha;
    }

    this.x += this.vx * this.signX;
    this.y += this.vy * this.signY;

    this.boxCollision();

    const pos = this.coord(scale);

    ctx.beginPath();
    ctx.arc(pos[0], pos[1], this.r * scale, 0, Math.PI * 2);
    ctx.fillStyle = '#000';
    ctx.fill();

    if (this.data.isInput) this.input();
  }

  coord(scale) {
    return [this.centerX + this.x * scale, this.centerY - this.y * scale];
  }

  boxCollision() {
    if (this.x + this.r > this.boxX || this.x - this.r < -this.boxX) {
      this.signX *= -1;
      if (this.x - this.r < -this.boxX) this.x = -this.boxX * 2 - this.x;
      else this.x = this.boxX * 2 - this.x;
      this.vy =
        (this.vy ** 2 +
          (2 / 5) *
            this.r ** 2 *
            ((2 * this.omega * this.signOmega * this.ay * this.dt) / this.r - ((this.ay * this.dt) / this.r) ** 2)) **
        0.5;
    }
    if (this.y + this.r > this.boxY || this.y - this.r < -this.boxY) {
      this.signY *= -1;
      if (this.y - this.r < -this.boxY) this.y = -this.boxY * 2 - this.y;
      else this.y = this.boxY * 2 - this.y;
      this.vx =
        (this.vx ** 2 +
          (2 / 5) *
            this.r ** 2 *
            ((2 * this.omega * this.signOmega * this.ax * this.dt) / this.r - ((this.ax * this.dt) / this.r) ** 2)) **
        0.5;
    }
  }
}