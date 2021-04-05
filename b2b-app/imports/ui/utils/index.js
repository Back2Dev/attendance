'use strict'
const _ = require('lodash')
const debug = require('debug')('b2b:utils')

// polarToCartesian convertor
export const p2c = function (centerX, centerY, radius, angleInDegrees) {
  let angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0

  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  }
}

export const describeArc = function (x, y, radius, startAngle, endAngle) {
  var start = p2c(x, y, radius, endAngle)
  var end = p2c(x, y, radius, startAngle)

  var largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1'

  var d = [
    'M',
    start.x,
    start.y,
    'A',
    radius,
    radius,
    0,
    largeArcFlag,
    0,
    end.x,
    end.y,
  ].join(' ')

  return d
}

// compares keys in prev/current props or state.
// returns false if prev/current are equal
export function shouldUpdate(prev, curr, keys) {
  return !keys.every((key) => {
    return prev[key] === curr[key]
  })
}
