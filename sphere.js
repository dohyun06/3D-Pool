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
    this.boxZ = 22.5;

    this.isFinish = false;
  }

  resize(centerX, centerY) {
    this.centerX = centerX;
    this.centerY = centerY;
  }

  input() {
    this.ndir = this.data.dir;
    this.nv = this.data.vel / 60;
    this.na = this.data.accel / 60 / 60;
    this.nrDir = this.data.rDir;
    this.nomega = Math.abs(this.data.rVel / 60);
    this.nalpha = Math.abs(this.data.rAccel / 60 / 60);
    this.ndt = this.data.colTime;

    this.data.isInput = false;
  }

  reset() {
    this.x = this.index ? -40 : 40;
    this.y = 0;
    this.z = 0;
    this.px = this.x;
    this.py = this.y;
    this.pz = this.z;

    this.dir = this.ndir;
    this.v = this.index ? this.nv : 0;
    this.signX = this.dir[0] >= 0 ? 1 : -1;
    this.signY = this.dir[1] >= 0 ? 1 : -1;
    this.signZ = this.dir[2] >= 0 ? 1 : -1;
    this.vx = Math.abs(this.v * this.dir[0]);
    this.vy = Math.abs(this.v * this.dir[1]);
    this.vz = Math.abs(this.v * this.dir[2]);

    this.a = this.na;
    this.ax = this.a * this.dir[0];
    this.ay = this.a * this.dir[1];
    this.az = this.a * this.dir[2];

    this.rDir = this.nrDir;
    this.omega = this.index ? this.nomega : 0;
    this.signOmegax = Math.sign(this.rDir[0]);
    this.signOmegay = Math.sign(this.rDir[1]);
    this.signOmegaz = Math.sign(this.rDir[2]);
    this.omegax = Math.abs(this.rDir[0] * this.omega);
    this.omegay = Math.abs(this.rDir[1] * this.omega);
    this.omegaz = Math.abs(this.rDir[2] * this.omega);

    this.alpha = this.nalpha;
    this.alphax = Math.abs(this.rDir[0] * this.nalpha);
    this.alphay = Math.abs(this.rDir[1] * this.nalpha);
    this.alphaz = Math.abs(this.rDir[2] * this.nalpha);

    this.dt = this.ndt;

    this.isFinish = false;
  }

  draw(ctx, scale) {
    this.rorate = this.data.rorate;

    this.vx -= this.ax;
    this.vy -= this.ay;
    this.vz -= this.az;

    this.omegax -= this.alphax;
    this.omegay -= this.alphay;
    this.omegaz -= this.alphaz;

    if (this.vx < 0) this.vx = 0;
    if (this.vy < 0) this.vy = 0;
    if (this.vz < 0) this.vz = 0;
    if (this.omegax < 0) this.omegax = 0;
    if (this.omegay < 0) this.omegay = 0;
    if (this.omegaz < 0) this.omegaz = 0;

    if (this.vx === 0 && this.vy === 0 && this.vz === 0) {
      setTimeout(() => (this.isFinish = true), 1000);
    }

    this.px = this.x;
    this.py = this.y;
    this.pz = this.z;
    this.x += this.vx * this.signX;
    this.y += this.vy * this.signY;
    this.z += this.vz * this.signZ;

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
    let x = this.x;
    let y = this.y;
    let z = this.z;
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

    return [this.centerX + x * scale, this.centerY - y * scale];
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
              this.signOmegaz *
              this.r ** 2 *
              ((2 * this.omegaz * this.a * this.dt) / this.r - ((this.a * this.dt) / this.r) ** 2)) **
          0.5;
        this.vz =
          (this.vz ** 2 +
            (2 / 5) *
              this.signX *
              this.signOmegay *
              this.r ** 2 *
              ((2 * this.omegay * this.a * this.dt) / this.r - ((this.a * this.dt) / this.r) ** 2)) **
          0.5;

        const norm = (this.vx ** 2 + this.vy ** 2 + this.vz ** 2) ** 0.5;
        this.ax = (this.a * this.vx) / norm;
        this.ay = (this.a * this.vy) / norm;
        this.az = (this.a * this.vz) / norm;
      } else {
        this.x = (this.boxX - this.r) * 2 - this.x;
        this.vy =
          (this.vy ** 2 -
            (2 / 5) *
              this.signX *
              this.signOmegaz *
              this.r ** 2 *
              ((2 * this.omegaz * this.a * this.dt) / this.r - ((this.a * this.dt) / this.r) ** 2)) **
          0.5;
        this.vz =
          (this.vz ** 2 -
            (2 / 5) *
              this.signX *
              this.signOmegay *
              this.r ** 2 *
              ((2 * this.omegay * this.a * this.dt) / this.r - ((this.a * this.dt) / this.r) ** 2)) **
          0.5;

        const norm = (this.vx ** 2 + this.vy ** 2 + this.vz ** 2) ** 0.5;
        this.ax = (this.a * this.vx) / norm;
        this.ay = (this.a * this.vy) / norm;
        this.az = (this.a * this.vz) / norm;
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
              this.signOmegaz *
              this.r ** 2 *
              ((2 * this.omegaz * this.a * this.dt) / this.r - ((this.a * this.dt) / this.r) ** 2)) **
          0.5;
        this.vz =
          (this.vz ** 2 +
            (2 / 5) *
              this.signY *
              this.signOmegax *
              this.r ** 2 *
              ((2 * this.omegax * this.a * this.dt) / this.r - ((this.a * this.dt) / this.r) ** 2)) **
          0.5;

        const norm = (this.vx ** 2 + this.vy ** 2 + this.vz ** 2) ** 0.5;
        this.ax = (this.a * this.vx) / norm;
        this.ay = (this.a * this.vy) / norm;
        this.az = (this.a * this.vz) / norm;
      } else {
        this.y = (this.boxY - this.r) * 2 - this.y;
        this.vx =
          (this.vx ** 2 -
            (2 / 5) *
              this.signY *
              this.signOmegaz *
              this.r ** 2 *
              ((2 * this.omegaz * this.a * this.dt) / this.r - ((this.a * this.dt) / this.r) ** 2)) **
          0.5;
        this.vz =
          (this.vz ** 2 -
            (2 / 5) *
              this.signY *
              this.signOmegax *
              this.r ** 2 *
              ((2 * this.omegax * this.a * this.dt) / this.r - ((this.a * this.dt) / this.r) ** 2)) **
          0.5;

        const norm = (this.vx ** 2 + this.vy ** 2 + this.vz ** 2) ** 0.5;
        this.ax = (this.a * this.vx) / norm;
        this.ay = (this.a * this.vy) / norm;
        this.az = (this.a * this.vz) / norm;
      }
    }

    if (this.z + this.r > this.boxZ || this.z - this.r < -this.boxZ) {
      this.signZ *= -1;
      if (this.z - this.r < -this.boxZ) {
        this.y = (this.r - this.boxY) * 2 - this.y;
        this.vx =
          (this.vx ** 2 +
            (2 / 5) *
              this.signY *
              this.signOmegay *
              this.r ** 2 *
              ((2 * this.omegay * this.a * this.dt) / this.r - ((this.a * this.dt) / this.r) ** 2)) **
          0.5;
        this.vy =
          (this.vy ** 2 +
            (2 / 5) *
              this.signY *
              this.signOmegax *
              this.r ** 2 *
              ((2 * this.omegax * this.a * this.dt) / this.r - ((this.a * this.dt) / this.r) ** 2)) **
          0.5;

        const norm = (this.vx ** 2 + this.vy ** 2 + this.vz ** 2) ** 0.5;
        this.ax = (this.a * this.vx) / norm;
        this.ay = (this.a * this.vy) / norm;
        this.az = (this.a * this.vz) / norm;
      } else {
        this.z = (this.boxZ - this.r) * 2 - this.z;
        this.vx = this.vx =
          (this.vx ** 2 -
            (2 / 5) *
              this.signY *
              this.signOmegay *
              this.r ** 2 *
              ((2 * this.omegay * this.a * this.dt) / this.r - ((this.a * this.dt) / this.r) ** 2)) **
          0.5;
        this.vy =
          (this.vy ** 2 -
            (2 / 5) *
              this.signY *
              this.signOmegax *
              this.r ** 2 *
              ((2 * this.omegax * this.a * this.dt) / this.r - ((this.a * this.dt) / this.r) ** 2)) **
          0.5;

        const norm = (this.vx ** 2 + this.vy ** 2 + this.vz ** 2) ** 0.5;
        this.ax = (this.a * this.vx) / norm;
        this.ay = (this.a * this.vy) / norm;
        this.az = (this.a * this.vz) / norm;
      }
    }
  }
}
