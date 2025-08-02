/** 
 * Renders the current state of the grid onto a given HTML canvas element.
 * 
 * Each cell in the `state` grid is drawn as a square using colors defined in `colorMap`,
 * Pixel size is determined by dividing the canvas width by the number of rows (i.e., `state.length`).
 * The grid `state` is assumed to be a square matrix (same number of rows and columns).
 * 
 * @param {number[][]} state A 2D array representing the current grid state.
 * @param {HTMLCanvasElement} canvasEl The canvas element where the grid will be rendered.
 * @param {Object<number, string>} colorMap - A mapping from cell values to color strings.
 */
function draw(state, canvasEl, colorMap){
    const context = canvasEl.getContext('2d')
    const axis = state.length
    const pixelSize = canvasEl.width/axis
    
    context.clearRect(0, 0, canvasEl.width, canvasEl.height); 

    for (let row = 0; row < axis; row++){
        for (let col = 0; col < axis; col++){
            context.fillStyle = colorMap[state[row][col]]
            context.fillRect(row * pixelSize, col * pixelSize, pixelSize, pixelSize);
        }
    }
}

/** Computes the next generation of the Game of Life grid based on Conway's rules.
 *
 *  A cell's next state depends on the number of live neighbors:
 * - A dead cell with exactly 3 live neighbors becomes alive.
 * - A live cell with 2 or 3 live neighbors stays alive.
 * - In all other cases, the cell becomes or remains dead.
 *
 * The grid is assumed to wrap around at the edges (toroidal behavior).
 * 
 * @param {number[][]} state A 2D array representing the current grid state.
 * @returns {[number, number[][]]} A tuple where the first element is the number of changed cells,
 * and the second is the new grid state.
 */
function gameOfLife(state){
    const newState = []
    const axis = state.length
    let changes = 0

    for (let row = 0; row < axis; row++){
        newState[row] = []
        for (let col=0; col < axis; col++){
            const value = state[row][col]
            const liveNeighbours = getLiveNeighboursCount(row, col, state)
            let newValue;
            if (liveNeighbours == 3){ // remain or come alive 
                newValue = 1
            } else if (value == 1 && liveNeighbours == 2){ //remain alive
                newValue = 1
            } else { // die or remain dead
                newValue = 0 
            }
            newState[row][col] = newValue
            if(newValue != value){
                changes++
            }
        }
    }
    return [changes,newState]
}

/**
 * Counts the number of live (non-zero) neighboring cells around a given cell in a 2D grid.
 * The grid is assumed to wrap around at the edges
 * @param {number} x The x-coordinate (row) of the target cell.
 * @param {number} y The y-coordinate (column) of the target cell.
 * @param {number[][]} state A 2D array representing the current grid state.
 * @returns {number} The number of live neighboring cells.
 */
function getLiveNeighboursCount(x,y,state){
    const axis = state.length
    const directions = [
        [-1,-1], [-1, 0],[-1 , 1],
        [0, -1],         [0, 1],
        [1, -1], [1, 0], [1, 1], 
    ]
    let alive = 0

    for (const [dx,dy] of directions){
        const wrappedX = (x + dx + axis) % axis
        const wrappedY = (y + dy + axis) % axis

        if (state[wrappedX][wrappedY] > 0){
            alive++
        }
    }

    return alive
}

/**
 * 
 * @param {number} axis The number of rows and columns in the grid.
 * @param {number} livePercentage A decimal between 0 and 1 representing the probability that a cell is alive (1).
 * @param {number} seedSize The size of the square seed to be placed in the center of the grid.
 * @returns {number[][]} A 2D array representing the grid with a centered seed.
 */
function generateSeed(axis, livePercentage, seedSize){
    if (seedSize > axis){
        console.warn("Error: seed size is larger than axis. Seed will be trimmed to fit.")
        seedSize = axis
    }
    const grid = []
    for (let i = 0; i < axis ; i++){
        grid[i] = Array(axis).fill(0)
    }

    const seed = generateNoise(seedSize, livePercentage)

    const offset = Math.floor( (axis - seedSize)/ 2)
    for (let row = 0; row < seedSize; row++){
        for (let col = 0; col < seedSize; col++){
            grid[row+offset][col+offset] = seed[row][col]
        }
    }

    return grid
}

/**
 * Generates a 2D grid or random binary values (0 or 1) based on a given probability.
 * 
 * @param {number} axis The number of rows and columns in the square grid.
 * @param {number} livePercentage A decimal between 0 and 1 representing the probability that a cell is alive (1).
 * @returns {number[][]} A 2D array representing the grid.
 */
function generateNoise(axis, livePercentage){
    const grid = []
    for (let row = 0; row < axis; row++){
        grid[row] = []
        for (let col = 0; col < axis; col++){
            grid[row][col] = Math.random() < livePercentage ? 1 : 0
        }
    }
    return grid
}