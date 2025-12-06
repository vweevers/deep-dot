# deep-dot

**Get and set nested properties of objects and arrays.**

## Usage

```js
import { DeepDot } from 'deep-dot'
const dd = new DeepDot()

const obj = {
  a: {
    b: {
      c: [4, 8]
    }
  }
}

// Get
console.log(dd.get(obj, 'a.b.c.1') === 8)
console.log(dd.get(obj, 'x.y') === undefined)

// Get by array
console.log(dd.get(obj, ['a', 'b', 'c', 1]) === 8)

// Set
dd.set(obj, 'a.b.c.1', 9)
dd.set(obj, 'x.y', { beep: 'boop' })

// Set by array
dd.set(obj, ['a', 'b', 'c', 1], 9)
```

## API

### `dd = new DeepDot([options])`

Options:

- `cache` (boolean, default true): store parsed string paths to reduce allocations.

### `dd.get(target: any, path: string | Segment[], offset?: number): any`

Get a nested property from `target` if not null or undefined. Returns `undefined` if a property along the path does not exist, including when `target` itself is null or undefined. The type of `Segment` is `string | number`.

The optional `offset` argument can be used to skip parts of the path (cheaply; because the alternative would be to `slice()` and thus copy the array).

### `dd.set(target: {}, path: string | Segment[], value: any, offset?: number): void`

Set a nested property in `target`. If properties along the path don't exist they will be created. If a property does exist but is not an object (meaning it cannot have children) a `DEEP_DOT_LEAF_NODE` error will be thrown. If `target` itself is null or not an object, a `DEEP_DOT_NOT_AN_OBJECT` error will be thrown.

The optional `offset` argument can be used to skip parts of the path.

### `dd.parse(path: string | Segment[]): Segment[]`

Utility used by `get()` and `set()`. If the given `path` is a string then it's parsed by `path.split('.')`, else it's assumed to be already parsed and returned as-is.

### Errors

Errors thrown by the `DeepDot` class have a `code` property that is one of the following strings. Error codes will not change between major versions, but error messages will.

- `DEEP_DOT_INVALID_PROPERTY`: When `get()` or `set()` encounter a property name in a given `path` that is an empty string or not a string or number.
- `DEEP_DOT_UNSAFE_PROPERTY`: When `get()` or `set()` encounter a property name in a given `path` that equals `constructor`, `prototype` or `__proto__`, to prevent prototype pollution.
- `DEEP_DOT_NOT_AN_OBJECT`: When the `target` for `set()` is not an object.
- `DEEP_DOT_LEAF_NODE`: When an object property is not an object (and it's not the last property in a given `path`).
- `DEEP_DOT_EMPTY_PATH`: When `get()` or `set()` are given an empty path (or when `offset` makes it empty).

## Install

With [npm](https://npmjs.org) do:

```
npm install deep-dot
```

## License

[MIT](LICENSE)
