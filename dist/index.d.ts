/**
 * Utility class to get and set nested properties of objects and arrays.
 */
export class DeepDot {
  /**
   * Create a new DeepDot instance.
   *
   * @param {object} [options] Options.
   * @param {boolean} [options.cache=true] Store parsed string paths to reduce
   * allocations.
   */
  constructor(options?: { cache?: boolean | undefined })
  /**
   * Cache of parsed paths.
   *
   * @type {Map<string, (string | number)[]>}
   */
  cache: Map<string, (string | number)[]>
  /**
   * Utility used by `get()` and `set()`. If the given `path` is a string
   * then it's parsed by `path.split('.')`, else it's assumed to be already
   * parsed and returned as-is.
   */
  parse: (path: string | (string | number)[]) => (string | number)[]
  /**
   * Variant of {@link parse()} that uses a cache.
   *
   * @param {string | (string | number)[]} path
   * @returns {(string | number)[]}
   */
  parseCached: (path: string | (string | number)[]) => (string | number)[]
  /**
   * Variant of {@link parse()} that does not use a cache.
   *
   * @param {string | (string | number)[]} path
   * @returns {(string | number)[]}
   */
  parseUncached: (path: string | (string | number)[]) => (string | number)[]
  /**
   * Get a nested property from `target` if not null or undefined. Returns
   * `undefined` if a property along the path does not exist, including when
   * `target` itself is null or undefined.
   *
   * @param {any} target
   * @param {string | (string | number)[]} path
   * @returns {any}
   */
  get: (target: any, path: string | (string | number)[]) => any
  /**
   * Set a nested property in `target`. If properties along the path don't exist
   * they will be created. If a property does exist but is not an object
   * (meaning it cannot have children) a `DEEP_DOT_LEAF_NODE` error will be
   * thrown. If `target` itself is null or not an object, a
   * `DEEP_DOT_NOT_AN_OBJECT` error will be thrown.
   *
   * @param {{}} target
   * @param {string | (string | number)[]} path
   * @param {any} value
   * @returns {void}
   */
  set: (target: {}, path: string | (string | number)[], value: any) => void
}
