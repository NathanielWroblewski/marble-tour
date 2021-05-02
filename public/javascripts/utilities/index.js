import Vector from '../models/vector.js'

// Copyright (c) 2020 Nathaniel Wroblewski
// I am making my contributions/submissions to this project solely in my personal
// capacity and am not conveying any rights to any intellectual property of any
// third parties.

export const remap = (value, [oldmin, oldmax], [newmin, newmax]) => {
  return newmin + (newmax - newmin) * (value - oldmin) / (oldmax - oldmin)
}

export const grid = ({ from, to, by }, fn) => {
  const results = []

  for (let row = from.x; row < to.x; row += by.x) {
    for (let column = from.y; column < to.y; column += by.y) {
      const coordinates = Vector.from([row, column])

      results.push(fn ? fn(coordinates) : coordinates)
    }
  }

  return results
}

export const cube = ({ from, to, by }, fn) => {
  const results = []

  for (let row = from.x; row < to.x; row += by.x) {
    for (let column = from.y; column < to.y; column += by.y) {
      for (let depth = from.z; depth < to.z; depth += by.z) {
        const coordinates = Vector.from([row, column, depth])

        results.push(fn ? fn(coordinates) : coordinates)
      }
    }
  }

  return results
}

// Array#sort is unstable
export const stableSort = (array, compare) => {
  const list = array.map((value, index) => ({ value, index }))

  list.sort((a, b) => {
    const r = compare(a.value, b.value)

    return r == 0 ? a.index - b.index : r
  })

  return list.map(element => element.value)
}

export const clamp = (num, [min, max]) => Math.min(Math.max(num, min), max)
