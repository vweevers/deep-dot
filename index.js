class DeepDot {
  constructor (options = null) {
    if (options?.cache !== false) {
      this.cache = new Map()
      this.split = this.splitCached
    } else {
      this.cache = null
      this.split = this.splitUncached
    }
  }

  splitCached = (key) => {
    if (typeof key == 'string') {
      let result = this.cache.get(key)

      if (result === undefined) {
        result = key.split('.')
        this.cache.set(key, result)
      }

      return result
    } else { // Assume it's an array for speed
      return key
    }
  }

  splitUncached = (key) => {
    return typeof key == 'string'
      ? key.split('.')
      : key
  }

  get = (obj, key) => {
    let i = 0

    const segments = this.split(key)
    const last = segments.length - 1

    while (i <= last && typeof obj === 'object' && obj !== null) {
      obj = obj[segments[i++]]
    }

    return i <= last ? undefined : obj
  }
}

exports.DeepDot = DeepDot
