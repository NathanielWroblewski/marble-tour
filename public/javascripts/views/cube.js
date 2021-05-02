import renderLine from './line.js'

// Copyright (c) 2020 Nathaniel Wroblewski
// I am making my contributions/submissions to this project solely in my personal
// capacity and am not conveying any rights to any intellectual property of any
// third parties.

const CUBE_LINES = [
  [0, 1],
  [1, 3],
  [3, 2],
  [2, 0],
  [2, 6],
  [3, 7],
  [0, 4],
  [1, 5],
  [6, 7],
  [6, 4],
  [7, 5],
  [4, 5]
]

const CUBE_FACES = [
  [0, 1, 3, 2], // back left
  [1, 3, 7, 5], // back right
  [2, 6, 4, 0], // front left
  [6, 7, 5, 4], // front right
  [3, 2, 6, 7], // top
  [0, 1, 5, 4], // bottom
]

const render = (context, vertices, stroke, fill) => {
  CUBE_FACES.forEach(face => {
    context.beginPath()

    face.forEach((vertexIndex, index) => {
      index === 0 ?
        context.moveTo(...vertices[vertexIndex]) :
        context.lineTo(...vertices[vertexIndex])
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
  })

  // uncomment to render just the edges, no faces
  // context.beginPath()
  // CUBE_LINES.forEach(([from, to], index) => {
  //   context.moveTo(...vertices[from])
  //   context.lineTo(...vertices[to])
  // })
  // context.closePath()
  // context.stroke()
  // context.fill()
}

export default render
