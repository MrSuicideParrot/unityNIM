function Waiter(el) {
    var c = document.getElementById("myCanvas");

    this.TIMER_BORDER = 3;

    this.cor1 = "#ececec";  //cor anel interior
    this.cor2 = "#3366CC"; // Cor do anel exterior


    this.TIMER_DURATION = 999;
    this.TIME_ELAPSED = 0;

    this.r1 = 8; //raio interior
    this.r2 = 10; //raio exterior

    this.MAXFPS = 60;
    this.c = c;

    this.ctx = c.getContext('2d');
}

Waiter.prototype.clearFrame = function () {
    this.ctx.clearRect(0, 0, this.el.width, this.el.height);
}

Waiter.prototype.drawTimer = function () {
    var self = this;
    var ctx = this.ctx;
    var center = {
        x: this.el.width / 2,
        y: this.el.height / 2
    };
    var r = (this.el.width - this.TIMER_BORDER) / 3 - this.DOT_RADIUS;
   var eAngle = (1.6 - 2.0 * this.TIME_ELAPSED / this.TIMER_DURATION) * Math.PI;

    var dot = {
        x: center.x + r * Math.cos(eAngle),
        y: center.y + r * Math.sin(eAngle)
    };
    dot.r = this.DOT_RADIUS;

    ctx.beginPath();
    ctx.arc(dot.x, dot.y, this.r2, 0, 2 * Math.PI);
    ctx.fillStyle = this.cor2;
    ctx.fill();

     ctx.beginPath();
    ctx.arc(dot.x, dot.y, this.r1, 0, 2 * Math.PI);
    ctx.fillStyle = this.cor1;
    ctx.fill();
}

Waiter.prototype.render = function () {
    this.clearFrame();
    this.drawTimer();
    return Date.now();
}

Waiter.prototype.timerRun = function () {
    var self = this;
   // if (self.TIME_ELAPSED >= self.TIMER_DURATION) return false;
    if (!self.lastRender) self.lastRender = Date.now();
    var delta = Date.now() - self.lastRender;
    // Trick to throttle FPS
    if (delta > (1000 / self.MAXFPS)) {
        self.TIME_ELAPSED += delta;
        self.lastRender = self.render();
    }
    requestAnimationFrame(self.timerRun.bind(self));
}

var canvas = new Waiter();
canvas.timerRun();
