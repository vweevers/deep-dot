'use strict'

const ModuleError = require('module-error')

/**
 * Utility class to get and set nested properties of objects and arrays.
 */
class DeepDot {
  /**
   * Create a new DeepDot instance.
   *
   * @param {object} [options] Options.
   * @param {boolean} [options.cache=true] Store parsed string paths to reduce
   * allocations.
   */
  constructor (options = undefined) {
    /**
     * Cache of parsed paths.
     *
     * @type {Map<string, (string | number)[]>}
     */
    this.cache = new Map()

    if (options?.cache !== false) {
      /**
       * Utility used by `get()` and `set()`. If the given `path` is a string
       * then it's parsed by `path.split('.')`, else it's assumed to be already
       * parsed and returned as-is.
       */
      this.parse = this.parseCached
    } else {
      this.parse = this.parseUncached
    }
  }

  /**
   * Variant of {@link parse()} that uses a cache.
   *
   * @param {string | (string | number)[]} path
   * @returns {(string | number)[]}
   */
  parseCached = (path) => {
    if (typeof path === 'string') {
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

  /**
   * Variant of {@link parse()} that does not use a cache.
   *
   * @param {string | (string | number)[]} path
   * @returns {(string | number)[]}
   */
  parseUncached = (path) => {
    return typeof path === 'string'
      ? path.split('.')
      : path
  }

  /**
   * Get a nested property from `target` if not null or undefined. Returns
   * `undefined` if a property along the path does not exist, including when
   * `target` itself is null or undefined.
   *
   * The optional `offset` argument can be used to skip parts of the path.
   *
   * @param {any} target
   * @param {string | (string | number)[]} path
   * @param {number} [offset=0]
   * @returns {any}
   */
  get = (target, path, offset = 0) => {
    let i = offset
    let value = target

    const segments = this.parse(path)
    const last = segments.length - 1

    if (last < offset) {
      throw new ModuleError('Path is empty', {
        code: 'DEEP_DOT_EMPTY_PATH'
      })
    }

    while (i <= last && typeof value === 'object' && value !== null) {
      const segment = segments[i++]
      validateSegment(segment)
      value = value[segment]
    }

    return i <= last ? undefined : value
  }

  /**
   * Set a nested property in `target`. If properties along the path don't exist
   * they will be created. If a property does exist but is not an object
   * (meaning it cannot have children) a `DEEP_DOT_LEAF_NODE` error will be
   * thrown. If `target` itself is null or not an object, a
   * `DEEP_DOT_NOT_AN_OBJECT` error will be thrown.
   *
   * The optional `offset` argument can be used to skip parts of the path.
   *
   * @param {{}} target
   * @param {string | (string | number)[]} path
   * @param {any} value
   * @param {number} [offset=0]
   * @returns {void}
   */
  set = (target, path, value, offset = 0) => {
    if (typeof target !== 'object' || target === null) {
      throw new ModuleError('Target must be an object', {
        code: 'DEEP_DOT_NOT_AN_OBJECT'
      })
    }

    const segments = this.parse(path)
    const last = segments.length - 1

    if (last < offset) {
      throw new ModuleError('Path is empty', {
        code: 'DEEP_DOT_EMPTY_PATH'
      })
    }

    let parent = target

    for (let i = offset; i <= last; i++) {
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

/**
 * @param {string | number | undefined} segment
 * @returns {asserts segment is string | number}
 */
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
