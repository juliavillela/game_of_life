const squareSeed = generateSeed(20, 1, 5)

const color_map = {
    0: 'transparent', // dead color
    1: '#403A3A', // alive color
}

document.addEventListener("DOMContentLoaded", ()=>{
    const squareCanva = document.getElementById("square-example")
    draw(squareSeed, squareCanva)
    loopBackToBack(squareSeed, gameOfLife, squareCanva, 500)
})

function loopBackToBack(initialState, modifier, targetEl, interval){
    const initial = initialState
    let state = initial
    const looper = setInterval(()=>{
        const[changes, newState] = modifier(state)
        state = newState
        if (changes > 0){
            draw(state, targetEl)
        } else {
            draw(initial, targetEl)
            state = initial
        }
    }, interval)
}