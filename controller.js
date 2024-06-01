export class Controller {
  constructor() {
    this.controlAngle = document.querySelector('#angle');
    this.controlAccel = document.querySelector('#accel');
    this.controlAngVel = document.querySelector('#angVel');
    this.controlAngAccel = document.querySelector('#angAccel');
    this.controlColTime = document.querySelector('#colTime');

    this.controlAngle.addEventListener('change', this.inputAngle.bind(this));
    this.controlAccel.addEventListener('change', this.inputAccel.bind(this));
    this.controlAngVel.addEventListener('change', this.inputAngVel.bind(this));
    this.controlAngAccel.addEventListener('change', this.inputAngAccel.bind(this));
    this.controlColTime.addEventListener('change', this.inputColTime.bind(this));

    this.isInput = false;

    this.angle = 0;
    this.accel = 8;
    this.angVel = Math.PI * 3;
    this.angAccel = (Math.PI * 3) / 8;
    this.colTime = 0.001;

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

  inputAngle() {
    this.angle = parseFloat(this.controlAngle.value);
    this.isInput = true;
  }

  inputAccel() {
    this.accel = parseFloat(this.controlAccel.value);
    this.isInput = true;
  }

  inputAngVel() {
    this.angVel = parseFloat(this.controlAngVel.value);
    this.isInput = true;
  }

  inputAngAccel() {
    this.angAccel = parseFloat(this.controlAngAccel.value);
    this.isInput = true;
  }

  inputColTime() {
    this.colTime = parseFloat(this.controlColTime.value);
    this.isInput = true;
  }
}
