'use strict'

const test = require('node:test')
const assert = require('assert')
const { DeepDot } = require('./')
const get = new DeepDot().get

test('get() undefined value', function () {
  const o = { a: { b: 10 } }
  assert.equal(get(o, 'a.b.c'), undefined)
  assert.ok(get(o, 'a.b'))
})

test('get() invalid target throws', function () {
  // @ts-expect-error
  assert.throws(get)
  // @ts-expect-error
  assert.throws(function () { get({}) })
})

test('get() invalid path throws', function () {
  assert.throws(() => get({}, ''), { code: 'DEEP_DOT_INVALID_PROPERTY' })
  assert.throws(() => get({}, []), { code: 'DEEP_DOT_EMPTY_PATH' })
})

test('get() array path', function () {
  const o = { a: { b: 10 } }
  assert.equal(get(o, ['a', 'b', 'c']), undefined)
  assert.equal(get(o, ['a', 'b']), 10)
  assert.equal(get([1, 2, 3], [2]), 3)
  assert.equal(get({ a: [20, 30] }, 'a.1'), 30)

  const path = ['a', 'b', 'c']
  get(o, path)
  assert.deepEqual(path, ['a', 'b', 'c'], 'does not mutate')
})

test('get() with offset', function () {
  const o = { a: { b: 1 }, b: 2 }
  assert.equal(get(o, ['a', 'b'], 0), 1)
  assert.equal(get(o, ['a', 'b'], 1), 2)
  assert.throws(() => get(o, ['a', 'b'], 2), { code: 'DEEP_DOT_EMPTY_PATH' })
})

test('set() string path', function () {
  const o = { a: { b: 1 } }
  const dd = new DeepDot()

  dd.set(o, 'a.b', 2)
  assert.deepEqual(o, { a: { b: 2 } })

  dd.set(o, 'a.b2', 3)
  assert.deepEqual(o, { a: { b: 2, b2: 3 } })

  dd.set(o, 'a.b3.x', 3)
  assert.deepEqual(o, { a: { b: 2, b2: 3, b3: { x: 3 } } })

  dd.set(o, 'a', [1, 2])
  assert.deepEqual(o, { a: [1, 2] })

  dd.set(o, 'a.1', 3)
  assert.deepEqual(o, { a: [1, 3] })

  // Doesn't automatically create arrays
  dd.set(o, 'b.1', 42)
  assert.deepEqual(o, { a: [1, 3], b: { 1: 42 } })
})

test('set() array path', function () {
  const o = { a: { b: 1 } }
  const dd = new DeepDot()
  dd.set(o, ['a', 'b'], 2)
  assert.deepEqual(o, { a: { b: 2 } })
})

test('set() with offset', function () {
  const o = { a: { b: 1 } }
  const dd = new DeepDot()
  dd.set(o, ['a', 'b'], 2, 0)
  assert.deepEqual(o, { a: { b: 2 } })
  dd.set(o, ['a', 'b'], 3, 1)
  assert.deepEqual(o, { a: { b: 2 }, b: 3 })
})

test('set() invalid path throws', function () {
  const dd = new DeepDot()
  assert.throws(() => dd.set({}, '', 1), { code: 'DEEP_DOT_INVALID_PROPERTY' })
  assert.throws(() => dd.set({}, [], 1), { code: 'DEEP_DOT_EMPTY_PATH' })
  assert.throws(() => dd.set({}, ['a'], 1, 1), { code: 'DEEP_DOT_EMPTY_PATH' })
})

test('set() cannot polute prototype', function () {
  const dd = new DeepDot()
  assert.throws(() => dd.set({}, 'prototype', {}), { code: 'DEEP_DOT_UNSAFE_PROPERTY' })
})
