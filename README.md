# deep-dot

Get a nested property of an object or array.

## examples

```js
const { DeepDot } = require('deep-dot')
const dd = new DeepDot()

var obj = {
  a: {
    b: {
      c: [6, '78']
    }
  }
}

// basic usage
console.log(dd.get(obj, 'a.b.c.0') === 6)
console.log(dd.get(obj, 'a.b.c.1') === 78)

// non existent
console.log(dd.get(obj, 'x.y') === undefined)

// array path
console.log(dd.get(obj, ['a', 'b']))
```

## install

With [npm](https://npmjs.org) do:

```
npm install deep-dot
```

## license

MIT
