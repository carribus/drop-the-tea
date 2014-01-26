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
                    type: 'b', // maze bar left
                    velocity: {x: 0, y: 0},
                    flip: 100,
                    position: {x: 12, y: 12},
                    size: {w: 5, h: 1},
                    r: 10,
                    origin: {x: 2.5, y: 0.5}
                },
                {     // thy CUP
                    type: 'cup', // bottom
                    velocity: {x: 0, y: 0},
                    flip: 0,
                    position: {x: 30, y: 29},
                    size: {w: 5, h: 2}
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