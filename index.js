module.exports = deep

function deep (obj_, prop_) {
  // Ensure fn can be optimized
  if (arguments.length==1) var prop = obj_, obj = this
  else obj = obj_, prop = prop_

  if (typeof prop == 'string') var segs = prop.split('.')
  else if (!prop || !prop.slice) throw new Error('Invalid property')
  else segs = prop.slice()

  while (segs.length && obj != null) {
    obj = obj[segs.shift()]
  }

  return segs.length ? null : obj
}
