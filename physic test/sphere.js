import { Controller } from './controller.js';

export class Sphere {
  constructor(index) {
    this.data = new Controller();

    this.index = index;

    this.r = 1;

    this.input();

    this.reset();

    this.boxX = 45;
    this.boxY = 22.5;

    this.isFinish = false;
  }

  resize(centerX, centerY) {
    this.centerX = centerX;
    this.centerY = centerY;
  }

  input() {
    this.angle = this.data.angle;
    this.na = this.data.accel / 60 / 60;
    this.nomega = Math.abs(this.data.angVel / 60);
    this.nsignOmega = Math.sign(this.data.angVel);
    this.nalpha = Math.abs(this.data.angAccel / 60 / 60);
    this.dt = this.data.colTime;

    this.data.isInput = false;
  }

  reset() {
    this.x = this.index ? -40 : 40;
    this.y = 0;
    this.px = this.x;
    this.py = this.y;
    this.signX = Math.sign(Math.cos(this.angle));
    this.signX = this.signX ? this.signX : 1;
    this.signY = Math.sign(Math.sin(this.angle));
    this.signY = this.signY ? this.signY : 1;
    this.v = this.index ? 80 / 60 : 0;
    this.a = this.na;
    this.vx = Math.abs(this.v * Math.cos(this.angle));
    this.vy = Math.abs(this.v * Math.sin(this.angle));
    this.ax = Math.abs(this.a * Math.cos(this.angle));
    this.ay = Math.abs(this.a * Math.sin(this.angle));
    this.omega = this.index ? this.nomega : 0;
    this.signOmega = this.nsignOmega;
    this.alpha = this.nalpha;

    this.isFinish = false;
  }

  draw(ctx, scale) {
    if (this.vx !== 0 && this.vy !== 0) {
      this.ax = Math.abs((this.a * this.vx) / (this.vx ** 2 + this.vy ** 2) ** 0.5);
      this.ay = Math.abs((this.a * this.vy) / (this.vx ** 2 + this.vy ** 2) ** 0.5);
    }

    this.vx -= this.ax;
    this.vy -= this.ay;

    this.omega -= this.alpha;

    if (this.vx < 0) this.vx = 0;
    if (this.vy < 0) this.vy = 0;
    if (this.omega < 0) this.omega = 0;

    if (this.vx === 0 && this.vy === 0) {
      setTimeout(() => (this.isFinish = true), 1000);
    }

    this.px = this.x;
    this.py = this.y;
    this.x += this.vx * this.signX;
    this.y += this.vy * this.signY;

    this.boxCollision();

    const pos = this.coord(scale);

    ctx.beginPath();
    ctx.arc(pos[0], pos[1], this.r * scale, 0, Math.PI * 2);
    ctx.fillStyle = '#35F';
    if (this.index) ctx.fillStyle = '#3F5';
    ctx.fill();

    if (this.data.isInput) this.input();
  }

  coord(scale) {
    return [this.centerX + this.x * scale, this.centerY - this.y * scale];
  }

  boxCollision() {
    if (this.x + this.r > this.boxX || this.x - this.r < -this.boxX) {
      this.signX *= -1;
      if (this.x - this.r < -this.boxX) {
        this.x = (this.r - this.boxX) * 2 - this.x;
        this.vy =
          (this.vy ** 2 +
            (2 / 5) *
              this.signX *
              this.signOmega *
              this.r ** 2 *
              ((2 * this.omega * this.a * this.dt) / this.r - ((this.a * this.dt) / this.r) ** 2)) **
          0.5;
      } else {
        this.x = (this.boxX - this.r) * 2 - this.x;
        this.vy =
          (this.vy ** 2 -
            (2 / 5) *
              this.signX *
              this.signOmega *
              this.r ** 2 *
              ((2 * this.omega * this.a * this.dt) / this.r - ((this.a * this.dt) / this.r) ** 2)) **
          0.5;
      }
    }

    if (this.y + this.r > this.boxY || this.y - this.r < -this.boxY) {
      this.signY *= -1;
      if (this.y - this.r < -this.boxY) {
        this.y = (this.r - this.boxY) * 2 - this.y;
        this.vx =
          (this.vx ** 2 +
            (2 / 5) *
              this.signY *
              this.signOmega *
              this.r ** 2 *
              ((2 * this.omega * this.a * this.dt) / this.r - ((this.a * this.dt) / this.r) ** 2)) **
          0.5;
      } else {
        this.y = (this.boxY - this.r) * 2 - this.y;
        this.vx =
          (this.vx ** 2 -
            (2 / 5) *
              this.signY *
              this.signOmega *
              this.r ** 2 *
              ((2 * this.omega * this.a * this.dt) / this.r - ((this.a * this.dt) / this.r) ** 2)) **
          0.5;
      }
    }
  }
}
