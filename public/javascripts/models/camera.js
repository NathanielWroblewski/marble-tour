import Vector from './vector.js'
import Vector4D from './vector4D.js'
import FourByFour from './four_by_four.js'

// Copyright (c) 2020 Nathaniel Wroblewski
// I am making my contributions/submissions to this project solely in my personal
// capacity and am not conveying any rights to any intellectual property of any
// third parties.

const NEAR_RANGE = 0.0
const FAR_RANGE = 1.0

class Camera {
  constructor ({ position, direction, up, width, height }) {
    this.position = position
    this.direction = direction
    this.up = up

    this.projection = FourByFour.identity()
    this.view = FourByFour.identity()
    this.combined = FourByFour.identity()
    this.invProjectionView = FourByFour.identity()

    this.near = 1
    this.far = 100

    this.ray = {
      origin: Vector.zeroes(),
      direction: Vector.zeroes()
    }

    this.width = width
    this.height = height
  }

  get viewport () {
    Vector.from([0, 0, this.width, this.height])
  }

  setViewport (width, height) {
    this.width = width
    this.height = height
  }

  translate (position) {
    this.position.add(position)
  }

  look (origin) {
    this.direction = origin.subtract(this.position).normalize()

    const right = this.direction.cross(this.up).normalize()

    this.up = right.cross(this.direction).normalize()
  }

  rotate (axis, radians) {
    this.direction.rotate(axis, radians)
    this.up.rotate(axis, radians)
  }

  rotateAround (point, axis, radians) {
    const diff = point.subtract(this.position)

    this.translate(diff)
    this.rotate(axis, radians)
    this.translate(diff.multiply(-1))
  }

  project (vector) {
    const out = Vector4D.from([...vector, 1])
    const inClipSpace = out.transform(this.combined)
    const ndc = Vector4D.from([ // normalized device coordinates
      inClipSpace.x / inClipSpace.w,
      inClipSpace.y / inClipSpace.w,
      inClipSpace.z / inClipSpace.w,
      inClipSpace.w
    ])

    return Vector4D.from([ // window coordinates
      this.width / 2 * ndc.x + (this.width / 2),
      this.height / 2 * ndc.y + (this.height / 2),
      (FAR_RANGE - NEAR_RANGE) / 2 * ndc.z + (FAR_RANGE + NEAR_RANGE) / 2,
      1 / ndc.w // 1 / clip.w
    ])
  }

  unproject (vector) {
    return vector.unproject(this.viewport, this.invProjectionView)
  }

  pickRay ([x, y]) {
    const direction = Vector.from([x, y, 1])
    this.ray.origin = Vector.from([x, y, 0])

    origin.unproject(this.viewport, this.invProjectionView)
    direction.unproject(this.viewport, this.invProjectionView)

    this.ray.direction = direction.subtract(origin).normalize()

    return this.ray
  }
}

export default Camera
