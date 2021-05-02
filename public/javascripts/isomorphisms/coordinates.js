import Vector from '../models/vector.js'

// Copyright (c) 2020 Nathaniel Wroblewski
// I am making my contributions/submissions to this project solely in my personal
// capacity and am not conveying any rights to any intellectual property of any
// third parties.

const coordinates = {
  toCartesian ([r, θ, φ]) {
    const sinθ = Math.sin(θ)
    const rsinθ = r * sinθ

    return Vector.from([
      Math.cos(φ) * rsinθ,
      Math.sin(φ) * rsinθ,
      r * Math.cos(θ),
    ])
  },

  toSpherical (cartesian) {
    const r = Math.sqrt(cartesian.magnitude)

    return Vector.from([
      r,
      Math.acos(cartesian.z / r),
      Math.atan(cartesian.y / z)
    ])
  }
}

export default coordinates
