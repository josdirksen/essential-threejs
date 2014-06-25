var Maze = function (scene, cells, width, height) {

    this.scene = scene;
    this.elements = [];

    this.width = width;
    this.height = height;

    this.horizCells = cells;
    this.vertCells = cells;
    this.generator = new MazeGenerator(this.horizCells, this.vertCells);
    this.cellWidth = this.width / this.horizCells;
    this.cellHeight = this.height / this.vertCells;

    var self = this;

    return {
        width: function () {
            return self.width;
        },

        height: function () {
            return self.height;
        },

        generate: function () {
            self.generator.generate();
        },

        draw: function () {
            this.drawBorders();
            this.drawMaze();
        },

        solve: function () {
            self.generator.solve();
            this.drawSolution();
        },

        drawBorders: function () {
            this.drawLine(self.cellWidth, 0, self.width, 0);
            this.drawLine(self.width, 0, self.width, self.height);
            this.drawLine(self.width - self.cellWidth, self.height, 0, self.height);
            this.drawLine(0, self.height, 0, 0);
        },

        drawSolution: function () {
            var path = self.generator.path;

            for (var i = 0; i < path.length; i++) {
                (function () {
                    var cell = path[i];
                    var x = cell.x * self.cellWidth;
                    var y = cell.y * self.cellHeight;
                    setTimeout(function () {
                        self.ctx.fillRect(x, y, self.cellWidth, self.cellHeight);
                    }, 80 * i);
                })();
            }
        },

        drawMaze: function () {
            var graph = self.generator.graph;
            var drawnEdges = [];

            var edgeAlreadyDrawn = function (cell1, cell2) {
                return _.detect(drawnEdges, function (edge) {
                    return _.include(edge, cell1) && _.include(edge, cell2);
                }) != undefined;
            };

            for (var i = 0; i < graph.width; i++) {
                for (var j = 0; j < graph.height; j++) {
                    var cell = graph.cells[i][j];
                    var topCell = graph.getCellAt(cell.x, cell.y - 1);
                    var leftCell = graph.getCellAt(cell.x - 1, cell.y);
                    var rightCell = graph.getCellAt(cell.x + 1, cell.y);
                    var bottomCell = graph.getCellAt(cell.x, cell.y + 1);

                    if (!edgeAlreadyDrawn(cell, topCell) && graph.areConnected(cell, topCell)) {
                        var x1 = cell.x * self.cellWidth;
                        var y1 = cell.y * self.cellHeight;
                        var x2 = x1 + self.cellWidth;
                        var y2 = y1;

                        this.drawLine(x1, y1, x2, y2);
                        drawnEdges.push([cell, topCell]);
                    }

                    if (!edgeAlreadyDrawn(cell, leftCell) && graph.areConnected(cell, leftCell)) {
                        var x2 = x1;
                        var y2 = y1 + self.cellHeight;

                        this.drawLine(x1, y1, x2, y2);
                        drawnEdges.push([cell, leftCell]);
                    }

                    if (!edgeAlreadyDrawn(cell, rightCell) && graph.areConnected(cell, rightCell)) {
                        var x1 = (cell.x * self.cellWidth) + self.cellWidth;
                        var y1 = cell.y * self.cellHeight;
                        var x2 = x1;
                        var y2 = y1 + self.cellHeight;

                        this.drawLine(x1, y1, x2, y2);
                        drawnEdges.push([cell, rightCell]);
                    }

                    if (!edgeAlreadyDrawn(cell, bottomCell) && graph.areConnected(cell, bottomCell)) {
                        var x1 = cell.x * self.cellWidth;
                        var y1 = (cell.y * self.cellHeight) + self.cellHeight;
                        var x2 = x1 + self.cellWidth;
                        var y2 = y1;

                        this.drawLine(x1, y1, x2, y2);
                        drawnEdges.push([cell, bottomCell]);
                    }
                }
            }
        },

        getElements: function() {
            return self.elements;
        },

        drawLine: function (x1, y1, x2, y2) {
            var lengthX = Math.abs(x1 - x2);
            var lengthY = Math.abs(y1 - y2);

            // since only 90 degrees angles, so one of these is always 0
            // to add a certain thickness to the wall, set to 0.5
            if (lengthX === 0) lengthX = 0.5;
            if (lengthY === 0) lengthY = 0.5;

            // create a cube to represent the wall segment
            var wallGeom = new THREE.BoxGeometry(lengthX, 3, lengthY);
            var wallMaterial = new THREE.MeshPhongMaterial({color: 0xff0000, opacity: 0.8, transparent: true});


            // and create the complete wall segment
            var wallMesh = new THREE.Mesh(wallGeom, wallMaterial);

            // finally position it correctly
            wallMesh.position = new THREE.Vector3(x1 - ((x1 - x2) / 2) -(self.height/2), wallGeom.height/2, y1 - ((y1 - y2)) / 2 - (self.width /2));

            self.elements.push(wallMesh);
            scene.add(wallMesh);
        }
    };
};