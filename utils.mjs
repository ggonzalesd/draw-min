export function dotDistance(dot1, dot2) {
  return Math.hypot(dot1[0]-dot2[0], dot1[1]-dot2[1])
}

export function ctxLoadStyle(ctx, inputs) {
  const { color, width, alpha } = inputs
  ctx.lineWidth = width.value ?? width
  ctx.strokeStyle = color.value ?? color
  ctx.globalAlpha = alpha.value ?? alpha
  return ctx
}

export function resetState(state, mode='') {
  state['mode'] = mode
  state['present'] = false
  state['dots'] = []
  state['step'] = 0
}