export class Controller {
  constructor() {
    this.controlDir = document.querySelector('#dir');
    this.controlVel = document.querySelector('#vel');
    this.controlAccel = document.querySelector('#accel');
    this.controlrDir = document.querySelector('#rDir');
    this.controlrVel = document.querySelector('#rVel');
    this.controlrAccel = document.querySelector('#rAccel');
    this.controlColTime = document.querySelector('#colTime');

    this.controlDir.addEventListener('change', this.inputDir.bind(this));
    this.controlVel.addEventListener('change', this.inputVel.bind(this));
    this.controlAccel.addEventListener('change', this.inputAccel.bind(this));
    this.controlrDir.addEventListener('change', this.inputrDir.bind(this));
    this.controlrVel.addEventListener('change', this.inputrVel.bind(this));
    this.controlrAccel.addEventListener('change', this.inputrAccel.bind(this));
    this.controlColTime.addEventListener('change', this.inputColTime.bind(this));

    this.isInput = false;

    this.dir = [1, 0, 0];
    this.vel = 100;
    this.accel = 10;
    this.rDir = [0, 0, 1];
    this.rVel = Math.PI * 10;
    this.rAccel = (Math.PI * 10) / 5;
    this.colTime = 0.01;

    this.rorate = [0, 0]; // xz, yz
    this.isClick = false;
    this.pcx = 0;
    this.pcy = 0;

    window.addEventListener('mousedown', (e) => {
      this.pcx = e.clientX;
      this.pcy = e.clientY;
      this.isClick = true;
    });
    window.addEventListener('mousemove', (e) => {
      if (this.isClick) {
        this.rorate[0] += (e.clientX - this.pcx) / 300;
        this.rorate[1] += (e.clientY - this.pcy) / 300;
        this.pcx = e.clientX;
        this.pcy = e.clientY;
      }
    });
    window.addEventListener('mouseup', () => {
      this.isClick = false;
    });
  }

  inputDir() {
    const [dx, dy, dz] = this.controlDir.value
      .slice(1, -1)
      .split(',')
      .map((i) => parseFloat(i));
    const norm = (dx ** 2 + dy ** 2 + dz ** 2) ** 0.5;
    this.dir = [dx / norm, dy / norm, dz / norm];
    this.isInput = true;
  }

  inputVel() {
    this.vel = parseFloat(this.controlVel.value);
    this.isInput = true;
  }

  inputAccel() {
    this.accel = parseFloat(this.controlAccel.value);
    this.isInput = true;
  }

  inputrDir() {
    const [dx, dy, dz] = this.controlrDir.value
      .slice(1, -1)
      .split(',')
      .map((i) => parseFloat(i));
    const norm = (dx ** 2 + dy ** 2 + dz ** 2) ** 0.5;
    this.rDir = [dx / norm, dy / norm, dz / norm];
    this.isInput = true;
  }

  inputrVel() {
    this.rVel = parseFloat(this.controlrVel.value);
    this.isInput = true;
  }

  inputrAccel() {
    this.rAccel = parseFloat(this.controlrAccel.value);
    this.isInput = true;
  }

  inputColTime() {
    this.colTime = parseFloat(this.controlColTime.value);
    this.isInput = true;
  }
}
