function Waiter(elem){
  this.base = elem;
  this.gc = this.base.getContext("2d");

  this.center={
    x: this.base.width/2,
    y: this.base.height/2,
  };
}

Waiter.prototype.base = null;
//contexto
Waiter.prototype.gc = null;

//angle
Waiter.prototype.sAngle = 0;
Waiter.prototype.eAngle = 0.5;
Waiter.prototype.alpha = 0;
Waiter.prototype.center = null;
Waiter.prototype.length = undefined;

Waiter.prototype.play= function(){
  this.gc.clearRect(0,0,this.base.width,this.base.height);
  this.sAngle += 0.008;
  this.eAngle += 0.008;
  this.gc.beginPath();
  this.gc.arc(this.center.x, this.center.y,20,(this.sAngle*Math.PI),(this.eAngle*Math.PI));
  this.gc.lineWidth = 5;
  this.gc.strokeStyle = '#f07057';
  this.gc.stroke();
  requestAnimationFrame(this.play.bind(this));
}

//can = new Waiter(document.getElementById("mAnim"));
//can.play();
