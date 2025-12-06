module.exports = deep

function deep (obj, prop) {
  const segments = typeof prop == 'string'
    ? prop.split('.')
    : prop

  let i = 0
  const last = segments.length - 1

  while (i <= last && obj != null) {
    obj = obj[segments[i++]]
  }

  return i <= last ? undefined : obj
}
