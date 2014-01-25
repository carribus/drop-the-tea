var levels = [
        {
            shapes: [
                {
                    type: 'c', // maze ball
                    velocity: {x: 0, y: 0},
                    flip: 100,
                    position: {x: 24, y: 12}
                },
                {
                    type: 'b', // maze bar right
                    velocity: {x: 0, y: 0},
                    flip: 100,
                    position: {x: 12, y: 12},
                    size: {w: 5, h: 1},
                    r: 10,
                    origin: {x: 2.5, y: 0.5}
                },
                {
                    type: 'b', // maze bar right
                    velocity: {x: 0, y: 0},
                    flip: 100,
                    position: {x: 26, y: 15},
                    size: {w: 5, h: 1},
                    r: -10,
                    origin: {x: 2.5, y: 0.5}
                },
                {     // thy CUP
                    type: 'cup', // bottom
                    velocity: {x: 0, y: 0},
                    flip: 0,
                    position: {x: 20, y: 29},
                    size: {w: 5, h: 2}
                },
                {
                    type: 'b', // cup walls top left
                    velocity: {x: 0, y: 0},
                    flip: 100,
                    position: {x: 14.72, y: 21.7},
                    size: {w: .28, h: .1},
                    r: 0,
                    origin: {x: 0, y: 0}
                },
                {
                    type: 'b', // cup walls top right
                    velocity: {x: 0, y: 0},
                    flip: 100,
                    position: {x: 21.7, y: 21.7},
                    size: {w: .28, h: .1},
                    r: 0,
                    origin: {x: 0, y: 0}
                },
                {
                    type: 'b', // cup walls left side
                    velocity: {x: 0, y: 0},
                    flip: 100,
                    position: {x: 14.62, y: 25.8},
                    size: {w: .17, h: 4},
                    r: 0,
                    origin: {x: 0, y: 0}
                },
                {
                    type: 'b', // cup walls right side
                    velocity: {x: 0, y: 0},
                    flip: 100,
                    position: {x: 21.8, y: 25.8},
                    size: {w: .17, h: 4},
                    r: 0,
                    origin: {x: 0, y: 0}
                },
                {
                    type: 'collectible',
                    velocity: {x: 0, y: 0},
                    flip: 0,
                    position: {x: 22, y: 13},
                    r: 45,
                    size: {w: 0.5, h: 0.5},
                    origin: {x: .25, h: .25},
                },
                {
                    type: 'collectible',
                    velocity: {x: 0, y: 0},
                    flip: 0,
                    position: {x: 24, y: 13},
                    r: 45,
                    size: {w: 0.5, h: 0.5},
                    origin: {x: .25, h: .25}
                },
                {
                    type: 'collectible',
                    velocity: {x: 0, y: 0},
                    flip: 0,
                    position: {x: 20, y: 13},
                    r: 45,
                    size: {w: 0.5, h: 0.5},
                    origin: {x: .25, h: .25}
                }

            ]
        }
    ];