// game functions
function draw(state, canvasEl){
    const context = canvasEl.getContext('2d')
    const axis = state.length
    const pixelSize = canvasEl.width/axis
    
    context.clearRect(0, 0, canvasEl.width, canvasEl.height); 

    for (let row = 0; row < axis; row++){
        for (let col = 0; col < axis; col++){
            context.fillStyle = color_map[state[row][col]]
            context.fillRect(row * pixelSize, col * pixelSize, pixelSize, pixelSize);
        }
    }
}

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

function generateSeed(axis, livePercentage, seedSize){
    if (seedSize > axis){
        // raise error
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