import Vector from './vector.js'

// Copyright (c) 2020 Nathaniel Wroblewski
// I am making my contributions/submissions to this project solely in my personal
// capacity and am not conveying any rights to any intellectual property of any
// third parties.

class Quaternion {
  constructor (parameters) {
    this.parameters = parameters
  }

  get r () {
    return this.parameters[0]
  }

  get i () {
    return this.parameters[1]
  }

  get j () {
    return this.parameters[2]
  }

  get k () {
    return this.parameters[3]
  }

  get vector () {
    return Vector.from([this.i, this.j, this.k])
  }

  multiply (quaternion) {
    const [r, i, j, k] = this.parameters

    return new Quaternion(Vector.from([
      r * quaternion.r - i * quaternion.i - j * quaternion.j - k * quaternion.k,
      r * quaternion.i + i * quaternion.r - j * quaternion.k + k * quaternion.j,
      r * quaternion.j + i * quaternion.k + j * quaternion.r - k * quaternion.i,
      r * quaternion.k - i * quaternion.j + j * quaternion.i + k * quaternion.r
    ]))
  }

  invert () {
    const scale = this.parameters.magnitude
    const res = Vector.from([this.r, ...this.vector.multiply(-1)]).divide(scale)

    return new Quaternion(res)
  }

  static fromAxisAngle (axis, radians) {
    const [x, y, z] = axis
    const angle = radians * 0.5
    const sinθ = Math.sin(angle)

    return new Quaternion(Vector.from([
      x * sinθ,
      y * sinθ,
      z * sinθ,
      Math.cos(angle)
    ]))
  }
}

export default Quaternion
