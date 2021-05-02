const EPSILON = 0.000001

// Copyright (c) 2020 Nathaniel Wroblewski
// I am making my contributions/submissions to this project solely in my personal
// capacity and am not conveying any rights to any intellectual property of any
// third parties.

class FourByFour extends Float32Array {
  invert () {
    const a00 = this[0]
    const a01 = this[1]
    const a02 = this[2]
    const a03 = this[3]
    const a10 = this[4]
    const a11 = this[5]
    const a12 = this[6]
    const a13 = this[7]
    const a20 = this[8]
    const a21 = this[9]
    const a22 = this[10]
    const a23 = this[11]
    const a30 = this[12]
    const a31 = this[13]
    const a32 = this[14]
    const a33 = this[15]

    const b00 = a00 * a11 - a01 * a10
    const b01 = a00 * a12 - a02 * a10
    const b02 = a00 * a13 - a03 * a10
    const b03 = a01 * a12 - a02 * a11
    const b04 = a01 * a13 - a03 * a11
    const b05 = a02 * a13 - a03 * a12
    const b06 = a20 * a31 - a21 * a30
    const b07 = a20 * a32 - a22 * a30
    const b08 = a20 * a33 - a23 * a30
    const b09 = a21 * a32 - a22 * a31
    const b10 = a21 * a33 - a23 * a31
    const b11 = a22 * a33 - a23 * a32

    const determinant = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06

    if (!determinant) return null

    const det = 1.0 / determinant

    return new FourByFour([
      (a11 * b11 - a12 * b10 + a13 * b09) * det,
      (a02 * b10 - a01 * b11 - a03 * b09) * det,
      (a31 * b05 - a32 * b04 + a33 * b03) * det,
      (a22 * b04 - a21 * b05 - a23 * b03) * det,

      (a12 * b08 - a10 * b11 - a13 * b07) * det,
      (a00 * b11 - a02 * b08 + a03 * b07) * det,
      (a32 * b02 - a30 * b05 - a33 * b01) * det,
      (a20 * b05 - a22 * b02 + a23 * b01) * det,

      (a10 * b10 - a11 * b08 + a13 * b06) * det,
      (a01 * b08 - a00 * b10 - a03 * b06) * det,
      (a30 * b04 - a31 * b02 + a33 * b00) * det,
      (a21 * b02 - a20 * b04 - a23 * b00) * det,

      (a11 * b07 - a10 * b09 - a12 * b06) * det,
      (a00 * b09 - a01 * b07 + a02 * b06) * det,
      (a31 * b01 - a30 * b03 - a32 * b00) * det,
      (a20 * b03 - a21 * b01 + a22 * b00) * det
    ])
  }

  multiply (fourByFour) {
    const a00 = this[0]
    const a01 = this[1]
    const a02 = this[2]
    const a03 = this[3]
    const a10 = this[4]
    const a11 = this[5]
    const a12 = this[6]
    const a13 = this[7]
    const a20 = this[8]
    const a21 = this[9]
    const a22 = this[10]
    const a23 = this[11]
    const a30 = this[12]
    const a31 = this[13]
    const a32 = this[14]
    const a33 = this[15]

    const b00 = fourByFour[0]
    const b01 = fourByFour[1]
    const b02 = fourByFour[2]
    const b03 = fourByFour[3]
    const b10 = fourByFour[4]
    const b11 = fourByFour[5]
    const b12 = fourByFour[6]
    const b13 = fourByFour[7]
    const b20 = fourByFour[8]
    const b21 = fourByFour[9]
    const b22 = fourByFour[10]
    const b23 = fourByFour[11]
    const b30 = fourByFour[12]
    const b31 = fourByFour[13]
    const b32 = fourByFour[14]
    const b33 = fourByFour[15]

    return new FourByFour([
      b00*a00 + b01*a10 + b02*a20 + b03*a30,
      b00*a01 + b01*a11 + b02*a21 + b03*a31,
      b00*a02 + b01*a12 + b02*a22 + b03*a32,
      b00*a03 + b01*a13 + b02*a23 + b03*a33,

      b10*a00 + b11*a10 + b12*a20 + b13*a30,
      b10*a01 + b11*a11 + b12*a21 + b13*a31,
      b10*a02 + b11*a12 + b12*a22 + b13*a32,
      b10*a03 + b11*a13 + b12*a23 + b13*a33,

      b20*a00 + b21*a10 + b22*a20 + b23*a30,
      b20*a01 + b21*a11 + b22*a21 + b23*a31,
      b20*a02 + b21*a12 + b22*a22 + b23*a32,
      b20*a03 + b21*a13 + b22*a23 + b23*a33,

      b30*a00 + b31*a10 + b32*a20 + b33*a30,
      b30*a01 + b31*a11 + b32*a21 + b33*a31,
      b30*a02 + b31*a12 + b32*a22 + b33*a32,
      b30*a03 + b31*a13 + b32*a23 + b33*a33
    ])
  }


  // Generates an orthogonal projection matrix with the given bounds
  static ortho ({ left, right, top, bottom, near, far }) {
    let lr = left - right
    let bt = bottom - top
    let nf = near - far

    // avoid division by zero
    lr = lr === 0 ? lr : 1 / lr
    bt = bt === 0 ? bt : 1 / bt
    nf = nf === 0 ? nf : 1 / nf

    return new FourByFour([
      -2 * lr,               0,                     0,                   0,
      0,                     -2 * bt,               0,                   0,
      0,                     0,                     2 * nf,              0,
      (left + right) * lr,   (top + bottom) * bt,   (far + near) * nf,   1
    ])
  }

