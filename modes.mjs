
function SetupModes(state, dot, modes) {
  switch(state.mode){
    case modes[1]:
      if ( state.dots.length === 0 )
        state.dots.push(dot)
    case modes[2]:
      state.dots.push(dot)
      state.step += 1
      break
    case modes[0]:
      break
    default:
  }
}

export default {
  SetupModes
}