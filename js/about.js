const squareSeed = generateSeed(20, 1, 5)

const colorMap = {
    0: 'transparent', // dead color
    1: '#403A3A', // alive color
}

document.addEventListener("DOMContentLoaded", ()=>{
    const squareCanva = document.getElementById("square-example")
    draw(squareSeed, squareCanva, colorMap)
    loopBackToBack(squareSeed, gameOfLife, squareCanva, 500)
})

function loopBackToBack(initialState, modifier, targetEl, interval){
    const initial = initialState
    let state = initial
    const looper = setInterval(()=>{
        const[changes, newState] = modifier(state)
        state = newState
        if (changes > 0){
            draw(state, targetEl, colorMap)
        } else {
            draw(initial, targetEl, colorMap)
            state = initial
        }
    }, interval)
}