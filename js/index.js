const colorMap = {
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
    draw(currentState, canvas, colorMap)
})

// event handlers
function handleSeedClick(){
    running = false
    generationCount = 1
    updateGenerationCount()
    currentState = generateSeed(gridAxis, initialLiveRatio, seedSize)
    const canvas = document.getElementById("pixelCanvas")
    draw(currentState, canvas, colorMap)
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

// game loop

/**
 * Runs an animation loop that repeatedly updates and renders the state of the grid.
 * 
 * Stops if an iteration produces no changes in state.
 * Assumes the presence of predefined external global variables:
 * `running` (bool), `generationCount`(number), `currentState`(2D array), `colorMap`(Object)
 * 
 * @param {number[][]} initialState The initial grid state to start the loop from.
 * @param {function} modifier A function that computes the next state and number of changes.
 * @param {HTMLCanvasElement} targetEl The canvas element where the grid is drawn.
 * @param {number} interval  Time in milliseconds between each update.
 */
function loop(initialState, modifier, targetEl, interval){
    let state = initialState
    const looper = setInterval(()=>{
        if (running){
            generationCount++
            const[changes, newState] = modifier(state)
            state = newState
            if (changes > 0){
                draw(state, targetEl, colorMap)
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