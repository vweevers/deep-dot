var test = require('tape')
var deep = require('./')

test('undefined value', function(t){
  var o = { a: {b: 10} }
  t.is(deep(o, 'a.b.c'), undefined)
  t.ok(deep(o, 'a.b'))
  t.end()
})

test('invalid prop throws', function(t){
  t.throws(deep)
  t.throws(function(){ deep({})})
  t.end()
})

test('array path', function(t){
  var o = { a: {b: 10} }
  t.notOk(deep(o, ['a', 'b', 'c']))
  t.ok(deep(o, ['a', 'b']))
  t.is(deep([1,2,3], [2]), 3)
  t.is(deep({ a: [20, 30] }, 'a.1'), 30)

  var path = ['a', 'b', 'c']
  deep(o, path)
  t.deepEqual(path, ['a', 'b', 'c'], 'does not mutate')
  t.end()
})
