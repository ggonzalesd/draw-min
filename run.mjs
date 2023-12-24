import { dotDistance, ctxLoadStyle, resetState } from './utils.mjs';

import mdModes from './modes.mjs'

(()=>{

  const canvas = document.getElementById('canvas')
  const body = document.getElementById('body')

  const cfgColor = document.getElementById('cfg-color')
  const cfgWidth = document.getElementById('cfg-width')
  const cfgAlpha = document.getElementById('cfg-alpha')

  const btnMdDraw = document.getElementById('mode-draw')
  const btnMdBezier = document.getElementById('mode-bezier')

  const cfgInput = {
    color: cfgColor, width: cfgWidth, alpha: cfgAlpha
  }
  const loadCofig = () => {
    return { color: cfgColor.value, width: cfgWidth.value, alpha: cfgAlpha.value }
  }

  canvas.width = body.clientWidth
  canvas.height = body.clientHeight

  window.addEventListener('resize', (e) => {
    canvas.width = body.clientWidth
    canvas.height = body.clientHeight
    console.log(canvas)
  })

  const modes = ['select', 'draw', 'curve']

  const state = {
    'mode': '',
    'present': false,
    'dots': [],
    'compose': [],
    'step': 0,
    'cursor': {
      'x': 0,
      'y': 0
    }
  }

  btnMdDraw.addEventListener('click', () => resetState(state, modes[1]))
  btnMdBezier.addEventListener('click', () => resetState(state, modes[2]))

  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  addEventListener('mousedown', (e) => {
    const dot = [e.clientX, e.clientY]
    if(canvas !== e.target)
      return
    mdModes.SetupModes(state, dot, modes)
  })

  addEventListener('mousemove', (e) => {
    state.cursor.x = e.clientX
    state.cursor.y = e.clientY
    const dot = [e.clientX, e.clientY]

    switch(state.mode) {
      case modes[1]:
        if (state.dots.length > 0 && dotDistance(dot, state.dots[state.dots.length-1]) > 1)
          state.dots.push(dot)
        break
      case modes[2]:
        break
      case modes[0]:
        break
      default:
    }
  })

  addEventListener('mouseup', (e) => {
    const dot = [e.clientX, e.clientY]
    
    switch(state.mode) {
      case modes[1]:
        state.dots.push(dot)
        state.compose.push({
          type: modes[1],
          dots: state.dots,
          ...loadCofig()
        })
        state.dots = []
        state.step = 0
        break
      case modes[2]:
        if (state.step >= 3) {
          state.compose.push({
            type: modes[2],
            dots: state.dots,
            ...loadCofig()
          })
          state.dots = []
          state.step = 0
        }
        break
      default:
    }
  })

  ctx.lineJoin = 'round'
  ctx.lineCap = 'round'

  function fnAnimate() {
    ctx.fillStyle = '#2c2c2c'
    ctx.globalAlpha = 1.0;
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    requestAnimationFrame(fnAnimate)

    state.compose.forEach(m => {
      switch(m.type) {
        case modes[1]:
          if(m.dots.length > 0) {
            ctx.beginPath()
            const [x1, y1] = m.dots[0]
            ctx.moveTo(x1, y1);
            for (let index = 1; index < m.dots.length; index++) {
              const [xc, yc] = m.dots[index];
              ctx.lineTo(xc, yc);
            }
            ctxLoadStyle(ctx, m)
            ctx.stroke();
            ctx.closePath()
          }
          break
        case modes[2]:
          if(m.dots.length >= 3) {
            ctx.beginPath()
            const [x1, y1] = m.dots[0]
            const [x2, y2] = m.dots[1]
            const [x3, y3] = m.dots[2]
            ctx.moveTo(x1, y1);
            ctx.bezierCurveTo(x1, y1, x2, y2, x3, y3)
            ctxLoadStyle(ctx, m)
            ctx.stroke();
            ctx.closePath();
          }
        default:
      }
    })

    switch(state.mode) {
      case modes[1]:
        if(state.dots.length > 0) {
          ctx.beginPath();
          const [x1, y1] = state.dots[0]
          ctx.moveTo(x1, y1);
          for (let index = 1; index < state.dots.length; index++) {
            const [xc, yc] = state.dots[index];
            ctx.lineTo(xc, yc);
          }
          ctxLoadStyle(ctx, cfgInput)
          ctx.stroke();
          ctx.closePath();
        }
        break
      case modes[2]:
        ctx.beginPath();  
        if (state.dots.length === 1) {
          const [x1, y1] = state.dots[0]
          ctx.moveTo(x1, y1);
          ctx.lineTo(state.cursor.x, state.cursor.y);
        } else if ( state.dots.length === 2 ) {
          const [x1, y1] = state.dots[0]
          const [x2, y2] = state.dots[1]
          ctx.moveTo(x1, y1);
          ctx.bezierCurveTo(x1, y1, x2, y2, state.cursor.x, state.cursor.y)
        }
        ctxLoadStyle(ctx, cfgInput)
        ctx.stroke();
        ctx.closePath();
        break
      default:
    }

    ctx.beginPath()
    ctx.arc(state.cursor.x, state.cursor.y, cfgWidth.value/2, 0, 2 * Math.PI);
    ctx.fillStyle = cfgColor.value
    ctx.fill();
    ctx.closePath()

  }
  fnAnimate()

})()