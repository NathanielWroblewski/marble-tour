// Copyright (c) 2020 Nathaniel Wroblewski
// I am making my contributions/submissions to this project solely in my personal
// capacity and am not conveying any rights to any intellectual property of any
// third parties.

const render = (context, polygon, stroke, fill) => {
  context.beginPath()

  polygon.forEach((vertex, index) => {
    index === 0 ?
      context.moveTo(...vertex) :
      context.lineTo(...vertex)
  })

  context.closePath()

  if (stroke) {
    context.strokeStyle = stroke
    context.stroke()
  }

  if (fill) {
    context.fillStyle = fill
    context.fill()
  }
}

export default render
