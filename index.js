'use strict'

const ModuleError = require('module-error')

class DeepDot {
  constructor (options = null) {
    if (options?.cache !== false) {
      // Public by design
      this.cache = new Map()
      this.parse = this.parseCached
    } else {
      this.cache = null
      this.parse = this.parseUncached
    }
  }

  parseCached = (path) => {
    if (typeof path == 'string') {
      let segments = this.cache.get(path)

      if (segments === undefined) {
        segments = path.split('.')
        this.cache.set(path, segments)
      }

      return segments
    } else { // Assume it's an array for speed
      return path
    }
  }

  parseUncached = (path) => {
    return typeof path == 'string'
      ? path.split('.')
      : path
  }

  get = (target, path) => {
    let i = 0
    let value = target

    const segments = this.parse(path)
    const last = segments.length - 1

    while (i <= last && typeof value === 'object' && value !== null) {
      const segment = segments[i++]
      validateSegment(segment)
      value = value[segment]
    }

    return i <= last ? undefined : value
  }

  set = (target, path, value) => {
    if (typeof target !== 'object' || target === null) {
      throw new ModuleError('Target must be an object', {
        code: 'DEEP_DOT_NOT_AN_OBJECT'
      })
    }

    const segments = this.parse(path)
    const last = segments.length - 1

    let parent = target

    for (let i = 0; i <= last; i++) {
      const segment = segments[i]
      validateSegment(segment)

      if (typeof parent !== 'object') {
        throw new ModuleError('Leaf nodes can\'t have children', {
          code: 'DEEP_DOT_LEAF_NODE'
        })
      }

      if (i === last) {
        parent[segment] = value
        break
      }

      let child = parent[segment]

      if (child == null) {
        child = {}
        parent[segment] = child
      }

      parent = child
    }
  }
}

function validateSegment (segment) {
  if (typeof segment === 'number') {
    return
  }

  if (typeof segment !== 'string' || segment === '') {
    throw new ModuleError('Invalid property', {
      code: 'DEEP_DOT_INVALID_PROPERTY'
    })
  }

  if (segment === 'constructor' || segment === 'prototype' || segment === '__proto__') {
    throw new ModuleError('Unsafe property name', {
      code: 'DEEP_DOT_UNSAFE_PROPERTY'
    })
  }
}

exports.DeepDot = DeepDot
