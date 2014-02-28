var Cell = function(x, y) {
  this.x = x;
  this.y = y;
  this.visited = false;

  // When solving the maze, this represents
  // the previous node in the navigated path.
  this.parent = null;

  this.heuristic = 0;

  this.visit = function () {
    this.visited = true;
  };

  this.score = function () {
  	var total = 0;
  	var p = this.parent;
  	
  	while(p) {
  		++total;
  		p = p.parent;
  	}
  	return total;
  };

  this.pathToOrigin = function () {
  	var path = [this];
  	var p = this.parent;
  	
  	while(p) {
  		path.push(p);
  		p = p.parent;
  	}
  	path.reverse();
  	
  	return path;
  };
};