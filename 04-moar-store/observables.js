/**
 * User defined Observable
 */
function Observable() {
  this.x = 0;
  this.observers = [];
}

Observable.prototype.add = function(observer) {
  this.observers.push(observer);
};

Observable.prototype.remove = function(observer) {
  // TODO
  this.observers.splice(observer, 1);
};

Observable.prototype.updateX = function(value) {
  this.oldX = this.x;
  this.x = value || 0;
  this.notify({ x: value, oldX: this.oldX, message: "X uploaded" });
};

Observable.prototype.notify = function(payload) {
  this.observers.forEach(observer => {
    observer.update(payload);
  });
};

const observer1 = {
  update: function(payload) {
    console.log("Observable 1 pushes...", payload);
  }
};

const observer2 = {
  update: function(payload) {
    console.log("Observable 2 pushes...", payload);
  }
};

const obs = new Observable();

obs.add(observer1);
obs.add(observer2);

obs.updateX(5);
obs.updateX(10);
obs.updateX(15);
