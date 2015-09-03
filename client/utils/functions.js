
export function pickDeep(collection, ...rest) {
  let [ predicate, thisArg ] = rest
  if (typeof predicate === 'function') {
    predicate = predicate.bind(thisArg)
  } else {
    const keys = rest
    predicate = (key) => keys.includes(key)
  }

  return collection.reduce((memo, val, key) => {
    let include = predicate(key, val)
    if (!include && typeof val === 'object') {
      val = pickDeep(val, predicate)
      include = val !== undefined
    }

    if (include) {
      return memo.concat(val)
    }

    return memo
  }, [])
}

export const isDefined = (a) => a !== undefined
