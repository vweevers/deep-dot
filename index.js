module.exports = deep

function deep (obj, prop) {
  if (typeof prop == 'string') var segs = prop.split('.')
  else if (!prop || !prop.slice) throw new Error('Invalid property')
  else segs = prop.slice()

  while (segs.length && obj != null) {
    obj = obj[segs.shift()]
  }

  return segs.length ? undefined : obj
}
