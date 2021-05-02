import Vector4D from './quaternion.js'
import Quaternion from './quaternion.js'
import FourByFour from './four_by_four.js'
import numberSystems from '../isomorphisms/number_systems.js'

// Copyright (c) 2020 Nathaniel Wroblewski
// I am making my contributions/submissions to this project solely in my personal
// capacity and am not conveying any rights to any intellectual property of any
// third parties.

class Vector extends Array {
  get x () {
    return this[0]
  }

  get y () {
    return this[1]
  }

  get z () {
    return this[2]
  }

  get r () {
    return this[0]
  }

  get θ () {
    return this[1]
  }

  get φ () {
    return this[2]
  }

  get magnitude () {
    return this.reduce((memo, element) => memo += element * element, 0)
  }

  normalize () {
    return this.divide(this.magnitude)
  }

  multiply (scalar) {
    return this.map(element => element * scalar)
  }

  divide (scalar) {
    return this.multiply(1 / (scalar || 1))
  }

  dot (vector) {
    return this.reduce((memo, element, index) => element * vector[index], 0)
  }

  cross (vector) {
    return Vector.from([
      this.y * vector.z - this.z * vector.y,
      this.z * vector.x - this.x * vector.z,
      this.x * vector.y - this.y * vector.x
    ])
  }

  add (value) {
    if (typeof(value) === 'number') {
      return this.map(element => element + value)
    } else if (value instanceof Vector) {
      return this.map((element, index) => element + value[index])
    } else {
      throw "Argument to Vector#add must be scalar or vector"
    }
  }

  subtract (value) {
    if (typeof(value) === 'number') {
      return this.add(-value)
    } else if (value instanceof Vector) {
      return this.map((element, index) => element - value[index])
    } else {
      throw "Argument to Vector#subtract must be scalar or vector"
    }
  }

  static zeroes () {
    return this.from([0, 0, 0])
  }

  /**
   * Rotates a vector in place by axis angle.
   *
   * This is the same as transforming a point by an
   * axis-angle quaternion, but it has higher precision.
   */
  rotate (axis, radians) {
    const quaternion = Quaternion.fromAxisAngle(axis, radians)
    const rotationMatrix = FourByFour.fromRotationTranslation(
      quaternion,
      Vector.zeroes()
    )

    return this.transform(rotationMatrix)
  }

  // this doesn't work
  rotateAround (point, axis, radians) {
    return this.subtract(point).rotate(axis, radians).add(point)
  }

  // 4x4 Matrix multiplication
  transform (matrix) {
    const { x, y, z } = this

    return Vector.from([
      matrix[0] * x + matrix[4] * y + matrix[8] * z + matrix[12],
      matrix[1] * x + matrix[5] * y + matrix[9] * z + matrix[13],
      matrix[2] * x + matrix[6] * y + matrix[10] * z + matrix[14]
    ])
  }

  // Multiplies by the specified matrix applying a w divide.
  project (matrix) {
    const a00 = matrix[0]
    const a01 = matrix[1]
    const a02 = matrix[2]
    const a03 = matrix[3]
    const a10 = matrix[4]
    const a11 = matrix[5]
    const a12 = matrix[6]
    const a13 = matrix[7]
    const a20 = matrix[8]
    const a21 = matrix[9]
    const a22 = matrix[10]
    const a23 = matrix[11]
    const a30 = matrix[12]
    const a31 = matrix[13]
    const a32 = matrix[14]
    const a33 = matrix[15]

    const lw = 1 / (this.x * a03 + this.y * a13 + this.z * a23 + a33)

    return Vector.from([
      (this.x * a00 + this.y * a10 + this.z * a20 + a30) * lw,
      (this.x * a01 + this.y * a11 + this.z * a21 + a31) * lw,
      (this.x * a02 + this.y * a12 + this.z * a22 + a32) * lw
    ])
  }

  // Unproject this point from 2D screen space to 3D space. Vector's z should
  // be at the near plane (0) or far plane (1).  The provided matrix is assumed
  // to be combined, i.e. projection * view * model.
  unproject ([viewX, viewY, width, height], invProjectionView) {
    const vector = Vector.from([
      2 * (this.x - viewX) / width - 1,
      2 * (height - y - 1 - viewY) / height - 1,
      2 * this.z - 1
    ])

    return vector.project(invProjectionView)
  }
}

export default Vector
