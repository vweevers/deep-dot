'use strict'

var test = require('tape')
var { DeepDot } = require('./')
var deep = new DeepDot().get

test('get() undefined value', function(t){
  var o = { a: {b: 10} }
  t.is(deep(o, 'a.b.c'), undefined)
  t.ok(deep(o, 'a.b'))
  t.end()
})

test('get() invalid key throws', function(t){
  t.throws(deep)
  t.throws(function(){ deep({})})
  t.end()
})

test('get() array key', function(t){
  var o = { a: {b: 10} }
  t.notOk(deep(o, ['a', 'b', 'c']))
  t.ok(deep(o, ['a', 'b']))
  t.is(deep([1, 2, 3], [2]), 3)
  t.is(deep({ a: [20, 30] }, 'a.1'), 30)

  var key = ['a', 'b', 'c']
  deep(o, key)
  t.deepEqual(key, ['a', 'b', 'c'], 'does not mutate')
  t.end()
})

test('set() string key', function (t) {
  var o = { a: { b: 1 } }
  var dd = new DeepDot()

  dd.set(o, 'a.b', 2)
  t.same(o, { a: { b: 2 } })

  dd.set(o, 'a.b2', 3)
  t.same(o, { a: { b: 2, b2: 3 } })

  dd.set(o, 'a.b3.x', 3)
  t.same(o, { a: { b: 2, b2: 3, b3: { x: 3 } } })

  dd.set(o, 'a', [1, 2])
  t.same(o, { a: [1, 2] })

  dd.set(o, 'a.1', 3)
  t.same(o, { a: [1, 3] })

  // Doesn't automatically create arrays
  dd.set(o, 'b.1', 42)
  t.same(o, { a: [1, 3], b: { 1: 42 } })

  t.end()
})

test('set() array key', function (t) {
  var o = { a: { b: 1 } }
  var dd = new DeepDot()
  dd.set(o, ['a', 'b'], 2)
  t.same(o, { a: { b: 2 } })
  t.end()
})

test('set() cannot polute prototype', function (t) {
  var dd = new DeepDot()
  t.throws(() => dd.set({}, 'prototype', {}), { code: 'DEEP_DOT_UNSAFE_PROPERTY' })
  t.end()
})
