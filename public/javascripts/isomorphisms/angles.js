// Copyright (c) 2020 Nathaniel Wroblewski
// I am making my contributions/submissions to this project solely in my personal
// capacity and am not conveying any rights to any intellectual property of any
// third parties.

const TO_RAD = Math.PI / 180
const TO_DEG = 180 / Math.PI

const angles = {
  toRadians (degrees) {
    return degrees * TO_RAD
  },

  toDegrees (radians) {
    return radians * TO_DEG
  }
}

export default angles
