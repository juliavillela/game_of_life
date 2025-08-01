const color_map = {
    0: '#26e132ff', // dead color
    1: '#403A3A', // alive color
}

let running = false

const gridAxis = 80 // size of square grid
const interval = 200 // the samaller this number the faster the animation goes

let initialLiveRatio = 0.2 // how dense the intial grid should be (between 0 and 1)
let seedSize = 20 // size of initial seed
let currentState = null
let generationCount = 1

document.addEventListener("DOMContentLoaded", () => {
    // add event listeners and set initial value to rage inputs
    const seedSizeRange = document.getElementById("seed-size-range")
    seedSizeRange.addEventListener("input", (e)=>{handleSeedSizeChange(e)})
    seedSizeRange.value = seedSize

    const liveRatioRange = document.getElementById("live-ratio-range")
    liveRatioRange.addEventListener("input", (e)=>{handleLiveRatioChange(e)})
    liveRatioRange.value = initialLiveRatio

    // Fill canvas element with a generated seed
    const canvas = document.getElementById("pixelCanvas")
    const initial = generateSeed(gridAxis, initialLiveRatio, seedSize)
    currentState = initial
    draw(currentState, canvas)
})

// event handlers
function handleSeedClick(){
    running = false
    generationCount = 1
    updateGenerationCount()
    currentState = generateSeed(gridAxis, initialLiveRatio, seedSize)
    const canvas = document.getElementById("pixelCanvas")
    draw(currentState, canvas)
}

function handleStartClick(){
    running = true
    if (!currentState){
        currentState = generateSeed(gridAxis, initialLiveRatio, initialLiveRatio)
    }
    const canvas = document.getElementById("pixelCanvas")
    loop(currentState, gameOfLife, canvas, interval)
}

function handleStopClick(){
    running = false
}

function handleSeedSizeChange(e){
    seedSize = e.target.value
}

function handleLiveRatioChange(e){
    initialLiveRatio = e.target.value
}

// helpers
function updateGenerationCount(){
    const counter = document.getElementById("generation-count")
    counter.innerHTML = generationCount
}

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

function loop(initialState, modifier, targetEl, interval){
    console.log("starting loop", initialState)
    let state = initialState
    const looper = setInterval(()=>{
        if (running){
            generationCount++
            const[changes, newState] = modifier(state)
            state = newState
            if (changes > 0){
                draw(state, targetEl)
                updateGenerationCount()
                currentState = state
            } else {
                running = false
            }
        } else {
            clearInterval(looper);
        }

    }, interval)
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
    console.log(changes)
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