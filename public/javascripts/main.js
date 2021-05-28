import Vector from './models/vector.js'
import FourByFour from './models/four_by_four.js'
import Camera from './models/orthographic.js'
import angles from './isomorphisms/angles.js'
import coordinates from './isomorphisms/coordinates.js'
import renderCircle from './views/circle.js'
import renderCube from './views/cube.js'
import renderLine from './views/line.js'
import renderPolygon from './views/polygon.js'
import { seed, noise } from './utilities/noise.js'
import { stableSort, remap, grid, cube, clamp } from './utilities/index.js'
import { COLORS, EDGE_COLOR, TOP_COLOR, SPHERE_COLOR, SPHERE_OUTLINE } from './constants/colors.js'
import {
  ZOOM, SPHERE_TOUR_RESOLUTION, SPHERE_TOUR_RADIUS, Δt, Z_TOP, MIN_DISTANCE,
  BUFFER, WAVE_RESOLUTION, MAX_DISTANCE, FPS
} from './constants/dimensions.js'

// Copyright (c) 2020 Nathaniel Wroblewski
// I am making my contributions/submissions to this project solely in my personal
// capacity and am not conveying any rights to any intellectual property of any
// third parties.

seed(Math.random())

const canvas = document.querySelector('.canvas')
const context = canvas.getContext('2d')
const { sin, cos } = Math

const perspective = FourByFour
  .identity()
  .rotX(angles.toRadians(-60))
  .rotZ(angles.toRadians(30))

const camera = new Camera({
  position: Vector.zeroes(),
  direction: Vector.zeroes(),
  up: Vector.from([0, 1, 0]),
  width: canvas.width,
  height: canvas.height,
  zoom: ZOOM
})

const from = Vector.from([-10, -10])
const to = Vector.from([10, 10])
const by = Vector.from([1, 1])
const gridWidth = ((to.x - from.x + 1) / by.x)
const xyRange = [-100, 100]

let t = 0 // time

const gridPoints = grid({ from, to, by }, ([y, x]) => {
  const Δx = Math.abs(noise(x, y, t))

  return Vector.from([x + Δx, y, 0])
})

const points = stableSort(gridPoints, (a, b) => {
  if (a.y > b.y) return -1
  if (a.y < b.y) return 1
  if (a.x > b.x) return -1
  if (a.x < b.x) return 1
  if (a.z < b.z) return -1
  if (a.z > b.z) return 1
  return 0
})

const faces = []

for (let i = 0; i < points.length - gridWidth; i += 1) {
  if (i % 20 !== 19) {
    faces.push([i, i + 1, i + gridWidth, i])
    faces.push([i, i + gridWidth - 1, i + gridWidth, i])
  }
}

let sphere = Vector.from([0, 0, Z_TOP + 1])

const rcircle = Vector.from(
  camera.project(sphere.subtract(Vector.from([0, 0, 1])).transform(perspective))
).subtract(
  Vector.from(camera.project(sphere.transform(perspective)))
).y

const sphereBoundsX = [from.x + BUFFER, to.x - BUFFER]
const sphereBoundsY = [from.y + BUFFER, to.y - BUFFER]

const render = () => {
  context.clearRect(0, 0, canvas.width, canvas.height)

  // update sphere
  const ΔR = noise(sphere.x * SPHERE_TOUR_RESOLUTION, sphere.y * SPHERE_TOUR_RESOLUTION, t) * 8
  const cartesian = coordinates.toCartesian(Vector.from([SPHERE_TOUR_RADIUS + ΔR, 90, t]))

  sphere = Vector.from([
    clamp(cartesian.x, sphereBoundsX),
    clamp(cartesian.y, sphereBoundsY),
    sphere.z
  ])

  // render faces
  faces.forEach((face, index) => {
    const point = points[face[1]]
    const distance = point.subtract(sphere).magnitude
    const zdistance = remap(distance, [0, MAX_DISTANCE], [0, Z_TOP])
    const scale = distance < MIN_DISTANCE ? remap(distance, [0, MIN_DISTANCE], [0, 1]) ** 4 : 1
    const wave = noise(point.x * WAVE_RESOLUTION, point.y * WAVE_RESOLUTION, t)

    const bottom = face.map(index => (
      camera.project(points[index].transform(perspective))
    ))

    const top = face.map((faceIndex, faceNum) => {
      let Δx, Δy, Δz

      if (faceNum === 0 || faceNum === 3) {
        Δx = (points[face[1]].x - points[face[0]].x + wave) * scale
      } else if (faceNum === 2) {
        Δx = (points[face[1]].x - points[face[2]].x + wave) * scale
      } else {
        Δx = wave * scale
      }

      if (index % 2 === 0) {
        Δy = (faceNum === 2 ? 1 : 0) * scale
      } else {
        Δy = (faceNum === 0 || faceNum === 3 ? -1 : 0) * scale
      }

      Δz = Z_TOP - clamp(zdistance * 2, [0, Z_TOP])

      return camera.project(points[faceIndex].add(Vector.from([Δx, Δy, Δz])).transform(perspective))
    })

    const side1 = [bottom[0], top[0], top[1], bottom[1]]
    const side2 = [bottom[1], top[1], top[2], bottom[2]]
    const side3 = [bottom[2], top[2], top[0], bottom[0]]

    const colorIndex = Math.floor(remap(point.x * point.y, xyRange, [0, COLORS.length]))
    const color = COLORS[colorIndex]

    renderPolygon(context, bottom, EDGE_COLOR, color)
    renderPolygon(context, side1, EDGE_COLOR, color)
    renderPolygon(context, side3, EDGE_COLOR, color)
    renderPolygon(context, side2, EDGE_COLOR, color)
    renderPolygon(context, top, color, TOP_COLOR)
  })

  // render sphere
  renderCircle(context, camera.project(sphere.transform(perspective)), rcircle, SPHERE_OUTLINE, SPHERE_COLOR)

  t += Δt
}

let prevTick = 0

const step = () => {
  window.requestAnimationFrame(step)

  const now = Math.round(FPS * Date.now() / 1000)
  if (now === prevTick) return
  prevTick = now

  render()
}

step()