  static perspective ({ fov, aspect, near, far }) {
    const f = 1.0 / Math.tan(fov / 2)
    const nf = 1 / (near - far)

    return new FourByFour([
      f / aspect,   0,   0,                     0,
      0,            f,   0,                     0,
      0,            0,   (far + near) * nf,     -1,
      0,            0,   2 * far * near * nf,   0
    ])
  }

  static fromRotationTranslation (quaternion, [x, y, z]) {
    const [r, i, j, k] = quaternion.parameters
    const r2 = r + r
    const i2 = i + i
    const j2 = j + j
    const rr = r * r2
    const ri = r * i2
    const rj = r * j2
    const ii = i * i2
    const ij = i * j2
    const jj = j * j2
    const kr = k * r2
    const ki = k * i2
    const kj = k * j2

    return new FourByFour([
      1 - (ii + jj),   ri + kj,         rj - ki,         0,
      ri - kj,         1 - (rr + jj),   ij + kr,         0,
      rj + ki,         ij - kr,         1 - (rr + ii),   0,
      x,               y,               z,               1
    ])
  }

  static identity () {
    return new FourByFour([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ])
  }

  static lookAt ({ position, direction, up }) {
    const [eyex, eyey, eyez] = position
    const [upx, upy, upz] = up
    const [centerx, centery, centerz] = direction

    if (Math.abs(eyex - centerx) < EPSILON &&
        Math.abs(eyey - centery) < EPSILON &&
        Math.abs(eyez - centerz) < EPSILON) {
      return FourByFour.identity()
    }

    const diff = position.subtract(direction)
    let len = diff.normalize()
    const [z0, z1, z2] = diff.multiply(len)

    const xs = Vector.from([
      upy * z2 - upz * z1,
      upz * z0 - upx * z2,
      upx * z1 - upy * z0
    ])

    len = xs.magnitude
    const [x0, x1, x2] = !len ? Vector.zeroes() : xs.multiply(1 / len)

    const ys = Vector.from([
      z1 * x2 - z2 * x1,
      z2 * x0 - z0 * x2,
      z0 * x1 - z1 * x0
    ])

    len = ys.magnitude
    const [y0, y1, y2] = !len ? Vector.zeroes() : ys.multiply(1 / len)

    return new FourByFour([
      x0, y0, z0, 0,
      x1, y1, z1, 0,
      x2, y2, z2, 0,

      -(x0 * eyex + x1 * eyey + x2 * eyez),
      -(y0 * eyex + y1 * eyey + y2 * eyez),
      -(z0 * eyex + z1 * eyey + z2 * eyez),
      1
    ])
  }

  rotX (radians) {
    const sinθ = Math.sin(radians)
    const cosθ = Math.cos(radians)
    const a10 = this[4]
    const a11 = this[5]
    const a12 = this[6]
    const a13 = this[7]
    const a20 = this[8]
    const a21 = this[9]
    const a22 = this[10]
    const a23 = this[11]

    this[4] = a10 * cosθ + a20 * sinθ
    this[5] = a11 * cosθ + a21 * sinθ
    this[6] = a12 * cosθ + a22 * sinθ
    this[7] = a13 * cosθ + a23 * sinθ
    this[8] = a20 * cosθ - a10 * sinθ
    this[9] = a21 * cosθ - a11 * sinθ
    this[10] = a22 * cosθ - a12 * sinθ
    this[11] = a23 * cosθ - a13 * sinθ

    return this
  }

  rotY (radians) {
    const sinθ = Math.sin(radians)
    const cosθ = Math.cos(radians)
    const a00 = this[0]
    const a01 = this[1]
    const a02 = this[2]
    const a03 = this[3]
    const a20 = this[8]
    const a21 = this[9]
    const a22 = this[10]
    const a23 = this[11]

    this[0] = a00 * cosθ - a20 * sinθ
    this[1] = a01 * cosθ - a21 * sinθ
    this[2] = a02 * cosθ - a22 * sinθ
    this[3] = a03 * cosθ - a23 * sinθ
    this[8] = a00 * sinθ + a20 * cosθ
    this[9] = a01 * sinθ + a21 * cosθ
    this[10] = a02 * sinθ + a22 * cosθ
    this[11] = a03 * sinθ + a23 * cosθ

    return this
  }



  rotZ (radians) {
    const sinθ = Math.sin(radians)
    const cosθ = Math.cos(radians)
    const a00 = this[0]
    const a01 = this[1]
    const a02 = this[2]
    const a03 = this[3]
    const a10 = this[4]
    const a11 = this[5]
    const a12 = this[6]
    const a13 = this[7]

    this[0] = a00 * cosθ + a10 * sinθ
    this[1] = a01 * cosθ + a11 * sinθ
    this[2] = a02 * cosθ + a12 * sinθ
    this[3] = a03 * cosθ + a13 * sinθ
    this[4] = a10 * cosθ - a00 * sinθ
    this[5] = a11 * cosθ - a01 * sinθ
    this[6] = a12 * cosθ - a02 * sinθ
    this[7] = a13 * cosθ - a03 * sinθ

    return this
  }
}

export default FourByFour
